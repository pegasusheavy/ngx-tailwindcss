import {
  AfterContentInit,
  Component,
  computed,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() variant: 'default' | 'bordered' | 'separated' = 'default';

  @Output() openChange = new EventEmitter<boolean>();

  protected _title = signal('');
  protected _open = signal(false);
  protected _disabled = signal(false);
  protected _value = signal('');

  hasHeaderContent = false;

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
    const { variant } = this;

    const variantClasses: Record<string, string> = {
      default: 'border-b border-slate-200 last:border-b-0',
      bordered: 'border border-slate-200 rounded-lg mb-2 last:mb-0',
      separated: 'bg-slate-50 rounded-lg mb-2 last:mb-0',
    };

    return variantClasses[variant];
  });

  protected headerClasses = computed(() => {
    const disabled = this.isDisabled();

    const classes = [
      'flex items-center justify-between w-full py-4 px-4 text-left font-medium transition-colors',
    ];

    if (disabled) {
      classes.push('text-slate-400 cursor-not-allowed');
    } else {
      classes.push('text-slate-900 hover:bg-slate-50');
    }

    return classes.join(' ');
  });

  protected iconClasses = computed(() => {
    const isOpen = this._open();

    return [
      'w-5 h-5 text-slate-500 transition-transform duration-200',
      isOpen ? 'rotate-180' : '',
    ].join(' ');
  });

  protected contentClasses = computed(() => 'px-4 pb-4 text-slate-600');
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
  @Input() set variant(value: 'default' | 'bordered' | 'separated') {
    this._variant.set(value);
  }
  @Input() set defaultValue(value: string | string[]) {
    this._defaultValue.set(value);
  }

  @ContentChildren(TwAccordionItemComponent) items!: QueryList<TwAccordionItemComponent>;

  protected _allowMultiple = signal(false);
  protected _variant = signal<'default' | 'bordered' | 'separated'>('default');
  protected _defaultValue = signal<string | string[]>('');

  ngAfterContentInit(): void {
    const defaultValue = this._defaultValue();
    const defaults = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

    this.items.forEach(item => {
      item.variant = this._variant();

      if (defaults.includes(item.getValue())) {
        item.setOpen(true);
      }

      item.openChange.subscribe(isOpen => {
        if (isOpen && !this._allowMultiple()) {
          this.items.forEach(other => {
            if (other !== item) {
              other.setOpen(false);
            }
          });
        }
      });
    });
  }

  protected accordionClasses = computed(() => {
    const variant = this._variant();

    const variantClasses: Record<string, string> = {
      default: 'border border-slate-200 rounded-lg divide-y divide-slate-200',
      bordered: '',
      separated: '',
    };

    return variantClasses[variant];
  });
}
