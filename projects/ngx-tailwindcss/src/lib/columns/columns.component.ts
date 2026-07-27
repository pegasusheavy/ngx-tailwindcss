import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ColumnsCount = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
export type ColumnsGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColumnsRule = 'none' | 'solid' | 'dashed' | 'dotted';

/**
 * Column classes per breakpoint.
 * IMPORTANT: Keep these as full static strings for Tailwind JIT detection —
 * runtime-built prefixes (`md:${...}`) would never be generated.
 */
const COLUMNS_CLASSES: Record<string, string> = {
  1: 'columns-1',
  2: 'columns-2',
  3: 'columns-3',
  4: 'columns-4',
  5: 'columns-5',
  6: 'columns-6',
  auto: 'columns-auto',
};

const SM_COLUMNS_CLASSES: Record<string, string> = {
  1: 'sm:columns-1',
  2: 'sm:columns-2',
  3: 'sm:columns-3',
  4: 'sm:columns-4',
  5: 'sm:columns-5',
  6: 'sm:columns-6',
  auto: 'sm:columns-auto',
};

const MD_COLUMNS_CLASSES: Record<string, string> = {
  1: 'md:columns-1',
  2: 'md:columns-2',
  3: 'md:columns-3',
  4: 'md:columns-4',
  5: 'md:columns-5',
  6: 'md:columns-6',
  auto: 'md:columns-auto',
};

const LG_COLUMNS_CLASSES: Record<string, string> = {
  1: 'lg:columns-1',
  2: 'lg:columns-2',
  3: 'lg:columns-3',
  4: 'lg:columns-4',
  5: 'lg:columns-5',
  6: 'lg:columns-6',
  auto: 'lg:columns-auto',
};

const XL_COLUMNS_CLASSES: Record<string, string> = {
  1: 'xl:columns-1',
  2: 'xl:columns-2',
  3: 'xl:columns-3',
  4: 'xl:columns-4',
  5: 'xl:columns-5',
  6: 'xl:columns-6',
  auto: 'xl:columns-auto',
};

const GAP_CLASSES: Record<ColumnsGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

/** Matches Tailwind palette tokens such as 'slate-300' */
const TAILWIND_COLOR_TOKEN = /^[a-z]+-\d{2,3}$/;

/**
 * Columns component for creating multi-column text layouts.
 * Uses CSS columns for newspaper-style content flow.
 *
 * @example
 * ```html
 * <!-- 2-column layout -->
 * <tw-columns [count]="2" gap="md">
 *   <p>This content will flow into two columns automatically...</p>
 *   <p>Additional paragraphs will continue in the next column...</p>
 * </tw-columns>
 *
 * <!-- 3-column with dividers -->
 * <tw-columns [count]="3" gap="lg" rule="solid" ruleColor="slate-300">
 *   <article>Long article content...</article>
 * </tw-columns>
 *
 * <!-- Responsive columns -->
 * <tw-columns [count]="1" [countMd]="2" [countLg]="3" gap="md">
 *   <p>Content here...</p>
 * </tw-columns>
 * ```
 */
@Component({
  selector: 'tw-columns',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './columns.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwColumnsComponent {
  private readonly twClass = inject(TwClassService);

  /** Number of columns (base) */
  readonly count = input<ColumnsCount>(2);

  /** Number of columns at sm breakpoint */
  readonly countSm = input<ColumnsCount | undefined>(undefined);

  /** Number of columns at md breakpoint */
  readonly countMd = input<ColumnsCount | undefined>(undefined);

  /** Number of columns at lg breakpoint */
  readonly countLg = input<ColumnsCount | undefined>(undefined);

  /** Number of columns at xl breakpoint */
  readonly countXl = input<ColumnsCount | undefined>(undefined);

  /** Gap between columns */
  readonly gap = input<ColumnsGap>('md');

  /** Column rule style */
  readonly rule = input<ColumnsRule>('none');

  /** Column rule color (Tailwind color token, e.g. 'slate-300', or any CSS color) */
  readonly ruleColor = input('slate-200');

  /** Column rule width in pixels */
  readonly ruleWidth = input(1, { transform: numberAttribute });

  /** Whether children should not break across columns */
  readonly avoidBreak = input(false, { transform: booleanAttribute });

  /** Additional CSS classes */
  readonly class = input('');

  protected readonly columnsClasses = computed(() => {
    const classes = [COLUMNS_CLASSES[String(this.count())], GAP_CLASSES[this.gap()]];

    // Responsive columns
    const countSm = this.countSm();
    if (countSm) {
      classes.push(SM_COLUMNS_CLASSES[String(countSm)]);
    }
    const countMd = this.countMd();
    if (countMd) {
      classes.push(MD_COLUMNS_CLASSES[String(countMd)]);
    }
    const countLg = this.countLg();
    if (countLg) {
      classes.push(LG_COLUMNS_CLASSES[String(countLg)]);
    }
    const countXl = this.countXl();
    if (countXl) {
      classes.push(XL_COLUMNS_CLASSES[String(countXl)]);
    }

    // Avoid break styling
    if (this.avoidBreak()) {
      classes.push('[&>*]:break-inside-avoid');
    }

    return this.twClass.merge(...classes, this.class());
  });

  protected readonly columnsStyles = computed<Record<string, string>>(() => {
    if (this.rule() === 'none') {
      return {};
    }

    // Tailwind v4 exposes the palette as CSS variables (e.g. --color-slate-300);
    // anything else is passed through as a raw CSS color.
    const ruleColor = this.ruleColor();
    const color = TAILWIND_COLOR_TOKEN.test(ruleColor) ? `var(--color-${ruleColor})` : ruleColor;

    const styles: Record<string, string> = {
      columnRule: `${this.ruleWidth()}px ${this.rule()} ${color}`,
    };
    return styles;
  });
}
