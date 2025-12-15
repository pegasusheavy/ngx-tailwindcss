import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  booleanAttribute,
  AfterViewInit,
} from '@angular/core';

/**
 * Adds a material-design style ripple effect to any element
 *
 * @example
 * ```html
 * <button twRipple>Click me</button>
 * <button twRipple [rippleColor]="'rgba(255,255,255,0.3)'">Light ripple</button>
 * <button twRipple [rippleDisabled]="isDisabled">Conditional</button>
 * ```
 */
@Directive({
  selector: '[twRipple]',
  standalone: true,
  host: {
    'style': 'position: relative; overflow: hidden;',
  },
})
export class TwRippleDirective implements OnDestroy, AfterViewInit {
  private el: ElementRef;
  private renderer: Renderer2;

  /** Color of the ripple effect */
  @Input() rippleColor = 'rgba(255, 255, 255, 0.4)';

  /** Duration of the ripple animation in milliseconds */
  @Input() rippleDuration = 600;

  /** Whether the ripple effect is disabled */
  @Input({ transform: booleanAttribute }) rippleDisabled = false;

  /** Whether to center the ripple regardless of click position */
  @Input({ transform: booleanAttribute }) rippleCentered = false;

  private activeRipples: HTMLElement[] = [];
  private initialized = false;

  constructor() {
    this.el = inject(ElementRef);
    this.renderer = inject(Renderer2);
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onInteraction(event: MouseEvent | TouchEvent): void {
    if (this.rippleDisabled || !this.initialized) return;

    this.createRipple(event);
  }

  private createRipple(event: MouseEvent | TouchEvent): void {
    const el = this.el.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();

    const ripple = this.renderer.createElement('span');

    // Calculate ripple size (should cover the entire element with some margin)
    const diameter = Math.max(rect.width, rect.height);
    const size = diameter * 2.5;

    // Calculate position
    let x: number, y: number;

    if (this.rippleCentered) {
      x = rect.width / 2;
      y = rect.height / 2;
    } else if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else if (event.touches && event.touches[0]) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = rect.width / 2;
      y = rect.height / 2;
    }

    // Apply styles - use inline styles for maximum compatibility
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background-color: ${this.rippleColor};
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      transform: scale(0);
      opacity: 0.6;
      pointer-events: none;
      z-index: 0;
    `;

    this.renderer.appendChild(el, ripple);
    this.activeRipples.push(ripple);

    // Trigger animation using Web Animations API for smoother animation
    const animation = ripple.animate(
      [
        { transform: 'scale(0)', opacity: 0.6 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      {
        duration: this.rippleDuration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      }
    );

    // Remove ripple after animation
    animation.onfinish = () => {
      this.removeRipple(ripple);
    };
  }

  private removeRipple(ripple: HTMLElement): void {
    const index = this.activeRipples.indexOf(ripple);
    if (index > -1) {
      this.activeRipples.splice(index, 1);
    }

    if (ripple.parentNode) {
      this.renderer.removeChild(this.el.nativeElement, ripple);
    }
  }

  ngOnDestroy(): void {
    this.activeRipples.forEach(ripple => this.removeRipple(ripple));
  }
}

