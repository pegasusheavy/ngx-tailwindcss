import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchSuggestion, SearchFilter } from './native.types';

/**
 * Search bar component with suggestions and filters
 *
 * @example
 * ```html
 * <tw-search-bar (search)="onSearch($event)" [suggestions]="suggestions"></tw-search-bar>
 * ```
 */
@Component({
  selector: 'tw-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" [class.w-full]="fullWidth()">
      <!-- Search input -->
      <div
        class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg transition-all"
        [class.border-blue-500]="isFocused()"
        [class.ring-2]="isFocused()"
        [class.ring-blue-500/20]="isFocused()"
        [class.border-gray-300]="!isFocused()"
        [class.dark:border-gray-600]="!isFocused()"
      >
        <!-- Search icon -->
        <svg
          class="w-4 h-4 text-gray-400 flex-shrink-0"
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

        <!-- Active filters -->
        @for (filter of activeFilters(); track filter.id) {
          <span
            class="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
          >
            @if (filter.icon) {
              <span>{{ filter.icon }}</span>
            }
            {{ filter.label }}
            <button
              type="button"
              class="hover:text-blue-900 dark:hover:text-blue-100"
              (click)="removeFilter(filter)"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </span>
        }

        <!-- Input -->
        <input
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 min-w-0"
          [placeholder]="placeholder()"
          [(ngModel)]="query"
          (ngModelChange)="onQueryChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.enter)="submitSearch()"
          (keydown.escape)="clearSearch()"
          #searchInput
        />

        <!-- Loading indicator -->
        @if (loading()) {
          <svg class="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        }

        <!-- Clear button -->
        @if (query() && !loading()) {
          <button
            type="button"
            class="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            (click)="clearSearch()"
          >
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        }

        <!-- Shortcut hint -->
        @if (showShortcut() && !isFocused() && !query()) {
          <kbd
            class="hidden sm:inline-flex px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded text-gray-400"
          >
            {{ shortcutHint() }}
          </kbd>
        }
      </div>

      <!-- Suggestions dropdown -->
      @if (showSuggestions() && (suggestions().length > 0 || recentSearches().length > 0)) {
        <div
          class="absolute top-full left-0 right-0 mt-1 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto"
        >
          <!-- Recent searches -->
          @if (recentSearches().length > 0 && !query()) {
            <div class="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              Recent
            </div>
            @for (recent of recentSearches(); track recent) {
              <button
                type="button"
                class="w-full px-3 py-2 flex items-center gap-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                (click)="selectRecent(recent)"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ recent }}</span>
              </button>
            }
            <div class="h-px my-1 bg-gray-200 dark:bg-gray-700"></div>
          }

          <!-- Suggestions -->
          @for (suggestion of suggestions(); track suggestion.id) {
            <button
              type="button"
              class="w-full px-3 py-2 flex items-center gap-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              (click)="selectSuggestion(suggestion)"
            >
              @if (suggestion.icon) {
                <span class="text-gray-400">{{ suggestion.icon }}</span>
              }
              <div class="flex-1 min-w-0">
                <div class="text-gray-900 dark:text-gray-100 truncate">{{ suggestion.label }}</div>
                @if (suggestion.description) {
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ suggestion.description }}
                  </div>
                }
              </div>
              @if (suggestion.type) {
                <span
                  class="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  {{ suggestion.type }}
                </span>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-search-bar inline-block',
  },
})
export class TwSearchBarComponent {
  private readonly elementRef = inject(ElementRef);

  // Inputs
  public readonly placeholder = input('Search...');
  public readonly suggestions = input<SearchSuggestion[]>([]);
  public readonly filters = input<SearchFilter[]>([]);
  public readonly loading = input(false);
  public readonly fullWidth = input(false);
  public readonly showShortcut = input(true);
  public readonly shortcutHint = input('⌘K');

  // Outputs
  public readonly search = output<string>();
  public readonly queryChange = output<string>();
  public readonly suggestionSelect = output<SearchSuggestion>();
  public readonly filterChange = output<SearchFilter[]>();

  // State
  protected readonly query = signal('');
  protected readonly isFocused = signal(false);
  protected readonly showSuggestions = signal(false);
  protected readonly activeFilters = signal<SearchFilter[]>([]);
  protected readonly recentSearches = signal<string[]>([]);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestions.set(false);
    }
  }

  protected onFocus(): void {
    this.isFocused.set(true);
    this.showSuggestions.set(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      if (!this.isFocused()) {
        this.showSuggestions.set(false);
      }
    }, 200);
  }

  protected onQueryChange(query: string): void {
    this.query.set(query);
    this.queryChange.emit(query);
    this.showSuggestions.set(true);
  }

  protected submitSearch(): void {
    const q = this.query().trim();
    if (q) {
      // Add to recent searches
      this.recentSearches.update(recent => {
        const filtered = recent.filter(r => r !== q);
        return [q, ...filtered].slice(0, 5);
      });

      this.search.emit(q);
      this.showSuggestions.set(false);
    }
  }

  protected clearSearch(): void {
    this.query.set('');
    this.queryChange.emit('');
    this.showSuggestions.set(false);
  }

  protected selectSuggestion(suggestion: SearchSuggestion): void {
    this.query.set(suggestion.label);
    this.suggestionSelect.emit(suggestion);
    this.showSuggestions.set(false);
    this.submitSearch();
  }

  protected selectRecent(recent: string): void {
    this.query.set(recent);
    this.submitSearch();
  }

  protected removeFilter(filter: SearchFilter): void {
    this.activeFilters.update(filters => filters.filter(f => f.id !== filter.id));
    this.filterChange.emit(this.activeFilters());
  }

  // Public methods
  public addFilter(filter: SearchFilter): void {
    this.activeFilters.update(filters => [...filters, filter]);
    this.filterChange.emit(this.activeFilters());
  }

  public focus(): void {
    const input = this.elementRef.nativeElement.querySelector('input');
    input?.focus();
  }

  public clear(): void {
    this.clearSearch();
    this.activeFilters.set([]);
    this.filterChange.emit([]);
  }
}
