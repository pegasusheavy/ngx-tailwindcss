import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type StickyPosition = 'top' | 'bottom' | 'left' | 'right';
export type StickyOffset = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const OFFSET_VALUES: Record<StickyOffset, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

/**
 * Sticky component for creating sticky positioned elements.
 * Wraps content and applies sticky positioning with configurable offset.
 *
 * @example
 * ```html
 * <!-- Sticky header -->
 * <tw-sticky position="top" offset="md">
 *   <header class="bg-white shadow">
 *     Navigation content here
 *   </header>
 * </tw-sticky>
 *
 * <!-- Sticky sidebar -->
 * <tw-sticky position="top" offset="lg" [zIndex]="10">
 *   <aside class="w-64">
 *     Sidebar content
 *   </aside>
 * </tw-sticky>
 * ```
 */
@Component({
  selector: 'tw-sticky',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sticky.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwStickyComponent {
  private readonly twClass = inject(TwClassService);

  /** Which edge to stick to */
  readonly position = input<StickyPosition>('top');

  /** Offset from the edge */
  readonly offset = input<StickyOffset>('none');

  /** Custom offset value (e.g., '60px', '4rem') */
  readonly customOffset = input<string | undefined>(undefined);

  /** Z-index for stacking */
  readonly zIndex = input(10);

  /** Whether sticky is disabled */
  readonly disabled = input(false);

  /** Additional CSS classes */
  readonly class = input('');

  protected readonly stickyClasses = computed(() => {
    return this.twClass.merge(this.disabled() ? 'relative' : 'sticky', this.class());
  });

  protected readonly stickyStyles = computed<Record<string, string>>(() => {
    if (this.disabled()) {
      return {};
    }

    const offsetValue = this.customOffset() || OFFSET_VALUES[this.offset()];

    const styles: Record<string, string> = {
      zIndex: this.zIndex().toString(),
    };
    styles[this.position()] = offsetValue;
    return styles;
  });
}
