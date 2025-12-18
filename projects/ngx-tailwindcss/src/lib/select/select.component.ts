import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'filled';
export type SelectAppendTo = 'body' | 'self';

const SELECT_SIZES: Record<SelectSize, { trigger: string; text: string }> = {
  sm: { trigger: 'px-3 py-1.5 min-h-8', text: 'text-sm' },
  md: { trigger: 'px-4 py-2.5 min-h-10', text: 'text-base' },
  lg: { trigger: 'px-5 py-3 min-h-12', text: 'text-lg' },
};

/**
 * Select/Dropdown component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-select [options]="options" [(ngModel)]="selected" placeholder="Choose..."></tw-select>
 * <tw-select [options]="options" [filter]="true" label="Country"></tw-select>
 * <tw-select [options]="options" appendTo="body"></tw-select>
 * ```
 */
@Component({
  selector: 'tw-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
})
export class TwSelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
  private readonly twClass = inject(TwClassService);
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('triggerButton') triggerButton!: ElementRef<HTMLButtonElement>;

  /** Options to display (flat list) */
  @Input() options: SelectOption[] = [];

  /** Grouped options to display */
  @Input() groups: SelectGroup[] = [];

  /** Placeholder text */
  @Input() placeholder = 'Select an option';

  /** Label text */
  @Input() label = '';

  /** Size of the select */
  @Input() size: SelectSize = 'md';

  /** Visual variant */
  @Input() variant: SelectVariant = 'default';

  /** Whether the select is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Whether the select is required */
  @Input({ transform: booleanAttribute }) required = false;

  /** Whether to show filter input */
  @Input({ transform: booleanAttribute }) filter = false;

  /** Filter placeholder text */
  @Input() filterPlaceholder = 'Search...';

  /** Empty message when no options match filter */
  @Input() emptyMessage = 'No results found';

  /** Whether to show checkmark for selected option */
  @Input({ transform: booleanAttribute }) showCheckmark = true;

  /** Hint text */
  @Input() hint = '';

  /** Error message */
  @Input() error = '';

  /** Input ID */
  @Input() inputId = `tw-select-${Math.random().toString(36).slice(2)}`;

  /** Additional classes */
  @Input() classOverride = '';

  /**
   * Where to append the dropdown
   * - 'body': Appends dropdown to document body (avoids overflow clipping)
   * - 'self': Keeps dropdown within the component (default)
   */
  @Input() appendTo: SelectAppendTo = 'body';

  /** Change event */
  @Output() onChange = new EventEmitter<SelectOption | null>();

  /** Open/Close event */
  @Output() onToggle = new EventEmitter<boolean>();

  protected isOpen = signal(false);
  protected filterValue = signal('');
  protected selectedValue = signal<any>(null);
  protected dropdownPosition = signal<{ top: number; left: number; width: number } | null>(null);

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private portalContainer: HTMLElement | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

  protected allOptions = computed(() => {
    if (this.groups.length > 0) {
      return this.groups.flatMap(g => g.options);
    }
    return this.options;
  });

  protected selectedOption = computed(() => {
    return this.allOptions().find(opt => opt.value === this.selectedValue()) || null;
  });

  protected filteredOptions = computed(() => {
    const filter = this.filterValue().toLowerCase();
    if (!filter) return this.options;
    return this.options.filter(opt => opt.label.toLowerCase().includes(filter));
  });

  protected filteredGroups = computed(() => {
    const filter = this.filterValue().toLowerCase();
    if (!filter) return this.groups;

    return this.groups
      .map(group => ({
        ...group,
        options: group.options.filter(opt => opt.label.toLowerCase().includes(filter)),
      }))
      .filter(group => group.options.length > 0);
  });

  protected containerClasses = computed(() => {
    return this.twClass.merge('relative', this.classOverride);
  });

  protected labelClasses = computed(() => {
    return 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
  });

  protected triggerClasses = computed(() => {
    const sizeClasses = SELECT_SIZES[this.size];
    const hasError = !!this.error;

    return this.twClass.merge(
      'w-full flex items-center justify-between rounded-lg border bg-white dark:bg-slate-800 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      sizeClasses.trigger,
      sizeClasses.text,
      hasError
        ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500',
      this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900' : 'cursor-pointer',
      this.isOpen() ? 'ring-2 ring-blue-500 border-blue-500' : ''
    );
  });

  protected valueDisplayClasses = computed(() => {
    return this.twClass.merge(
      'truncate text-left',
      this.selectedOption() ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
    );
  });

  protected chevronClasses = computed(() => {
    return this.twClass.merge(
      'w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2',
      this.isOpen() ? 'rotate-180' : ''
    );
  });

  protected dropdownClasses = computed(() => {
    const baseClasses = this.twClass.merge(
      'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg',
      'animate-in fade-in-0 zoom-in-95 duration-100'
    );

    if (this.appendTo === 'body') {
      return this.twClass.merge(baseClasses, 'fixed z-[9999]');
    }
    return this.twClass.merge(baseClasses, 'absolute z-50 w-full mt-1');
  });

  protected dropdownStyle = computed(() => {
    if (this.appendTo === 'body') {
      const pos = this.dropdownPosition();
      if (pos) {
        return {
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          width: `${pos.width}px`,
        };
      }
    }
    return {};
  });

  protected optionClasses(option: SelectOption) {
    const isSelected = this.isSelected(option);
    return this.twClass.merge(
      'w-full flex items-center px-4 py-2.5 text-left text-sm transition-colors',
      isSelected
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
      option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    );
  }

  ngAfterViewInit(): void {
    if (this.appendTo === 'body' && isPlatformBrowser(this.platformId)) {
      this.setupScrollListener();
      this.setupResizeListener();
    }
  }

  ngOnDestroy(): void {
    this.removePortal();
    this.removeScrollListener();
    this.removeResizeListener();
  }

  isSelected(option: SelectOption): boolean {
    return option.value === this.selectedValue();
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    const willOpen = !this.isOpen();
    this.isOpen.set(willOpen);
    this.onToggle.emit(willOpen);

    if (willOpen) {
      this.updateDropdownPosition();
    } else {
      this.filterValue.set('');
    }
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.selectedValue.set(option.value);
    this.onChangeFn(option.value);
    this.onChange.emit(option);
    this.isOpen.set(false);
    this.filterValue.set('');
    this.onTouchedFn();
  }

  onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterValue.set(input.value);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.toggleDropdown();
        break;
      }
      case 'Escape': {
        this.isOpen.set(false);
        this.filterValue.set('');
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
          this.updateDropdownPosition();
        }
        break;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if click is inside this component
    if (this.elementRef.nativeElement.contains(target)) {
      return;
    }

    // Check if click is inside the portal (for appendTo="body")
    if (this.portalContainer && this.portalContainer.contains(target)) {
      return;
    }

    this.isOpen.set(false);
    this.filterValue.set('');
  }

  private updateDropdownPosition(): void {
    if (this.appendTo !== 'body' || !this.triggerButton) return;

    const triggerEl = this.triggerButton.nativeElement;
    const rect = triggerEl.getBoundingClientRect();

    this.dropdownPosition.set({
      top: rect.bottom + 4, // 4px gap
      left: rect.left,
      width: rect.width,
    });
  }

  private setupScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.scrollListener = () => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    };

    window.addEventListener('scroll', this.scrollListener, true);
  }

  private removeScrollListener(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
      this.scrollListener = null;
    }
  }

  private setupResizeListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.resizeListener = () => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    };

    window.addEventListener('resize', this.resizeListener);
  }

  private removeResizeListener(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  private removePortal(): void {
    if (this.portalContainer) {
      this.portalContainer.remove();
      this.portalContainer = null;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Clear the selection */
  clear(): void {
    this.selectedValue.set(null);
    this.onChangeFn(null);
    this.onChange.emit(null);
  }
}
