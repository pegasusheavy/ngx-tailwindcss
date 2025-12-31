import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TunerVariant = 'default' | 'minimal' | 'analog' | 'strobe';
export type TunerMode = 'chromatic' | 'guitar' | 'bass' | 'ukulele' | 'violin';

export interface TuningData {
  frequency: number;
  note: string;
  octave: number;
  cents: number; // -50 to +50
  inTune: boolean;
}

// Standard tuning frequencies for different instruments
const GUITAR_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
const BASS_TUNING = ['E1', 'A1', 'D2', 'G2'];
const UKULELE_TUNING = ['G4', 'C4', 'E4', 'A4'];
const VIOLIN_TUNING = ['G3', 'D4', 'A4', 'E5'];

// Note frequencies (A4 = 440Hz)
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

@Component({
  selector: 'tw-tuner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tuner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwTunerComponent implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  readonly variant = input<TunerVariant>('default');
  readonly mode = input<TunerMode>('chromatic');
  readonly referenceFrequency = input(440, { transform: numberAttribute }); // A4 reference
  readonly tolerance = input(5, { transform: numberAttribute }); // Cents tolerance for "in tune"
  readonly showFrequency = input(true);
  readonly showOctave = input(true);
  readonly showCents = input(true);
  readonly showMeter = input(true);
  readonly showStringSelector = input(true);
  readonly autoStart = input(false);
  readonly classOverride = input('');

  readonly tuningChange = output<TuningData>();
  readonly inTune = output<boolean>();

  protected readonly isListening = signal(false);
  protected readonly currentFrequency = signal(0);
  protected readonly currentNote = signal('--');
  protected readonly currentOctave = signal(4);
  protected readonly currentCents = signal(0);
  protected readonly selectedString = signal(0); // For instrument modes

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private dataArray: Float32Array<ArrayBuffer> | null = null;

  protected readonly isInTune = computed(() => {
    const cents = Math.abs(this.currentCents());
    return cents <= this.tolerance();
  });

  protected readonly tuningStrings = computed(() => {
    const mode = this.mode();
    switch (mode) {
      case 'guitar':
        return GUITAR_TUNING;
      case 'bass':
        return BASS_TUNING;
      case 'ukulele':
        return UKULELE_TUNING;
      case 'violin':
        return VIOLIN_TUNING;
      default:
        return [];
    }
  });

  protected readonly meterPosition = computed(() => {
    // -50 to +50 cents mapped to 0-100%
    const cents = this.currentCents();
    return Math.max(0, Math.min(100, (cents + 50) * 1));
  });

  protected readonly meterColor = computed(() => {
    const cents = Math.abs(this.currentCents());
    const tolerance = this.tolerance();

    if (cents <= tolerance) return '#22C55E'; // Green - in tune
    if (cents <= tolerance * 2) return '#EAB308'; // Yellow - close
    return '#EF4444'; // Red - out of tune
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const base = 'rounded-xl p-6 flex flex-col items-center gap-4';

    const variantClasses: Record<TunerVariant, string> = {
      default: 'bg-slate-900 border border-slate-700',
      minimal: 'bg-transparent',
      analog: 'bg-gradient-to-b from-amber-950 to-stone-950 border-2 border-amber-800/50',
      strobe: 'bg-black border border-slate-800',
    };

    return [base, variantClasses[variant], this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly noteDisplayClasses = computed(() => {
    const variant = this.variant();
    const base = 'font-mono font-bold';
    const size = 'text-6xl';

    const colorClasses: Record<TunerVariant, string> = {
      default: this.isInTune() ? 'text-green-400' : 'text-white',
      minimal: this.isInTune() ? 'text-green-600' : 'text-slate-800 dark:text-slate-200',
      analog: this.isInTune() ? 'text-green-400' : 'text-amber-400',
      strobe: this.isInTune() ? 'text-green-400' : 'text-white',
    };

    return [base, size, colorClasses[variant]].join(' ');
  });

  protected readonly centsDisplayClasses = computed(() => {
    const cents = this.currentCents();
    const base = 'font-mono text-lg';

    if (cents < -this.tolerance()) return `${base} text-blue-400`;
    if (cents > this.tolerance()) return `${base} text-red-400`;
    return `${base} text-green-400`;
  });

  ngAfterViewInit(): void {
    if (this.autoStart()) {
      this.startListening();
    }
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  async startListening(): Promise<void> {
    if (this.isListening()) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 4096;

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      this.dataArray = new Float32Array(this.analyser.fftSize) as Float32Array<ArrayBuffer>;
      this.isListening.set(true);

      this.detectPitch();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  stopListening(): void {
    this.isListening.set(false);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;
  }

  protected toggleListening(): void {
    if (this.isListening()) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private detectPitch(): void {
    if (!this.isListening() || !this.analyser || !this.dataArray) return;

    this.analyser.getFloatTimeDomainData(this.dataArray);
    const frequency = this.autoCorrelate(this.dataArray, this.audioContext!.sampleRate);

    if (frequency > 0) {
      this.currentFrequency.set(Math.round(frequency * 10) / 10);

      const noteData = this.frequencyToNote(frequency);
      this.currentNote.set(noteData.note);
      this.currentOctave.set(noteData.octave);
      this.currentCents.set(noteData.cents);

      const tuningData: TuningData = {
        frequency,
        note: noteData.note,
        octave: noteData.octave,
        cents: noteData.cents,
        inTune: Math.abs(noteData.cents) <= this.tolerance(),
      };

      this.tuningChange.emit(tuningData);
      this.inTune.emit(tuningData.inTune);
    }

    this.animationFrameId = requestAnimationFrame(() => this.detectPitch());
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    // Simple autocorrelation-based pitch detection
    const size = buffer.length;
    let maxSamples = Math.floor(size / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let foundGoodCorrelation = false;

    // Find the RMS of the signal
    let rms = 0;
    for (let i = 0; i < size; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);

    // Not enough signal
    if (rms < 0.01) return -1;

    let lastCorrelation = 1;
    for (let offset = 0; offset < maxSamples; offset++) {
      let correlation = 0;

      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      correlation = 1 - correlation / maxSamples;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        break;
      }

      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01 && bestOffset > 0) {
      return sampleRate / bestOffset;
    }

    return -1;
  }

  private frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
    const refFreq = this.referenceFrequency();
    const semitonesFromA4 = 12 * Math.log2(frequency / refFreq);
    const nearestSemitone = Math.round(semitonesFromA4);
    const cents = Math.round((semitonesFromA4 - nearestSemitone) * 100);

    // A4 is the 9th note (index 9) in octave 4
    const noteIndex = ((nearestSemitone % 12) + 12 + 9) % 12;
    const octave = 4 + Math.floor((nearestSemitone + 9) / 12);

    return {
      note: NOTE_NAMES[noteIndex],
      octave,
      cents,
    };
  }

  protected selectString(index: number): void {
    this.selectedString.set(index);
  }

  protected getExpectedFrequency(noteName: string): number {
    // Parse note name like "E2" into note and octave
    const match = noteName.match(/([A-G]#?)(\d)/);
    if (!match) return 0;

    const note = match[1];
    const octave = parseInt(match[2], 10);

    const noteIndex = NOTE_NAMES.indexOf(note);
    if (noteIndex === -1) return 0;

    // Calculate semitones from A4
    const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
    return this.referenceFrequency() * Math.pow(2, semitonesFromA4 / 12);
  }
}
