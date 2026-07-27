/**
 * Utility for truly dynamic imports that bundlers cannot statically analyze.
 * This prevents build errors when optional peer dependencies (Tauri/Electron)
 * are not installed.
 *
 * A variable module specifier (plus the `@vite-ignore`/`webpackIgnore` hints)
 * keeps bundlers from resolving these modules at build time. A direct dynamic
 * `import()` is used instead of `new Function('return import(...)')` because
 * the Function constructor requires 'unsafe-eval', which the default
 * Tauri/Electron Content Security Policies forbid (it throws synchronously
 * there). Failures surface as a rejected promise for callers to catch.
 */

export function dynamicImport(modulePath: string): Promise<any> {
  return import(/* @vite-ignore */ /* webpackIgnore: true */ modulePath);
}
