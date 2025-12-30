import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type WaveformVariant = 'bars' | 'line' | 'mirror' | 'gradient';
export type WaveformColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'mono';
export type WaveformMode = 'static' | 'realtime';
export type WaveformSize = 'mini' | 'sm' | 'md' | 'lg' | 'auto';

// Size presets for different display contexts
interface SizePreset {
  width: number;
  height: number;
  barWidth: number;
  barGap: number;
  barRadius: number;
}

const SIZE_PRESETS: Record<Exclude<WaveformSize, 'auto'>, SizePreset> = {
  mini: { width: 100, height: 24, barWidth: 1, barGap: 1, barRadius: 0 },
  sm: { width: 200, height: 48, barWidth: 2, barGap: 1, barRadius: 1 },
  md: { width: 400, height: 80, barWidth: 3, barGap: 1, barRadius: 1 },
  lg: { width: 600, height: 128, barWidth: 3, barGap: 2, barRadius: 2 },
};

interface WaveformColors {
  primary: string;
  secondary: string;
  background: string;
  progress: string;
}

const COLOR_SCHEMES: Record<WaveformColorScheme, WaveformColors> = {
  blue: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#1e293b',
    progress: '#2563eb',
  },
  green: {
    primary: '#22c55e',
    secondary: '#4ade80',
    background: '#1e293b',
    progress: '#16a34a',
  },
  purple: {
    primary: '#a855f7',
    secondary: '#c084fc',
    background: '#1e293b',
    progress: '#9333ea',
  },
  orange: {
    primary: '#f97316',
    secondary: '#fb923c',
    background: '#1e293b',
    progress: '#ea580c',
  },
  mono: {
    primary: '#94a3b8',
    secondary: '#cbd5e1',
    background: '#0f172a',
    progress: '#64748b',
  },
};

/**
 * Waveform visualization component for audio
 *
 * @example
 * ```html
 * <tw-waveform [audioBuffer]="buffer" [progress]="0.5"></tw-waveform>
 * <tw-waveform [peaks]="peakData" variant="mirror" colorScheme="green"></tw-waveform>
 * ```
 */
@Component({
  selector: 'tw-waveform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waveform.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwWaveformComponent implements AfterViewInit, OnChanges {
  private readonly twClass = inject(TwClassService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('waveformCanvas');

  // Data inputs
  readonly audioBuffer = input<AudioBuffer | null>(null);
  readonly peaks = input<number[]>([]);
  readonly duration = input(0);

  // Real-time mode inputs
  readonly mode = input<WaveformMode>('static'); // 'static' or 'realtime'
  readonly analyserNode = input<AnalyserNode | null>(null); // For real-time mode
  readonly fftSize = input(2048); // FFT size for real-time analysis
  readonly smoothing = input(0.8); // Smoothing factor for real-time
  readonly showTriggerLine = input(false); // Show center trigger line in realtime mode
  readonly gain = input(1); // Amplitude gain for realtime mode

  // Display options
  readonly size = input<WaveformSize>('auto'); // 'mini', 'sm', 'md', 'lg', or 'auto'
  readonly width = input(600);
  readonly height = input(128);
  readonly variant = input<WaveformVariant>('bars');
  readonly colorScheme = input<WaveformColorScheme>('blue');
  readonly barWidth = input(3);
  readonly barGap = input(1);
  readonly barRadius = input(1);
  readonly responsive = input(false); // Enable responsive width

  // Playback state
  readonly progress = input(0);
  readonly showProgress = input(true);
  readonly showPlayhead = input(true);
  readonly showTime = input(true);
  readonly showHoverTime = input(true);

  // Interaction
  readonly seekable = input(true);
  readonly selectable = input(false);

  // Zoom and pan
  readonly zoomable = input(false);
  readonly showZoomControls = input(true);
  readonly minZoom = input(1);
  readonly maxZoom = input(16);
  readonly zoomStep = input(2); // Multiplier for zoom in/out
  readonly pannable = input(true); // Allow panning when zoomed
  readonly wheelZoom = input(true); // Zoom with mouse wheel
  readonly pinchZoom = input(true); // Pinch-to-zoom on touch devices

  // Class override
  readonly classOverride = input('');

  // Outputs
  readonly seek = output<number>();
  readonly regionSelect = output<{ start: number; end: number }>();
  readonly zoomChange = output<number>();
  readonly panChange = output<number>();
  readonly viewRangeChange = output<{ start: number; end: number }>();

  // Internal state
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hoverPosition = signal<number | null>(null);
  protected readonly selectionStart = signal<number | null>(null);
  protected readonly selectionEnd = signal<number | null>(null);
  protected readonly isDragging = signal(false);

  // Zoom and pan state
  protected readonly zoomLevel = signal(1);
  protected readonly panPosition = signal(0); // 0-1, represents left edge of visible area
  protected readonly isPanning = signal(false);
  private panStartX = 0;
  private panStartPosition = 0;
  private lastPinchDistance = 0;

  private ctx: CanvasRenderingContext2D | null = null;
  private peakData: number[] = [];
  private animationFrame: number | null = null;

  // Real-time mode data
  private timeDomainData: Uint8Array<ArrayBuffer> | null = null;
  private isRealTimeRunning = false;

  // For template
  protected readonly Math = Math;

  constructor() {
    // Redraw when progress changes
    effect(() => {
      const _ = this.progress();
      this.draw();
    });
  }

  ngAfterViewInit(): void {
    this.initCanvas();

    if (this.mode() === 'realtime') {
      this.setupRealTimeMode();
    } else {
      this.processPeaks();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioBuffer'] || changes['peaks']) {
      if (this.mode() === 'static') {
        this.processPeaks();
      }
    }
    if (changes['width'] || changes['height'] || changes['variant'] || changes['colorScheme']) {
      this.draw();
    }
    if (changes['mode']) {
      if (this.mode() === 'realtime') {
        this.setupRealTimeMode();
      } else {
        this.stopRealTimeMode();
        this.processPeaks();
      }
    }
    if (changes['analyserNode'] && this.mode() === 'realtime') {
      this.setupRealTimeMode();
    }
  }

  // Computed values - Size-aware dimensions
  protected readonly effectiveWidth = computed(() => {
    const sizeVal = this.size();
    if (sizeVal !== 'auto' && SIZE_PRESETS[sizeVal]) {
      return SIZE_PRESETS[sizeVal].width;
    }
    return this.width();
  });

  protected readonly effectiveHeight = computed(() => {
    const sizeVal = this.size();
    if (sizeVal !== 'auto' && SIZE_PRESETS[sizeVal]) {
      return SIZE_PRESETS[sizeVal].height;
    }
    return this.height();
  });

  protected readonly effectiveBarWidth = computed(() => {
    const sizeVal = this.size();
    if (sizeVal !== 'auto' && SIZE_PRESETS[sizeVal]) {
      return SIZE_PRESETS[sizeVal].barWidth;
    }
    return this.barWidth();
  });

  protected readonly effectiveBarGap = computed(() => {
    const sizeVal = this.size();
    if (sizeVal !== 'auto' && SIZE_PRESETS[sizeVal]) {
      return SIZE_PRESETS[sizeVal].barGap;
    }
    return this.barGap();
  });

  protected readonly effectiveBarRadius = computed(() => {
    const sizeVal = this.size();
    if (sizeVal !== 'auto' && SIZE_PRESETS[sizeVal]) {
      return SIZE_PRESETS[sizeVal].barRadius;
    }
    return this.barRadius();
  });

  protected readonly isMini = computed(() => this.size() === 'mini');

  // Zoom and pan computed values
  protected readonly isZoomed = computed(() => this.zoomLevel() > 1);

  protected readonly visibleRange = computed(() => {
    const zoom = this.zoomLevel();
    const pan = this.panPosition();
    const visibleWidth = 1 / zoom;
    const start = pan;
    const end = Math.min(1, pan + visibleWidth);
    return { start, end, width: visibleWidth };
  });

  protected readonly zoomPercent = computed(() => {
    return Math.round(this.zoomLevel() * 100);
  });

  protected readonly canZoomIn = computed(() => {
    return this.zoomable() && this.zoomLevel() < this.maxZoom();
  });

  protected readonly canZoomOut = computed(() => {
    return this.zoomable() && this.zoomLevel() > this.minZoom();
  });

  protected readonly scrollbarWidth = computed(() => {
    // Width of scrollbar thumb as percentage
    return (1 / this.zoomLevel()) * 100;
  });

  protected readonly scrollbarPosition = computed(() => {
    // Position of scrollbar thumb
    return this.panPosition() * (100 - this.scrollbarWidth());
  });

  protected readonly containerClasses = computed(() => {
    const base = 'relative overflow-hidden';
    const sizeClasses = this.isMini() ? 'rounded' : 'rounded-lg';
    const responsiveClasses = this.responsive() ? 'w-full' : '';
    return this.twClass.merge(base, sizeClasses, responsiveClasses, this.classOverride());
  });

  protected readonly canvasClasses = computed(() => {
    return this.twClass.merge(
      'block',
      this.seekable() ? 'cursor-pointer' : ''
    );
  });

  protected readonly colors = computed(() => COLOR_SCHEMES[this.colorScheme()]);

  // Canvas initialization
  private initCanvas(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;

    this.ctx = canvasEl.getContext('2d');
    this.draw();
  }

  // Process audio data into peaks
  private processPeaks(): void {
    const buffer = this.audioBuffer();
    const inputPeaks = this.peaks();

    if (inputPeaks.length > 0) {
      this.peakData = inputPeaks;
      this.draw();
      return;
    }

    if (!buffer) {
      this.peakData = [];
      this.draw();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const channelData = buffer.getChannelData(0);
      const sampleRate = buffer.sampleRate;
      const samplesPerPixel = Math.floor(channelData.length / this.effectiveWidth());

      this.peakData = [];

      for (let i = 0; i < this.effectiveWidth(); i++) {
        const start = i * samplesPerPixel;
        const end = start + samplesPerPixel;
        let max = 0;

        for (let j = start; j < end && j < channelData.length; j++) {
          const abs = Math.abs(channelData[j]);
          if (abs > max) max = abs;
        }

        this.peakData.push(max);
      }

      this.loading.set(false);
      this.draw();
    } catch {
      this.loading.set(false);
      this.error.set('Failed to process audio data');
    }
  }

  // Real-time mode setup
  private setupRealTimeMode(): void {
    const analyser = this.analyserNode();
    if (!analyser) {
      this.drawEmpty();
      return;
    }

    // Configure analyser
    analyser.fftSize = this.fftSize();
    analyser.smoothingTimeConstant = this.smoothing();

    // Create data buffer
    this.timeDomainData = new Uint8Array(analyser.fftSize) as Uint8Array<ArrayBuffer>;

    // Start real-time loop
    this.isRealTimeRunning = true;
    this.drawRealTime();
  }

  private stopRealTimeMode(): void {
    this.isRealTimeRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private drawRealTime(): void {
    if (!this.isRealTimeRunning || !this.ctx) return;

    const analyser = this.analyserNode();
    if (!analyser || !this.timeDomainData) {
      this.animationFrame = requestAnimationFrame(() => this.drawRealTime());
      return;
    }

    // Get time domain data
    analyser.getByteTimeDomainData(this.timeDomainData);

    const variant = this.variant();
    switch (variant) {
      case 'bars':
        this.drawRealTimeBars();
        break;
      case 'line':
        this.drawRealTimeLine();
        break;
      case 'mirror':
        this.drawRealTimeMirror();
        break;
      case 'gradient':
        this.drawRealTimeGradient();
        break;
    }

    // Continue animation loop
    this.animationFrame = requestAnimationFrame(() => this.drawRealTime());
  }

  private drawRealTimeLine(): void {
    if (!this.ctx || !this.timeDomainData) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const bufferLength = this.timeDomainData.length;
    const gainValue = this.gain();

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    // Draw trigger line
    if (this.showTriggerLine()) {
      this.ctx.strokeStyle = `${colors.primary}30`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, h / 2);
      this.ctx.lineTo(w, h / 2);
      this.ctx.stroke();
    }

    // Draw waveform
    this.ctx.strokeStyle = colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();

    const sliceWidth = w / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // Convert byte (0-255) to normalized (-1 to 1)
      const v = ((this.timeDomainData[i] / 128.0) - 1) * gainValue;
      const y = (v * h) / 2 + h / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.stroke();
  }

  private drawRealTimeBars(): void {
    if (!this.ctx || !this.timeDomainData) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const bufferLength = this.timeDomainData.length;
    const barW = this.effectiveBarWidth();
    const gap = this.effectiveBarGap();
    const radius = this.effectiveBarRadius();
    const gainValue = this.gain();

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    const barCount = Math.floor(w / (barW + gap));
    const samplesPerBar = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const x = i * (barW + gap);

      // Get max amplitude for this bar
      let maxAmp = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        const idx = i * samplesPerBar + j;
        if (idx < bufferLength) {
          const v = Math.abs((this.timeDomainData[idx] / 128.0) - 1);
          if (v > maxAmp) maxAmp = v;
        }
      }

      maxAmp *= gainValue;
      const barH = Math.max(2, maxAmp * (h - 4));
      const y = (h - barH) / 2;

      this.ctx.fillStyle = colors.primary;
      this.roundRect(x, y, barW, barH, radius);
    }
  }

  private drawRealTimeMirror(): void {
    if (!this.ctx || !this.timeDomainData) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const bufferLength = this.timeDomainData.length;
    const gainValue = this.gain();

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    const centerY = h / 2;
    const sliceWidth = w / bufferLength;

    // Draw mirrored waveform
    this.ctx.beginPath();

    // Top half
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = Math.abs((this.timeDomainData[i] / 128.0) - 1) * gainValue;
      const y = centerY - v * (h / 2 - 2);

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    // Bottom half (mirror)
    for (let i = bufferLength - 1; i >= 0; i--) {
      const v = Math.abs((this.timeDomainData[i] / 128.0) - 1) * gainValue;
      const xPos = (i / bufferLength) * w;
      const y = centerY + v * (h / 2 - 2);
      this.ctx.lineTo(xPos, y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = `${colors.primary}80`;
    this.ctx.fill();
  }

  private drawRealTimeGradient(): void {
    if (!this.ctx || !this.timeDomainData) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const bufferLength = this.timeDomainData.length;
    const gainValue = this.gain();

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.primary);

    const centerY = h / 2;
    const sliceWidth = w / bufferLength;

    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);

    // Top path
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = Math.abs((this.timeDomainData[i] / 128.0) - 1) * gainValue;
      const y = centerY - v * (h / 2 - 2);
      this.ctx.lineTo(x, y);
      x += sliceWidth;
    }

    this.ctx.lineTo(w, centerY);

    // Bottom path (mirror)
    for (let i = bufferLength - 1; i >= 0; i--) {
      const v = Math.abs((this.timeDomainData[i] / 128.0) - 1) * gainValue;
      const xPos = (i / bufferLength) * w;
      const y = centerY + v * (h / 2 - 2);
      this.ctx.lineTo(xPos, y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  // Drawing methods
  private draw(): void {
    // In realtime mode, drawing is handled by drawRealTime loop
    if (this.mode() === 'realtime') return;

    if (!this.ctx || this.peakData.length === 0) {
      this.drawEmpty();
      return;
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      const variant = this.variant();
      switch (variant) {
        case 'bars': {
          this.drawBars();
          break;
        }
        case 'line': {
          this.drawLine();
          break;
        }
        case 'mirror': {
          this.drawMirror();
          break;
        }
        case 'gradient': {
          this.drawGradient();
          break;
        }
      }
    });
  }

  private drawEmpty(): void {
    if (!this.ctx) return;

    const colors = this.colors();
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, this.effectiveWidth(), this.effectiveHeight());

    // Draw center line
    this.ctx.strokeStyle = `${colors.primary}40`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.effectiveHeight() / 2);
    this.ctx.lineTo(this.effectiveWidth(), this.effectiveHeight() / 2);
    this.ctx.stroke();
  }

  private drawBars(): void {
    if (!this.ctx) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const progress = this.progress();
    const barW = this.effectiveBarWidth();
    const gap = this.effectiveBarGap();
    const radius = this.effectiveBarRadius();
    const { start: viewStart, end: viewEnd } = this.visibleRange();

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    const barCount = Math.floor(w / (barW + gap));
    const viewWidth = viewEnd - viewStart;

    for (let i = 0; i < barCount; i++) {
      const x = i * (barW + gap);

      // Calculate which part of the full waveform this bar represents
      const barStartNorm = viewStart + (i / barCount) * viewWidth;
      const barEndNorm = viewStart + ((i + 1) / barCount) * viewWidth;

      // Map to peak data indices
      const startIdx = Math.floor(barStartNorm * this.peakData.length);
      const endIdx = Math.ceil(barEndNorm * this.peakData.length);

      // Get max peak for this bar
      let peak = 0;
      for (let j = startIdx; j < endIdx && j < this.peakData.length; j++) {
        if (j >= 0) {
          peak = Math.max(peak, this.peakData[j]);
        }
      }

      const barH = Math.max(2, peak * (h - 4));
      const y = (h - barH) / 2;

      // Color based on progress (convert progress to view coordinates)
      const progressInView = (progress - viewStart) / viewWidth;
      const progressX = progressInView * w;
      this.ctx.fillStyle = x < progressX ? colors.progress : colors.primary;

      // Draw rounded bar
      this.roundRect(x, y, barW, barH, radius);
    }
  }

  private drawLine(): void {
    if (!this.ctx) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const progress = this.progress();
    const { start: viewStart, end: viewEnd } = this.visibleRange();
    const viewWidth = viewEnd - viewStart;

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    const centerY = h / 2;

    // Calculate visible range of peak data
    const startIdx = Math.floor(viewStart * this.peakData.length);
    const endIdx = Math.ceil(viewEnd * this.peakData.length);

    // Draw waveform line
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);

    for (let i = startIdx; i <= endIdx && i < this.peakData.length; i++) {
      if (i < 0) continue;
      const normalizedPos = i / this.peakData.length;
      const x = ((normalizedPos - viewStart) / viewWidth) * w;
      const y = centerY - this.peakData[i] * (h / 2 - 2);
      this.ctx.lineTo(x, y);
    }

    this.ctx.strokeStyle = colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw progress overlay (convert progress to view coordinates)
    const progressInView = (progress - viewStart) / viewWidth;
    if (progressInView > 0 && progressInView < 1) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(0, 0, progressInView * w, h);
      this.ctx.clip();

      this.ctx.beginPath();
      this.ctx.moveTo(0, centerY);
      for (let i = startIdx; i <= endIdx && i < this.peakData.length; i++) {
        if (i < 0) continue;
        const normalizedPos = i / this.peakData.length;
        const x = ((normalizedPos - viewStart) / viewWidth) * w;
        const y = centerY - this.peakData[i] * (h / 2 - 2);
        this.ctx.lineTo(x, y);
      }
      this.ctx.strokeStyle = colors.progress;
      this.ctx.stroke();

      this.ctx.restore();
    }
  }

  private drawMirror(): void {
    if (!this.ctx) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const progress = this.progress();
    const { start: viewStart, end: viewEnd } = this.visibleRange();
    const viewWidth = viewEnd - viewStart;

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    const centerY = h / 2;
    const startIdx = Math.floor(viewStart * this.peakData.length);
    const endIdx = Math.ceil(viewEnd * this.peakData.length);

    // Draw mirrored waveform
    this.ctx.beginPath();

    // Top half
    let first = true;
    for (let i = startIdx; i <= endIdx && i < this.peakData.length; i++) {
      if (i < 0) continue;
      const normalizedPos = i / this.peakData.length;
      const x = ((normalizedPos - viewStart) / viewWidth) * w;
      const y = centerY - this.peakData[i] * (h / 2 - 2);
      if (first) {
        this.ctx.moveTo(x, y);
        first = false;
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    // Bottom half (reversed)
    for (let i = Math.min(endIdx, this.peakData.length - 1); i >= startIdx && i >= 0; i--) {
      const normalizedPos = i / this.peakData.length;
      const x = ((normalizedPos - viewStart) / viewWidth) * w;
      const y = centerY + this.peakData[i] * (h / 2 - 2);
      this.ctx.lineTo(x, y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = `${colors.primary}80`;
    this.ctx.fill();

    // Progress fill
    const progressInView = (progress - viewStart) / viewWidth;
    if (progressInView > 0 && progressInView < 1) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(0, 0, progressInView * w, h);
      this.ctx.clip();

      this.ctx.beginPath();
      first = true;
      for (let i = startIdx; i <= endIdx && i < this.peakData.length; i++) {
        if (i < 0) continue;
        const normalizedPos = i / this.peakData.length;
        const x = ((normalizedPos - viewStart) / viewWidth) * w;
        const y = centerY - this.peakData[i] * (h / 2 - 2);
        if (first) {
          this.ctx.moveTo(x, y);
          first = false;
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      for (let i = Math.min(endIdx, this.peakData.length - 1); i >= startIdx && i >= 0; i--) {
        const normalizedPos = i / this.peakData.length;
        const x = ((normalizedPos - viewStart) / viewWidth) * w;
        const y = centerY + this.peakData[i] * (h / 2 - 2);
        this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = colors.progress;
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  private drawGradient(): void {
    if (!this.ctx) return;

    const colors = this.colors();
    const w = this.effectiveWidth();
    const h = this.effectiveHeight();
    const { start: viewStart, end: viewEnd } = this.visibleRange();
    const viewWidth = viewEnd - viewStart;

    // Clear canvas
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, w, h);

    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.primary);

    const centerY = h / 2;
    const startIdx = Math.floor(viewStart * this.peakData.length);
    const endIdx = Math.ceil(viewEnd * this.peakData.length);

    // Draw filled waveform with gradient
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);

    for (let i = startIdx; i <= endIdx && i < this.peakData.length; i++) {
      if (i < 0) continue;
      const normalizedPos = i / this.peakData.length;
      const x = ((normalizedPos - viewStart) / viewWidth) * w;
      const amplitude = this.peakData[i] * (h / 2 - 2);
      this.ctx.lineTo(x, centerY - amplitude);
    }

    this.ctx.lineTo(w, centerY);

    for (let i = Math.min(endIdx, this.peakData.length - 1); i >= startIdx && i >= 0; i--) {
      const normalizedPos = i / this.peakData.length;
      const x = ((normalizedPos - viewStart) / viewWidth) * w;
      const amplitude = this.peakData[i] * (h / 2 - 2);
      this.ctx.lineTo(x, centerY + amplitude);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
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

  // Event handlers
  onCanvasClick(event: MouseEvent): void {
    if (!this.seekable() || this.selectable()) return;

    const position = this.getPositionFromEvent(event);
    this.seek.emit(position);
  }

  onMouseDown(event: MouseEvent): void {
    if (this.selectable()) {
      this.isDragging.set(true);
      const position = this.getPositionFromEvent(event);
      this.selectionStart.set(position);
      this.selectionEnd.set(position);
    }
  }

  onMouseMove(event: MouseEvent): void {
    const position = this.getPositionFromEvent(event);
    this.hoverPosition.set(position);

    if (this.isDragging() && this.selectable()) {
      this.selectionEnd.set(position);
    }
  }

  onMouseUp(): void {
    if (this.isDragging() && this.selectable()) {
      this.isDragging.set(false);
      const start = this.selectionStart();
      const end = this.selectionEnd();
      if (start !== null && end !== null && Math.abs(end - start) > 0.01) {
        this.regionSelect.emit({
          start: Math.min(start, end),
          end: Math.max(start, end),
        });
      }
    }
  }

  onMouseLeave(): void {
    this.hoverPosition.set(null);
    if (this.isDragging()) {
      this.onMouseUp();
    }
  }

  private getPositionFromEvent(event: MouseEvent): number {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return 0;

    const rect = canvasEl.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));

    // If zoomed, convert to actual position
    if (this.zoomLevel() > 1) {
      const { start, width } = this.visibleRange();
      return start + relativeX * width;
    }

    return relativeX;
  }

  // Zoom methods
  zoomIn(centerPosition?: number): void {
    if (!this.canZoomIn()) return;

    const currentZoom = this.zoomLevel();
    const newZoom = Math.min(this.maxZoom(), currentZoom * this.zoomStep());
    this.setZoom(newZoom, centerPosition);
  }

  zoomOut(centerPosition?: number): void {
    if (!this.canZoomOut()) return;

    const currentZoom = this.zoomLevel();
    const newZoom = Math.max(this.minZoom(), currentZoom / this.zoomStep());
    this.setZoom(newZoom, centerPosition);
  }

  setZoom(zoom: number, centerPosition?: number): void {
    const clampedZoom = Math.max(this.minZoom(), Math.min(this.maxZoom(), zoom));
    const oldZoom = this.zoomLevel();

    if (clampedZoom === oldZoom) return;

    // Calculate new pan position to keep the center point stable
    const center = centerPosition ?? (this.panPosition() + (1 / oldZoom) / 2);
    const newVisibleWidth = 1 / clampedZoom;
    let newPan = center - newVisibleWidth / 2;

    // Clamp pan position
    newPan = Math.max(0, Math.min(1 - newVisibleWidth, newPan));

    this.zoomLevel.set(clampedZoom);
    this.panPosition.set(newPan);

    this.zoomChange.emit(clampedZoom);
    this.emitViewRange();
    this.draw();
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
    this.panPosition.set(0);
    this.zoomChange.emit(1);
    this.panChange.emit(0);
    this.emitViewRange();
    this.draw();
  }

  zoomToRegion(start: number, end: number): void {
    const regionWidth = end - start;
    const newZoom = Math.min(this.maxZoom(), 1 / regionWidth);
    this.zoomLevel.set(newZoom);
    this.panPosition.set(start);
    this.zoomChange.emit(newZoom);
    this.panChange.emit(start);
    this.emitViewRange();
    this.draw();
  }

  // Pan methods
  setPan(position: number): void {
    if (!this.pannable() || this.zoomLevel() <= 1) return;

    const visibleWidth = 1 / this.zoomLevel();
    const clampedPan = Math.max(0, Math.min(1 - visibleWidth, position));

    this.panPosition.set(clampedPan);
    this.panChange.emit(clampedPan);
    this.emitViewRange();
    this.draw();
  }

  panLeft(): void {
    const step = 0.1 / this.zoomLevel();
    this.setPan(this.panPosition() - step);
  }

  panRight(): void {
    const step = 0.1 / this.zoomLevel();
    this.setPan(this.panPosition() + step);
  }

  // Pan to show a specific position (e.g., follow playhead)
  panToPosition(position: number): void {
    const { start, end } = this.visibleRange();
    const margin = 0.1 / this.zoomLevel(); // 10% margin

    if (position < start + margin) {
      this.setPan(position - margin);
    } else if (position > end - margin) {
      this.setPan(position - (1 / this.zoomLevel()) + margin);
    }
  }

  private emitViewRange(): void {
    const { start, end } = this.visibleRange();
    this.viewRangeChange.emit({ start, end });
  }

  // Wheel zoom handler
  onWheel(event: WheelEvent): void {
    if (!this.zoomable() || !this.wheelZoom()) return;

    event.preventDefault();

    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;

    // Calculate center position in actual coordinates
    const { start, width } = this.visibleRange();
    const centerPosition = start + relativeX * width;

    if (event.deltaY < 0) {
      this.zoomIn(centerPosition);
    } else {
      this.zoomOut(centerPosition);
    }
  }

  // Pan drag handlers
  onPanStart(event: MouseEvent | TouchEvent): void {
    if (!this.pannable() || this.zoomLevel() <= 1) return;

    // Only pan with middle mouse button or when holding shift
    const isMouseEvent = 'button' in event;
    if (isMouseEvent && (event as MouseEvent).button !== 1 && !event.shiftKey) return;

    event.preventDefault();
    this.isPanning.set(true);
    this.panStartX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.panStartPosition = this.panPosition();

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isPanning()) return;

      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const canvasEl = this.canvas()?.nativeElement;
      if (!canvasEl) return;

      const rect = canvasEl.getBoundingClientRect();
      const deltaX = (this.panStartX - currentX) / rect.width;
      const deltaPan = deltaX * (1 / this.zoomLevel());

      this.setPan(this.panStartPosition + deltaPan);
    };

    const onEnd = () => {
      this.isPanning.set(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
  }

  // Touch pinch zoom
  onTouchStart(event: TouchEvent): void {
    if (!this.zoomable() || !this.pinchZoom() || event.touches.length !== 2) return;

    event.preventDefault();
    this.lastPinchDistance = this.getPinchDistance(event);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.zoomable() || !this.pinchZoom() || event.touches.length !== 2) return;

    event.preventDefault();
    const currentDistance = this.getPinchDistance(event);

    if (this.lastPinchDistance > 0) {
      const scale = currentDistance / this.lastPinchDistance;
      const newZoom = this.zoomLevel() * scale;

      // Get center of pinch
      const canvasEl = this.canvas()?.nativeElement;
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const relativeX = (centerX - rect.left) / rect.width;
        const { start, width } = this.visibleRange();
        const centerPosition = start + relativeX * width;

        this.setZoom(newZoom, centerPosition);
      }
    }

    this.lastPinchDistance = currentDistance;
  }

  onTouchEnd(): void {
    this.lastPinchDistance = 0;
  }

  private getPinchDistance(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Scrollbar drag handler
  onScrollbarDrag(event: MouseEvent): void {
    if (!this.pannable() || this.zoomLevel() <= 1) return;

    event.preventDefault();

    const scrollbarEl = event.currentTarget as HTMLElement;
    const rect = scrollbarEl.getBoundingClientRect();
    const thumbWidth = this.scrollbarWidth() / 100;
    const availableWidth = 1 - thumbWidth;

    const relativeX = (event.clientX - rect.left) / rect.width;
    const newPan = (relativeX - thumbWidth / 2) / (1 - thumbWidth);

    this.setPan(Math.max(0, Math.min(1 - 1 / this.zoomLevel(), newPan)));
  }

  // Utility
  formatTime(seconds: number): string {
    if (!seconds || !Number.isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Public API
  setProgress(value: number): void {
    // This would be called externally to update progress
    // The input binding handles this automatically
  }

  clearSelection(): void {
    this.selectionStart.set(null);
    this.selectionEnd.set(null);
  }

  /**
   * Connect an AnalyserNode for real-time visualization
   */
  connectAnalyser(analyser: AnalyserNode): void {
    // Update would need to use a writable signal, but since analyserNode is an input,
    // the parent component should update the input binding instead
  }

  /**
   * Start real-time visualization (call when mode is 'realtime')
   */
  startRealTime(): void {
    if (this.mode() === 'realtime' && !this.isRealTimeRunning) {
      this.setupRealTimeMode();
    }
  }

  /**
   * Stop real-time visualization
   */
  stopRealTime(): void {
    this.stopRealTimeMode();
  }

  /**
   * Check if real-time mode is currently running
   */
  isRealTimeActive(): boolean {
    return this.isRealTimeRunning;
  }
}

