import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  numberAttribute,
  booleanAttribute,
  NgZone,
} from '@angular/core';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

/**
 * Directive to detect swipe gestures
 *
 * @example
 * ```html
 * <div twSwipe (swipe)="onSwipe($event)">Swipe me</div>
 * <div twSwipe (swipeLeft)="goNext()" (swipeRight)="goPrev()">Carousel</div>
 * <div twSwipe [swipeThreshold]="100" (swipeUp)="refresh()">Pull to refresh</div>
 * ```
 */
@Directive({
  selector: '[twSwipe]',
  standalone: true,
})
export class TwSwipeDirective implements OnInit, OnDestroy {
  private el: ElementRef<HTMLElement>;
  private ngZone: NgZone;

  constructor() {
    this.el = inject(ElementRef);
    this.ngZone = inject(NgZone);
  }

  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;

  /** Minimum distance in pixels to trigger swipe (default: 50px) */
  @Input({ transform: numberAttribute })
  swipeThreshold: number = 50;

  /** Maximum time in ms for the swipe gesture (default: 300ms) */
  @Input({ transform: numberAttribute })
  swipeTimeout: number = 300;

  /** Minimum velocity to trigger swipe (pixels/ms) */
  @Input({ transform: numberAttribute })
  swipeVelocity: number = 0.3;

  /** Disable swipe detection */
  @Input({ transform: booleanAttribute })
  swipeDisabled: boolean = false;

  /** Emits on any swipe */
  @Output()
  swipe = new EventEmitter<SwipeEvent>();

  /** Emits on swipe left */
  @Output()
  swipeLeft = new EventEmitter<SwipeEvent>();

  /** Emits on swipe right */
  @Output()
  swipeRight = new EventEmitter<SwipeEvent>();

  /** Emits on swipe up */
  @Output()
  swipeUp = new EventEmitter<SwipeEvent>();

  /** Emits on swipe down */
  @Output()
  swipeDown = new EventEmitter<SwipeEvent>();

  private onTouchStart = (event: TouchEvent): void => {
    if (this.swipeDisabled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  };

  private onTouchEnd = (event: TouchEvent): void => {
    if (this.swipeDisabled || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const duration = endTime - this.startTime;

    if (duration > this.swipeTimeout) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if horizontal or vertical swipe
    const isHorizontal = absX > absY;
    const distance = isHorizontal ? absX : absY;
    const velocity = distance / duration;

    if (distance < this.swipeThreshold || velocity < this.swipeVelocity) return;

    let direction: SwipeDirection;
    if (isHorizontal) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    const swipeEvent: SwipeEvent = {
      direction,
      distance,
      velocity,
      startX: this.startX,
      startY: this.startY,
      endX,
      endY,
      duration,
    };

    this.ngZone.run(() => {
      this.swipe.emit(swipeEvent);

      switch (direction) {
        case 'left':
          this.swipeLeft.emit(swipeEvent);
          break;
        case 'right':
          this.swipeRight.emit(swipeEvent);
          break;
        case 'up':
          this.swipeUp.emit(swipeEvent);
          break;
        case 'down':
          this.swipeDown.emit(swipeEvent);
          break;
      }
    });
  };

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      element.addEventListener('touchstart', this.onTouchStart, { passive: true });
      element.addEventListener('touchend', this.onTouchEnd, { passive: true });
    });
  }

  ngOnDestroy(): void {
    const element = this.el.nativeElement;
    element.removeEventListener('touchstart', this.onTouchStart);
    element.removeEventListener('touchend', this.onTouchEnd);
  }
}

