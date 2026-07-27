import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwFocusTrapDirective } from '../directives';
import { NativeAppPlatformService } from './platform.service';
import { CommandItem, CommandPaletteMode } from './native.types';

let nextPaletteId = 0;

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
  imports: [CommonModule, FormsModule, TwFocusTrapDirective],
  templateUrl: './command-palette.component.html',
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
  public readonly opened = output();
  public readonly closed = output();

  // State
  protected readonly isOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly selectedIndex = signal(0);

  // Unique id prefix for option elements (aria-activedescendant)
  protected readonly paletteId = `tw-command-palette-${nextPaletteId++}`;

  // View
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Computed - precompute the search text once per command list change
  private readonly searchableCommands = computed(() =>
    this.commands().map(cmd => ({
      cmd,
      searchText: [cmd.label, cmd.description, cmd.category, ...(cmd.keywords || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    }))
  );

  protected readonly filteredCommands = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return this.commands();
    }

    return this.searchableCommands()
      .filter(
        ({ cmd, searchText }) => searchText.includes(query) || this.fuzzyMatch(query, cmd.label)
      )
      .map(({ cmd }) => cmd);
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

    return [...groups.entries()].map(([category, categoryCommands]) => ({
      category,
      commands: categoryCommands,
    }));
  });

  // Flat start index per category so getGlobalIndex is O(1) per row
  private readonly groupStartIndexes = computed(() => {
    const startIndexes = new Map<string, number>();
    let globalIndex = 0;

    for (const group of this.groupedCommands()) {
      startIndexes.set(group.category, globalIndex);
      globalIndex += group.commands.length;
    }

    return startIndexes;
  });

  private readonly keydownHandler = (e: KeyboardEvent) => {
    this.handleGlobalKeydown(e);
  };

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
      case 'ArrowDown': {
        event.preventDefault();
        this.selectedIndex.update(i => Math.min(i + 1, commands.length - 1));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.selectedIndex.update(i => Math.max(i - 1, 0));
        break;
      }
      case 'Enter': {
        event.preventDefault();
        const selected = commands[this.selectedIndex()];
        if (selected) {
          this.selectCommand(selected);
        }
        break;
      }
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
    void command.action();
    this.close();
  }

  protected formatShortcut(shortcut: string): string {
    return this.platformService.formatShortcut(shortcut);
  }

  protected getGlobalIndex(category: string, localIndex: number): number {
    return (this.groupStartIndexes().get(category) ?? 0) + localIndex;
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
      this.searchInput()?.nativeElement.focus();
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
