import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  booleanAttribute,
  computed,
  signal,
  ElementRef,
  Directive,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  effect,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type DropdownPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left' | 'right';

/**
 * Dropdown item directive
 */
@Directive({
  selector: '[twDropdownItem]',
  standalone: true,
  host: {
    'class': 'block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer',
    'role': 'menuitem',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.aria-disabled]': 'disabled',
  },
})
export class TwDropdownItemDirective {
  @Input({ transform: booleanAttribute }) disabled = false;
}

/**
 * Dropdown divider
 */
@Component({
  selector: 'tw-dropdown-divider',
  standalone: true,
  host: {
    'class': 'block my-1 border-t border-slate-200',
    'role': 'separator',
  },
  template: ``,
})
export class TwDropdownDividerComponent {}

/**
 * Dropdown header/label
 */
@Component({
  selector: 'tw-dropdown-header',
  standalone: true,
  host: {
    'class': 'block px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider',
  },
  template: `<ng-content></ng-content>`,
})
export class TwDropdownHeaderComponent {}

/**
 * Dropdown menu component
 *
 * @example
 * ```html
 * <tw-dropdown>
 *   <button twDropdownTrigger>Open Menu</button>
 *   <tw-dropdown-menu>
 *     <tw-dropdown-header>Actions</tw-dropdown-header>
 *     <button twDropdownItem (click)="edit()">Edit</button>
 *     <button twDropdownItem (click)="duplicate()">Duplicate</button>
 *     <tw-dropdown-divider></tw-dropdown-divider>
 *     <button twDropdownItem (click)="delete()" class="text-rose-600 hover:text-rose-700 hover:bg-rose-50">Delete</button>
 *   </tw-dropdown-menu>
 * </tw-dropdown>
 * ```
 */
@Component({
  selector: 'tw-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.component.html',
  host: {
    'class': 'inline-block text-left',
  },
})
export class TwDropdownComponent implements OnDestroy {
  private twClass = inject(TwClassService);
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('triggerContainer') triggerContainer!: ElementRef<HTMLElement>;

  /** Position of the dropdown menu */
  @Input() position: DropdownPosition = 'bottom-start';

  /** Width of the dropdown menu */
  @Input() width: 'auto' | 'trigger' | string = 'auto';

  /** Maximum height of the dropdown menu */
  @Input() maxHeight = '300px';

  /** Whether the dropdown is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Close on item click */
  @Input({ transform: booleanAttribute }) closeOnSelect = true;

  /** Additional menu classes */
  @Input() menuClass = '';

  /** Event emitted when the dropdown opens */
  @Output() opened = new EventEmitter<void>();

  /** Event emitted when the dropdown closes */
  @Output() closed = new EventEmitter<void>();

  protected isOpen = signal(false);

  // Portal elements
  private portalHost: HTMLElement | null = null;
  private portalElement: HTMLElement | null = null;
  private clickOutsideListener: (() => void) | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private keydownListener: (() => void) | null = null;

  protected menuClasses = computed(() => {
    const widthClass = this.width === 'auto' ? 'min-w-[10rem]' :
                       this.width === 'trigger' ? '' :
                       '';

    return this.twClass.merge(
      'rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-auto py-1',
      widthClass,
      this.menuClass
    );
  });

  constructor() {
    // Create portal when open state changes
    effect(() => {
      if (this.isOpen()) {
        this.createPortal();
      } else {
        this.destroyPortal();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyPortal();
  }

  toggle(): void {
    if (this.disabled) return;

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  private createPortal(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Create portal host at body level
    this.portalHost = this.renderer.createElement('div');
    this.renderer.setStyle(this.portalHost, 'position', 'fixed');
    this.renderer.setStyle(this.portalHost, 'z-index', '9999');
    this.renderer.setStyle(this.portalHost, 'top', '0');
    this.renderer.setStyle(this.portalHost, 'left', '0');
    this.renderer.setStyle(this.portalHost, 'pointer-events', 'none');
    this.renderer.appendChild(this.document.body, this.portalHost);

    // Create the dropdown element
    this.portalElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.portalElement, 'position', 'absolute');
    this.renderer.setStyle(this.portalElement, 'pointer-events', 'auto');
    this.renderer.setStyle(this.portalElement, 'max-height', this.maxHeight);

    // Apply classes
    const classes = this.menuClasses().split(' ');
    classes.forEach(cls => {
      if (cls) this.renderer.addClass(this.portalElement, cls);
    });

    // Add animation classes
    this.renderer.setStyle(this.portalElement, 'opacity', '0');
    this.renderer.setStyle(this.portalElement, 'transform', 'scale(0.95)');
    this.renderer.setStyle(this.portalElement, 'transition', 'opacity 100ms ease-out, transform 100ms ease-out');

    // Set ARIA attributes
    this.renderer.setAttribute(this.portalElement, 'role', 'menu');
    this.renderer.setAttribute(this.portalElement, 'aria-orientation', 'vertical');

    this.renderer.appendChild(this.portalHost, this.portalElement);

    // Move menu content to portal
    const menuContent = this.elementRef.nativeElement.querySelector('tw-dropdown-menu');
    if (menuContent) {
      const clone = menuContent.cloneNode(true) as HTMLElement;
      this.renderer.appendChild(this.portalElement, clone);
    }

    // Position the dropdown
    this.updatePosition();

    // Animate in
    requestAnimationFrame(() => {
      if (this.portalElement) {
        this.renderer.setStyle(this.portalElement, 'opacity', '1');
        this.renderer.setStyle(this.portalElement, 'transform', 'scale(1)');
      }
    });

    // Add event listeners
    this.clickOutsideListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = this.elementRef.nativeElement.contains(target);
      const isInsidePortal = this.portalElement?.contains(target);

      if (!isInsideTrigger && !isInsidePortal) {
        this.close();
      }
    });

    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.updatePosition();
    });

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updatePosition();
    });

    this.keydownListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });

    // Handle clicks on dropdown items
    if (this.closeOnSelect && this.portalElement) {
      this.renderer.listen(this.portalElement, 'click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.hasAttribute('twdropdownitem') || target.closest('[twdropdownitem]')) {
          this.close();
        }
      });
    }
  }

  private destroyPortal(): void {
    if (this.portalHost && this.document.body.contains(this.portalHost)) {
      this.renderer.removeChild(this.document.body, this.portalHost);
    }
    this.portalHost = null;
    this.portalElement = null;

    if (this.clickOutsideListener) {
      this.clickOutsideListener();
      this.clickOutsideListener = null;
    }
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      this.resizeListener();
      this.resizeListener = null;
    }
    if (this.keydownListener) {
      this.keydownListener();
      this.keydownListener = null;
    }
  }

  private updatePosition(): void {
    if (!this.portalElement || !isPlatformBrowser(this.platformId)) return;

    const triggerEl = this.triggerContainer?.nativeElement || this.elementRef.nativeElement;
    const rect = triggerEl.getBoundingClientRect();
    const portalRect = this.portalElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    // Set width if trigger width
    if (this.width === 'trigger') {
      this.renderer.setStyle(this.portalElement, 'width', `${rect.width}px`);
    } else if (this.width !== 'auto') {
      this.renderer.setStyle(this.portalElement, 'width', this.width);
    }

    const gap = 4; // margin between trigger and dropdown

    switch (this.position) {
      case 'bottom-start':
        top = rect.bottom + gap;
        left = rect.left;
        break;
      case 'bottom-end':
        top = rect.bottom + gap;
        left = rect.right - portalRect.width;
        break;
      case 'top-start':
        top = rect.top - portalRect.height - gap;
        left = rect.left;
        break;
      case 'top-end':
        top = rect.top - portalRect.height - gap;
        left = rect.right - portalRect.width;
        break;
      case 'left':
        top = rect.top;
        left = rect.left - portalRect.width - gap;
        break;
      case 'right':
        top = rect.top;
        left = rect.right + gap;
        break;
    }

    // Ensure dropdown stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = gap;
    if (left + portalRect.width > viewportWidth) {
      left = viewportWidth - portalRect.width - gap;
    }
    if (top < 0) top = gap;
    if (top + portalRect.height > viewportHeight) {
      top = viewportHeight - portalRect.height - gap;
    }

    this.renderer.setStyle(this.portalElement, 'top', `${top}px`);
    this.renderer.setStyle(this.portalElement, 'left', `${left}px`);
  }
}

/**
 * Dropdown menu container
 */
@Component({
  selector: 'tw-dropdown-menu',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TwDropdownMenuComponent {}

/**
 * Trigger directive for dropdown
 */
@Directive({
  selector: '[twDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'expanded',
  },
})
export class TwDropdownTriggerDirective {
  expanded = false;
}
