import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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

// Tailwind only generates classes it can see as complete literals, so each
// responsive breakpoint needs its own lookup map (no runtime `sm:${...}`).
const SM_COLS_CLASSES: Record<string, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
  none: 'sm:grid-cols-none',
  auto: 'sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
};

const MD_COLS_CLASSES: Record<string, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
  none: 'md:grid-cols-none',
  auto: 'md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
};

const LG_COLS_CLASSES: Record<string, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
  none: 'lg:grid-cols-none',
  auto: 'lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
};

const XL_COLS_CLASSES: Record<string, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
  none: 'xl:grid-cols-none',
  auto: 'xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
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

const GAP_X_CLASSES: Record<GridGap, string> = {
  none: 'gap-x-0',
  xs: 'gap-x-1',
  sm: 'gap-x-2',
  md: 'gap-x-4',
  lg: 'gap-x-6',
  xl: 'gap-x-8',
  '2xl': 'gap-x-12',
};

const GAP_Y_CLASSES: Record<GridGap, string> = {
  none: 'gap-y-0',
  xs: 'gap-y-1',
  sm: 'gap-y-2',
  md: 'gap-y-4',
  lg: 'gap-y-6',
  xl: 'gap-y-8',
  '2xl': 'gap-y-12',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwGridComponent {
  private readonly twClass = inject(TwClassService);

  /** Number of columns (base) */
  readonly cols = input<GridCols>(1);

  /** Number of columns at sm breakpoint */
  readonly colsSm = input<GridCols | undefined>(undefined);

  /** Number of columns at md breakpoint */
  readonly colsMd = input<GridCols | undefined>(undefined);

  /** Number of columns at lg breakpoint */
  readonly colsLg = input<GridCols | undefined>(undefined);

  /** Number of columns at xl breakpoint */
  readonly colsXl = input<GridCols | undefined>(undefined);

  /** Gap between items */
  readonly gap = input<GridGap>('md');

  /** Row gap (if different from column gap) */
  readonly rowGap = input<GridGap | undefined>(undefined);

  /** Column gap (if different from row gap) */
  readonly colGap = input<GridGap | undefined>(undefined);

  /**
   * Additional CSS classes. Signal input so a bound `[class]` survives Angular's
   * special class-binding handling and re-renders the inner element on change.
   */
  readonly class = input('');

  protected readonly gridClasses = computed(() => {
    const classes = ['grid', COLS_CLASSES[this.cols().toString()]];

    // Responsive columns
    const colsSm = this.colsSm();
    if (colsSm) {
      classes.push(SM_COLS_CLASSES[colsSm.toString()]);
    }
    const colsMd = this.colsMd();
    if (colsMd) {
      classes.push(MD_COLS_CLASSES[colsMd.toString()]);
    }
    const colsLg = this.colsLg();
    if (colsLg) {
      classes.push(LG_COLS_CLASSES[colsLg.toString()]);
    }
    const colsXl = this.colsXl();
    if (colsXl) {
      classes.push(XL_COLS_CLASSES[colsXl.toString()]);
    }

    // Gap handling
    const rowGap = this.rowGap();
    const colGap = this.colGap();
    if (rowGap && colGap) {
      classes.push(GAP_Y_CLASSES[rowGap], GAP_X_CLASSES[colGap]);
    } else {
      classes.push(GAP_CLASSES[this.gap()]);
    }

    return this.twClass.merge(...classes, this.class());
  });
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simple-grid.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwSimpleGridComponent {
  private readonly twClass = inject(TwClassService);

  /** Minimum width of each child (e.g., '200px', '15rem') */
  readonly minChildWidth = input('200px');

  /** Gap between items */
  readonly gap = input<GridGap>('md');

  /**
   * Additional CSS classes. Signal input so a bound `[class]` survives Angular's
   * special class-binding handling and re-renders the inner element on change.
   */
  readonly class = input('');

  protected readonly gridClasses = computed(() => {
    return this.twClass.merge('grid', GAP_CLASSES[this.gap()], this.class());
  });

  protected readonly gridTemplateColumns = computed(() => {
    return `repeat(auto-fit, minmax(${this.minChildWidth()}, 1fr))`;
  });
}
