// Native App UI Components
// Components for Tauri, Electron, and native-feeling web applications

// Phase 1 - Window & Chrome
export * from './title-bar.component';
export * from './window-controls.component';
export * from './menu-bar.component';
export * from './context-menu.component';

// Phase 2 - Navigation
export * from './sidebar.component';
export * from './file-tree.component';
export * from './breadcrumbs.component';
export * from './tab-bar.component';

// Phase 3 - Search & Commands
export * from './command-palette.component';
export * from './search-bar.component';

// Phase 5 - Dialogs
export * from './alert-dialog.component';
export * from './confirm-dialog.component';
export * from './about-dialog.component';

// Phase 6 - Data Display
export * from './terminal.component';
export * from './log-viewer.component';

// Phase 7 - Status & Feedback
export * from './status-bar.component';
export * from './toolbar.component';

// Services
export * from './platform.service';
export * from './storage.service';
export * from './ipc.service';

// Directives
export * from './draggable.directive';
export * from './drop-zone.directive';
export * from './shortcut.directive';

// Types
export * from './native.types';

// Component arrays for easy importing
import { TwTitleBarComponent } from './title-bar.component';
import { TwWindowControlsComponent } from './window-controls.component';
import { TwMenuBarComponent } from './menu-bar.component';
import { TwNativeContextMenuComponent } from './context-menu.component';
import { TwSidebarNavComponent } from './sidebar.component';
import { TwFileTreeComponent } from './file-tree.component';
import { TwBreadcrumbsNavComponent } from './breadcrumbs.component';
import { TwTabBarComponent } from './tab-bar.component';
import { TwCommandPaletteComponent } from './command-palette.component';
import { TwSearchBarComponent } from './search-bar.component';
import { TwAlertDialogComponent } from './alert-dialog.component';
import { TwNativeConfirmDialogComponent } from './confirm-dialog.component';
import { TwAboutDialogComponent } from './about-dialog.component';
import { TwTerminalComponent } from './terminal.component';
import { TwLogViewerComponent } from './log-viewer.component';
import { TwStatusBarComponent } from './status-bar.component';
import { TwToolbarComponent } from './toolbar.component';
import { TwDraggableDirective } from './draggable.directive';
import { TwDropZoneDirective } from './drop-zone.directive';
import { TwShortcutDirective } from './shortcut.directive';

export const TW_NATIVE_COMPONENTS = [
  TwTitleBarComponent,
  TwWindowControlsComponent,
  TwMenuBarComponent,
  TwNativeContextMenuComponent,
  TwSidebarNavComponent,
  TwFileTreeComponent,
  TwBreadcrumbsNavComponent,
  TwTabBarComponent,
  TwCommandPaletteComponent,
  TwSearchBarComponent,
  TwAlertDialogComponent,
  TwNativeConfirmDialogComponent,
  TwAboutDialogComponent,
  TwTerminalComponent,
  TwLogViewerComponent,
  TwStatusBarComponent,
  TwToolbarComponent,
] as const;

export const TW_NATIVE_DIRECTIVES = [
  TwDraggableDirective,
  TwDropZoneDirective,
  TwShortcutDirective,
] as const;

