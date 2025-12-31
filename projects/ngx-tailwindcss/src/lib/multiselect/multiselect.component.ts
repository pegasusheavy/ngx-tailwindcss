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

export interface MultiSelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
  icon?: string;
}

export interface MultiSelectGroup {
  label: string;
  options: MultiSelectOption[];
}

export type MultiSelectSize = 'sm' | 'md' | 'lg';
export type MultiSelectVariant = 'default' | 'filled';
export type MultiSelectAppendTo = 'body' | 'self';

const MULTISELECT_SIZES: Record<MultiSelectSize, { trigger: string; text: string }> = {
  sm: { trigger: 'px-3 py-1.5 min-h-8', text: 'text-sm' },
  md: { trigger: 'px-4 py-2.5 min-h-10', text: 'text-base' },
  lg: { trigger: 'px-5 py-3 min-h-12', text: 'text-lg' },
};

/**
 * Multi-select/Dropdown component with Tailwind CSS styling.
 * Supports multiple selections and grouped options.
 *
 * @example
 * ```html
 * <tw-multiselect [options]="options" [(ngModel)]="selected" placeholder="Choose..."></tw-multiselect>
 * <tw-multiselect [groups]="groups" [filter]="true" label="Countries"></tw-multiselect>
 * <tw-multiselect [options]="options" appendTo="body" [maxSelections]="3"></tw-multiselect>
 * ```
 */
@Component({
  selector: 'tw-multiselect',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwMultiSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './multiselect.component.html',
})
export class TwMultiSelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
  @ViewChild('triggerButton') triggerButton!: ElementRef<HTMLButtonElement>;

  /** Options to display (flat list) */
  @Input() options: MultiSelectOption[] = [];

  /** Grouped options to display */
  @Input() groups: MultiSelectGroup[] = [];

  /** Placeholder text */
  @Input() placeholder = 'Select options';

  /** Label text */
  @Input() label = '';

  /** Enable search/filter */
  @Input({ transform: booleanAttribute }) filter = false;

  /** Size variant */
  @Input() size: MultiSelectSize = 'md';

  /** Visual variant */
  @Input() variant: MultiSelectVariant = 'default';

  /** Where to append dropdown */
  @Input() appendTo: MultiSelectAppendTo = 'self';

  /** Disabled state */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Show checkboxes */
  @Input({ transform: booleanAttribute }) showCheckbox = true;

  /** Show select all option */
  @Input({ transform: booleanAttribute }) showSelectAll = true;

  /** Maximum number of selections allowed (0 = unlimited) */
  @Input() maxSelections = 0;

  /** Custom class for dropdown */
  @Input() dropdownClass = '';

  /** Custom class for trigger button */
  @Input() triggerClass = '';

  /** Selection change event */
  @Output() selectionChange = new EventEmitter<unknown[]>();

  protected readonly twClass = inject(TwClassService);
  protected readonly elementRef = inject(ElementRef);
  protected readonly document = inject(DOCUMENT);
  protected readonly platformId = inject(PLATFORM_ID);

  protected isOpen = signal(false);
  protected filterValue = signal('');
  protected selectedValues = signal<Set<unknown>>(new Set());
  protected dropdownPosition = signal<{ top: number; left: number; width: number } | null>(null);

  private onChangeFn: (value: unknown[]) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private clickListener: ((event: MouseEvent) => void) | null = null;
  private resizeListener: (() => void) | null = null;

  protected allOptions = computed(() => {
    if (this.groups.length > 0) {
      return this.groups.flatMap(g => g.options);
    }
    return this.options;
  });

  protected selectedOptions = computed(() => {
    const selected = this.selectedValues();
    return this.allOptions().filter(opt => selected.has(opt.value));
  });

  protected displayText = computed(() => {
    const selected = this.selectedOptions();
    if (selected.length === 0) return this.placeholder;
    if (selected.length === 1) return selected[0].label;
    return `${selected.length} selected`;
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

  protected filteredOptions = computed(() => {
    const filter = this.filterValue().toLowerCase();
    if (!filter) return this.options;

    return this.options.filter(opt => opt.label.toLowerCase().includes(filter));
  });

  protected triggerClasses = computed(() => {
    const sizeClasses = MULTISELECT_SIZES[this.size].trigger;
    const textClasses = MULTISELECT_SIZES[this.size].text;

    const baseClasses = [
      'flex items-center justify-between w-full rounded-md border transition-colors',
      textClasses,
      sizeClasses,
    ];

    if (this.disabled) {
      baseClasses.push(
        'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-300 dark:border-slate-700'
      );
    } else if (this.variant === 'filled') {
      baseClasses.push(
        'bg-slate-100 dark:bg-slate-700 border-slate-100 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
      );
    } else {
      baseClasses.push(
        'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100'
      );
    }

    return this.twClass.merge(baseClasses.join(' '), this.triggerClass);
  });

  protected dropdownClasses = computed(() => {
    const baseClasses = [
      'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10',
      'focus:outline-none',
    ];

    return this.twClass.merge(baseClasses.join(' '), this.dropdownClass);
  });

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clickListener = this.onDocumentClick.bind(this);
      this.document.addEventListener('click', this.clickListener);

      this.resizeListener = () => {
        if (this.isOpen() && this.appendTo === 'body') {
          this.updateDropdownPosition();
        }
      };
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.document.removeEventListener('click', this.clickListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: unknown[]): void {
    if (Array.isArray(value)) {
      this.selectedValues.set(new Set(value));
    } else {
      this.selectedValues.set(new Set());
    }
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.isOpen.set(true);
    this.onTouchedFn();

    if (this.appendTo === 'body') {
      setTimeout(() => {
        this.updateDropdownPosition();
      }, 0);
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.filterValue.set('');
    this.dropdownPosition.set(null);
  }

  toggleOption(option: MultiSelectOption): void {
    if (option.disabled) return;

    const selected = new Set(this.selectedValues());

    if (selected.has(option.value)) {
      selected.delete(option.value);
    } else {
      if (this.maxSelections > 0 && selected.size >= this.maxSelections) {
        return; // Max selections reached
      }
      selected.add(option.value);
    }

    this.selectedValues.set(selected);
    const values = [...selected];
    this.onChangeFn(values);
    this.selectionChange.emit(values);
  }

  toggleSelectAll(): void {
    const allOptions = this.allOptions().filter(opt => !opt.disabled);
    const selected = this.selectedValues();

    if (selected.size === allOptions.length) {
      // Deselect all
      this.selectedValues.set(new Set());
      this.onChangeFn([]);
      this.selectionChange.emit([]);
    } else {
      // Select all (respecting max selections)
      const toSelect =
        this.maxSelections > 0 ? allOptions.slice(0, this.maxSelections) : allOptions;
      const values = toSelect.map(opt => opt.value);
      this.selectedValues.set(new Set(values));
      this.onChangeFn(values);
      this.selectionChange.emit(values);
    }
  }

  isSelected(option: MultiSelectOption): boolean {
    return this.selectedValues().has(option.value);
  }

  isAllSelected(): boolean {
    const allOptions = this.allOptions().filter(opt => !opt.disabled);
    return allOptions.length > 0 && this.selectedValues().size === allOptions.length;
  }

  isSomeSelected(): boolean {
    const { size } = this.selectedValues();
    return size > 0 && size < this.allOptions().filter(opt => !opt.disabled).length;
  }

  clearAll(): void {
    this.selectedValues.set(new Set());
    this.onChangeFn([]);
    this.selectionChange.emit([]);
  }

  protected onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterValue.set(input.value);
  }

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    if (this.isOpen()) {
      this.closeDropdown();
    }
  }

  private onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }

  private updateDropdownPosition(): void {
    if (!this.triggerButton?.nativeElement) return;

    const rect = this.triggerButton.nativeElement.getBoundingClientRect();
    this.dropdownPosition.set({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }
}
