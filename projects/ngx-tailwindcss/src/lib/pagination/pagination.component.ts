import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationVariant = 'default' | 'outlined' | 'simple';

@Component({
  selector: 'tw-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
})
export class TwPaginationComponent {
  @Input() set currentPage(value: number) { this._currentPage.set(value); }
  @Input() set totalPages(value: number) { this._totalPages.set(value); }
  @Input() set totalItems(value: number) { this._totalItems.set(value); }
  @Input() set itemsPerPage(value: number) { this._itemsPerPage.set(value); }
  @Input() set siblingCount(value: number) { this._siblingCount.set(value); }
  @Input() set size(value: PaginationSize) { this._size.set(value); }
  @Input() set variant(value: PaginationVariant) { this._variant.set(value); }
  @Input() set showFirstLast(value: boolean) { this._showFirstLast.set(value); }

  @Output() pageChange = new EventEmitter<number>();

  protected _currentPage = signal(1);
  protected _totalPages = signal(1);
  protected _totalItems = signal(0);
  protected _itemsPerPage = signal(10);
  protected _siblingCount = signal(1);
  protected _size = signal<PaginationSize>('md');
  protected _variant = signal<PaginationVariant>('default');
  protected _showFirstLast = signal(false);

  protected currentPageValue = computed(() => this._currentPage());
  protected variantValue = computed(() => this._variant());

  protected totalPagesValue = computed(() => {
    const totalPages = this._totalPages();
    const totalItems = this._totalItems();
    const itemsPerPage = this._itemsPerPage();

    if (totalPages > 0) return totalPages;
    if (totalItems > 0) return Math.ceil(totalItems / itemsPerPage);
    return 1;
  });

  protected visiblePages = computed(() => {
    const current = this._currentPage();
    const total = this.totalPagesValue();
    const siblings = this._siblingCount();

    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const totalNumbers = siblings * 2 + 3; // siblings + first + last + current
    const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

    if (total <= totalBlocks) {
      return range(1, total).map(String);
    }

    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, total);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < total - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, 3 + siblings * 2);
      return [...leftRange.map(String), '...', String(total)];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(total - (3 + siblings * 2) + 1, total);
      return ['1', '...', ...rightRange.map(String)];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return ['1', '...', ...middleRange.map(String), '...', String(total)];
  });

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPagesValue() && page !== this._currentPage()) {
      this.pageChange.emit(page);
    }
  }

  protected navButtonClasses(disabled: boolean): string {
    const size = this._size();
    const variant = this._variant();

    const sizeClasses: Record<PaginationSize, string> = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-2.5',
    };

    const baseClasses = [
      'flex items-center justify-center rounded-lg transition-colors',
      sizeClasses[size],
    ];

    if (disabled) {
      baseClasses.push('text-slate-300 cursor-not-allowed');
    } else {
      if (variant === 'outlined') {
        baseClasses.push('text-slate-600 hover:bg-slate-100 border border-slate-300');
      } else {
        baseClasses.push('text-slate-600 hover:bg-slate-100');
      }
    }

    return baseClasses.join(' ');
  }

  protected pageButtonClasses(isActive: boolean): string {
    const size = this._size();
    const variant = this._variant();

    const sizeClasses: Record<PaginationSize, string> = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    const baseClasses = [
      'flex items-center justify-center rounded-lg font-medium transition-colors',
      sizeClasses[size],
    ];

    if (isActive) {
      baseClasses.push('bg-blue-600 text-white');
    } else {
      if (variant === 'outlined') {
        baseClasses.push('text-slate-600 hover:bg-slate-100 border border-slate-300');
      } else {
        baseClasses.push('text-slate-600 hover:bg-slate-100');
      }
    }

    return baseClasses.join(' ');
  }

  protected ellipsisClasses(): string {
    const size = this._size();

    const sizeClasses: Record<PaginationSize, string> = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    return `flex items-center justify-center text-slate-400 ${sizeClasses[size]}`;
  }

  protected simpleButtonClasses(disabled: boolean): string {
    const baseClasses = [
      'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
    ];

    if (disabled) {
      baseClasses.push('text-slate-300 cursor-not-allowed');
    } else {
      baseClasses.push('text-slate-600 hover:bg-slate-100');
    }

    return baseClasses.join(' ');
  }
}

