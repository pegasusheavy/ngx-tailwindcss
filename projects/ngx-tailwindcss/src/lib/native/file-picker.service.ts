import { Injectable, inject } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { Platform } from './native.types';

const PLATFORM_TAURI: Platform = 'tauri';
const PLATFORM_ELECTRON: Platform = 'electron';

export interface NativeFileFilter {
  name: string;
  extensions: string[];
}

export interface NativeOpenFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: NativeFileFilter[];
  multiple?: boolean;
  directory?: boolean;
}

export interface NativeSaveFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: NativeFileFilter[];
}

export interface FilePickerResult {
  path: string;
  name: string;
  size?: number;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilePickerService {
  private readonly platformService = inject(NativeAppPlatformService);

  public async openFile(options: NativeOpenFileOptions = {}): Promise<FilePickerResult[] | null> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      return this.openFileTauri(options);
    } else if (platform === PLATFORM_ELECTRON) {
      return this.openFileElectron(options);
    } else {
      return this.openFileWeb(options);
    }
  }

  public async saveFile(options: NativeSaveFileOptions = {}): Promise<string | null> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      return this.saveFileTauri(options);
    } else if (platform === PLATFORM_ELECTRON) {
      return this.saveFileElectron(options);
    } else {
      return this.saveFileWeb(options);
    }
  }

  public async selectDirectory(options: NativeOpenFileOptions = {}): Promise<string | null> {
    const platform = this.platformService.platform();

    if (platform === PLATFORM_TAURI) {
      return this.selectDirectoryTauri(options);
    } else if (platform === PLATFORM_ELECTRON) {
      return this.selectDirectoryElectron(options);
    } else {
      return this.selectDirectoryWeb();
    }
  }

  private async openFileTauri(options: NativeOpenFileOptions): Promise<FilePickerResult[] | null> {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');

      const filters = options.filters?.map(f => ({
        name: f.name,
        extensions: f.extensions,
      }));

      const result = await open({
        title: options.title,
        defaultPath: options.defaultPath,
        filters,
        multiple: options.multiple,
        directory: options.directory,
      });

      if (!result) return null;

      const paths = Array.isArray(result) ? result : [result];
      return paths.map(path => ({
        path: typeof path === 'string' ? path : path.path,
        name: typeof path === 'string' ? path.split('/').pop() || path : path.name || path.path.split('/').pop() || '',
      }));
    } catch (error) {
      console.error('Tauri file picker error:', error);
      return null;
    }
  }

  private async openFileElectron(options: NativeOpenFileOptions): Promise<FilePickerResult[] | null> {
    try {
      const { ipcRenderer } = await import('electron');

      const result = await ipcRenderer.invoke('show-open-dialog', {
        title: options.title,
        defaultPath: options.defaultPath,
        properties: [
          options.directory ? 'openDirectory' : 'openFile',
          options.multiple ? 'multiSelections' : undefined,
        ].filter(Boolean),
        filters: options.filters?.map(f => ({
          name: f.name,
          extensions: f.extensions,
        })),
      });

      if (result.canceled || !result.filePaths.length) return null;

      return result.filePaths.map((path: string) => ({
        path,
        name: path.split(/[/\\]/).pop() || path,
      }));
    } catch (error) {
      console.error('Electron file picker error:', error);
      return null;
    }
  }

  private async openFileWeb(options: NativeOpenFileOptions): Promise<FilePickerResult[] | null> {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiple || false;

      if (options.directory) {
        input.setAttribute('webkitdirectory', '');
      }

      if (options.filters?.length) {
        const accept = options.filters
          .flatMap(f => f.extensions.map(ext => `.${ext}`))
          .join(',');
        input.accept = accept;
      }

      input.onchange = () => {
        const files = input.files;
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }

        const results: FilePickerResult[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          results.push({
            path: (file as File & { path?: string }).path || file.name,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
        resolve(results);
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  private async saveFileTauri(options: NativeSaveFileOptions): Promise<string | null> {
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');

      const filters = options.filters?.map(f => ({
        name: f.name,
        extensions: f.extensions,
      }));

      const result = await save({
        title: options.title,
        defaultPath: options.defaultPath,
        filters,
      });

      return result || null;
    } catch (error) {
      console.error('Tauri save dialog error:', error);
      return null;
    }
  }

  private async saveFileElectron(options: NativeSaveFileOptions): Promise<string | null> {
    try {
      const { ipcRenderer } = await import('electron');

      const result = await ipcRenderer.invoke('show-save-dialog', {
        title: options.title,
        defaultPath: options.defaultPath,
        filters: options.filters?.map(f => ({
          name: f.name,
          extensions: f.extensions,
        })),
      });

      if (result.canceled) return null;
      return result.filePath || null;
    } catch (error) {
      console.error('Electron save dialog error:', error);
      return null;
    }
  }

  private async saveFileWeb(options: NativeSaveFileOptions): Promise<string | null> {
    // Web doesn't have a native save dialog, return default name
    const defaultName = options.defaultPath?.split(/[/\\]/).pop() || 'untitled';
    return defaultName;
  }

  private async selectDirectoryTauri(options: NativeOpenFileOptions): Promise<string | null> {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');

      const result = await open({
        title: options.title,
        defaultPath: options.defaultPath,
        directory: true,
      });

      if (!result) return null;
      return typeof result === 'string' ? result : (result as { path: string }).path;
    } catch (error) {
      console.error('Tauri directory picker error:', error);
      return null;
    }
  }

  private async selectDirectoryElectron(options: NativeOpenFileOptions): Promise<string | null> {
    try {
      const { ipcRenderer } = await import('electron');

      const result = await ipcRenderer.invoke('show-open-dialog', {
        title: options.title,
        defaultPath: options.defaultPath,
        properties: ['openDirectory'],
      });

      if (result.canceled || !result.filePaths.length) return null;
      return result.filePaths[0];
    } catch (error) {
      console.error('Electron directory picker error:', error);
      return null;
    }
  }

  private async selectDirectoryWeb(): Promise<string | null> {
    // Use the File System Access API if available
    if ('showDirectoryPicker' in window) {
      try {
        const handle = await (window as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
        return handle.name;
      } catch (error) {
        // User cancelled or API not supported
        return null;
      }
    }

    // Fallback: use file input with directory attribute
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('webkitdirectory', '');

      input.onchange = () => {
        const files = input.files;
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }
        // Get directory path from first file
        const path = (files[0] as File & { webkitRelativePath?: string }).webkitRelativePath;
        const dirName = path?.split('/')[0] || null;
        resolve(dirName);
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }
}

