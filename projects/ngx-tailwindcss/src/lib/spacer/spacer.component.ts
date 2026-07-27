import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'auto';

const HORIZONTAL_SIZES: Record<string, string> = {
  xs: 'w-1',
  sm: 'w-2',
  md: 'w-4',
  lg: 'w-6',
  xl: 'w-8',
  '2xl': 'w-12',
  '3xl': 'w-16',
  auto: 'flex-1',
};

const VERTICAL_SIZES: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
  xl: 'h-8',
  '2xl': 'h-12',
  '3xl': 'h-16',
  auto: 'flex-1',
};

const GAP_CLASSES: Record<string, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
  auto: 'gap-4',
};

const ALIGN_CLASSES: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

const JUSTIFY_CLASSES: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Spacer component for adding space between elements.
 * In flex containers, use size="auto" to create flexible space.
 *
 * @example
 * ```html
 * <!-- Fixed vertical space -->
 * <tw-spacer axis="vertical" size="lg"></tw-spacer>
 *
 * <!-- Flexible horizontal space (pushes elements apart) -->
 * <div class="flex">
 *   <span>Left</span>
 *   <tw-spacer axis="horizontal" size="auto"></tw-spacer>
 *   <span>Right</span>
 * </div>
 * ```
 */
@Component({
  selector: 'tw-spacer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spacer.component.html',
  host: {
    // Reflect the axis onto the host element so `[axis]` property bindings
    // match the `:host([axis='horizontal'])` style below, not just static usage.
    '[attr.axis]': 'axis()',
  },
  styles: [
    `
      :host {
        display: block;
      }
      :host([axis='horizontal']) {
        display: inline-block;
      }
    `,
  ],
})
export class TwSpacerComponent {
  private readonly twClass = inject(TwClassService);

  /** Direction of the space */
  readonly axis = input<'horizontal' | 'vertical'>('vertical');

  /** Size of the space (or 'auto' for flexible space in flex containers) */
  readonly size = input<SpacerSize>('md');

  /**
   * Additional CSS classes. Signal input so a bound `[class]` survives Angular's
   * special class-binding handling and re-renders the inner element on change.
   */
  readonly class = input('');

  protected spacerClasses = computed(() => {
    const sizeClass =
      this.axis() === 'horizontal' ? HORIZONTAL_SIZES[this.size()] : VERTICAL_SIZES[this.size()];

    return this.twClass.merge(sizeClass, this.class());
  });
}

/**
 * Wrap component for wrapping flex items with consistent spacing.
 *
 * @example
 * ```html
 * <tw-wrap spacing="md">
 *   <tw-badge>Tag 1</tw-badge>
 *   <tw-badge>Tag 2</tw-badge>
 *   <tw-badge>Tag 3</tw-badge>
 * </tw-wrap>
 * ```
 */
@Component({
  selector: 'tw-wrap',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wrap.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwWrapComponent {
  private readonly twClass = inject(TwClassService);

  /** Spacing between items */
  readonly spacing = input<SpacerSize>('md');

  /** Alignment of items */
  readonly align = input<'start' | 'center' | 'end'>('start');

  /** Justification of items */
  readonly justify = input<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>('start');

  /**
   * Additional CSS classes. Signal input so a bound `[class]` survives Angular's
   * special class-binding handling and re-renders the inner element on change.
   */
  readonly class = input('');

  protected wrapClasses = computed(() => {
    return this.twClass.merge(
      'flex flex-wrap',
      GAP_CLASSES[this.spacing()],
      ALIGN_CLASSES[this.align()],
      JUSTIFY_CLASSES[this.justify()],
      this.class()
    );
  });
}
