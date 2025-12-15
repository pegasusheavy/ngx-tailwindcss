import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

export interface InViewEvent {
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry;
}

/**
 * Directive to detect when an element enters or leaves the viewport
 * Uses IntersectionObserver for performance
 *
 * @example
 * ```html
 * <div twInView (inView)="onVisible($event)">Lazy content</div>
 * <div twInView [inViewThreshold]="0.5" (enterView)="onEnter()">50% visible trigger</div>
 * <div twInView [inViewOnce]="true" (enterView)="loadOnce()">Load once when visible</div>
 * ```
 */
@Directive({
  selector: '[twInView]',
  standalone: true,
})
export class TwInViewDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement>;

  constructor() {
    this.el = inject(ElementRef);
  }

  private observer: IntersectionObserver | null = null;

  /** Root margin for intersection observer (CSS margin syntax) */
  @Input()
  inViewRootMargin = '0px';

  /** Threshold(s) for triggering - 0 to 1, or array of values */
  @Input()
  inViewThreshold: number | number[] = 0;

  /** Only trigger once when element enters view */
  @Input({ transform: booleanAttribute })
  inViewOnce = false;

  /** Disable the observer */
  @Input({ transform: booleanAttribute })
  inViewDisabled = false;

  /** Emits whenever intersection state changes */
  @Output()
  inView = new EventEmitter<InViewEvent>();

  /** Emits when element enters the viewport */
  @Output()
  enterView = new EventEmitter<InViewEvent>();

  /** Emits when element leaves the viewport */
  @Output()
  leaveView = new EventEmitter<InViewEvent>();

  ngOnInit(): void {
    if (this.inViewDisabled || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const event: InViewEvent = {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            entry,
          };

          this.inView.emit(event);

          if (entry.isIntersecting) {
            this.enterView.emit(event);

            if (this.inViewOnce && this.observer) {
              this.observer.disconnect();
              this.observer = null;
            }
          } else {
            this.leaveView.emit(event);
          }
        });
      },
      {
        rootMargin: this.inViewRootMargin,
        threshold: this.inViewThreshold,
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
