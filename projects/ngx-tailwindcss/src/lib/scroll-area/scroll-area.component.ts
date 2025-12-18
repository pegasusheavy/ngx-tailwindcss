import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ScrollAreaDirection = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaScrollbar = 'auto' | 'always' | 'hover' | 'hidden';

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
  template: `
    <div
      #scrollContainer
      [class]="scrollAreaClasses()"
      [style.height]="height"
      [style.maxHeight]="maxHeight"
      [style.width]="width"
      [style.maxWidth]="maxWidth">
      <ng-content></ng-content>
    </div>
  `,
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
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLElement>;

  /** Scroll direction */
  @Input() direction: ScrollAreaDirection = 'vertical';

  /** Scrollbar visibility */
  @Input() scrollbar: ScrollAreaScrollbar = 'auto';

  /** Fixed height */
  @Input() height?: string;

  /** Maximum height */
  @Input() maxHeight?: string;

  /** Fixed width */
  @Input() width?: string;

  /** Maximum width */
  @Input() maxWidth?: string;

  /** Whether to use thin scrollbar */
  @Input() thin = false;

  /** Whether to use dark mode scrollbar */
  @Input() dark = false;

  /** Whether to enable smooth scrolling */
  @Input() smooth = true;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected scrollAreaClasses(): string {
    const overflowClass = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto',
    }[this.direction];

    const scrollbarClass = {
      auto: '',
      always: 'scroll-area-always',
      hover: 'scroll-area-hover',
      hidden: 'scroll-area-hidden',
    }[this.scrollbar];

    return this.twClass.merge(
      'scroll-area-styled',
      overflowClass,
      scrollbarClass,
      this.thin ? 'scroll-area-thin' : '',
      this.dark ? 'scroll-area-dark' : '',
      this.smooth ? 'scroll-smooth' : '',
      this.class
    );
  }

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

