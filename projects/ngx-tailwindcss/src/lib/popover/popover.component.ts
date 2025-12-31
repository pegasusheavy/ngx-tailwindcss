import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';

/**
 * Popover component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-popover header="Settings">
 *   <button twPopoverTrigger>Open</button>
 *   <p>Popover content here</p>
 * </tw-popover>
 * ```
 */
@Component({
  selector: 'tw-popover',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popover.component.html',
  host: {
    class: 'inline-block',
  },
})
export class TwPopoverComponent implements OnDestroy {
  private readonly twClass = inject(TwClassService);
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('triggerContainer') triggerContainer!: ElementRef<HTMLElement>;

  /** Position relative to trigger */
  @Input() position: PopoverPosition = 'bottom';

  /** How the popover is triggered */
  @Input() trigger: PopoverTrigger = 'click';

  /** Header text */
  @Input() header = '';

  /** Whether to show arrow */
  @Input({ transform: booleanAttribute }) showArrow = true;

  /** Whether clicking outside closes the popover */
  @Input({ transform: booleanAttribute }) dismissible = true;

  /** Close on escape key */
  @Input({ transform: booleanAttribute }) closeOnEscape = true;

  /** Hover delay in milliseconds */
  @Input({ transform: numberAttribute }) hoverDelay = 200;

  /** Additional classes */
  @Input() classOverride = '';

  /** Show event */
  @Output() onShow = new EventEmitter<void>();

  /** Hide event */
  @Output() onHide = new EventEmitter<void>();

  @ContentChild('twPopoverFooter') footerTemplate!: TemplateRef<any>;

  protected visible = signal(false);
  private hoverTimeout: any = null;

  // Portal elements
  private portalHost: HTMLElement | null = null;
  private portalElement: HTMLElement | null = null;
  private clickOutsideListener: (() => void) | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private keydownListener: (() => void) | null = null;
  private portalMouseEnterListener: (() => void) | null = null;
  private portalMouseLeaveListener: (() => void) | null = null;

  protected get hasFooter(): boolean {
    return !!this.footerTemplate;
  }

  protected popoverClasses = computed(() => {
    return this.twClass.merge(
      'min-w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700',
      this.classOverride
    );
  });

  constructor() {
    // Create portal when visible state changes
    effect(() => {
      if (this.visible()) {
        this.createPortal();
      } else {
        this.destroyPortal();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearHoverTimeout();
    this.destroyPortal();
  }

  onTriggerClick(): void {
    if (this.trigger === 'click') {
      this.toggle();
    }
  }

  onTriggerEnter(): void {
    if (this.trigger === 'hover') {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.show();
      }, this.hoverDelay);
    }
  }

  onTriggerLeave(): void {
    if (this.trigger === 'hover') {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.hide();
      }, this.hoverDelay);
    }
  }

  private onPopoverEnter(): void {
    if (this.trigger === 'hover') {
      this.clearHoverTimeout();
    }
  }

  private onPopoverLeave(): void {
    if (this.trigger === 'hover') {
      this.clearHoverTimeout();
      this.hoverTimeout = setTimeout(() => {
        this.hide();
      }, this.hoverDelay);
    }
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  show(): void {
    this.visible.set(true);
    this.onShow.emit();
  }

  hide(): void {
    this.visible.set(false);
    this.onHide.emit();
  }

  toggle(): void {
    if (this.visible()) {
      this.hide();
    } else {
      this.show();
    }
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

    // Create the popover element
    this.portalElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.portalElement, 'position', 'absolute');
    this.renderer.setStyle(this.portalElement, 'pointer-events', 'auto');

    // Apply classes
    const classes = this.popoverClasses().split(' ');
    classes.forEach(cls => {
      if (cls) this.renderer.addClass(this.portalElement, cls);
    });

    // Add animation styles
    this.renderer.setStyle(this.portalElement, 'opacity', '0');
    this.renderer.setStyle(this.portalElement, 'transform', 'scale(0.95)');
    this.renderer.setStyle(
      this.portalElement,
      'transition',
      'opacity 150ms ease-out, transform 150ms ease-out'
    );

    // Set ARIA attributes
    this.renderer.setAttribute(this.portalElement, 'role', 'tooltip');

    // Build popover content
    this.buildPopoverContent();

    this.renderer.appendChild(this.portalHost, this.portalElement);

    // Position the popover
    this.updatePosition();

    // Animate in
    requestAnimationFrame(() => {
      if (this.portalElement) {
        this.renderer.setStyle(this.portalElement, 'opacity', '1');
        this.renderer.setStyle(this.portalElement, 'transform', 'scale(1)');
      }
    });

    // Add event listeners
    if (this.dismissible && this.trigger === 'click') {
      this.clickOutsideListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        const target = event.target as Node;
        const isInsideTrigger = this.elementRef.nativeElement.contains(target);
        const isInsidePortal = this.portalElement?.contains(target);

        if (!isInsideTrigger && !isInsidePortal) {
          this.hide();
        }
      });
    }

    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.updatePosition();
    });

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updatePosition();
    });

    if (this.closeOnEscape) {
      this.keydownListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.hide();
        }
      });
    }

    // Hover listeners for portal
    if (this.trigger === 'hover' && this.portalElement) {
      this.portalMouseEnterListener = this.renderer.listen(this.portalElement, 'mouseenter', () => {
        this.onPopoverEnter();
      });
      this.portalMouseLeaveListener = this.renderer.listen(this.portalElement, 'mouseleave', () => {
        this.onPopoverLeave();
      });
    }
  }

  private buildPopoverContent(): void {
    if (!this.portalElement) return;

    // Arrow
    if (this.showArrow) {
      const arrow = this.renderer.createElement('div');
      const arrowClasses = this.getArrowClasses();
      arrowClasses.split(' ').forEach(cls => {
        if (cls) this.renderer.addClass(arrow, cls);
      });
      this.renderer.appendChild(this.portalElement, arrow);
    }

    // Header
    if (this.header) {
      const headerEl = this.renderer.createElement('div');
      this.renderer.addClass(headerEl, 'px-4');
      this.renderer.addClass(headerEl, 'py-2');
      this.renderer.addClass(headerEl, 'border-b');
      this.renderer.addClass(headerEl, 'border-slate-200');
      this.renderer.addClass(headerEl, 'dark:border-slate-700');
      this.renderer.addClass(headerEl, 'font-semibold');
      this.renderer.addClass(headerEl, 'text-slate-900');
      this.renderer.addClass(headerEl, 'dark:text-slate-100');
      const headerText = this.renderer.createText(this.header);
      this.renderer.appendChild(headerEl, headerText);
      this.renderer.appendChild(this.portalElement, headerEl);
    }

    // Content
    const contentWrapper = this.renderer.createElement('div');
    this.renderer.addClass(contentWrapper, 'px-4');
    this.renderer.addClass(contentWrapper, 'py-3');

    // Clone content from the component
    const contentSource = this.elementRef.nativeElement.querySelector('.popover-content-source');
    if (contentSource) {
      const clone = contentSource.cloneNode(true) as HTMLElement;
      clone.style.display = 'block';
      this.renderer.appendChild(contentWrapper, clone);
    }
    this.renderer.appendChild(this.portalElement, contentWrapper);

    // Footer
    const footerSource = this.elementRef.nativeElement.querySelector('[twPopoverFooter]');
    if (footerSource) {
      const footerWrapper = this.renderer.createElement('div');
      this.renderer.addClass(footerWrapper, 'px-4');
      this.renderer.addClass(footerWrapper, 'py-2');
      this.renderer.addClass(footerWrapper, 'border-t');
      this.renderer.addClass(footerWrapper, 'border-slate-200');
      this.renderer.addClass(footerWrapper, 'dark:border-slate-700');
      this.renderer.addClass(footerWrapper, 'bg-slate-50');
      this.renderer.addClass(footerWrapper, 'dark:bg-slate-900');
      const footerClone = footerSource.cloneNode(true) as HTMLElement;
      this.renderer.appendChild(footerWrapper, footerClone);
      this.renderer.appendChild(this.portalElement, footerWrapper);
    }
  }

  private getArrowClasses(): string {
    const baseClasses = 'absolute w-2.5 h-2.5 bg-white dark:bg-slate-800 rotate-45 shadow-sm';
    const positionClasses: Record<PopoverPosition, string> = {
      top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r border-slate-200 dark:border-slate-700',
      bottom:
        'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l border-slate-200 dark:border-slate-700',
      left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r border-slate-200 dark:border-slate-700',
      right:
        'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l border-slate-200 dark:border-slate-700',
    };
    return this.twClass.merge(baseClasses, positionClasses[this.position]);
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
    if (this.portalMouseEnterListener) {
      this.portalMouseEnterListener();
      this.portalMouseEnterListener = null;
    }
    if (this.portalMouseLeaveListener) {
      this.portalMouseLeaveListener();
      this.portalMouseLeaveListener = null;
    }
  }

  private updatePosition(): void {
    if (!this.portalElement || !isPlatformBrowser(this.platformId)) return;

    const triggerEl = this.triggerContainer?.nativeElement || this.elementRef.nativeElement;
    const rect = triggerEl.getBoundingClientRect();
    const portalRect = this.portalElement.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const gap = 8; // margin between trigger and popover

    switch (this.position) {
      case 'top': {
        top = rect.top - portalRect.height - gap;
        left = rect.left + rect.width / 2 - portalRect.width / 2;
        break;
      }
      case 'bottom': {
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - portalRect.width / 2;
        break;
      }
      case 'left': {
        top = rect.top + rect.height / 2 - portalRect.height / 2;
        left = rect.left - portalRect.width - gap;
        break;
      }
      case 'right': {
        top = rect.top + rect.height / 2 - portalRect.height / 2;
        left = rect.right + gap;
        break;
      }
    }

    // Ensure popover stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < gap) left = gap;
    if (left + portalRect.width > viewportWidth - gap) {
      left = viewportWidth - portalRect.width - gap;
    }
    if (top < gap) top = gap;
    if (top + portalRect.height > viewportHeight - gap) {
      top = viewportHeight - portalRect.height - gap;
    }

    this.renderer.setStyle(this.portalElement, 'top', `${top}px`);
    this.renderer.setStyle(this.portalElement, 'left', `${left}px`);
  }
}
