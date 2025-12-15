import { inject, Injectable } from '@angular/core';
import { DEFAULT_TW_CONFIG, TW_CONFIG, TwConfig } from './tw-config';

/**
 * Service for managing Tailwind CSS classes with conflict resolution
 * Uses a lightweight approach similar to tailwind-merge
 */
@Injectable({ providedIn: 'root' })
export class TwClassService {
  private readonly config: TwConfig;

  constructor() {
    const injectedConfig = inject(TW_CONFIG, { optional: true });
    this.config = { ...DEFAULT_TW_CONFIG, ...injectedConfig };
  }

  /**
   * Merges multiple class strings, handling Tailwind class conflicts
   * Later classes override earlier ones for the same utility
   */
  merge(...classes: Array<string | undefined | null | false>): string {
    const classMap = new Map<string, string>();

    for (const classString of classes) {
      if (!classString) continue;

      const classList = classString.split(/\s+/).filter(Boolean);

      for (const cls of classList) {
        const group = this.getClassGroup(cls);
        classMap.set(group, cls);
      }
    }

    return [...classMap.values()].join(' ');
  }

  /**
   * Conditionally applies classes based on a condition map
   */
  conditional(baseClasses: string, conditionals: Record<string, boolean | undefined>): string {
    const activeClasses = Object.entries(conditionals)
      .filter(([, condition]) => condition)
      .map(([classes]) => classes);

    return this.merge(baseClasses, ...activeClasses);
  }

  /**
   * Gets the variant classes for a given variant name
   */
  getVariantClasses(variant: string): string {
    return this.config.theme?.[variant as keyof typeof this.config.theme] ?? '';
  }

  /**
   * Determines the class group for conflict resolution
   */
  private getClassGroup(cls: string): string {
    // Handle responsive/state prefixes
    const parts = cls.split(':');
    const baseClass = parts.at(-1);
    const prefix = parts.slice(0, -1).join(':');

    // Group patterns for common Tailwind utilities
    const groupPatterns: Array<[RegExp, string]> = [
      // Layout
      [
        /^(block|inline|inline-block|flex|inline-flex|grid|inline-grid|hidden|contents|flow-root)$/,
        'display',
      ],
      [/^(static|fixed|absolute|relative|sticky)$/, 'position'],
      [/^(visible|invisible|collapse)$/, 'visibility'],
      [/^overflow-/, 'overflow'],
      [/^z-/, 'z-index'],

      // Flexbox & Grid
      [/^flex-/, 'flex'],
      [/^(grow|shrink)-?/, 'flex-grow-shrink'],
      [/^basis-/, 'flex-basis'],
      [/^justify-/, 'justify'],
      [/^items-/, 'items'],
      [/^self-/, 'self'],
      [/^content-/, 'content'],
      [/^place-/, 'place'],
      [/^gap-/, 'gap'],
      [/^(grid-cols|col-span|col-start|col-end)-/, 'grid-cols'],
      [/^(grid-rows|row-span|row-start|row-end)-/, 'grid-rows'],

      // Spacing - each direction is a separate group
      [/^px-/, 'padding-x'],
      [/^py-/, 'padding-y'],
      [/^pt-/, 'padding-top'],
      [/^pr-/, 'padding-right'],
      [/^pb-/, 'padding-bottom'],
      [/^pl-/, 'padding-left'],
      [/^p-/, 'padding'],
      [/^mx-/, 'margin-x'],
      [/^my-/, 'margin-y'],
      [/^mt-/, 'margin-top'],
      [/^mr-/, 'margin-right'],
      [/^mb-/, 'margin-bottom'],
      [/^ml-/, 'margin-left'],
      [/^m-/, 'margin'],
      [/^space-x-/, 'space-x'],
      [/^space-y-/, 'space-y'],

      // Sizing
      [/^w-/, 'width'],
      [/^min-w-/, 'min-width'],
      [/^max-w-/, 'max-width'],
      [/^h-/, 'height'],
      [/^min-h-/, 'min-height'],
      [/^max-h-/, 'max-height'],
      [/^size-/, 'size'],

      // Typography
      [/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, 'font-size'],
      [/^text-(left|center|right|justify|start|end)$/, 'text-align'],
      [/^text-/, 'text-color'],
      [/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, 'font-weight'],
      [/^font-/, 'font-family'],
      [/^leading-/, 'line-height'],
      [/^tracking-/, 'letter-spacing'],
      [/^(uppercase|lowercase|capitalize|normal-case)$/, 'text-transform'],
      [/^(underline|overline|line-through|no-underline)$/, 'text-decoration'],
      [/^(truncate|text-ellipsis|text-clip)$/, 'text-overflow'],
      [/^(whitespace|break)-/, 'whitespace'],

      // Backgrounds
      [/^bg-/, 'background'],
      [/^from-/, 'gradient-from'],
      [/^via-/, 'gradient-via'],
      [/^to-/, 'gradient-to'],

      // Borders
      [/^border($|-[blrtxy]?-?\d|-(solid|dashed|dotted|double|hidden|none))/, 'border-width'],
      [/^border-/, 'border-color'],
      [/^rounded(-|$)/, 'border-radius'],
      [/^ring-/, 'ring'],

      // Effects
      [/^shadow(-|$)/, 'shadow'],
      [/^opacity-/, 'opacity'],
      [/^blur(-|$)/, 'blur'],

      // Transitions & Animation
      [/^transition(-|$)/, 'transition'],
      [/^duration-/, 'duration'],
      [/^ease-/, 'ease'],
      [/^delay-/, 'delay'],
      [/^animate-/, 'animate'],

      // Transforms
      [/^scale-/, 'scale'],
      [/^rotate-/, 'rotate'],
      [/^translate-/, 'translate'],
      [/^skew-/, 'skew'],
      [/^origin-/, 'transform-origin'],

      // Interactivity
      [/^cursor-/, 'cursor'],
      [/^(pointer-events|select|resize|scroll)-/, 'interactivity'],
      [/^(outline|ring)-/, 'outline-ring'],
    ];

    for (const [pattern, group] of groupPatterns) {
      if (pattern.test(baseClass)) {
        return prefix ? `${prefix}:${group}` : group;
      }
    }

    // Return the full class as its own group if no pattern matches
    return cls;
  }

  /**
   * Creates a class string from an array of class names
   */
  join(...classes: Array<string | undefined | null | false>): string {
    return classes.filter(Boolean).join(' ');
  }
}
