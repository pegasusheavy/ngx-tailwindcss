import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwFocusTrapDirective } from '../directives';

let nextSwitcherId = 0;

export interface QuickSwitcherItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  path?: string;
  type: 'file' | 'tab' | 'command' | 'symbol' | 'recent';
  metadata?: Record<string, unknown>;
}

@Component({
  selector: 'tw-quick-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule, TwFocusTrapDirective],
  templateUrl: './quick-switcher.component.html',
})
export class TwQuickSwitcherComponent {
  public readonly items = input<QuickSwitcherItem[]>([]);
  public readonly recentItemIds = input<string[]>([]);
  public readonly placeholder = input('Search files, tabs, commands...');
  public readonly maxResults = input(10);

  public readonly itemSelected = output<QuickSwitcherItem>();
  public readonly closed = output();

  public readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Unique id prefix for option elements (aria-activedescendant) */
  public readonly switcherId = `tw-quick-switcher-${nextSwitcherId++}`;

  public readonly isOpen = signal(false);
  public readonly searchQuery = signal('');
  public readonly selectedIndex = signal(0);

  public readonly recentItems = computed(() => {
    const ids = this.recentItemIds();
    return this.items()
      .filter(item => ids.includes(item.id))
      .slice(0, 5);
  });

  public readonly filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.recentItems();
    }

    return this.items()
      .filter(item => {
        const label = item.label.toLowerCase();
        const description = item.description?.toLowerCase() || '';
        const path = item.path?.toLowerCase() || '';
        return label.includes(query) || description.includes(query) || path.includes(query);
      })
      .slice(0, this.maxResults());
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => {
          this.searchInput()?.nativeElement.focus();
        }, 50);
      }
    });

    effect(() => {
      // Reset selection when results change
      this.filteredItems();
      this.selectedIndex.set(0);
    });
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    switch (event.key) {
      case 'Escape': {
        this.close();
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        this.selectedIndex.update(i => Math.min(i + 1, this.filteredItems().length - 1));
        event.preventDefault();
        break;
      }
      case 'ArrowUp': {
        this.selectedIndex.update(i => Math.max(i - 1, 0));
        event.preventDefault();
        break;
      }
      case 'Enter': {
        const item = this.filteredItems()[this.selectedIndex()];
        if (item) {
          this.selectItem(item);
        }
        event.preventDefault();
        break;
      }
    }
  }

  public open(): void {
    this.isOpen.set(true);
    this.searchQuery.set('');
    this.selectedIndex.set(0);
  }

  public close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  public selectItem(item: QuickSwitcherItem): void {
    this.itemSelected.emit(item);
    this.close();
  }

  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
