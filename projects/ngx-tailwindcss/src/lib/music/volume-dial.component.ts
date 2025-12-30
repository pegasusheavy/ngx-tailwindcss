import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type DialVariant = 'modern' | 'vintage' | 'minimal' | 'led';
export type DialSize = 'sm' | 'md' | 'lg' | 'xl';

const DIAL_SIZES: Record<DialSize, { size: number; strokeWidth: number; tickLength: number; fontSize: string }> = {
  sm: { size: 48, strokeWidth: 4, tickLength: 4, fontSize: 'text-[10px]' },
  md: { size: 72, strokeWidth: 5, tickLength: 6, fontSize: 'text-xs' },
  lg: { size: 96, strokeWidth: 6, tickLength: 8, fontSize: 'text-sm' },
  xl: { size: 128, strokeWidth: 8, tickLength: 10, fontSize: 'text-base' },
};

const DIAL_VARIANTS: Record<DialVariant, { track: string; fill: string; knob: string; indicator: string }> = {
  modern: {
    track: 'stroke-slate-200 dark:stroke-slate-700',
    fill: 'stroke-blue-500',
    knob: 'fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600',
    indicator: 'stroke-blue-500',
  },
  vintage: {
    track: 'stroke-amber-100 dark:stroke-amber-900/30',
    fill: 'stroke-amber-500',
    knob: 'fill-amber-50 dark:fill-amber-950 stroke-amber-300 dark:stroke-amber-700',
    indicator: 'stroke-amber-600',
  },
  minimal: {
    track: 'stroke-slate-100 dark:stroke-slate-800',
    fill: 'stroke-slate-600 dark:stroke-slate-400',
    knob: 'fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700',
    indicator: 'stroke-slate-800 dark:stroke-slate-200',
  },
  led: {
    track: 'stroke-slate-800 dark:stroke-slate-900',
    fill: 'stroke-emerald-500',
    knob: 'fill-slate-900 dark:fill-black stroke-slate-700 dark:stroke-slate-800',
    indicator: 'stroke-emerald-400',
  },
};

/**
 * Volume Dial (Rotary Knob) component for audio controls
 *
 * @example
 * ```html
 * <tw-volume-dial [(ngModel)]="volume" [min]="0" [max]="100"></tw-volume-dial>
 * <tw-volume-dial [value]="gain" variant="vintage" size="lg" [showValue]="true"></tw-volume-dial>
 * ```
 */
@Component({
  selector: 'tw-volume-dial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-dial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwVolumeDialComponent),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
  },
})
export class TwVolumeDialComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);
  private readonly dialSvg = viewChild<ElementRef<SVGElement>>('dialSvg');

  // Inputs
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly variant = input<DialVariant>('modern');
  readonly size = input<DialSize>('md');
  readonly disabled = input(false);
  readonly showValue = input(true);
  readonly showTicks = input(true);
  readonly showLabel = input(false);
  readonly showLedRing = input(true);
  readonly label = input<string>('');
  readonly unit = input<string>('');
  readonly centerDetent = input(false);
  readonly detentValue = input(50);
  readonly classOverride = input('');

  // Outputs
  readonly valueChange = output<number>();

  // Internal state
  protected readonly value = signal(0);
  private isDragging = false;
  private startAngle = 0;
  private startValue = 0;

  // CVA callbacks
  private onChangeFn: (value: number) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // Computed values
  protected readonly sizeConfig = computed(() => DIAL_SIZES[this.size()]);
  protected readonly variantConfig = computed(() => DIAL_VARIANTS[this.variant()]);
  protected readonly center = computed(() => this.sizeConfig().size / 2);
  protected readonly radius = computed(() => this.center() - this.sizeConfig().strokeWidth - 4);
  protected readonly knobRadius = computed(() => this.radius() * 0.55);

  // Arc angles (in degrees, 0 = top, clockwise)
  private readonly startAngleDeg = -135;
  private readonly endAngleDeg = 135;
  private readonly totalAngle = 270;

  protected readonly containerClasses = computed(() => {
    return this.twClass.merge('relative inline-flex flex-col items-center', this.classOverride());
  });

  protected readonly valueClasses = computed(() => {
    return this.twClass.merge(
      'mt-1 font-mono font-medium text-slate-700 dark:text-slate-300',
      this.sizeConfig().fontSize
    );
  });

  protected readonly displayValue = computed(() => {
    const val = this.value();
    return Number.isInteger(val) ? val : val.toFixed(1);
  });

  // Calculate SVG arc path
  protected readonly trackPath = computed(() => {
    return this.describeArc(
      this.center(),
      this.center(),
      this.radius(),
      this.startAngleDeg,
      this.endAngleDeg
    );
  });

  protected readonly fillPath = computed(() => {
    const percentage = (this.value() - this.min()) / (this.max() - this.min());
    const fillAngle = this.startAngleDeg + percentage * this.totalAngle;
    return this.describeArc(
      this.center(),
      this.center(),
      this.radius(),
      this.startAngleDeg,
      fillAngle
    );
  });

  protected readonly indicatorEnd = computed(() => {
    const percentage = (this.value() - this.min()) / (this.max() - this.min());
    const angle = this.startAngleDeg + percentage * this.totalAngle;
    const radians = (angle - 90) * (Math.PI / 180);
    const length = this.knobRadius() * 0.7;
    return {
      x: this.center() + length * Math.cos(radians),
      y: this.center() + length * Math.sin(radians),
    };
  });

  protected readonly tickMarks = computed(() => {
    const ticks: Array<{ angle: number; x1: number; y1: number; x2: number; y2: number; isMajor: boolean }> = [];
    const tickCount = 11;
    const majorEvery = 2;

    for (let i = 0; i < tickCount; i++) {
      const percentage = i / (tickCount - 1);
      const angle = this.startAngleDeg + percentage * this.totalAngle;
      const radians = (angle - 90) * (Math.PI / 180);
      const isMajor = i % majorEvery === 0;
      const outerRadius = this.radius() + this.sizeConfig().strokeWidth + 2;
      const innerRadius = outerRadius - (isMajor ? this.sizeConfig().tickLength : this.sizeConfig().tickLength * 0.6);

      ticks.push({
        angle,
        x1: this.center() + outerRadius * Math.cos(radians),
        y1: this.center() + outerRadius * Math.sin(radians),
        x2: this.center() + innerRadius * Math.cos(radians),
        y2: this.center() + innerRadius * Math.sin(radians),
        isMajor,
      });
    }
    return ticks;
  });

  protected readonly ledSegments = computed(() => {
    const segments: Array<{ index: number; x: number; y: number; active: boolean }> = [];
    const ledCount = 12;
    const ledRadius = this.radius() + this.sizeConfig().strokeWidth + 6;
    const percentage = (this.value() - this.min()) / (this.max() - this.min());

    for (let i = 0; i < ledCount; i++) {
      const segmentPercentage = i / (ledCount - 1);
      const angle = this.startAngleDeg + segmentPercentage * this.totalAngle;
      const radians = (angle - 90) * (Math.PI / 180);

      segments.push({
        index: i,
        x: this.center() + ledRadius * Math.cos(radians),
        y: this.center() + ledRadius * Math.sin(radians),
        active: segmentPercentage <= percentage,
      });
    }
    return segments;
  });

  // SVG arc helper
  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): { x: number; y: number } {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // Event handlers
  onMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.startDrag(event.clientX, event.clientY);

    const onMouseMove = (e: MouseEvent): void => {
      this.handleDrag(e.clientX, e.clientY);
    };
    const onMouseUp = (): void => {
      this.endDrag();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);

    const onTouchMove = (e: TouchEvent): void => {
      const t = e.touches[0];
      this.handleDrag(t.clientX, t.clientY);
    };
    const onTouchEnd = (): void => {
      this.endDrag();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  private startDrag(clientX: number, clientY: number): void {
    this.isDragging = true;
    this.startAngle = this.getAngleFromPoint(clientX, clientY);
    this.startValue = this.value();
  }

  private handleDrag(clientX: number, clientY: number): void {
    if (!this.isDragging) return;

    const currentAngle = this.getAngleFromPoint(clientX, clientY);
    let angleDiff = currentAngle - this.startAngle;

    // Handle wrap-around
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    const valueDiff = (angleDiff / this.totalAngle) * (this.max() - this.min());
    let newValue = this.startValue + valueDiff;

    // Apply constraints
    newValue = Math.max(this.min(), Math.min(this.max(), newValue));

    // Apply step
    newValue = Math.round(newValue / this.step()) * this.step();

    // Center detent
    if (this.centerDetent()) {
      const detent = this.detentValue();
      const tolerance = (this.max() - this.min()) * 0.02;
      if (Math.abs(newValue - detent) < tolerance) {
        newValue = detent;
      }
    }

    this.setValue(newValue);
  }

  private endDrag(): void {
    this.isDragging = false;
    this.onTouchedFn();
  }

  private getAngleFromPoint(clientX: number, clientY: number): number {
    const svg = this.dialSvg()?.nativeElement;
    if (!svg) return 0;

    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    let newValue = this.value();
    const largeStep = (this.max() - this.min()) * 0.1;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight': {
        newValue += this.step();
        break;
      }
      case 'ArrowDown':
      case 'ArrowLeft': {
        newValue -= this.step();
        break;
      }
      case 'PageUp': {
        newValue += largeStep;
        break;
      }
      case 'PageDown': {
        newValue -= largeStep;
        break;
      }
      case 'Home': {
        newValue = this.min();
        break;
      }
      case 'End': {
        newValue = this.max();
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();
    newValue = Math.max(this.min(), Math.min(this.max(), newValue));
    newValue = Math.round(newValue / this.step()) * this.step();
    this.setValue(newValue);
    this.onTouchedFn();
  }

  private setValue(newValue: number): void {
    if (newValue !== this.value()) {
      this.value.set(newValue);
      this.onChangeFn(newValue);
      this.valueChange.emit(newValue);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.value.set(value ?? this.min());
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Disabled state is handled via input
  }
}
