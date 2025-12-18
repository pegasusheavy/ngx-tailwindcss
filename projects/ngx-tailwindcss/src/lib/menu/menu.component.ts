import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface MenuItem {
  id?: string | number;
  label?: string;
  icon?: TemplateRef<any>;
  command?: (event: { item: MenuItem }) => void;
  url?: string;
  routerLink?: string | any[];
  disabled?: boolean;
  visible?: boolean;
  separator?: boolean;
  items?: MenuItem[];
  shortcut?: string;
  badge?: string;
  styleClass?: string;
}

export type MenuVariant = 'default' | 'bordered' | 'elevated';

/**
 * Menu component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-menu [items]="menuItems" (onSelect)="handleSelect($event)"></tw-menu>
 * ```
 */
@Component({
  selector: 'tw-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
})
export class TwMenuComponent {
  private readonly twClass = inject(TwClassService);

  /** Menu items */
  @Input() items: MenuItem[] = [];

  /** Visual variant */
  @Input() variant: MenuVariant = 'default';

  /** Whether menu is popup style */
  @Input({ transform: booleanAttribute }) popup = false;

  /** Additional classes */
  @Input() classOverride = '';

  /** Item select event */
  @Output() onSelect = new EventEmitter<MenuItem>();

  protected openSubmenu = signal<MenuItem | null>(null);

  protected containerClasses = computed(() => {
    const variantClasses = {
      default: 'bg-white dark:bg-slate-800',
      bordered: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg',
      elevated: 'bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700',
    };

    return this.twClass.merge('py-1 min-w-48', variantClasses[this.variant], this.classOverride);
  });

  protected itemClasses(item: MenuItem) {
    return this.twClass.merge(
      'w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors',
      'focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-700',
      item.disabled
        ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer',
      item.styleClass || ''
    );
  }

  protected separatorClasses() {
    return 'my-1 border-t border-slate-200 dark:border-slate-700';
  }

  protected submenuClasses() {
    return this.twClass.merge(
      'absolute left-full top-0 ml-1 py-1 min-w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700',
      'animate-in fade-in-0 zoom-in-95 duration-100'
    );
  }

  protected badgeClasses() {
    return 'ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
  }

  onSubmenuEnter(item: MenuItem): void {
    this.openSubmenu.set(item);
  }

  onSubmenuLeave(): void {
    this.openSubmenu.set(null);
  }

  onItemClick(item: MenuItem): void {
    if (item.disabled) return;

    if (item.command) {
      item.command({ item });
    }

    this.onSelect.emit(item);
  }
}

/**
 * Context menu component
 */
@Component({
  selector: 'tw-context-menu',
  standalone: true,
  imports: [CommonModule, TwMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="fixed z-50"
        [style.left.px]="x()"
        [style.top.px]="y()"
        (click)="$event.stopPropagation()"
      >
        <tw-menu [items]="items" variant="elevated" (onSelect)="onItemSelect($event)"></tw-menu>
      </div>
    }
  `,
  host: {
    '(document:click)': 'hide()',
    '(document:contextmenu)': 'hide()',
  },
})
export class TwContextMenuComponent {
  @Input() items: MenuItem[] = [];
  @Output() onSelect = new EventEmitter<MenuItem>();
  @Output() onHide = new EventEmitter<void>();

  protected visible = signal(false);
  protected x = signal(0);
  protected y = signal(0);

  show(event: MouseEvent): void {
    event.preventDefault();
    this.x.set(event.clientX);
    this.y.set(event.clientY);
    this.visible.set(true);
  }

  hide(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.onHide.emit();
    }
  }

  onItemSelect(item: MenuItem): void {
    this.onSelect.emit(item);
    this.hide();
  }
}
