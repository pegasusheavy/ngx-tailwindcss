import { inject, Injectable, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { StorageOptions } from './native.types';
import { dynamicImport } from './dynamic-import.util';

// Type definitions for dynamic imports
interface TauriStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<boolean>;
  save(): Promise<void>;
}

interface TauriStoreModule {
  // Tauri plugin-store v2 API: stores are obtained via `load()`, not `new Store()`
  load(path: string): Promise<TauriStore>;
}

/**
 * Storage service for persistent data.
 * Supports Web Storage (localStorage/sessionStorage), IndexedDB, and a
 * native-backed persistent store on Tauri/Electron.
 *
 * Note: despite their names, the `*Secure` methods are NOT backed by an OS
 * keychain — see their individual docs for what each platform actually does.
 */
@Injectable({ providedIn: 'root' })
export class NativeStorageService {
  private readonly platformService = inject(NativeAppPlatformService);

  private readonly _isInitialized = signal(false);
  /**
   * True once the Web Storage backends are available (set at construction;
   * stays false during SSR). Native Tauri/Electron stores load lazily on
   * first `*Secure` call.
   */
  public readonly isInitialized = this._isInitialized.asReadonly();

  // Lazily-loaded Tauri store (plugin-store v2 `load` API)
  private tauriStorePromise: Promise<TauriStore> | null = null;

  constructor() {
    this._isInitialized.set(
      typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined'
    );
  }

  // Local storage methods
  public get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;

      const parsed = JSON.parse(item);

      // Check expiration
      if (parsed._expires && Date.now() > parsed._expires) {
        this.remove(key);
        return defaultValue ?? null;
      }

      return parsed._value ?? parsed;
    } catch {
      return defaultValue ?? null;
    }
  }

  public set(key: string, value: unknown, options?: StorageOptions): void {
    try {
      const data: Record<string, unknown> = { _value: value };

      if (options?.expires) {
        const expiry =
          typeof options.expires === 'number'
            ? Date.now() + options.expires
            : options.expires.getTime();
        data['_expires'] = expiry;
      }

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public keys(): string[] {
    return Object.keys(localStorage);
  }

  public has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Persistent app-level storage on Tauri/Electron. NOT OS-keychain-backed;
  // see the individual method docs.
  private async getTauriStore(): Promise<TauriStore> {
    if (!this.tauriStorePromise) {
      this.tauriStorePromise = (async () => {
        const storeModule = (await dynamicImport('@tauri-apps/plugin-store')) as TauriStoreModule;
        return storeModule.load('.secure-store.json');
      })();
      // Allow a retry if loading the store failed
      this.tauriStorePromise.catch(() => {
        this.tauriStorePromise = null;
      });
    }
    return this.tauriStorePromise;
  }

  /**
   * Read a value from the platform's persistent store.
   *
   * Despite the name, this is NOT OS-keychain-backed secure storage:
   * - Tauri: plaintext JSON persisted via `@tauri-apps/plugin-store`
   *   (optional `@tauri-apps/plugin-store` peer dependency required).
   * - Electron: delegated to the host app's `secure-storage-get` IPC handler;
   *   security depends entirely on that implementation.
   * - Web: falls back to plain localStorage with a console warning.
   */
  public async getSecure<T>(key: string): Promise<T | null> {
    if (this.platformService.isTauri()) {
      try {
        const store = await this.getTauriStore();
        return (await store.get(key)) as T | null;
      } catch (error) {
        console.error('Tauri secure storage error:', error);
        return null;
      }
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        return electron.ipcRenderer.invoke('secure-storage-get', key);
      } catch (error) {
        console.error('Electron secure storage error:', error);
        return null;
      }
    }

    // Fallback to regular storage with warning
    console.warn('Secure storage not available, using local storage');
    return this.get<T>(key);
  }

  /**
   * Write a value to the platform's persistent store.
   *
   * Despite the name, the value is NOT stored in an OS keychain: on Tauri it
   * is persisted as plaintext JSON via `@tauri-apps/plugin-store`, on
   * Electron it is delegated to the host app's `secure-storage-set` IPC
   * handler, and on the web it falls back to plain localStorage.
   */
  public async setSecure(key: string, value: unknown): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const store = await this.getTauriStore();
        await store.set(key, value);
        await store.save();
      } catch (error) {
        console.error('Tauri secure storage error:', error);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        await electron.ipcRenderer.invoke('secure-storage-set', key, value);
      } catch (error) {
        console.error('Electron secure storage error:', error);
      }
      return;
    }

    // Fallback
    console.warn('Secure storage not available, using local storage');
    this.set(key, value);
  }

  /**
   * Remove a value from the platform's persistent store (plaintext JSON on
   * Tauri, host-app IPC handler on Electron, localStorage on the web — NOT an
   * OS keychain; see getSecure).
   */
  public async removeSecure(key: string): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const store = await this.getTauriStore();
        await store.delete(key);
        await store.save();
      } catch (error) {
        console.error('Tauri secure storage error:', error);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await dynamicImport('electron');
        await electron.ipcRenderer.invoke('secure-storage-remove', key);
      } catch (error) {
        console.error('Electron secure storage error:', error);
      }
      return;
    }

    this.remove(key);
  }

  // Session storage
  public getSession<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch {
      return defaultValue ?? null;
    }
  }

  public setSession(key: string, value: unknown): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Session storage error:', error);
    }
  }

  public removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clearSession(): void {
    sessionStorage.clear();
  }

  // IndexedDB for larger data
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('app-storage', 1);

      request.addEventListener('error', () => {
        reject(request.error ?? new Error('IndexedDB open failed'));
      });
      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      };
    });

    return this.dbPromise;
  }

  public async getIndexedDB<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction('data', 'readonly');
        const store = transaction.objectStore('data');
        const request = store.get(key);

        request.addEventListener('error', () => {
          reject(request.error ?? new Error('IndexedDB get failed'));
        });
        request.onsuccess = () => {
          resolve(request.result?.value ?? null);
        };
      });
    } catch (error) {
      console.error('IndexedDB get error:', error);
      return null;
    }
  }

  public async setIndexedDB(key: string, value: unknown): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction('data', 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.put({ key, value });

        request.addEventListener('error', () => {
          reject(request.error ?? new Error('IndexedDB set failed'));
        });
        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('IndexedDB set error:', error);
    }
  }

  public async removeIndexedDB(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction('data', 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.delete(key);

        request.addEventListener('error', () => {
          reject(request.error ?? new Error('IndexedDB remove failed'));
        });
        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('IndexedDB remove error:', error);
    }
  }
}
