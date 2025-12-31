import { Component, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  // Phase 1 - Window & Chrome
  TwTitleBarComponent,
  TwWindowControlsComponent,
  TwMenuBarComponent,
  // Phase 2 - Navigation
  TwFileTreeComponent,
  TwBreadcrumbsNavComponent,
  TwTabBarComponent,
  // Phase 3 - Search & Commands
  TwCommandPaletteComponent,
  TwSearchBarComponent,
  // Phase 4 - Settings
  TwThemeSelectorComponent,
  // Phase 5 - Dialogs
  TwAlertDialogComponent,
  TwNativeConfirmDialogComponent,
  TwPromptDialogComponent,
  TwAboutDialogComponent,
  // Phase 6 - Data Display
  TwTerminalComponent,
  TwLogViewerComponent,
  TwCodeViewerComponent,
  // Phase 7 - Status & Feedback
  TwStatusBarComponent,
  TwToolbarComponent,
  TwActivityIndicatorComponent,
  TwConnectionStatusComponent,
  // Phase 8 - Interaction
  TwResizablePanelsComponent,
  TwShortcutDisplayComponent,
  // Types
  NativeMenuItem,
  NativeMenuBarItem,
  FileTreeNode,
  FileTreeEvent,
  TabItem,
  TabEvent,
  CommandItem,
  TerminalLine,
  LogEntry,
  StatusBarItem,
  ToolbarItem,
} from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-native-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Phase 1
    TwTitleBarComponent,
    TwWindowControlsComponent,
    TwMenuBarComponent,
    // Phase 2
    TwFileTreeComponent,
    TwBreadcrumbsNavComponent,
    TwTabBarComponent,
    // Phase 3
    TwCommandPaletteComponent,
    TwSearchBarComponent,
    // Phase 4
    TwThemeSelectorComponent,
    // Phase 5
    TwAlertDialogComponent,
    TwNativeConfirmDialogComponent,
    TwPromptDialogComponent,
    TwAboutDialogComponent,
    // Phase 6
    TwTerminalComponent,
    TwLogViewerComponent,
    TwCodeViewerComponent,
    // Phase 7
    TwStatusBarComponent,
    TwToolbarComponent,
    TwActivityIndicatorComponent,
    TwConnectionStatusComponent,
    // Phase 8
    TwResizablePanelsComponent,
    TwShortcutDisplayComponent,
    // Demo utilities
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './native-demo.component.html',
})
export class NativeDemoComponent {
  // Title Bar state
  appTitle = 'My Native App';

  // Menu Bar items
  menuBarItems: NativeMenuBarItem[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new', label: 'New File', shortcut: 'Ctrl+N' },
        { id: 'open', label: 'Open...', shortcut: 'Ctrl+O' },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        { id: 'sep1', label: '', type: 'separator' },
        { id: 'exit', label: 'Exit', shortcut: 'Alt+F4' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
        { id: 'sep2', label: '', type: 'separator' },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++' },
        { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-' },
        { id: 'reset-zoom', label: 'Reset Zoom', shortcut: 'Ctrl+0' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { id: 'docs', label: 'Documentation', shortcut: 'F1' },
        { id: 'about', label: 'About' },
      ],
    },
  ];

  // Context menu items
  contextMenuItems: NativeMenuItem[] = [
    { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
    { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
    { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
    { id: 'sep1', label: '', type: 'separator' },
    { id: 'delete', label: 'Delete', shortcut: 'Del' },
    { id: 'rename', label: 'Rename', shortcut: 'F2' },
  ];

  // File Tree data
  fileTreeData: FileTreeNode[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 'app',
          name: 'app',
          type: 'folder',
          expanded: true,
          children: [
            { id: 'app.ts', name: 'app.component.ts', type: 'file' },
            { id: 'app.html', name: 'app.component.html', type: 'file' },
            { id: 'app.css', name: 'app.component.css', type: 'file' },
          ],
        },
        { id: 'main.ts', name: 'main.ts', type: 'file' },
        { id: 'index.html', name: 'index.html', type: 'file' },
      ],
    },
    {
      id: 'node_modules',
      name: 'node_modules',
      type: 'folder',
      children: [],
    },
    { id: 'package.json', name: 'package.json', type: 'file' },
    { id: 'README.md', name: 'README.md', type: 'file' },
  ];

  // Tab Bar items
  tabs: TabItem[] = [
    { id: 'tab1', label: 'index.html', closable: true },
    { id: 'tab2', label: 'styles.css', closable: true, dirty: true },
    { id: 'tab3', label: 'app.component.ts', closable: true },
    { id: 'tab4', label: 'README.md', closable: true, pinned: true },
  ];
  activeTab = signal('tab1');

  // Command Palette
  commandPaletteOpen = signal(false);
  commands: CommandItem[] = [
    { id: 'new-file', label: 'New File', shortcut: 'Ctrl+N', action: () => console.log('New file') },
    { id: 'open-file', label: 'Open File', shortcut: 'Ctrl+O', action: () => console.log('Open file') },
    { id: 'save-file', label: 'Save File', shortcut: 'Ctrl+S', action: () => console.log('Save file') },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: () => console.log('Toggle sidebar') },
    { id: 'toggle-terminal', label: 'Toggle Terminal', shortcut: 'Ctrl+`', action: () => console.log('Toggle terminal') },
    { id: 'format-doc', label: 'Format Document', shortcut: 'Shift+Alt+F', action: () => console.log('Format') },
    { id: 'find', label: 'Find', shortcut: 'Ctrl+F', action: () => console.log('Find') },
    { id: 'replace', label: 'Find and Replace', shortcut: 'Ctrl+H', action: () => console.log('Replace') },
  ];

  // Terminal lines
  terminalLines: TerminalLine[] = [
    { id: '1', content: '$ npm install @pegasusheavy/ngx-tailwindcss', type: 'input', timestamp: new Date() },
    { id: '2', content: 'added 127 packages in 4.2s', type: 'success', timestamp: new Date() },
    { id: '3', content: '$ ng serve', type: 'input', timestamp: new Date() },
    { id: '4', content: 'Compiling @angular/core : es2022 as esm2022', type: 'output', timestamp: new Date() },
    { id: '5', content: 'Browser application bundle generation complete.', type: 'success', timestamp: new Date() },
    { id: '6', content: '** Angular Live Development Server is listening on localhost:4200 **', type: 'info', timestamp: new Date() },
  ];

  // Log entries
  logEntries: LogEntry[] = [
    { id: '1', timestamp: new Date(), level: 'info', message: 'Application started', source: 'main' },
    { id: '2', timestamp: new Date(), level: 'debug', message: 'Loading configuration...', source: 'config' },
    { id: '3', timestamp: new Date(), level: 'info', message: 'Configuration loaded successfully', source: 'config' },
    { id: '4', timestamp: new Date(), level: 'warn', message: 'Deprecated API usage detected', source: 'api' },
    { id: '5', timestamp: new Date(), level: 'error', message: 'Failed to connect to database', source: 'db' },
    { id: '6', timestamp: new Date(), level: 'info', message: 'Retrying connection...', source: 'db' },
    { id: '7', timestamp: new Date(), level: 'info', message: 'Connection established', source: 'db' },
  ];

  // Code viewer content
  codeContent = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <tw-title-bar [title]="'My App'">
      <tw-window-controls />
    </tw-title-bar>
  \`
})
export class AppComponent {
  title = 'my-native-app';
}`;

  // Status Bar items
  statusBarItems: StatusBarItem[] = [
    { id: 'branch', content: 'main', icon: 'git-branch', position: 'left', tooltip: 'Current branch' },
    { id: 'sync', content: '↑0 ↓0', position: 'left', tooltip: 'Sync changes' },
    { id: 'errors', content: '0 Errors', position: 'left', tooltip: 'No errors' },
    { id: 'warnings', content: '2 Warnings', position: 'left', tooltip: '2 warnings found' },
    { id: 'line', content: 'Ln 42, Col 15', position: 'right', tooltip: 'Cursor position' },
    { id: 'encoding', content: 'UTF-8', position: 'right', tooltip: 'File encoding' },
    { id: 'language', content: 'TypeScript', position: 'right', tooltip: 'Language mode' },
  ];

  // Toolbar items
  toolbarItems: ToolbarItem[] = [
    { id: 'new', type: 'button', icon: 'file-plus', tooltip: 'New File' },
    { id: 'open', type: 'button', icon: 'folder-open', tooltip: 'Open File' },
    { id: 'save', type: 'button', icon: 'save', tooltip: 'Save' },
    { id: 'sep1', type: 'separator' },
    { id: 'undo', type: 'button', icon: 'undo', tooltip: 'Undo' },
    { id: 'redo', type: 'button', icon: 'redo', tooltip: 'Redo' },
    { id: 'sep2', type: 'separator' },
    { id: 'format', type: 'button', icon: 'code', tooltip: 'Format Code' },
    { id: 'spacer', type: 'spacer' },
    { id: 'run', type: 'button', icon: 'play', tooltip: 'Run', active: true },
    { id: 'debug', type: 'button', icon: 'bug', tooltip: 'Debug' },
  ];

  // Dialog states
  showAlertDialog = signal(false);
  showConfirmDialog = signal(false);
  showPromptDialog = signal(false);
  showAboutDialog = signal(false);
  showUpdateDialog = signal(false);
  showOnboarding = signal(false);

  // Prompt dialog ref
  private promptDialog = viewChild<TwPromptDialogComponent>('promptDialog');

  // Activity & Connection states
  isLoading = signal(false);
  connectionStatus = signal<'connected' | 'connecting' | 'disconnected' | 'error'>('connected');

  // Event handlers
  onMenuAction(item: NativeMenuItem): void {
    console.log('Menu action:', item.id);
  }

  onFileSelect(event: FileTreeEvent): void {
    console.log('File selected:', event.node.name);
  }

  onTabSelect(event: TabEvent): void {
    this.activeTab.set(event.tab.id);
  }

  onTabClose(event: TabEvent): void {
    console.log('Tab closed:', event.tab.label);
  }

  onCommandSelect(command: CommandItem): void {
    command.action();
    this.commandPaletteOpen.set(false);
  }

  onSearch(query: string): void {
    console.log('Search:', query);
  }

  openCommandPalette(): void {
    this.commandPaletteOpen.set(true);
  }

  simulateLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 3000);
  }

  toggleConnection(): void {
    const states: Array<'connected' | 'connecting' | 'disconnected' | 'error'> = ['connected', 'connecting', 'disconnected', 'error'];
    const current = states.indexOf(this.connectionStatus());
    this.connectionStatus.set(states[(current + 1) % states.length]);
  }

  // Dialog handlers
  onAlertConfirm(): void {
    console.log('Alert confirmed');
    this.showAlertDialog.set(false);
  }

  openPromptDialog(): void {
    this.promptDialog()?.open('my-project');
  }

  onPromptConfirmed(value: string): void {
    console.log('Prompt confirmed with value:', value);
    this.showPromptDialog.set(false);
  }

  // Code examples
  codeExamples = {
    titleBar: `<tw-title-bar
  [title]="'My Native App'"
  platform="windows"
  variant="default"
  (minimize)="onMinimize()"
  (maximize)="onMaximize()"
  (close)="onClose()">
</tw-title-bar>`,

    windowControls: `<tw-window-controls
  platform="macos"
  (minimize)="onMinimize()"
  (maximize)="onMaximize()"
  (close)="onClose()">
</tw-window-controls>

<!-- Platform options: 'macos' | 'windows' | 'linux' -->`,

    menuBar: `// Define menu items
menuBarItems: NativeMenuBarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New File', shortcut: 'Ctrl+N' },
      { id: 'open', label: 'Open...', shortcut: 'Ctrl+O' },
      { id: 'separator1', type: 'separator' },
      { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
    ]
  },
];

<tw-menu-bar
  [items]="menuBarItems"
  (itemSelect)="onMenuAction($event)">
</tw-menu-bar>`,

    fileTree: `// Define file tree nodes
fileTreeData: FileTreeNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      { id: 'app', name: 'app', type: 'folder', children: [...] },
      { id: 'main.ts', name: 'main.ts', type: 'file' },
    ]
  },
  { id: 'package.json', name: 'package.json', type: 'file' },
];

<tw-file-tree
  [nodes]="fileTreeData"
  (nodeSelect)="onFileSelect($event)"
  (nodeExpand)="onNodeExpand($event)">
</tw-file-tree>`,

    tabBar: `// Define tabs
tabs: TabItem[] = [
  { id: 'tab1', label: 'main.ts', closable: true },
  { id: 'tab2', label: 'app.ts', closable: true, dirty: true },
  { id: 'tab3', label: 'styles.css', closable: true, pinned: true },
];
activeTab = signal('tab1');

<tw-tab-bar
  [tabs]="tabs"
  [activeTabId]="activeTab()"
  (tabSelect)="onTabSelect($event)"
  (tabClose)="onTabClose($event)">
</tw-tab-bar>`,

    breadcrumbs: `<tw-breadcrumbs-nav
  [items]="[
    { id: 'home', label: 'Home', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'app', label: 'My App', path: '/projects/my-app' }
  ]"
  (navigate)="onNavigate($event)">
</tw-breadcrumbs-nav>`,

    commandPalette: `// Define commands
commands: CommandItem[] = [
  {
    id: 'new-file',
    label: 'New File',
    shortcut: 'Ctrl+N',
    action: () => this.createNewFile()
  },
  {
    id: 'open-settings',
    label: 'Open Settings',
    shortcut: 'Ctrl+,',
    action: () => this.openSettings()
  },
];

<tw-command-palette
  [commands]="commands"
  (commandSelect)="onCommandSelect($event)">
</tw-command-palette>`,

    searchBar: `<tw-search-bar
  placeholder="Search files, commands..."
  [suggestions]="searchSuggestions"
  (search)="onSearch($event)"
  (suggestionSelect)="onSuggestionSelect($event)">
</tw-search-bar>`,

    shortcutDisplay: `<!-- Basic shortcut -->
<tw-shortcut-display shortcut="Ctrl+S"></tw-shortcut-display>

<!-- Mac-style shortcuts -->
<tw-shortcut-display shortcut="Cmd+Shift+P"></tw-shortcut-display>

<!-- Multiple key combinations -->
<tw-shortcut-display shortcut="Ctrl+K Ctrl+C"></tw-shortcut-display>`,

    themeSelector: `<tw-theme-selector
  (themeChange)="onThemeChange($event)">
</tw-theme-selector>

// Handle theme changes
onThemeChange(theme: 'light' | 'dark' | 'system') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}`,

    dialogs: `// Alert Dialog
<tw-alert-dialog
  [open]="showAlert()"
  title="Information"
  message="This is an alert."
  type="info"
  (confirm)="onAlertConfirm()"
  (openChange)="showAlert.set($event)">
</tw-alert-dialog>

// Confirm Dialog
<tw-native-confirm-dialog
  [open]="showConfirm()"
  title="Confirm Action"
  message="Are you sure?"
  (confirm)="onConfirm()"
  (cancel)="onCancel()">
</tw-native-confirm-dialog>

// Prompt Dialog (imperative API)
this.promptDialog.open('default value');

<tw-prompt-dialog
  #promptDialog
  title="Enter Name"
  (confirmed)="onPromptConfirmed($event)"
  (cancelled)="onPromptCancelled()">
</tw-prompt-dialog>

// About Dialog
<tw-about-dialog
  [open]="showAbout()"
  appName="My App"
  version="1.0.0"
  (close)="showAbout.set(false)">
</tw-about-dialog>`,

    terminal: `// Define terminal lines
terminalLines: TerminalLine[] = [
  { content: '$ npm install', type: 'input' },
  { content: 'Installing dependencies...', type: 'output' },
  { content: 'added 150 packages', type: 'success' },
  { content: 'Warning: peer dependency', type: 'warning' },
  { content: 'Error: Module not found', type: 'error' },
];

<tw-terminal
  [lines]="terminalLines"
  [showTimestamps]="true"
  [autoScroll]="true">
</tw-terminal>`,

    logViewer: `// Define log entries
logEntries: LogEntry[] = [
  {
    timestamp: new Date(),
    level: 'info',
    message: 'Application started',
    source: 'App'
  },
  {
    timestamp: new Date(),
    level: 'error',
    message: 'Connection failed',
    source: 'Database'
  },
];

<tw-log-viewer
  [entries]="logEntries"
  [showSource]="true"
  [filter]="'error'">
</tw-log-viewer>`,

    codeViewer: `<tw-code-viewer
  [code]="codeContent"
  language="typescript"
  [showLineNumbers]="true"
  [highlightLines]="[3, 4, 5]">
</tw-code-viewer>`,

    statusBar: `// Define status bar items
statusBarItems: StatusBarItem[] = [
  { id: 'branch', content: 'main', position: 'left' },
  { id: 'errors', content: '0 Errors', position: 'left' },
  { id: 'line', content: 'Ln 42, Col 18', position: 'right' },
  { id: 'encoding', content: 'UTF-8', position: 'right' },
];

<tw-status-bar
  [items]="statusBarItems"
  (itemClick)="onStatusItemClick($event)">
</tw-status-bar>`,

    toolbar: `// Define toolbar items
toolbarItems: ToolbarItem[] = [
  { id: 'new', type: 'button', icon: 'plus', tooltip: 'New' },
  { id: 'save', type: 'button', icon: 'save', tooltip: 'Save' },
  { id: 'sep1', type: 'separator' },
  { id: 'undo', type: 'button', icon: 'undo', tooltip: 'Undo' },
  { id: 'spacer', type: 'spacer' },
  { id: 'run', type: 'button', icon: 'play', active: true },
];

<tw-toolbar
  [items]="toolbarItems"
  (itemClick)="onToolbarClick($event)">
</tw-toolbar>`,

    activityStatus: `<!-- Activity Indicators -->
<tw-activity-indicator
  variant="spinner"
  size="md"
  [active]="isLoading()">
</tw-activity-indicator>

<tw-activity-indicator variant="dots" size="sm">
</tw-activity-indicator>

<!-- Connection Status -->
<tw-connection-status
  [state]="connectionStatus()"
  [showLabel]="true">
</tw-connection-status>

// States: 'connected' | 'connecting' | 'disconnected' | 'error'`,

    resizablePanels: `<tw-resizable-panels
  direction="horizontal"
  [sizes]="[30, 70]"
  [minSizes]="[100, 200]"
  (sizeChange)="onPanelResize($event)">
  <div>Left Panel</div>
  <div>Right Panel</div>
</tw-resizable-panels>

<!-- Vertical panels -->
<tw-resizable-panels direction="vertical">
  <div>Top Panel</div>
  <div>Bottom Panel</div>
</tw-resizable-panels>`,

    platformService: `import { NativeAppPlatformService } from '@pegasusheavy/ngx-tailwindcss';

export class AppComponent {
  private platform = inject(NativeAppPlatformService);

  ngOnInit() {
    console.log('Platform:', this.platform.getPlatform());
    console.log('Is Tauri:', this.platform.isTauri());
    console.log('Is Electron:', this.platform.isElectron());

    // Window management
    this.platform.minimize();
    this.platform.maximize();
    this.platform.close();
  }
}`,

    filePickerService: `import { FilePickerService } from '@pegasusheavy/ngx-tailwindcss';

export class FileComponent {
  private filePicker = inject(FilePickerService);

  async openFile() {
    const result = await this.filePicker.openFile({
      title: 'Select a file',
      filters: [
        { name: 'TypeScript', extensions: ['ts', 'tsx'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      multiple: false
    });
  }

  async saveFile() {
    const path = await this.filePicker.saveFile({
      title: 'Save as...',
      defaultPath: 'document.txt'
    });
  }
}`,

    notificationsService: `import { NativeNotificationsService } from '@pegasusheavy/ngx-tailwindcss';

export class NotifyComponent {
  private notifications = inject(NativeNotificationsService);

  async sendNotification() {
    await this.notifications.show({
      title: 'Download Complete',
      body: 'Your file has been downloaded.',
      icon: '/assets/icon.png',
      actions: [
        { id: 'open', title: 'Open' },
        { id: 'dismiss', title: 'Dismiss' }
      ]
    });
  }
}`,

    updateService: `import { UpdateService } from '@pegasusheavy/ngx-tailwindcss';

export class UpdateComponent {
  private updateService = inject(UpdateService);

  async checkForUpdates() {
    const update = await this.updateService.checkForUpdates();
    if (update.available) {
      console.log('New version:', update.version);
      await this.updateService.downloadAndInstall();
    }
  }
}`,
  };
}
