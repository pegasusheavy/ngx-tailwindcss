import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export type CompressorMeterVariant = 'default' | 'minimal' | 'studio' | 'vintage' | 'light' | 'highContrast';
export type CompressorMeterSize = 'sm' | 'md' | 'lg';
export type AttackReleaseDisplay = 'none' | 'bars' | 'envelope' | 'graph';

export interface CompressorSettings {
  threshold: number; // dB (-60 to 0)
  ratio: number; // 1:1 to 20:1
  attack: number; // ms
  release: number; // ms
  knee: number; // dB (0 = hard knee)
  makeupGain: number; // dB
}

export interface GainReductionHistoryPoint {
  time: number;
  value: number;
}

// Attack/release time presets for reference
export const AR_TIME_PRESETS = {
  attack: {
    fast: { min: 0.1, max: 5, label: 'Fast' },
    medium: { min: 5, max: 30, label: 'Medium' },
    slow: { min: 30, max: 100, label: 'Slow' },
    verySlow: { min: 100, max: 500, label: 'Very Slow' },
  },
  release: {
    fast: { min: 10, max: 100, label: 'Fast' },
    medium: { min: 100, max: 500, label: 'Medium' },
    slow: { min: 500, max: 1500, label: 'Slow' },
    verySlow: { min: 1500, max: 5000, label: 'Very Slow' },
  },
};

/**
 * Compressor Meter component for visualizing dynamics processing
 *
 * @example
 * ```html
 * <tw-compressor-meter [inputLevel]="-12" [outputLevel]="-6" [gainReduction]="-6"></tw-compressor-meter>
 * <tw-compressor-meter [settings]="compSettings" [showCurve]="true"></tw-compressor-meter>
 * ```
 */
@Component({
  selector: 'tw-compressor-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compressor-meter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwCompressorMeterComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  // Expose Math for template use
  protected readonly Math = Math;

  // Canvas references
  readonly curveCanvas = viewChild<ElementRef<HTMLCanvasElement>>('curveCanvas');
  readonly grHistoryCanvas = viewChild<ElementRef<HTMLCanvasElement>>('grHistoryCanvas');
  readonly envelopeCanvas = viewChild<ElementRef<HTMLCanvasElement>>('envelopeCanvas');

  // Configuration
  readonly variant = input<CompressorMeterVariant>('default');
  readonly size = input<CompressorMeterSize>('md');

  // Level inputs (dB)
  readonly inputLevel = input(0, { transform: numberAttribute }); // -60 to 0
  readonly outputLevel = input(0, { transform: numberAttribute }); // -60 to 0
  readonly gainReduction = input(0, { transform: numberAttribute }); // 0 to -40 (negative values)

  // Compressor settings
  readonly settings = input<CompressorSettings | null>(null);
  readonly threshold = input(-24, { transform: numberAttribute }); // dB
  readonly ratio = input(4, { transform: numberAttribute }); // e.g., 4 for 4:1
  readonly attack = input(10, { transform: numberAttribute }); // ms
  readonly release = input(100, { transform: numberAttribute }); // ms
  readonly knee = input(0, { transform: numberAttribute }); // dB
  readonly makeupGain = input(0, { transform: numberAttribute }); // dB

  // Display options
  readonly showInputMeter = input(true);
  readonly showOutputMeter = input(true);
  readonly showGainReduction = input(true);
  readonly showThreshold = input(true);
  readonly showSettings = input(true);
  readonly showCurve = input(false);
  readonly showAttackRelease = input(true);
  readonly attackReleaseDisplay = input<AttackReleaseDisplay>('bars');
  readonly showGrHistory = input(false); // Show gain reduction history graph
  readonly grHistoryLength = input(100, { transform: numberAttribute }); // Number of history points
  readonly peakHold = input(true);
  readonly peakHoldTime = input(1000, { transform: numberAttribute }); // ms
  readonly meterMin = input(-60, { transform: numberAttribute }); // dB
  readonly meterMax = input(6, { transform: numberAttribute }); // dB
  readonly animated = input(true);
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Outputs
  readonly settingsChange = output<Partial<CompressorSettings>>();
  readonly clipInput = output<void>();
  readonly clipOutput = output<void>();

  // Internal state
  protected readonly internalInputLevel = signal(0);
  protected readonly internalOutputLevel = signal(0);
  protected readonly internalGainReduction = signal(0);
  protected readonly inputPeakLevel = signal(0);
  protected readonly outputPeakLevel = signal(0);
  protected readonly inputClip = signal(false);
  protected readonly outputClip = signal(false);

  // Gain reduction history for graph display
  protected readonly grHistory = signal<GainReductionHistoryPoint[]>([]);
  protected readonly envelopePosition = signal(0); // 0 = idle, 1 = attacking, progress during release
  protected readonly isCompressing = signal(false);
  protected readonly compressionStartTime = signal(0);
  protected readonly releaseStartTime = signal(0);

  private inputPeakTimeout: ReturnType<typeof setTimeout> | null = null;
  private outputPeakTimeout: ReturnType<typeof setTimeout> | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private grHistoryCtx: CanvasRenderingContext2D | null = null;
  private envelopeCtx: CanvasRenderingContext2D | null = null;

  ngOnInit(): void {
    // Update internal values periodically
    interval(50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateLevels();
      });
  }

  ngOnDestroy(): void {
    if (this.inputPeakTimeout) clearTimeout(this.inputPeakTimeout);
    if (this.outputPeakTimeout) clearTimeout(this.outputPeakTimeout);
  }

  private updateLevels(): void {
    const input = this.inputLevel();
    const output = this.outputLevel();
    const gr = this.gainReduction();
    const now = Date.now();

    this.internalInputLevel.set(input);
    this.internalOutputLevel.set(output);
    this.internalGainReduction.set(gr);

    // Track compression state for envelope visualization
    const wasCompressing = this.isCompressing();
    const isNowCompressing = gr < -0.5; // More than 0.5dB of gain reduction

    if (isNowCompressing && !wasCompressing) {
      // Starting compression (attack phase)
      this.isCompressing.set(true);
      this.compressionStartTime.set(now);
    } else if (!isNowCompressing && wasCompressing) {
      // Ending compression (release phase)
      this.isCompressing.set(false);
      this.releaseStartTime.set(now);
    }

    // Update envelope position for visualization
    this.updateEnvelopePosition(now, isNowCompressing);

    // Update GR history for graph
    if (this.showGrHistory()) {
      this.grHistory.update((history) => {
        const newPoint: GainReductionHistoryPoint = { time: now, value: gr };
        const newHistory = [...history, newPoint];
        // Keep only the last N points
        const maxLength = this.grHistoryLength();
        return newHistory.slice(-maxLength);
      });
      this.drawGrHistoryGraph();
    }

    // Update peak hold
    if (this.peakHold()) {
      if (input > this.inputPeakLevel()) {
        this.inputPeakLevel.set(input);
        if (this.inputPeakTimeout) clearTimeout(this.inputPeakTimeout);
        this.inputPeakTimeout = setTimeout(() => {
          this.inputPeakLevel.set(this.internalInputLevel());
        }, this.peakHoldTime());
      }

      if (output > this.outputPeakLevel()) {
        this.outputPeakLevel.set(output);
        if (this.outputPeakTimeout) clearTimeout(this.outputPeakTimeout);
        this.outputPeakTimeout = setTimeout(() => {
          this.outputPeakLevel.set(this.internalOutputLevel());
        }, this.peakHoldTime());
      }
    }

    // Check for clipping
    if (input >= 0) {
      this.inputClip.set(true);
      this.clipInput.emit();
    }
    if (output >= 0) {
      this.outputClip.set(true);
      this.clipOutput.emit();
    }

    // Draw curve if visible
    if (this.showCurve()) {
      this.drawCompressionCurve();
    }

    // Draw envelope if visible
    if (this.attackReleaseDisplay() === 'envelope') {
      this.drawEnvelopeCurve();
    }
  }

  private updateEnvelopePosition(now: number, isCompressing: boolean): void {
    const settings = this.effectiveSettings();

    if (isCompressing) {
      // Attack phase - rapid rise
      const elapsed = now - this.compressionStartTime();
      const attackProgress = Math.min(1, elapsed / settings.attack);
      // Exponential attack curve
      this.envelopePosition.set(1 - Math.exp(-3 * attackProgress));
    } else {
      // Release phase - gradual fall
      const elapsed = now - this.releaseStartTime();
      const releaseProgress = Math.min(1, elapsed / settings.release);
      // Exponential release curve
      const startPos = this.envelopePosition();
      this.envelopePosition.set(startPos * Math.exp(-3 * releaseProgress));
    }
  }

  // Computed settings
  protected readonly effectiveSettings = computed((): CompressorSettings => {
    const settings = this.settings();
    if (settings) return settings;

    return {
      threshold: this.threshold(),
      ratio: this.ratio(),
      attack: this.attack(),
      release: this.release(),
      knee: this.knee(),
      makeupGain: this.makeupGain(),
    };
  });

  // Meter position calculations (0-100%)
  protected readonly inputMeterPercent = computed(() => {
    return this.dbToPercent(this.internalInputLevel());
  });

  protected readonly outputMeterPercent = computed(() => {
    return this.dbToPercent(this.internalOutputLevel());
  });

  protected readonly gainReductionPercent = computed(() => {
    // GR is negative, so we invert it for display
    const gr = Math.abs(this.internalGainReduction());
    return Math.min(100, (gr / 40) * 100); // 40dB max GR range
  });

  protected readonly thresholdPercent = computed(() => {
    return this.dbToPercent(this.effectiveSettings().threshold);
  });

  protected readonly inputPeakPercent = computed(() => {
    return this.dbToPercent(this.inputPeakLevel());
  });

  protected readonly outputPeakPercent = computed(() => {
    return this.dbToPercent(this.outputPeakLevel());
  });

  private dbToPercent(db: number): number {
    const min = this.meterMin();
    const max = this.meterMax();
    const range = max - min;
    return Math.max(0, Math.min(100, ((db - min) / range) * 100));
  }

  // Format displays
  protected readonly formatInputLevel = computed(() => {
    const level = this.internalInputLevel();
    if (level <= this.meterMin()) return '-∞';
    return `${level > 0 ? '+' : ''}${level.toFixed(1)}`;
  });

  protected readonly formatOutputLevel = computed(() => {
    const level = this.internalOutputLevel();
    if (level <= this.meterMin()) return '-∞';
    return `${level > 0 ? '+' : ''}${level.toFixed(1)}`;
  });

  protected readonly formatGainReduction = computed(() => {
    const gr = this.internalGainReduction();
    return gr.toFixed(1);
  });

  protected readonly formatRatio = computed(() => {
    const ratio = this.effectiveSettings().ratio;
    if (ratio >= 20) return '∞:1';
    return `${ratio}:1`;
  });

  protected readonly formatThreshold = computed(() => {
    return `${this.effectiveSettings().threshold.toFixed(0)} dB`;
  });

  protected readonly formatAttack = computed(() => {
    return `${this.effectiveSettings().attack.toFixed(0)} ms`;
  });

  protected readonly formatRelease = computed(() => {
    return `${this.effectiveSettings().release.toFixed(0)} ms`;
  });

  // Interaction handlers
  protected resetClip(type: 'input' | 'output' | 'both'): void {
    if (type === 'input' || type === 'both') {
      this.inputClip.set(false);
    }
    if (type === 'output' || type === 'both') {
      this.outputClip.set(false);
    }
  }

  // Compression curve drawing
  private drawCompressionCurve(): void {
    const canvas = this.curveCanvas()?.nativeElement;
    if (!canvas) return;

    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const settings = this.effectiveSettings();

    // Clear
    this.ctx.fillStyle = 'rgb(30, 41, 59)'; // slate-800
    this.ctx.fillRect(0, 0, width, height);

    // Draw grid
    this.ctx.strokeStyle = 'rgb(51, 65, 85)'; // slate-700
    this.ctx.lineWidth = 0.5;

    // Grid lines every 12dB
    for (let i = 0; i <= 5; i++) {
      const pos = (i / 5) * width;
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, height);
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(width, pos);
      this.ctx.stroke();
    }

    // Draw 1:1 reference line
    this.ctx.strokeStyle = 'rgb(71, 85, 105)'; // slate-600
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    this.ctx.lineTo(width, 0);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw compression curve
    this.ctx.strokeStyle = 'rgb(59, 130, 246)'; // blue-500
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    const threshold = settings.threshold;
    const ratio = settings.ratio;
    const knee = settings.knee;
    const minDb = this.meterMin();
    const maxDb = this.meterMax();
    const range = maxDb - minDb;

    for (let i = 0; i <= width; i++) {
      const inputDb = minDb + (i / width) * range;
      let outputDb: number;

      if (knee > 0 && Math.abs(inputDb - threshold) < knee / 2) {
        // Soft knee region
        const x = inputDb - threshold + knee / 2;
        outputDb = inputDb + ((1 / ratio - 1) * Math.pow(x, 2)) / (2 * knee);
      } else if (inputDb < threshold) {
        // Below threshold - 1:1
        outputDb = inputDb;
      } else {
        // Above threshold - apply ratio
        outputDb = threshold + (inputDb - threshold) / ratio;
      }

      // Apply makeup gain
      outputDb += settings.makeupGain;

      // Convert to canvas coordinates
      const x = i;
      const y = height - ((outputDb - minDb) / range) * height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();

    // Draw threshold line
    const thresholdX = ((threshold - minDb) / range) * width;
    this.ctx.strokeStyle = 'rgb(234, 179, 8)'; // amber-500
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([2, 2]);
    this.ctx.beginPath();
    this.ctx.moveTo(thresholdX, 0);
    this.ctx.lineTo(thresholdX, height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw current input level marker
    const inputX = this.inputMeterPercent() / 100 * width;
    const currentOutput = this.internalOutputLevel();
    const outputY = height - ((currentOutput - minDb) / range) * height;

    this.ctx.fillStyle = 'rgb(239, 68, 68)'; // red-500
    this.ctx.beginPath();
    this.ctx.arc(inputX, outputY, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Draw gain reduction history graph
  private drawGrHistoryGraph(): void {
    const canvas = this.grHistoryCanvas()?.nativeElement;
    if (!canvas) return;

    this.grHistoryCtx = canvas.getContext('2d');
    if (!this.grHistoryCtx) return;

    const ctx = this.grHistoryCtx;
    const width = canvas.width;
    const height = canvas.height;
    const history = this.grHistory();

    // Clear
    ctx.fillStyle = 'rgb(30, 41, 59)'; // slate-800
    ctx.fillRect(0, 0, width, height);

    if (history.length < 2) return;

    // Draw grid lines
    ctx.strokeStyle = 'rgb(51, 65, 85)'; // slate-700
    ctx.lineWidth = 0.5;

    // Horizontal lines at -10, -20, -30 dB
    for (let db = -10; db >= -30; db -= 10) {
      const y = (-db / 40) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgb(100, 116, 139)'; // slate-500
      ctx.font = '8px monospace';
      ctx.fillText(`${db}`, 2, y - 2);
    }

    // Zero line
    ctx.strokeStyle = 'rgb(71, 85, 105)'; // slate-600
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // Draw GR curve
    ctx.strokeStyle = 'rgb(234, 179, 8)'; // amber-500
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const maxLength = this.grHistoryLength();

    for (let i = 0; i < history.length; i++) {
      const x = (i / maxLength) * width;
      const y = (Math.abs(history[i].value) / 40) * height; // 40dB range

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Fill area under curve
    ctx.lineTo((history.length - 1) / maxLength * width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(234, 179, 8, 0.2)'; // amber-500 with alpha
    ctx.fill();

    // Draw current value indicator
    if (history.length > 0) {
      const lastPoint = history[history.length - 1];
      const x = ((history.length - 1) / maxLength) * width;
      const y = (Math.abs(lastPoint.value) / 40) * height;

      ctx.fillStyle = 'rgb(234, 179, 8)'; // amber-500
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw attack/release envelope visualization
  private drawEnvelopeCurve(): void {
    const canvas = this.envelopeCanvas()?.nativeElement;
    if (!canvas) return;

    this.envelopeCtx = canvas.getContext('2d');
    if (!this.envelopeCtx) return;

    const ctx = this.envelopeCtx;
    const width = canvas.width;
    const height = canvas.height;
    const settings = this.effectiveSettings();

    // Clear
    ctx.fillStyle = 'rgb(30, 41, 59)'; // slate-800
    ctx.fillRect(0, 0, width, height);

    // Calculate proportional widths for attack and release
    const totalTime = settings.attack + settings.release;
    const attackWidth = (settings.attack / totalTime) * width;
    const releaseWidth = (settings.release / totalTime) * width;

    // Draw grid
    ctx.strokeStyle = 'rgb(51, 65, 85)'; // slate-700
    ctx.lineWidth = 0.5;

    // Vertical divider between attack and release
    ctx.beginPath();
    ctx.moveTo(attackWidth, 0);
    ctx.lineTo(attackWidth, height);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgb(100, 116, 139)'; // slate-500
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ATK', attackWidth / 2, height - 4);
    ctx.fillText('REL', attackWidth + releaseWidth / 2, height - 4);

    // Draw ideal envelope curve
    ctx.strokeStyle = 'rgb(71, 85, 105)'; // slate-600
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();

    // Attack curve (exponential rise)
    for (let x = 0; x <= attackWidth; x++) {
      const progress = x / attackWidth;
      const y = height - (1 - Math.exp(-3 * progress)) * (height - 20);
      if (x === 0) {
        ctx.moveTo(x, height);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Release curve (exponential decay)
    for (let x = 0; x <= releaseWidth; x++) {
      const progress = x / releaseWidth;
      const startY = height - (1 - Math.exp(-3)) * (height - 20);
      const y = startY + (height - startY) * (1 - Math.exp(-3 * progress));
      ctx.lineTo(attackWidth + x, y);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw current envelope position
    const envelopePos = this.envelopePosition();
    const currentY = height - envelopePos * (height - 20);

    // Determine x position based on compression state
    let currentX: number;
    const now = Date.now();

    if (this.isCompressing()) {
      // In attack phase
      const attackProgress = Math.min(1, (now - this.compressionStartTime()) / settings.attack);
      currentX = attackProgress * attackWidth;
    } else {
      // In release phase or idle
      const releaseProgress = Math.min(1, (now - this.releaseStartTime()) / settings.release);
      currentX = attackWidth + releaseProgress * releaseWidth;
    }

    // Draw active portion of curve
    ctx.strokeStyle = 'rgb(34, 197, 94)'; // green-500
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (this.isCompressing()) {
      for (let x = 0; x <= currentX; x++) {
        const progress = x / attackWidth;
        const y = height - (1 - Math.exp(-3 * progress)) * (height - 20);
        if (x === 0) {
          ctx.moveTo(x, height);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }

    ctx.stroke();

    // Draw current position marker
    ctx.fillStyle = this.isCompressing() ? 'rgb(34, 197, 94)' : 'rgb(234, 179, 8)'; // green or amber
    ctx.beginPath();
    ctx.arc(Math.min(currentX, width - 5), currentY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw compression activity indicator
    if (this.isCompressing()) {
      ctx.fillStyle = 'rgb(34, 197, 94)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('●', 4, 12);
    }
  }

  // Public methods
  setInputLevel(level: number): void {
    this.internalInputLevel.set(level);
  }

  setOutputLevel(level: number): void {
    this.internalOutputLevel.set(level);
  }

  setGainReduction(gr: number): void {
    this.internalGainReduction.set(gr);
  }

  clearHistory(): void {
    this.grHistory.set([]);
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'flex flex-col rounded-lg';

    const variantClasses: Record<CompressorMeterVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      studio: 'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 p-4',
      vintage: 'bg-gradient-to-b from-amber-900/20 to-slate-900 border border-amber-800/30 p-4',
      light: 'bg-white border border-slate-200 shadow-sm p-4',
      highContrast: 'bg-black border-2 border-white p-4',
    };

    const sizeClasses: Record<CompressorMeterSize, string> = {
      sm: 'gap-2 min-w-[200px]',
      md: 'gap-3 min-w-[280px]',
      lg: 'gap-4 min-w-[360px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly meterHeight = computed(() => {
    const size = this.size();
    return { sm: 100, md: 140, lg: 180 }[size];
  });

  protected readonly curveSize = computed(() => {
    const size = this.size();
    return {
      sm: { width: 120, height: 120 },
      md: { width: 160, height: 160 },
      lg: { width: 200, height: 200 },
    }[size];
  });

  protected readonly grHistorySize = computed(() => {
    const size = this.size();
    return {
      sm: { width: 150, height: 60 },
      md: { width: 200, height: 80 },
      lg: { width: 280, height: 100 },
    }[size];
  });

  protected readonly envelopeSize = computed(() => {
    const size = this.size();
    return {
      sm: { width: 120, height: 50 },
      md: { width: 160, height: 60 },
      lg: { width: 200, height: 70 },
    }[size];
  });

  // Attack/Release time classification
  protected readonly attackSpeed = computed(() => {
    const attack = this.effectiveSettings().attack;
    if (attack <= 5) return 'fast';
    if (attack <= 30) return 'medium';
    if (attack <= 100) return 'slow';
    return 'very-slow';
  });

  protected readonly releaseSpeed = computed(() => {
    const release = this.effectiveSettings().release;
    if (release <= 100) return 'fast';
    if (release <= 500) return 'medium';
    if (release <= 1500) return 'slow';
    return 'very-slow';
  });

  // Attack bar percentage (for visual indicator)
  protected readonly attackBarPercent = computed(() => {
    const attack = this.effectiveSettings().attack;
    // Logarithmic scale: 0.1ms = 0%, 500ms = 100%
    return Math.min(100, (Math.log10(attack + 1) / Math.log10(501)) * 100);
  });

  // Release bar percentage (for visual indicator)
  protected readonly releaseBarPercent = computed(() => {
    const release = this.effectiveSettings().release;
    // Logarithmic scale: 10ms = 0%, 5000ms = 100%
    return Math.min(100, (Math.log10(release) / Math.log10(5000)) * 100);
  });

  // Compression activity indicator
  protected readonly compressionActivity = computed(() => {
    const gr = Math.abs(this.internalGainReduction());
    if (gr < 0.5) return 'idle';
    if (gr < 3) return 'light';
    if (gr < 10) return 'moderate';
    if (gr < 20) return 'heavy';
    return 'limiting';
  });

  // Activity color class
  protected readonly activityColorClass = computed(() => {
    const activity = this.compressionActivity();
    return {
      idle: 'bg-slate-600',
      light: 'bg-green-500',
      moderate: 'bg-yellow-500',
      heavy: 'bg-orange-500',
      limiting: 'bg-red-500',
    }[activity];
  });
}

