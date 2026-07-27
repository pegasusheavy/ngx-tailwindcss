import { inject, Injectable, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { dynamicImport } from './dynamic-import.util';

export interface NativeNotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  sound?: boolean;
  silent?: boolean;
  timeout?: number;
  urgency?: 'low' | 'normal' | 'critical';
}

export interface NativeNotificationAction {
  id: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class NativeNotificationsService {
  private readonly platformService = inject(NativeAppPlatformService);

  public readonly isSupported = signal(false);
  public readonly permissionGranted = signal(false);

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    if (this.platformService.isTauri() || this.platformService.isElectron()) {
      this.isSupported.set(true);
      this.permissionGranted.set(true);
    } else if (typeof Notification !== 'undefined') {
      this.isSupported.set(true);
      this.permissionGranted.set(Notification.permission === 'granted');
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (this.platformService.isTauri()) {
      try {
        const notification = await dynamicImport('@tauri-apps/plugin-notification');
        let granted = await notification.isPermissionGranted();
        if (!granted) {
          const result = await notification.requestPermission();
          granted = result === 'granted';
        }
        this.permissionGranted.set(granted);
        return granted;
      } catch (error) {
        console.error('Failed to request Tauri notification permission:', error);
        return false;
      }
    } else if (this.platformService.isElectron()) {
      this.permissionGranted.set(true);
      return true;
    } else if (typeof Notification !== 'undefined') {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      this.permissionGranted.set(granted);
      return granted;
    }

    return false;
  }

  public async show(options: NativeNotificationOptions): Promise<string | null> {
    if (!this.permissionGranted()) {
      const granted = await this.requestPermission();
      if (!granted) return null;
    }

    if (this.platformService.isTauri()) {
      return this.showTauriNotification(options);
    }
    if (this.platformService.isElectron()) {
      return this.showElectronNotification(options);
    }
    return this.showWebNotification(options);
  }

  public async setBadgeCount(count: number): Promise<void> {
    if (this.platformService.isTauri()) {
      // Badge count not directly available in current Tauri plugin
      console.warn('Badge count not directly supported in Tauri');
    } else if (this.platformService.isElectron()) {
      try {
        const { ipcRenderer } = await dynamicImport('electron');
        ipcRenderer.send('set-badge-count', count);
      } catch (error) {
        console.error('Failed to set Electron badge count:', error);
      }
    } else if ('setAppBadge' in navigator) {
      try {
        await (
          navigator as Navigator & { setAppBadge: (count: number) => Promise<void> }
        ).setAppBadge(count);
      } catch (error) {
        console.error('Failed to set web badge count:', error);
      }
    }
  }

  public async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  private async showTauriNotification(options: NativeNotificationOptions): Promise<string | null> {
    try {
      const notification = await dynamicImport('@tauri-apps/plugin-notification');
      const id = `notification-${Date.now()}`;

      await notification.sendNotification({
        title: options.title,
        body: options.body,
        icon: options.icon,
      });

      return id;
    } catch (error) {
      console.error('Failed to show Tauri notification:', error);
      return null;
    }
  }

  private async showElectronNotification(
    options: NativeNotificationOptions
  ): Promise<string | null> {
    try {
      const { ipcRenderer } = await dynamicImport('electron');
      const id = `notification-${Date.now()}`;

      await ipcRenderer.invoke('show-notification', {
        title: options.title,
        body: options.body,
        icon: options.icon,
        silent: options.silent,
        urgency: options.urgency,
      });

      return id;
    } catch (error) {
      console.error('Failed to show Electron notification:', error);
      return null;
    }
  }

  private showWebNotification(options: NativeNotificationOptions): Promise<string | null> {
    try {
      const id = `notification-${Date.now()}`;

      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        silent: options.silent,
        tag: id,
      });

      if (options.timeout) {
        setTimeout(() => {
          notification.close();
        }, options.timeout);
      }

      return Promise.resolve(id);
    } catch (error) {
      console.error('Failed to show web notification:', error);
      return Promise.resolve(null);
    }
  }
}
