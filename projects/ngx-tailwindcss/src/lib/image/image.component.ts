import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
  booleanAttribute,
  inject,
  HostListener,
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
  private twClass = inject(TwClassService);

  /** Image source URL */
  @Input({ required: true }) src = '';

  /** Alternative text */
  @Input() alt = '';

  /** Preview source (larger image for preview) */
  @Input() previewSrc = '';

  /** Width of the image */
  @Input() width = '';

  /** Height of the image */
  @Input() height = '';

  /** Object fit */
  @Input() set fit(value: ImageFit) { this._fit.set(value); }
  protected _fit = signal<ImageFit>('cover');

  /** Border radius */
  @Input() set borderRadius(value: ImageBorderRadius) { this._borderRadius.set(value); }
  protected _borderRadius = signal<ImageBorderRadius>('none');

  /** Whether to enable preview on click */
  @Input({ transform: booleanAttribute }) set preview(value: boolean) { this._preview.set(value); }
  protected _preview = signal(false);

  /** Whether zoom is enabled in preview */
  @Input({ transform: booleanAttribute }) zoomable = true;

  /** Whether rotation is enabled in preview */
  @Input({ transform: booleanAttribute }) rotatable = true;

  /** Additional classes */
  @Input() classOverride = '';

  /** Preview show event */
  @Output() onShow = new EventEmitter<void>();

  /** Preview hide event */
  @Output() onHide = new EventEmitter<void>();

  /** Image load event */
  @Output() onLoad = new EventEmitter<void>();

  /** Image error event */
  @Output() onError = new EventEmitter<void>();

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
      radiusClasses[this._borderRadius()],
      this._preview() ? 'cursor-zoom-in' : '',
      this.classOverride
    );
  });

  protected containerStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (this.width) {
      styles['width'] = this.width.includes('px') || this.width.includes('%') ? this.width : `${this.width}px`;
    }
    if (this.height) {
      styles['height'] = this.height.includes('px') || this.height.includes('%') ? this.height : `${this.height}px`;
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

    return this.twClass.merge(
      'w-full h-full',
      fitClasses[this._fit()]
    );
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
    if (this._preview()) {
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

