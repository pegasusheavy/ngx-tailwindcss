import {
  AfterContentInit,
  Component,
  computed,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

export type AccordionVariant = 'default' | 'bordered' | 'separated';

let nextAccordionItemId = 0;

/**
 * Marks projected content as the custom header of an accordion item,
 * replacing the plain-text `itemTitle`.
 */
@Directive({
  selector: '[twAccordionHeader]',
  standalone: true,
})
export class TwAccordionHeaderDirective {}

@Component({
  selector: 'tw-accordion-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-item.component.html',
})
export class TwAccordionItemComponent {
  @Input() set itemTitle(value: string) {
    this._title.set(value);
  }
  @Input() set open(value: boolean) {
    this._open.set(value);
  }
  @Input() set itemDisabled(value: boolean) {
    this._disabled.set(value);
  }
  @Input() set value(value: string) {
    this._value.set(value);
  }
  @Input() set variant(value: AccordionVariant) {
    this._variant.set(value);
  }

  @Output() openChange = new EventEmitter<boolean>();

  @ContentChild(TwAccordionHeaderDirective) protected headerContent?: TwAccordionHeaderDirective;

  protected _title = signal('');
  protected _open = signal(false);
  protected _disabled = signal(false);
  protected _value = signal('');
  protected _variant = signal<AccordionVariant>('default');

  protected readonly itemId = `tw-accordion-item-${nextAccordionItemId++}`;
  protected readonly headerId = `${this.itemId}-header`;
  protected readonly panelId = `${this.itemId}-panel`;

  get hasHeaderContent(): boolean {
    return !!this.headerContent;
  }

  protected itemTitleValue = computed(() => this._title());
  protected isOpen = computed(() => this._open());
  protected isDisabled = computed(() => this._disabled());

  toggle(): void {
    if (this.isDisabled()) return;
    this._open.update(v => !v);
    this.openChange.emit(this._open());
  }

  setOpen(open: boolean): void {
    this._open.set(open);
  }

  getValue(): string {
    return this._value();
  }

  protected itemClasses = computed(() => {
    const variant = this._variant();

    const variantClasses: Record<string, string> = {
      default: 'border-b border-slate-200 dark:border-slate-700 last:border-b-0',
      bordered: 'border border-slate-200 dark:border-slate-700 rounded-lg mb-2 last:mb-0',
      separated: 'bg-slate-50 dark:bg-slate-800 rounded-lg mb-2 last:mb-0',
    };

    return variantClasses[variant];
  });

  protected headerClasses = computed(() => {
    const disabled = this.isDisabled();

    const classes = [
      'flex items-center justify-between w-full py-4 px-4 text-left font-medium transition-colors',
    ];

    if (disabled) {
      classes.push('text-slate-400 dark:text-slate-500 cursor-not-allowed');
    } else {
      classes.push('text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800');
    }

    return classes.join(' ');
  });

  protected iconClasses = computed(() => {
    const isOpen = this._open();

    return [
      'w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200',
      isOpen ? 'rotate-180' : '',
    ].join(' ');
  });

  protected contentClasses = computed(() => 'px-4 pb-4 text-slate-600 dark:text-slate-400');
}

@Component({
  selector: 'tw-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
})
export class TwAccordionComponent implements AfterContentInit {
  @Input() set allowMultiple(value: boolean) {
    this._allowMultiple.set(value);
  }
  @Input() set variant(value: AccordionVariant) {
    this._variant.set(value);
  }
  @Input() set defaultValue(value: string | string[]) {
    this._defaultValue.set(value);
  }

  @ContentChildren(TwAccordionItemComponent) items!: QueryList<TwAccordionItemComponent>;

  protected _allowMultiple = signal(false);
  protected _variant = signal<AccordionVariant>('default');
  protected _defaultValue = signal<string | string[]>('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly initializedItems = new WeakSet<TwAccordionItemComponent>();
  private itemSubscriptions = new Subscription();

  constructor() {
    // Re-propagate the variant to items whenever it changes
    effect(() => {
      const variant = this._variant();
      this.items?.forEach(item => (item.variant = variant));
    });

    this.destroyRef.onDestroy(() => {
      this.itemSubscriptions.unsubscribe();
    });
  }

  ngAfterContentInit(): void {
    this.wireItems();

    this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.wireItems();
    });
  }

  private wireItems(): void {
    // Re-subscribe from scratch so removed items are released and none is doubly subscribed
    this.itemSubscriptions.unsubscribe();
    this.itemSubscriptions = new Subscription();

    const defaultValue = this._defaultValue();
    const defaults = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

    this.items.forEach(item => {
      item.variant = this._variant();

      // Only apply default-open state the first time an item is seen
      if (!this.initializedItems.has(item)) {
        this.initializedItems.add(item);

        if (defaults.includes(item.getValue())) {
          item.setOpen(true);
        }
      }

      this.itemSubscriptions.add(
        item.openChange.subscribe(isOpen => {
          if (isOpen && !this._allowMultiple()) {
            this.items.forEach(other => {
              if (other !== item) {
                other.setOpen(false);
              }
            });
          }
        })
      );
    });
  }

  protected accordionClasses = computed(() => {
    const variant = this._variant();

    const variantClasses: Record<string, string> = {
      default:
        'border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700',
      bordered: '',
      separated: '',
    };

    return variantClasses[variant];
  });
}
