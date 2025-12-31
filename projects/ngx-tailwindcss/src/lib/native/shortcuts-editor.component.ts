import { Component, input, output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ShortcutBinding {
  id: string;
  command: string;
  description?: string;
  category?: string;
  keys: string[];
  defaultKeys: string[];
  isCustom?: boolean;
}

@Component({
  selector: 'tw-shortcuts-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-white dark:bg-slate-900">
      <!-- Header -->
      <div class="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
        <div class="relative flex-1">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search shortcuts..."
            class="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          [ngModel]="selectedCategory()"
          (ngModelChange)="selectedCategory.set($event)"
          class="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Categories</option>
          @for (category of categories(); track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
      </div>

      <!-- Shortcuts List -->
      <div class="flex-1 overflow-y-auto">
        @for (shortcut of filteredShortcuts(); track shortcut.id) {
          <div
            class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-slate-900 dark:text-slate-100">
                {{ shortcut.command }}
                @if (shortcut.isCustom) {
                  <span
                    class="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                  >
                    Modified
                  </span>
                }
              </div>
              @if (shortcut.description) {
                <div class="text-sm text-slate-500 truncate">{{ shortcut.description }}</div>
              }
            </div>

            <div class="flex items-center gap-2">
              <!-- Current Binding -->
              @if (editingId() === shortcut.id) {
                <div
                  class="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-500"
                >
                  <span class="text-sm text-slate-500">Press keys...</span>
                  <span class="font-mono text-sm">{{ recordedKeys().join(' + ') || '...' }}</span>
                  <button (click)="cancelEdit()" class="ml-2 text-slate-400 hover:text-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              } @else {
                <button
                  (click)="startEdit(shortcut)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  @for (key of shortcut.keys; track key; let last = $last) {
                    <kbd
                      class="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600 text-xs font-mono shadow-sm"
                    >
                      {{ formatKey(key) }}
                    </kbd>
                    @if (!last) {
                      <span class="text-slate-400">+</span>
                    }
                  }
                  @if (shortcut.keys.length === 0) {
                    <span class="text-sm text-slate-500">Not set</span>
                  }
                </button>
              }

              <!-- Reset Button -->
              @if (shortcut.isCustom) {
                <button
                  (click)="resetShortcut(shortcut)"
                  class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  title="Reset to default"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              }
            </div>
          </div>
        }

        @if (filteredShortcuts().length === 0) {
          <div class="flex flex-col items-center justify-center py-12 text-slate-500">
            <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>No shortcuts found</p>
          </div>
        }
      </div>

      <!-- Conflict Warning -->
      @if (conflictWarning()) {
        <div
          class="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800"
        >
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{{ conflictWarning() }}</span>
          </div>
        </div>
      }

      <!-- Footer -->
      <div
        class="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
      >
        <button
          (click)="resetAllShortcuts.emit()"
          class="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Reset All to Defaults
        </button>
        <div class="flex items-center gap-2">
          <button
            (click)="exportShortcuts.emit()"
            class="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Export
          </button>
          <button
            (click)="importShortcuts.emit()"
            class="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TwShortcutsEditorComponent {
  public readonly shortcuts = input<ShortcutBinding[]>([]);
  public readonly platform = input<'mac' | 'windows' | 'linux'>('mac');

  public readonly shortcutChanged = output<{ shortcut: ShortcutBinding; keys: string[] }>();
  public readonly shortcutReset = output<ShortcutBinding>();
  public readonly resetAllShortcuts = output<void>();
  public readonly exportShortcuts = output<void>();
  public readonly importShortcuts = output<void>();

  public readonly searchQuery = signal('');
  public readonly selectedCategory = signal('');
  public readonly editingId = signal<string | null>(null);
  public readonly recordedKeys = signal<string[]>([]);
  public readonly conflictWarning = signal<string | null>(null);

  public readonly categories = computed(() => {
    const cats = new Set<string>();
    this.shortcuts().forEach(s => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats).sort();
  });

  public readonly filteredShortcuts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    return this.shortcuts().filter(shortcut => {
      const matchesQuery =
        !query ||
        shortcut.command.toLowerCase().includes(query) ||
        shortcut.description?.toLowerCase().includes(query);
      const matchesCategory = !category || shortcut.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (!this.editingId()) return;

    event.preventDefault();
    event.stopPropagation();

    const keys: string[] = [];
    if (event.metaKey) keys.push('Meta');
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.altKey) keys.push('Alt');
    if (event.shiftKey) keys.push('Shift');

    // Add the actual key if it's not a modifier
    if (!['Meta', 'Control', 'Alt', 'Shift'].includes(event.key)) {
      keys.push(event.key);

      // Check for conflicts
      const conflict = this.findConflict(keys);
      if (conflict) {
        this.conflictWarning.set(`This shortcut is already used by "${conflict.command}"`);
      } else {
        this.conflictWarning.set(null);
      }

      this.recordedKeys.set(keys);

      // Save after a short delay
      setTimeout(() => {
        if (this.editingId() && !this.conflictWarning()) {
          this.saveEdit();
        }
      }, 500);
    } else {
      this.recordedKeys.set(keys);
    }
  }

  public startEdit(shortcut: ShortcutBinding): void {
    this.editingId.set(shortcut.id);
    this.recordedKeys.set([]);
    this.conflictWarning.set(null);
  }

  public cancelEdit(): void {
    this.editingId.set(null);
    this.recordedKeys.set([]);
    this.conflictWarning.set(null);
  }

  public saveEdit(): void {
    const id = this.editingId();
    const keys = this.recordedKeys();
    if (!id || keys.length === 0) return;

    const shortcut = this.shortcuts().find(s => s.id === id);
    if (shortcut) {
      this.shortcutChanged.emit({ shortcut, keys });
    }

    this.cancelEdit();
  }

  public resetShortcut(shortcut: ShortcutBinding): void {
    this.shortcutReset.emit(shortcut);
  }

  public formatKey(key: string): string {
    const platform = this.platform();
    const keyMap: Record<string, string> = {
      Meta: platform === 'mac' ? '⌘' : 'Win',
      Ctrl: platform === 'mac' ? '⌃' : 'Ctrl',
      Alt: platform === 'mac' ? '⌥' : 'Alt',
      Shift: platform === 'mac' ? '⇧' : 'Shift',
      Enter: '↵',
      Backspace: '⌫',
      Delete: '⌦',
      Escape: 'Esc',
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Tab: '⇥',
      ' ': 'Space',
    };
    return keyMap[key] || key.toUpperCase();
  }

  private findConflict(keys: string[]): ShortcutBinding | null {
    const keysStr = keys.sort().join('+');
    const editingId = this.editingId();

    return (
      this.shortcuts().find(s => {
        if (s.id === editingId) return false;
        const existingKeysStr = [...s.keys].sort().join('+');
        return existingKeysStr === keysStr;
      }) || null
    );
  }
}
