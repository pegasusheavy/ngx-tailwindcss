import { Injectable, inject, signal } from '@angular/core';
import { NativeAppPlatformService } from './platform.service';
import { StorageOptions } from './native.types';

// Type definitions for dynamic imports
interface TauriStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  save(): Promise<void>;
}

interface TauriStoreModule {
  Store: new (path: string) => TauriStore;
}

/**
 * Storage service for persistent data
 * Supports local storage, secure storage, and file-based storage
 */
@Injectable({ providedIn: 'root' })
export class NativeStorageService {
  private readonly platformService = inject(NativeAppPlatformService);

  private readonly _isInitialized = signal(false);
  public readonly isInitialized = this._isInitialized.asReadonly();

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

  public set<T>(key: string, value: T, options?: StorageOptions): void {
    try {
      const data: Record<string, unknown> = { _value: value };

      if (options?.expires) {
        const expiry = typeof options.expires === 'number'
          ? Date.now() + options.expires
          : options.expires.getTime();
        data['_expires'] = expiry;
      }

      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Storage set error:', err);
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

  // Secure storage (using Tauri/Electron APIs when available)
  public async getSecure<T>(key: string): Promise<T | null> {
    if (this.platformService.isTauri()) {
      try {
        const storeModule = await import('@tauri-apps/plugin-store' as string) as TauriStoreModule;
        const store = new storeModule.Store('.secure-store');
        return (await store.get(key)) as T | null;
      } catch (err) {
        console.error('Tauri secure storage error:', err);
        return null;
      }
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await import('electron' as string);
        return electron.ipcRenderer.invoke('secure-storage-get', key);
      } catch (err) {
        console.error('Electron secure storage error:', err);
        return null;
      }
    }

    // Fallback to regular storage with warning
    console.warn('Secure storage not available, using local storage');
    return this.get<T>(key);
  }

  public async setSecure<T>(key: string, value: T): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const storeModule = await import('@tauri-apps/plugin-store' as string) as TauriStoreModule;
        const store = new storeModule.Store('.secure-store');
        await store.set(key, value);
        await store.save();
      } catch (err) {
        console.error('Tauri secure storage error:', err);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await import('electron' as string);
        await electron.ipcRenderer.invoke('secure-storage-set', key, value);
      } catch (err) {
        console.error('Electron secure storage error:', err);
      }
      return;
    }

    // Fallback
    console.warn('Secure storage not available, using local storage');
    this.set(key, value);
  }

  public async removeSecure(key: string): Promise<void> {
    if (this.platformService.isTauri()) {
      try {
        const storeModule = await import('@tauri-apps/plugin-store' as string) as TauriStoreModule;
        const store = new storeModule.Store('.secure-store');
        await store.delete(key);
        await store.save();
      } catch (err) {
        console.error('Tauri secure storage error:', err);
      }
      return;
    }

    if (this.platformService.isElectron()) {
      try {
        const electron = await import('electron' as string);
        await electron.ipcRenderer.invoke('secure-storage-remove', key);
      } catch (err) {
        console.error('Electron secure storage error:', err);
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

  public setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Session storage error:', err);
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

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
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
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('data', 'readonly');
        const store = transaction.objectStore('data');
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          resolve(request.result?.value ?? null);
        };
      });
    } catch (err) {
      console.error('IndexedDB get error:', err);
      return null;
    }
  }

  public async setIndexedDB<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('data', 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.put({ key, value });

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (err) {
      console.error('IndexedDB set error:', err);
    }
  }

  public async removeIndexedDB(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('data', 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (err) {
      console.error('IndexedDB remove error:', err);
    }
  }
}
