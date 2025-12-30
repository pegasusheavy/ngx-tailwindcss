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
export type SpectrumColorScheme = 'classic' | 'fire' | 'ice' | 'neon' | 'mono';

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

  // Internal state
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private dataArray: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  private peaks: number[] = [];
  private isRunning = false;

  protected readonly frequencyLabels = computed(() => {
    return ['20', '100', '500', '1k', '5k', '20k'];
  });

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
    const samplesPerBar = Math.floor(data.length / barCount);

    for (let i = 0; i < barCount; i++) {
      // Average samples for this bar
      let sum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        sum += data[i * samplesPerBar + j];
      }
      const value = sum / samplesPerBar / 255;

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

  private drawGradientBars(data: Uint8Array): void {
    if (!this.ctx) return;

    const w = this.width();
    const h = this.height();
    const barCount = this.barCount();
    const gap = this.barGap();
    const radius = this.barRadius();
    const colors = COLOR_SCHEMES[this.colorScheme()];

    const barWidth = (w - (barCount - 1) * gap) / barCount;
    const samplesPerBar = Math.floor(data.length / barCount);

    // Create vertical gradient
    const gradient = this.ctx.createLinearGradient(0, h, 0, 0);
    for (const stop of colors) {
      gradient.addColorStop(stop.position, stop.color);
    }

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        sum += data[i * samplesPerBar + j];
      }
      const value = sum / samplesPerBar / 255;

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
    const samplesPerBar = Math.floor(data.length / barCount);
    const centerY = h / 2;

    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
    for (const stop of colors) {
      gradient.addColorStop(0.5 - stop.position * 0.5, stop.color);
      gradient.addColorStop(0.5 + stop.position * 0.5, stop.color);
    }
    this.ctx.fillStyle = gradient;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        sum += data[i * samplesPerBar + j];
      }
      const value = sum / samplesPerBar / 255;

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
}

