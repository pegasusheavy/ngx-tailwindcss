import { Injectable, signal, computed } from '@angular/core';
import { Platform, PlatformTheme, WindowState } from './native.types';

// Type definitions for dynamic imports (Tauri/Electron may not be present)
interface TauriWindow {
  minimize(): Promise<void>;
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  isMaximized(): Promise<boolean>;
  close(): Promise<void>;
  setFullscreen(fullscreen: boolean): Promise<void>;
  isFullscreen(): Promise<boolean>;
  setTitle(title: string): Promise<void>;
}

/**
 * Service for detecting and interacting with the native platform
 * Supports Tauri, Electron, and web browsers
 */
@Injectable({ providedIn: 'root' })
export class NativeAppPlatformService {
  // Platform detection
  private readonly _platform = signal<Platform>(this.detectPlatform());
  private readonly _isTauri = signal(this.checkTauri());
  private readonly _isElectron = signal(this.checkElectron());
  private readonly _theme = signal<PlatformTheme>('system');

  // Window state
  private readonly _windowState = signal<WindowState>({
    isMaximized: false,
    isMinimized: false,
    isFullscreen: false,
    isFocused: true,
  });

  // Public signals
  public readonly platform = this._platform.asReadonly();
  public readonly isTauri = this._isTauri.asReadonly();
  public readonly isElectron = this._isElectron.asReadonly();
  public readonly isNative = computed(() => this._isTauri() || this._isElectron());
  public readonly isWeb = computed(() => !this.isNative());
  public readonly theme = this._theme.asReadonly();
  public readonly windowState = this._windowState.asReadonly();

  public readonly isDarkMode = computed(() => {
    if (this._theme() === 'system') {
      return typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    }
    return this._theme() === 'dark';
  });

  constructor() {
    this.initThemeListener();
    this.initWindowStateListener();
  }

  private detectPlatform(): Platform {
    if (typeof window === 'undefined') return 'web';

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('linux')) return 'linux';

    return 'web';
  }

  private checkTauri(): boolean {
    return typeof window !== 'undefined' && '__TAURI__' in window;
  }

  private checkElectron(): boolean {
    return typeof window !== 'undefined' &&
      typeof (window as Window & { process?: { type?: string } }).process?.type === 'string';
  }

  private initThemeListener(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      // Trigger re-computation of isDarkMode
      this._theme.update(t => t);
    });
  }

  private initWindowStateListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('focus', () => {
      this._windowState.update(s => ({ ...s, isFocused: true }));
    });

    window.addEventListener('blur', () => {
      this._windowState.update(s => ({ ...s, isFocused: false }));
    });

    // Fullscreen detection
    document.addEventListener('fullscreenchange', () => {
      this._windowState.update(s => ({
        ...s,
        isFullscreen: !!document.fullscreenElement,
      }));
    });
  }

  // Theme methods
  public setTheme(theme: PlatformTheme): void {
    this._theme.set(theme);
  }

  // Window control methods
  public async minimize(): Promise<void> {
    if (this._isTauri()) {
      try {
        const tauriWindow = await import('@tauri-apps/api/window' as string);
        const win = tauriWindow.getCurrentWindow() as TauriWindow;
        await win.minimize();
      } catch (e) {
        console.warn('Tauri minimize failed:', e);
      }
    } else if (this._isElectron()) {
      try {
        const electron = await import('electron' as string);
        electron.ipcRenderer.send('window-minimize');
      } catch (e) {
        console.warn('Electron minimize failed:', e);
      }
    }
    this._windowState.update(s => ({ ...s, isMinimized: true }));
  }

  public async maximize(): Promise<void> {
    if (this._isTauri()) {
      try {
        const tauriWindow = await import('@tauri-apps/api/window' as string);
        const win = tauriWindow.getCurrentWindow() as TauriWindow;
        if (await win.isMaximized()) {
          await win.unmaximize();
          this._windowState.update(s => ({ ...s, isMaximized: false }));
        } else {
          await win.maximize();
          this._windowState.update(s => ({ ...s, isMaximized: true }));
        }
      } catch (e) {
        console.warn('Tauri maximize failed:', e);
      }
    } else if (this._isElectron()) {
      try {
        const electron = await import('electron' as string);
        electron.ipcRenderer.send('window-maximize');
      } catch (e) {
        console.warn('Electron maximize failed:', e);
      }
    }
  }

  public async close(): Promise<void> {
    if (this._isTauri()) {
      try {
        const tauriWindow = await import('@tauri-apps/api/window' as string);
        const win = tauriWindow.getCurrentWindow() as TauriWindow;
        await win.close();
      } catch (e) {
        console.warn('Tauri close failed:', e);
      }
    } else if (this._isElectron()) {
      try {
        const electron = await import('electron' as string);
        electron.ipcRenderer.send('window-close');
      } catch (e) {
        console.warn('Electron close failed:', e);
      }
    } else {
      window.close();
    }
  }

  public async toggleFullscreen(): Promise<void> {
    if (this._isTauri()) {
      try {
        const tauriWindow = await import('@tauri-apps/api/window' as string);
        const win = tauriWindow.getCurrentWindow() as TauriWindow;
        if (await win.isFullscreen()) {
          await win.setFullscreen(false);
        } else {
          await win.setFullscreen(true);
        }
      } catch (e) {
        console.warn('Tauri fullscreen failed:', e);
      }
    } else if (this._isElectron()) {
      try {
        const electron = await import('electron' as string);
        electron.ipcRenderer.send('window-fullscreen');
      } catch (e) {
        console.warn('Electron fullscreen failed:', e);
      }
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    }
  }

  public async setTitle(title: string): Promise<void> {
    if (this._isTauri()) {
      try {
        const tauriWindow = await import('@tauri-apps/api/window' as string);
        const win = tauriWindow.getCurrentWindow() as TauriWindow;
        await win.setTitle(title);
      } catch (e) {
        console.warn('Tauri setTitle failed:', e);
      }
    } else if (this._isElectron()) {
      try {
        const electron = await import('electron' as string);
        electron.ipcRenderer.send('window-set-title', title);
      } catch (e) {
        console.warn('Electron setTitle failed:', e);
      }
    } else {
      document.title = title;
    }
  }

  // Utility methods
  public getModifierKey(): string {
    return this._platform() === 'macos' ? '⌘' : 'Ctrl';
  }

  public getAltKey(): string {
    return this._platform() === 'macos' ? '⌥' : 'Alt';
  }

  public formatShortcut(shortcut: string): string {
    const platform = this._platform();

    if (platform === 'macos') {
      return shortcut
        .replace(/Ctrl/gi, '⌘')
        .replace(/Alt/gi, '⌥')
        .replace(/Shift/gi, '⇧')
        .replace(/\+/g, '');
    }

    return shortcut;
  }
}
