import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImageBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

/**
 * Image component with preview, zoom, and rotation
 *
 * @example
 * ```html
 * <tw-image [src]="imageUrl" alt="Description" [preview]="true"></tw-image>
 * <tw-image [src]="imageUrl" [zoomable]="true" [rotatable]="true"></tw-image>
 * ```
 */
@Component({
  selector: 'tw-image',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image.component.html',
})
export class TwImageComponent {
  private readonly twClass = inject(TwClassService);

  /** Image source URL */
  readonly src = input.required<string>();

  /** Alternative text */
  readonly alt = input('');

  /** Preview source (larger image for preview) */
  readonly previewSrc = input('');

  /** Width of the image */
  readonly width = input('');

  /** Height of the image */
  readonly height = input('');

  /** Object fit */
  readonly fit = input<ImageFit>('cover');

  /** Border radius */
  readonly borderRadius = input<ImageBorderRadius>('none');

  /** Whether to enable preview on click */
  readonly preview = input(false, { transform: booleanAttribute });

  /** Whether zoom is enabled in preview */
  readonly zoomable = input(true, { transform: booleanAttribute });

  /** Whether rotation is enabled in preview */
  readonly rotatable = input(true, { transform: booleanAttribute });

  /** Additional classes */
  readonly classOverride = input('');

  /** Preview show event */
  readonly onShow = output<void>();

  /** Preview hide event */
  readonly onHide = output<void>();

  /** Image load event */
  readonly onLoad = output<void>();

  /** Image error event */
  readonly onError = output<void>();

  protected loading = signal(true);
  protected previewVisible = signal(false);
  protected zoomLevel = signal(1);
  protected rotation = signal(0);

  // Expose Math to template
  protected Math = Math;

  protected containerClasses = computed(() => {
    const radiusClasses: Record<ImageBorderRadius, string> = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    };

    return this.twClass.merge(
      'relative overflow-hidden inline-block',
      radiusClasses[this.borderRadius()],
      this.preview() ? 'cursor-zoom-in' : '',
      this.classOverride()
    );
  });

  protected containerStyles = computed(() => {
    const styles: Record<string, string> = {};
    const w = this.width();
    const h = this.height();
    if (w) {
      styles['width'] = w.includes('px') || w.includes('%') ? w : `${w}px`;
    }
    if (h) {
      styles['height'] = h.includes('px') || h.includes('%') ? h : `${h}px`;
    }
    return styles;
  });

  protected imageClasses = computed(() => {
    const fitClasses: Record<ImageFit, string> = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    };

    return this.twClass.merge('w-full h-full', fitClasses[this.fit()]);
  });

  protected placeholderClasses = computed(() => {
    return 'absolute inset-0 flex items-center justify-center bg-slate-100';
  });

  protected previewIconClasses = computed(() => {
    return this.twClass.merge(
      'absolute inset-0 flex items-center justify-center',
      'bg-black/0 hover:bg-black/40 transition-colors',
      'text-white opacity-0 hover:opacity-100'
    );
  });

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.previewVisible()) {
      this.closePreview();
    }
  }

  onImageLoad(): void {
    this.loading.set(false);
    this.onLoad.emit();
  }

  onImageError(): void {
    this.loading.set(false);
    this.onError.emit();
  }

  onImageClick(): void {
    if (this.preview()) {
      this.openPreview();
    }
  }

  openPreview(): void {
    this.previewVisible.set(true);
    this.zoomLevel.set(1);
    this.rotation.set(0);
    this.onShow.emit();
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.previewVisible.set(false);
    this.onHide.emit();
    document.body.style.overflow = '';
  }

  zoomIn(): void {
    if (this.zoomLevel() < 3) {
      this.zoomLevel.set(Math.min(3, this.zoomLevel() + 0.25));
    }
  }

  zoomOut(): void {
    if (this.zoomLevel() > 0.5) {
      this.zoomLevel.set(Math.max(0.5, this.zoomLevel() - 0.25));
    }
  }

  rotateLeft(): void {
    this.rotation.set(this.rotation() - 90);
  }

  rotateRight(): void {
    this.rotation.set(this.rotation() + 90);
  }
}
