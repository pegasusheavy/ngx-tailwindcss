import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Traps focus within the host element, cycling through focusable elements
 * Essential for accessible modals and dialogs
 *
 * @example
 * ```html
 * <div twFocusTrap>
 *   <input type="text" placeholder="First input">
 *   <button>Action</button>
 *   <button>Close</button>
 * </div>
 *
 * <div twFocusTrap [focusTrapAutoFocus]="true" [focusTrapRestoreFocus]="true">
 *   Modal content
 * </div>
 * ```
 */
@Directive({
  selector: '[twFocusTrap]',
  standalone: true,
})
export class TwFocusTrapDirective implements OnInit, AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  /** Whether the focus trap is active */
  @Input({ alias: 'twFocusTrap', transform: booleanAttribute }) enabled = true;

  /** Whether to auto-focus the first focusable element when the trap is initialized */
  @Input({ transform: booleanAttribute }) focusTrapAutoFocus = true;

  /** Whether to restore focus to the previously focused element when the trap is destroyed */
  @Input({ transform: booleanAttribute }) focusTrapRestoreFocus = true;

  /** Selector for the initial focus target (if not first focusable) */
  @Input() focusTrapInitialFocus = '';

  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;

  ngOnInit(): void {
    // Store the currently focused element
    if (this.focusTrapRestoreFocus) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
    }
  }

  ngAfterViewInit(): void {
    if (this.enabled) {
      this.setupTrap();

      if (this.focusTrapAutoFocus) {
        // Delay focus to ensure DOM is ready
        setTimeout(() => {
          this.focusInitial();
        }, 0);
      }
    }
  }

  private setupTrap(): void {
    this.keydownHandler = (event: KeyboardEvent) => {
      if (!this.enabled || event.key !== 'Tab') return;

      const focusableElements = this.getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement && lastElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement && firstElement) {
        // Tab: if on last element, go to first
        event.preventDefault();
        firstElement.focus();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('keydown', this.keydownHandler);
    });
  }

  private getFocusableElements(): HTMLElement[] {
    const elements = this.el.nativeElement.querySelectorAll(FOCUSABLE_SELECTOR);
    return [...elements].filter(el => {
      const htmlEl = el as HTMLElement;
      return (
        htmlEl.offsetWidth > 0 &&
        htmlEl.offsetHeight > 0 &&
        getComputedStyle(htmlEl).visibility !== 'hidden'
      );
    }) as HTMLElement[];
  }

  private focusInitial(): void {
    if (this.focusTrapInitialFocus) {
      const target = this.el.nativeElement.querySelector(this.focusTrapInitialFocus);
      if (target) {
        target.focus();
        return;
      }
    }

    // Focus first focusable element
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // If no focusable elements, make the container focusable and focus it
      this.el.nativeElement.setAttribute('tabindex', '-1');
      this.el.nativeElement.focus();
    }
  }

  /** Manually focus the first focusable element */
  focusFirst(): void {
    const elements = this.getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }

  /** Manually focus the last focusable element */
  focusLast(): void {
    const elements = this.getFocusableElements();
    if (elements.length > 0) {
      elements.at(-1)?.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.keydownHandler) {
      this.el.nativeElement.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }

    // Restore focus to the previously focused element
    if (this.focusTrapRestoreFocus && this.previouslyFocusedElement) {
      try {
        this.previouslyFocusedElement.focus();
      } catch {
        // Element may no longer be focusable
      }
    }
  }
}
