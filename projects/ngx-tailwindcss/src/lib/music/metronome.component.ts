import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject, switchMap, takeUntil, tap } from 'rxjs';

export type MetronomeVariant = 'default' | 'minimal' | 'pendulum' | 'digital';
export type MetronomeSize = 'sm' | 'md' | 'lg';
export type TimeSignature = '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8' | '12/8';

export interface MetronomeBeat {
  beat: number; // 1-based
  isAccent: boolean;
  timestamp: number;
}

@Component({
  selector: 'tw-metronome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metronome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwMetronomeComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  readonly bpm = input(120, { transform: numberAttribute });
  readonly timeSignature = input<TimeSignature>('4/4');
  readonly variant = input<MetronomeVariant>('default');
  readonly size = input<MetronomeSize>('md');
  readonly accentFirstBeat = input(true);
  readonly subdivisions = input(1, { transform: numberAttribute }); // 1 = quarter, 2 = eighth, 4 = sixteenth
  readonly showBpmControl = input(true);
  readonly showTimeSignature = input(true);
  readonly showVisualBeat = input(true);
  readonly autoStart = input(false);
  readonly disabled = input(false);
  readonly classOverride = input('');

  readonly beat = output<MetronomeBeat>();
  readonly bpmChange = output<number>();
  readonly playingChange = output<boolean>();
  readonly timeSignatureChange = output<TimeSignature>();

  protected readonly isPlaying = signal(false);
  protected readonly currentBeat = signal(0);
  protected readonly currentBpm = signal(120);
  protected readonly pendulumAngle = signal(0);
  protected readonly tapTimes = signal<number[]>([]);

  // Expose Math for template
  protected readonly Math = Math;

  private readonly stop$ = new Subject<void>();
  private audioContext: AudioContext | null = null;

  protected readonly beatsPerMeasure = computed(() => {
    const sig = this.timeSignature();
    return parseInt(sig.split('/')[0], 10);
  });

  protected readonly beatUnit = computed(() => {
    const sig = this.timeSignature();
    return parseInt(sig.split('/')[1], 10);
  });

  protected readonly beatIndicators = computed(() => {
    const count = this.beatsPerMeasure();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  protected readonly intervalMs = computed(() => {
    const bpm = this.currentBpm();
    const subs = this.subdivisions();
    return (60000 / bpm) / subs;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const baseClasses = 'flex flex-col items-center rounded-xl transition-colors';

    const variantClasses: Record<MetronomeVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      pendulum: 'bg-gradient-to-b from-amber-950 to-stone-900 border border-amber-800/50 p-6',
      digital: 'bg-black border border-slate-700 p-4',
    };

    const sizeClasses: Record<MetronomeSize, string> = {
      sm: 'gap-2 min-w-[150px]',
      md: 'gap-3 min-w-[200px]',
      lg: 'gap-4 min-w-[280px]',
    };

    return [baseClasses, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly bpmDisplayClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'font-mono font-bold tabular-nums';
    const variantClass = variant === 'digital' ? 'text-lime-400' : variant === 'pendulum' ? 'text-amber-400' : 'text-white';
    const sizeClass = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-4xl';

    return [base, variantClass, sizeClass].join(' ');
  });

  ngOnInit(): void {
    this.currentBpm.set(this.bpm());

    if (this.autoStart()) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
    this.audioContext?.close();
  }

  protected start(): void {
    if (this.isPlaying() || this.disabled()) return;

    this.isPlaying.set(true);
    this.currentBeat.set(0);
    this.playingChange.emit(true);

    // Initialize audio context for click sounds
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const beats = this.beatsPerMeasure();
    const subs = this.subdivisions();
    let subBeat = 0;

    interval(this.intervalMs())
      .pipe(
        takeUntil(this.stop$),
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          subBeat++;
          const isMainBeat = subBeat % subs === 1 || subs === 1;

          if (isMainBeat) {
            const beatNum = ((this.currentBeat() % beats) + 1);
            this.currentBeat.set(beatNum);

            const isAccent = this.accentFirstBeat() && beatNum === 1;

            // Play click sound
            this.playClick(isAccent);

            // Emit beat event
            this.beat.emit({
              beat: beatNum,
              isAccent,
              timestamp: Date.now(),
            });

            // Update pendulum angle
            if (this.variant() === 'pendulum') {
              this.pendulumAngle.set(beatNum % 2 === 0 ? 30 : -30);
            }
          }
        })
      )
      .subscribe();
  }

  protected stop(): void {
    this.isPlaying.set(false);
    this.currentBeat.set(0);
    this.pendulumAngle.set(0);
    this.stop$.next();
    this.playingChange.emit(false);
  }

  protected toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  protected onBpmInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (value >= 20 && value <= 300) {
      this.currentBpm.set(value);
      this.bpmChange.emit(value);

      // Restart if playing
      if (this.isPlaying()) {
        this.stop();
        this.start();
      }
    }
  }

  protected incrementBpm(amount: number): void {
    const newBpm = Math.max(20, Math.min(300, this.currentBpm() + amount));
    this.currentBpm.set(newBpm);
    this.bpmChange.emit(newBpm);

    if (this.isPlaying()) {
      this.stop();
      this.start();
    }
  }

  protected tapTempo(): void {
    const now = Date.now();
    const taps = this.tapTimes();
    const recentTaps = [...taps, now].filter((t) => now - t < 3000); // Keep only taps within last 3 seconds

    this.tapTimes.set(recentTaps);

    if (recentTaps.length >= 3) {
      // Calculate average interval
      const intervals: number[] = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);

      if (bpm >= 20 && bpm <= 300) {
        this.currentBpm.set(bpm);
        this.bpmChange.emit(bpm);

        if (this.isPlaying()) {
          this.stop();
          this.start();
        }
      }
    }
  }

  protected selectTimeSignature(sig: TimeSignature): void {
    this.timeSignatureChange.emit(sig);
    this.currentBeat.set(0);

    if (this.isPlaying()) {
      this.stop();
      this.start();
    }
  }

  private playClick(isAccent: boolean): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'sine';

    gainNode.gain.value = isAccent ? 0.5 : 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  protected readonly timeSignatures: TimeSignature[] = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '12/8'];
}

