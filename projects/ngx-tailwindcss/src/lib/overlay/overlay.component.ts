import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type OverlayBlur = 'none' | 'sm' | 'md' | 'lg';
export type OverlayOpacity = 'light' | 'medium' | 'dark' | 'solid';

const BLUR_CLASSES: Record<OverlayBlur, string> = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

const OPACITY_CLASSES: Record<OverlayOpacity, string> = {
  light: 'bg-black/25',
  medium: 'bg-black/50',
  dark: 'bg-black/75',
  solid: 'bg-black',
};

/**
 * Overlay component for creating backdrop overlays.
 * Useful as backgrounds for modals, drawers, and lightboxes.
 *
 * @example
 * ```html
 * <!-- Simple overlay -->
 * <tw-overlay [visible]="isOpen" (close)="isOpen = false">
 *   <div class="bg-white p-6 rounded-lg">
 *     Modal content here
 *   </div>
 * </tw-overlay>
 *
 * <!-- Overlay with blur effect -->
 * <tw-overlay [visible]="showDrawer" blur="md" opacity="light" (close)="closeDrawer()">
 *   <aside class="fixed right-0 top-0 h-full w-80 bg-white">
 *     Drawer content
 *   </aside>
 * </tw-overlay>
 * ```
 */
@Component({
  selector: 'tw-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div
        [class]="overlayClasses()"
        (click)="onOverlayClick($event)"
        [@.disabled]="!animate">
        <div class="relative z-10" (click)="$event.stopPropagation()">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TwOverlayComponent {
  /** Whether the overlay is visible */
  @Input() visible = false;

  /** Whether clicking the overlay closes it */
  @Input() closeOnClick = true;

  /** Whether pressing Escape closes the overlay */
  @Input() closeOnEscape = true;

  /** Blur intensity */
  @Input() blur: OverlayBlur = 'none';

  /** Opacity level */
  @Input() opacity: OverlayOpacity = 'medium';

  /** Whether to center content */
  @Input() centered = true;

  /** Whether to lock body scroll when visible */
  @Input() lockScroll = true;

  /** Whether to animate transitions */
  @Input() animate = true;

  /** Z-index of the overlay */
  @Input() zIndex = 50;

  /** Additional CSS classes */
  @Input() class = '';

  /** Emits when overlay should close */
  @Output() close = new EventEmitter<void>();

  constructor(private readonly twClass: TwClassService) {}

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.visible && this.closeOnEscape) {
      this.close.emit();
    }
  }

  protected overlayClasses(): string {
    return this.twClass.merge(
      'fixed inset-0',
      BLUR_CLASSES[this.blur],
      OPACITY_CLASSES[this.opacity],
      this.centered ? 'flex items-center justify-center' : '',
      this.animate ? 'transition-opacity duration-200' : '',
      `z-[${this.zIndex}]`,
      this.class
    );
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (this.closeOnClick && event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}

