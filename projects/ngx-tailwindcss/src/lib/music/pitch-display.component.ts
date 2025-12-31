import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export type PitchDisplayVariant =
  | 'default'
  | 'minimal'
  | 'digital'
  | 'wheel'
  | 'dj'
  | 'light'
  | 'highContrast';
export type PitchDisplaySize = 'sm' | 'md' | 'lg';
export type PitchBendStyle = 'vertical' | 'horizontal' | 'arc';

export interface PitchInfo {
  semitones: number; // -12 to +12 (or more)
  cents: number; // -50 to +50 fine tuning
  frequency: number; // Hz
  note: string; // Note name (C, C#, etc.)
  octave: number;
}

// Pitch shift presets
export const PITCH_PRESETS = {
  octaveUp: { semitones: 12, cents: 0, label: '+1 Oct' },
  octaveDown: { semitones: -12, cents: 0, label: '-1 Oct' },
  fifthUp: { semitones: 7, cents: 0, label: '+5th' },
  fifthDown: { semitones: -7, cents: 0, label: '-5th' },
  fourthUp: { semitones: 5, cents: 0, label: '+4th' },
  fourthDown: { semitones: -5, cents: 0, label: '-4th' },
  thirdUp: { semitones: 4, cents: 0, label: '+3rd' },
  thirdDown: { semitones: -4, cents: 0, label: '-3rd' },
  wholeStep: { semitones: 2, cents: 0, label: '+2' },
  halfStep: { semitones: 1, cents: 0, label: '+1' },
  zero: { semitones: 0, cents: 0, label: '0' },
};

/**
 * Pitch Display component for showing pitch shift/transposition information
 *
 * @example
 * ```html
 * <tw-pitch-display [semitones]="2" [cents]="15"></tw-pitch-display>
 * <tw-pitch-display [pitchBend]="0.5" variant="wheel"></tw-pitch-display>
 * ```
 */
@Component({
  selector: 'tw-pitch-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pitch-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwPitchDisplayComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // Expose Math for template use
  protected readonly Math = Math;

  // Configuration
  readonly variant = input<PitchDisplayVariant>('default');
  readonly size = input<PitchDisplaySize>('md');
  readonly semitones = input(0, { transform: numberAttribute }); // -24 to +24
  readonly cents = input(0, { transform: numberAttribute }); // -50 to +50
  readonly pitchBend = input(0, { transform: numberAttribute }); // -1 to +1 (for pitch wheel)
  readonly pitchBendRange = input(2, { transform: numberAttribute }); // Semitones range for pitch bend
  readonly pitchBendStyle = input<PitchBendStyle>('vertical'); // Visual style for pitch bend
  readonly keyLock = input(false); // When true, pitch shift maintains key
  readonly showSemitones = input(true);
  readonly showCents = input(true);
  readonly showPitchWheel = input(false);
  readonly showKeyLock = input(true);
  readonly showNotePreview = input(false); // Show resulting note from C
  readonly showPercentage = input(false); // Show pitch as percentage (+/- %)
  readonly showFrequencyRatio = input(false); // Show frequency ratio (e.g., 1.5x)
  readonly showPresets = input(false); // Show quick preset buttons
  readonly showMeter = input(true); // Show visual meter
  readonly showBendIndicator = input(true); // Show real-time bend position
  readonly referenceNote = input('C');
  readonly referenceOctave = input(4, { transform: numberAttribute });
  readonly referenceFrequency = input(261.63, { transform: numberAttribute }); // C4 = 261.63 Hz
  readonly animated = input(true); // Animate changes
  readonly snapToSemitone = input(false); // Snap pitch bend to nearest semitone
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Outputs
  readonly semitonesChange = output<number>();
  readonly centsChange = output<number>();
  readonly pitchBendChange = output<number>();
  readonly keyLockChange = output<boolean>();

  // Internal state
  protected readonly internalSemitones = signal(0);
  protected readonly internalCents = signal(0);
  protected readonly internalPitchBend = signal(0);
  protected readonly internalKeyLock = signal(false);
  protected readonly isDragging = signal(false);

  private dragStartY = 0;
  private dragStartValue = 0;

  ngOnInit(): void {
    // Sync initial values
    this.internalSemitones.set(this.semitones());
    this.internalCents.set(this.cents());
    this.internalPitchBend.set(this.pitchBend());
    this.internalKeyLock.set(this.keyLock());

    // Update internal state when inputs change
    interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.isDragging()) {
          this.internalSemitones.set(this.semitones());
          this.internalCents.set(this.cents());
          this.internalPitchBend.set(this.pitchBend());
          this.internalKeyLock.set(this.keyLock());
        }
      });
  }

  // Computed values
  protected readonly totalCents = computed(() => {
    return this.internalSemitones() * 100 + this.internalCents();
  });

  protected readonly effectivePitchBend = computed(() => {
    const bend = this.internalPitchBend();
    const range = this.pitchBendRange();
    return bend * range * 100; // In cents
  });

  protected readonly resultingNote = computed((): { note: string; octave: number } => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const refIndex = notes.indexOf(this.referenceNote());
    if (refIndex === -1) {
      return { note: this.referenceNote(), octave: this.referenceOctave() };
    }

    const semitones = this.internalSemitones();
    const newIndex = (((refIndex + semitones) % 12) + 12) % 12;
    const octaveChange = Math.floor((refIndex + semitones) / 12);

    return {
      note: notes[newIndex],
      octave: this.referenceOctave() + octaveChange,
    };
  });

  protected readonly semitonesDisplay = computed(() => {
    const st = this.internalSemitones();
    if (st === 0) return '0';
    return st > 0 ? `+${st}` : `${st}`;
  });

  protected readonly centsDisplay = computed(() => {
    const c = this.internalCents();
    if (c === 0) return '±0';
    return c > 0 ? `+${c}` : `${c}`;
  });

  protected readonly pitchWheelPosition = computed(() => {
    // 0 = center (50%), -1 = bottom (0%), +1 = top (100%)
    const bend = this.internalPitchBend();
    return 50 - bend * 50;
  });

  // Pitch as percentage (for DJ displays)
  protected readonly pitchPercentage = computed(() => {
    const totalCents = this.totalCents();
    // 100 cents = 1 semitone, 1200 cents = 1 octave = ~100% (for reference)
    // In DJ terms, typically shown as +/- 8%, 16%, etc. from original pitch
    const percentage = (totalCents / 1200) * 100;
    return percentage;
  });

  protected readonly pitchPercentageDisplay = computed(() => {
    const pct = this.pitchPercentage();
    if (Math.abs(pct) < 0.01) return '0.00%';
    return `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;
  });

  // Frequency ratio (useful for music theory)
  protected readonly frequencyRatio = computed(() => {
    const totalCents = this.totalCents();
    // Ratio = 2^(cents/1200)
    return Math.pow(2, totalCents / 1200);
  });

  protected readonly frequencyRatioDisplay = computed(() => {
    const ratio = this.frequencyRatio();
    if (Math.abs(ratio - 1) < 0.001) return '1.000×';
    return `${ratio.toFixed(3)}×`;
  });

  // Actual output frequency
  protected readonly outputFrequency = computed(() => {
    return this.referenceFrequency() * this.frequencyRatio();
  });

  // Interval name for the current semitone offset
  protected readonly intervalName = computed(() => {
    const st = Math.abs(this.internalSemitones());
    const names: Record<number, string> = {
      0: 'Unison',
      1: 'Minor 2nd',
      2: 'Major 2nd',
      3: 'Minor 3rd',
      4: 'Major 3rd',
      5: 'Perfect 4th',
      6: 'Tritone',
      7: 'Perfect 5th',
      8: 'Minor 6th',
      9: 'Major 6th',
      10: 'Minor 7th',
      11: 'Major 7th',
      12: 'Octave',
    };
    if (st > 12) {
      const octaves = Math.floor(st / 12);
      const remaining = st % 12;
      return `${octaves} Oct + ${names[remaining] || remaining + ' st'}`;
    }
    return names[st] || `${st} semitones`;
  });

  // Pitch bend arc position (for arc-style display)
  protected readonly pitchBendArcAngle = computed(() => {
    // -1 = -90deg, 0 = 0deg, +1 = 90deg
    return this.internalPitchBend() * 90;
  });

  // Color indicator based on pitch direction
  protected readonly pitchDirectionClass = computed(() => {
    const total = this.totalCents();
    if (total > 0) return 'text-amber-400'; // Sharp/up
    if (total < 0) return 'text-blue-400'; // Flat/down
    return 'text-slate-400'; // Neutral
  });

  // Presets for quick access
  protected readonly PITCH_PRESETS = PITCH_PRESETS;

  // Interaction handlers
  protected onSemitonesUp(): void {
    if (this.disabled()) return;
    const newValue = Math.min(24, this.internalSemitones() + 1);
    this.internalSemitones.set(newValue);
    this.semitonesChange.emit(newValue);
  }

  protected onSemitonesDown(): void {
    if (this.disabled()) return;
    const newValue = Math.max(-24, this.internalSemitones() - 1);
    this.internalSemitones.set(newValue);
    this.semitonesChange.emit(newValue);
  }

  protected onCentsChange(value: number): void {
    if (this.disabled()) return;
    const clamped = Math.max(-50, Math.min(50, value));
    this.internalCents.set(clamped);
    this.centsChange.emit(clamped);
  }

  protected onPitchWheelDragStart(event: MouseEvent | TouchEvent): void {
    if (this.disabled()) return;
    this.isDragging.set(true);
    this.dragStartY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.dragStartValue = this.internalPitchBend();

    document.addEventListener('mousemove', this.onPitchWheelDrag);
    document.addEventListener('mouseup', this.onPitchWheelDragEnd);
    document.addEventListener('touchmove', this.onPitchWheelDrag);
    document.addEventListener('touchend', this.onPitchWheelDragEnd);
  }

  private onPitchWheelDrag = (event: MouseEvent | TouchEvent): void => {
    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const delta = (this.dragStartY - currentY) / 100; // Normalize
    const newValue = Math.max(-1, Math.min(1, this.dragStartValue + delta));
    this.internalPitchBend.set(newValue);
    this.pitchBendChange.emit(newValue);
  };

  private onPitchWheelDragEnd = (): void => {
    this.isDragging.set(false);
    // Snap back to center if close
    if (Math.abs(this.internalPitchBend()) < 0.1) {
      this.internalPitchBend.set(0);
      this.pitchBendChange.emit(0);
    }

    document.removeEventListener('mousemove', this.onPitchWheelDrag);
    document.removeEventListener('mouseup', this.onPitchWheelDragEnd);
    document.removeEventListener('touchmove', this.onPitchWheelDrag);
    document.removeEventListener('touchend', this.onPitchWheelDragEnd);
  };

  protected toggleKeyLock(): void {
    if (this.disabled()) return;
    const newValue = !this.internalKeyLock();
    this.internalKeyLock.set(newValue);
    this.keyLockChange.emit(newValue);
  }

  protected resetSemitones(): void {
    if (this.disabled()) return;
    this.internalSemitones.set(0);
    this.semitonesChange.emit(0);
  }

  protected resetCents(): void {
    if (this.disabled()) return;
    this.internalCents.set(0);
    this.centsChange.emit(0);
  }

  protected resetPitchBend(): void {
    if (this.disabled()) return;
    this.internalPitchBend.set(0);
    this.pitchBendChange.emit(0);
  }

  // Public methods
  setSemitones(value: number): void {
    const clamped = Math.max(-24, Math.min(24, value));
    this.internalSemitones.set(clamped);
    this.semitonesChange.emit(clamped);
  }

  setCents(value: number): void {
    const clamped = Math.max(-50, Math.min(50, value));
    this.internalCents.set(clamped);
    this.centsChange.emit(clamped);
  }

  setPitchBend(value: number): void {
    const clamped = Math.max(-1, Math.min(1, value));
    this.internalPitchBend.set(clamped);
    this.pitchBendChange.emit(clamped);
  }

  reset(): void {
    this.internalSemitones.set(0);
    this.internalCents.set(0);
    this.internalPitchBend.set(0);
    this.semitonesChange.emit(0);
    this.centsChange.emit(0);
    this.pitchBendChange.emit(0);
  }

  applyPreset(preset: { semitones: number; cents: number }): void {
    if (this.disabled()) return;
    this.internalSemitones.set(preset.semitones);
    this.internalCents.set(preset.cents);
    this.semitonesChange.emit(preset.semitones);
    this.centsChange.emit(preset.cents);
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'flex flex-col rounded-lg transition-colors';

    const variantClasses: Record<PitchDisplayVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      digital: 'bg-black border border-slate-600 p-4',
      wheel: 'bg-slate-900 border border-slate-700 p-4',
      dj: 'bg-gradient-to-b from-slate-900 to-black border border-cyan-900 p-4',
      light: 'bg-white border border-slate-200 shadow-sm p-4',
      highContrast: 'bg-black border-2 border-white p-4',
    };

    const sizeClasses: Record<PitchDisplaySize, string> = {
      sm: 'gap-2 min-w-[120px]',
      md: 'gap-3 min-w-[160px]',
      lg: 'gap-4 min-w-[200px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly semitonesValueClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const sizeClasses: Record<PitchDisplaySize, string> = {
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl',
    };

    const variantClasses: Record<PitchDisplayVariant, string> = {
      default: 'text-white font-bold',
      minimal: 'text-slate-700 dark:text-white font-bold',
      digital: 'text-green-400 font-mono font-bold',
      wheel: 'text-blue-400 font-bold',
      dj: 'text-cyan-400 font-mono font-bold',
      light: 'text-blue-600 font-bold',
      highContrast: 'text-yellow-400 font-bold',
    };

    return [sizeClasses[size], variantClasses[variant]].join(' ');
  });

  protected readonly centsValueClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<PitchDisplayVariant, string> = {
      default: 'text-slate-400 font-mono',
      minimal: 'text-slate-600 dark:text-slate-400 font-mono',
      digital: 'text-green-500/70 font-mono',
      wheel: 'text-slate-400 font-mono',
      dj: 'text-cyan-500/70 font-mono',
      light: 'text-slate-500 font-mono',
      highContrast: 'text-white font-mono',
    };

    return variantClasses[variant];
  });
}
