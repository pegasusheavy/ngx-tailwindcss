import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type MetronomeVariant = 'default' | 'minimal' | 'pendulum' | 'digital';
export type MetronomeSize = 'sm' | 'md' | 'lg';
export type TimeSignature = '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8' | '12/8';
export type AccentLevel = 'none' | 'soft' | 'medium' | 'strong';

export interface AccentPattern {
  name: string;
  pattern: AccentLevel[]; // One entry per beat
}

export interface MetronomeBeat {
  beat: number; // 1-based
  isAccent: boolean;
  accentLevel: AccentLevel;
  timestamp: number;
}

// Preset accent patterns for common time signatures
export const ACCENT_PRESETS: Record<TimeSignature, AccentPattern[]> = {
  '2/4': [
    { name: 'Standard', pattern: ['strong', 'none'] },
    { name: 'March', pattern: ['strong', 'soft'] },
  ],
  '3/4': [
    { name: 'Waltz', pattern: ['strong', 'none', 'none'] },
    { name: 'Heavy', pattern: ['strong', 'soft', 'soft'] },
  ],
  '4/4': [
    { name: 'Standard', pattern: ['strong', 'none', 'medium', 'none'] },
    { name: 'Backbeat', pattern: ['none', 'strong', 'none', 'strong'] },
    { name: 'One', pattern: ['strong', 'none', 'none', 'none'] },
    { name: 'All', pattern: ['medium', 'medium', 'medium', 'medium'] },
  ],
  '5/4': [
    { name: '3+2', pattern: ['strong', 'none', 'none', 'medium', 'none'] },
    { name: '2+3', pattern: ['strong', 'none', 'medium', 'none', 'none'] },
  ],
  '6/8': [
    { name: 'Compound', pattern: ['strong', 'none', 'none', 'medium', 'none', 'none'] },
    { name: 'All', pattern: ['soft', 'soft', 'soft', 'soft', 'soft', 'soft'] },
  ],
  '7/8': [
    { name: '4+3', pattern: ['strong', 'none', 'none', 'none', 'medium', 'none', 'none'] },
    { name: '3+4', pattern: ['strong', 'none', 'none', 'medium', 'none', 'none', 'none'] },
    { name: '2+2+3', pattern: ['strong', 'none', 'medium', 'none', 'medium', 'none', 'none'] },
  ],
  '12/8': [
    {
      name: 'Compound',
      pattern: [
        'strong',
        'none',
        'none',
        'medium',
        'none',
        'none',
        'medium',
        'none',
        'none',
        'medium',
        'none',
        'none',
      ],
    },
    {
      name: 'Shuffle',
      pattern: [
        'strong',
        'none',
        'soft',
        'medium',
        'none',
        'soft',
        'medium',
        'none',
        'soft',
        'medium',
        'none',
        'soft',
      ],
    },
  ],
};

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
  private readonly zone = inject(NgZone);

  readonly bpm = input(120, { transform: numberAttribute });
  readonly timeSignature = input<TimeSignature>('4/4');
  readonly variant = input<MetronomeVariant>('default');
  readonly size = input<MetronomeSize>('md');
  readonly accentFirstBeat = input(true); // Legacy - used if no accentPattern
  readonly accentPattern = input<AccentLevel[] | null>(null); // Custom accent pattern
  readonly showAccentConfig = input(false); // Show accent pattern editor
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
  readonly accentPatternChange = output<AccentLevel[]>();

  protected readonly isPlaying = signal(false);
  protected readonly currentBeat = signal(0);
  protected readonly currentBpm = signal(120);
  protected readonly pendulumAngle = signal(0);
  protected readonly tapTimes = signal<number[]>([]);
  protected readonly internalAccentPattern = signal<AccentLevel[]>([]);
  protected readonly selectedPresetIndex = signal(0);
  /** True when the AudioContext could not resume without a user gesture (e.g. autoStart). */
  protected readonly needsGesture = signal(false);

  // Expose Math for template
  protected readonly Math = Math;

  private audioContext: AudioContext | null = null;

  // Lookahead scheduling state (see https://web.dev/audio-scheduling/)
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private subBeatCounter = 0;
  private beatCounter = 0;
  private readonly pendingBeatTimeouts = new Set<ReturnType<typeof setTimeout>>();
  private static readonly SCHEDULER_INTERVAL_MS = 25;
  private static readonly LOOKAHEAD_SECONDS = 0.1;

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

  // Get effective accent pattern (custom > preset > legacy)
  protected readonly effectiveAccentPattern = computed((): AccentLevel[] => {
    const custom = this.accentPattern();
    if (custom && custom.length > 0) {
      return custom;
    }

    const internal = this.internalAccentPattern();
    if (internal.length > 0) {
      return internal;
    }

    // Fall back to legacy accentFirstBeat behavior
    const beats = this.beatsPerMeasure();
    const accentFirst = this.accentFirstBeat();
    return Array.from({ length: beats }, (_, i) => (i === 0 && accentFirst ? 'strong' : 'none'));
  });

  // Available presets for current time signature
  protected readonly availablePresets = computed((): AccentPattern[] => {
    return ACCENT_PRESETS[this.timeSignature()] || [];
  });

  // Get accent level for a specific beat (1-based)
  protected getAccentForBeat(beatNum: number): AccentLevel {
    const pattern = this.effectiveAccentPattern();
    const index = (beatNum - 1) % pattern.length;
    return pattern[index] || 'none';
  }

  // Get visual class for accent indicator
  protected getAccentIndicatorClass(beatNum: number): string {
    const level = this.getAccentForBeat(beatNum);
    const isCurrent = this.currentBeat() === beatNum && this.isPlaying();

    const baseClasses = 'w-4 h-4 rounded-full transition-all duration-100 cursor-pointer';

    const levelClasses: Record<AccentLevel, string> = {
      none: isCurrent ? 'bg-slate-400 scale-110' : 'bg-slate-600 hover:bg-slate-500',
      soft: isCurrent ? 'bg-blue-400 scale-110' : 'bg-blue-600/60 hover:bg-blue-500/60',
      medium: isCurrent ? 'bg-amber-400 scale-110' : 'bg-amber-600/70 hover:bg-amber-500/70',
      strong: isCurrent ? 'bg-red-400 scale-125' : 'bg-red-600 hover:bg-red-500',
    };

    return `${baseClasses} ${levelClasses[level]}`;
  }

  protected readonly intervalMs = computed(() => {
    const bpm = this.currentBpm();
    const subs = this.subdivisions();
    return 60_000 / bpm / subs;
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
    const variantClass =
      variant === 'digital'
        ? 'text-lime-400'
        : variant === 'pendulum'
          ? 'text-amber-400'
          : 'text-white';
    const sizeClass = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-4xl';

    return [base, variantClass, sizeClass].join(' ');
  });

  ngOnInit(): void {
    this.currentBpm.set(this.bpm());
    this.initializeAccentPattern();

    if (this.autoStart()) {
      void this.start();
    }
  }

  private initializeAccentPattern(): void {
    const custom = this.accentPattern();
    if (custom && custom.length > 0) {
      this.internalAccentPattern.set([...custom]);
    } else {
      // Use first preset for time signature
      const presets = ACCENT_PRESETS[this.timeSignature()];
      if (presets && presets.length > 0) {
        this.internalAccentPattern.set([...presets[0].pattern]);
        this.selectedPresetIndex.set(0);
      }
    }
  }

  ngOnDestroy(): void {
    this.stop();
    void this.audioContext?.close();
  }

  protected async start(): Promise<void> {
    if (this.isPlaying() || this.disabled()) return;

    // Initialize audio context for click sounds
    this.audioContext ??= new AudioContext();

    // A context created without a user gesture (e.g. autoStart) starts
    // suspended — resume it, and surface a needs-gesture state if that fails.
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch {
        // handled below via the state check
      }
      if ((this.audioContext.state as AudioContextState) !== 'running') {
        this.needsGesture.set(true);
        return;
      }
    }
    this.needsGesture.set(false);

    this.isPlaying.set(true);
    this.currentBeat.set(0);
    this.subBeatCounter = 0;
    this.beatCounter = 0;
    this.playingChange.emit(true);

    // Lookahead scheduling: nextNoteTime rides on ctx.currentTime; a ~25ms
    // timer schedules every click inside the next ~100ms window with
    // sample-accurate oscillator.start(nextNoteTime). Tempo/time-signature/
    // subdivision signals are read live on each advance, so changes apply
    // without restarting.
    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.zone.runOutsideAngular(() => {
      this.scheduler();
      this.schedulerTimer = setInterval(() => {
        this.scheduler();
      }, TwMetronomeComponent.SCHEDULER_INTERVAL_MS);
    });
  }

  private scheduler(): void {
    const ctx = this.audioContext;
    if (!ctx || !this.isPlaying()) return;

    while (this.nextNoteTime < ctx.currentTime + TwMetronomeComponent.LOOKAHEAD_SECONDS) {
      this.scheduleSubBeat(this.nextNoteTime);
      // Advance by the *current* interval so live bpm/subdivision changes apply
      this.nextNoteTime += this.intervalMs() / 1000;
    }
  }

  private scheduleSubBeat(time: number): void {
    const ctx = this.audioContext;
    if (!ctx) return;

    const subs = this.subdivisions();
    this.subBeatCounter++;
    const isMainBeat = subs === 1 || this.subBeatCounter % subs === 1;
    if (!isMainBeat) return;

    const beats = this.beatsPerMeasure();
    const beatNum = (this.beatCounter % beats) + 1;
    this.beatCounter++;

    const accentLevel = this.getAccentForBeat(beatNum);
    const isAccent = accentLevel !== 'none';

    // Sample-accurate click at the scheduled time
    this.playClick(accentLevel, time);

    // Defer UI updates/outputs until the click is actually audible
    const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
    const timeout = setTimeout(() => {
      this.pendingBeatTimeouts.delete(timeout);
      if (!this.isPlaying()) return;
      this.zone.run(() => {
        this.currentBeat.set(beatNum);
        this.beat.emit({
          beat: beatNum,
          isAccent,
          accentLevel,
          timestamp: Date.now(),
        });
        if (this.variant() === 'pendulum') {
          this.pendulumAngle.set(beatNum % 2 === 0 ? 30 : -30);
        }
      });
    }, delayMs);
    this.pendingBeatTimeouts.add(timeout);
  }

  protected stop(): void {
    this.isPlaying.set(false);
    this.currentBeat.set(0);
    this.pendulumAngle.set(0);

    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    for (const timeout of this.pendingBeatTimeouts) {
      clearTimeout(timeout);
    }
    this.pendingBeatTimeouts.clear();

    this.playingChange.emit(false);
  }

  protected toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      void this.start();
    }
  }

  protected onBpmInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    if (value >= 20 && value <= 300) {
      // The lookahead scheduler reads the bpm signal live: no restart needed
      this.currentBpm.set(value);
      this.bpmChange.emit(value);
    }
  }

  protected incrementBpm(amount: number): void {
    const newBpm = Math.max(20, Math.min(300, this.currentBpm() + amount));
    this.currentBpm.set(newBpm);
    this.bpmChange.emit(newBpm);
  }

  protected tapTempo(): void {
    const now = Date.now();
    const taps = this.tapTimes();
    const recentTaps = [...taps, now].filter(t => now - t < 3000); // Keep only taps within last 3 seconds

    this.tapTimes.set(recentTaps);

    if (recentTaps.length >= 3) {
      // Calculate average interval
      const intervals: number[] = [];
      for (let i = 1; i < recentTaps.length; i++) {
        intervals.push(recentTaps[i] - recentTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60_000 / avgInterval);

      if (bpm >= 20 && bpm <= 300) {
        this.currentBpm.set(bpm);
        this.bpmChange.emit(bpm);
      }
    }
  }

  protected selectTimeSignature(sig: TimeSignature): void {
    this.timeSignatureChange.emit(sig);
    this.currentBeat.set(0);
    this.beatCounter = 0;
    this.subBeatCounter = 0;

    // Update accent pattern for new time signature
    const presets = ACCENT_PRESETS[sig];
    if (presets && presets.length > 0) {
      this.internalAccentPattern.set([...presets[0].pattern]);
      this.selectedPresetIndex.set(0);
      this.accentPatternChange.emit(this.internalAccentPattern());
    }
  }

  // Cycle accent level for a beat
  protected cycleAccent(beatNum: number): void {
    const pattern = [...this.effectiveAccentPattern()];
    const index = beatNum - 1;
    const levels: AccentLevel[] = ['none', 'soft', 'medium', 'strong'];
    const currentLevel = pattern[index] || 'none';
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevel = levels[(currentIndex + 1) % levels.length];

    pattern[index] = nextLevel;
    this.internalAccentPattern.set(pattern);
    this.accentPatternChange.emit(pattern);
  }

  // Select a preset pattern
  protected selectPreset(index: number): void {
    const presets = this.availablePresets();
    if (index >= 0 && index < presets.length) {
      this.internalAccentPattern.set([...presets[index].pattern]);
      this.selectedPresetIndex.set(index);
      this.accentPatternChange.emit(this.internalAccentPattern());
    }
  }

  // Set custom accent pattern programmatically
  setAccentPattern(pattern: AccentLevel[]): void {
    this.internalAccentPattern.set([...pattern]);
    this.accentPatternChange.emit(pattern);
  }

  // Get current accent pattern
  getAccentPattern(): AccentLevel[] {
    return [...this.effectiveAccentPattern()];
  }

  private playClick(accentLevel: AccentLevel, when?: number): void {
    if (!this.audioContext) return;

    const startTime = when ?? this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different sounds for different accent levels
    const frequencies: Record<AccentLevel, number> = {
      none: 800,
      soft: 880,
      medium: 1000,
      strong: 1200,
    };

    const volumes: Record<AccentLevel, number> = {
      none: 0.2,
      soft: 0.3,
      medium: 0.4,
      strong: 0.5,
    };

    oscillator.frequency.value = frequencies[accentLevel];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volumes[accentLevel], startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.05);
  }

  protected readonly timeSignatures: TimeSignature[] = [
    '2/4',
    '3/4',
    '4/4',
    '5/4',
    '6/8',
    '7/8',
    '12/8',
  ];
}
