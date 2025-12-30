import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { TwClassService } from '../core/tw-class.service';

export type VuMeterVariant = 'led' | 'gradient' | 'solid' | 'retro' | 'light' | 'highContrast';
export type VuMeterOrientation = 'vertical' | 'horizontal';
export type VuMeterMode = 'peak' | 'rms' | 'both';

interface MeterSegment {
  index: number;
  threshold: number;
  color: 'green' | 'yellow' | 'red';
}

// RMS calculation window size (samples)
const RMS_WINDOW_SIZE = 1024;

/**
 * VU Meter / Level Meter component for audio visualization
 *
 * @example
 * ```html
 * <tw-vu-meter [value]="audioLevel"></tw-vu-meter>
 * <tw-vu-meter [leftValue]="leftChannel" [rightValue]="rightChannel" [stereo]="true"></tw-vu-meter>
 * ```
 */
@Component({
  selector: 'tw-vu-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vu-meter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwVuMeterComponent implements OnInit {
  private readonly twClass = inject(TwClassService);
  private readonly destroyRef = inject(DestroyRef);

  // Value inputs
  readonly value = input(0);
  readonly leftValue = input(0);
  readonly rightValue = input(0);

  // Configuration inputs
  readonly min = input(0);
  readonly max = input(100);
  readonly stereo = input(false);
  readonly variant = input<VuMeterVariant>('led');
  readonly orientation = input<VuMeterOrientation>('vertical');
  readonly meterMode = input<VuMeterMode>('peak'); // NEW: peak, rms, or both
  readonly segmentCount = input(20);
  readonly height = input(200);
  readonly width = input(200);
  readonly barWidth = input(12);
  readonly gapSize = input(2);
  readonly rmsDecayRate = input(0.15); // Slower decay for RMS

  // Custom sizing via CSS variables (override individual dimensions)
  readonly customHeight = input<number | null>(null);
  readonly customWidth = input<number | null>(null);
  readonly customBarWidth = input<number | null>(null);
  readonly customGapSize = input<number | null>(null);

  // Display options
  readonly showPeak = input(true);
  readonly peakHoldTime = input(1500);
  readonly peakDecayRate = input(0.05);
  readonly showClip = input(true);
  readonly clipThreshold = input(95);
  readonly showScale = input(true);
  readonly showChannelLabels = input(true);
  readonly label = input<string>('');
  readonly labelPosition = input<'top' | 'bottom'>('bottom');

  // Color thresholds (percentage)
  readonly yellowThreshold = input(70);
  readonly redThreshold = input(90);

  // Class overrides
  readonly classOverride = input('');

  // Outputs
  readonly clipDetected = output<{ channel: number }>();

  // Internal state
  protected readonly channelValues = signal<number[]>([0]); // Current display value (peak or RMS depending on mode)
  protected readonly peakValues = signal<number[]>([0]); // Peak hold values
  protected readonly rmsValues = signal<number[]>([0]); // RMS values (for 'both' mode)
  protected readonly clipStates = signal<boolean[]>([false]);

  private peakDecayTimers: Array<ReturnType<typeof setInterval>> = [];
  private rmsBuffers: Float32Array[] = []; // Circular buffers for RMS calculation
  private rmsWriteIndices: number[] = [0, 0];

  ngOnInit(): void {
    // Initialize RMS buffers
    this.rmsBuffers = [
      new Float32Array(RMS_WINDOW_SIZE),
      new Float32Array(RMS_WINDOW_SIZE),
    ];

    // Setup peak decay
    if (this.showPeak()) {
      interval(50)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.decayPeaks();
        });
    }

    // Setup RMS decay (slower than peak)
    if (this.meterMode() === 'rms' || this.meterMode() === 'both') {
      interval(50)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.decayRms();
        });
    }
  }

  // Computed values
  protected readonly channels = computed(() => {
    return this.stereo() ? [0, 1] : [0];
  });

  protected readonly showRmsBar = computed(() => {
    return this.meterMode() === 'both';
  });

  protected readonly meterModeLabel = computed(() => {
    const mode = this.meterMode();
    switch (mode) {
      case 'peak':
        return 'PEAK';
      case 'rms':
        return 'RMS';
      case 'both':
        return 'P/R';
      default:
        return '';
    }
  });

  protected readonly segments = computed((): MeterSegment[] => {
    const count = this.segmentCount();
    const yellowThresh = this.yellowThreshold();
    const redThresh = this.redThreshold();

    return Array.from({ length: count }, (_, i) => {
      const threshold = ((i + 1) / count) * 100;
      let color: 'green' | 'yellow' | 'red' = 'green';
      if (threshold > redThresh) {
        color = 'red';
      } else if (threshold > yellowThresh) {
        color = 'yellow';
      }
      return { index: i, threshold, color };
    });
  });

  protected readonly scaleMarks = computed(() => {
    const marks = [
      { value: 100, label: '0' },
      { value: 90, label: '-3' },
      { value: 70, label: '-10' },
      { value: 50, label: '-20' },
      { value: 25, label: '-40' },
      { value: 0, label: '-∞' },
    ];
    return marks;
  });

  protected readonly horizontalScaleMarks = computed(() => {
    return [
      { value: 0, label: '-∞' },
      { value: 25, label: '-40' },
      { value: 50, label: '-20' },
      { value: 70, label: '-10' },
      { value: 90, label: '-3' },
      { value: 100, label: '0' },
    ];
  });

  protected readonly containerClasses = computed(() => {
    return this.twClass.merge('inline-flex flex-col items-center gap-2', this.classOverride());
  });

  // Effective dimensions (custom overrides take precedence)
  protected readonly effectiveHeight = computed(() => this.customHeight() ?? this.height());
  protected readonly effectiveWidth = computed(() => this.customWidth() ?? this.width());
  protected readonly effectiveBarWidth = computed(() => this.customBarWidth() ?? this.barWidth());
  protected readonly effectiveGapSize = computed(() => this.customGapSize() ?? this.gapSize());

  // CSS variable style bindings for custom sizing
  protected readonly cssVarStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (this.customHeight()) styles['--tw-music-meter-height'] = `${this.customHeight()}px`;
    if (this.customWidth()) styles['--tw-music-meter-width'] = `${this.customWidth()}px`;
    if (this.customBarWidth()) styles['--tw-music-meter-bar-width'] = `${this.customBarWidth()}px`;
    if (this.customGapSize()) styles['--tw-music-meter-segment-gap'] = `${this.customGapSize()}px`;
    return styles;
  });

  protected readonly meterContainerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'relative p-2 rounded-lg';

    const variantClasses: Record<VuMeterVariant, string> = {
      led: 'bg-slate-900 dark:bg-black border border-slate-700',
      gradient: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
      solid: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm',
      retro: 'bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded-xl',
      light: 'bg-white border border-slate-200 shadow-sm',
      highContrast: 'bg-black border-2 border-white',
    };

    return this.twClass.merge(baseClasses, variantClasses[variant]);
  });

  protected readonly labelClasses = computed(() => {
    return 'text-xs font-medium text-slate-600 dark:text-slate-400';
  });

  protected segmentClasses(segment: MeterSegment, currentValue: number): string {
    const variant = this.variant();
    const isActive = (currentValue / this.max()) * 100 >= segment.threshold;
    const baseClasses = 'rounded-sm transition-all duration-75';

    if (variant === 'led') {
      const activeColors: Record<string, string> = {
        green: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
        yellow: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
        red: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]',
      };
      const inactiveColors: Record<string, string> = {
        green: 'bg-emerald-950',
        yellow: 'bg-amber-950',
        red: 'bg-red-950',
      };
      return this.twClass.merge(
        baseClasses,
        isActive ? activeColors[segment.color] : inactiveColors[segment.color]
      );
    }

    if (variant === 'gradient') {
      const activeColors: Record<string, string> = {
        green: 'bg-gradient-to-t from-emerald-600 to-emerald-400',
        yellow: 'bg-gradient-to-t from-amber-500 to-amber-300',
        red: 'bg-gradient-to-t from-red-600 to-red-400',
      };
      return this.twClass.merge(
        baseClasses,
        isActive ? activeColors[segment.color] : 'bg-slate-200 dark:bg-slate-700'
      );
    }

    if (variant === 'solid') {
      const activeColors: Record<string, string> = {
        green: 'bg-emerald-500',
        yellow: 'bg-amber-400',
        red: 'bg-red-500',
      };
      return this.twClass.merge(
        baseClasses,
        isActive ? activeColors[segment.color] : 'bg-slate-100 dark:bg-slate-800'
      );
    }

    if (variant === 'retro') {
      const activeColors: Record<string, string> = {
        green: 'bg-emerald-600',
        yellow: 'bg-amber-500',
        red: 'bg-red-600',
      };
      return this.twClass.merge(
        baseClasses,
        isActive ? activeColors[segment.color] : 'bg-amber-100 dark:bg-amber-900/30'
      );
    }

    if (variant === 'light') {
      const activeColors: Record<string, string> = {
        green: 'bg-emerald-500',
        yellow: 'bg-amber-400',
        red: 'bg-red-500',
      };
      return this.twClass.merge(
        baseClasses,
        isActive ? activeColors[segment.color] : 'bg-slate-200'
      );
    }

    // High contrast variant
    const activeColorsHC: Record<string, string> = {
      green: 'bg-green-400',
      yellow: 'bg-yellow-300',
      red: 'bg-red-400',
    };
    return this.twClass.merge(
      baseClasses,
      isActive ? activeColorsHC[segment.color] : 'bg-gray-800 border border-gray-600'
    );
  }

  protected peakClasses(peakValue: number): string {
    const percentage = (peakValue / this.max()) * 100;
    if (percentage >= this.redThreshold()) {
      return 'bg-red-500';
    }
    if (percentage >= this.yellowThreshold()) {
      return 'bg-amber-400';
    }
    return 'bg-emerald-500';
  }

  // Public methods

  /**
   * Set the meter value directly (for peak mode or simple usage)
   */
  setValue(value: number, channel = 0): void {
    const normalizedValue = Math.max(this.min(), Math.min(this.max(), value));
    const mode = this.meterMode();

    if (mode === 'peak') {
      const values = [...this.channelValues()];
      values[channel] = normalizedValue;
      this.channelValues.set(values);
    } else if (mode === 'rms') {
      // For RMS mode, add sample to buffer and recalculate
      this.addSampleToRmsBuffer(normalizedValue / this.max(), channel);
      const rmsValue = this.calculateRmsFromBuffer(channel) * this.max();
      const values = [...this.channelValues()];
      values[channel] = rmsValue;
      this.channelValues.set(values);
    } else {
      // Both mode - peak for main display, track RMS separately
      const values = [...this.channelValues()];
      values[channel] = normalizedValue;
      this.channelValues.set(values);

      this.addSampleToRmsBuffer(normalizedValue / this.max(), channel);
      const rmsValue = this.calculateRmsFromBuffer(channel) * this.max();
      const rmsVals = [...this.rmsValues()];
      rmsVals[channel] = rmsValue;
      this.rmsValues.set(rmsVals);
    }

    // Update peak
    if (this.showPeak()) {
      this.updatePeak(normalizedValue, channel);
    }

    // Check for clip
    if (this.showClip() && (normalizedValue / this.max()) * 100 >= this.clipThreshold()) {
      this.setClip(channel);
    }
  }

  /**
   * Set values from raw audio samples (Float32Array, -1 to 1)
   * This allows for proper RMS calculation from actual audio data
   */
  setFromSamples(samples: Float32Array, channel = 0): void {
    const mode = this.meterMode();

    // Calculate peak from samples
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
      const abs = Math.abs(samples[i]);
      if (abs > peak) peak = abs;
    }
    const peakValue = peak * this.max();

    // Calculate RMS from samples
    let sumSquares = 0;
    for (let i = 0; i < samples.length; i++) {
      sumSquares += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSquares / samples.length);
    const rmsValue = rms * this.max();

    if (mode === 'peak') {
      const values = [...this.channelValues()];
      values[channel] = peakValue;
      this.channelValues.set(values);
    } else if (mode === 'rms') {
      const values = [...this.channelValues()];
      values[channel] = rmsValue;
      this.channelValues.set(values);
    } else {
      // Both mode
      const values = [...this.channelValues()];
      values[channel] = peakValue;
      this.channelValues.set(values);

      const rmsVals = [...this.rmsValues()];
      rmsVals[channel] = rmsValue;
      this.rmsValues.set(rmsVals);
    }

    // Update peak hold
    if (this.showPeak()) {
      this.updatePeak(peakValue, channel);
    }

    // Check for clip
    if (this.showClip() && (peakValue / this.max()) * 100 >= this.clipThreshold()) {
      this.setClip(channel);
    }
  }

  /**
   * Set values for stereo channels from raw samples
   */
  setFromStereoSamples(leftSamples: Float32Array, rightSamples: Float32Array): void {
    this.setFromSamples(leftSamples, 0);
    if (this.stereo()) {
      this.setFromSamples(rightSamples, 1);
    }
  }

  setValues(left: number, right?: number): void {
    this.setValue(left, 0);
    if (this.stereo() && right !== undefined) {
      this.setValue(right, 1);
    }
  }

  /**
   * Get the current RMS value for a channel (useful for external display)
   */
  getRmsValue(channel = 0): number {
    return this.rmsValues()[channel] ?? 0;
  }

  /**
   * Get the current peak value for a channel
   */
  getPeakValue(channel = 0): number {
    return this.peakValues()[channel] ?? 0;
  }

  private addSampleToRmsBuffer(sample: number, channel: number): void {
    if (!this.rmsBuffers[channel]) {
      this.rmsBuffers[channel] = new Float32Array(RMS_WINDOW_SIZE);
    }
    this.rmsBuffers[channel][this.rmsWriteIndices[channel]] = sample;
    this.rmsWriteIndices[channel] = (this.rmsWriteIndices[channel] + 1) % RMS_WINDOW_SIZE;
  }

  private calculateRmsFromBuffer(channel: number): number {
    const buffer = this.rmsBuffers[channel];
    if (!buffer) return 0;

    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i++) {
      sumSquares += buffer[i] * buffer[i];
    }
    return Math.sqrt(sumSquares / buffer.length);
  }

  private updatePeak(value: number, channel: number): void {
    const peaks = [...this.peakValues()];
    if (value > peaks[channel]) {
      peaks[channel] = value;
      this.peakValues.set(peaks);

      // Reset decay timer
      if (this.peakDecayTimers[channel]) {
        clearTimeout(this.peakDecayTimers[channel]);
      }

      this.peakDecayTimers[channel] = setTimeout(() => {
        // Peak will decay via the interval in ngOnInit
      }, this.peakHoldTime());
    }
  }

  private decayPeaks(): void {
    const peaks = [...this.peakValues()];
    const values = this.channelValues();
    let changed = false;

    peaks.forEach((peak, i) => {
      if (peak > values[i]) {
        peaks[i] = Math.max(values[i], peak - (this.max() * this.peakDecayRate()));
        changed = true;
      }
    });

    if (changed) {
      this.peakValues.set(peaks);
    }
  }

  private decayRms(): void {
    const rmsVals = [...this.rmsValues()];
    let changed = false;

    rmsVals.forEach((rms, i) => {
      if (rms > 0) {
        rmsVals[i] = Math.max(0, rms - (this.max() * this.rmsDecayRate()));
        changed = true;
      }
    });

    if (changed) {
      this.rmsValues.set(rmsVals);
    }
  }

  private setClip(channel: number): void {
    const clips = [...this.clipStates()];
    if (!clips[channel]) {
      clips[channel] = true;
      this.clipStates.set(clips);
      this.clipDetected.emit({ channel });
    }
  }

  resetClip(channel: number): void {
    const clips = [...this.clipStates()];
    clips[channel] = false;
    this.clipStates.set(clips);
  }

  resetAllClips(): void {
    this.clipStates.set(this.channels().map(() => false));
  }

  reset(): void {
    this.channelValues.set(this.channels().map(() => 0));
    this.peakValues.set(this.channels().map(() => 0));
    this.rmsValues.set(this.channels().map(() => 0));
    this.resetAllClips();

    // Clear RMS buffers
    this.rmsBuffers.forEach((buffer) => buffer.fill(0));
    this.rmsWriteIndices = [0, 0];
  }

  /**
   * Get RMS display position (percentage) for rendering
   */
  protected getRmsPosition(channel: number): number {
    const rms = this.rmsValues()[channel] ?? 0;
    return (rms / this.max()) * 100;
  }
}

