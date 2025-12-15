import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  numberAttribute,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type SliderVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type SliderSize = 'sm' | 'md' | 'lg';

const SLIDER_VARIANTS: Record<SliderVariant, { fill: string; thumb: string }> = {
  primary: { fill: 'bg-blue-600', thumb: 'border-blue-600' },
  secondary: { fill: 'bg-slate-600', thumb: 'border-slate-600' },
  success: { fill: 'bg-emerald-600', thumb: 'border-emerald-600' },
  warning: { fill: 'bg-amber-500', thumb: 'border-amber-500' },
  danger: { fill: 'bg-rose-600', thumb: 'border-rose-600' },
};

const SLIDER_SIZES: Record<SliderSize, { track: string; thumb: string }> = {
  sm: { track: 'h-1', thumb: 'w-4 h-4' },
  md: { track: 'h-2', thumb: 'w-5 h-5' },
  lg: { track: 'h-3', thumb: 'w-6 h-6' },
};

/**
 * Slider/Range component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-slider [(ngModel)]="value" [min]="0" [max]="100"></tw-slider>
 * <tw-slider [showValue]="true" [showMinMax]="true" label="Volume"></tw-slider>
 * ```
 */
@Component({
  selector: 'tw-slider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwSliderComponent),
      multi: true,
    },
  ],
  templateUrl: './slider.component.html',
})
export class TwSliderComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);

  /** Minimum value */
  @Input({ transform: numberAttribute }) min = 0;

  /** Maximum value */
  @Input({ transform: numberAttribute }) max = 100;

  /** Step increment */
  @Input({ transform: numberAttribute }) step = 1;

  /** Label text */
  @Input() label = '';

  /** Visual variant */
  @Input() variant: SliderVariant = 'primary';

  /** Size of the slider */
  @Input() size: SliderSize = 'md';

  /** Whether the slider is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Whether to show the current value */
  @Input({ transform: booleanAttribute }) showValue = false;

  /** Whether to show min/max labels */
  @Input({ transform: booleanAttribute }) showMinMax = false;

  /** Whether to show tick marks */
  @Input({ transform: booleanAttribute }) showTicks = false;

  /** Number of tick marks to show */
  @Input({ transform: numberAttribute }) tickCount = 5;

  /** Whether to show value bubble while dragging */
  @Input({ transform: booleanAttribute }) showValueBubble = false;

  /** Format function for display value */
  @Input() valueFormat: (value: number) => string = v => v.toString();

  /** Additional classes */
  @Input() classOverride = '';

  /** Change event (fires on mouseup/touchend) */
  @Output() onChange = new EventEmitter<number>();

  /** Input event (fires continuously while dragging) */
  @Output() onInput = new EventEmitter<number>();

  /** Focus event */
  @Output() onFocus = new EventEmitter<FocusEvent>();

  /** Blur event */
  @Output() onBlur = new EventEmitter<FocusEvent>();

  protected value = signal(0);
  protected isDragging = signal(false);

  private onChangeFn: (value: number) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected fillPercentage = computed(() => {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.value() - this.min) / range) * 100;
  });

  protected displayValue = computed(() => {
    return this.valueFormat(this.value());
  });

  protected ticks = computed(() => {
    if (this.tickCount <= 0) return [];
    const ticks: number[] = [];
    const step = (this.max - this.min) / (this.tickCount - 1);
    for (let i = 0; i < this.tickCount; i++) {
      ticks.push(Math.round(this.min + step * i));
    }
    return ticks;
  });

  protected containerClasses = computed(() => {
    return this.twClass.merge('w-full', this.classOverride);
  });

  protected labelClasses = computed(() => {
    return 'text-sm font-medium text-slate-700';
  });

  protected sliderContainerClasses = computed(() => {
    return 'flex items-center';
  });

  protected trackClasses = computed(() => {
    const sizeClasses = SLIDER_SIZES[this.size].track;
    return this.twClass.merge(
      'w-full rounded-full bg-slate-200',
      sizeClasses,
      this.disabled ? 'opacity-50' : ''
    );
  });

  protected fillClasses = computed(() => {
    const variant = SLIDER_VARIANTS[this.variant];
    const sizeClasses = SLIDER_SIZES[this.size].track;
    return this.twClass.merge(
      'rounded-full transition-all duration-100',
      variant.fill,
      sizeClasses
    );
  });

  protected inputClasses = computed(() => {
    return this.twClass.merge(
      'absolute inset-0 w-full opacity-0 cursor-pointer',
      this.disabled ? 'cursor-not-allowed' : ''
    );
  });

  protected thumbClasses = computed(() => {
    const variant = SLIDER_VARIANTS[this.variant];
    const sizeClasses = SLIDER_SIZES[this.size].thumb;
    return this.twClass.merge(
      'rounded-full bg-white border-2 shadow-md transition-transform',
      variant.thumb,
      sizeClasses,
      this.isDragging() ? 'scale-110' : '',
      this.disabled ? 'opacity-50' : ''
    );
  });

  onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    this.value.set(newValue);
    this.onInput.emit(newValue);
  }

  onSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    this.value.set(newValue);
    this.onChangeFn(newValue);
    this.onChange.emit(newValue);
  }

  onInputBlur(): void {
    this.onTouchedFn();
    this.onBlur.emit();
  }

  onDragStart(): void {
    this.isDragging.set(true);
  }

  onDragEnd(): void {
    this.isDragging.set(false);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.value.set(value ?? this.min);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
