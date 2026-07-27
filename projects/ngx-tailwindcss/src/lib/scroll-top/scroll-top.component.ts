import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  PLATFORM_ID,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ScrollTopPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';
export type ScrollTopVariant = 'primary' | 'secondary' | 'dark';

const POSITION_CLASSES: Record<ScrollTopPosition, string> = {
  'bottom-right': 'right-6 bottom-6',
  'bottom-left': 'left-6 bottom-6',
  'bottom-center': 'left-1/2 -translate-x-1/2 bottom-6',
};

const VARIANT_CLASSES: Record<ScrollTopVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-lg hover:shadow-xl',
  dark: 'bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl',
};

/**
 * Scroll to top button component
 *
 * @example
 * ```html
 * <tw-scroll-top></tw-scroll-top>
 * <tw-scroll-top [threshold]="200" position="bottom-left"></tw-scroll-top>
 * ```
 */
@Component({
  selector: 'tw-scroll-top',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scroll-top.component.html',
})
export class TwScrollTopComponent {
  private readonly twClass = inject(TwClassService);
  private readonly platformId = inject(PLATFORM_ID);

  /** Scroll threshold to show button (in pixels) */
  readonly threshold = input(400, { transform: numberAttribute });

  /** Position of the button */
  readonly position = input<ScrollTopPosition>('bottom-right');

  /** Visual variant */
  readonly variant = input<ScrollTopVariant>('primary');

  /** Scroll behavior */
  readonly behavior = input<ScrollBehavior>('smooth');

  /** Target element to scroll (defaults to window) */
  readonly target = input<HTMLElement | Window | null>(null);

  /** Custom icon template */
  readonly icon = input<TemplateRef<any> | null>(null);

  /** Additional classes */
  readonly classOverride = input('');

  protected visible = signal(false);

  protected buttonClasses = computed(() => {
    const positionClasses = POSITION_CLASSES[this.position()];
    const variantClasses = VARIANT_CLASSES[this.variant()];

    return this.twClass.merge(
      'fixed z-50 p-3 rounded-full transition-all duration-300',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
      'animate-in fade-in-0 zoom-in-95',
      positionClasses,
      variantClasses,
      this.classOverride()
    );
  });

  constructor() {
    // Rebinds the scroll listener whenever the target (or threshold) changes
    // and removes it from the same node it was attached to.
    effect(onCleanup => {
      if (!isPlatformBrowser(this.platformId)) return;

      const scrollTarget = this.target() || window;
      const threshold = this.threshold();
      const listener = () => {
        this.visible.set(this.getScrollTop() > threshold);
      };

      scrollTarget.addEventListener('scroll', listener, { passive: true });
      // Check initial scroll position
      listener();

      onCleanup(() => {
        scrollTarget.removeEventListener('scroll', listener);
      });
    });
  }

  private getScrollTop(): number {
    const target = this.target();
    if (target instanceof HTMLElement) {
      return target.scrollTop;
    }
    return window.scrollY || document.documentElement.scrollTop;
  }

  scrollToTop(): void {
    const target = this.target();
    if (target instanceof HTMLElement) {
      target.scrollTo({ top: 0, behavior: this.behavior() });
    } else {
      window.scrollTo({ top: 0, behavior: this.behavior() });
    }
  }
}
