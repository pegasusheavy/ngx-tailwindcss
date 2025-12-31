/**
 * Type declarations for Tauri and Electron modules
 * These are used for dynamic imports and may not be present at build time
 */

// @tauri-apps/plugin-dialog
declare module '@tauri-apps/plugin-dialog' {
  export interface OpenDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: { name: string; extensions: string[] }[];
    multiple?: boolean;
    directory?: boolean;
  }

  export interface SaveDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: { name: string; extensions: string[] }[];
  }

  export type OpenDialogReturn = string | string[] | { path: string; name?: string } | { path: string; name?: string }[] | null;

  export function open(options?: OpenDialogOptions): Promise<OpenDialogReturn>;
  export function save(options?: SaveDialogOptions): Promise<string | null>;
}

// @tauri-apps/api/tray
declare module '@tauri-apps/api/tray' {
  export interface TrayIconOptions {
    icon: string;
    tooltip?: string;
    title?: string;
    menu?: unknown;
  }

  export class TrayIcon {
    static new(options: TrayIconOptions): Promise<TrayIcon>;
    setIcon(icon: string): Promise<void>;
    setTooltip(tooltip: string): Promise<void>;
    setMenu(menu: unknown): Promise<void>;
  }
}

// @tauri-apps/api/menu
declare module '@tauri-apps/api/menu' {
  export interface MenuItemOptions {
    id: string;
    text: string;
    enabled?: boolean;
    accelerator?: string;
    action?: () => void;
  }

  export interface SubmenuOptions {
    id: string;
    text: string;
    items: unknown[];
  }

  export interface MenuOptions {
    items: unknown[];
  }

  export class MenuItem {
    static new(options: MenuItemOptions): Promise<MenuItem>;
  }

  export class Submenu {
    static new(options: SubmenuOptions): Promise<Submenu>;
  }

  export class Menu {
    static new(options: MenuOptions): Promise<Menu>;
  }
}

// @tauri-apps/api/window
declare module '@tauri-apps/api/window' {
  export interface Window {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    unmaximize(): Promise<void>;
    close(): Promise<void>;
    isMaximized(): Promise<boolean>;
    isMinimized(): Promise<boolean>;
    isFullscreen(): Promise<boolean>;
    toggleFullscreen(): Promise<void>;
    requestUserAttention(type: number | null): Promise<void>;
  }

  export function getCurrentWindow(): Window;
}

// @tauri-apps/plugin-notification
declare module '@tauri-apps/plugin-notification' {
  export interface NotificationOptions {
    title: string;
    body?: string;
    icon?: string;
    sound?: string;
  }

  export function isPermissionGranted(): Promise<boolean>;
  export function requestPermission(): Promise<'granted' | 'denied' | 'default'>;
  export function sendNotification(options: NotificationOptions): Promise<void>;
  export function setBadgeCount(count: number): Promise<void>;
}

// @tauri-apps/plugin-updater
declare module '@tauri-apps/plugin-updater' {
  export interface Update {
    available: boolean;
    version: string;
    date?: string;
    body?: string;
    downloadAndInstall(onProgress: (event: { event: string; data?: { contentLength?: number; chunkLength?: number } }) => void): Promise<void>;
  }

  export function check(): Promise<Update | null>;
  export function onUpdaterEvent(handler: (event: { status: string; error?: string }) => void): Promise<() => void>;
}

// @tauri-apps/plugin-process
declare module '@tauri-apps/plugin-process' {
  export function relaunch(): Promise<void>;
  export function exit(code?: number): Promise<void>;
}

// @tauri-apps/api/app
declare module '@tauri-apps/api/app' {
  export function getVersion(): Promise<string>;
  export function getName(): Promise<string>;
  export function getTauriVersion(): Promise<string>;
}

// @tauri-apps/api/os (legacy, for compatibility)
declare module '@tauri-apps/api/os' {
  export function platform(): Promise<'linux' | 'darwin' | 'win32' | 'freebsd' | 'openbsd' | 'netbsd' | 'android' | 'ios'>;
  export function arch(): Promise<string>;
  export function version(): Promise<string>;
}

// electron
declare module 'electron' {
  export interface IpcRenderer {
    invoke(channel: string, ...args: unknown[]): Promise<unknown>;
    send(channel: string, ...args: unknown[]): void;
    on(channel: string, listener: (event: unknown, ...args: unknown[]) => void): this;
    once(channel: string, listener: (event: unknown, ...args: unknown[]) => void): this;
    removeListener(channel: string, listener: (event: unknown, ...args: unknown[]) => void): this;
  }

  export const ipcRenderer: IpcRenderer;
}

