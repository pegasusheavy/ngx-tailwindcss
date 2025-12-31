import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NativeAppPlatformService } from './platform.service';
import { CommandItem, CommandPaletteMode } from './native.types';

/**
 * Command palette component (Cmd+K / Ctrl+K style)
 * Provides fuzzy search for commands, files, and more
 *
 * @example
 * ```html
 * <tw-command-palette [commands]="commands" (commandSelect)="onCommand($event)"></tw-command-palette>
 * ```
 */
@Component({
  selector: 'tw-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]"
        (click)="close()"
      >
        <!-- Palette container -->
        <div
          class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          <!-- Search input -->
          <div
            class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0"
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
              class="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
              [placeholder]="placeholder()"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              (keydown)="onKeyDown($event)"
              #searchInput
            />
            @if (searchQuery()) {
              <button
                type="button"
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                (click)="clearSearch()"
              >
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            }
            <kbd
              class="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
            >
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto">
            @if (filteredCommands().length === 0) {
              <div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                @if (searchQuery()) {
                  <p>No results found for "{{ searchQuery() }}"</p>
                } @else {
                  <p>Type to search commands...</p>
                }
              </div>
            } @else {
              @for (group of groupedCommands(); track group.category) {
                @if (group.category) {
                  <div
                    class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50"
                  >
                    {{ group.category }}
                  </div>
                }
                @for (command of group.commands; track command.id; let i = $index) {
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors"
                    [class.bg-blue-500]="selectedIndex() === getGlobalIndex(group.category, i)"
                    [class.text-white]="selectedIndex() === getGlobalIndex(group.category, i)"
                    [class.hover:bg-gray-100]="
                      selectedIndex() !== getGlobalIndex(group.category, i)
                    "
                    [class.dark:hover:bg-gray-700]="
                      selectedIndex() !== getGlobalIndex(group.category, i)
                    "
                    [class.text-gray-900]="selectedIndex() !== getGlobalIndex(group.category, i)"
                    [class.dark:text-gray-100]="
                      selectedIndex() !== getGlobalIndex(group.category, i)
                    "
                    (click)="selectCommand(command)"
                    (mouseenter)="selectedIndex.set(getGlobalIndex(group.category, i))"
                  >
                    <!-- Icon -->
                    @if (command.icon) {
                      <span class="flex-shrink-0 text-lg opacity-70">{{ command.icon }}</span>
                    }

                    <!-- Label and description -->
                    <div class="flex-1 min-w-0">
                      <div class="truncate font-medium">{{ command.label }}</div>
                      @if (command.description) {
                        <div
                          class="truncate text-sm opacity-60"
                          [class.text-blue-200]="
                            selectedIndex() === getGlobalIndex(group.category, i)
                          "
                        >
                          {{ command.description }}
                        </div>
                      }
                    </div>

                    <!-- Shortcut -->
                    @if (command.shortcut) {
                      <kbd
                        class="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono rounded"
                        [class.bg-blue-400]="selectedIndex() === getGlobalIndex(group.category, i)"
                        [class.text-white]="selectedIndex() === getGlobalIndex(group.category, i)"
                        [class.bg-gray-100]="selectedIndex() !== getGlobalIndex(group.category, i)"
                        [class.dark:bg-gray-700]="
                          selectedIndex() !== getGlobalIndex(group.category, i)
                        "
                        [class.text-gray-500]="
                          selectedIndex() !== getGlobalIndex(group.category, i)
                        "
                      >
                        {{ formatShortcut(command.shortcut) }}
                      </kbd>
                    }
                  </button>
                }
              }
            }
          </div>

          <!-- Footer -->
          <div
            class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
                to navigate
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span>{{ filteredCommands().length }} results</span>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-command-palette',
  },
})
export class TwCommandPaletteComponent implements OnInit, OnDestroy {
  private readonly platformService = inject(NativeAppPlatformService);

  // Inputs
  public readonly commands = input<CommandItem[]>([]);
  public readonly placeholder = input('Search commands...');
  public readonly shortcut = input('k'); // The key to trigger (with Cmd/Ctrl)

  // Outputs
  public readonly commandSelect = output<CommandItem>();
  public readonly opened = output<void>();
  public readonly closed = output<void>();

  // State
  protected readonly isOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly selectedIndex = signal(0);

  // Computed
  protected readonly filteredCommands = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allCommands = this.commands();

    if (!query) {
      return allCommands;
    }

    return allCommands.filter(cmd => {
      const searchText = [cmd.label, cmd.description, cmd.category, ...(cmd.keywords || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchText.includes(query) || this.fuzzyMatch(query, cmd.label);
    });
  });

  protected readonly groupedCommands = computed(() => {
    const commands = this.filteredCommands();
    const groups = new Map<string, CommandItem[]>();

    for (const cmd of commands) {
      const category = cmd.category || '';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(cmd);
    }

    return Array.from(groups.entries()).map(([category, commands]) => ({
      category,
      commands,
    }));
  });

  private keydownHandler = (e: KeyboardEvent) => this.handleGlobalKeydown(e);

  public ngOnInit(): void {
    document.addEventListener('keydown', this.keydownHandler);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keydownHandler);
  }

  private handleGlobalKeydown(event: KeyboardEvent): void {
    const isMac = this.platformService.platform() === 'macos';
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    // Open palette with Cmd/Ctrl + K
    if (modifier && event.key.toLowerCase() === this.shortcut()) {
      event.preventDefault();
      this.open();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const commands = this.filteredCommands();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update(i => Math.min(i + 1, commands.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        const selected = commands[this.selectedIndex()];
        if (selected) {
          this.selectCommand(selected);
        }
        break;
    }
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.selectedIndex.set(0);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.selectedIndex.set(0);
  }

  protected selectCommand(command: CommandItem): void {
    this.commandSelect.emit(command);
    command.action();
    this.close();
  }

  protected formatShortcut(shortcut: string): string {
    return this.platformService.formatShortcut(shortcut);
  }

  protected getGlobalIndex(category: string, localIndex: number): number {
    const groups = this.groupedCommands();
    let globalIndex = 0;

    for (const group of groups) {
      if (group.category === category) {
        return globalIndex + localIndex;
      }
      globalIndex += group.commands.length;
    }

    return localIndex;
  }

  private fuzzyMatch(query: string, text: string): boolean {
    const textLower = text.toLowerCase();
    let queryIndex = 0;

    for (let i = 0; i < textLower.length && queryIndex < query.length; i++) {
      if (textLower[i] === query[queryIndex]) {
        queryIndex++;
      }
    }

    return queryIndex === query.length;
  }

  // Public methods
  public open(): void {
    this.isOpen.set(true);
    this.searchQuery.set('');
    this.selectedIndex.set(0);
    this.opened.emit();

    // Focus input after render
    setTimeout(() => {
      const input = document.querySelector('.tw-command-palette input') as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  public close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  public toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}
