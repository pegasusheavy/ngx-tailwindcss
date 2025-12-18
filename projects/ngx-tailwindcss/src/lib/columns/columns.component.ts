import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ColumnsCount = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
export type ColumnsGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColumnsRule = 'none' | 'solid' | 'dashed' | 'dotted';

const COLUMNS_CLASSES: Record<string, string> = {
  1: 'columns-1',
  2: 'columns-2',
  3: 'columns-3',
  4: 'columns-4',
  5: 'columns-5',
  6: 'columns-6',
  auto: 'columns-auto',
};

const GAP_CLASSES: Record<ColumnsGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

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
  template: `
    <div [class]="columnsClasses()" [style]="columnsStyles()">
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
export class TwColumnsComponent {
  /** Number of columns (base) */
  @Input() count: ColumnsCount = 2;

  /** Number of columns at sm breakpoint */
  @Input() countSm?: ColumnsCount;

  /** Number of columns at md breakpoint */
  @Input() countMd?: ColumnsCount;

  /** Number of columns at lg breakpoint */
  @Input() countLg?: ColumnsCount;

  /** Number of columns at xl breakpoint */
  @Input() countXl?: ColumnsCount;

  /** Gap between columns */
  @Input() gap: ColumnsGap = 'md';

  /** Column rule style */
  @Input() rule: ColumnsRule = 'none';

  /** Column rule color (Tailwind color, e.g., 'slate-300') */
  @Input() ruleColor = 'slate-200';

  /** Column rule width in pixels */
  @Input() ruleWidth = 1;

  /** Whether children should not break across columns */
  @Input() avoidBreak = false;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected columnsClasses(): string {
    const classes = [
      COLUMNS_CLASSES[this.count.toString()],
      GAP_CLASSES[this.gap],
    ];

    // Responsive columns
    if (this.countSm) {
      classes.push(`sm:${COLUMNS_CLASSES[this.countSm.toString()]}`);
    }
    if (this.countMd) {
      classes.push(`md:${COLUMNS_CLASSES[this.countMd.toString()]}`);
    }
    if (this.countLg) {
      classes.push(`lg:${COLUMNS_CLASSES[this.countLg.toString()]}`);
    }
    if (this.countXl) {
      classes.push(`xl:${COLUMNS_CLASSES[this.countXl.toString()]}`);
    }

    // Avoid break styling
    if (this.avoidBreak) {
      classes.push('[&>*]:break-inside-avoid');
    }

    return this.twClass.merge(...classes, this.class);
  }

  protected columnsStyles(): Record<string, string> {
    if (this.rule === 'none') {
      return {};
    }

    // Convert Tailwind color to CSS variable or fallback
    const colorMap: Record<string, string> = {
      'slate-200': '#e2e8f0',
      'slate-300': '#cbd5e1',
      'slate-400': '#94a3b8',
      'gray-200': '#e5e7eb',
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'zinc-200': '#e4e4e7',
      'zinc-300': '#d4d4d8',
    };

    const color = colorMap[this.ruleColor] || this.ruleColor;

    return {
      columnRule: `${this.ruleWidth}px ${this.rule} ${color}`,
    };
  }
}

