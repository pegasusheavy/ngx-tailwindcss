import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type EQFilterType = 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch';
export type EQVariant = 'default' | 'dark' | 'vintage' | 'neon';

export interface EQBand {
  id: string;
  frequency: number; // Hz (20 - 20000)
  gain: number; // dB (-24 to +24)
  q: number; // Q factor (0.1 to 18)
  type: EQFilterType;
  enabled: boolean;
  color?: string;
}

export interface EQBandChange {
  band: EQBand;
  property: 'frequency' | 'gain' | 'q' | 'type' | 'enabled';
}

const DEFAULT_BANDS: EQBand[] = [
  { id: 'band1', frequency: 80, gain: 0, q: 0.7, type: 'lowshelf', enabled: true, color: '#EF4444' },
  { id: 'band2', frequency: 250, gain: 0, q: 1.0, type: 'peaking', enabled: true, color: '#F97316' },
  { id: 'band3', frequency: 1000, gain: 0, q: 1.0, type: 'peaking', enabled: true, color: '#EAB308' },
  { id: 'band4', frequency: 4000, gain: 0, q: 1.0, type: 'peaking', enabled: true, color: '#22C55E' },
  { id: 'band5', frequency: 12000, gain: 0, q: 0.7, type: 'highshelf', enabled: true, color: '#3B82F6' },
];

@Component({
  selector: 'tw-parametric-eq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parametric-eq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwParametricEQComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly bands = input<EQBand[]>(DEFAULT_BANDS);
  readonly width = input(600, { transform: numberAttribute });
  readonly height = input(200, { transform: numberAttribute });
  readonly minFreq = input(20, { transform: numberAttribute });
  readonly maxFreq = input(20000, { transform: numberAttribute });
  readonly minGain = input(-24, { transform: numberAttribute });
  readonly maxGain = input(24, { transform: numberAttribute });
  readonly variant = input<EQVariant>('default');
  readonly showGrid = input(true);
  readonly showLabels = input(true);
  readonly showCurve = input(true);
  readonly interactive = input(true);
  readonly analyserNode = input<AnalyserNode | undefined>(undefined);
  readonly classOverride = input('');

  readonly bandChange = output<EQBandChange>();
  readonly bandsChange = output<EQBand[]>();

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;

  protected readonly selectedBandId = signal<string | null>(null);
  protected readonly isDragging = signal(false);
  protected readonly dragType = signal<'frequency' | 'gain' | 'q' | null>(null);
  protected readonly hoverBandId = signal<string | null>(null);

  protected readonly colors = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'dark':
        return {
          background: '#0F172A',
          grid: '#334155',
          gridText: '#64748B',
          curve: '#3B82F6',
          curveFill: 'rgba(59, 130, 246, 0.2)',
          spectrum: 'rgba(59, 130, 246, 0.3)',
        };
      case 'vintage':
        return {
          background: '#1C1917',
          grid: '#44403C',
          gridText: '#78716C',
          curve: '#F59E0B',
          curveFill: 'rgba(245, 158, 11, 0.2)',
          spectrum: 'rgba(245, 158, 11, 0.3)',
        };
      case 'neon':
        return {
          background: '#000000',
          grid: '#1E1E1E',
          gridText: '#666666',
          curve: '#00FFFF',
          curveFill: 'rgba(0, 255, 255, 0.15)',
          spectrum: 'rgba(255, 0, 255, 0.3)',
        };
      default:
        return {
          background: '#1E293B',
          grid: '#475569',
          gridText: '#94A3B8',
          curve: '#10B981',
          curveFill: 'rgba(16, 185, 129, 0.2)',
          spectrum: 'rgba(16, 185, 129, 0.3)',
        };
    }
  });

  protected readonly containerClasses = computed(() => {
    const base = 'relative rounded-lg overflow-hidden';
    return [base, this.classOverride()].filter(Boolean).join(' ');
  });

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    const analyser = this.analyserNode();
    if (analyser) {
      this.frequencyData = new Uint8Array(analyser.frequencyBinCount);
    }

    this.draw();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.interactive()) return;

    const pos = this.getCanvasPosition(event);
    const band = this.findBandAtPosition(pos.x, pos.y);

    if (band) {
      this.selectedBandId.set(band.id);
      this.isDragging.set(true);
      this.dragType.set(event.shiftKey ? 'q' : 'gain');
      event.preventDefault();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const pos = this.getCanvasPosition(event);

    if (this.isDragging() && this.selectedBandId()) {
      this.handleDrag(pos.x, pos.y, event.shiftKey);
    } else {
      const band = this.findBandAtPosition(pos.x, pos.y);
      this.hoverBandId.set(band?.id ?? null);
    }
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp(): void {
    this.isDragging.set(false);
    this.dragType.set(null);
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    if (!this.interactive()) return;

    const pos = this.getCanvasPosition(event);
    const band = this.findBandAtPosition(pos.x, pos.y);

    if (band) {
      // Reset band to 0 gain on double-click
      const updatedBands = this.bands().map((b) =>
        b.id === band.id ? { ...b, gain: 0 } : b
      );
      this.bandsChange.emit(updatedBands);
      this.bandChange.emit({ band: { ...band, gain: 0 }, property: 'gain' });
    }
  }

  private handleDrag(x: number, y: number, shiftKey: boolean): void {
    const bandId = this.selectedBandId();
    if (!bandId) return;

    const currentBands = this.bands();
    const bandIndex = currentBands.findIndex((b) => b.id === bandId);
    if (bandIndex === -1) return;

    const band = currentBands[bandIndex];
    const freq = this.xToFrequency(x);
    const gain = this.yToGain(y);

    let updatedBand: EQBand;
    let property: 'frequency' | 'gain' | 'q';

    if (shiftKey || this.dragType() === 'q') {
      // Adjust Q based on vertical distance from center
      const centerY = this.height() / 2;
      const distance = Math.abs(y - centerY);
      const q = Math.max(0.1, Math.min(18, distance / 10));
      updatedBand = { ...band, q };
      property = 'q';
    } else {
      // Adjust frequency and gain
      updatedBand = {
        ...band,
        frequency: Math.max(this.minFreq(), Math.min(this.maxFreq(), freq)),
        gain: Math.max(this.minGain(), Math.min(this.maxGain(), gain)),
      };
      property = 'frequency';
    }

    const updatedBands = [...currentBands];
    updatedBands[bandIndex] = updatedBand;

    this.bandsChange.emit(updatedBands);
    this.bandChange.emit({ band: updatedBand, property });
  }

  private draw(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const width = this.width();
    const height = this.height();
    const colors = this.colors();

    canvas.width = width;
    canvas.height = height;

    // Clear and fill background
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, width, height);

    // Draw spectrum analyzer if available
    const analyser = this.analyserNode();
    if (analyser && this.frequencyData) {
      analyser.getByteFrequencyData(this.frequencyData);
      this.drawSpectrum(colors.spectrum);
    }

    // Draw grid
    if (this.showGrid()) {
      this.drawGrid(colors.grid, colors.gridText);
    }

    // Draw EQ curve
    if (this.showCurve()) {
      this.drawEQCurve(colors.curve, colors.curveFill);
    }

    // Draw band nodes
    this.drawBandNodes();

    // Request next frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  private drawGrid(gridColor: string, textColor: string): void {
    if (!this.ctx) return;

    const width = this.width();
    const height = this.height();

    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 0.5;

    // Frequency lines (logarithmic scale)
    const freqLines = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    for (const freq of freqLines) {
      if (freq < this.minFreq() || freq > this.maxFreq()) continue;
      const x = this.frequencyToX(freq);
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();

      if (this.showLabels()) {
        this.ctx.fillStyle = textColor;
        this.ctx.font = '10px system-ui';
        this.ctx.textAlign = 'center';
        const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
        this.ctx.fillText(label, x, height - 4);
      }
    }

    // Gain lines
    const gainLines = [-18, -12, -6, 0, 6, 12, 18];
    for (const gain of gainLines) {
      const y = this.gainToY(gain);
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();

      if (this.showLabels()) {
        this.ctx.fillStyle = textColor;
        this.ctx.font = '10px system-ui';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${gain > 0 ? '+' : ''}${gain}`, 4, y - 2);
      }
    }

    // 0dB center line (thicker)
    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 1;
    const centerY = this.gainToY(0);
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(width, centerY);
    this.ctx.stroke();
  }

  private drawSpectrum(color: string): void {
    if (!this.ctx || !this.frequencyData) return;

    const width = this.width();
    const height = this.height();
    const bufferLength = this.frequencyData.length;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);

    for (let i = 0; i < bufferLength; i++) {
      const freq = (i / bufferLength) * (this.maxFreq() - this.minFreq()) + this.minFreq();
      const x = this.frequencyToX(freq);
      const value = this.frequencyData[i] / 255;
      const y = height - value * height;
      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(width, height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawEQCurve(strokeColor: string, fillColor: string): void {
    if (!this.ctx) return;

    const width = this.width();
    const height = this.height();
    const bands = this.bands();

    // Calculate combined frequency response
    const points: { x: number; y: number }[] = [];
    const numPoints = 200;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;
      const freq = this.xToFrequency(x);
      let totalGain = 0;

      for (const band of bands) {
        if (!band.enabled) continue;
        totalGain += this.calculateBandResponse(freq, band);
      }

      const y = this.gainToY(totalGain);
      points.push({ x, y });
    }

    // Draw filled area
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.gainToY(0));
    for (const point of points) {
      this.ctx.lineTo(point.x, point.y);
    }
    this.ctx.lineTo(width, this.gainToY(0));
    this.ctx.closePath();
    this.ctx.fill();

    // Draw curve line
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
  }

  private drawBandNodes(): void {
    if (!this.ctx) return;

    const bands = this.bands();
    const selectedId = this.selectedBandId();
    const hoverId = this.hoverBandId();

    for (const band of bands) {
      if (!band.enabled) continue;

      const x = this.frequencyToX(band.frequency);
      const y = this.gainToY(band.gain);
      const isSelected = band.id === selectedId;
      const isHovered = band.id === hoverId;
      const radius = isSelected || isHovered ? 10 : 8;

      // Draw Q indicator (vertical line)
      const qHeight = Math.min(80, band.q * 8);
      this.ctx.strokeStyle = band.color || '#fff';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([2, 2]);
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - qHeight / 2);
      this.ctx.lineTo(x, y + qHeight / 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Draw node circle
      this.ctx.fillStyle = band.color || '#fff';
      this.ctx.strokeStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.5)';
      this.ctx.lineWidth = isSelected ? 3 : 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw frequency label if hovered or selected
      if (isHovered || isSelected) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '11px system-ui';
        this.ctx.textAlign = 'center';
        const freqLabel = band.frequency >= 1000 ? `${(band.frequency / 1000).toFixed(1)}kHz` : `${Math.round(band.frequency)}Hz`;
        const gainLabel = `${band.gain > 0 ? '+' : ''}${band.gain.toFixed(1)}dB`;
        this.ctx.fillText(freqLabel, x, y - radius - 14);
        this.ctx.fillText(gainLabel, x, y - radius - 2);
      }
    }
  }

  private calculateBandResponse(freq: number, band: EQBand): number {
    // Simplified bell curve approximation
    const logFreq = Math.log10(freq);
    const logBandFreq = Math.log10(band.frequency);
    const bandwidth = 1 / band.q;

    switch (band.type) {
      case 'peaking':
      case 'bandpass': {
        const distance = Math.abs(logFreq - logBandFreq);
        const response = Math.exp(-distance * distance / (bandwidth * bandwidth));
        return band.gain * response;
      }
      case 'lowshelf': {
        const transition = (logFreq - logBandFreq) / bandwidth;
        const response = 1 / (1 + Math.exp(transition * 4));
        return band.gain * response;
      }
      case 'highshelf': {
        const transition = (logFreq - logBandFreq) / bandwidth;
        const response = 1 / (1 + Math.exp(-transition * 4));
        return band.gain * response;
      }
      case 'lowpass': {
        if (freq > band.frequency) {
          const rolloff = Math.pow(band.frequency / freq, band.q * 2);
          return -24 * (1 - rolloff);
        }
        return 0;
      }
      case 'highpass': {
        if (freq < band.frequency) {
          const rolloff = Math.pow(freq / band.frequency, band.q * 2);
          return -24 * (1 - rolloff);
        }
        return 0;
      }
      case 'notch': {
        const distance = Math.abs(logFreq - logBandFreq);
        const response = 1 - Math.exp(-distance * distance / (bandwidth * bandwidth * 0.1));
        return band.gain * (1 - response);
      }
      default:
        return 0;
    }
  }

  private frequencyToX(freq: number): number {
    const minLog = Math.log10(this.minFreq());
    const maxLog = Math.log10(this.maxFreq());
    const freqLog = Math.log10(freq);
    return ((freqLog - minLog) / (maxLog - minLog)) * this.width();
  }

  private xToFrequency(x: number): number {
    const minLog = Math.log10(this.minFreq());
    const maxLog = Math.log10(this.maxFreq());
    const ratio = x / this.width();
    return Math.pow(10, minLog + ratio * (maxLog - minLog));
  }

  private gainToY(gain: number): number {
    const height = this.height();
    const range = this.maxGain() - this.minGain();
    return height / 2 - (gain / range) * height;
  }

  private yToGain(y: number): number {
    const height = this.height();
    const range = this.maxGain() - this.minGain();
    return ((height / 2 - y) / height) * range;
  }

  private getCanvasPosition(event: MouseEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private findBandAtPosition(x: number, y: number): EQBand | null {
    const bands = this.bands();
    const hitRadius = 15;

    for (const band of bands) {
      if (!band.enabled) continue;

      const bandX = this.frequencyToX(band.frequency);
      const bandY = this.gainToY(band.gain);
      const distance = Math.sqrt((x - bandX) ** 2 + (y - bandY) ** 2);

      if (distance <= hitRadius) {
        return band;
      }
    }

    return null;
  }

  protected toggleBand(band: EQBand): void {
    const updatedBands = this.bands().map((b) =>
      b.id === band.id ? { ...b, enabled: !b.enabled } : b
    );
    this.bandsChange.emit(updatedBands);
    this.bandChange.emit({ band: { ...band, enabled: !band.enabled }, property: 'enabled' });
  }

  protected selectBand(band: EQBand): void {
    this.selectedBandId.set(band.id);
  }
}

