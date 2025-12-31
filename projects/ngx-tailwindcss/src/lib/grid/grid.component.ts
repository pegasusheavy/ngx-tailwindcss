import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none' | 'auto';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const COLS_CLASSES: Record<string, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
  none: 'grid-cols-none',
  auto: 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
};

const GAP_CLASSES: Record<GridGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

/**
 * Grid component for creating CSS Grid layouts.
 *
 * @example
 * ```html
 * <!-- Simple 3-column grid -->
 * <tw-grid [cols]="3" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </tw-grid>
 *
 * <!-- Responsive grid -->
 * <tw-grid [cols]="1" [colsSm]="2" [colsMd]="3" [colsLg]="4" gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 * </tw-grid>
 * ```
 */
@Component({
  selector: 'tw-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="gridClasses()">
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
export class TwGridComponent {
  /** Number of columns (base) */
  @Input() cols: GridCols = 1;

  /** Number of columns at sm breakpoint */
  @Input() colsSm?: GridCols;

  /** Number of columns at md breakpoint */
  @Input() colsMd?: GridCols;

  /** Number of columns at lg breakpoint */
  @Input() colsLg?: GridCols;

  /** Number of columns at xl breakpoint */
  @Input() colsXl?: GridCols;

  /** Gap between items */
  @Input() gap: GridGap = 'md';

  /** Row gap (if different from column gap) */
  @Input() rowGap?: GridGap;

  /** Column gap (if different from row gap) */
  @Input() colGap?: GridGap;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected gridClasses(): string {
    const classes = ['grid', COLS_CLASSES[this.cols.toString()]];

    // Responsive columns
    if (this.colsSm) {
      classes.push(`sm:${COLS_CLASSES[this.colsSm.toString()]}`);
    }
    if (this.colsMd) {
      classes.push(`md:${COLS_CLASSES[this.colsMd.toString()]}`);
    }
    if (this.colsLg) {
      classes.push(`lg:${COLS_CLASSES[this.colsLg.toString()]}`);
    }
    if (this.colsXl) {
      classes.push(`xl:${COLS_CLASSES[this.colsXl.toString()]}`);
    }

    // Gap handling
    if (this.rowGap && this.colGap) {
      classes.push(GAP_CLASSES[this.rowGap].replace('gap-', 'gap-y-'));
      classes.push(GAP_CLASSES[this.colGap].replace('gap-', 'gap-x-'));
    } else {
      classes.push(GAP_CLASSES[this.gap]);
    }

    return this.twClass.merge(...classes, this.class);
  }
}

/**
 * SimpleGrid component for auto-fit grid layouts with minimum column width.
 *
 * @example
 * ```html
 * <tw-simple-grid minChildWidth="200px" gap="md">
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </tw-simple-grid>
 * ```
 */
@Component({
  selector: 'tw-simple-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="gridClasses()" [style.gridTemplateColumns]="gridTemplateColumns()">
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
export class TwSimpleGridComponent {
  /** Minimum width of each child (e.g., '200px', '15rem') */
  @Input() minChildWidth = '200px';

  /** Gap between items */
  @Input() gap: GridGap = 'md';

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected gridClasses(): string {
    return this.twClass.merge('grid', GAP_CLASSES[this.gap], this.class);
  }

  protected gridTemplateColumns(): string {
    return `repeat(auto-fit, minmax(${this.minChildWidth}, 1fr))`;
  }
}
