import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overlay.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TwOverlayComponent implements OnDestroy {
  private readonly twClass = inject(TwClassService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether the overlay is visible */
  readonly visible = input(false);

  /** Whether clicking the overlay closes it */
  readonly closeOnClick = input(true);

  /** Whether pressing Escape closes the overlay */
  readonly closeOnEscape = input(true);

  /** Blur intensity */
  readonly blur = input<OverlayBlur>('none');

  /** Opacity level */
  readonly opacity = input<OverlayOpacity>('medium');

  /** Whether to center content */
  readonly centered = input(true);

  /** Whether to lock body scroll when visible */
  readonly lockScroll = input(true);

  /** Whether to animate transitions */
  readonly animate = input(true);

  /** Z-index of the overlay */
  readonly zIndex = input(50);

  /** Additional CSS classes */
  readonly class = input('');

  /** Emits when overlay should close */
  readonly close = output();

  private previousOverflow = '';
  private scrollLocked = false;

  constructor() {
    // Lock/unlock body scroll while visible when lockScroll is enabled
    effect(() => {
      const shouldLock = this.visible() && this.lockScroll();

      if (!isPlatformBrowser(this.platformId)) return;

      if (shouldLock && !this.scrollLocked) {
        this.previousOverflow = this.document.body.style.overflow;
        this.document.body.style.overflow = 'hidden';
        this.scrollLocked = true;
      } else if (!shouldLock && this.scrollLocked) {
        this.document.body.style.overflow = this.previousOverflow;
        this.scrollLocked = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.scrollLocked && isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = this.previousOverflow;
      this.scrollLocked = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.visible() && this.closeOnEscape()) {
      this.close.emit();
    }
  }

  protected readonly overlayClasses = computed(() => {
    return this.twClass.merge(
      'fixed inset-0',
      BLUR_CLASSES[this.blur()],
      OPACITY_CLASSES[this.opacity()],
      this.centered() ? 'flex items-center justify-center' : '',
      this.animate() ? 'transition-opacity duration-200' : '',
      this.class()
    );
  });

  protected onOverlayClick(event: MouseEvent): void {
    if (this.closeOnClick() && event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
