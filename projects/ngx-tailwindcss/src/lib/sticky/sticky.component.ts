import { Component, Input } from '@angular/core';
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
  template: `
    <div [class]="stickyClasses()" [style]="stickyStyles()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwStickyComponent {
  /** Which edge to stick to */
  @Input() position: StickyPosition = 'top';

  /** Offset from the edge */
  @Input() offset: StickyOffset = 'none';

  /** Custom offset value (e.g., '60px', '4rem') */
  @Input() customOffset?: string;

  /** Z-index for stacking */
  @Input() zIndex = 10;

  /** Whether sticky is disabled */
  @Input() disabled = false;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected stickyClasses(): string {
    return this.twClass.merge(
      this.disabled ? 'relative' : 'sticky',
      this.class
    );
  }

  protected stickyStyles(): Record<string, string> {
    if (this.disabled) {
      return {};
    }

    const offsetValue = this.customOffset || OFFSET_VALUES[this.offset];

    return {
      [this.position]: offsetValue,
      zIndex: this.zIndex.toString(),
    };
  }
}

