/**
 * This file contains class names that need to be included in the Tailwind CSS output.
 * Tailwind CSS v4 scans source files for class names, but the `@source` directive
 * may not properly extract variant classes like `dark:` from compiled JavaScript.
 *
 * By including these class strings here, we ensure they are detected and CSS is generated.
 *
 * This file is scanned by Tailwind via the @source directive in styles.scss.
 */

export const DARK_MODE_SAFELIST = [
  // Background colors - dark variants
  'dark:bg-amber-900/30',
  'dark:bg-amber-900/40',
  'dark:bg-amber-900/50',
  'dark:bg-blue-900/30',
  'dark:bg-blue-900/40',
  'dark:bg-cyan-900/40',
  'dark:bg-emerald-900/30',
  'dark:bg-emerald-900/40',
  'dark:bg-indigo-900/30',
  'dark:bg-indigo-900/50',
  'dark:bg-rose-900/30',
  'dark:bg-rose-900/40',
  'dark:bg-slate-700',
  'dark:bg-slate-700/50',
  'dark:bg-slate-800',
  'dark:bg-slate-800/50',
  'dark:bg-slate-800/80',
  'dark:bg-slate-900',
  'dark:bg-slate-900/50',
  'dark:bg-slate-900/80',
  'dark:bg-transparent',
  'dark:bg-white/5',
  'dark:bg-white/10',

  // Border colors - dark variants
  'dark:border-amber-400',
  'dark:border-amber-600',
  'dark:border-amber-800',
  'dark:border-blue-400',
  'dark:border-blue-600',
  'dark:border-blue-800',
  'dark:border-indigo-800',
  'dark:border-b-slate-800',
  'dark:border-cyan-400',
  'dark:border-emerald-400',
  'dark:border-emerald-600',
  'dark:border-emerald-800',
  'dark:border-rose-400',
  'dark:border-rose-600',
  'dark:border-rose-800',
  'dark:border-slate-400',
  'dark:border-slate-500',
  'dark:border-slate-600',
  'dark:border-slate-700',
  'dark:border-slate-700/20',
  'dark:border-slate-800',
  'dark:border-transparent',

  // Divide colors - dark variants
  'dark:divide-slate-700',
  'dark:divide-slate-800',

  // Text colors - dark variants
  'dark:text-amber-300',
  'dark:text-amber-400',
  'dark:text-blue-300',
  'dark:text-blue-400',
  'dark:text-cyan-300',
  'dark:text-cyan-400',
  'dark:text-emerald-300',
  'dark:text-emerald-400',
  'dark:text-indigo-400',
  'dark:text-rose-300',
  'dark:text-rose-400',
  'dark:text-slate-50',
  'dark:text-slate-100',
  'dark:text-slate-200',
  'dark:text-slate-300',
  'dark:text-slate-400',
  'dark:text-slate-500',
  'dark:text-white',

  // Placeholder colors - dark variants
  'dark:placeholder-slate-500',
  'dark:placeholder:text-slate-500',

  // Ring colors - dark variants
  'dark:ring-slate-700',
  'dark:ring-white/10',
  'dark:ring-offset-slate-900',

  // Shadow colors - dark variants
  'dark:shadow-slate-900/50',

  // Hover states - dark variants
  'dark:hover:bg-amber-900/50',
  'dark:hover:bg-indigo-900/50',
  'dark:hover:bg-slate-600',
  'dark:hover:bg-slate-700',
  'dark:hover:bg-slate-800',
  'dark:hover:border-slate-500',
  'dark:hover:border-slate-600',
  'dark:hover:text-slate-100',
  'dark:hover:text-slate-200',
  'dark:hover:text-white',

  // Focus states - dark variants
  'dark:focus:bg-slate-800',
  'dark:focus:border-blue-500',
  'dark:focus:ring-blue-500/20',
  'dark:focus-visible:ring-offset-slate-900',

  // Scrollbar - dark variants
  'dark:scrollbar-track-slate-800',
  'dark:scrollbar-thumb-slate-600',
] as const;

// This ensures the strings are included in the compiled output for Tailwind to scan
export type DarkModeSafelistClass = (typeof DARK_MODE_SAFELIST)[number];

