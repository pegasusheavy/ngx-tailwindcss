/**
 * Utility for truly dynamic imports that bundlers cannot statically analyze.
 * This prevents build errors when optional peer dependencies (Tauri/Electron) are not installed.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dynamicImport(modulePath: string): Promise<any> {
  // Use Function constructor to hide the import from static analysis
  // This prevents bundlers from trying to resolve these modules at build time
  return new Function('modulePath', 'return import(modulePath)')(modulePath);
}
