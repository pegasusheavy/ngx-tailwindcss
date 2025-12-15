import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  booleanAttribute,
  numberAttribute,
  NgZone,
} from '@angular/core';
import { Subject, debounceTime, Subscription } from 'rxjs';

export interface ResizeEvent {
  width: number;
  height: number;
  entry: ResizeObserverEntry;
}

/**
 * Directive to observe element size changes
 *
 * @example
 * ```html
 * <div twResizeObserver (resize)="onResize($event)">Resizable content</div>
 * <div twResizeObserver [resizeDebounce]="100" (resize)="onResize($event)">Debounced resize</div>
 * ```
 */
@Directive({
  selector: '[twResizeObserver]',
  standalone: true,
})
export class TwResizeObserverDirective implements OnInit, OnDestroy {
  private el: ElementRef<HTMLElement>;
  private ngZone: NgZone;

  constructor() {
    this.el = inject(ElementRef);
    this.ngZone = inject(NgZone);
  }

  private observer: ResizeObserver | null = null;
  private resizeSubject = new Subject<ResizeEvent>();
  private subscription: Subscription | null = null;

  /** Debounce time in milliseconds (default: 0 = no debounce) */
  @Input({ transform: numberAttribute })
  resizeDebounce: number = 0;

  /** Disable the observer */
  @Input({ transform: booleanAttribute })
  resizeDisabled: boolean = false;

  /** Emits when element size changes */
  @Output()
  resize = new EventEmitter<ResizeEvent>();

  ngOnInit(): void {
    if (this.resizeDisabled || typeof ResizeObserver === 'undefined') {
      return;
    }

    // Set up debounced emission
    if (this.resizeDebounce > 0) {
      this.subscription = this.resizeSubject
        .pipe(debounceTime(this.resizeDebounce))
        .subscribe((event) => this.resize.emit(event));
    }

    this.ngZone.runOutsideAngular(() => {
      this.observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const event: ResizeEvent = { width, height, entry };

          if (this.resizeDebounce > 0) {
            this.resizeSubject.next(event);
          } else {
            this.ngZone.run(() => this.resize.emit(event));
          }
        }
      });

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

