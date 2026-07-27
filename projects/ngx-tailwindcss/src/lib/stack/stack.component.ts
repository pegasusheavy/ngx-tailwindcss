import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type StackDirection = 'vertical' | 'horizontal' | 'vertical-reverse' | 'horizontal-reverse';
export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const DIRECTION_CLASSES: Record<StackDirection, string> = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
  'vertical-reverse': 'flex-col-reverse',
  'horizontal-reverse': 'flex-row-reverse',
};

const SPACING_CLASSES: Record<StackSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
};

const ALIGN_CLASSES: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_CLASSES: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Stack component for arranging elements vertically or horizontally with consistent spacing.
 *
 * @example
 * ```html
 * <!-- Vertical stack (default) -->
 * <tw-stack spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </tw-stack>
 *
 * <!-- Horizontal stack -->
 * <tw-stack direction="horizontal" spacing="lg" align="center">
 *   <button>Button 1</button>
 *   <button>Button 2</button>
 * </tw-stack>
 * ```
 */
@Component({
  selector: 'tw-stack',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwStackComponent {
  private readonly twClass = inject(TwClassService);

  /** Direction of the stack */
  readonly direction = input<StackDirection>('vertical');

  /** Spacing between items */
  readonly spacing = input<StackSpacing>('md');

  /** Alignment of items (perpendicular to direction) */
  readonly align = input<StackAlign>('stretch');

  /** Justification of items (along direction) */
  readonly justify = input<StackJustify>('start');

  /** Whether items should wrap */
  readonly wrap = input(false);

  /** Whether to take full width */
  readonly fullWidth = input(false);

  /** Additional CSS classes */
  readonly class = input('');

  protected readonly stackClasses = computed(() => {
    return this.twClass.merge(
      'flex',
      DIRECTION_CLASSES[this.direction()],
      SPACING_CLASSES[this.spacing()],
      ALIGN_CLASSES[this.align()],
      JUSTIFY_CLASSES[this.justify()],
      this.wrap() ? 'flex-wrap' : '',
      this.fullWidth() ? 'w-full' : '',
      this.class()
    );
  });
}

/**
 * VStack component - shorthand for vertical Stack
 */
@Component({
  selector: 'tw-vstack',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './v-stack.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwVStackComponent {
  private readonly twClass = inject(TwClassService);

  readonly spacing = input<StackSpacing>('md');
  readonly align = input<StackAlign>('stretch');
  readonly justify = input<StackJustify>('start');
  readonly class = input('');

  protected readonly stackClasses = computed(() => {
    return this.twClass.merge(
      'flex flex-col',
      SPACING_CLASSES[this.spacing()],
      ALIGN_CLASSES[this.align()],
      JUSTIFY_CLASSES[this.justify()],
      this.class()
    );
  });
}

/**
 * HStack component - shorthand for horizontal Stack
 */
@Component({
  selector: 'tw-hstack',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './h-stack.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwHStackComponent {
  private readonly twClass = inject(TwClassService);

  readonly spacing = input<StackSpacing>('md');
  readonly align = input<StackAlign>('center');
  readonly justify = input<StackJustify>('start');
  readonly wrap = input(false);
  readonly class = input('');

  protected readonly stackClasses = computed(() => {
    return this.twClass.merge(
      'flex flex-row',
      SPACING_CLASSES[this.spacing()],
      ALIGN_CLASSES[this.align()],
      JUSTIFY_CLASSES[this.justify()],
      this.wrap() ? 'flex-wrap' : '',
      this.class()
    );
  });
}
