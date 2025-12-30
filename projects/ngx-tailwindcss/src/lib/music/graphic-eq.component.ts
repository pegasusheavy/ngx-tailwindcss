import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GraphicEQVariant = 'default' | 'studio' | 'minimal' | 'neon';
export type GraphicEQBandCount = 5 | 10 | 15 | 31;

export interface EQBandValue {
  frequency: number;
  gain: number; // -12 to +12 dB typically
}

// Standard frequency bands
const BAND_FREQUENCIES: Record<GraphicEQBandCount, number[]> = {
  5: [60, 250, 1000, 4000, 16000],
  10: [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
  15: [25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000, 16000],
  31: [
    20, 25, 31, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630,
    800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000,
    12500, 16000, 20000,
  ],
};

@Component({
  selector: 'tw-graphic-eq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphic-eq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwGraphicEQComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class TwGraphicEQComponent implements ControlValueAccessor {
  readonly bandCount = input<GraphicEQBandCount>(10);
  readonly minGain = input(-12, { transform: numberAttribute });
  readonly maxGain = input(12, { transform: numberAttribute });
  readonly step = input(0.5, { transform: numberAttribute });
  readonly variant = input<GraphicEQVariant>('default');
  readonly sliderHeight = input(150, { transform: numberAttribute });
  readonly showLabels = input(true);
  readonly showValues = input(false);
  readonly showCurve = input(true);
  readonly interactive = input(true);
  readonly disabled = input(false);
  readonly classOverride = input('');

  readonly bandChange = output<EQBandValue>();
  readonly valuesChange = output<EQBandValue[]>();

  protected readonly bandValues = signal<number[]>([]);
  protected readonly draggingBand = signal<number | null>(null);

  private onChange: (value: EQBandValue[]) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly frequencies = computed(() => {
    return BAND_FREQUENCIES[this.bandCount()];
  });

  protected readonly bands = computed(() => {
    const freqs = this.frequencies();
    const values = this.bandValues();

    return freqs.map((freq, i) => ({
      frequency: freq,
      gain: values[i] ?? 0,
      label: this.formatFrequency(freq),
    }));
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();

    const schemes: Record<GraphicEQVariant, {
      background: string;
      slider: string;
      fill: string;
      track: string;
      label: string;
      value: string;
      curve: string;
      grid: string;
    }> = {
      default: {
        background: 'bg-slate-900',
        slider: 'bg-slate-600',
        fill: 'bg-blue-500',
        track: 'bg-slate-700',
        label: 'text-slate-400',
        value: 'text-slate-300',
        curve: '#3B82F6',
        grid: '#334155',
      },
      studio: {
        background: 'bg-slate-950',
        slider: 'bg-slate-500',
        fill: 'bg-green-500',
        track: 'bg-slate-800',
        label: 'text-slate-500',
        value: 'text-green-400',
        curve: '#22C55E',
        grid: '#1E293B',
      },
      minimal: {
        background: 'bg-white dark:bg-slate-900',
        slider: 'bg-slate-400 dark:bg-slate-500',
        fill: 'bg-slate-700 dark:bg-slate-300',
        track: 'bg-slate-200 dark:bg-slate-700',
        label: 'text-slate-500 dark:text-slate-400',
        value: 'text-slate-700 dark:text-slate-300',
        curve: '#64748B',
        grid: '#E2E8F0',
      },
      neon: {
        background: 'bg-black',
        slider: 'bg-purple-600',
        fill: 'bg-cyan-400',
        track: 'bg-slate-800',
        label: 'text-purple-400',
        value: 'text-cyan-400',
        curve: '#22D3EE',
        grid: '#581C87',
      },
    };

    return schemes[variant];
  });

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-xl p-4';
    const disabled = this.disabled() ? 'opacity-50 pointer-events-none' : '';
    return [base, this.colors().background, disabled, this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly curvePath = computed(() => {
    const bands = this.bands();
    const height = this.sliderHeight();
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const bandWidth = 100 / bands.length;

    const points = bands.map((band, i) => {
      const x = (i + 0.5) * bandWidth;
      const normalizedGain = (band.gain - minGain) / (maxGain - minGain);
      const y = (1 - normalizedGain) * height;
      return { x, y };
    });

    // Create smooth curve using bezier
    let path = `M 0 ${height / 2}`;

    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        path += ` L ${points[i].x} ${points[i].y}`;
      } else {
        const prevX = points[i - 1].x;
        const prevY = points[i - 1].y;
        const currX = points[i].x;
        const currY = points[i].y;
        const midX = (prevX + currX) / 2;
        path += ` Q ${prevX + (midX - prevX) * 0.5} ${prevY}, ${midX} ${(prevY + currY) / 2}`;
        path += ` Q ${midX + (currX - midX) * 0.5} ${currY}, ${currX} ${currY}`;
      }
    }

    path += ` L 100 ${height / 2}`;
    return path;
  });

  protected onBandMouseDown(event: MouseEvent, bandIndex: number): void {
    if (!this.interactive() || this.disabled()) return;
    this.draggingBand.set(bandIndex);
    this.updateBandFromEvent(event, bandIndex);

    const onMove = (e: MouseEvent) => {
      if (this.draggingBand() !== null) {
        this.updateBandFromEvent(e, this.draggingBand()!);
      }
    };

    const onUp = () => {
      this.draggingBand.set(null);
      this.onTouched();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    event.preventDefault();
  }

  protected onBandTouchStart(event: TouchEvent, bandIndex: number): void {
    if (!this.interactive() || this.disabled()) return;
    this.draggingBand.set(bandIndex);
    const touch = event.touches[0];
    this.updateBandFromTouch(touch, bandIndex);

    const onMove = (e: TouchEvent) => {
      if (this.draggingBand() !== null && e.touches[0]) {
        this.updateBandFromTouch(e.touches[0], this.draggingBand()!);
      }
    };

    const onEnd = () => {
      this.draggingBand.set(null);
      this.onTouched();
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
    event.preventDefault();
  }

  private updateBandFromEvent(event: MouseEvent, bandIndex: number): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = event.clientY - rect.top;
    this.updateBandValue(bandIndex, y, rect.height);
  }

  private updateBandFromTouch(touch: Touch, bandIndex: number): void {
    const target = document.querySelector(`[data-band="${bandIndex}"]`) as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    this.updateBandValue(bandIndex, y, rect.height);
  }

  private updateBandValue(bandIndex: number, y: number, height: number): void {
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const step = this.step();

    const percentage = 1 - Math.max(0, Math.min(1, y / height));
    let gain = minGain + percentage * (maxGain - minGain);
    gain = Math.round(gain / step) * step;
    gain = Math.max(minGain, Math.min(maxGain, gain));

    this.bandValues.update((values) => {
      const newValues = [...values];
      newValues[bandIndex] = gain;
      return newValues;
    });

    const freq = this.frequencies()[bandIndex];
    this.bandChange.emit({ frequency: freq, gain });
    this.emitValues();
  }

  private emitValues(): void {
    const values = this.bands().map((b) => ({ frequency: b.frequency, gain: b.gain }));
    this.onChange(values);
    this.valuesChange.emit(values);
  }

  protected resetBand(bandIndex: number): void {
    this.bandValues.update((values) => {
      const newValues = [...values];
      newValues[bandIndex] = 0;
      return newValues;
    });
    this.emitValues();
  }

  protected resetAll(): void {
    this.bandValues.set(this.frequencies().map(() => 0));
    this.emitValues();
  }

  protected getBandFillHeight(gain: number): string {
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const height = this.sliderHeight();

    if (gain >= 0) {
      const percentage = gain / maxGain;
      return `${percentage * (height / 2)}px`;
    } else {
      const percentage = Math.abs(gain) / Math.abs(minGain);
      return `${percentage * (height / 2)}px`;
    }
  }

  protected getBandFillPosition(gain: number): string {
    const height = this.sliderHeight();
    if (gain >= 0) {
      return `${height / 2 - (gain / this.maxGain()) * (height / 2)}px`;
    }
    return `${height / 2}px`;
  }

  private formatFrequency(freq: number): string {
    if (freq >= 1000) {
      return `${freq / 1000}k`;
    }
    return `${freq}`;
  }

  // ControlValueAccessor
  writeValue(value: EQBandValue[] | null): void {
    if (value) {
      const gains = this.frequencies().map((freq) => {
        const band = value.find((b) => b.frequency === freq);
        return band?.gain ?? 0;
      });
      this.bandValues.set(gains);
    } else {
      this.bandValues.set(this.frequencies().map(() => 0));
    }
  }

  registerOnChange(fn: (value: EQBandValue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }
}

