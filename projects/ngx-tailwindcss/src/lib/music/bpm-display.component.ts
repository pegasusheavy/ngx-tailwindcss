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
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export type BpmDisplayVariant = 'default' | 'minimal' | 'led' | 'digital' | 'analog' | 'light' | 'highContrast';
export type BpmDisplaySize = 'sm' | 'md' | 'lg' | 'xl';
export type BpmSyncStatus = 'disconnected' | 'searching' | 'synced' | 'master';

// Common BPM ranges for presets
export const BPM_RANGES = {
  full: { min: 20, max: 300, label: 'Full Range' },
  slow: { min: 40, max: 90, label: 'Slow' },
  medium: { min: 90, max: 140, label: 'Medium' },
  fast: { min: 140, max: 200, label: 'Fast' },
  extremeFast: { min: 200, max: 300, label: 'Extreme' },
  dnb: { min: 160, max: 180, label: 'DnB' },
  house: { min: 120, max: 130, label: 'House' },
  techno: { min: 130, max: 150, label: 'Techno' },
  hiphop: { min: 80, max: 115, label: 'Hip-Hop' },
};

/**
 * BPM Display component for showing and controlling tempo
 *
 * @example
 * ```html
 * <tw-bpm-display [bpm]="120"></tw-bpm-display>
 * <tw-bpm-display [bpm]="tempo" (bpmChange)="onTempoChange($event)" [showTapTempo]="true"></tw-bpm-display>
 * ```
 */
@Component({
  selector: 'tw-bpm-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bpm-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwBpmDisplayComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // Configuration
  readonly variant = input<BpmDisplayVariant>('default');
  readonly size = input<BpmDisplaySize>('md');
  readonly bpm = input(120, { transform: numberAttribute });
  readonly minBpm = input(20, { transform: numberAttribute });
  readonly maxBpm = input(300, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly fineStep = input(0.1, { transform: numberAttribute }); // For fine-tune mode
  readonly showSlider = input(false);
  readonly showSliderMarks = input(true); // Show tick marks on slider
  readonly showSliderValue = input(true); // Show current value on slider track
  readonly showTapTempo = input(true);
  readonly showHalfDouble = input(true);
  readonly showTripleQuarter = input(false); // x3 and /3 buttons
  readonly showSync = input(false);
  readonly showBeatIndicator = input(false);
  readonly showTempoMarking = input(false); // Always show tempo marking (not just analog)
  readonly showMsPerBeat = input(false); // Show ms per beat
  readonly syncEnabled = input(false);
  readonly syncStatus = input<BpmSyncStatus>('disconnected');
  readonly syncSource = input<string | null>(null); // e.g., "MIDI", "Host", "Link"
  readonly syncBpm = input<number | null>(null); // External sync BPM (if different)
  readonly editable = input(true);
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Outputs
  readonly bpmChange = output<number>();
  readonly tapTempo = output<number>(); // Emits calculated BPM from taps
  readonly syncChange = output<boolean>();

  // Internal state
  protected readonly internalBpm = signal(120);
  protected readonly isSynced = signal(false);
  protected readonly tapTimes = signal<number[]>([]);
  protected readonly isEditing = signal(false);
  protected readonly editValue = signal('120');
  protected readonly beatActive = signal(false);

  private beatInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Sync with input
    this.internalBpm.set(this.bpm());
    this.isSynced.set(this.syncEnabled());

    interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.isEditing()) {
          this.internalBpm.set(this.bpm());
          this.isSynced.set(this.syncEnabled());
        }
      });

    // Start beat indicator if enabled
    if (this.showBeatIndicator()) {
      this.startBeatIndicator();
    }
  }

  private startBeatIndicator(): void {
    this.updateBeatInterval();
  }

  private updateBeatInterval(): void {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
    }

    const bpm = this.internalBpm();
    const intervalMs = (60 / bpm) * 1000;

    this.beatInterval = setInterval(() => {
      this.beatActive.set(true);
      setTimeout(() => this.beatActive.set(false), 100);
    }, intervalMs);
  }

  // BPM controls
  protected onBpmInput(event: Event): void {
    if (this.disabled() || !this.editable()) return;
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.setBpm(value);
  }

  protected onSliderChange(event: Event): void {
    if (this.disabled() || !this.editable()) return;
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.setBpm(value);
  }

  protected incrementBpm(amount: number): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.max(this.minBpm(), Math.min(this.maxBpm(), this.internalBpm() + amount));
    this.setBpm(newBpm);
  }

  protected halfTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.max(this.minBpm(), Math.round(this.internalBpm() / 2));
    this.setBpm(newBpm);
  }

  protected doubleTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.min(this.maxBpm(), Math.round(this.internalBpm() * 2));
    this.setBpm(newBpm);
  }

  protected tripleTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.min(this.maxBpm(), Math.round(this.internalBpm() * 3));
    this.setBpm(newBpm);
  }

  protected thirdTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.max(this.minBpm(), Math.round(this.internalBpm() / 3));
    this.setBpm(newBpm);
  }

  protected quarterTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.max(this.minBpm(), Math.round(this.internalBpm() / 4));
    this.setBpm(newBpm);
  }

  protected quadrupleTempo(): void {
    if (this.disabled() || !this.editable()) return;
    const newBpm = Math.min(this.maxBpm(), Math.round(this.internalBpm() * 4));
    this.setBpm(newBpm);
  }

  protected onTap(): void {
    if (this.disabled() || !this.editable()) return;

    const now = Date.now();
    const taps = this.tapTimes();

    // Reset if last tap was more than 2 seconds ago
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      this.tapTimes.set([now]);
      return;
    }

    // Add tap and keep last 8 taps
    const newTaps = [...taps, now].slice(-8);
    this.tapTimes.set(newTaps);

    // Calculate BPM from at least 2 taps
    if (newTaps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      const clampedBpm = Math.max(this.minBpm(), Math.min(this.maxBpm(), calculatedBpm));

      this.setBpm(clampedBpm);
      this.tapTempo.emit(clampedBpm);
    }
  }

  protected toggleSync(): void {
    if (this.disabled()) return;
    const newState = !this.isSynced();
    this.isSynced.set(newState);
    this.syncChange.emit(newState);
  }

  protected startEditing(): void {
    if (this.disabled() || !this.editable()) return;
    this.isEditing.set(true);
    this.editValue.set(this.internalBpm().toString());
  }

  protected finishEditing(): void {
    const value = parseInt(this.editValue(), 10);
    if (!isNaN(value)) {
      this.setBpm(value);
    }
    this.isEditing.set(false);
  }

  protected onEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.finishEditing();
    } else if (event.key === 'Escape') {
      this.isEditing.set(false);
      this.editValue.set(this.internalBpm().toString());
    }
  }

  private setBpm(value: number): void {
    const clamped = Math.max(this.minBpm(), Math.min(this.maxBpm(), value));
    this.internalBpm.set(clamped);
    this.bpmChange.emit(clamped);

    if (this.showBeatIndicator()) {
      this.updateBeatInterval();
    }
  }

  // Public methods
  setBpmValue(value: number): void {
    this.setBpm(value);
  }

  reset(): void {
    this.setBpm(120);
    this.tapTimes.set([]);
  }

  // Computed values
  protected readonly bpmDisplay = computed(() => {
    return this.internalBpm().toString().padStart(3, ' ');
  });

  protected readonly tempoMarking = computed(() => {
    const bpm = this.internalBpm();
    if (bpm < 40) return 'Grave';
    if (bpm < 60) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 156) return 'Allegro';
    if (bpm < 176) return 'Vivace';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
  });

  protected readonly tapCount = computed(() => {
    return this.tapTimes().length;
  });

  // Milliseconds per beat
  protected readonly msPerBeat = computed(() => {
    return Math.round(60000 / this.internalBpm());
  });

  // Beats per second
  protected readonly beatsPerSecond = computed(() => {
    return (this.internalBpm() / 60).toFixed(2);
  });

  // Slider percentage (0-100)
  protected readonly sliderPercent = computed(() => {
    const min = this.minBpm();
    const max = this.maxBpm();
    const current = this.internalBpm();
    return ((current - min) / (max - min)) * 100;
  });

  // Slider marks for common tempo points
  protected readonly sliderMarks = computed(() => {
    const min = this.minBpm();
    const max = this.maxBpm();
    const marks: { value: number; label: string; percent: number }[] = [];

    // Add standard tempo points that are within range
    const standardPoints = [60, 80, 100, 120, 140, 160, 180, 200];
    for (const point of standardPoints) {
      if (point >= min && point <= max) {
        marks.push({
          value: point,
          label: point.toString(),
          percent: ((point - min) / (max - min)) * 100,
        });
      }
    }

    return marks;
  });

  // Sync status indicator
  protected readonly syncStatusClass = computed(() => {
    const status = this.syncStatus();
    return {
      disconnected: 'bg-slate-600 text-slate-400',
      searching: 'bg-yellow-500 text-yellow-900 animate-pulse',
      synced: 'bg-green-500 text-white',
      master: 'bg-blue-500 text-white',
    }[status];
  });

  protected readonly syncStatusIcon = computed(() => {
    const status = this.syncStatus();
    return {
      disconnected: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
      searching: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      synced: 'M5 13l4 4L19 7',
      master: 'M13 10V3L4 14h7v7l9-11h-7z',
    }[status];
  });

  protected readonly syncStatusText = computed(() => {
    const status = this.syncStatus();
    const source = this.syncSource();
    return {
      disconnected: 'Not synced',
      searching: 'Searching...',
      synced: source ? `Synced to ${source}` : 'Synced',
      master: 'Master',
    }[status];
  });

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'flex flex-col items-center rounded-lg';

    const variantClasses: Record<BpmDisplayVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      led: 'bg-black border border-slate-600 p-4',
      digital: 'bg-slate-900 border border-slate-600 p-4',
      analog: 'bg-gradient-to-b from-amber-900/30 to-slate-900 border border-amber-800/50 p-4',
      light: 'bg-white border border-slate-200 shadow-sm p-4',
      highContrast: 'bg-black border-2 border-white p-4',
    };

    const sizeClasses: Record<BpmDisplaySize, string> = {
      sm: 'gap-2 min-w-[100px]',
      md: 'gap-3 min-w-[140px]',
      lg: 'gap-4 min-w-[180px]',
      xl: 'gap-4 min-w-[220px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly bpmValueClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const sizeClasses: Record<BpmDisplaySize, string> = {
      sm: 'text-3xl',
      md: 'text-4xl',
      lg: 'text-5xl',
      xl: 'text-6xl',
    };

    const variantClasses: Record<BpmDisplayVariant, string> = {
      default: 'text-white font-bold font-mono',
      minimal: 'text-slate-800 dark:text-white font-bold font-mono',
      led: 'text-red-500 font-mono font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      digital: 'text-cyan-400 font-mono font-bold',
      analog: 'text-amber-400 font-serif font-bold',
      light: 'text-blue-600 font-bold font-mono',
      highContrast: 'text-yellow-400 font-bold font-mono',
    };

    return [sizeClasses[size], variantClasses[variant]].join(' ');
  });

  protected readonly labelClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<BpmDisplayVariant, string> = {
      default: 'text-slate-500',
      minimal: 'text-slate-600 dark:text-slate-400',
      led: 'text-red-400/60',
      digital: 'text-cyan-500/60',
      analog: 'text-amber-600/80',
      light: 'text-slate-500',
      highContrast: 'text-white',
    };

    return ['text-xs uppercase tracking-wider', variantClasses[variant]].join(' ');
  });

  protected readonly buttonClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<BpmDisplayVariant, string> = {
      default: 'bg-slate-700 hover:bg-slate-600 text-white',
      minimal: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white',
      led: 'bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-900/50',
      digital: 'bg-slate-800 hover:bg-slate-700 text-cyan-400',
      analog: 'bg-amber-900/50 hover:bg-amber-800/50 text-amber-300 border border-amber-700/50',
      light: 'bg-blue-600 hover:bg-blue-700 text-white',
      highContrast: 'bg-white hover:bg-yellow-400 text-black border-2 border-white',
    };

    return ['px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50', variantClasses[variant]].join(' ');
  });
}

