import{a as q,b as X}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{$b as M,Tb as x,Ub as N,Vb as k,Wb as A,Xb as P,Yb as F,Zb as I,_b as V,ac as B,bc as z,cc as L,dc as j,ec as O,fc as $,gc as R,h as E,hc as U,ic as H,jc as W,kc as K,lc as Z,mc as Q,u as T}from"./chunk-5LPP6ASA.js";import{$b as _,Ba as n,Cb as S,Db as y,Jb as o,Lb as C,Ra as h,Xb as v,aa as r,ba as s,hb as a,ib as t,ja as w,jb as e,kb as d,pb as f,pc as D,tb as u}from"./chunk-2G56FVSW.js";var G=["promptDialog"],J=()=>({id:"home",label:"Home",path:"/"}),ee=()=>({id:"projects",label:"Projects",path:"/projects"}),te=()=>({id:"app",label:"My App",path:"/projects/my-app"}),ie=()=>({id:"src",label:"src",path:"/projects/my-app/src"}),oe=(b,l,g,i)=>[b,l,g,i],Y=class b{appTitle="My Native App";menuBarItems=[{id:"file",label:"File",items:[{id:"new",label:"New File",shortcut:"Ctrl+N"},{id:"open",label:"Open...",shortcut:"Ctrl+O"},{id:"save",label:"Save",shortcut:"Ctrl+S"},{id:"sep1",label:"",type:"separator"},{id:"exit",label:"Exit",shortcut:"Alt+F4"}]},{id:"edit",label:"Edit",items:[{id:"undo",label:"Undo",shortcut:"Ctrl+Z"},{id:"redo",label:"Redo",shortcut:"Ctrl+Y"},{id:"sep2",label:"",type:"separator"},{id:"cut",label:"Cut",shortcut:"Ctrl+X"},{id:"copy",label:"Copy",shortcut:"Ctrl+C"},{id:"paste",label:"Paste",shortcut:"Ctrl+V"}]},{id:"view",label:"View",items:[{id:"zoom-in",label:"Zoom In",shortcut:"Ctrl++"},{id:"zoom-out",label:"Zoom Out",shortcut:"Ctrl+-"},{id:"reset-zoom",label:"Reset Zoom",shortcut:"Ctrl+0"}]},{id:"help",label:"Help",items:[{id:"docs",label:"Documentation",shortcut:"F1"},{id:"about",label:"About"}]}];contextMenuItems=[{id:"cut",label:"Cut",shortcut:"Ctrl+X"},{id:"copy",label:"Copy",shortcut:"Ctrl+C"},{id:"paste",label:"Paste",shortcut:"Ctrl+V"},{id:"sep1",label:"",type:"separator"},{id:"delete",label:"Delete",shortcut:"Del"},{id:"rename",label:"Rename",shortcut:"F2"}];fileTreeData=[{id:"src",name:"src",type:"folder",expanded:!0,children:[{id:"app",name:"app",type:"folder",expanded:!0,children:[{id:"app.ts",name:"app.component.ts",type:"file"},{id:"app.html",name:"app.component.html",type:"file"},{id:"app.css",name:"app.component.css",type:"file"}]},{id:"main.ts",name:"main.ts",type:"file"},{id:"index.html",name:"index.html",type:"file"}]},{id:"node_modules",name:"node_modules",type:"folder",children:[]},{id:"package.json",name:"package.json",type:"file"},{id:"README.md",name:"README.md",type:"file"}];tabs=[{id:"tab1",label:"index.html",closable:!0},{id:"tab2",label:"styles.css",closable:!0,dirty:!0},{id:"tab3",label:"app.component.ts",closable:!0},{id:"tab4",label:"README.md",closable:!0,pinned:!0}];activeTab=w("tab1");commandPaletteOpen=w(!1);commands=[{id:"new-file",label:"New File",shortcut:"Ctrl+N",action:()=>console.log("New file")},{id:"open-file",label:"Open File",shortcut:"Ctrl+O",action:()=>console.log("Open file")},{id:"save-file",label:"Save File",shortcut:"Ctrl+S",action:()=>console.log("Save file")},{id:"toggle-sidebar",label:"Toggle Sidebar",shortcut:"Ctrl+B",action:()=>console.log("Toggle sidebar")},{id:"toggle-terminal",label:"Toggle Terminal",shortcut:"Ctrl+`",action:()=>console.log("Toggle terminal")},{id:"format-doc",label:"Format Document",shortcut:"Shift+Alt+F",action:()=>console.log("Format")},{id:"find",label:"Find",shortcut:"Ctrl+F",action:()=>console.log("Find")},{id:"replace",label:"Find and Replace",shortcut:"Ctrl+H",action:()=>console.log("Replace")}];terminalLines=[{id:"1",content:"$ npm install @pegasusheavy/ngx-tailwindcss",type:"input",timestamp:new Date},{id:"2",content:"added 127 packages in 4.2s",type:"success",timestamp:new Date},{id:"3",content:"$ ng serve",type:"input",timestamp:new Date},{id:"4",content:"Compiling @angular/core : es2022 as esm2022",type:"output",timestamp:new Date},{id:"5",content:"Browser application bundle generation complete.",type:"success",timestamp:new Date},{id:"6",content:"** Angular Live Development Server is listening on localhost:4200 **",type:"info",timestamp:new Date}];logEntries=[{id:"1",timestamp:new Date,level:"info",message:"Application started",source:"main"},{id:"2",timestamp:new Date,level:"debug",message:"Loading configuration...",source:"config"},{id:"3",timestamp:new Date,level:"info",message:"Configuration loaded successfully",source:"config"},{id:"4",timestamp:new Date,level:"warn",message:"Deprecated API usage detected",source:"api"},{id:"5",timestamp:new Date,level:"error",message:"Failed to connect to database",source:"db"},{id:"6",timestamp:new Date,level:"info",message:"Retrying connection...",source:"db"},{id:"7",timestamp:new Date,level:"info",message:"Connection established",source:"db"}];codeContent=`import { Component } from '@angular/core';

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
}`;statusBarItems=[{id:"branch",content:"main",icon:"git-branch",position:"left",tooltip:"Current branch"},{id:"sync",content:"\u21910 \u21930",position:"left",tooltip:"Sync changes"},{id:"errors",content:"0 Errors",position:"left",tooltip:"No errors"},{id:"warnings",content:"2 Warnings",position:"left",tooltip:"2 warnings found"},{id:"line",content:"Ln 42, Col 15",position:"right",tooltip:"Cursor position"},{id:"encoding",content:"UTF-8",position:"right",tooltip:"File encoding"},{id:"language",content:"TypeScript",position:"right",tooltip:"Language mode"}];toolbarItems=[{id:"new",type:"button",icon:"file-plus",tooltip:"New File"},{id:"open",type:"button",icon:"folder-open",tooltip:"Open File"},{id:"save",type:"button",icon:"save",tooltip:"Save"},{id:"sep1",type:"separator"},{id:"undo",type:"button",icon:"undo",tooltip:"Undo"},{id:"redo",type:"button",icon:"redo",tooltip:"Redo"},{id:"sep2",type:"separator"},{id:"format",type:"button",icon:"code",tooltip:"Format Code"},{id:"spacer",type:"spacer"},{id:"run",type:"button",icon:"play",tooltip:"Run",active:!0},{id:"debug",type:"button",icon:"bug",tooltip:"Debug"}];showAlertDialog=w(!1);showConfirmDialog=w(!1);showPromptDialog=w(!1);showAboutDialog=w(!1);showUpdateDialog=w(!1);showOnboarding=w(!1);promptDialog=D("promptDialog");isLoading=w(!1);connectionStatus=w("connected");onMenuAction(l){console.log("Menu action:",l.id)}onFileSelect(l){console.log("File selected:",l.node.name)}onTabSelect(l){this.activeTab.set(l.tab.id)}onTabClose(l){console.log("Tab closed:",l.tab.label)}onCommandSelect(l){l.action(),this.commandPaletteOpen.set(!1)}onSearch(l){console.log("Search:",l)}openCommandPalette(){this.commandPaletteOpen.set(!0)}simulateLoading(){this.isLoading.set(!0),setTimeout(()=>this.isLoading.set(!1),3e3)}toggleConnection(){let l=["connected","connecting","disconnected","error"],g=l.indexOf(this.connectionStatus());this.connectionStatus.set(l[(g+1)%l.length])}onAlertConfirm(){console.log("Alert confirmed"),this.showAlertDialog.set(!1)}openPromptDialog(){this.promptDialog()?.open("my-project")}onPromptConfirmed(l){console.log("Prompt confirmed with value:",l),this.showPromptDialog.set(!1)}codeExamples={titleBar:`<tw-title-bar
  [title]="'My Native App'"
  platform="windows"
  variant="default"
  (minimize)="onMinimize()"
  (maximize)="onMaximize()"
  (close)="onClose()">
</tw-title-bar>`,windowControls:`<tw-window-controls
  platform="macos"
  (minimize)="onMinimize()"
  (maximize)="onMaximize()"
  (close)="onClose()">
</tw-window-controls>

<!-- Platform options: 'macos' | 'windows' | 'linux' -->`,menuBar:`// Define menu items
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
</tw-menu-bar>`,fileTree:`// Define file tree nodes
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
</tw-file-tree>`,tabBar:`// Define tabs
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
</tw-tab-bar>`,breadcrumbs:`<tw-breadcrumbs-nav
  [items]="[
    { id: 'home', label: 'Home', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'app', label: 'My App', path: '/projects/my-app' }
  ]"
  (navigate)="onNavigate($event)">
</tw-breadcrumbs-nav>`,commandPalette:`// Define commands
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
</tw-command-palette>`,searchBar:`<tw-search-bar
  placeholder="Search files, commands..."
  [suggestions]="searchSuggestions"
  (search)="onSearch($event)"
  (suggestionSelect)="onSuggestionSelect($event)">
</tw-search-bar>`,shortcutDisplay:`<!-- Basic shortcut -->
<tw-shortcut-display shortcut="Ctrl+S"></tw-shortcut-display>

<!-- Mac-style shortcuts -->
<tw-shortcut-display shortcut="Cmd+Shift+P"></tw-shortcut-display>

<!-- Multiple key combinations -->
<tw-shortcut-display shortcut="Ctrl+K Ctrl+C"></tw-shortcut-display>`,themeSelector:`<tw-theme-selector
  (themeChange)="onThemeChange($event)">
</tw-theme-selector>

// Handle theme changes
onThemeChange(theme: 'light' | 'dark' | 'system') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}`,dialogs:`// Alert Dialog
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
</tw-about-dialog>`,terminal:`// Define terminal lines
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
</tw-terminal>`,logViewer:`// Define log entries
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
</tw-log-viewer>`,codeViewer:`<tw-code-viewer
  [code]="codeContent"
  language="typescript"
  [showLineNumbers]="true"
  [highlightLines]="[3, 4, 5]">
</tw-code-viewer>`,statusBar:`// Define status bar items
statusBarItems: StatusBarItem[] = [
  { id: 'branch', content: 'main', position: 'left' },
  { id: 'errors', content: '0 Errors', position: 'left' },
  { id: 'line', content: 'Ln 42, Col 18', position: 'right' },
  { id: 'encoding', content: 'UTF-8', position: 'right' },
];

<tw-status-bar
  [items]="statusBarItems"
  (itemClick)="onStatusItemClick($event)">
</tw-status-bar>`,toolbar:`// Define toolbar items
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
</tw-toolbar>`,activityStatus:`<!-- Activity Indicators -->
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

// States: 'connected' | 'connecting' | 'disconnected' | 'error'`,resizablePanels:`<tw-resizable-panels
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
</tw-resizable-panels>`,platformService:`import { NativeAppPlatformService } from '@pegasusheavy/ngx-tailwindcss';

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
}`,filePickerService:`import { FilePickerService } from '@pegasusheavy/ngx-tailwindcss';

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
}`,notificationsService:`import { NativeNotificationsService } from '@pegasusheavy/ngx-tailwindcss';

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
}`,updateService:`import { UpdateService } from '@pegasusheavy/ngx-tailwindcss';

export class UpdateComponent {
  private updateService = inject(UpdateService);

  async checkForUpdates() {
    const update = await this.updateService.checkForUpdates();
    if (update.available) {
      console.log('New version:', update.version);
      await this.updateService.downloadAndInstall();
    }
  }
}`};static \u0275fac=function(g){return new(g||b)};static \u0275cmp=h({type:b,selectors:[["app-native-demo"]],viewQuery:function(g,i){g&1&&S(i.promptDialog,G,5),g&2&&y()},decls:229,vars:51,consts:[["promptDialog",""],["title","Native App Components","description","UI components for building Tauri, Electron, and native-feeling web applications. These components provide a desktop-class user experience."],[1,"space-y-12","max-w-6xl","mx-auto","px-4","py-8"],[1,"space-y-8"],[1,"border-b","border-slate-200","dark:border-slate-700","pb-4"],[1,"text-2xl","font-bold","text-slate-900","dark:text-white"],[1,"text-slate-600","dark:text-slate-400","mt-1"],["title","Title Bar","description","Custom draggable title bar with platform-specific styling.",3,"code"],[1,"bg-slate-800","rounded-lg","overflow-hidden","shadow-xl"],["platform","windows","variant","default",3,"title"],[1,"h-32","flex","items-center","justify-center","text-slate-400"],["title","Window Controls","description","Platform-specific window control buttons.",3,"code"],[1,"flex","flex-wrap","gap-8","items-center"],[1,"text-center"],[1,"text-sm","text-slate-500","dark:text-slate-400","mb-2"],[1,"bg-slate-800","p-4","rounded-lg"],["platform","macos"],["platform","windows"],["platform","linux"],["title","Menu Bar","description","Native-style menu bar with keyboard navigation and shortcuts.",3,"code"],[1,"bg-slate-100","dark:bg-slate-800","rounded-lg","overflow-hidden"],[3,"itemSelect","items"],["title","File Tree","description","Hierarchical file and folder display with expand/collapse.",3,"code"],[1,"bg-slate-100","dark:bg-slate-800","rounded-lg","p-4","max-w-xs"],[3,"nodeSelect","nodes"],["title","Tab Bar","description","Document tabs with close, dirty indicators, and pinning.",3,"code"],[3,"tabSelect","tabClose","tabs","activeTabId"],[1,"p-4","text-slate-600","dark:text-slate-400"],["title","Breadcrumbs","description","Path-based navigation trail.",3,"code"],[3,"items"],["title","Command Palette","description","VS Code-style command palette with fuzzy search. Press Ctrl+K (or Cmd+K on Mac) to open.",3,"code"],[1,"space-y-4"],[1,"text-slate-600","dark:text-slate-400"],["shortcut","Ctrl+K"],[3,"commandSelect","commands"],["title","Search Bar","description","Global search input with suggestions.",3,"code"],[1,"max-w-md"],["placeholder","Search files, commands, or settings...",3,"search"],["title","Keyboard Shortcuts","description","Visual representation of keyboard shortcuts.",3,"code"],[1,"flex","flex-wrap","gap-4"],[1,"flex","items-center","gap-2"],["shortcut","Ctrl+S"],["shortcut","Ctrl+Z"],["shortcut","Ctrl+Shift+F"],["shortcut","Ctrl+Shift+P"],["title","Theme Selector","description","Light, dark, and system theme selection.",3,"code"],["title","Dialogs","description","Various dialog types for user interaction.",3,"code"],[1,"px-4","py-2","bg-blue-600","hover:bg-blue-700","text-white","rounded-lg",3,"click"],[1,"px-4","py-2","bg-amber-600","hover:bg-amber-700","text-white","rounded-lg",3,"click"],[1,"px-4","py-2","bg-green-600","hover:bg-green-700","text-white","rounded-lg",3,"click"],[1,"px-4","py-2","bg-purple-600","hover:bg-purple-700","text-white","rounded-lg",3,"click"],["title","Information","message","This is an informational alert dialog.","type","info",3,"confirm","openChange","open"],["title","Confirm Action","message","Are you sure you want to proceed with this action?","confirmLabel","Proceed","cancelLabel","Cancel",3,"confirm","cancel","openChange","open"],["title","Enter Name","message","Please enter your project name:","placeholder","my-project",3,"confirmed","cancelled"],["appName","ngx-tailwindcss","version","0.2.0","description","A comprehensive Angular component library with Tailwind CSS styling.","copyright","\xA9 2024 Pegasus Heavy Industries",3,"close","openChange","open"],["title","Terminal","description","Terminal output display with ANSI color support.",3,"code"],[1,"bg-slate-900","rounded-lg","overflow-hidden","max-h-64"],[3,"lines","showTimestamps"],["title","Log Viewer","description","Filterable log entries with severity levels.",3,"code"],[1,"bg-slate-100","dark:bg-slate-800","rounded-lg","overflow-hidden","h-64"],[3,"entries","showSource"],["title","Code Viewer","description","Syntax-highlighted code display.",3,"code"],["language","typescript",3,"code","showLineNumbers"],["title","Status Bar","description","Bottom status bar with information items.",3,"code"],[1,"bg-slate-800","rounded-lg","overflow-hidden"],["title","Toolbar","description","Action toolbar with icon buttons.",3,"code"],["title","Activity & Connection Status","description","Loading indicators and connection status.",3,"code"],["variant","spinner","size","md"],["variant","dots","size","md"],[1,"cursor-pointer",3,"click"],[3,"state"],[1,"text-xs","text-slate-400","mt-1"],["title","Resizable Panels","description","Split panels with drag-to-resize handles.",3,"code"],[1,"h-64","bg-slate-100","dark:bg-slate-800","rounded-lg","overflow-hidden"],["direction","horizontal"],[1,"p-4","bg-slate-200","dark:bg-slate-700","h-full"],[1,"font-semibold","text-slate-700","dark:text-slate-300"],[1,"text-sm","text-slate-500","dark:text-slate-400","mt-2"],[1,"p-4","bg-slate-100","dark:bg-slate-800","h-full"],["title","NativeAppPlatformService","description","Platform detection and window management for Tauri/Electron.",3,"code"],[1,"p-4","bg-slate-100","dark:bg-slate-800","rounded-lg"],[1,"text-sm","text-slate-600","dark:text-slate-400"],["title","FilePickerService","description","Native file open/save dialogs.",3,"code"],["title","NativeNotificationsService","description","System notifications with actions.",3,"code"],["title","UpdateService","description","Check for updates, download, and install.",3,"code"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4"],[1,"font-semibold","text-slate-900","dark:text-white"],[1,"text-sm","text-slate-600","dark:text-slate-400","mt-1"],[1,"mt-2","text-xs","bg-slate-200","dark:bg-slate-900","p-2","rounded","overflow-x-auto"]],template:function(g,i){if(g&1){let m=f();d(0,"app-page-header",1),t(1,"div",2)(2,"section",3)(3,"div",4)(4,"h2",5),o(5,"Window & Chrome"),e(),t(6,"p",6),o(7,"Custom title bar, window controls, and menu components for native-feeling apps."),e()(),t(8,"app-demo-section",7)(9,"div",8),d(10,"tw-title-bar",9),t(11,"div",10),o(12," Application Content Area "),e()()(),t(13,"app-demo-section",11)(14,"div",12)(15,"div",13)(16,"p",14),o(17,"macOS"),e(),t(18,"div",15),d(19,"tw-window-controls",16),e()(),t(20,"div",13)(21,"p",14),o(22,"Windows"),e(),t(23,"div",15),d(24,"tw-window-controls",17),e()(),t(25,"div",13)(26,"p",14),o(27,"Linux"),e(),t(28,"div",15),d(29,"tw-window-controls",18),e()()()(),t(30,"app-demo-section",19)(31,"div",20)(32,"tw-menu-bar",21),u("itemSelect",function(p){return r(m),s(i.onMenuAction(p))}),e()()()(),t(33,"section",3)(34,"div",4)(35,"h2",5),o(36,"Navigation"),e(),t(37,"p",6),o(38,"File tree, tabs, breadcrumbs, and sidebar navigation."),e()(),t(39,"app-demo-section",22)(40,"div",23)(41,"tw-file-tree",24),u("nodeSelect",function(p){return r(m),s(i.onFileSelect(p))}),e()()(),t(42,"app-demo-section",25)(43,"div",20)(44,"tw-tab-bar",26),u("tabSelect",function(p){return r(m),s(i.onTabSelect(p))})("tabClose",function(p){return r(m),s(i.onTabClose(p))}),e(),t(45,"div",27),o(46),e()()(),t(47,"app-demo-section",28),d(48,"tw-breadcrumbs-nav",29),e()(),t(49,"section",3)(50,"div",4)(51,"h2",5),o(52,"Search & Commands"),e(),t(53,"p",6),o(54,"Command palette, search bar, and quick switcher."),e()(),t(55,"app-demo-section",30)(56,"div",31)(57,"p",32),o(58," The command palette opens with "),d(59,"tw-shortcut-display",33),o(60," and provides fuzzy search for commands. "),e(),t(61,"tw-command-palette",34),u("commandSelect",function(p){return r(m),s(i.onCommandSelect(p))}),e()()(),t(62,"app-demo-section",35)(63,"div",36)(64,"tw-search-bar",37),u("search",function(p){return r(m),s(i.onSearch(p))}),e()()(),t(65,"app-demo-section",38)(66,"div",39)(67,"div",40)(68,"span",32),o(69,"Save:"),e(),d(70,"tw-shortcut-display",41),e(),t(71,"div",40)(72,"span",32),o(73,"Undo:"),e(),d(74,"tw-shortcut-display",42),e(),t(75,"div",40)(76,"span",32),o(77,"Find:"),e(),d(78,"tw-shortcut-display",43),e(),t(79,"div",40)(80,"span",32),o(81,"Command Palette:"),e(),d(82,"tw-shortcut-display",44),e()()()(),t(83,"section",3)(84,"div",4)(85,"h2",5),o(86,"Settings & Preferences"),e(),t(87,"p",6),o(88,"Settings panel, theme selector, and shortcuts editor."),e()(),t(89,"app-demo-section",45),d(90,"tw-theme-selector"),e()(),t(91,"section",3)(92,"div",4)(93,"h2",5),o(94,"Dialogs & Notifications"),e(),t(95,"p",6),o(96,"Alert, confirm, prompt, and about dialogs."),e()(),t(97,"app-demo-section",46)(98,"div",39)(99,"button",47),u("click",function(){return r(m),s(i.showAlertDialog.set(!0))}),o(100," Alert Dialog "),e(),t(101,"button",48),u("click",function(){return r(m),s(i.showConfirmDialog.set(!0))}),o(102," Confirm Dialog "),e(),t(103,"button",49),u("click",function(){return r(m),s(i.openPromptDialog())}),o(104," Prompt Dialog "),e(),t(105,"button",50),u("click",function(){return r(m),s(i.showAboutDialog.set(!0))}),o(106," About Dialog "),e()(),t(107,"tw-alert-dialog",51),u("confirm",function(){return r(m),s(i.onAlertConfirm())})("openChange",function(p){return r(m),s(i.showAlertDialog.set(p))}),e(),t(108,"tw-native-confirm-dialog",52),u("confirm",function(){return r(m),s(i.showConfirmDialog.set(!1))})("cancel",function(){return r(m),s(i.showConfirmDialog.set(!1))})("openChange",function(p){return r(m),s(i.showConfirmDialog.set(p))}),e(),t(109,"tw-prompt-dialog",53,0),u("confirmed",function(p){return r(m),s(i.onPromptConfirmed(p))})("cancelled",function(){return r(m),s(i.showPromptDialog.set(!1))}),e(),t(111,"tw-about-dialog",54),u("close",function(){return r(m),s(i.showAboutDialog.set(!1))})("openChange",function(p){return r(m),s(i.showAboutDialog.set(p))}),e()()(),t(112,"section",3)(113,"div",4)(114,"h2",5),o(115,"Data Display"),e(),t(116,"p",6),o(117,"Terminal, log viewer, and code viewer components."),e()(),t(118,"app-demo-section",55)(119,"div",56),d(120,"tw-terminal",57),e()(),t(121,"app-demo-section",58)(122,"div",59),d(123,"tw-log-viewer",60),e()(),t(124,"app-demo-section",61),d(125,"tw-code-viewer",62),e()(),t(126,"section",3)(127,"div",4)(128,"h2",5),o(129,"Status & Feedback"),e(),t(130,"p",6),o(131,"Status bar, toolbar, and activity indicators."),e()(),t(132,"app-demo-section",63)(133,"div",64),d(134,"tw-status-bar",29),e()(),t(135,"app-demo-section",65)(136,"div",20),d(137,"tw-toolbar",29),e()(),t(138,"app-demo-section",66)(139,"div",12)(140,"div",13)(141,"p",14),o(142,"Spinner"),e(),d(143,"tw-activity-indicator",67),e(),t(144,"div",13)(145,"p",14),o(146,"Dots"),e(),d(147,"tw-activity-indicator",68),e(),t(148,"div",13)(149,"p",14),o(150,"Connection Status"),e(),t(151,"button",69),u("click",function(){return r(m),s(i.toggleConnection())}),d(152,"tw-connection-status",70),e(),t(153,"p",71),o(154,"Click to toggle"),e()()()()(),t(155,"section",3)(156,"div",4)(157,"h2",5),o(158,"Interaction & Input"),e(),t(159,"p",6),o(160,"Resizable panels, drag and drop, and keyboard shortcuts."),e()(),t(161,"app-demo-section",72)(162,"div",73)(163,"tw-resizable-panels",74)(164,"div",75)(165,"h4",76),o(166,"Left Panel"),e(),t(167,"p",77),o(168,"Drag the handle to resize"),e()(),t(169,"div",78)(170,"h4",76),o(171,"Right Panel"),e(),t(172,"p",77),o(173,"Content area"),e()()()()()(),t(174,"section",3)(175,"div",4)(176,"h2",5),o(177,"Services"),e(),t(178,"p",6),o(179,"Platform integration services for Tauri and Electron."),e()(),t(180,"app-demo-section",79)(181,"div",80)(182,"p",81),o(183,"Detects runtime platform and provides window controls."),e()()(),t(184,"app-demo-section",82)(185,"div",80)(186,"p",81),o(187,"Opens native file dialogs for open/save operations."),e()()(),t(188,"app-demo-section",83)(189,"div",80)(190,"p",81),o(191,"Sends system notifications with optional actions."),e()()(),t(192,"app-demo-section",84)(193,"div",80)(194,"p",81),o(195,"Manages application updates for Tauri and Electron."),e()()(),t(196,"div",85)(197,"div",80)(198,"h4",86),o(199,"StorageService"),e(),t(200,"p",87),o(201,"Local and secure storage with encryption support."),e(),t(202,"pre",88)(203,"code"),o(204,`await storage.set('key', 'value');
const value = await storage.get('key');`),e()()(),t(205,"div",80)(206,"h4",86),o(207,"IpcService"),e(),t(208,"p",87),o(209,"Inter-process communication for Tauri and Electron."),e(),t(210,"pre",88)(211,"code"),o(212,`await ipc.invoke('command', data);
ipc.on('event', callback);`),e()()(),t(213,"div",80)(214,"h4",86),o(215,"SystemTrayService"),e(),t(216,"p",87),o(217,"System tray icon and context menu."),e(),t(218,"pre",88)(219,"code"),o(220,`await tray.setIcon('/path/to/icon.png');
await tray.setMenu(menuItems);`),e()()(),t(221,"div",80)(222,"h4",86),o(223,"DockService"),e(),t(224,"p",87),o(225,"Dock/taskbar badge, progress, and bounce."),e(),t(226,"pre",88)(227,"code"),o(228,`await dock.setBadge(5);
await dock.setProgress(0.75);
await dock.bounce();`),e()()()()()()}g&2&&(n(8),a("code",i.codeExamples.titleBar),n(2),a("title",i.appTitle),n(3),a("code",i.codeExamples.windowControls),n(17),a("code",i.codeExamples.menuBar),n(2),a("items",i.menuBarItems),n(7),a("code",i.codeExamples.fileTree),n(2),a("nodes",i.fileTreeData),n(),a("code",i.codeExamples.tabBar),n(2),a("tabs",i.tabs)("activeTabId",i.activeTab()),n(2),C(" Content for: ",i.activeTab()," "),n(),a("code",i.codeExamples.breadcrumbs),n(),a("items",_(46,oe,v(42,J),v(43,ee),v(44,te),v(45,ie))),n(7),a("code",i.codeExamples.commandPalette),n(6),a("commands",i.commands),n(),a("code",i.codeExamples.searchBar),n(3),a("code",i.codeExamples.shortcutDisplay),n(24),a("code",i.codeExamples.themeSelector),n(8),a("code",i.codeExamples.dialogs),n(10),a("open",i.showAlertDialog()),n(),a("open",i.showConfirmDialog()),n(3),a("open",i.showAboutDialog()),n(7),a("code",i.codeExamples.terminal),n(2),a("lines",i.terminalLines)("showTimestamps",!0),n(),a("code",i.codeExamples.logViewer),n(2),a("entries",i.logEntries)("showSource",!0),n(),a("code",i.codeExamples.codeViewer),n(),a("code",i.codeContent)("showLineNumbers",!0),n(7),a("code",i.codeExamples.statusBar),n(2),a("items",i.statusBarItems),n(),a("code",i.codeExamples.toolbar),n(2),a("items",i.toolbarItems),n(),a("code",i.codeExamples.activityStatus),n(14),a("state",i.connectionStatus()),n(9),a("code",i.codeExamples.resizablePanels),n(19),a("code",i.codeExamples.platformService),n(4),a("code",i.codeExamples.filePickerService),n(4),a("code",i.codeExamples.notificationsService),n(4),a("code",i.codeExamples.updateService))},dependencies:[E,T,N,x,k,A,P,F,I,V,M,B,z,L,j,O,$,R,U,H,W,K,Z,Q,q,X],encapsulation:2})};export{Y as NativeDemoComponent};
