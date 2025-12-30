import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type SpectrumVariant = 'bars' | 'line' | 'gradient' | 'mirror';
export type SpectrumColorScheme = 'classic' | 'fire' | 'ice' | 'neon' | 'mono' | 'light' | 'highContrast';
export type FrequencyScale = 'linear' | 'logarithmic';

interface ColorStop {
  position: number;
  color: string;
}

const COLOR_SCHEMES: Record<SpectrumColorScheme, ColorStop[]> = {
  classic: [
    { position: 0, color: '#22c55e' },
    { position: 0.6, color: '#eab308' },
    { position: 0.85, color: '#ef4444' },
  ],
  fire: [
    { position: 0, color: '#fbbf24' },
    { position: 0.5, color: '#f97316' },
    { position: 1, color: '#dc2626' },
  ],
  ice: [
    { position: 0, color: '#06b6d4' },
    { position: 0.5, color: '#3b82f6' },
    { position: 1, color: '#8b5cf6' },
  ],
  neon: [
    { position: 0, color: '#22d3ee' },
    { position: 0.5, color: '#a855f7' },
    { position: 1, color: '#ec4899' },
  ],
  mono: [
    { position: 0, color: '#64748b' },
    { position: 0.5, color: '#94a3b8' },
    { position: 1, color: '#cbd5e1' },
  ],
  light: [
    { position: 0, color: '#3B82F6' },
    { position: 0.5, color: '#8B5CF6' },
    { position: 1, color: '#EC4899' },
  ],
  highContrast: [
    { position: 0, color: '#00FF00' },
    { position: 0.5, color: '#FFFF00' },
    { position: 1, color: '#FF0000' },
  ],
};

/**
 * Spectrum Analyzer component for frequency visualization
 *
 * @example
 * ```html
 * <tw-spectrum [analyserNode]="analyser"></tw-spectrum>
 * <tw-spectrum [frequencyData]="fftData" variant="gradient"></tw-spectrum>
 * ```
 */
@Component({
  selector: 'tw-spectrum',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spectrum.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwSpectrumComponent implements AfterViewInit, OnChanges {
  private readonly twClass = inject(TwClassService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('spectrumCanvas');

  // Data inputs
  readonly analyserNode = input<AnalyserNode | null>(null);
  readonly frequencyData = input<Uint8Array | number[]>([]);

  // Display options
  readonly width = input(300);
  readonly height = input(128);
  readonly variant = input<SpectrumVariant>('bars');
  readonly colorScheme = input<SpectrumColorScheme>('classic');
  readonly barCount = input(32);
  readonly barGap = input(2);
  readonly barRadius = input(2);
  readonly smoothing = input(0.8);
  readonly minDecibels = input(-90);
  readonly maxDecibels = input(-10);
  readonly showPeaks = input(true);
  readonly peakDecay = input(0.02);
  readonly showLabels = input(false);
  readonly backgroundColor = input<string>('');
  readonly classOverride = input('');

  // Custom sizing via CSS variables (override individual dimensions)
  readonly customWidth = input<number | null>(null);
  readonly customHeight = input<number | null>(null);
  readonly customBarGap = input<number | null>(null);
  readonly customBarRadius = input<number | null>(null);

  // Effective dimensions (custom overrides take precedence)
  protected readonly effectiveWidth = computed(() => this.customWidth() ?? this.width());
  protected readonly effectiveHeight = computed(() => this.customHeight() ?? this.height());
  protected readonly effectiveBarGap = computed(() => this.customBarGap() ?? this.barGap());
  protected readonly effectiveBarRadius = computed(() => this.customBarRadius() ?? this.barRadius());

  // CSS variable style bindings for custom sizing
  protected readonly cssVarStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (this.customWidth()) styles['--tw-music-spectrum-width'] = `${this.customWidth()}px`;
    if (this.customHeight()) styles['--tw-music-spectrum-height'] = `${this.customHeight()}px`;
    if (this.customBarGap()) styles['--tw-music-spectrum-bar-gap'] = `${this.customBarGap()}px`;
    if (this.customBarRadius()) styles['--tw-music-spectrum-bar-radius'] = `${this.customBarRadius()}px`;
    return styles;
  });

  // Frequency scaling
  readonly frequencyScale = input<FrequencyScale>('logarithmic'); // 'linear' or 'logarithmic'
  readonly minFrequency = input(20); // Hz - lowest frequency to display
  readonly maxFrequency = input(20000); // Hz - highest frequency to display

  // Internal state
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private dataArray: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  private peaks: number[] = [];
  private isRunning = false;
  private sampleRate = 44100; // Default, updated from AudioContext
  private binToBarMapping: number[][] = []; // Maps each bar to its frequency bin range

  protected readonly frequencyLabels = computed(() => {
    const scale = this.frequencyScale();
    const barCount = this.barCount();
    const minFreq = this.minFrequency();
    const maxFreq = this.maxFrequency();

    if (scale === 'logarithmic') {
      // Logarithmic labels at common frequencies
      return ['20', '50', '100', '200', '500', '1k', '2k', '5k', '10k', '20k']
        .filter(label => {
          const freq = this.labelToFreq(label);
          return freq >= minFreq && freq <= maxFreq;
        });
    } else {
      // Linear labels - evenly spaced
      const labels: string[] = [];
      const step = (maxFreq - minFreq) / 5;
      for (let i = 0; i <= 5; i++) {
        const freq = minFreq + i * step;
        labels.push(this.freqToLabel(freq));
      }
      return labels;
    }
  });

  private labelToFreq(label: string): number {
    if (label.endsWith('k')) {
      return parseFloat(label) * 1000;
    }
    return parseFloat(label);
  }

  private freqToLabel(freq: number): string {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(freq >= 10000 ? 0 : 1)}k`;
    }
    return freq.toFixed(0);
  }

  protected readonly containerClasses = computed(() => {
    const baseClasses = 'inline-block';
    return this.twClass.merge(baseClasses, this.classOverride());
  });

  ngAfterViewInit(): void {
    this.initCanvas();
    this.startAnimation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['analyserNode']) {
      this.setupAnalyser();
    }
    if (changes['frequencyData'] && !this.analyserNode()) {
      this.draw();
    }
  }

  private initCanvas(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;
    this.ctx = canvasEl.getContext('2d');
  }

  private setupAnalyser(): void {
    const analyser = this.analyserNode();
    if (analyser) {
      analyser.smoothingTimeConstant = this.smoothing();
      analyser.minDecibels = this.minDecibels();
      analyser.maxDecibels = this.maxDecibels();
      this.dataArray = new Uint8Array(analyser.frequencyBinCount);
      this.peaks = Array.from({ length: this.barCount() }).fill(0) as number[];

      // Get sample rate from AudioContext if available
      if (analyser.context) {
        this.sampleRate = analyser.context.sampleRate;
      }

      // Calculate bin to bar mapping based on frequency scale
      this.calculateBinMapping(analyser.frequencyBinCount);
    }
  }

  private calculateBinMapping(binCount: number): void {
    const barCount = this.barCount();
    const scale = this.frequencyScale();
    const minFreq = this.minFrequency();
    const maxFreq = this.maxFrequency();
    const nyquist = this.sampleRate / 2;
    const binSize = nyquist / binCount;

    this.binToBarMapping = [];

    if (scale === 'linear') {
      // Linear: equal frequency ranges per bar
      const freqPerBar = (maxFreq - minFreq) / barCount;

      for (let bar = 0; bar < barCount; bar++) {
        const freqLow = minFreq + bar * freqPerBar;
        const freqHigh = freqLow + freqPerBar;

        const binLow = Math.floor(freqLow / binSize);
        const binHigh = Math.min(binCount - 1, Math.floor(freqHigh / binSize));

        const bins: number[] = [];
        for (let b = binLow; b <= binHigh; b++) {
          bins.push(b);
        }
        this.binToBarMapping.push(bins.length > 0 ? bins : [binLow]);
      }
    } else {
      // Logarithmic: exponential frequency ranges (more detail in low frequencies)
      const logMin = Math.log10(Math.max(1, minFreq));
      const logMax = Math.log10(maxFreq);
      const logRange = logMax - logMin;

      for (let bar = 0; bar < barCount; bar++) {
        const logFreqLow = logMin + (bar / barCount) * logRange;
        const logFreqHigh = logMin + ((bar + 1) / barCount) * logRange;

        const freqLow = Math.pow(10, logFreqLow);
        const freqHigh = Math.pow(10, logFreqHigh);

        const binLow = Math.max(0, Math.floor(freqLow / binSize));
        const binHigh = Math.min(binCount - 1, Math.floor(freqHigh / binSize));

        const bins: number[] = [];
        for (let b = binLow; b <= binHigh; b++) {
          bins.push(b);
        }
        this.binToBarMapping.push(bins.length > 0 ? bins : [binLow]);
      }
    }
  }

  private startAnimation(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const animate = (): void => {
      if (!this.isRunning) return;

      const analyser = this.analyserNode();
      if (analyser) {
        analyser.getByteFrequencyData(this.dataArray);
      }

      this.draw();
      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();

    this.destroyRef.onDestroy(() => {
      this.isRunning = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    });
  }

  private draw(): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const variant = this.variant();

    // Clear canvas
    const bgColor = this.backgroundColor() || '#0f172a';
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, w, h);

    // Get frequency data
    const data = this.analyserNode() ? this.dataArray : new Uint8Array(this.frequencyData() as number[]);
    if (data.length === 0) return;

    switch (variant) {
      case 'bars': {
        this.drawBars(data);
        break;
      }
      case 'line': {
        this.drawLine(data);
        break;
      }
      case 'gradient': {
        this.drawGradientBars(data);
        break;
      }
      case 'mirror': {
        this.drawMirror(data);
        break;
      }
    }
  }

  private drawBars(data: Uint8Array): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const barCount = this.barCount();
    const gap = this.barGap();
    const radius = this.barRadius();
    const colors = COLOR_SCHEMES[this.colorScheme()];

    const barWidth = (w - (barCount - 1) * gap) / barCount;

    for (let i = 0; i < barCount; i++) {
      // Get value for this bar using frequency-scaled bin mapping
      const value = this.getBarValue(data, i);

      const barHeight = Math.max(2, value * h);
      const x = i * (barWidth + gap);
      const y = h - barHeight;

      // Get color based on height
      const color = this.getColorForValue(value, colors);
      this.ctx.fillStyle = color;

      // Draw rounded bar
      this.roundRect(x, y, barWidth, barHeight, radius);

      // Update and draw peak
      if (this.showPeaks()) {
        if (value > (this.peaks[i] || 0)) {
          this.peaks[i] = value;
        } else {
          this.peaks[i] = Math.max(0, (this.peaks[i] || 0) - this.peakDecay());
        }

        const peakY = h - this.peaks[i] * h;
        this.ctx.fillStyle = this.getColorForValue(this.peaks[i], colors);
        this.ctx.fillRect(x, peakY - 2, barWidth, 2);
      }
    }
  }

  private getBarValue(data: Uint8Array, barIndex: number): number {
    // Use pre-computed bin mapping if available
    if (this.binToBarMapping.length > 0 && this.binToBarMapping[barIndex]) {
      const bins = this.binToBarMapping[barIndex];
      let sum = 0;
      for (const bin of bins) {
        if (bin < data.length) {
          sum += data[bin];
        }
      }
      return bins.length > 0 ? sum / bins.length / 255 : 0;
    }

    // Fallback to simple linear mapping
    const samplesPerBar = Math.floor(data.length / this.barCount());
    let sum = 0;
    for (let j = 0; j < samplesPerBar; j++) {
      const idx = barIndex * samplesPerBar + j;
      if (idx < data.length) {
        sum += data[idx];
      }
    }
    return samplesPerBar > 0 ? sum / samplesPerBar / 255 : 0;
  }

  private drawGradientBars(data: Uint8Array): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const barCount = this.barCount();
    const gap = this.barGap();
    const radius = this.barRadius();
    const colors = COLOR_SCHEMES[this.colorScheme()];

    const barWidth = (w - (barCount - 1) * gap) / barCount;

    // Create vertical gradient
    const gradient = this.ctx.createLinearGradient(0, h, 0, 0);
    for (const stop of colors) {
      gradient.addColorStop(stop.position, stop.color);
    }

    for (let i = 0; i < barCount; i++) {
      const value = this.getBarValue(data, i);

      const barHeight = Math.max(2, value * h);
      const x = i * (barWidth + gap);
      const y = h - barHeight;

      this.ctx.fillStyle = gradient;
      this.roundRect(x, y, barWidth, barHeight, radius);
    }
  }

  private drawLine(data: Uint8Array): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const colors = COLOR_SCHEMES[this.colorScheme()];

    // Create gradient for line
    const gradient = this.ctx.createLinearGradient(0, h, 0, 0);
    for (const stop of colors) {
      gradient.addColorStop(stop.position, stop.color);
    }

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();

    const step = w / (data.length - 1);
    for (let i = 0; i < data.length; i++) {
      const value = data[i] / 255;
      const x = i * step;
      const y = h - value * h;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();

    // Fill area under curve
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.closePath();

    const fillGradient = this.ctx.createLinearGradient(0, h, 0, 0);
    for (const stop of colors) {
      fillGradient.addColorStop(stop.position, `${stop.color}40`);
    }
    this.ctx.fillStyle = fillGradient;
    this.ctx.fill();
  }

  private drawMirror(data: Uint8Array): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const barCount = this.barCount();
    const gap = this.barGap();
    const radius = this.barRadius();
    const colors = COLOR_SCHEMES[this.colorScheme()];

    const barWidth = (w - (barCount - 1) * gap) / barCount;
    const centerY = h / 2;

    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
    for (const stop of colors) {
      gradient.addColorStop(0.5 - stop.position * 0.5, stop.color);
      gradient.addColorStop(0.5 + stop.position * 0.5, stop.color);
    }
    this.ctx.fillStyle = gradient;

    for (let i = 0; i < barCount; i++) {
      const value = this.getBarValue(data, i);

      const barHeight = Math.max(1, value * (h / 2 - 2));
      const x = i * (barWidth + gap);

      // Top bar
      this.roundRect(x, centerY - barHeight, barWidth, barHeight, radius);
      // Bottom bar (mirrored)
      this.roundRect(x, centerY, barWidth, barHeight, radius);
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private getColorForValue(value: number, colors: ColorStop[]): string {
    for (let i = colors.length - 1; i >= 0; i--) {
      if (value >= colors[i].position) {
        return colors[i].color;
      }
    }
    return colors[0].color;
  }

  // Public methods
  start(): void {
    if (!this.isRunning) {
      this.startAnimation();
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  reset(): void {
    this.peaks = Array.from({ length: this.barCount() }).fill(0) as number[];
    this.draw();
  }

  /**
   * Get the frequency range for a specific bar
   */
  getBarFrequencyRange(barIndex: number): { low: number; high: number } {
    const scale = this.frequencyScale();
    const barCount = this.barCount();
    const minFreq = this.minFrequency();
    const maxFreq = this.maxFrequency();

    if (scale === 'linear') {
      const freqPerBar = (maxFreq - minFreq) / barCount;
      return {
        low: minFreq + barIndex * freqPerBar,
        high: minFreq + (barIndex + 1) * freqPerBar,
      };
    } else {
      const logMin = Math.log10(Math.max(1, minFreq));
      const logMax = Math.log10(maxFreq);
      const logRange = logMax - logMin;

      return {
        low: Math.pow(10, logMin + (barIndex / barCount) * logRange),
        high: Math.pow(10, logMin + ((barIndex + 1) / barCount) * logRange),
      };
    }
  }

  /**
   * Set frequency scale and recalculate bin mapping
   */
  setFrequencyScale(scale: FrequencyScale): void {
    const analyser = this.analyserNode();
    if (analyser) {
      this.calculateBinMapping(analyser.frequencyBinCount);
    }
  }
}

