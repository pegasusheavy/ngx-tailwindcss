import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
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
export class TwScrollTopComponent implements OnInit, OnDestroy {
  private readonly twClass = inject(TwClassService);
  private readonly platformId = inject(PLATFORM_ID);

  /** Scroll threshold to show button (in pixels) */
  @Input({ transform: numberAttribute }) threshold = 400;

  /** Position of the button */
  @Input() position: ScrollTopPosition = 'bottom-right';

  /** Visual variant */
  @Input() variant: ScrollTopVariant = 'primary';

  /** Scroll behavior */
  @Input() behavior: ScrollBehavior = 'smooth';

  /** Target element to scroll (defaults to window) */
  @Input() target: HTMLElement | Window | null = null;

  /** Custom icon template */
  @Input() icon: TemplateRef<any> | null = null;

  /** Additional classes */
  @Input() classOverride = '';

  protected visible = signal(false);

  private scrollListener: (() => void) | null = null;

  protected buttonClasses = computed(() => {
    const positionClasses = POSITION_CLASSES[this.position];
    const variantClasses = VARIANT_CLASSES[this.variant];

    return this.twClass.merge(
      'fixed z-50 p-3 rounded-full transition-all duration-300',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
      'animate-in fade-in-0 zoom-in-95',
      positionClasses,
      variantClasses,
      this.classOverride
    );
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
  }

  private setupScrollListener(): void {
    const scrollTarget = this.target || window;

    this.scrollListener = () => {
      const scrollTop = this.getScrollTop();
      this.visible.set(scrollTop > this.threshold);
    };

    scrollTarget.addEventListener('scroll', this.scrollListener, { passive: true });
    // Check initial scroll position
    this.scrollListener();
  }

  private removeScrollListener(): void {
    if (this.scrollListener) {
      const scrollTarget = this.target || window;
      scrollTarget.removeEventListener('scroll', this.scrollListener);
    }
  }

  private getScrollTop(): number {
    if (this.target instanceof HTMLElement) {
      return this.target.scrollTop;
    }
    return window.scrollY || document.documentElement.scrollTop;
  }

  scrollToTop(): void {
    if (this.target instanceof HTMLElement) {
      this.target.scrollTo({ top: 0, behavior: this.behavior });
    } else {
      window.scrollTo({ top: 0, behavior: this.behavior });
    }
  }
}
