import { Component, Input } from '@angular/core';
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
  template: `<div [class]="spacerClasses()" aria-hidden="true"></div>`,
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
  /** Direction of the space */
  @Input() axis: 'horizontal' | 'vertical' = 'vertical';

  /** Size of the space (or 'auto' for flexible space in flex containers) */
  @Input() size: SpacerSize = 'md';

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected spacerClasses(): string {
    const sizeClass =
      this.axis === 'horizontal' ? HORIZONTAL_SIZES[this.size] : VERTICAL_SIZES[this.size];

    return this.twClass.merge(sizeClass, this.class);
  }
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
  template: `
    <div [class]="wrapClasses()">
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
export class TwWrapComponent {
  /** Spacing between items */
  @Input() spacing: SpacerSize = 'md';

  /** Alignment of items */
  @Input() align: 'start' | 'center' | 'end' = 'start';

  /** Justification of items */
  @Input() justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start';

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected wrapClasses(): string {
    const gapClasses: Record<string, string> = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
      '3xl': 'gap-16',
      auto: 'gap-4',
    };

    const alignClasses: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    };

    const justifyClasses: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    return this.twClass.merge(
      'flex flex-wrap',
      gapClasses[this.spacing],
      alignClasses[this.align],
      justifyClasses[this.justify],
      this.class
    );
  }
}

