/**
 * Utility for truly dynamic imports that bundlers cannot statically analyze.
 * This prevents build errors when optional peer dependencies (Tauri/Electron) are not installed.
 */

 
export function dynamicImport(modulePath: string): Promise<any> {
  // Use Function constructor to hide the import from static analysis
  // This prevents bundlers from trying to resolve these modules at build time
  // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval -- deliberate native dynamic import that must escape bundler static analysis
  return new Function('modulePath', 'return import(modulePath)')(modulePath);
}
