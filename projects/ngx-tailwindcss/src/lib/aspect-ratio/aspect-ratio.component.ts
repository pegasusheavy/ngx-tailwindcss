import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type AspectRatioPreset = 'square' | 'video' | 'portrait' | 'wide' | 'ultrawide' | 'custom';

const RATIO_CLASSES: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[2/1]',
  ultrawide: 'aspect-[21/9]',
};

/**
 * AspectRatio component for maintaining consistent aspect ratios.
 *
 * @example
 * ```html
 * <!-- Video aspect ratio (16:9) -->
 * <tw-aspect-ratio ratio="video">
 *   <img src="thumbnail.jpg" class="object-cover w-full h-full" />
 * </tw-aspect-ratio>
 *
 * <!-- Custom ratio -->
 * <tw-aspect-ratio ratio="custom" [customRatio]="4/3">
 *   <iframe src="..."></iframe>
 * </tw-aspect-ratio>
 * ```
 */
@Component({
  selector: 'tw-aspect-ratio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()" [style.aspectRatio]="computedRatio()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      :host ::ng-deep > div > * {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class TwAspectRatioComponent {
  /** Preset aspect ratio */
  @Input() ratio: AspectRatioPreset = 'video';

  /** Custom ratio value (e.g., 16/9 or 1.777) - used when ratio is 'custom' */
  @Input() customRatio?: number;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected containerClasses(): string {
    const baseClasses = 'relative overflow-hidden';

    if (this.ratio === 'custom') {
      return this.twClass.merge(baseClasses, this.class);
    }

    return this.twClass.merge(baseClasses, RATIO_CLASSES[this.ratio], this.class);
  }

  protected computedRatio(): string | null {
    if (this.ratio === 'custom' && this.customRatio) {
      return String(this.customRatio);
    }
    return null;
  }
}
