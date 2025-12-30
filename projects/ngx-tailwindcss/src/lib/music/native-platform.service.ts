import { Injectable, signal, computed } from '@angular/core';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Platform type detection
 */
export type PlatformType = 'browser' | 'tauri' | 'electron';

/**
 * File filter for dialogs
 */
export interface FileFilter {
  name: string;
  extensions: string[];
}

/**
 * Options for open file dialog
 */
export interface OpenFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: FileFilter[];
  multiple?: boolean;
  directory?: boolean;
}

/**
 * Options for save file dialog
 */
export interface SaveFileOptions {
  title?: string;
  defaultPath?: string;
  filters?: FileFilter[];
}

/**
 * File info returned from operations
 */
export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size?: number;
  lastModified?: Date;
}

/**
 * Print options
 */
export interface PrintOptions {
  silent?: boolean;
  printBackground?: boolean;
  deviceName?: string;
  pageSize?: 'A4' | 'Letter' | 'Legal' | 'Tabloid';
  landscape?: boolean;
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  scale?: number;
}

/**
 * Clipboard data types for native platform
 */
export interface NativeClipboardData {
  text?: string;
  html?: string;
  image?: Blob;
}

/**
 * Common file filters for music notation
 */
export const MUSIC_FILE_FILTERS = {
  musicXml: { name: 'MusicXML', extensions: ['musicxml', 'xml', 'mxl'] },
  midi: { name: 'MIDI', extensions: ['mid', 'midi'] },
  abc: { name: 'ABC Notation', extensions: ['abc', 'txt'] },
  pdf: { name: 'PDF Document', extensions: ['pdf'] },
  audio: { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac', 'aac'] },
  image: { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg'] },
  project: { name: 'Score Project', extensions: ['twscore', 'json'] },
  all: { name: 'All Files', extensions: ['*'] },
} as const;

// ============================================================================
// TAURI API TYPES (for type safety without importing @tauri-apps)
// ============================================================================

interface TauriDialog {
  open(options?: unknown): Promise<string | string[] | null>;
  save(options?: unknown): Promise<string | null>;
  message(message: string, options?: unknown): Promise<void>;
  ask(message: string, options?: unknown): Promise<boolean>;
  confirm(message: string, options?: unknown): Promise<boolean>;
}

interface TauriFs {
  readTextFile(path: string): Promise<string>;
  readBinaryFile(path: string): Promise<Uint8Array>;
  writeTextFile(path: string, contents: string): Promise<void>;
  writeBinaryFile(path: string, contents: ArrayBuffer | Uint8Array): Promise<void>;
  exists(path: string): Promise<boolean>;
  createDir(path: string, options?: unknown): Promise<void>;
  removeFile(path: string): Promise<void>;
  removeDir(path: string, options?: unknown): Promise<void>;
  readDir(path: string): Promise<Array<{ name: string; path: string }>>;
}

interface TauriPath {
  appDataDir(): Promise<string>;
  appConfigDir(): Promise<string>;
  documentDir(): Promise<string>;
  downloadDir(): Promise<string>;
  homeDir(): Promise<string>;
  tempDir(): Promise<string>;
  join(...paths: string[]): Promise<string>;
  basename(path: string): Promise<string>;
  dirname(path: string): Promise<string>;
  extname(path: string): Promise<string>;
}

interface TauriClipboard {
  readText(): Promise<string>;
  writeText(text: string): Promise<void>;
}

interface TauriShell {
  open(path: string): Promise<void>;
}

interface TauriWindow {
  setTitle(title: string): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
  close(): Promise<void>;
  minimize(): Promise<void>;
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  isMaximized(): Promise<boolean>;
  setFullscreen(fullscreen: boolean): Promise<void>;
  isFullscreen(): Promise<boolean>;
}

// ============================================================================
// SERVICE
// ============================================================================

/**
 * Service for native platform integration (Tauri/Electron)
 *
 * Provides a unified API for file system access, dialogs, printing, and other
 * native features that works across browser, Tauri, and Electron environments.
 *
 * @example
 * ```typescript
 * // Inject the service
 * const platform = inject(NativePlatformService);
 *
 * // Open a MusicXML file
 * const result = await platform.openFile({
 *   title: 'Open Score',
 *   filters: [MUSIC_FILE_FILTERS.musicXml],
 * });
 *
 * if (result) {
 *   const content = await platform.readTextFile(result.path);
 *   // Parse MusicXML...
 * }
 *
 * // Save a file
 * const savePath = await platform.saveFile({
 *   title: 'Save Score',
 *   defaultPath: 'score.musicxml',
 *   filters: [MUSIC_FILE_FILTERS.musicXml],
 * });
 *
 * if (savePath) {
 *   await platform.writeTextFile(savePath, musicXmlContent);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NativePlatformService {
  private readonly _platform = signal<PlatformType>('browser');
  private readonly _ready = signal(false);

  // Tauri API references (lazy loaded)
  private tauriDialog: TauriDialog | null = null;
  private tauriFs: TauriFs | null = null;
  private tauriPath: TauriPath | null = null;
  private tauriClipboard: TauriClipboard | null = null;
  private tauriShell: TauriShell | null = null;
  private tauriWindow: TauriWindow | null = null;

  // Electron API reference
  private electronApi: Record<string, unknown> | null = null;

  /** Current platform type */
  readonly platform = this._platform.asReadonly();

  /** Whether the service is ready */
  readonly ready = this._ready.asReadonly();

  /** Whether running in a native environment */
  readonly isNative = computed(() => this._platform() !== 'browser');

  /** Whether running in Tauri */
  readonly isTauri = computed(() => this._platform() === 'tauri');

  /** Whether running in Electron */
  readonly isElectron = computed(() => this._platform() === 'electron');

  constructor() {
    this.detectPlatform();
  }

  // =========================================================================
  // PLATFORM DETECTION
  // =========================================================================

  private async detectPlatform(): Promise<void> {
    // Check for Tauri
    if (typeof window !== 'undefined' && '__TAURI__' in window) {
      this._platform.set('tauri');
      await this.initTauri();
      this._ready.set(true);
      return;
    }

    // Check for Electron
    if (typeof window !== 'undefined' && 'electronAPI' in window) {
      this._platform.set('electron');
      this.electronApi = (window as unknown as { electronAPI: Record<string, unknown> }).electronAPI;
      this._ready.set(true);
      return;
    }

    // Browser fallback
    this._platform.set('browser');
    this._ready.set(true);
  }

  private async initTauri(): Promise<void> {
    try {
      // Dynamic import of Tauri APIs
      const tauri = (window as unknown as { __TAURI__: Record<string, unknown> }).__TAURI__;

      if (tauri) {
        this.tauriDialog = tauri['dialog'] as TauriDialog;
        this.tauriFs = tauri['fs'] as TauriFs;
        this.tauriPath = tauri['path'] as TauriPath;
        this.tauriClipboard = tauri['clipboard'] as TauriClipboard;
        this.tauriShell = tauri['shell'] as TauriShell;
        this.tauriWindow = tauri['window'] as TauriWindow;
      }
    } catch (error) {
      console.warn('Failed to initialize Tauri APIs:', error);
    }
  }

  // =========================================================================
  // FILE DIALOGS
  // =========================================================================

  /**
   * Open a file dialog
   * @returns File info or null if cancelled
   */
  async openFile(options: OpenFileOptions = {}): Promise<FileInfo | FileInfo[] | null> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriDialog) {
      return this.openFileTauri(options);
    }

    if (platform === 'electron' && this.electronApi) {
      return this.openFileElectron(options);
    }

    // Browser fallback using input element
    return this.openFileBrowser(options);
  }

  private async openFileTauri(options: OpenFileOptions): Promise<FileInfo | FileInfo[] | null> {
    const result = await this.tauriDialog!.open({
      title: options.title,
      defaultPath: options.defaultPath,
      filters: options.filters?.map(f => ({ name: f.name, extensions: f.extensions })),
      multiple: options.multiple,
      directory: options.directory,
    });

    if (!result) return null;

    if (Array.isArray(result)) {
      return Promise.all(result.map(path => this.getFileInfo(path)));
    }

    return this.getFileInfo(result);
  }

  private async openFileElectron(options: OpenFileOptions): Promise<FileInfo | FileInfo[] | null> {
    const showOpenDialog = this.electronApi!['showOpenDialog'] as (options: unknown) => Promise<{ canceled: boolean; filePaths: string[] }>;

    const result = await showOpenDialog({
      title: options.title,
      defaultPath: options.defaultPath,
      filters: options.filters,
      properties: [
        options.multiple ? 'multiSelections' : undefined,
        options.directory ? 'openDirectory' : 'openFile',
      ].filter(Boolean),
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    if (options.multiple) {
      return Promise.all(result.filePaths.map(path => this.getFileInfo(path)));
    }

    return this.getFileInfo(result.filePaths[0]);
  }

  private openFileBrowser(options: OpenFileOptions): Promise<FileInfo | FileInfo[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiple ?? false;

      if (options.filters && options.filters.length > 0) {
        const extensions = options.filters.flatMap(f => f.extensions.map(e => `.${e}`));
        input.accept = extensions.join(',');
      }

      input.onchange = async () => {
        if (!input.files || input.files.length === 0) {
          resolve(null);
          return;
        }

        const files = Array.from(input.files).map(file => ({
          path: file.name, // Browser doesn't expose full path
          name: file.name,
          extension: file.name.split('.').pop() || '',
          size: file.size,
          lastModified: new Date(file.lastModified),
          _file: file, // Store File object for reading
        }));

        if (options.multiple) {
          resolve(files as FileInfo[]);
        } else {
          resolve(files[0] as FileInfo);
        }
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  /**
   * Open a save file dialog
   * @returns Selected path or null if cancelled
   */
  async saveFile(options: SaveFileOptions = {}): Promise<string | null> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriDialog) {
      return this.tauriDialog.save({
        title: options.title,
        defaultPath: options.defaultPath,
        filters: options.filters?.map(f => ({ name: f.name, extensions: f.extensions })),
      });
    }

    if (platform === 'electron' && this.electronApi) {
      const showSaveDialog = this.electronApi['showSaveDialog'] as (options: unknown) => Promise<{ canceled: boolean; filePath?: string }>;

      const result = await showSaveDialog({
        title: options.title,
        defaultPath: options.defaultPath,
        filters: options.filters,
      });

      return result.canceled ? null : (result.filePath ?? null);
    }

    // Browser fallback - just return the suggested filename
    return options.defaultPath || 'untitled';
  }

  // =========================================================================
  // FILE OPERATIONS
  // =========================================================================

  /**
   * Read a text file
   */
  async readTextFile(path: string): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.readTextFile(path);
    }

    if (platform === 'electron' && this.electronApi) {
      const readFile = this.electronApi['readFile'] as (path: string) => Promise<string>;
      return readFile(path);
    }

    // Browser fallback - path is actually a File object stored during open
    throw new Error('File reading not supported in browser. Use the File API directly.');
  }

  /**
   * Read a binary file
   */
  async readBinaryFile(path: string): Promise<Uint8Array> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.readBinaryFile(path);
    }

    if (platform === 'electron' && this.electronApi) {
      const readFile = this.electronApi['readBinaryFile'] as (path: string) => Promise<Uint8Array>;
      return readFile(path);
    }

    throw new Error('Binary file reading not supported in browser. Use the File API directly.');
  }

  /**
   * Write a text file
   */
  async writeTextFile(path: string, contents: string): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.writeTextFile(path, contents);
    }

    if (platform === 'electron' && this.electronApi) {
      const writeFile = this.electronApi['writeFile'] as (path: string, contents: string) => Promise<void>;
      return writeFile(path, contents);
    }

    // Browser fallback - trigger download
    this.downloadFile(path, contents, 'text/plain');
  }

  /**
   * Write a binary file
   */
  async writeBinaryFile(path: string, contents: ArrayBuffer | Uint8Array): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.writeBinaryFile(path, contents);
    }

    if (platform === 'electron' && this.electronApi) {
      const writeBinaryFile = this.electronApi['writeBinaryFile'] as (path: string, contents: ArrayBuffer | Uint8Array) => Promise<void>;
      return writeBinaryFile(path, contents);
    }

    // Browser fallback - trigger download
    const blob = new Blob([contents as unknown as BlobPart]);
    this.downloadBlob(path, blob);
  }

  /**
   * Check if a file exists
   */
  async fileExists(path: string): Promise<boolean> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.exists(path);
    }

    if (platform === 'electron' && this.electronApi) {
      const exists = this.electronApi['fileExists'] as (path: string) => Promise<boolean>;
      return exists(path);
    }

    return false;
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriFs) {
      return this.tauriFs.removeFile(path);
    }

    if (platform === 'electron' && this.electronApi) {
      const deleteFile = this.electronApi['deleteFile'] as (path: string) => Promise<void>;
      return deleteFile(path);
    }

    throw new Error('File deletion not supported in browser.');
  }

  // =========================================================================
  // PATH UTILITIES
  // =========================================================================

  /**
   * Get the documents directory
   */
  async getDocumentsDir(): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriPath) {
      return this.tauriPath.documentDir();
    }

    if (platform === 'electron' && this.electronApi) {
      const getPath = this.electronApi['getPath'] as (name: string) => Promise<string>;
      return getPath('documents');
    }

    return '';
  }

  /**
   * Get the downloads directory
   */
  async getDownloadsDir(): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriPath) {
      return this.tauriPath.downloadDir();
    }

    if (platform === 'electron' && this.electronApi) {
      const getPath = this.electronApi['getPath'] as (name: string) => Promise<string>;
      return getPath('downloads');
    }

    return '';
  }

  /**
   * Get app data directory
   */
  async getAppDataDir(): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriPath) {
      return this.tauriPath.appDataDir();
    }

    if (platform === 'electron' && this.electronApi) {
      const getPath = this.electronApi['getPath'] as (name: string) => Promise<string>;
      return getPath('userData');
    }

    return '';
  }

  /**
   * Join path segments
   */
  async joinPath(...paths: string[]): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriPath) {
      return this.tauriPath.join(...paths);
    }

    // Simple path join for browser/electron
    return paths.join('/').replace(/\/+/g, '/');
  }

  /**
   * Get file info from path
   */
  async getFileInfo(path: string): Promise<FileInfo> {
    const platform = this._platform();
    let name = path;
    let extension = '';

    if (platform === 'tauri' && this.tauriPath) {
      name = await this.tauriPath.basename(path);
      extension = await this.tauriPath.extname(path);
    } else {
      const parts = path.split(/[/\\]/);
      name = parts[parts.length - 1];
      const extParts = name.split('.');
      extension = extParts.length > 1 ? extParts.pop()! : '';
    }

    return { path, name, extension };
  }

  // =========================================================================
  // CLIPBOARD
  // =========================================================================

  /**
   * Read text from clipboard
   */
  async readClipboardText(): Promise<string> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriClipboard) {
      return this.tauriClipboard.readText();
    }

    if (platform === 'electron' && this.electronApi) {
      const readClipboard = this.electronApi['readClipboardText'] as () => Promise<string>;
      return readClipboard();
    }

    // Browser fallback
    return navigator.clipboard.readText();
  }

  /**
   * Write text to clipboard
   */
  async writeClipboardText(text: string): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriClipboard) {
      return this.tauriClipboard.writeText(text);
    }

    if (platform === 'electron' && this.electronApi) {
      const writeClipboard = this.electronApi['writeClipboardText'] as (text: string) => Promise<void>;
      return writeClipboard(text);
    }

    // Browser fallback
    return navigator.clipboard.writeText(text);
  }

  // =========================================================================
  // PRINTING
  // =========================================================================

  /**
   * Print the current page or element
   */
  async print(options: PrintOptions = {}): Promise<void> {
    const platform = this._platform();

    if (platform === 'electron' && this.electronApi) {
      const print = this.electronApi['print'] as (options: PrintOptions) => Promise<void>;
      return print(options);
    }

    // Browser/Tauri fallback
    window.print();
  }

  /**
   * Export to PDF
   */
  async exportPdf(options: PrintOptions = {}): Promise<Uint8Array | null> {
    const platform = this._platform();

    if (platform === 'electron' && this.electronApi) {
      const printToPdf = this.electronApi['printToPdf'] as (options: PrintOptions) => Promise<Uint8Array>;
      return printToPdf(options);
    }

    // Not supported in browser/Tauri without additional libraries
    console.warn('PDF export requires Electron or a PDF library.');
    return null;
  }

  // =========================================================================
  // SHELL / EXTERNAL
  // =========================================================================

  /**
   * Open a file or URL with the system default application
   */
  async openExternal(path: string): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriShell) {
      return this.tauriShell.open(path);
    }

    if (platform === 'electron' && this.electronApi) {
      const openExternal = this.electronApi['openExternal'] as (path: string) => Promise<void>;
      return openExternal(path);
    }

    // Browser fallback
    window.open(path, '_blank');
  }

  // =========================================================================
  // WINDOW MANAGEMENT
  // =========================================================================

  /**
   * Set window title
   */
  async setWindowTitle(title: string): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriWindow) {
      return this.tauriWindow.setTitle(title);
    }

    if (platform === 'electron' && this.electronApi) {
      const setTitle = this.electronApi['setWindowTitle'] as (title: string) => Promise<void>;
      return setTitle(title);
    }

    // Browser fallback
    document.title = title;
  }

  /**
   * Minimize window
   */
  async minimizeWindow(): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriWindow) {
      return this.tauriWindow.minimize();
    }

    if (platform === 'electron' && this.electronApi) {
      const minimize = this.electronApi['minimizeWindow'] as () => Promise<void>;
      return minimize();
    }
  }

  /**
   * Maximize/unmaximize window
   */
  async toggleMaximize(): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriWindow) {
      const isMaximized = await this.tauriWindow.isMaximized();
      return isMaximized ? this.tauriWindow.unmaximize() : this.tauriWindow.maximize();
    }

    if (platform === 'electron' && this.electronApi) {
      const toggleMaximize = this.electronApi['toggleMaximize'] as () => Promise<void>;
      return toggleMaximize();
    }
  }

  /**
   * Toggle fullscreen
   */
  async toggleFullscreen(): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriWindow) {
      const isFullscreen = await this.tauriWindow.isFullscreen();
      return this.tauriWindow.setFullscreen(!isFullscreen);
    }

    if (platform === 'electron' && this.electronApi) {
      const toggleFullscreen = this.electronApi['toggleFullscreen'] as () => Promise<void>;
      return toggleFullscreen();
    }

    // Browser fallback
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  // =========================================================================
  // DIALOGS
  // =========================================================================

  /**
   * Show a message dialog
   */
  async showMessage(message: string, title: string = 'Message'): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriDialog) {
      return this.tauriDialog.message(message, { title });
    }

    if (platform === 'electron' && this.electronApi) {
      const showMessage = this.electronApi['showMessageBox'] as (options: unknown) => Promise<void>;
      return showMessage({ message, title, type: 'info' });
    }

    // Browser fallback
    alert(message);
  }

  /**
   * Show a confirmation dialog
   */
  async showConfirm(message: string, title: string = 'Confirm'): Promise<boolean> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriDialog) {
      return this.tauriDialog.confirm(message, { title });
    }

    if (platform === 'electron' && this.electronApi) {
      const showConfirm = this.electronApi['showMessageBox'] as (options: unknown) => Promise<{ response: number }>;
      const result = await showConfirm({
        message,
        title,
        type: 'question',
        buttons: ['Cancel', 'OK'],
        defaultId: 1,
      });
      return result.response === 1;
    }

    // Browser fallback
    return confirm(message);
  }

  /**
   * Show an error dialog
   */
  async showError(message: string, title: string = 'Error'): Promise<void> {
    const platform = this._platform();

    if (platform === 'tauri' && this.tauriDialog) {
      return this.tauriDialog.message(message, { title, type: 'error' } as unknown);
    }

    if (platform === 'electron' && this.electronApi) {
      const showError = this.electronApi['showErrorBox'] as (title: string, message: string) => Promise<void>;
      return showError(title, message);
    }

    // Browser fallback
    alert(`${title}: ${message}`);
  }

  // =========================================================================
  // BROWSER FALLBACK HELPERS
  // =========================================================================

  /**
   * Download content as a file (browser fallback)
   */
  private downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(filename, blob);
  }

  /**
   * Download a blob as a file
   */
  downloadBlob(filename: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Read a File object (browser)
   */
  async readFileObject(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * Read a File object as binary (browser)
   */
  async readFileObjectBinary(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}

