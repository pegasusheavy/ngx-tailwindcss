import {
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  numberAttribute,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive to smooth scroll to a target element
 *
 * @example
 * ```html
 * <a twScrollTo="#section1">Go to Section 1</a>
 * <a twScrollTo="#top" [scrollOffset]="80">Back to Top</a>
 * <button twScrollTo=".my-element" scrollBehavior="auto">Jump to Element</button>
 * ```
 */
@Directive({
  selector: '[twScrollTo]',
  standalone: true,
})
export class TwScrollToDirective {
  private readonly platformId = inject(PLATFORM_ID);

  /** Target selector or element ID */
  @Input({ required: true })
  twScrollTo = '';

  /** Offset from the top in pixels (useful for fixed headers) */
  @Input({ transform: numberAttribute })
  scrollOffset = 0;

  /** Scroll behavior: 'smooth' or 'auto' */
  @Input()
  scrollBehavior: ScrollBehavior = 'smooth';

  /** Block position: 'start', 'center', 'end', 'nearest' */
  @Input()
  scrollBlock: ScrollLogicalPosition = 'start';

  /** Disable scrolling */
  @Input({ transform: booleanAttribute })
  scrollDisabled = false;

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.scrollDisabled || !this.twScrollTo) return;

    const selector = this.twScrollTo.startsWith('#')
      ? this.twScrollTo
      : this.twScrollTo.startsWith('.')
        ? this.twScrollTo
        : `#${this.twScrollTo}`;

    const target = document.querySelector(selector);

    if (target) {
      event.preventDefault();

      if (this.scrollOffset === 0) {
        target.scrollIntoView({ behavior: this.scrollBehavior, block: this.scrollBlock });
      } else {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - this.scrollOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: this.scrollBehavior,
        });
      }
    }
  }
}

/**
 * Directive that exposes the section's viewport position (via `getPosition()`)
 * for a caller-implemented scroll spy
 *
 * @example
 * ```html
 * <section twScrollSection="section1">Content</section>
 * <section twScrollSection="section2">Content</section>
 * ```
 */
@Directive({
  selector: '[twScrollSection]',
  standalone: true,
})
export class TwScrollSectionDirective {
  private readonly el: ElementRef<HTMLElement>;

  constructor() {
    this.el = inject(ElementRef);
  }

  /** Section identifier */
  @Input({ required: true })
  twScrollSection = '';

  /** Get the element's position relative to viewport */
  getPosition(): { top: number; bottom: number; id: string } {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      id: this.twScrollSection,
    };
  }
}
