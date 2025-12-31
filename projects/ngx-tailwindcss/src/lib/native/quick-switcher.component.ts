import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ElementRef,
  viewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      [class.hidden]="!isOpen()"
      (click)="onBackdropClick($event)"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <!-- Switcher Panel -->
      <div
        class="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <!-- Search Input -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            #searchInput
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            [placeholder]="placeholder()"
            class="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          @if (searchQuery()) {
            <button
              (click)="searchQuery.set('')"
              class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <!-- Results List -->
        <div class="max-h-80 overflow-y-auto">
          @if (filteredItems().length === 0) {
            <div class="px-4 py-8 text-center text-slate-500">
              @if (searchQuery()) {
                <p>No results found for "{{ searchQuery() }}"</p>
              } @else {
                <p>Start typing to search...</p>
              }
            </div>
          } @else {
            <!-- Recent Items -->
            @if (recentItems().length > 0 && !searchQuery()) {
              <div class="px-3 py-2">
                <div class="text-xs font-medium text-slate-500 uppercase tracking-wide px-2 py-1">
                  Recent
                </div>
                @for (item of recentItems(); track item.id; let i = $index) {
                  <button
                    (click)="selectItem(item)"
                    (mouseenter)="selectedIndex.set(i)"
                    [class.bg-blue-50]="selectedIndex() === i"
                    [class.dark:bg-blue-900/30]="selectedIndex() === i"
                    class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <div class="flex-1 text-left">
                      <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ item.label }}</div>
                      @if (item.path) {
                        <div class="text-xs text-slate-500 truncate">{{ item.path }}</div>
                      }
                    </div>
                  </button>
                }
              </div>
            }

            <!-- Search Results -->
            @if (searchQuery()) {
              <div class="px-3 py-2">
                @for (item of filteredItems(); track item.id; let i = $index) {
                  <button
                    (click)="selectItem(item)"
                    (mouseenter)="selectedIndex.set(i)"
                    [class.bg-blue-50]="selectedIndex() === i"
                    [class.dark:bg-blue-900/30]="selectedIndex() === i"
                    class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                      @switch (item.type) {
                        @case ('file') {
                          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        }
                        @case ('tab') {
                          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        }
                        @case ('command') {
                          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        }
                        @case ('symbol') {
                          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        }
                        @default {
                          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      }
                    </span>
                    <div class="flex-1 text-left min-w-0">
                      <div class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ item.label }}</div>
                      @if (item.description || item.path) {
                        <div class="text-xs text-slate-500 truncate">{{ item.description || item.path }}</div>
                      }
                    </div>
                    <span class="flex-shrink-0 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 capitalize">
                      {{ item.type }}
                    </span>
                  </button>
                }
              </div>
            }
          }
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↑↓</kbd>
              Navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↵</kbd>
              Select
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">esc</kbd>
              Close
            </span>
          </div>
          <span>{{ filteredItems().length }} results</span>
        </div>
      </div>
    </div>
  `,
})
export class TwQuickSwitcherComponent {
  public readonly items = input<QuickSwitcherItem[]>([]);
  public readonly recentItemIds = input<string[]>([]);
  public readonly placeholder = input('Search files, tabs, commands...');
  public readonly maxResults = input(10);

  public readonly itemSelected = output<QuickSwitcherItem>();
  public readonly closed = output<void>();

  public readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  public readonly isOpen = signal(false);
  public readonly searchQuery = signal('');
  public readonly selectedIndex = signal(0);

  public readonly recentItems = computed(() => {
    const ids = this.recentItemIds();
    return this.items().filter(item => ids.includes(item.id)).slice(0, 5);
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
      case 'Escape':
        this.close();
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.selectedIndex.update(i => Math.min(i + 1, this.filteredItems().length - 1));
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.selectedIndex.update(i => Math.max(i - 1, 0));
        event.preventDefault();
        break;
      case 'Enter':
        const item = this.filteredItems()[this.selectedIndex()];
        if (item) {
          this.selectItem(item);
        }
        event.preventDefault();
        break;
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

