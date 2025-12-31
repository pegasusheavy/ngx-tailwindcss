import { Component, Input } from '@angular/core';
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
  template: `
    <div [class]="stackClasses()">
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
export class TwStackComponent {
  /** Direction of the stack */
  @Input() direction: StackDirection = 'vertical';

  /** Spacing between items */
  @Input() spacing: StackSpacing = 'md';

  /** Alignment of items (perpendicular to direction) */
  @Input() align: StackAlign = 'stretch';

  /** Justification of items (along direction) */
  @Input() justify: StackJustify = 'start';

  /** Whether items should wrap */
  @Input() wrap = false;

  /** Whether to take full width */
  @Input() fullWidth = false;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected stackClasses(): string {
    return this.twClass.merge(
      'flex',
      DIRECTION_CLASSES[this.direction],
      SPACING_CLASSES[this.spacing],
      ALIGN_CLASSES[this.align],
      JUSTIFY_CLASSES[this.justify],
      this.wrap ? 'flex-wrap' : '',
      this.fullWidth ? 'w-full' : '',
      this.class
    );
  }
}

/**
 * VStack component - shorthand for vertical Stack
 */
@Component({
  selector: 'tw-vstack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="stackClasses()">
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
export class TwVStackComponent {
  @Input() spacing: StackSpacing = 'md';
  @Input() align: StackAlign = 'stretch';
  @Input() justify: StackJustify = 'start';
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected stackClasses(): string {
    return this.twClass.merge(
      'flex flex-col',
      SPACING_CLASSES[this.spacing],
      ALIGN_CLASSES[this.align],
      JUSTIFY_CLASSES[this.justify],
      this.class
    );
  }
}

/**
 * HStack component - shorthand for horizontal Stack
 */
@Component({
  selector: 'tw-hstack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="stackClasses()">
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
export class TwHStackComponent {
  @Input() spacing: StackSpacing = 'md';
  @Input() align: StackAlign = 'center';
  @Input() justify: StackJustify = 'start';
  @Input() wrap = false;
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected stackClasses(): string {
    return this.twClass.merge(
      'flex flex-row',
      SPACING_CLASSES[this.spacing],
      ALIGN_CLASSES[this.align],
      JUSTIFY_CLASSES[this.justify],
      this.wrap ? 'flex-wrap' : '',
      this.class
    );
  }
}
