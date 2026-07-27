import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AriaUtils } from '../core/aria.service';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Adds a tooltip to any element with customizable position and styling
 *
 * @example
 * ```html
 * <button twTooltip="Click to save">Save</button>
 * <button twTooltip="Delete item" tooltipPosition="bottom">Delete</button>
 * <span [twTooltip]="dynamicMessage" [tooltipClass]="'bg-red-500'">Hover me</span>
 * ```
 */
@Directive({
  selector: '[twTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
  },
})
export class TwTooltipDirective implements OnDestroy, OnChanges {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tooltipId = AriaUtils.generateId('tw-tooltip');

  /** The tooltip text content */
  @Input('twTooltip') content = '';

  /** Position of the tooltip relative to the host element */
  @Input() tooltipPosition: TooltipPosition = 'top';

  /** Additional CSS classes to apply to the tooltip */
  @Input() tooltipClass = '';

  /** Delay before showing the tooltip in milliseconds */
  @Input({ transform: numberAttribute }) tooltipShowDelay = 200;

  /** Delay before hiding the tooltip in milliseconds */
  @Input({ transform: numberAttribute }) tooltipHideDelay = 0;

  /** Whether the tooltip is disabled */
  @Input({ transform: booleanAttribute }) tooltipDisabled = false;

  /** Custom z-index for the tooltip */
  @Input({ transform: numberAttribute }) tooltipZIndex = 9999;

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private isVisible = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] && this.tooltipElement) {
      this.tooltipElement.textContent = this.content;
      this.updatePosition();
    }
  }

  private readonly escapeHandler = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  private readonly repositionHandler = (): void => {
    this.updatePosition();
  };

  show(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.tooltipDisabled || !this.content) return;

    this.clearTimeouts();

    this.showTimeout = setTimeout(() => {
      this.createTooltip();
      this.isVisible = true;
    }, this.tooltipShowDelay);
  }

  hide(): void {
    this.clearTimeouts();

    this.hideTimeout = setTimeout(() => {
      this.destroyTooltip();
      this.isVisible = false;
    }, this.tooltipHideDelay);
  }

  private createTooltip(): void {
    if (this.tooltipElement) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.tooltipElement!.textContent = this.content;
    this.renderer.setAttribute(this.tooltipElement, 'id', this.tooltipId);
    this.renderer.setAttribute(this.tooltipElement, 'role', 'tooltip');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', this.tooltipId);

    // Base tooltip styles using Tailwind classes
    const baseClasses = [
      'fixed',
      'px-2',
      'py-1',
      'text-sm',
      'font-medium',
      'text-white',
      'bg-slate-900',
      'rounded',
      'shadow-lg',
      'pointer-events-none',
      'whitespace-nowrap',
      'opacity-0',
      'transition-opacity',
      'duration-150',
    ];

    // Add custom classes
    const allClasses = [...baseClasses, ...this.tooltipClass.split(' ').filter(Boolean)];
    allClasses.forEach(cls => {
      this.renderer.addClass(this.tooltipElement, cls);
    });

    this.renderer.setStyle(this.tooltipElement, 'z-index', this.tooltipZIndex.toString());

    // Add arrow
    const arrow = this.renderer.createElement('div');
    this.renderer.addClass(arrow, 'absolute');
    this.renderer.addClass(arrow, 'w-2');
    this.renderer.addClass(arrow, 'h-2');
    this.renderer.addClass(arrow, 'bg-slate-900');
    this.renderer.addClass(arrow, 'rotate-45');
    this.setArrowPosition(arrow);
    this.renderer.appendChild(this.tooltipElement, arrow);

    // Add to body
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Position and show
    this.updatePosition();

    // Dismiss on Escape and keep the tooltip anchored while visible
    document.addEventListener('keydown', this.escapeHandler);
    window.addEventListener('scroll', this.repositionHandler, true);
    window.addEventListener('resize', this.repositionHandler);

    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.renderer.removeClass(this.tooltipElement, 'opacity-0');
        this.renderer.addClass(this.tooltipElement, 'opacity-100');
      }
    });
  }

  private setArrowPosition(arrow: HTMLElement): void {
    switch (this.tooltipPosition) {
      case 'top': {
        this.renderer.setStyle(arrow, 'bottom', '-4px');
        this.renderer.setStyle(arrow, 'left', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
        break;
      }
      case 'bottom': {
        this.renderer.setStyle(arrow, 'top', '-4px');
        this.renderer.setStyle(arrow, 'left', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
        break;
      }
      case 'left': {
        this.renderer.setStyle(arrow, 'right', '-4px');
        this.renderer.setStyle(arrow, 'top', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
        break;
      }
      case 'right': {
        this.renderer.setStyle(arrow, 'left', '-4px');
        this.renderer.setStyle(arrow, 'top', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
        break;
      }
    }
  }

  private updatePosition(): void {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const gap = 8;

    let top: number;
    let left: number;

    switch (this.tooltipPosition) {
      case 'top': {
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      }
      case 'bottom': {
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      }
      case 'left': {
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      }
      case 'right': {
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
      }
    }

    // Keep tooltip within viewport
    const padding = 8;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      document.removeEventListener('keydown', this.escapeHandler);
      window.removeEventListener('scroll', this.repositionHandler, true);
      window.removeEventListener('resize', this.repositionHandler);
      this.renderer.removeAttribute(this.el.nativeElement, 'aria-describedby');
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.destroyTooltip();
  }
}
