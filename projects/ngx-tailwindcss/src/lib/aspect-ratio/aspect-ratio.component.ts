import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aspect-ratio.component.html',
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
  private readonly twClass = inject(TwClassService);

  /** Preset aspect ratio */
  readonly ratio = input<AspectRatioPreset>('video');

  /** Custom ratio value (e.g., 16/9 or 1.777) - used when ratio is 'custom' */
  readonly customRatio = input<number | undefined>(undefined);

  /** Additional CSS classes */
  readonly class = input('');

  protected readonly containerClasses = computed(() => {
    const baseClasses = 'relative overflow-hidden';
    const ratio = this.ratio();

    if (ratio === 'custom') {
      // Without a customRatio value, fall back to the 'video' preset
      // instead of silently applying no aspect ratio at all
      const fallback = this.customRatio() == null ? RATIO_CLASSES['video'] : '';
      return this.twClass.merge(baseClasses, fallback, this.class());
    }

    return this.twClass.merge(baseClasses, RATIO_CLASSES[ratio], this.class());
  });

  protected readonly computedRatio = computed<string | null>(() => {
    const customRatio = this.customRatio();
    if (this.ratio() === 'custom' && customRatio != null) {
      return String(customRatio);
    }
    return null;
  });
}
