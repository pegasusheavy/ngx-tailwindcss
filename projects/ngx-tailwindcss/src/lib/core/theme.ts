/**
 * Theme configuration system for ngx-tailwindcss
 *
 * This module provides a CSS custom properties (CSS variables) based theming system
 * that allows users to fully customize all colors used by the library components.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * import { provideTwTheme, createTheme } from '@pegasus-heavy/ngx-tailwindcss';
 *
 * const customTheme = createTheme({
 *   colors: {
 *     primary: { light: '#3b82f6', dark: '#60a5fa' },
 *     background: { light: '#ffffff', dark: '#0f172a' },
 *   }
 * });
 *
 * export const appConfig = {
 *   providers: [provideTwTheme(customTheme)]
 * };
 * ```
 */

import { InjectionToken } from '@angular/core';

/**
 * Color value that can have light and dark variants
 */
export interface ThemeColorValue {
  /** Color value for light mode */
  light: string;
  /** Color value for dark mode */
  dark: string;
}

/**
 * Semantic color definitions for the theme
 */
export interface ThemeColors {
  // Brand colors
  primary?: ThemeColorValue;
  secondary?: ThemeColorValue;

  // Semantic colors
  success?: ThemeColorValue;
  warning?: ThemeColorValue;
  danger?: ThemeColorValue;
  info?: ThemeColorValue;

  // Neutral palette
  background?: ThemeColorValue;
  surface?: ThemeColorValue;
  surfaceAlt?: ThemeColorValue;

  // Text colors
  textPrimary?: ThemeColorValue;
  textSecondary?: ThemeColorValue;
  textMuted?: ThemeColorValue;
  textInverse?: ThemeColorValue;

  // Border colors
  border?: ThemeColorValue;
  borderLight?: ThemeColorValue;
  borderFocus?: ThemeColorValue;

  // Interactive states
  hover?: ThemeColorValue;
  active?: ThemeColorValue;
  disabled?: ThemeColorValue;

  // Overlay/backdrop
  overlay?: ThemeColorValue;
}

/**
 * Component-specific theme overrides
 */
export interface ThemeComponentOverrides {
  button?: {
    primaryBg?: ThemeColorValue;
    primaryText?: ThemeColorValue;
    secondaryBg?: ThemeColorValue;
    secondaryText?: ThemeColorValue;
  };
  card?: {
    bg?: ThemeColorValue;
    border?: ThemeColorValue;
    shadow?: ThemeColorValue;
  };
  input?: {
    bg?: ThemeColorValue;
    border?: ThemeColorValue;
    focusBorder?: ThemeColorValue;
    placeholderText?: ThemeColorValue;
  };
  modal?: {
    overlayBg?: ThemeColorValue;
    contentBg?: ThemeColorValue;
  };
  dropdown?: {
    bg?: ThemeColorValue;
    itemHover?: ThemeColorValue;
  };
  tooltip?: {
    bg?: ThemeColorValue;
    text?: ThemeColorValue;
  };
}

/**
 * Complete theme definition
 */
export interface TwTheme {
  /** Theme name for identification */
  name?: string;

  /** Semantic color definitions */
  colors: ThemeColors;

  /** Component-specific overrides */
  components?: ThemeComponentOverrides;

  /** Additional CSS custom properties */
  customProperties?: Record<string, ThemeColorValue | string>;
}

/**
 * Injection token for the theme configuration
 */
export const TW_THEME = new InjectionToken<TwTheme>('TW_THEME');

/**
 * Default theme colors - these are used when no custom theme is provided
 * Users can override these by providing their own theme configuration.
 *
 * Note: The library uses Tailwind's dark: variant by default.
 * These CSS variables provide an ADDITIONAL way to customize colors
 * that works alongside or instead of Tailwind classes.
 */
export const DEFAULT_THEME_COLORS: Required<ThemeColors> = {
  // Brand colors
  primary: { light: '#3b82f6', dark: '#60a5fa' }, // blue-500, blue-400
  secondary: { light: '#64748b', dark: '#94a3b8' }, // slate-500, slate-400

  // Semantic colors
  success: { light: '#10b981', dark: '#34d399' }, // emerald-500, emerald-400
  warning: { light: '#f59e0b', dark: '#fbbf24' }, // amber-500, amber-400
  danger: { light: '#ef4444', dark: '#f87171' }, // rose-500, rose-400
  info: { light: '#06b6d4', dark: '#22d3ee' }, // cyan-500, cyan-400

  // Neutral palette
  background: { light: '#ffffff', dark: '#0f172a' }, // white, slate-900
  surface: { light: '#ffffff', dark: '#1e293b' }, // white, slate-800
  surfaceAlt: { light: '#f8fafc', dark: '#334155' }, // slate-50, slate-700

  // Text colors
  textPrimary: { light: '#0f172a', dark: '#f8fafc' }, // slate-900, slate-50
  textSecondary: { light: '#475569', dark: '#94a3b8' }, // slate-600, slate-400
  textMuted: { light: '#94a3b8', dark: '#64748b' }, // slate-400, slate-500
  textInverse: { light: '#ffffff', dark: '#0f172a' }, // white, slate-900

  // Border colors
  border: { light: '#e2e8f0', dark: '#334155' }, // slate-200, slate-700
  borderLight: { light: '#f1f5f9', dark: '#475569' }, // slate-100, slate-600
  borderFocus: { light: '#3b82f6', dark: '#60a5fa' }, // blue-500, blue-400

  // Interactive states
  hover: { light: '#f1f5f9', dark: '#334155' }, // slate-100, slate-700
  active: { light: '#e2e8f0', dark: '#475569' }, // slate-200, slate-600
  disabled: { light: '#e2e8f0', dark: '#334155' }, // slate-200, slate-700

  // Overlay/backdrop
  overlay: { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
};

/**
 * Default complete theme
 */
export const DEFAULT_THEME: TwTheme = {
  name: 'default',
  colors: DEFAULT_THEME_COLORS,
};

/**
 * Creates a theme by merging user colors with defaults
 */
export function createTheme(config: Partial<TwTheme>): TwTheme {
  return {
    name: config.name ?? 'custom',
    colors: {
      ...DEFAULT_THEME_COLORS,
      ...config.colors,
    },
    components: config.components,
    customProperties: config.customProperties,
  };
}

/**
 * Generates CSS custom properties from a theme
 */
export function generateThemeCssProperties(theme: TwTheme): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  // Process colors - use --tw-color- prefix for semantic colors
  const colors = { ...DEFAULT_THEME_COLORS, ...theme.colors };
  for (const [key, value] of Object.entries(colors)) {
    if (value && typeof value === 'object' && 'light' in value) {
      const cssVar = `--tw-color-${camelToKebab(key)}`;
      light[cssVar] = value.light;
      dark[cssVar] = value.dark;
    }
  }

  // Process component overrides
  if (theme.components) {
    for (const [component, overrides] of Object.entries(theme.components)) {
      if (!overrides) continue;
      for (const [prop, value] of Object.entries(overrides)) {
        if (value && typeof value === 'object' && 'light' in value && 'dark' in value) {
          const colorValue = value as ThemeColorValue;
          const cssVar = `--tw-${component}-${camelToKebab(prop)}`;
          light[cssVar] = colorValue.light;
          dark[cssVar] = colorValue.dark;
        }
      }
    }
  }

  // Process custom properties
  if (theme.customProperties) {
    for (const [key, value] of Object.entries(theme.customProperties)) {
      const cssVar = key.startsWith('--') ? key : `--tw-${key}`;
      if (typeof value === 'string') {
        light[cssVar] = value;
        dark[cssVar] = value;
      } else if (value && typeof value === 'object' && 'light' in value) {
        light[cssVar] = value.light;
        dark[cssVar] = value.dark;
      }
    }
  }

  return { light, dark };
}

/**
 * Converts camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * CSS class names for semantic colors (for components that still want to use classes)
 * These reference the CSS custom properties and provide a theme-aware alternative
 * to Tailwind's built-in color classes.
 *
 * @example
 * ```html
 * <!-- Instead of: -->
 * <div class="bg-blue-500 dark:bg-blue-400">...</div>
 *
 * <!-- Use theme-aware: -->
 * <div class="bg-[var(--tw-color-primary)]">...</div>
 * ```
 */
export const THEME_CSS_CLASSES = {
  // Backgrounds
  bgPrimary: 'bg-[var(--tw-color-primary)]',
  bgSecondary: 'bg-[var(--tw-color-secondary)]',
  bgSuccess: 'bg-[var(--tw-color-success)]',
  bgWarning: 'bg-[var(--tw-color-warning)]',
  bgDanger: 'bg-[var(--tw-color-danger)]',
  bgInfo: 'bg-[var(--tw-color-info)]',
  bgSurface: 'bg-[var(--tw-color-surface)]',
  bgSurfaceAlt: 'bg-[var(--tw-color-surface-alt)]',
  bgBackground: 'bg-[var(--tw-color-background)]',

  // Text
  textPrimary: 'text-[var(--tw-color-text)]',
  textSecondary: 'text-[var(--tw-color-text-secondary)]',
  textMuted: 'text-[var(--tw-color-text-muted)]',
  textInverse: 'text-[var(--tw-color-text-inverse)]',

  // Borders
  borderDefault: 'border-[var(--tw-color-border)]',
  borderLight: 'border-[var(--tw-color-border-light)]',
  borderFocus: 'border-[var(--tw-color-border-focus)]',
} as const;

