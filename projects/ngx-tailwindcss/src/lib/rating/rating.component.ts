import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type RatingVariant = 'primary' | 'warning' | 'danger';
export type RatingSize = 'sm' | 'md' | 'lg' | 'xl';

const RATING_VARIANTS: Record<RatingVariant, { filled: string; empty: string }> = {
  primary: { filled: 'text-blue-500', empty: 'text-slate-300 dark:text-slate-600' },
  warning: { filled: 'text-amber-400', empty: 'text-slate-300 dark:text-slate-600' },
  danger: { filled: 'text-rose-500', empty: 'text-slate-300 dark:text-slate-600' },
};

const RATING_SIZES: Record<RatingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

/**
 * Rating/Stars component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-rating [(ngModel)]="rating"></tw-rating>
 * <tw-rating [stars]="10" [allowHalf]="true" variant="warning"></tw-rating>
 * <tw-rating [readonly]="true" [value]="4.5"></tw-rating>
 * ```
 */
@Component({
  selector: 'tw-rating',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwRatingComponent),
      multi: true,
    },
  ],
  templateUrl: './rating.component.html',
})
export class TwRatingComponent implements ControlValueAccessor {
  /** Number of stars */
  readonly stars = input(5, { transform: numberAttribute });
  /** Visual variant */
  readonly variant = input<RatingVariant>('warning');
  /** Size of the stars */
  readonly size = input<RatingSize>('md');
  /** Whether the rating is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Whether the rating is readonly (display only) */
  readonly readonly = input(false, { transform: booleanAttribute });
  /** Whether to allow half-star ratings */
  readonly allowHalf = input(false, { transform: booleanAttribute });
  /** Whether to show the current value */
  readonly showValue = input(false, { transform: booleanAttribute });
  /** Whether to show cancel button */
  readonly showCancel = input(false, { transform: booleanAttribute });
  /** Aria label for accessibility */
  readonly ariaLabel = input('Rating');
  /** Additional classes */
  readonly classOverride = input('');
  /** Change event */
  readonly change = output<number>();
  /** Focus event */
  readonly focus = output<FocusEvent>();
  /** Blur event */
  readonly blur = output<FocusEvent>();

  private _disabled = signal(false);
  protected isDisabled = computed(() => this.disabled() || this._disabled());

  private readonly twClass = inject(TwClassService);
  private onChangeFn: (value: number) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected value = signal(0);
  protected hoverValue = signal<number | null>(null);
  protected starsArray = computed(() => Array.from({ length: this.stars() }, () => 0));
  protected containerClasses = computed(() => {
    return this.twClass.merge(
      'inline-flex items-center gap-1',
      this.isDisabled() ? 'opacity-50' : '',
      this.classOverride()
    );
  });

  getFilledStars(index: number): number {
    const currentValue = this.hoverValue() ?? this.value();
    return currentValue;
  }

  protected starClasses(index: number) {
    const variant = RATING_VARIANTS[this.variant()];
    const isFilled = this.getFilledStars(index) > index;

    return this.twClass.merge(
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-100',
      this.readonly() || this.isDisabled() ? 'cursor-default' : 'cursor-pointer hover:scale-110',
      isFilled ? variant.filled : variant.empty
    );
  }

  protected iconClasses() {
    return RATING_SIZES[this.size()];
  }

  protected valueClasses() {
    return 'ml-2 text-sm font-medium text-slate-600 dark:text-slate-400';
  }

  onStarClick(index: number): void {
    if (this.isDisabled() || this.readonly()) return;

    let newValue = index + 1;

    // If clicking the same star that's already fully selected, decrease by 1 (or 0.5 if allowHalf)
    if (this.value() === newValue && !this.allowHalf()) {
      newValue = 0;
    }

    this.value.set(newValue);
    this.onChangeFn(newValue);
    this.change.emit(newValue);
  }

  onStarHover(index: number): void {
    if (this.isDisabled() || this.readonly()) return;
    this.hoverValue.set(index + 1);
  }

  onStarLeave(): void {
    this.hoverValue.set(null);
  }

  onInputBlur(event: FocusEvent): void {
    this.onTouchedFn();
    this.blur.emit(event);
  }

  clear(): void {
    this.value.set(0);
    this.onChangeFn(0);
    this.change.emit(0);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
