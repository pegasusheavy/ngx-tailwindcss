import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

export interface LongPressEvent {
  element: HTMLElement;
  duration: number;
  clientX: number;
  clientY: number;
}

/**
 * Directive to detect long press/touch events
 *
 * @example
 * ```html
 * <button twLongPress (longPress)="onLongPress($event)">Hold me</button>
 * <button twLongPress [longPressDuration]="1000" (longPress)="onLongPress($event)">Hold 1 second</button>
 * ```
 */
@Directive({
  selector: '[twLongPress]',
  standalone: true,
})
export class TwLongPressDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement>;
  private readonly ngZone: NgZone;

  constructor() {
    this.el = inject(ElementRef);
    this.ngZone = inject(NgZone);
  }

  private timeout: ReturnType<typeof setTimeout> | null = null;
  private startTime = 0;
  private startX = 0;
  private startY = 0;

  /** Duration in ms to trigger long press (default: 500ms) */
  @Input({ transform: numberAttribute })
  longPressDuration = 500;

  /** Maximum movement allowed during press (default: 10px) */
  @Input({ transform: numberAttribute })
  longPressMoveTolerance = 10;

  /** Disable the directive */
  @Input({ transform: booleanAttribute })
  longPressDisabled = false;

  /** Prevent default behavior on long press */
  @Input({ transform: booleanAttribute })
  longPressPreventDefault = true;

  /** Emits when long press is detected */
  @Output()
  longPress = new EventEmitter<LongPressEvent>();

  /** Emits when press starts */
  @Output()
  pressStart = new EventEmitter<void>();

  /** Emits when press ends (before long press threshold) */
  @Output()
  pressEnd = new EventEmitter<void>();

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.longPressDisabled) return;

    this.startTime = Date.now();
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.pressStart.emit();

    this.timeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.longPress.emit({
          element: this.el.nativeElement,
          duration: this.longPressDuration,
          clientX: event.clientX,
          clientY: event.clientY,
        });
      });

      if (this.longPressPreventDefault) {
        event.preventDefault();
      }
    }, this.longPressDuration);
  };

  private readonly onPointerUp = (): void => {
    this.cancel();
    this.pressEnd.emit();
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.timeout) return;

    const deltaX = Math.abs(event.clientX - this.startX);
    const deltaY = Math.abs(event.clientY - this.startY);

    if (deltaX > this.longPressMoveTolerance || deltaY > this.longPressMoveTolerance) {
      this.cancel();
    }
  };

  private readonly onContextMenu = (event: Event): void => {
    if (this.longPressPreventDefault && this.timeout) {
      event.preventDefault();
    }
  };

  private cancel(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      element.addEventListener('pointerdown', this.onPointerDown);
      element.addEventListener('pointerup', this.onPointerUp);
      element.addEventListener('pointerleave', this.onPointerUp);
      element.addEventListener('pointermove', this.onPointerMove);
      element.addEventListener('contextmenu', this.onContextMenu);
    });
  }

  ngOnDestroy(): void {
    this.cancel();
    const element = this.el.nativeElement;

    element.removeEventListener('pointerdown', this.onPointerDown);
    element.removeEventListener('pointerup', this.onPointerUp);
    element.removeEventListener('pointerleave', this.onPointerUp);
    element.removeEventListener('pointermove', this.onPointerMove);
    element.removeEventListener('contextmenu', this.onContextMenu);
  }
}
