import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

/**
 * Center component for centering content horizontally and/or vertically.
 *
 * @example
 * ```html
 * <!-- Center both horizontally and vertically -->
 * <tw-center class="h-screen">
 *   <div>Centered content</div>
 * </tw-center>
 *
 * <!-- Center only horizontally (inline content) -->
 * <tw-center [inline]="true">
 *   <span>Centered text</span>
 * </tw-center>
 * ```
 */
@Component({
  selector: 'tw-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="centerClasses()">
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
export class TwCenterComponent {
  /** Use inline-flex instead of flex */
  @Input() inline = false;

  /** Center only horizontally */
  @Input() horizontal = true;

  /** Center only vertically */
  @Input() vertical = true;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected centerClasses(): string {
    const classes: string[] = [this.inline ? 'inline-flex' : 'flex'];

    if (this.horizontal) {
      classes.push('justify-center');
    }

    if (this.vertical) {
      classes.push('items-center');
    }

    return this.twClass.merge(...classes, this.class);
  }
}

/**
 * Square component for creating square-shaped containers.
 * The width determines the height (1:1 aspect ratio).
 *
 * @example
 * ```html
 * <tw-square size="64px" class="bg-blue-500 rounded-lg">
 *   <span>Icon</span>
 * </tw-square>
 * ```
 */
@Component({
  selector: 'tw-square',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="squareClasses()" [style.width]="size" [style.height]="size">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class TwSquareComponent {
  /** Size of the square (e.g., '64px', '4rem') */
  @Input() size = '48px';

  /** Whether to center the content */
  @Input() centerContent = true;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected squareClasses(): string {
    return this.twClass.merge(
      this.centerContent ? 'flex items-center justify-center' : '',
      this.class
    );
  }
}

/**
 * Circle component for creating circular containers.
 *
 * @example
 * ```html
 * <tw-circle size="48px" class="bg-gradient-to-br from-blue-500 to-purple-500">
 *   <span class="text-white">AB</span>
 * </tw-circle>
 * ```
 */
@Component({
  selector: 'tw-circle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="circleClasses()" [style.width]="size" [style.height]="size">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class TwCircleComponent {
  /** Size of the circle (e.g., '64px', '4rem') */
  @Input() size = '48px';

  /** Whether to center the content */
  @Input() centerContent = true;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected circleClasses(): string {
    return this.twClass.merge(
      'rounded-full',
      this.centerContent ? 'flex items-center justify-center' : '',
      this.class
    );
  }
}

