/**
 * Dynamic import utilities that prevent bundlers from analyzing/resolving the imports at build time.
 *
 * The trick is to use a variable for the module specifier, which makes it impossible for bundlers
 * to statically analyze the import. This is intentional for optional dependencies like Electron and Tauri.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a dynamic import function that bundlers cannot statically analyze.
 * This prevents build errors for optional dependencies that may not be installed.
 */
function createDynamicImport() {
  // Use Function constructor to create import at runtime, preventing static analysis
  return new Function('modulePath', 'return import(modulePath)') as (
    modulePath: string
  ) => Promise<any>;
}

const dynamicImport = createDynamicImport();

/**
 * Dynamically import the Electron module.
 * This will only work at runtime when running in an Electron context.
 * Returns null if Electron is not available.
 */
export async function importElectron(): Promise<typeof import('electron') | null> {
  try {
    const electron = await dynamicImport('electron');
    return electron;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri dialog plugin.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri dialog is not available.
 */
export async function importTauriDialog(): Promise<
  typeof import('@tauri-apps/plugin-dialog') | null
> {
  try {
    const dialog = await dynamicImport('@tauri-apps/plugin-dialog');
    return dialog;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri notification plugin.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri notification is not available.
 */
export async function importTauriNotification(): Promise<
  typeof import('@tauri-apps/plugin-notification') | null
> {
  try {
    const notification = await dynamicImport('@tauri-apps/plugin-notification');
    return notification;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri process plugin.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri process is not available.
 */
export async function importTauriProcess(): Promise<
  typeof import('@tauri-apps/plugin-process') | null
> {
  try {
    const process = await dynamicImport('@tauri-apps/plugin-process');
    return process;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri updater plugin.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri updater is not available.
 */
export async function importTauriUpdater(): Promise<
  typeof import('@tauri-apps/plugin-updater') | null
> {
  try {
    const updater = await dynamicImport('@tauri-apps/plugin-updater');
    return updater;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri app API.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri app is not available.
 */
export async function importTauriApp(): Promise<typeof import('@tauri-apps/api/app') | null> {
  try {
    const app = await dynamicImport('@tauri-apps/api/app');
    return app;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri menu API.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri menu is not available.
 */
export async function importTauriMenu(): Promise<typeof import('@tauri-apps/api/menu') | null> {
  try {
    const menu = await dynamicImport('@tauri-apps/api/menu');
    return menu;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri tray API.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri tray is not available.
 */
export async function importTauriTray(): Promise<typeof import('@tauri-apps/api/tray') | null> {
  try {
    const tray = await dynamicImport('@tauri-apps/api/tray');
    return tray;
  } catch {
    return null;
  }
}

/**
 * Dynamically import Tauri window API.
 * This will only work at runtime when running in a Tauri context.
 * Returns null if Tauri window is not available.
 */
export async function importTauriWindow(): Promise<typeof import('@tauri-apps/api/window') | null> {
  try {
    const window = await dynamicImport('@tauri-apps/api/window');
    return window;
  } catch {
    return null;
  }
}
