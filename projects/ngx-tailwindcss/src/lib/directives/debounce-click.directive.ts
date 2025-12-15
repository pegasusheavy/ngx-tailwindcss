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
import { debounceTime, Subject, Subscription } from 'rxjs';

/**
 * Directive to debounce click events, preventing accidental double-clicks
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

  /** Debounce time in milliseconds (default: 300ms) */
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
    this.subscription = this.clicks.pipe(debounceTime(this.debounceTime)).subscribe(event => {
      this.debounceClick.emit(event);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
