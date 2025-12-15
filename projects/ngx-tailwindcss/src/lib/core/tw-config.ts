import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for ngx-tailwindcss components
 * Allows users to customize default class mappings
 */
export interface TwConfig {
  /** Custom class prefix for component-specific classes */
  prefix?: string;

  /** Theme configuration for color variants */
  theme?: TwThemeConfig;

  /** Default animation duration in milliseconds */
  animationDuration?: number;

  /** Whether to use CSS transitions or Angular animations */
  useAngularAnimations?: boolean;

  /** Custom class overrides for components */
  classOverrides?: TwClassOverrides;
}

export interface TwThemeConfig {
  /** Primary color variant classes */
  primary?: string;
  /** Secondary color variant classes */
  secondary?: string;
  /** Success/positive color variant classes */
  success?: string;
  /** Warning color variant classes */
  warning?: string;
  /** Danger/error color variant classes */
  danger?: string;
  /** Info color variant classes */
  info?: string;
  /** Neutral color variant classes */
  neutral?: string;
}

export interface TwClassOverrides {
  button?: Partial<TwButtonClassConfig>;
  card?: Partial<TwCardClassConfig>;
  input?: Partial<TwInputClassConfig>;
  badge?: Partial<TwBadgeClassConfig>;
  alert?: Partial<TwAlertClassConfig>;
  modal?: Partial<TwModalClassConfig>;
  dropdown?: Partial<TwDropdownClassConfig>;
  tabs?: Partial<TwTabsClassConfig>;
}

export interface TwButtonClassConfig {
  base: string;
  variants: Record<string, string>;
  sizes: Record<string, string>;
  disabled: string;
  loading: string;
}

export interface TwCardClassConfig {
  base: string;
  header: string;
  body: string;
  footer: string;
  variants: Record<string, string>;
}

export interface TwInputClassConfig {
  base: string;
  label: string;
  wrapper: string;
  error: string;
  hint: string;
  variants: Record<string, string>;
  sizes: Record<string, string>;
}

export interface TwBadgeClassConfig {
  base: string;
  variants: Record<string, string>;
  sizes: Record<string, string>;
}

export interface TwAlertClassConfig {
  base: string;
  icon: string;
  content: string;
  dismissButton: string;
  variants: Record<string, string>;
}

export interface TwModalClassConfig {
  overlay: string;
  container: string;
  header: string;
  body: string;
  footer: string;
  closeButton: string;
  sizes: Record<string, string>;
}

export interface TwDropdownClassConfig {
  trigger: string;
  menu: string;
  item: string;
  itemActive: string;
  itemDisabled: string;
  divider: string;
}

export interface TwTabsClassConfig {
  container: string;
  tabList: string;
  tab: string;
  tabActive: string;
  tabDisabled: string;
  panel: string;
  variants: Record<string, string>;
}

/**
 * Injection token for providing custom ngx-tailwindcss configuration
 */
export const TW_CONFIG = new InjectionToken<TwConfig>('TW_CONFIG');

/**
 * Default configuration values
 */
export const DEFAULT_TW_CONFIG: TwConfig = {
  prefix: 'tw',
  animationDuration: 200,
  useAngularAnimations: true,
  theme: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    neutral: 'bg-slate-200 hover:bg-slate-300 text-slate-900',
  },
};

