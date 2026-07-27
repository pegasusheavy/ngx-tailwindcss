import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type OscilloscopeVariant = 'default' | 'retro' | 'neon' | 'minimal';
export type OscilloscopeTriggerMode = 'auto' | 'normal' | 'single';

@Component({
  selector: 'tw-oscilloscope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oscilloscope.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwOscilloscopeComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);

  readonly analyserNode = input<AnalyserNode | undefined>(undefined);
  readonly width = input(400, { transform: numberAttribute });
  readonly height = input(200, { transform: numberAttribute });
  readonly variant = input<OscilloscopeVariant>('default');
  readonly lineWidth = input(2, { transform: numberAttribute });
  readonly showGrid = input(true);
  readonly showCenterLine = input(true);
  readonly showLabels = input(false);
  readonly triggerLevel = input(0.5, { transform: numberAttribute }); // 0-1
  readonly triggerMode = input<OscilloscopeTriggerMode>('auto');
  readonly timeScale = input(1, { transform: numberAttribute }); // Zoom factor
  readonly gain = input(1, { transform: numberAttribute }); // Amplitude multiplier
  readonly classOverride = input('');

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private singleFrozen = false;

  protected readonly colors = computed(() => {
    const variant = this.variant();

    const schemes: Record<
      OscilloscopeVariant,
      {
        background: string;
        grid: string;
        line: string;
        centerLine: string;
        glow?: string;
      }
    > = {
      default: {
        background: '#0F172A',
        grid: '#1E3A5F',
        line: '#22D3EE',
        centerLine: '#334155',
      },
      retro: {
        background: '#0A1A0A',
        grid: '#1A3A1A',
        line: '#00FF00',
        centerLine: '#0A2A0A',
        glow: '#00FF0066',
      },
      neon: {
        background: '#0A000A',
        grid: '#2A0A2A',
        line: '#FF00FF',
        centerLine: '#1A001A',
        glow: '#FF00FF66',
      },
      minimal: {
        background: '#FFFFFF',
        grid: '#E2E8F0',
        line: '#3B82F6',
        centerLine: '#CBD5E1',
      },
    };

    return schemes[variant];
  });

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-lg overflow-hidden';
    return [base, this.classOverride()].filter(Boolean).join(' ');
  });

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.setupAnalyser();
    this.restartDraw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['analyserNode']) {
      this.setupAnalyser();
    }
    // Restart the loop: covers late-bound analysers and redraws the static
    // no-signal frame after size/variant changes
    if (this.ctx) {
      this.restartDraw();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private setupAnalyser(): void {
    const analyser = this.analyserNode();
    if (analyser) {
      // Adapt to the node's existing configuration instead of mutating the
      // caller's shared analyser (fftSize is left untouched).
      this.dataArray = new Uint8Array(analyser.fftSize);
    }
  }

  /** Re-arm a frozen 'single' trigger sweep and resume drawing. */
  rearm(): void {
    this.singleFrozen = false;
    if (this.ctx) {
      this.restartDraw();
    }
  }

  private restartDraw(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    // Draw loop never writes template state, so keep it out of the zone
    this.zone.runOutsideAngular(() => {
      this.draw();
    });
  }

  private draw(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const width = this.width();
    const height = this.height();

    // Only resize the canvas when dimensions actually change (resizing resets context state)
    if (canvas.width !== width) {
      canvas.width = width;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }

    const analyser = this.analyserNode();
    const colors = this.colors();

    // Clear and draw background
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (this.showGrid()) {
      this.drawGrid();
    }

    // Draw center line
    if (this.showCenterLine()) {
      this.ctx.strokeStyle = colors.centerLine;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, canvas.height / 2);
      this.ctx.lineTo(canvas.width, canvas.height / 2);
      this.ctx.stroke();
    }

    // Draw waveform
    if (!analyser || !this.dataArray) {
      this.drawFlatLine();
      if (this.showLabels()) {
        this.drawLabels();
      }
      // No analyser: the frame is static, so draw once instead of looping
      this.animationFrameId = null;
      return;
    }
    analyser.getByteTimeDomainData(this.dataArray);
    const triggered = this.drawWaveform();

    // Draw labels
    if (this.showLabels()) {
      this.drawLabels();
    }

    // Single-shot mode: freeze after the first triggered sweep (rearm() resumes)
    if (this.triggerMode() === 'single' && triggered) {
      this.singleFrozen = true;
    }
    if (this.singleFrozen && this.triggerMode() === 'single') {
      this.animationFrameId = null;
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.draw();
    });
  }

  private drawGrid(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const colors = this.colors();

    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    const vLines = 10;
    for (let i = 0; i <= vLines; i++) {
      const x = (canvas.width / vLines) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    const hLines = 8;
    for (let i = 0; i <= hLines; i++) {
      const y = (canvas.height / hLines) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawWaveform(): boolean {
    if (!this.ctx || !this.dataArray) return false;

    const canvas = this.canvasRef.nativeElement;
    const colors = this.colors();
    const bufferLength = this.dataArray.length;
    const gain = this.gain();
    const timeScale = this.timeScale();

    // Apply glow effect for retro/neon variants
    if (colors.glow) {
      this.ctx.shadowColor = colors.glow;
      this.ctx.shadowBlur = 10;
    }

    this.ctx.strokeStyle = colors.line;
    this.ctx.lineWidth = this.lineWidth();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();

    const sliceWidth = (canvas.width / bufferLength) * timeScale;
    let x = 0;

    // Find trigger point for stable display
    let triggerIndex = 0;
    let triggered = false;
    if (this.triggerMode() !== 'auto') {
      const triggerLevel = this.triggerLevel() * 255;
      for (let i = 1; i < bufferLength - 1; i++) {
        if (this.dataArray[i] <= triggerLevel && this.dataArray[i + 1] > triggerLevel) {
          triggerIndex = i;
          triggered = true;
          break;
        }
      }
    }

    for (let i = triggerIndex; i < bufferLength && x < canvas.width; i++) {
      const v = (this.dataArray[i] / 128 - 1) * gain;
      const y = (v * canvas.height) / 2 + canvas.height / 2;

      if (i === triggerIndex) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.stroke();

    // Reset shadow
    this.ctx.shadowBlur = 0;

    return triggered;
  }

  private drawFlatLine(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const colors = this.colors();

    this.ctx.strokeStyle = `${colors.line}40`; // Faded
    this.ctx.lineWidth = this.lineWidth();
    this.ctx.beginPath();
    this.ctx.moveTo(0, canvas.height / 2);
    this.ctx.lineTo(canvas.width, canvas.height / 2);
    this.ctx.stroke();

    // "No signal" text
    this.ctx.fillStyle = `${colors.line}80`;
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('No Signal', canvas.width / 2, canvas.height / 2 - 20);
  }

  private drawLabels(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const colors = this.colors();

    this.ctx.fillStyle = colors.line;
    this.ctx.font = '10px monospace';
    this.ctx.textAlign = 'left';

    // Time labels derived from the actual buffer length and sample rate
    this.ctx.fillText('0ms', 4, canvas.height - 4);
    this.ctx.textAlign = 'right';
    const sampleRate = this.analyserNode()?.context.sampleRate ?? 44_100;
    const sampleCount = this.dataArray?.length ?? 1024;
    const timeMs = (sampleCount / sampleRate) * 1000 * this.timeScale();
    this.ctx.fillText(`${timeMs.toFixed(1)}ms`, canvas.width - 4, canvas.height - 4);

    // Amplitude labels
    this.ctx.textAlign = 'left';
    this.ctx.fillText('+1', 4, 12);
    this.ctx.fillText('-1', 4, canvas.height - 12);
  }
}
