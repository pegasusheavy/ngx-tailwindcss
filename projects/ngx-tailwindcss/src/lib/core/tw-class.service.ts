import { inject, Injectable } from '@angular/core';
import { DEFAULT_TW_CONFIG, TW_CONFIG, TwConfig } from './tw-config';

/**
 * Group patterns for common Tailwind utilities
 */
const GROUP_PATTERNS: ReadonlyArray<[RegExp, string]> = [
  // Layout
  [
    /^(block|inline|inline-block|flex|inline-flex|grid|inline-grid|hidden|contents|flow-root)$/,
    'display',
  ],
  [/^(static|fixed|absolute|relative|sticky)$/, 'position'],
  [/^(visible|invisible|collapse)$/, 'visibility'],
  [/^overflow-x-/, 'overflow-x'],
  [/^overflow-y-/, 'overflow-y'],
  [/^overflow-/, 'overflow'],
  [/^z-/, 'z-index'],

  // Flexbox & Grid
  [/^flex-(row|col)(-reverse)?$/, 'flex-direction'],
  [/^flex-(wrap|nowrap|wrap-reverse)$/, 'flex-wrap'],
  [/^flex-/, 'flex'],
  [/^(grow|shrink)-?/, 'flex-grow-shrink'],
  [/^basis-/, 'flex-basis'],
  [/^justify-/, 'justify'],
  [/^items-/, 'items'],
  [/^self-/, 'self'],
  [/^content-/, 'content'],
  [/^place-/, 'place'],
  [/^gap-x-/, 'gap-x'],
  [/^gap-y-/, 'gap-y'],
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
  [
    /^border(?:$|-[blrtxy](?:$|-\d)|-\d|-(?:solid|dashed|dotted|double|hidden|none)$)/,
    'border-width',
  ],
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
  [/^scale-x-/, 'scale-x'],
  [/^scale-y-/, 'scale-y'],
  [/^scale-/, 'scale'],
  [/^rotate-/, 'rotate'],
  [/^translate-x-/, 'translate-x'],
  [/^translate-y-/, 'translate-y'],
  [/^translate-/, 'translate'],
  [/^skew-/, 'skew'],
  [/^origin-/, 'transform-origin'],

  // Interactivity
  [/^cursor-/, 'cursor'],
  [/^pointer-events-/, 'pointer-events'],
  [/^select-/, 'user-select'],
  [/^resize(-|$)/, 'resize'],
  [/^scroll-(auto|smooth)$/, 'scroll-behavior'],
  [/^scroll-p[trblxye]?-/, 'scroll-padding'],
  [/^scroll-m[trblxye]?-/, 'scroll-margin'],
  [/^(outline|ring)-/, 'outline-ring'],
];

/**
 * Shorthand groups that subsume their longhand groups when applied later
 */
const SHORTHAND_SUBSUMED_GROUPS: Record<string, readonly string[]> = {
  padding: [
    'padding-x',
    'padding-y',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ],
  margin: ['margin-x', 'margin-y', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  gap: ['gap-x', 'gap-y'],
  overflow: ['overflow-x', 'overflow-y'],
  scale: ['scale-x', 'scale-y'],
  translate: ['translate-x', 'translate-y'],
};

/**
 * Memoized class -> group lookups
 */
const classGroupCache = new Map<string, string>();

/**
 * Splits a class into its variant parts on `:`, ignoring colons inside
 * arbitrary values like `bg-[url(https://example.com/img.png)]`
 */
function splitVariants(cls: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < cls.length; index++) {
    const char = cls[index];
    if (char === '[') depth++;
    else if (char === ']') depth = Math.max(0, depth - 1);
    else if (char === ':' && depth === 0) {
      parts.push(cls.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(cls.slice(start));

  return parts;
}

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

        // A shorthand (p-*/m-*) overrides any earlier longhands in the same variant
        const colonIndex = group.lastIndexOf(':');
        const groupPrefix = colonIndex === -1 ? '' : group.slice(0, colonIndex);
        const baseGroup = colonIndex === -1 ? group : group.slice(colonIndex + 1);
        const subsumed = SHORTHAND_SUBSUMED_GROUPS[baseGroup];
        if (subsumed) {
          for (const longhand of subsumed) {
            classMap.delete(groupPrefix ? `${groupPrefix}:${longhand}` : longhand);
          }
        }

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
    const cached = classGroupCache.get(cls);
    if (cached !== undefined) return cached;

    // Handle responsive/state prefixes (ignoring colons inside arbitrary values)
    const parts = splitVariants(cls);
    let baseClass = parts.at(-1) ?? cls;
    const prefix = parts.slice(0, -1).join(':');

    // Strip important (!) and negative (-) markers for group matching
    while (baseClass.startsWith('!') || baseClass.startsWith('-')) {
      baseClass = baseClass.slice(1);
    }

    let group = cls;
    for (const [pattern, groupName] of GROUP_PATTERNS) {
      if (pattern.test(baseClass)) {
        group = prefix ? `${prefix}:${groupName}` : groupName;
        break;
      }
    }

    // The full class is its own group if no pattern matches
    classGroupCache.set(cls, group);
    return group;
  }

  /**
   * Creates a class string from an array of class names
   */
  join(...classes: Array<string | undefined | null | false>): string {
    return classes.filter(Boolean).join(' ');
  }
}
