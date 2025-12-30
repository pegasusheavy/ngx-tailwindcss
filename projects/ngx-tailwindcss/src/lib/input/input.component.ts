import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type InputVariant = 'default' | 'filled' | 'outlined' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';

const INPUT_BASE_CLASSES = `
  w-full
  text-slate-900 dark:text-slate-100
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none
`;

const INPUT_VARIANTS: Record<InputVariant, string> = {
  default:
    'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  filled:
    'bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500',
  outlined: 'bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:border-blue-500',
  underlined: 'bg-transparent border-b-2 border-slate-300 dark:border-slate-600 rounded-none px-0 focus:border-blue-500',
};

const INPUT_SIZES: Record<InputSize, string> = {
  sm: 'text-sm px-3 py-1.5 min-h-8',
  md: 'text-sm px-4 py-2.5 min-h-10',
  lg: 'text-base px-4 py-3 min-h-12',
};

const INPUT_ERROR_CLASSES = 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20';

/**
 * Label directive for form fields
 */
@Directive({
  selector: 'tw-label, [twLabel]',
  standalone: true,
})
export class TwLabelDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';
  @Input({ transform: booleanAttribute }) required = false;

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5', this.class);
  }
}

/**
 * Hint/helper text directive
 */
@Directive({
  selector: 'tw-hint, [twHint]',
  standalone: true,
})
export class TwHintDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block text-xs text-slate-500 dark:text-slate-400 mt-1.5', this.class);
  }
}

/**
 * Error message directive
 */
@Directive({
  selector: 'tw-error, [twError]',
  standalone: true,
})
export class TwErrorDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block text-xs text-rose-600 mt-1.5', this.class);
  }

  @HostBinding('attr.role')
  readonly role = 'alert';
}

/**
 * Input prefix/suffix container
 */
@Directive({
  selector: '[twInputPrefix], [twInputSuffix]',
  standalone: true,
})
export class TwInputAffixDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('flex items-center text-slate-500 dark:text-slate-400', this.class);
  }
}

/**
 * Highly customizable text input component with Tailwind CSS styling
 * Implements ControlValueAccessor for Angular forms integration
 *
 * @example
 * ```html
 * <tw-input
 *   [(ngModel)]="name"
 *   placeholder="Enter your name"
 *   label="Full Name"
 *   hint="As it appears on your ID">
 * </tw-input>
 *
 * <tw-input
 *   formControlName="email"
 *   type="email"
 *   variant="filled"
 *   [error]="emailError">
 *   <span twInputPrefix>@</span>
 * </tw-input>
 * ```
 */
@Component({
  selector: 'tw-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwInputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class TwInputComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);
  private readonly elementRef = inject(ElementRef);

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  /** Input type */
  @Input() type = 'text';

  /** Visual variant */
  @Input() variant: InputVariant = 'default';

  /** Size of the input */
  @Input() size: InputSize = 'md';

  /** Label text */
  @Input() label = '';

  /** Placeholder text */
  @Input() placeholder = '';

  /** Hint/helper text */
  @Input() hint = '';

  /** Error message */
  @Input() error = '';

  /** Whether the field is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Whether the field is readonly */
  @Input({ transform: booleanAttribute }) readonly = false;

  /** Whether the field is required */
  @Input({ transform: booleanAttribute }) required = false;

  /** Whether to show a clear button */
  @Input({ transform: booleanAttribute }) clearable = false;

  /** Unique ID for the input (auto-generated if not provided) */
  @Input() inputId = `tw-input-${Math.random().toString(36).slice(2, 9)}`;

  /** Autocomplete attribute */
  @Input() autocomplete = '';

  /** Input mode for virtual keyboards */
  @Input() inputmode = '';

  /** Validation pattern */
  @Input() pattern = '';

  /** Minimum value (for number/date inputs) */
  @Input() min = '';

  /** Maximum value (for number/date inputs) */
  @Input() max = '';

  /** Minimum length */
  @Input() minlength: number | null = null;

  /** Maximum length */
  @Input() maxlength: number | null = null;

  /** Step value (for number inputs) */
  @Input() step = '';

  /** IDs of elements that describe this input */
  @Input() describedBy = '';

  /** Additional classes to merge */
  @Input() classOverride = '';

  /** Focus event */
  @Output() onFocus = new EventEmitter<FocusEvent>();

  /** Clear event */
  @Output() onClear = new EventEmitter<void>();

  protected value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get hasError(): boolean {
    return !!this.error;
  }

  protected wrapperClasses = computed(() => {
    const hasAffixes = this.elementRef.nativeElement.querySelector(
      '[twInputPrefix], [twInputSuffix]'
    );

    if (hasAffixes || this.clearable) {
      return this.twClass.merge(
        'flex items-center gap-2',
        INPUT_VARIANTS[this.variant],
        INPUT_SIZES[this.size],
        this.hasError ? INPUT_ERROR_CLASSES : ''
      );
    }

    return '';
  });

  protected computedClasses = computed(() => {
    const hasWrapper = this.wrapperClasses();

    if (hasWrapper) {
      // When wrapped, input should be transparent
      return this.twClass.merge(
        'flex-1 min-w-0 bg-transparent border-none focus:ring-0 p-0',
        INPUT_BASE_CLASSES.replaceAll(/px-\d+/g, '').replaceAll(/py-[\d.]+/g, ''),
        this.classOverride
      );
    }

    return this.twClass.merge(
      INPUT_BASE_CLASSES,
      INPUT_VARIANTS[this.variant],
      INPUT_SIZES[this.size],
      this.hasError ? INPUT_ERROR_CLASSES : '',
      this.classOverride
    );
  });

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  clear(): void {
    this.value = '';
    this.onChange('');
    this.onClear.emit();
    this.inputElement?.nativeElement?.focus();
  }

  /** Focus the input programmatically */
  focus(): void {
    this.inputElement?.nativeElement?.focus();
  }

  /** Select all text in the input */
  select(): void {
    this.inputElement?.nativeElement?.select();
  }
}

/**
 * Textarea component with the same API as tw-input
 */
@Component({
  selector: 'tw-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwTextareaComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class TwTextareaComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);

  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;

  @Input() variant: InputVariant = 'default';
  @Input() size: InputSize = 'md';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) showCount = false;
  @Input() inputId = `tw-textarea-${Math.random().toString(36).slice(2, 9)}`;
  @Input() rows = 4;
  @Input() minlength: number | null = null;
  @Input() maxlength: number | null = null;
  @Input() classOverride = '';
  @Input({ transform: booleanAttribute }) autoResize = false;

  protected value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get hasError(): boolean {
    return !!this.error;
  }

  protected computedClasses = computed(() => {
    return this.twClass.merge(
      INPUT_BASE_CLASSES,
      INPUT_VARIANTS[this.variant],
      INPUT_SIZES[this.size],
      this.hasError ? INPUT_ERROR_CLASSES : '',
      this.autoResize ? 'resize-none overflow-hidden' : 'resize-y',
      this.classOverride
    );
  });

  writeValue(value: string): void {
    this.value = value ?? '';
    if (this.autoResize) {
      setTimeout(() => {
        this.adjustHeight();
      }, 0);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);

    if (this.autoResize) {
      this.adjustHeight();
    }
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private adjustHeight(): void {
    const textarea = this.textareaElement?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  focus(): void {
    this.textareaElement?.nativeElement?.focus();
  }
}
