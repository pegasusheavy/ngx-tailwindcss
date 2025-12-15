import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type CheckboxVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type CheckboxSize = 'sm' | 'md' | 'lg';

const CHECKBOX_VARIANTS: Record<CheckboxVariant, string> = {
  primary: 'text-blue-600 focus:ring-blue-500 border-slate-300',
  secondary: 'text-slate-600 focus:ring-slate-500 border-slate-300',
  success: 'text-emerald-600 focus:ring-emerald-500 border-slate-300',
  warning: 'text-amber-500 focus:ring-amber-500 border-slate-300',
  danger: 'text-rose-600 focus:ring-rose-500 border-slate-300',
};

const CHECKBOX_SIZES: Record<CheckboxSize, { box: string; label: string }> = {
  sm: { box: 'w-4 h-4', label: 'text-sm' },
  md: { box: 'w-5 h-5', label: 'text-base' },
  lg: { box: 'w-6 h-6', label: 'text-lg' },
};

/**
 * Checkbox component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-checkbox [(ngModel)]="checked">Accept terms</tw-checkbox>
 * <tw-checkbox variant="success" [binary]="true">Enable feature</tw-checkbox>
 * ```
 */
@Component({
  selector: 'tw-checkbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwCheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
})
export class TwCheckboxComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);

  // Signal-based inputs
  readonly variant = input<CheckboxVariant>('primary');
  readonly size = input<CheckboxSize>('md');
  readonly disabled = input(false, { transform: (v: boolean | string) => v === '' || v === true });
  readonly indeterminate = input(false, {
    transform: (v: boolean | string) => v === '' || v === true,
  });
  readonly name = input('');
  readonly value = input<any>();
  readonly readonly = input(false, { transform: (v: boolean | string) => v === '' || v === true });
  readonly classOverride = input('');

  // Signal-based outputs
  readonly onFocus = output<FocusEvent>();
  readonly onBlur = output<FocusEvent>();
  readonly onChange = output<{ checked: boolean; value: any }>();

  // Internal state
  protected readonly checked = signal(false);
  private readonly _disabled = signal(false);

  private onChangeFn: (value: boolean) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // Sync disabled state from input
  constructor() {
    effect(() => {
      this._disabled.set(this.disabled());
    });
  }

  protected readonly labelContainerClasses = computed(() => {
    return this.twClass.merge(
      'inline-flex items-center gap-2 cursor-pointer',
      this._disabled() ? 'opacity-50 cursor-not-allowed' : '',
      this.classOverride()
    );
  });

  protected readonly checkboxClasses = computed(() => {
    const variantClasses = CHECKBOX_VARIANTS[this.variant()];
    const sizeClasses = CHECKBOX_SIZES[this.size()].box;

    return this.twClass.merge(
      'rounded border-2 bg-white transition-colors duration-150',
      'focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses
    );
  });

  protected readonly labelTextClasses = computed(() => {
    return this.twClass.merge(
      'text-slate-700 select-none',
      CHECKBOX_SIZES[this.size()].label,
      this._disabled() ? 'text-slate-400' : ''
    );
  });

  onCheckboxChange(event: Event): void {
    if (this._disabled() || this.readonly()) return;

    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    this.checked.set(isChecked);
    this.onChangeFn(isChecked);
    this.onChange.emit({ checked: isChecked, value: this.value() });
  }

  onInputBlur(event: FocusEvent): void {
    this.onTouchedFn();
    this.onBlur.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  /** Toggle the checkbox programmatically */
  toggle(): void {
    if (!this._disabled() && !this.readonly()) {
      this.checked.set(!this.checked());
      this.onChangeFn(this.checked());
      this.onChange.emit({ checked: this.checked(), value: this.value() });
    }
  }
}
