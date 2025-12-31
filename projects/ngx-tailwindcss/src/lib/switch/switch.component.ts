import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type SwitchVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type SwitchSize = 'sm' | 'md' | 'lg';

const SWITCH_VARIANTS: Record<SwitchVariant, { on: string; off: string }> = {
  primary: { on: 'bg-blue-600', off: 'bg-slate-300 dark:bg-slate-600' },
  secondary: { on: 'bg-slate-600', off: 'bg-slate-300 dark:bg-slate-600' },
  success: { on: 'bg-emerald-600', off: 'bg-slate-300 dark:bg-slate-600' },
  warning: { on: 'bg-amber-500', off: 'bg-slate-300 dark:bg-slate-600' },
  danger: { on: 'bg-rose-600', off: 'bg-slate-300 dark:bg-slate-600' },
};

const SWITCH_SIZES: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string; label: string }
> = {
  sm: { track: 'w-8 h-5', thumb: 'w-4 h-4', translate: 'translate-x-3', label: 'text-sm' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5', label: 'text-base' },
  lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 'translate-x-6', label: 'text-lg' },
};

/**
 * Switch/Toggle component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-switch [(ngModel)]="enabled">Enable notifications</tw-switch>
 * <tw-switch variant="success" size="lg">Dark mode</tw-switch>
 * ```
 */
@Component({
  selector: 'tw-switch',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwSwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './switch.component.html',
})
export class TwSwitchComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);

  // Signal-based inputs
  readonly variant = input<SwitchVariant>('primary');
  readonly size = input<SwitchSize>('md');
  readonly disabled = input(false, { transform: (v: boolean | string) => v === '' || v === true });
  readonly labelPosition = input<'left' | 'right'>('right');
  readonly classOverride = input('');

  // Signal-based output
  readonly onChange = output<boolean>();

  // Internal state
  protected readonly checked = signal(false);
  protected readonly hasLabel = true;
  private readonly _disabled = signal(false);

  private onChangeFn: (value: boolean) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected readonly containerClasses = computed(() => {
    const isDisabled = this._disabled() || this.disabled();
    return this.twClass.merge(
      'inline-flex items-center gap-3 cursor-pointer',
      this.labelPosition() === 'left' ? 'flex-row-reverse' : '',
      isDisabled ? 'opacity-50 cursor-not-allowed' : '',
      this.classOverride()
    );
  });

  protected readonly trackClasses = computed(() => {
    const variant = SWITCH_VARIANTS[this.variant()];
    const sizeClasses = SWITCH_SIZES[this.size()].track;

    return this.twClass.merge(
      'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-blue-500',
      'disabled:cursor-not-allowed',
      this.checked() ? variant.on : variant.off,
      sizeClasses
    );
  });

  protected readonly thumbClasses = computed(() => {
    const sizeClasses = SWITCH_SIZES[this.size()];

    return this.twClass.merge(
      'inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out',
      'pointer-events-none ml-0.5',
      this.checked() ? sizeClasses.translate : 'translate-x-0',
      sizeClasses.thumb
    );
  });

  protected readonly labelClasses = computed(() => {
    return this.twClass.merge(
      'text-slate-700 dark:text-slate-300 select-none',
      SWITCH_SIZES[this.size()].label,
      this._disabled() ? 'text-slate-400 dark:text-slate-500' : ''
    );
  });

  toggle(): void {
    if (this._disabled() || this.disabled()) return;

    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChangeFn(newValue);
    this.onTouchedFn();
    this.onChange.emit(newValue);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked.set(value);
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
}
