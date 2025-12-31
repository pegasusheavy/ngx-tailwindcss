/**
 * Native App UI Component Types
 */

// Platform types
export type Platform = 'macos' | 'windows' | 'linux' | 'web' | 'tauri' | 'electron';
export type PlatformTheme = 'light' | 'dark' | 'system';

// Window types
export interface WindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isFocused: boolean;
}

// Title Bar types
export type TitleBarVariant = 'default' | 'transparent' | 'unified';
export type TitleBarPlatform = 'macos' | 'windows' | 'linux' | 'web' | 'auto' | 'tauri' | 'electron';

// Window Controls types
export type WindowControlsPosition = 'left' | 'right';
export type WindowControlButton = 'close' | 'minimize' | 'maximize' | 'fullscreen';

// Menu types
export interface NativeMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  type?: 'normal' | 'separator' | 'checkbox' | 'radio' | 'submenu';
  submenu?: NativeMenuItem[];
  action?: () => void;
}

export interface NativeMenuBarItem {
  id: string;
  label: string;
  items: NativeMenuItem[];
}

// Context Menu types
export interface NativeContextMenuPosition {
  x: number;
  y: number;
}

export interface NativeContextMenuEvent {
  item: NativeMenuItem;
  originalEvent: MouseEvent;
}

// Sidebar types
export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  children?: SidebarItem[];
  expanded?: boolean;
  active?: boolean;
  disabled?: boolean;
  data?: unknown;
}

export type NativeSidebarVariant = 'default' | 'compact' | 'floating';
export type NativeSidebarPosition = 'left' | 'right';

// File Tree types
export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  children?: FileTreeNode[];
  expanded?: boolean;
  selected?: boolean;
  path?: string;
  size?: number;
  modified?: Date;
  data?: unknown;
}

export interface FileTreeEvent {
  node: FileTreeNode;
  action: 'select' | 'expand' | 'collapse' | 'rename' | 'delete' | 'create';
}

// Tab Bar types
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  closable?: boolean;
  dirty?: boolean;
  pinned?: boolean;
  tooltip?: string;
  data?: unknown;
}

export type TabBarVariant = 'default' | 'pills' | 'underline' | 'boxed';
export type TabBarPosition = 'top' | 'bottom';

export interface TabEvent {
  tab: TabItem;
  index: number;
  action: 'select' | 'close' | 'pin' | 'unpin' | 'reorder';
}

// Command Palette types
export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  keywords?: string[];
  action: () => void | Promise<void>;
}

export interface CommandPaletteMode {
  id: string;
  label: string;
  placeholder: string;
  prefix?: string;
  items: CommandItem[] | (() => CommandItem[] | Promise<CommandItem[]>);
}

// Search Bar types
export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  type?: string;
  data?: unknown;
}

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

// Dialog types
export type AlertDialogType = 'info' | 'success' | 'warning' | 'error';

export interface AlertDialogConfig {
  title: string;
  message: string;
  type?: AlertDialogType;
  confirmLabel?: string;
  showDontAskAgain?: boolean;
}

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  type?: AlertDialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface AboutDialogConfig {
  appName: string;
  appIcon?: string;
  version: string;
  copyright?: string;
  description?: string;
  credits?: string[];
  links?: { label: string; url: string }[];
}

// Terminal types
export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warning';
  timestamp?: Date;
}

export type TerminalVariant = 'default' | 'dark' | 'light' | 'retro';

// Log Viewer types
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  source?: string;
  details?: unknown;
}

export interface LogFilter {
  levels?: LogEntry['level'][];
  source?: string;
  search?: string;
  startTime?: Date;
  endTime?: Date;
}

// Status Bar types
export interface StatusBarItem {
  id: string;
  content: string;
  icon?: string;
  tooltip?: string;
  position: 'left' | 'center' | 'right';
  priority?: number;
  clickable?: boolean;
  action?: () => void;
}

// Toolbar types
export interface ToolbarItem {
  id: string;
  type: 'button' | 'toggle' | 'dropdown' | 'separator' | 'spacer' | 'custom';
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  active?: boolean;
  items?: ToolbarItem[]; // For dropdown
  action?: () => void;
}

export type ToolbarVariant = 'default' | 'compact' | 'large';
export type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right';

// Drag & Drop types
export interface DragData {
  type: string;
  data: unknown;
  source?: string;
}

export interface DropEvent {
  data: DragData;
  position: { x: number; y: number };
  target: HTMLElement;
}

// Keyboard Shortcut types
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

// Storage types
export interface StorageOptions {
  encrypt?: boolean;
  expires?: Date | number;
}

// IPC types
export interface IpcMessage<T = unknown> {
  channel: string;
  payload: T;
  id?: string;
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

