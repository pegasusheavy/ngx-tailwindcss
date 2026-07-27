import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class TwSelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly twClass = inject(TwClassService);
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  @ViewChild('triggerButton') triggerButton!: ElementRef<HTMLButtonElement>;

  /** Options to display (flat list) */
  readonly options = input<SelectOption[]>([]);

  /** Grouped options to display */
  readonly groups = input<SelectGroup[]>([]);

  /** Placeholder text */
  readonly placeholder = input('Select an option');

  /** Label text */
  readonly label = input('');

  /** Size of the select */
  readonly size = input<SelectSize>('md');

  /** Visual variant */
  readonly variant = input<SelectVariant>('default');

  /** Whether the select is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Whether the select is required */
  readonly required = input(false, { transform: booleanAttribute });

  /** Whether to show filter input */
  readonly filter = input(false, { transform: booleanAttribute });

  /** Filter placeholder text */
  readonly filterPlaceholder = input('Search...');

  /** Empty message when no options match filter */
  readonly emptyMessage = input('No results found');

  /** Whether to show checkmark for selected option */
  readonly showCheckmark = input(true, { transform: booleanAttribute });

  /** Hint text */
  readonly hint = input('');

  /** Error message */
  readonly error = input('');

  /** Input ID */
  readonly inputId = input(`tw-select-${Math.random().toString(36).slice(2)}`);

  /** Additional classes */
  readonly classOverride = input('');

  /**
   * How the dropdown layer is positioned
   * - 'body': Renders the dropdown as a fixed-position layer so it escapes
   *   `overflow` clipping from scrollable ancestors (default). Note that an
   *   ancestor with a `transform` or `filter` creates a new containing block
   *   and can offset the layer.
   * - 'self': Renders the dropdown absolutely positioned within the component
   */
  readonly appendTo = input<SelectAppendTo>('body');

  /** Change event */
  readonly onChange = output<SelectOption | null>();

  /** Open/Close event */
  readonly onToggle = output<boolean>();

  protected isOpen = signal(false);
  protected filterValue = signal('');
  protected selectedValue = signal<any>(null);
  protected dropdownPosition = signal<{ top: number; left: number; width: number } | null>(null);
  /** Index of the keyboard-active option within filteredOptions() */
  protected activeIndex = signal(-1);
  private readonly _disabled = signal(false);

  protected readonly listboxId = `tw-select-listbox-${Math.random().toString(36).slice(2)}`;

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private positionListener: (() => void) | null = null;

  protected isDisabled = computed(() => this.disabled() || this._disabled());

  protected allOptions = computed(() => {
    if (this.groups().length > 0) {
      return this.groups().flatMap(g => g.options);
    }
    return this.options();
  });

  protected selectedOption = computed(() => {
    return this.allOptions().find(opt => opt.value === this.selectedValue()) || null;
  });

  protected filteredOptions = computed(() => {
    const filterVal = this.filterValue().toLowerCase();
    if (!filterVal) return this.options();
    return this.options().filter(opt => opt.label.toLowerCase().includes(filterVal));
  });

  protected activeDescendantId = computed(() => {
    const index = this.activeIndex();
    if (!this.isOpen() || index < 0 || index >= this.filteredOptions().length) return null;
    return `${this.listboxId}-option-${index}`;
  });

  protected filteredGroups = computed(() => {
    const filterVal = this.filterValue().toLowerCase();
    if (!filterVal) return this.groups();

    return this.groups()
      .map(group => ({
        ...group,
        options: group.options.filter(opt => opt.label.toLowerCase().includes(filterVal)),
      }))
      .filter(group => group.options.length > 0);
  });

  protected containerClasses = computed(() => {
    return this.twClass.merge('relative', this.classOverride());
  });

  protected labelClasses = computed(() => {
    return 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
  });

  protected triggerClasses = computed(() => {
    const sizeClasses = SELECT_SIZES[this.size()];
    const hasError = !!this.error();

    return this.twClass.merge(
      'w-full flex items-center justify-between rounded-lg border bg-white dark:bg-slate-800 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      sizeClasses.trigger,
      sizeClasses.text,
      hasError
        ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500',
      this.isDisabled()
        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
        : 'cursor-pointer',
      this.isOpen() ? 'ring-2 ring-blue-500 border-blue-500' : ''
    );
  });

  protected valueDisplayClasses = computed(() => {
    return this.twClass.merge(
      'truncate text-left',
      this.selectedOption()
        ? 'text-slate-900 dark:text-slate-100'
        : 'text-slate-400 dark:text-slate-500'
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

    if (this.appendTo() === 'body') {
      return this.twClass.merge(baseClasses, 'fixed z-[9999]');
    }
    return this.twClass.merge(baseClasses, 'absolute z-50 w-full mt-1');
  });

  protected dropdownStyle = computed(() => {
    if (this.appendTo() === 'body') {
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

  protected optionClasses(option: SelectOption, isActive = false) {
    const isSelected = this.isSelected(option);
    return this.twClass.merge(
      'w-full flex items-center px-4 py-2.5 text-left text-sm transition-colors',
      isSelected
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
      !isSelected && isActive ? 'bg-slate-100 dark:bg-slate-700' : '',
      option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    );
  }

  ngOnDestroy(): void {
    this.detachPositionListeners();
  }

  isSelected(option: SelectOption): boolean {
    return option.value === this.selectedValue();
  }

  toggleDropdown(): void {
    if (this.isDisabled()) return;

    const willOpen = !this.isOpen();
    if (willOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
    this.onToggle.emit(willOpen);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.selectedValue.set(option.value);
    this.onChangeFn(option.value);
    this.onChange.emit(option);
    this.closeDropdown();
    this.onTouchedFn();
  }

  onFilterInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.filterValue.set(inputEl.value);
    this.activeIndex.set(-1);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (this.isOpen() && event.key === 'Enter') {
          const active = this.filteredOptions()[this.activeIndex()];
          if (active) {
            this.selectOption(active);
            break;
          }
        }
        this.toggleDropdown();
        break;
      }
      case 'Escape': {
        this.closeDropdown();
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (this.isOpen()) {
          this.moveActiveIndex(1);
        } else {
          this.openDropdown();
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (this.isOpen()) {
          this.moveActiveIndex(-1);
        }
        break;
      }
      case 'Home': {
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.filteredOptions().length > 0 ? 0 : -1);
        }
        break;
      }
      case 'End': {
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.filteredOptions().length - 1);
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

    this.closeDropdown();
  }

  private openDropdown(): void {
    this.isOpen.set(true);
    this.activeIndex.set(
      Math.max(
        0,
        this.filteredOptions().findIndex(option => this.isSelected(option))
      )
    );
    this.updateDropdownPosition();
    this.attachPositionListeners();

    if (this.filter() && isPlatformBrowser(this.platformId)) {
      // Focus the filter input once the dropdown has rendered
      setTimeout(() => {
        (this.elementRef.nativeElement as HTMLElement).querySelector('input')?.focus();
      });
    }
  }

  private closeDropdown(): void {
    this.isOpen.set(false);
    this.filterValue.set('');
    this.activeIndex.set(-1);
    this.detachPositionListeners();
  }

  private moveActiveIndex(delta: number): void {
    const options = this.filteredOptions();
    if (options.length === 0) return;

    let index = this.activeIndex();
    for (const _ of options) {
      index = (index + delta + options.length) % options.length;
      if (!options[index].disabled) break;
    }
    this.activeIndex.set(index);
  }

  private updateDropdownPosition(): void {
    if (this.appendTo() !== 'body' || !this.triggerButton) return;

    const triggerEl = this.triggerButton.nativeElement;
    const rect = triggerEl.getBoundingClientRect();

    this.dropdownPosition.set({
      top: rect.bottom + 4, // 4px gap
      left: rect.left,
      width: rect.width,
    });
  }

  private attachPositionListeners(): void {
    if (
      this.positionListener ||
      this.appendTo() !== 'body' ||
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }

    const listener = () => {
      // Re-enter the zone only to update the position signal
      this.ngZone.run(() => {
        this.updateDropdownPosition();
      });
    };
    this.positionListener = listener;

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', listener, { capture: true, passive: true });
      window.addEventListener('resize', listener, { passive: true });
    });
  }

  private detachPositionListeners(): void {
    if (!this.positionListener) return;

    window.removeEventListener('scroll', this.positionListener, { capture: true });
    window.removeEventListener('resize', this.positionListener);
    this.positionListener = null;
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
    this._disabled.set(isDisabled);
  }

  /** Clear the selection */
  clear(): void {
    this.selectedValue.set(null);
    this.onChangeFn(null);
    this.onChange.emit(null);
  }
}
