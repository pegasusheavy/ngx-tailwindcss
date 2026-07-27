import { inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { IpcResponse } from './native.types';
import { dynamicImport } from './dynamic-import.util';

type IpcCallback<T> = (data: T) => void;

// Type definitions for dynamic imports
interface TauriEvent<T> {
  payload: T;
}

interface TauriEventModule {
  emit(event: string, payload?: unknown): Promise<void>;
  listen<T>(event: string, handler: (event: TauriEvent<T>) => void): Promise<() => void>;
  once<T>(event: string, handler: (event: TauriEvent<T>) => void): Promise<void>;
}

interface TauriCoreModule {
  invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
}

/**
 * IPC (Inter-Process Communication) service
 * Handles communication between renderer and main process in Tauri/Electron
 */
@Injectable({ providedIn: 'root' })
export class NativeIpcService implements OnDestroy {
  private readonly platformService = inject(NativeAppPlatformService);
  private readonly ngZone = inject(NgZone);

  // Per-channel map of callback -> platform unlisten fn, so off() can tear
  // down the underlying Tauri/Electron/window listener, not just bookkeeping.
  private readonly listeners = new Map<string, Map<IpcCallback<unknown>, () => void>>();

  // Connection state
  private readonly _isConnected = signal(false);
  public readonly isConnected = this._isConnected.asReadonly();

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.platformService.isTauri()) {
      this._isConnected.set(true);
    } else if (this.platformService.isElectron()) {
      this._isConnected.set(true);
    }
  }

  /**
   * Invoke a command in the main process and get a response
   */
  public async invoke<R = unknown>(command: string, payload?: unknown): Promise<IpcResponse<R>> {
    if (this.platformService.isTauri()) {
      try {
        const tauriCore = (await dynamicImport('@tauri-apps/api/core')) as TauriCoreModule;
        const data = await tauriCore.invoke<R>(command, payload as Record<string, unknown>);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        const data = await electron.ipcRenderer.invoke(command, payload);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }

    return { success: false, error: 'IPC not available in browser' };
  }

  /**
   * Send a message to the main process (fire and forget)
   */
  public async send(channel: string, payload?: unknown): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const tauriEvent = (await dynamicImport('@tauri-apps/api/event')) as TauriEventModule;
        await tauriEvent.emit(channel, payload);
      } catch (error) {
        console.warn('Tauri emit failed:', error);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        electron.ipcRenderer.send(channel, payload);
      } catch (error) {
        console.warn('Electron send failed:', error);
      }
      return;
    }

    console.warn('IPC send not available in browser');
  }

  /**
   * Listen for messages from the main process.
   * Returns an unlisten function that removes both the platform listener and
   * the service's bookkeeping (equivalent to `off(channel, callback)`).
   */
  public async on<T>(channel: string, callback: IpcCallback<T>): Promise<() => void> {
    let unlisten: (() => void) | null = null;

    // Platform-specific setup
    if (this.platformService.isTauri()) {
      try {
        const tauriEvent = (await dynamicImport('@tauri-apps/api/event')) as TauriEventModule;
        unlisten = await tauriEvent.listen<T>(channel, (event: TauriEvent<T>) => {
          this.ngZone.run(() => {
            callback(event.payload);
          });
        });
      } catch (error) {
        console.warn('Tauri listen failed:', error);
      }
    }

    if (!unlisten && this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        const handler = (_event: unknown, data: T) => {
          this.ngZone.run(() => {
            callback(data);
          });
        };
        electron.ipcRenderer.on(channel, handler);
        unlisten = () => electron.ipcRenderer.removeListener(channel, handler);
      } catch (error) {
        console.warn('Electron on failed:', error);
      }
    }

    if (!unlisten) {
      // Browser fallback - use custom events
      const handler = (event: Event) => {
        this.ngZone.run(() => {
          callback((event as CustomEvent<T>).detail);
        });
      };
      window.addEventListener(channel, handler);
      unlisten = () => {
        window.removeEventListener(channel, handler);
      };
    }

    // Store listener alongside its platform teardown fn
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Map());
    }
    this.listeners.get(channel)!.set(callback as IpcCallback<unknown>, unlisten);

    return () => {
      this.off(channel, callback as IpcCallback<unknown>);
    };
  }

  /**
   * Listen for a message once
   */
  public async once<T>(channel: string, callback: IpcCallback<T>): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const tauriEvent = (await dynamicImport('@tauri-apps/api/event')) as TauriEventModule;
        await tauriEvent.once<T>(channel, (event: TauriEvent<T>) => {
          this.ngZone.run(() => {
            callback(event.payload);
          });
        });
      } catch (error) {
        console.warn('Tauri once failed:', error);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        electron.ipcRenderer.once(channel, (_event: unknown, data: T) => {
          this.ngZone.run(() => {
            callback(data);
          });
        });
      } catch (error) {
        console.warn('Electron once failed:', error);
      }
      return;
    }

    // Browser fallback
    const handler = (event: Event) => {
      this.ngZone.run(() => {
        callback((event as CustomEvent<T>).detail);
      });
    };
    window.addEventListener(channel, handler, { once: true });
  }

  /**
   * Remove listener(s) for a channel, tearing down the underlying platform
   * listener so callbacks stop firing. Omit `callback` to remove all
   * listeners registered for the channel.
   */
  public off(channel: string, callback?: IpcCallback<unknown>): void {
    const channelListeners = this.listeners.get(channel);
    if (!channelListeners) return;

    if (callback) {
      const unlisten = channelListeners.get(callback);
      if (unlisten) {
        unlisten();
        channelListeners.delete(callback);
      }
      if (channelListeners.size === 0) {
        this.listeners.delete(channel);
      }
    } else {
      channelListeners.forEach(unlisten => {
        unlisten();
      });
      this.listeners.delete(channel);
    }
  }

  /**
   * Emit a custom event (works in all environments)
   */
  public emit(channel: string, payload?: unknown): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(channel, { detail: payload }));
    }
  }

  /**
   * Clean up all listeners
   */
  public destroy(): void {
    this.listeners.forEach(channelListeners => {
      channelListeners.forEach(unlisten => {
        unlisten();
      });
    });
    this.listeners.clear();
  }

  public ngOnDestroy(): void {
    this.destroy();
  }
}
