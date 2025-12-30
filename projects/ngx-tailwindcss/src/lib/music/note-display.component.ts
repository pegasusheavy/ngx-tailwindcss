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

export type NoteDisplayVariant = 'default' | 'minimal' | 'led' | 'lcd' | 'meter';
export type NoteDisplaySize = 'sm' | 'md' | 'lg' | 'xl';

export interface DetectedNote {
  note: string; // C, C#, D, etc.
  octave: number;
  frequency: number; // Hz
  cents: number; // -50 to +50 deviation from perfect pitch
  confidence?: number; // 0-1 detection confidence
  timestamp: number;
}

export interface NoteHistoryEntry extends DetectedNote {
  id: number;
}

// Standard tuning frequencies (A4 = 440Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83,
  'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65,
  'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91,
  'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83,
  'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
  'C8': 4186.01,
};

const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Note Display component for showing detected/played notes
 *
 * @example
 * ```html
 * <tw-note-display [frequency]="440"></tw-note-display>
 * <tw-note-display [note]="detectedNote" [showHistory]="true"></tw-note-display>
 * ```
 */
@Component({
  selector: 'tw-note-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwNoteDisplayComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // Input modes - either provide frequency OR note object
  readonly frequency = input<number | null>(null);
  readonly note = input<DetectedNote | null>(null);

  // Manual note input (alternative to frequency/note)
  readonly noteName = input<string | null>(null);
  readonly octave = input<number | null>(null);

  // Display options
  readonly variant = input<NoteDisplayVariant>('default');
  readonly size = input<NoteDisplaySize>('md');
  readonly showFrequency = input(true);
  readonly showCents = input(true);
  readonly showOctave = input(true);
  readonly showIndicator = input(true); // Visual in-tune indicator
  readonly showHistory = input(false);
  readonly historyLength = input(8, { transform: numberAttribute });
  readonly referenceA4 = input(440, { transform: numberAttribute }); // Tuning reference
  readonly centsTolerance = input(10, { transform: numberAttribute }); // Cents range for "in tune"
  readonly classOverride = input('');

  // Outputs
  readonly noteChange = output<DetectedNote>();
  readonly inTune = output<boolean>();

  // Internal state
  protected readonly currentNote = signal<DetectedNote | null>(null);
  protected readonly noteHistory = signal<NoteHistoryEntry[]>([]);
  private historyIdCounter = 0;

  ngOnInit(): void {
    // Update note from frequency input periodically
    interval(50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateCurrentNote();
      });
  }

  private updateCurrentNote(): void {
    const freq = this.frequency();
    const noteInput = this.note();
    const manualNote = this.noteName();
    const manualOctave = this.octave();

    let detected: DetectedNote | null = null;

    if (noteInput) {
      detected = noteInput;
    } else if (freq && freq > 0) {
      detected = this.frequencyToNote(freq);
    } else if (manualNote && manualOctave !== null) {
      const noteFreq = NOTE_FREQUENCIES[`${manualNote}${manualOctave}`];
      if (noteFreq) {
        detected = {
          note: manualNote,
          octave: manualOctave,
          frequency: noteFreq,
          cents: 0,
          timestamp: Date.now(),
        };
      }
    }

    if (detected) {
      const current = this.currentNote();
      const isNewNote = !current ||
        current.note !== detected.note ||
        current.octave !== detected.octave;

      this.currentNote.set(detected);
      this.noteChange.emit(detected);

      // Check if in tune
      const isInTune = Math.abs(detected.cents) <= this.centsTolerance();
      this.inTune.emit(isInTune);

      // Add to history if new note
      if (isNewNote && this.showHistory()) {
        this.addToHistory(detected);
      }
    }
  }

  private frequencyToNote(freq: number): DetectedNote {
    const a4 = this.referenceA4();

    // Calculate semitones from A4
    const semitones = 12 * Math.log2(freq / a4);
    const roundedSemitones = Math.round(semitones);

    // Get note and octave
    const noteIndex = ((roundedSemitones % 12) + 12 + 9) % 12; // +9 because A is index 9
    const octave = Math.floor((roundedSemitones + 9) / 12) + 4;
    const note = ALL_NOTES[noteIndex];

    // Calculate cents deviation
    const exactFreq = a4 * Math.pow(2, roundedSemitones / 12);
    const cents = Math.round(1200 * Math.log2(freq / exactFreq));

    return {
      note,
      octave,
      frequency: freq,
      cents: Math.max(-50, Math.min(50, cents)),
      timestamp: Date.now(),
    };
  }

  private addToHistory(detected: DetectedNote): void {
    const entry: NoteHistoryEntry = {
      ...detected,
      id: this.historyIdCounter++,
    };

    this.noteHistory.update(history => {
      const newHistory = [entry, ...history];
      return newHistory.slice(0, this.historyLength());
    });
  }

  // Computed values
  protected readonly displayNote = computed(() => {
    const note = this.currentNote();
    if (!note) return '—';
    return note.note.replace('#', '♯');
  });

  protected readonly displayOctave = computed(() => {
    const note = this.currentNote();
    return note?.octave ?? '';
  });

  protected readonly displayFrequency = computed(() => {
    const note = this.currentNote();
    if (!note) return '— Hz';
    return `${note.frequency.toFixed(1)} Hz`;
  });

  protected readonly displayCents = computed(() => {
    const note = this.currentNote();
    if (!note) return '±0';
    const cents = note.cents;
    if (cents === 0) return '±0';
    return cents > 0 ? `+${cents}` : `${cents}`;
  });

  protected readonly isInTune = computed(() => {
    const note = this.currentNote();
    if (!note) return false;
    return Math.abs(note.cents) <= this.centsTolerance();
  });

  protected readonly isSharp = computed(() => {
    const note = this.currentNote();
    return note ? note.cents > this.centsTolerance() : false;
  });

  protected readonly isFlat = computed(() => {
    const note = this.currentNote();
    return note ? note.cents < -this.centsTolerance() : false;
  });

  protected readonly centsPosition = computed(() => {
    // Position from 0-100 where 50 is center (in tune)
    const note = this.currentNote();
    if (!note) return 50;
    return 50 + note.cents;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'flex flex-col items-center rounded-lg transition-colors';

    const variantClasses: Record<NoteDisplayVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      led: 'bg-black border border-slate-700 p-4',
      lcd: 'bg-lime-950 border-2 border-slate-600 p-4',
      meter: 'bg-slate-900 border border-slate-700 p-4',
    };

    const sizeClasses: Record<NoteDisplaySize, string> = {
      sm: 'gap-1 min-w-[100px]',
      md: 'gap-2 min-w-[140px]',
      lg: 'gap-3 min-w-[180px]',
      xl: 'gap-4 min-w-[220px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly noteClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const sizeClasses: Record<NoteDisplaySize, string> = {
      sm: 'text-3xl',
      md: 'text-5xl',
      lg: 'text-6xl',
      xl: 'text-7xl',
    };

    const variantClasses: Record<NoteDisplayVariant, string> = {
      default: 'text-white font-bold',
      minimal: 'text-slate-800 dark:text-white font-bold',
      led: 'text-red-500 font-mono font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      lcd: 'text-lime-400 font-mono font-bold',
      meter: 'text-amber-400 font-bold',
    };

    return [sizeClasses[size], variantClasses[variant]].join(' ');
  });

  protected readonly octaveClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const sizeClasses: Record<NoteDisplaySize, string> = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
    };

    const variantClasses: Record<NoteDisplayVariant, string> = {
      default: 'text-slate-400',
      minimal: 'text-slate-500 dark:text-slate-400',
      led: 'text-red-400/70',
      lcd: 'text-lime-500/70',
      meter: 'text-amber-500/70',
    };

    return [sizeClasses[size], variantClasses[variant], 'font-mono'].join(' ');
  });

  protected readonly frequencyClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<NoteDisplayVariant, string> = {
      default: 'text-slate-500',
      minimal: 'text-slate-600 dark:text-slate-400',
      led: 'text-red-400/60',
      lcd: 'text-lime-500/60',
      meter: 'text-slate-500',
    };

    return ['text-sm font-mono', variantClasses[variant]].join(' ');
  });

  protected readonly centsClasses = computed(() => {
    const inTune = this.isInTune();
    const sharp = this.isSharp();
    const flat = this.isFlat();

    if (inTune) return 'text-green-500';
    if (sharp) return 'text-amber-500';
    if (flat) return 'text-blue-500';
    return 'text-slate-500';
  });

  protected readonly indicatorColor = computed(() => {
    const inTune = this.isInTune();
    const sharp = this.isSharp();

    if (inTune) return 'bg-green-500';
    if (sharp) return 'bg-amber-500';
    return 'bg-blue-500';
  });

  // Public methods
  setFrequency(freq: number): void {
    const detected = this.frequencyToNote(freq);
    this.currentNote.set(detected);
    this.noteChange.emit(detected);

    if (this.showHistory()) {
      this.addToHistory(detected);
    }
  }

  setNote(note: string, octave: number): void {
    const freq = NOTE_FREQUENCIES[`${note}${octave}`];
    if (freq) {
      const detected: DetectedNote = {
        note,
        octave,
        frequency: freq,
        cents: 0,
        timestamp: Date.now(),
      };
      this.currentNote.set(detected);
      this.noteChange.emit(detected);

      if (this.showHistory()) {
        this.addToHistory(detected);
      }
    }
  }

  clearHistory(): void {
    this.noteHistory.set([]);
  }

  reset(): void {
    this.currentNote.set(null);
    this.noteHistory.set([]);
  }
}




