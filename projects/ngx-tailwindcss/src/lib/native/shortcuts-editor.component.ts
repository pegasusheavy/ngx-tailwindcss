import { Component, computed, HostListener, input, output, signal } from '@angular/core';
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
  templateUrl: './shortcuts-editor.component.html',
})
export class TwShortcutsEditorComponent {
  public readonly shortcuts = input<ShortcutBinding[]>([]);
  public readonly platform = input<'mac' | 'windows' | 'linux'>('mac');

  public readonly shortcutChanged = output<{ shortcut: ShortcutBinding; keys: string[] }>();
  public readonly shortcutReset = output<ShortcutBinding>();
  public readonly resetAllShortcuts = output();
  public readonly exportShortcuts = output();
  public readonly importShortcuts = output();

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
    return [...cats].sort();
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
    if (['Meta', 'Control', 'Alt', 'Shift'].includes(event.key)) {
      this.recordedKeys.set(keys);
    } else {
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
