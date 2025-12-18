import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
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
  @Input({ required: true }) value: any;

  /** Label text */
  @Input() label = '';

  /** Name attribute (set by parent group) */
  @Input() name = '';

  /** Visual variant */
  @Input() variant: RadioVariant = 'primary';

  /** Size of the radio button */
  @Input() size: RadioSize = 'md';

  /** Whether the radio is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Focus event */
  @Output() onFocus = new EventEmitter<FocusEvent>();

  /** Blur event */
  @Output() onBlur = new EventEmitter<FocusEvent>();

  /** Internal: selected value from parent */
  selectedValue = signal<any>(null);

  /** Internal: change callback from parent */
  onSelectionChange: (value: any) => void = () => {};

  protected isChecked = computed(() => this.selectedValue() === this.value);

  protected labelContainerClasses = computed(() => {
    return this.twClass.merge(
      'inline-flex items-center gap-2 cursor-pointer',
      this.disabled ? 'opacity-50 cursor-not-allowed' : ''
    );
  });

  protected radioClasses = computed(() => {
    const variantClasses = RADIO_VARIANTS[this.variant];
    const sizeClasses = RADIO_SIZES[this.size].radio;

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
      RADIO_SIZES[this.size].label,
      this.disabled ? 'text-slate-400 dark:text-slate-500' : ''
    );
  });

  onRadioChange(): void {
    if (!this.disabled) {
      this.onSelectionChange(this.value);
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
  @Input() name = `tw-radio-group-${Math.random().toString(36).slice(2)}`;

  /** Orientation of the group */
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Gap between radio buttons */
  @Input() gap: 'sm' | 'md' | 'lg' = 'md';

  /** Whether all radios are disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Change event */
  @Output() onChange = new EventEmitter<any>();

  @ContentChildren(TwRadioButtonComponent) radioButtons!: QueryList<TwRadioButtonComponent>;

  protected selectedValue = signal<any>(null);

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private readonly GAPS = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  protected groupClasses = computed(() => {
    return this.twClass.merge(
      'flex',
      this.orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
      this.GAPS[this.gap]
    );
  });

  ngAfterContentInit(): void {
    this.updateRadioButtons();
    this.radioButtons.changes.subscribe(() => {
      this.updateRadioButtons();
    });
  }

  private updateRadioButtons(): void {
    this.radioButtons.forEach(radio => {
      radio.name = this.name;
      radio.selectedValue.set(this.selectedValue());
      radio.disabled = this.disabled || radio.disabled;
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
    this.disabled = isDisabled;
    if (this.radioButtons) {
      this.updateRadioButtons();
    }
  }
}
