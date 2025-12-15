import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  numberAttribute,
} from '@angular/core';

/**
 * Directive to automatically focus an element when it's rendered
 *
 * @example
 * ```html
 * <input twAutoFocus />
 * <input twAutoFocus [autoFocusDelay]="100" />
 * <input [twAutoFocus]="shouldFocus" />
 * ```
 */
@Directive({
  selector: '[twAutoFocus]',
  standalone: true,
})
export class TwAutoFocusDirective implements AfterViewInit {
  private readonly el: ElementRef<HTMLElement>;

  constructor() {
    this.el = inject(ElementRef);
  }

  /** Whether auto-focus is enabled */
  @Input({ alias: 'twAutoFocus', transform: booleanAttribute })
  autoFocusEnabled = true;

  /** Delay in milliseconds before focusing */
  @Input({ transform: numberAttribute })
  autoFocusDelay = 0;

  /** Whether to select text content (for inputs) */
  @Input({ transform: booleanAttribute })
  autoFocusSelect = false;

  /** Whether to scroll element into view */
  @Input({ transform: booleanAttribute })
  autoFocusScroll = false;

  ngAfterViewInit(): void {
    if (!this.autoFocusEnabled) return;

    const focus = () => {
      const element = this.el.nativeElement;

      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.focus();
        if (this.autoFocusSelect) {
          element.select();
        }
      } else if ('focus' in element && typeof element.focus === 'function') {
        element.focus();
      }

      if (this.autoFocusScroll) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    if (this.autoFocusDelay > 0) {
      setTimeout(focus, this.autoFocusDelay);
    } else {
      // Use requestAnimationFrame for immediate but safe focus
      requestAnimationFrame(focus);
    }
  }
}
