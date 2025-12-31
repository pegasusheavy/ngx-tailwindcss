import { Injectable, inject, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { Platform } from './native.types';
import { Observable, Subject } from 'rxjs';

const PLATFORM_TAURI: Platform = 'tauri';
const PLATFORM_ELECTRON: Platform = 'electron';

export interface UpdateInfo {
  currentVersion: string;
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
  downloadUrl?: string;
}

export interface UpdateProgress {
  percent: number;
  bytesDownloaded: number;
  bytesTotal: number;
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly platformService = inject(NativeAppPlatformService);

  public readonly status = signal<UpdateStatus>('idle');
  public readonly updateInfo = signal<UpdateInfo | null>(null);
  public readonly progress = signal<UpdateProgress | null>(null);
  public readonly error = signal<string | null>(null);
  public readonly isSupported = signal(false);

  private readonly updateAvailable$ = new Subject<UpdateInfo>();
  private readonly downloadProgress$ = new Subject<UpdateProgress>();
  private readonly updateDownloaded$ = new Subject<void>();
  private readonly updateError$ = new Subject<string>();

  constructor() {
    this.checkSupport();
    this.setupListeners();
  }

  private async checkSupport(): Promise<void> {
    const platform = this.platformService.platform();
    this.isSupported.set(platform === PLATFORM_TAURI || platform === PLATFORM_ELECTRON);
  }

  private async setupListeners(): Promise<void> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_ELECTRON) {
      await this.setupElectronListeners();
    }
  }

  public get onUpdateAvailable(): Observable<UpdateInfo> {
    return this.updateAvailable$.asObservable();
  }

  public get onDownloadProgress(): Observable<UpdateProgress> {
    return this.downloadProgress$.asObservable();
  }

  public get onUpdateDownloaded(): Observable<void> {
    return this.updateDownloaded$.asObservable();
  }

  public get onError(): Observable<string> {
    return this.updateError$.asObservable();
  }

  public async checkForUpdates(): Promise<UpdateInfo | null> {
    const platform = this.platformService.platform();
    this.status.set('checking');
    this.error.set(null);

    try {
      if (platform === PLATFORM_TAURI) {
        return await this.checkTauriUpdates();
      } else if (platform === PLATFORM_ELECTRON) {
        return await this.checkElectronUpdates();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check for updates';
      this.status.set('error');
      this.error.set(errorMessage);
      this.updateError$.next(errorMessage);
    }

    return null;
  }

  public async downloadUpdate(): Promise<void> {
    const platform = this.platformService.platform();
    this.status.set('downloading');
    this.progress.set({ percent: 0, bytesDownloaded: 0, bytesTotal: 0 });

    try {
      if (platform === PLATFORM_TAURI) {
        await this.downloadTauriUpdate();
      } else if (platform === PLATFORM_ELECTRON) {
        await this.downloadElectronUpdate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download update';
      this.status.set('error');
      this.error.set(errorMessage);
      this.updateError$.next(errorMessage);
    }
  }

  public async installUpdate(): Promise<void> {
    const platform = this.platformService.platform();

    try {
      if (platform === PLATFORM_TAURI) {
        await this.installTauriUpdate();
      } else if (platform === PLATFORM_ELECTRON) {
        await this.installElectronUpdate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to install update';
      this.status.set('error');
      this.error.set(errorMessage);
      this.updateError$.next(errorMessage);
    }
  }

  private async setupElectronListeners(): Promise<void> {
    try {
      const { ipcRenderer } = await import('electron');

      ipcRenderer.on('update-available', (_event: unknown, info: UpdateInfo) => {
        this.status.set('available');
        this.updateInfo.set(info);
        this.updateAvailable$.next(info);
      });

      ipcRenderer.on('update-not-available', () => {
        this.status.set('not-available');
      });

      ipcRenderer.on('download-progress', (_event: unknown, progress: UpdateProgress) => {
        this.progress.set(progress);
        this.downloadProgress$.next(progress);
      });

      ipcRenderer.on('update-downloaded', () => {
        this.status.set('downloaded');
        this.updateDownloaded$.next();
      });

      ipcRenderer.on('update-error', (_event: unknown, error: string) => {
        this.status.set('error');
        this.error.set(error);
        this.updateError$.next(error);
      });
    } catch (error) {
      console.error('Failed to setup Electron updater listeners:', error);
    }
  }

  private async checkTauriUpdates(): Promise<UpdateInfo | null> {
    const updater = await import('@tauri-apps/plugin-updater');
    const app = await import('@tauri-apps/api/app');

    const currentVersion = await app.getVersion();
    const update = await updater.check();

    if (update?.available) {
      const info: UpdateInfo = {
        currentVersion,
        version: update.version,
        releaseDate: update.date || undefined,
        releaseNotes: update.body || undefined,
      };
      this.status.set('available');
      this.updateInfo.set(info);
      this.updateAvailable$.next(info);
      return info;
    }

    this.status.set('not-available');
    return null;
  }

  private async checkElectronUpdates(): Promise<UpdateInfo | null> {
    const { ipcRenderer } = await import('electron');
    const result = await ipcRenderer.invoke('check-for-updates') as { updateAvailable?: boolean; currentVersion?: string; version?: string; releaseDate?: string; releaseNotes?: string } | null;

    if (result?.updateAvailable) {
      const info: UpdateInfo = {
        currentVersion: result.currentVersion || '',
        version: result.version || '',
        releaseDate: result.releaseDate,
        releaseNotes: result.releaseNotes,
      };
      this.status.set('available');
      this.updateInfo.set(info);
      this.updateAvailable$.next(info);
      return info;
    }

    this.status.set('not-available');
    return null;
  }

  private async downloadTauriUpdate(): Promise<void> {
    const updater = await import('@tauri-apps/plugin-updater');
    const update = await updater.check();

    if (update?.available) {
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          const total = event.data?.contentLength || 0;
          this.progress.set({ percent: 0, bytesDownloaded: 0, bytesTotal: total });
        } else if (event.event === 'Progress') {
          const current = this.progress();
          if (current) {
            const downloaded = current.bytesDownloaded + (event.data?.chunkLength || 0);
            const percent = current.bytesTotal > 0 ? (downloaded / current.bytesTotal) * 100 : 0;
            const newProgress = { percent, bytesDownloaded: downloaded, bytesTotal: current.bytesTotal };
            this.progress.set(newProgress);
            this.downloadProgress$.next(newProgress);
          }
        } else if (event.event === 'Finished') {
          this.status.set('downloaded');
          this.updateDownloaded$.next();
        }
      });
    }
  }

  private async downloadElectronUpdate(): Promise<void> {
    const { ipcRenderer } = await import('electron');
    ipcRenderer.send('download-update');
  }

  private async installTauriUpdate(): Promise<void> {
    const process = await import('@tauri-apps/plugin-process');
    await process.relaunch();
  }

  private async installElectronUpdate(): Promise<void> {
    const { ipcRenderer } = await import('electron');
    ipcRenderer.send('quit-and-install');
  }
}
