import { Injectable, inject, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { Platform, NativeMenuItem } from './native.types';

const PLATFORM_TAURI: Platform = 'tauri';
const PLATFORM_ELECTRON: Platform = 'electron';

export interface TrayConfig {
  icon: string;
  tooltip?: string;
  title?: string;
  menu?: NativeMenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class SystemTrayService {
  private readonly platformService = inject(NativeAppPlatformService);

  public readonly isSupported = signal(false);
  public readonly isVisible = signal(false);

  private trayInstance: unknown = null;

  constructor() {
    this.checkSupport();
  }

  private async checkSupport(): Promise<void> {
    const platform = this.platformService.platform();
    this.isSupported.set(platform === PLATFORM_TAURI || platform === PLATFORM_ELECTRON);
  }

  public async create(config: TrayConfig): Promise<boolean> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      return this.createTauriTray(config);
    } else if (platform === PLATFORM_ELECTRON) {
      return this.createElectronTray(config);
    }

    console.warn('System tray is not supported on this platform');
    return false;
  }

  public async setIcon(icon: string): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI && this.trayInstance) {
      const tray = this.trayInstance as { setIcon: (icon: string) => Promise<void> };
      await tray.setIcon(icon);
    } else if (platform === PLATFORM_ELECTRON) {
      const { ipcRenderer } = await import('electron');
      ipcRenderer.send('tray-set-icon', icon);
    }
  }

  public async setTooltip(tooltip: string): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI && this.trayInstance) {
      const tray = this.trayInstance as { setTooltip: (tooltip: string) => Promise<void> };
      await tray.setTooltip(tooltip);
    } else if (platform === PLATFORM_ELECTRON) {
      const { ipcRenderer } = await import('electron');
      ipcRenderer.send('tray-set-tooltip', tooltip);
    }
  }

  public async setMenu(menu: NativeMenuItem[]): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      await this.setTauriMenu(menu);
    } else if (platform === PLATFORM_ELECTRON) {
      const { ipcRenderer } = await import('electron');
      ipcRenderer.send('tray-set-menu', this.convertMenuForElectron(menu));
    }
  }

  public async destroy(): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI && this.trayInstance) {
      this.trayInstance = null;
    } else if (platform === PLATFORM_ELECTRON) {
      const { ipcRenderer } = await import('electron');
      ipcRenderer.send('tray-destroy');
    }

    this.isVisible.set(false);
  }

  private async createTauriTray(config: TrayConfig): Promise<boolean> {
    try {
      const tauriTray = await import('@tauri-apps/api/tray');

      this.trayInstance = await tauriTray.TrayIcon.new({
        icon: config.icon,
        tooltip: config.tooltip,
        title: config.title,
      });

      if (config.menu) {
        await this.setTauriMenu(config.menu);
      }

      this.isVisible.set(true);
      return true;
    } catch (error) {
      console.error('Failed to create Tauri tray:', error);
      return false;
    }
  }

  private async createElectronTray(config: TrayConfig): Promise<boolean> {
    try {
      const { ipcRenderer } = await import('electron');

      await ipcRenderer.invoke('tray-create', {
        icon: config.icon,
        tooltip: config.tooltip,
        menu: config.menu ? this.convertMenuForElectron(config.menu) : undefined,
      });

      this.isVisible.set(true);
      return true;
    } catch (error) {
      console.error('Failed to create Electron tray:', error);
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async buildTauriMenu(items: NativeMenuItem[]): Promise<any> {
    const tauriMenu = await import('@tauri-apps/api/menu');
    const { Menu, MenuItem, Submenu } = tauriMenu;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menuItems: any[] = [];

    for (const item of items) {
      if (item.type === 'separator') {
        menuItems.push(await MenuItem.new({ id: 'separator', text: '-', enabled: false }));
      } else if (item.submenu) {
        const submenuItems = await this.buildTauriMenu(item.submenu);
        menuItems.push(await Submenu.new({
          id: item.id,
          text: item.label,
          items: submenuItems.items,
        }));
      } else {
        menuItems.push(await MenuItem.new({
          id: item.id,
          text: item.label,
          enabled: !item.disabled,
          accelerator: item.shortcut,
          action: item.action,
        }));
      }
    }

    return Menu.new({ items: menuItems });
  }

  private async setTauriMenu(items: NativeMenuItem[]): Promise<void> {
    if (!this.trayInstance) return;

    const menu = await this.buildTauriMenu(items);
    const tray = this.trayInstance as { setMenu: (menu: unknown) => Promise<void> };
    await tray.setMenu(menu);
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

      return electronItem;
    });
  }
}
