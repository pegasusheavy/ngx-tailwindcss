import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faFolder,
  faFolderOpen,
  faFile,
  faFileAlt,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFilePdf,
  faFileCode,
  faFileArchive,
  faHome,
  faDesktop,
  faDownload,
  faMusic,
  faImage,
  faVideo,
  faTrash,
  faStar,
  faCloud,
  faHdd,
  faChevronRight,
  faChevronLeft,
  faChevronUp,
  faArrowUp,
  faSearch,
  faTh,
  faList,
  faPlus,
  faCut,
  faCopy,
  faPaste,
  faRedo,
  faUndo,
  faCog,
  faEllipsisV,
  faTimes,
  faMinus,
  faSquare,
  faWindowMaximize,
  faWindowMinimize,
  faCheck,
  faSort,
  faSortUp,
  faSortDown,
  faInfoCircle,
  faShareAlt,
  faLock,
  faEye,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwToastService,
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
  TwModalComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface FileItem {
  id: number;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  size?: number;
  modified: Date;
  icon: any;
  color: string;
  selected?: boolean;
  starred?: boolean;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-desktop-app',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwDropdownComponent,
    TwDropdownMenuComponent,
    TwDropdownItemDirective,
    TwModalComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './desktop-app.component.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
    .file-item:focus {
      outline: none;
    }
    .window-button:hover .close-x {
      background: white;
    }
    .resize-handle {
      position: absolute;
      background: transparent;
    }
    .resize-handle.corner {
      width: 12px;
      height: 12px;
    }
    .resize-handle.edge {
      background: transparent;
    }
    @keyframes folder-bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .folder-open {
      animation: folder-bounce 0.2s ease-out;
    }
  `],
})
export class DesktopAppComponent {
  protected icons = {
    arrowLeft: faArrowLeft,
    folder: faFolder,
    folderOpen: faFolderOpen,
    file: faFile,
    fileAlt: faFileAlt,
    fileImage: faFileImage,
    fileVideo: faFileVideo,
    fileAudio: faFileAudio,
    filePdf: faFilePdf,
    fileCode: faFileCode,
    fileArchive: faFileArchive,
    home: faHome,
    desktop: faDesktop,
    download: faDownload,
    music: faMusic,
    image: faImage,
    video: faVideo,
    trash: faTrash,
    star: faStar,
    cloud: faCloud,
    hdd: faHdd,
    chevronRight: faChevronRight,
    chevronLeft: faChevronLeft,
    chevronUp: faChevronUp,
    arrowUp: faArrowUp,
    search: faSearch,
    grid: faTh,
    list: faList,
    plus: faPlus,
    cut: faCut,
    copy: faCopy,
    paste: faPaste,
    redo: faRedo,
    undo: faUndo,
    settings: faCog,
    ellipsis: faEllipsisV,
    close: faTimes,
    minimize: faMinus,
    maximize: faSquare,
    windowMax: faWindowMaximize,
    windowMin: faWindowMinimize,
    check: faCheck,
    sort: faSort,
    sortUp: faSortUp,
    sortDown: faSortDown,
    info: faInfoCircle,
    share: faShareAlt,
    lock: faLock,
    eye: faEye,
    edit: faEdit,
  };

  protected viewMode = signal<'grid' | 'list'>('grid');
  protected sortBy = signal<'name' | 'size' | 'modified' | 'type'>('name');
  protected sortDirection = signal<'asc' | 'desc'>('asc');
  protected searchQuery = signal('');
  protected sidebarCollapsed = signal(false);
  protected showHiddenFiles = signal(false);
  protected selectedItems = signal<number[]>([]);
  protected currentPath = signal('/Home');
  protected showNewFolderModal = signal(false);
  protected newFolderName = signal('');
  protected showPropertiesModal = signal(false);
  protected propertiesItem = signal<FileItem | null>(null);
  protected isWindowMaximized = signal(false);
  protected clipboardItems = signal<FileItem[]>([]);
  protected clipboardAction = signal<'cut' | 'copy' | null>(null);

  protected sidebarItems = [
    { name: 'Home', icon: faHome, path: '/Home', color: 'text-blue-500' },
    { name: 'Desktop', icon: faDesktop, path: '/Desktop', color: 'text-purple-500' },
    { name: 'Documents', icon: faFileAlt, path: '/Documents', color: 'text-yellow-500' },
    { name: 'Downloads', icon: faDownload, path: '/Downloads', color: 'text-green-500' },
    { name: 'Music', icon: faMusic, path: '/Music', color: 'text-pink-500' },
    { name: 'Pictures', icon: faImage, path: '/Pictures', color: 'text-cyan-500' },
    { name: 'Videos', icon: faVideo, path: '/Videos', color: 'text-red-500' },
  ];

  protected storageItems = [
    { name: 'Local Disk (C:)', icon: faHdd, used: 234, total: 500, color: 'text-gray-500' },
    { name: 'Data (D:)', icon: faHdd, used: 890, total: 1000, color: 'text-gray-500' },
    { name: 'Cloud Storage', icon: faCloud, used: 12, total: 100, color: 'text-blue-400' },
  ];

  protected files = signal<FileItem[]>([
    { id: 1, name: 'Projects', type: 'folder', modified: new Date('2024-12-28'), icon: faFolder, color: 'text-yellow-500' },
    { id: 2, name: 'Documents', type: 'folder', modified: new Date('2024-12-27'), icon: faFolder, color: 'text-yellow-500' },
    { id: 3, name: 'Downloads', type: 'folder', modified: new Date('2024-12-30'), icon: faFolder, color: 'text-yellow-500' },
    { id: 4, name: 'Pictures', type: 'folder', modified: new Date('2024-12-25'), icon: faFolder, color: 'text-yellow-500' },
    { id: 5, name: 'Music', type: 'folder', modified: new Date('2024-12-20'), icon: faFolder, color: 'text-yellow-500', starred: true },
    { id: 6, name: 'report.pdf', type: 'file', extension: 'pdf', size: 2456000, modified: new Date('2024-12-29'), icon: faFilePdf, color: 'text-red-500' },
    { id: 7, name: 'presentation.pptx', type: 'file', extension: 'pptx', size: 5678000, modified: new Date('2024-12-28'), icon: faFile, color: 'text-orange-500' },
    { id: 8, name: 'budget.xlsx', type: 'file', extension: 'xlsx', size: 156000, modified: new Date('2024-12-27'), icon: faFile, color: 'text-green-600' },
    { id: 9, name: 'photo_001.jpg', type: 'file', extension: 'jpg', size: 3400000, modified: new Date('2024-12-26'), icon: faFileImage, color: 'text-cyan-500' },
    { id: 10, name: 'vacation.mp4', type: 'file', extension: 'mp4', size: 156000000, modified: new Date('2024-12-25'), icon: faFileVideo, color: 'text-purple-500' },
    { id: 11, name: 'song.mp3', type: 'file', extension: 'mp3', size: 8900000, modified: new Date('2024-12-24'), icon: faFileAudio, color: 'text-pink-500' },
    { id: 12, name: 'archive.zip', type: 'file', extension: 'zip', size: 45000000, modified: new Date('2024-12-23'), icon: faFileArchive, color: 'text-amber-600' },
    { id: 13, name: 'script.py', type: 'file', extension: 'py', size: 12000, modified: new Date('2024-12-22'), icon: faFileCode, color: 'text-blue-500' },
    { id: 14, name: 'notes.txt', type: 'file', extension: 'txt', size: 4500, modified: new Date('2024-12-21'), icon: faFileAlt, color: 'text-gray-500' },
    { id: 15, name: 'config.json', type: 'file', extension: 'json', size: 2300, modified: new Date('2024-12-20'), icon: faFileCode, color: 'text-yellow-600' },
  ]);

  protected breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const parts = this.currentPath().split('/').filter(p => p);
    return parts.map((part, index) => ({
      name: part,
      path: '/' + parts.slice(0, index + 1).join('/'),
    }));
  });

  protected filteredFiles = computed(() => {
    let items = this.files();
    const query = this.searchQuery().toLowerCase();

    if (query) {
      items = items.filter(f => f.name.toLowerCase().includes(query));
    }

    const sort = this.sortBy();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    return items.sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }

      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'size':
          return ((a.size || 0) - (b.size || 0)) * dir;
        case 'modified':
          return (a.modified.getTime() - b.modified.getTime()) * dir;
        case 'type':
          return (a.extension || '').localeCompare(b.extension || '') * dir;
        default:
          return 0;
      }
    });
  });

  protected selectedCount = computed(() => this.selectedItems().length);
  protected totalSize = computed(() => {
    return this.files()
      .filter(f => this.selectedItems().includes(f.id))
      .reduce((sum, f) => sum + (f.size || 0), 0);
  });

  constructor(private toastService: TwToastService) {}

  formatSize(bytes?: number): string {
    if (!bytes) return '—';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleViewMode(): void {
    this.viewMode.update(v => v === 'grid' ? 'list' : 'grid');
  }

  setSortBy(field: 'name' | 'size' | 'modified' | 'type'): void {
    if (this.sortBy() === field) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  selectItem(id: number, event?: MouseEvent): void {
    if (event?.ctrlKey || event?.metaKey) {
      this.selectedItems.update(items =>
        items.includes(id) ? items.filter(i => i !== id) : [...items, id]
      );
    } else if (event?.shiftKey && this.selectedItems().length > 0) {
      const files = this.filteredFiles();
      const lastSelected = this.selectedItems()[this.selectedItems().length - 1];
      const lastIndex = files.findIndex(f => f.id === lastSelected);
      const currentIndex = files.findIndex(f => f.id === id);
      const [start, end] = [Math.min(lastIndex, currentIndex), Math.max(lastIndex, currentIndex)];
      const rangeIds = files.slice(start, end + 1).map(f => f.id);
      this.selectedItems.set([...new Set([...this.selectedItems(), ...rangeIds])]);
    } else {
      this.selectedItems.set([id]);
    }
  }

  openItem(item: FileItem): void {
    if (item.type === 'folder') {
      this.currentPath.update(p => `${p}/${item.name}`);
      this.selectedItems.set([]);
      this.toastService.info(`Opened ${item.name}`);
    } else {
      this.toastService.info(`Opening ${item.name}...`);
    }
  }

  goBack(): void {
    const parts = this.currentPath().split('/').filter(p => p);
    if (parts.length > 1) {
      parts.pop();
      this.currentPath.set('/' + parts.join('/'));
      this.selectedItems.set([]);
    }
  }

  goUp(): void {
    this.goBack();
  }

  navigateTo(path: string): void {
    this.currentPath.set(path);
    this.selectedItems.set([]);
  }

  selectAll(): void {
    this.selectedItems.set(this.filteredFiles().map(f => f.id));
  }

  deselectAll(): void {
    this.selectedItems.set([]);
  }

  deleteSelected(): void {
    const count = this.selectedItems().length;
    this.files.update(files => files.filter(f => !this.selectedItems().includes(f.id)));
    this.selectedItems.set([]);
    this.toastService.success(`Deleted ${count} item(s)`);
  }

  cutSelected(): void {
    const items = this.files().filter(f => this.selectedItems().includes(f.id));
    this.clipboardItems.set(items);
    this.clipboardAction.set('cut');
    this.toastService.info(`Cut ${items.length} item(s)`);
  }

  copySelected(): void {
    const items = this.files().filter(f => this.selectedItems().includes(f.id));
    this.clipboardItems.set(items);
    this.clipboardAction.set('copy');
    this.toastService.info(`Copied ${items.length} item(s)`);
  }

  paste(): void {
    if (this.clipboardItems().length === 0) return;

    const newItems = this.clipboardItems().map((item, i) => ({
      ...item,
      id: Date.now() + i,
      name: this.clipboardAction() === 'copy' ? `${item.name} (copy)` : item.name,
    }));

    if (this.clipboardAction() === 'cut') {
      this.files.update(files => files.filter(f => !this.clipboardItems().some(c => c.id === f.id)));
      this.clipboardItems.set([]);
      this.clipboardAction.set(null);
    }

    this.files.update(files => [...files, ...newItems]);
    this.toastService.success(`Pasted ${newItems.length} item(s)`);
  }

  createNewFolder(): void {
    if (!this.newFolderName().trim()) return;

    const newFolder: FileItem = {
      id: Date.now(),
      name: this.newFolderName(),
      type: 'folder',
      modified: new Date(),
      icon: faFolder,
      color: 'text-yellow-500',
    };

    this.files.update(files => [newFolder, ...files]);
    this.showNewFolderModal.set(false);
    this.newFolderName.set('');
    this.toastService.success(`Created folder "${newFolder.name}"`);
  }

  toggleStar(item: FileItem): void {
    this.files.update(files => files.map(f =>
      f.id === item.id ? { ...f, starred: !f.starred } : f
    ));
  }

  showProperties(item: FileItem): void {
    this.propertiesItem.set(item);
    this.showPropertiesModal.set(true);
  }

  renameItem(item: FileItem): void {
    const newName = prompt('Enter new name:', item.name);
    if (newName && newName !== item.name) {
      this.files.update(files => files.map(f =>
        f.id === item.id ? { ...f, name: newName } : f
      ));
      this.toastService.success(`Renamed to "${newName}"`);
    }
  }

  getStoragePercent(used: number, total: number): number {
    return Math.round((used / total) * 100);
  }

  toggleMaximize(): void {
    this.isWindowMaximized.update(v => !v);
  }
}
