import {
  booleanAttribute,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, throttle, timer } from 'rxjs';

/**
 * Directive to prevent accidental double-clicks: the first click emits
 * immediately and any further clicks within the interval are ignored
 *
 * @example
 * ```html
 * <button twDebounceClick (debounceClick)="onSave()">Save</button>
 * <button twDebounceClick [debounceTime]="500" (debounceClick)="onSubmit()">Submit</button>
 * ```
 */
@Directive({
  selector: '[twDebounceClick]',
  standalone: true,
})
export class TwDebounceClickDirective implements OnInit, OnDestroy {
  private readonly clicks = new Subject<MouseEvent>();
  private subscription: Subscription | null = null;

  /** Interval in milliseconds during which repeat clicks are ignored (default: 300ms) */
  @Input({ transform: numberAttribute })
  debounceTime = 300;

  /** Disable debouncing */
  @Input({ transform: booleanAttribute })
  debounceDisabled = false;

  /** Emits debounced click events */
  @Output()
  debounceClick = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.debounceDisabled) {
      this.debounceClick.emit(event);
    } else {
      this.clicks.next(event);
    }
  }

  ngOnInit(): void {
    // The duration selector reads `debounceTime` per click, so runtime input
    // changes apply; leading emission lets the first click through immediately
    this.subscription = this.clicks
      .pipe(throttle(() => timer(this.debounceTime), { leading: true, trailing: false }))
      .subscribe(event => {
        this.debounceClick.emit(event);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
