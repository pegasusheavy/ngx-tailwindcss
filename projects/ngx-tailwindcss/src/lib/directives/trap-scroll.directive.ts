import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
  booleanAttribute,
  NgZone,
} from '@angular/core';

/**
 * Directive to trap scroll within an element, preventing scroll propagation to parent
 * Useful for dropdowns, modals, and scrollable panels
 *
 * @example
 * ```html
 * <div twTrapScroll class="h-64 overflow-auto">
 *   <!-- Scrolling here won't affect parent -->
 *   <div class="h-[1000px]">Long content</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[twTrapScroll]',
  standalone: true,
})
export class TwTrapScrollDirective implements OnInit, OnDestroy {
  private el: ElementRef<HTMLElement>;
  private ngZone: NgZone;

  constructor() {
    this.el = inject(ElementRef);
    this.ngZone = inject(NgZone);
  }

  /** Disable scroll trapping */
  @Input({ transform: booleanAttribute })
  trapScrollDisabled: boolean = false;

  /** Allow horizontal scroll to propagate */
  @Input({ transform: booleanAttribute })
  trapScrollAllowHorizontal: boolean = false;

  private onWheel = (event: WheelEvent): void => {
    if (this.trapScrollDisabled) return;

    const element = this.el.nativeElement;
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = element;

    const isVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);
    const isHorizontal = !isVertical;

    if (isHorizontal && this.trapScrollAllowHorizontal) {
      return;
    }

    if (isVertical) {
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;
      const scrollingUp = event.deltaY < 0;
      const scrollingDown = event.deltaY > 0;

      if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
        event.preventDefault();
      }
    } else {
      const atLeft = scrollLeft <= 0;
      const atRight = scrollLeft + clientWidth >= scrollWidth;
      const scrollingLeft = event.deltaX < 0;
      const scrollingRight = event.deltaX > 0;

      if ((atLeft && scrollingLeft) || (atRight && scrollingRight)) {
        event.preventDefault();
      }
    }
  };

  private onTouchMove = (event: TouchEvent): void => {
    if (this.trapScrollDisabled) return;

    const element = this.el.nativeElement;

    // If element is not scrollable, prevent all touch scroll
    if (element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth) {
      event.preventDefault();
    }
  };

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      element.addEventListener('wheel', this.onWheel, { passive: false });
      element.addEventListener('touchmove', this.onTouchMove, { passive: false });
    });
  }

  ngOnDestroy(): void {
    const element = this.el.nativeElement;
    element.removeEventListener('wheel', this.onWheel);
    element.removeEventListener('touchmove', this.onTouchMove);
  }
}

