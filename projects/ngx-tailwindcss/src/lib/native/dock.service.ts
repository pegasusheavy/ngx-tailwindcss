import { inject, Injectable, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { NativeMenuItem } from './native.types';
import { dynamicImport } from './dynamic-import.util';

@Injectable({
  providedIn: 'root',
})
export class DockService {
  private readonly platformService = inject(NativeAppPlatformService);

  public readonly isSupported = signal(false);

  // Id -> action routing table for Electron dock menu clicks (see convertMenuForElectron)
  private readonly electronMenuActions = new Map<string, () => void>();
  private electronMenuListenerRegistered = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    this.isSupported.set(this.platformService.isTauri() || this.platformService.isElectron());
  }

  /**
   * Set the dock badge (macOS) or taskbar overlay (Windows).
   * No-op on Tauri (warns): Tauri has no dock badge API.
   */
  public async setBadge(text: string): Promise<void> {
    if (this.platformService.isTauri()) {
      // Tauri has no dock badge API; intentional no-op.
      console.warn('Dock badge not directly supported in Tauri, consider using notifications');
    } else if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('set-dock-badge', text);
      } catch (error) {
        console.error('Failed to set Electron dock badge:', error);
      }
    }
  }

  /**
   * Clear the dock badge
   */
  public async clearBadge(): Promise<void> {
    await this.setBadge('');
  }

  /**
   * Set progress on the dock icon (macOS) or taskbar (Windows)
   */
  public async setProgress(progress: number): Promise<void> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        // Progress should be between 0 and 1, or -1 to clear
        const normalizedProgress = progress < 0 ? -1 : Math.min(1, Math.max(0, progress / 100));
        ipcRenderer.send('set-progress', normalizedProgress);
      } catch (error) {
        console.error('Failed to set Electron progress:', error);
      }
    }
    // Tauri doesn't have native progress bar support
  }

  /**
   * Clear progress indicator
   */
  public async clearProgress(): Promise<void> {
    await this.setProgress(-1);
  }

  /**
   * Bounce the dock icon (macOS only)
   */
  public async bounce(type: 'informational' | 'critical' = 'informational'): Promise<number> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        return await ipcRenderer.invoke('dock-bounce', type);
      } catch (error) {
        console.error('Failed to bounce Electron dock:', error);
        return -1;
      }
    }

    return -1;
  }

  /**
   * Cancel a dock bounce (macOS only)
   */
  public async cancelBounce(id: number): Promise<void> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('cancel-dock-bounce', id);
      } catch (error) {
        console.error('Failed to cancel Electron dock bounce:', error);
      }
    }
  }

  /**
   * Set the dock menu (macOS only).
   * Item `action` callbacks are routed by id: the main process must echo the
   * clicked item's id back on the 'dock-menu-click' channel.
   */
  public async setMenu(items: NativeMenuItem[]): Promise<void> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        await this.registerElectronMenuClickListener();
        ipcRenderer.send('set-dock-menu', this.convertMenuForElectron(items));
      } catch (error) {
        console.error('Failed to set Electron dock menu:', error);
      }
    }
  }

  /**
   * Show the dock icon (macOS only - if hidden)
   */
  public async show(): Promise<void> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('show-dock');
      } catch (error) {
        console.error('Failed to show Electron dock:', error);
      }
    }
  }

  /**
   * Hide the dock icon (macOS only)
   */
  public async hide(): Promise<void> {
    if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('hide-dock');
      } catch (error) {
        console.error('Failed to hide Electron dock:', error);
      }
    }
  }

  /**
   * Flash the window in the taskbar (Windows only)
   */
  public async flashFrame(flash: boolean): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const { getCurrentWindow } = await dynamicImport('@tauri-apps/api/window');
        const appWindow = getCurrentWindow();
        await appWindow.requestUserAttention(flash ? 2 : null); // 2 = Informational
      } catch (error) {
        console.error('Failed to flash Tauri window:', error);
      }
    } else if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('flash-frame', flash);
      } catch (error) {
        console.error('Failed to flash Electron frame:', error);
      }
    }
  }

  /**
   * Listen for dock menu clicks echoed back from the Electron main process on
   * the 'dock-menu-click' channel (payload: the clicked item's id) and invoke
   * the matching registered action.
   */
  private async registerElectronMenuClickListener(): Promise<void> {
    if (this.electronMenuListenerRegistered) return;

    try {
      const { ipcRenderer } = await dynamicImport('electron');
      ipcRenderer.on('dock-menu-click', (_event: unknown, id: unknown) => {
        this.electronMenuActions.get(String(id))?.();
      });
      this.electronMenuListenerRegistered = true;
    } catch (error) {
      console.warn('Failed to register dock menu click listener:', error);
    }
  }

  /**
   * Convert menu items to a serializable structure for the Electron main
   * process. Functions cannot cross the IPC boundary, so each item's `action`
   * is registered locally under its id; the main process must echo the
   * clicked item's id back on the 'dock-menu-click' channel for actions to
   * fire (see registerElectronMenuClickListener).
   */
  private convertMenuForElectron(items: NativeMenuItem[], isRoot = true): unknown[] {
    if (isRoot) {
      this.electronMenuActions.clear();
    }

    return items.map(item => {
      if (item.type === 'separator') {
        return { type: 'separator' };
      }

      const electronItem: Record<string, unknown> = {
        id: item.id,
        label: item.label,
        enabled: !item.disabled,
        accelerator: item.shortcut,
        type: item.type === 'checkbox' ? 'checkbox' : item.type === 'radio' ? 'radio' : 'normal',
        checked: item.checked,
      };

      if (item.submenu) {
        electronItem['submenu'] = this.convertMenuForElectron(item.submenu, false);
      }

      if (item.action) {
        this.electronMenuActions.set(item.id, item.action);
      }

      return electronItem;
    });
  }
}
