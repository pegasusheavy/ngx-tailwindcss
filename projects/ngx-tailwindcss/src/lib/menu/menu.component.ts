import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface MenuItem {
  id?: string | number;
  label?: string;
  icon?: TemplateRef<any>;
  command?: (event: { item: MenuItem }) => void;
  url?: string;
  /**
   * @deprecated The library does not depend on `@angular/router`; this value is
   * rendered as a plain `href` (array segments joined with `/`). Prefer `url`.
   */
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

const MENU_POPUP_CLASSES =
  'rounded-lg shadow-lg dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700';

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
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);

  /** Menu items */
  readonly items = input<MenuItem[]>([]);

  /** Visual variant */
  readonly variant = input<MenuVariant>('default');

  /** Whether menu is popup style */
  readonly popup = input(false, { transform: booleanAttribute });

  /** Additional classes */
  readonly classOverride = input('');

  /** Item select event */
  readonly onSelect = output<MenuItem>();

  protected openSubmenu = signal<MenuItem | null>(null);

  protected containerClasses = computed(() => {
    const variantClasses = {
      default: 'bg-white dark:bg-slate-800',
      bordered:
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg',
      elevated:
        'bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700',
    };

    return this.twClass.merge(
      'py-1 min-w-48',
      variantClasses[this.variant()],
      this.popup() ? MENU_POPUP_CLASSES : '',
      this.classOverride()
    );
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

  /** Href for link items: `url` wins; `routerLink` renders as a plain href fallback */
  protected itemHref(item: MenuItem): string | null {
    if (item.url) return item.url;
    if (item.routerLink) {
      return Array.isArray(item.routerLink) ? item.routerLink.join('/') : item.routerLink;
    }
    return null;
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

  protected onLinkClick(item: MenuItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.onItemClick(item);
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const { key } = event;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;

    const menuItems = [
      ...(this.elementRef.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'
      ),
    ];
    if (menuItems.length === 0) return;

    event.preventDefault();
    const activeIndex = menuItems.indexOf(this.document.activeElement as HTMLElement);
    let nextIndex: number;

    switch (key) {
      case 'ArrowDown': {
        nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % menuItems.length;
        break;
      }
      case 'ArrowUp': {
        nextIndex =
          activeIndex < 0
            ? menuItems.length - 1
            : (activeIndex - 1 + menuItems.length) % menuItems.length;
        break;
      }
      case 'Home': {
        nextIndex = 0;
        break;
      }
      default: {
        // End
        nextIndex = menuItems.length - 1;
        break;
      }
    }

    menuItems[nextIndex].focus();
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
  templateUrl: './context-menu.component.html',
  host: {
    '(document:click)': 'hide()',
    '(document:contextmenu)': 'hide()',
  },
})
export class TwContextMenuComponent {
  readonly items = input<MenuItem[]>([]);
  readonly onSelect = output<MenuItem>();
  readonly onHide = output();

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
