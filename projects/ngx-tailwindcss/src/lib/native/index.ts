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
export * from './quick-switcher.component';

// Phase 4 - Settings & Preferences
export * from './settings-panel.component';
export * from './preferences-dialog.component';
export * from './shortcuts-editor.component';
export * from './theme-selector.component';

// Phase 5 - Dialogs
export * from './alert-dialog.component';
export * from './confirm-dialog.component';
export * from './prompt-dialog.component';
export * from './about-dialog.component';
export * from './update-dialog.component';
export * from './onboarding-wizard.component';

// Phase 6 - Data Display
export * from './terminal.component';
export * from './log-viewer.component';
export * from './property-inspector.component';
export * from './code-viewer.component';

// Phase 7 - Status & Feedback
export * from './status-bar.component';
export * from './toolbar.component';
export * from './activity-indicator.component';
export * from './connection-status.component';

// Phase 8 - Interaction & Input
export * from './resizable-panels.component';
export * from './shortcut-display.component';

// Services
export * from './platform.service';
export * from './storage.service';
export * from './ipc.service';
export * from './file-picker.service';
export * from './system-tray.service';
export * from './native-notifications.service';
export * from './dock.service';
export * from './update.service';

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
import { TwQuickSwitcherComponent } from './quick-switcher.component';
import { TwSettingsPanelComponent } from './settings-panel.component';
import { TwPreferencesDialogComponent } from './preferences-dialog.component';
import { TwShortcutsEditorComponent } from './shortcuts-editor.component';
import { TwThemeSelectorComponent } from './theme-selector.component';
import { TwAlertDialogComponent } from './alert-dialog.component';
import { TwNativeConfirmDialogComponent } from './confirm-dialog.component';
import { TwPromptDialogComponent } from './prompt-dialog.component';
import { TwAboutDialogComponent } from './about-dialog.component';
import { TwUpdateDialogComponent } from './update-dialog.component';
import { TwOnboardingWizardComponent } from './onboarding-wizard.component';
import { TwTerminalComponent } from './terminal.component';
import { TwLogViewerComponent } from './log-viewer.component';
import { TwPropertyInspectorComponent } from './property-inspector.component';
import { TwCodeViewerComponent } from './code-viewer.component';
import { TwStatusBarComponent } from './status-bar.component';
import { TwToolbarComponent } from './toolbar.component';
import { TwActivityIndicatorComponent } from './activity-indicator.component';
import { TwConnectionStatusComponent } from './connection-status.component';
import { TwResizablePanelsComponent } from './resizable-panels.component';
import { TwShortcutDisplayComponent } from './shortcut-display.component';
import { TwDraggableDirective } from './draggable.directive';
import { TwDropZoneDirective } from './drop-zone.directive';
import { TwShortcutDirective } from './shortcut.directive';

export const TW_NATIVE_COMPONENTS = [
  // Phase 1 - Window & Chrome
  TwTitleBarComponent,
  TwWindowControlsComponent,
  TwMenuBarComponent,
  TwNativeContextMenuComponent,
  // Phase 2 - Navigation
  TwSidebarNavComponent,
  TwFileTreeComponent,
  TwBreadcrumbsNavComponent,
  TwTabBarComponent,
  // Phase 3 - Search & Commands
  TwCommandPaletteComponent,
  TwSearchBarComponent,
  TwQuickSwitcherComponent,
  // Phase 4 - Settings
  TwSettingsPanelComponent,
  TwPreferencesDialogComponent,
  TwShortcutsEditorComponent,
  TwThemeSelectorComponent,
  // Phase 5 - Dialogs
  TwAlertDialogComponent,
  TwNativeConfirmDialogComponent,
  TwPromptDialogComponent,
  TwAboutDialogComponent,
  TwUpdateDialogComponent,
  TwOnboardingWizardComponent,
  // Phase 6 - Data Display
  TwTerminalComponent,
  TwLogViewerComponent,
  TwPropertyInspectorComponent,
  TwCodeViewerComponent,
  // Phase 7 - Status & Feedback
  TwStatusBarComponent,
  TwToolbarComponent,
  TwActivityIndicatorComponent,
  TwConnectionStatusComponent,
  // Phase 8 - Interaction
  TwResizablePanelsComponent,
  TwShortcutDisplayComponent,
] as const;

export const TW_NATIVE_DIRECTIVES = [
  TwDraggableDirective,
  TwDropZoneDirective,
  TwShortcutDirective,
] as const;
