import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilter, SearchSuggestion } from './native.types';

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
  templateUrl: './search-bar.component.html',
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
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    inputEl?.focus();
  }

  public clear(): void {
    this.clearSearch();
    this.activeFilters.set([]);
    this.filterChange.emit([]);
  }
}
