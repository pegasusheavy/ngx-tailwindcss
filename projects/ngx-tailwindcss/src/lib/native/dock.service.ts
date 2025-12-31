import { Injectable, inject, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { Platform, NativeMenuItem } from './native.types';
import { importElectron, importTauriWindow } from './dynamic-import';

const PLATFORM_TAURI: Platform = 'tauri';
const PLATFORM_ELECTRON: Platform = 'electron';

@Injectable({
  providedIn: 'root',
})
export class DockService {
  private readonly platformService = inject(NativeAppPlatformService);

  public readonly isSupported = signal(false);

  constructor() {
    this.checkSupport();
  }

  private async checkSupport(): Promise<void> {
    const platform = this.platformService.platform();
    this.isSupported.set(platform === PLATFORM_TAURI || platform === PLATFORM_ELECTRON);
  }

  /**
   * Set the dock badge (macOS) or taskbar overlay (Windows)
   */
  public async setBadge(text: string): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      try {
        const tauriWindow = await importTauriWindow();
        if (!tauriWindow) return;
        const appWindow = tauriWindow.getCurrentWindow();
        // Tauri doesn't have direct dock badge API, so we append badge to window title
        const currentTitle = await appWindow.title();
        // Remove any existing badge from title (e.g., "App (3)" -> "App")
        const baseTitle = currentTitle.replace(/\s*\(\d+\)\s*$/, '');
        const newTitle = text ? `${baseTitle} (${text})` : baseTitle;
        await appWindow.setTitle(newTitle);
      } catch (error) {
        console.error('Failed to set Tauri dock badge:', error);
      }
    } else if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('set-dock-badge', text);
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
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        // Progress should be between 0 and 1, or -1 to clear
        const normalizedProgress = progress < 0 ? -1 : Math.min(1, Math.max(0, progress / 100));
        electron?.ipcRenderer?.send('set-progress', normalizedProgress);
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
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        if (!electron?.ipcRenderer) return -1;
        return await electron.ipcRenderer.invoke('dock-bounce', type);
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
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('cancel-dock-bounce', id);
      } catch (error) {
        console.error('Failed to cancel Electron dock bounce:', error);
      }
    }
  }

  /**
   * Set the dock menu (macOS only)
   */
  public async setMenu(items: NativeMenuItem[]): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('set-dock-menu', this.convertMenuForElectron(items));
      } catch (error) {
        console.error('Failed to set Electron dock menu:', error);
      }
    }
  }

  /**
   * Show the dock icon (macOS only - if hidden)
   */
  public async show(): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('show-dock');
      } catch (error) {
        console.error('Failed to show Electron dock:', error);
      }
    }
  }

  /**
   * Hide the dock icon (macOS only)
   */
  public async hide(): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('hide-dock');
      } catch (error) {
        console.error('Failed to hide Electron dock:', error);
      }
    }
  }

  /**
   * Flash the window in the taskbar (Windows only)
   */
  public async flashFrame(flash: boolean): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      try {
        const tauriWindow = await importTauriWindow();
        if (!tauriWindow) return;
        const appWindow = tauriWindow.getCurrentWindow();
        await appWindow.requestUserAttention(flash ? 2 : null); // 2 = Informational
      } catch (error) {
        console.error('Failed to flash Tauri window:', error);
      }
    } else if (platform === PLATFORM_ELECTRON) {
      try {
        const electron = await importElectron();
        electron?.ipcRenderer?.send('flash-frame', flash);
      } catch (error) {
        console.error('Failed to flash Electron frame:', error);
      }
    }
  }

  private convertMenuForElectron(items: NativeMenuItem[]): unknown[] {
    return items.map(item => {
      if (item.type === 'separator') {
        return { type: 'separator' };
      }

      const electronItem: Record<string, unknown> = {
        label: item.label,
        enabled: !item.disabled,
        accelerator: item.shortcut,
        type: item.type === 'checkbox' ? 'checkbox' : item.type === 'radio' ? 'radio' : 'normal',
        checked: item.checked,
      };

      if (item.submenu) {
        electronItem['submenu'] = this.convertMenuForElectron(item.submenu);
      }

      if (typeof item.action === 'string') {
        electronItem['click'] = item.action;
      }

      return electronItem;
    });
  }
}
