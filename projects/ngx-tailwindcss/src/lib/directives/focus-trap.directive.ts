import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
export class TwFocusTrapDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

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
  private viewInitialized = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Store the currently focused element
    if (this.focusTrapRestoreFocus) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.viewInitialized = true;
    if (this.enabled) {
      this.activateTrap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized || !changes['enabled']) return;

    if (this.enabled) {
      this.activateTrap();
    } else {
      this.deactivateTrap();
    }
  }

  private activateTrap(): void {
    if (this.keydownHandler) return;

    this.setupTrap();

    if (this.focusTrapAutoFocus) {
      // Delay focus to ensure DOM is ready
      setTimeout(() => {
        this.focusInitial();
      }, 0);
    }
  }

  private deactivateTrap(): void {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  private setupTrap(): void {
    this.keydownHandler = (event: KeyboardEvent) => {
      if (!this.enabled || event.key !== 'Tab') return;

      const boundaries = this.getFocusBoundaries();
      if (!boundaries) return;

      const { first, last } = boundaries;
      const { activeElement } = document;
      const focusIsInside = this.el.nativeElement.contains(activeElement);

      if (event.shiftKey) {
        // Shift+Tab: if on first element (or focus escaped the trap), go to last
        if (!focusIsInside || activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!focusIsInside || activeElement === last) {
        // Tab: if on last element (or focus escaped the trap), go to first
        event.preventDefault();
        first.focus();
      }
    };

    // Listen on the document so the trap keeps working even after
    // focus escapes the host element (e.g. a click on the backdrop)
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('keydown', this.keydownHandler!);
    });
  }

  private isFocusVisible(el: HTMLElement): boolean {
    return (
      el.offsetWidth > 0 && el.offsetHeight > 0 && getComputedStyle(el).visibility !== 'hidden'
    );
  }

  /**
   * Find only the first and last visible focusable elements, short-circuiting
   * from both ends to avoid forcing a reflow for every candidate on each Tab.
   */
  private getFocusBoundaries(): { first: HTMLElement; last: HTMLElement } | null {
    const candidates = [
      ...this.el.nativeElement.querySelectorAll(FOCUSABLE_SELECTOR),
    ] as HTMLElement[];

    let first: HTMLElement | null = null;
    for (const candidate of candidates) {
      if (this.isFocusVisible(candidate)) {
        first = candidate;
        break;
      }
    }
    if (!first) return null;

    let last: HTMLElement = first;
    for (let i = candidates.length - 1; i >= 0; i--) {
      if (this.isFocusVisible(candidates[i])) {
        last = candidates[i];
        break;
      }
    }

    return { first, last };
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
    const boundaries = this.getFocusBoundaries();
    if (boundaries) {
      boundaries.first.focus();
    } else {
      // If no focusable elements, make the container focusable and focus it
      this.el.nativeElement.setAttribute('tabindex', '-1');
      this.el.nativeElement.focus();
    }
  }

  /** Manually focus the first focusable element */
  focusFirst(): void {
    this.getFocusBoundaries()?.first.focus();
  }

  /** Manually focus the last focusable element */
  focusLast(): void {
    this.getFocusBoundaries()?.last.focus();
  }

  ngOnDestroy(): void {
    this.deactivateTrap();

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
