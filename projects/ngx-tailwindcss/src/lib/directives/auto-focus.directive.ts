import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  inject,
  booleanAttribute,
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
  private el: ElementRef<HTMLElement>;

  constructor() {
    this.el = inject(ElementRef);
  }

  /** Whether auto-focus is enabled */
  @Input({ alias: 'twAutoFocus', transform: booleanAttribute })
  autoFocusEnabled: boolean = true;

  /** Delay in milliseconds before focusing */
  @Input({ transform: numberAttribute })
  autoFocusDelay: number = 0;

  /** Whether to select text content (for inputs) */
  @Input({ transform: booleanAttribute })
  autoFocusSelect: boolean = false;

  /** Whether to scroll element into view */
  @Input({ transform: booleanAttribute })
  autoFocusScroll: boolean = false;

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

