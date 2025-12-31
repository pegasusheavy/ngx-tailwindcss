import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  QueryList,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type RadioVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type RadioSize = 'sm' | 'md' | 'lg';

const RADIO_VARIANTS: Record<RadioVariant, string> = {
  primary: 'text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600',
  secondary: 'text-slate-600 focus:ring-slate-500 border-slate-300 dark:border-slate-600',
  success: 'text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600',
  warning: 'text-amber-500 focus:ring-amber-500 border-slate-300 dark:border-slate-600',
  danger: 'text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-600',
};

const RADIO_SIZES: Record<RadioSize, { radio: string; label: string }> = {
  sm: { radio: 'w-4 h-4', label: 'text-sm' },
  md: { radio: 'w-5 h-5', label: 'text-base' },
  lg: { radio: 'w-6 h-6', label: 'text-lg' },
};

/**
 * Single radio button component
 *
 * @example
 * ```html
 * <tw-radio-button value="opt1" label="Option 1"></tw-radio-button>
 * ```
 */
@Component({
  selector: 'tw-radio-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-button.component.html',
})
export class TwRadioButtonComponent {
  private readonly twClass = inject(TwClassService);

  /** Value of the radio button */
  readonly value = input.required<any>();

  /** Label text */
  readonly label = input('');

  /** Name attribute (set by parent group) */
  readonly name = input('');

  /** Visual variant */
  readonly variant = input<RadioVariant>('primary');

  /** Size of the radio button */
  readonly size = input<RadioSize>('md');

  /** Whether the radio is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Focus event */
  readonly onFocus = output<FocusEvent>();

  /** Blur event */
  readonly onBlur = output<FocusEvent>();

  /** Internal: selected value from parent */
  selectedValue = signal<any>(null);

  /** Internal: disabled override from parent */
  _disabledOverride = signal(false);

  /** Internal: name override from parent */
  _nameOverride = signal('');

  /** Internal: change callback from parent */
  onSelectionChange: (value: any) => void = () => {};

  protected isDisabled = computed(() => this.disabled() || this._disabledOverride());

  protected effectiveName = computed(() => this._nameOverride() || this.name());

  protected isChecked = computed(() => this.selectedValue() === this.value());

  protected labelContainerClasses = computed(() => {
    return this.twClass.merge(
      'inline-flex items-center gap-2 cursor-pointer',
      this.isDisabled() ? 'opacity-50 cursor-not-allowed' : ''
    );
  });

  protected radioClasses = computed(() => {
    const variantClasses = RADIO_VARIANTS[this.variant()];
    const sizeClasses = RADIO_SIZES[this.size()].radio;

    return this.twClass.merge(
      'rounded-full border-2 bg-white dark:bg-slate-800 transition-colors duration-150',
      'focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses
    );
  });

  protected labelTextClasses = computed(() => {
    return this.twClass.merge(
      'text-slate-700 dark:text-slate-300 select-none',
      RADIO_SIZES[this.size()].label,
      this.isDisabled() ? 'text-slate-400 dark:text-slate-500' : ''
    );
  });

  onRadioChange(): void {
    if (!this.isDisabled()) {
      this.onSelectionChange(this.value());
    }
  }
}

/**
 * Radio button group component
 *
 * @example
 * ```html
 * <tw-radio-group [(ngModel)]="selectedOption">
 *   <tw-radio-button value="opt1" label="Option 1"></tw-radio-button>
 *   <tw-radio-button value="opt2" label="Option 2"></tw-radio-button>
 * </tw-radio-group>
 * ```
 */
@Component({
  selector: 'tw-radio-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwRadioGroupComponent),
      multi: true,
    },
  ],
  templateUrl: './radio-group.component.html',
})
export class TwRadioGroupComponent implements ControlValueAccessor, AfterContentInit {
  private readonly twClass = inject(TwClassService);

  /** Name for all radio buttons in the group */
  readonly name = input(`tw-radio-group-${Math.random().toString(36).slice(2)}`);

  /** Orientation of the group */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  /** Gap between radio buttons */
  readonly gap = input<'sm' | 'md' | 'lg'>('md');

  /** Whether all radios are disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Change event */
  readonly onChange = output<any>();

  @ContentChildren(TwRadioButtonComponent) radioButtons!: QueryList<TwRadioButtonComponent>;

  protected selectedValue = signal<any>(null);
  private _disabled = signal(false);
  private contentInitialized = false;

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private readonly GAPS = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  protected isDisabled = computed(() => this.disabled() || this._disabled());

  protected groupClasses = computed(() => {
    return this.twClass.merge(
      'flex',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
      this.GAPS[this.gap()]
    );
  });

  constructor() {
    // Watch for input changes and update child components
    effect(() => {
      // Access signals to track them
      this.name();
      this.isDisabled();

      if (this.contentInitialized && this.radioButtons) {
        this.updateRadioButtons();
      }
    });
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.updateRadioButtons();
    this.radioButtons.changes.subscribe(() => {
      this.updateRadioButtons();
    });
  }

  private updateRadioButtons(): void {
    this.radioButtons.forEach(radio => {
      radio._nameOverride.set(this.name());
      radio.selectedValue.set(this.selectedValue());
      radio._disabledOverride.set(this.isDisabled());
      radio.onSelectionChange = (value: any) => {
        this.selectedValue.set(value);
        this.onChangeFn(value);
        this.onChange.emit(value);
        this.updateRadioButtonsSelection();
      };
    });
  }

  private updateRadioButtonsSelection(): void {
    this.radioButtons.forEach(radio => {
      radio.selectedValue.set(this.selectedValue());
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue.set(value);
    if (this.radioButtons) {
      this.updateRadioButtonsSelection();
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
    if (this.radioButtons) {
      this.updateRadioButtons();
    }
  }
}
