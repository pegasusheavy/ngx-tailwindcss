import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ScrollAreaDirection = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaScrollbar = 'auto' | 'always' | 'hover' | 'hidden';

const OVERFLOW_CLASSES: Record<ScrollAreaDirection, string> = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
};

const SCROLLBAR_CLASSES: Record<ScrollAreaScrollbar, string> = {
  auto: '',
  always: 'scroll-area-always',
  hover: 'scroll-area-hover',
  hidden: 'scroll-area-hidden',
};

/**
 * ScrollArea component for creating scrollable containers with styled scrollbars.
 *
 * @example
 * ```html
 * <!-- Vertical scrollable area -->
 * <tw-scroll-area [height]="'300px'" direction="vertical">
 *   <div class="space-y-4">
 *     <p>Long content here...</p>
 *   </div>
 * </tw-scroll-area>
 *
 * <!-- Horizontal scroll area for a carousel -->
 * <tw-scroll-area direction="horizontal" scrollbar="hover">
 *   <div class="flex gap-4">
 *     <div class="flex-shrink-0 w-64">Card 1</div>
 *     <div class="flex-shrink-0 w-64">Card 2</div>
 *     <div class="flex-shrink-0 w-64">Card 3</div>
 *   </div>
 * </tw-scroll-area>
 * ```
 */
@Component({
  selector: 'tw-scroll-area',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scroll-area.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      /* Custom scrollbar styles */
      .scroll-area-styled::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .scroll-area-styled::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
      }

      .scroll-area-styled::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.5);
        border-radius: 4px;
        transition: background 0.2s;
      }

      .scroll-area-styled::-webkit-scrollbar-thumb:hover {
        background: rgba(100, 116, 139, 0.8);
      }

      .scroll-area-styled::-webkit-scrollbar-corner {
        background: transparent;
      }

      /* Dark mode scrollbar */
      .scroll-area-dark::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.4);
      }

      .scroll-area-dark::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.7);
      }

      /* Thin scrollbar variant */
      .scroll-area-thin::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      /* Hide scrollbar until hover */
      .scroll-area-hover::-webkit-scrollbar-thumb {
        background: transparent;
      }

      .scroll-area-hover:hover::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.5);
      }

      /* Always visible scrollbar */
      .scroll-area-always::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.5);
      }

      /* Hidden scrollbar */
      .scroll-area-hidden::-webkit-scrollbar {
        display: none;
      }

      .scroll-area-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
})
export class TwScrollAreaComponent {
  private readonly twClass = inject(TwClassService);

  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLElement>;

  /** Scroll direction */
  readonly direction = input<ScrollAreaDirection>('vertical');

  /** Scrollbar visibility */
  readonly scrollbar = input<ScrollAreaScrollbar>('auto');

  /** Fixed height */
  readonly height = input<string | undefined>(undefined);

  /** Maximum height */
  readonly maxHeight = input<string | undefined>(undefined);

  /** Fixed width */
  readonly width = input<string | undefined>(undefined);

  /** Maximum width */
  readonly maxWidth = input<string | undefined>(undefined);

  /** Whether to use thin scrollbar */
  readonly thin = input(false, { transform: booleanAttribute });

  /** Whether to use dark mode scrollbar */
  readonly dark = input(false, { transform: booleanAttribute });

  /** Whether to enable smooth scrolling */
  readonly smooth = input(true, { transform: booleanAttribute });

  /** Additional CSS classes */
  readonly class = input('');

  protected scrollAreaClasses = computed(() => {
    return this.twClass.merge(
      'scroll-area-styled',
      OVERFLOW_CLASSES[this.direction()],
      SCROLLBAR_CLASSES[this.scrollbar()],
      this.thin() ? 'scroll-area-thin' : '',
      this.dark() ? 'scroll-area-dark' : '',
      this.smooth() ? 'scroll-smooth' : '',
      this.class()
    );
  });

  /** Scroll to a specific position */
  scrollTo(options: ScrollToOptions): void {
    this.scrollContainerRef?.nativeElement.scrollTo(options);
  }

  /** Scroll to top */
  scrollToTop(smooth = true): void {
    this.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }

  /** Scroll to bottom */
  scrollToBottom(smooth = true): void {
    const element = this.scrollContainerRef?.nativeElement;
    if (element) {
      this.scrollTo({
        top: element.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }

  /** Scroll to left */
  scrollToLeft(smooth = true): void {
    this.scrollTo({ left: 0, behavior: smooth ? 'smooth' : 'auto' });
  }

  /** Scroll to right */
  scrollToRight(smooth = true): void {
    const element = this.scrollContainerRef?.nativeElement;
    if (element) {
      this.scrollTo({
        left: element.scrollWidth,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }
}
