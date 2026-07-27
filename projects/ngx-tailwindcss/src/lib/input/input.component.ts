import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  input,
  Input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  outlined:
    'bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:border-blue-500',
  underlined:
    'bg-transparent border-b-2 border-slate-300 dark:border-slate-600 rounded-none px-0 focus:border-blue-500',
};

const INPUT_SIZES: Record<InputSize, string> = {
  sm: 'text-sm px-3 py-1.5 min-h-8',
  md: 'text-sm px-4 py-2.5 min-h-10',
  lg: 'text-base px-4 py-3 min-h-12',
};

const INPUT_ERROR_CLASSES = 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20';

const LABEL_REQUIRED_CLASSES = "after:content-['*'] after:ml-0.5 after:text-rose-500";

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
    return this.twClass.merge(
      'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5',
      this.required ? LABEL_REQUIRED_CLASSES : '',
      this.class
    );
  }

  @HostBinding('attr.aria-required')
  get ariaRequired(): 'true' | null {
    return this.required ? 'true' : null;
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
    return this.twClass.merge(
      'block text-xs text-slate-500 dark:text-slate-400 mt-1.5',
      this.class
    );
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
  readonly type = input('text');

  /** Visual variant */
  readonly variant = input<InputVariant>('default');

  /** Size of the input */
  readonly size = input<InputSize>('md');

  /** Label text */
  readonly label = input('');

  /** Placeholder text */
  readonly placeholder = input('');

  /** Hint/helper text */
  readonly hint = input('');

  /** Error message */
  readonly error = input('');

  /** Whether the field is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Whether the field is readonly */
  readonly readonly = input(false, { transform: booleanAttribute });

  /** Whether the field is required */
  readonly required = input(false, { transform: booleanAttribute });

  /** Whether to show a clear button */
  readonly clearable = input(false, { transform: booleanAttribute });

  /** Unique ID for the input (auto-generated if not provided) */
  readonly inputId = input(`tw-input-${Math.random().toString(36).slice(2, 9)}`);

  /** Autocomplete attribute */
  readonly autocomplete = input('');

  /** Input mode for virtual keyboards */
  readonly inputmode = input('');

  /** Validation pattern */
  readonly pattern = input('');

  /** Minimum value (for number/date inputs) */
  readonly min = input('');

  /** Maximum value (for number/date inputs) */
  readonly max = input('');

  /** Minimum length */
  readonly minlength = input<number | null>(null);

  /** Maximum length */
  readonly maxlength = input<number | null>(null);

  /** Step value (for number inputs) */
  readonly step = input('');

  /** IDs of elements that describe this input */
  readonly describedBy = input('');

  /** Additional classes to merge */
  readonly classOverride = input('');

  /** Focus event */
  readonly onFocus = output<FocusEvent>();

  /** Clear event */
  readonly onClear = output();

  protected readonly value = signal('');
  protected readonly _disabled = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Keep the CVA-driven disabled state in sync with the input binding
    effect(() => {
      this._disabled.set(this.disabled());
    });
  }

  protected readonly hasError = computed(() => !!this.error());

  protected readonly wrapperClasses = computed(() => {
    const hasAffixes = this.elementRef.nativeElement.querySelector(
      '[twInputPrefix], [twInputSuffix]'
    );

    if (hasAffixes || this.clearable()) {
      return this.twClass.merge(
        'flex items-center gap-2',
        INPUT_VARIANTS[this.variant()],
        INPUT_SIZES[this.size()],
        this.hasError() ? INPUT_ERROR_CLASSES : ''
      );
    }

    return '';
  });

  protected readonly computedClasses = computed(() => {
    const hasWrapper = this.wrapperClasses();

    if (hasWrapper) {
      // When wrapped, input should be transparent
      return this.twClass.merge(
        'flex-1 min-w-0 bg-transparent border-none focus:ring-0 p-0',
        INPUT_BASE_CLASSES.replaceAll(/px-\d+/g, '').replaceAll(/py-[\d.]+/g, ''),
        this.classOverride()
      );
    }

    return this.twClass.merge(
      INPUT_BASE_CLASSES,
      INPUT_VARIANTS[this.variant()],
      INPUT_SIZES[this.size()],
      this.hasError() ? INPUT_ERROR_CLASSES : '',
      this.classOverride()
    );
  });

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }

  clear(): void {
    this.value.set('');
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
 * Textarea component with a subset of the tw-input API
 * (no type/clearable/pattern/min/max/step/prefix/suffix)
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

  readonly variant = input<InputVariant>('default');
  readonly size = input<InputSize>('md');
  readonly label = input('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly showCount = input(false, { transform: booleanAttribute });
  readonly inputId = input(`tw-textarea-${Math.random().toString(36).slice(2, 9)}`);
  readonly rows = input(4);
  readonly minlength = input<number | null>(null);
  readonly maxlength = input<number | null>(null);
  readonly classOverride = input('');
  readonly autoResize = input(false, { transform: booleanAttribute });

  protected readonly value = signal('');
  protected readonly _disabled = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Keep the CVA-driven disabled state in sync with the input binding
    effect(() => {
      this._disabled.set(this.disabled());
    });
  }

  protected readonly hasError = computed(() => !!this.error());

  protected readonly computedClasses = computed(() => {
    return this.twClass.merge(
      INPUT_BASE_CLASSES,
      INPUT_VARIANTS[this.variant()],
      INPUT_SIZES[this.size()],
      this.hasError() ? INPUT_ERROR_CLASSES : '',
      this.autoResize() ? 'resize-none overflow-hidden' : 'resize-y',
      this.classOverride()
    );
  });

  writeValue(value: string): void {
    this.value.set(value ?? '');
    if (this.autoResize()) {
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
    this._disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(this.value());

    if (this.autoResize()) {
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
