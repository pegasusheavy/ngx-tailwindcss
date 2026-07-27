import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  template?: TemplateRef<any>;
}

export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'default' | 'striped' | 'bordered';

const TABLE_SIZES: Record<TableSize, { cell: string; text: string }> = {
  sm: { cell: 'px-3 py-2', text: 'text-sm' },
  md: { cell: 'px-4 py-3', text: 'text-sm' },
  lg: { cell: 'px-6 py-4', text: 'text-base' },
};

/**
 * Table/DataTable component with Tailwind CSS styling
 *
 * Header and per-row action slots are provided as named templates:
 *
 * @example
 * ```html
 * <tw-table [data]="rows" [columns]="cols">
 *   <ng-template #twTableActions>
 *     <button>Export</button>
 *   </ng-template>
 *   <ng-template #twRowActions let-row>
 *     <button (click)="edit(row)">Edit</button>
 *   </ng-template>
 * </tw-table>
 * ```
 */
@Component({
  selector: 'tw-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
})
export class TwTableComponent {
  private readonly twClass = inject(TwClassService);

  readonly data = input<any[]>([]);
  readonly columns = input<TableColumn[]>([]);
  readonly title = input('');
  readonly size = input<TableSize>('md');
  readonly variant = input<TableVariant>('default');
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectionMode = input<'single' | 'multiple'>('multiple');
  readonly showGlobalFilter = input(false, { transform: booleanAttribute });
  readonly filterPlaceholder = input('Search...');
  readonly paginator = input(false, { transform: booleanAttribute });
  readonly rows = input(10, { transform: numberAttribute });
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);
  readonly emptyMessage = input('No records found');
  readonly hoverable = input(true, { transform: booleanAttribute });
  readonly responsive = input(true, { transform: booleanAttribute });
  readonly trackByFn = input<(item: any) => any>(item => item);
  readonly classOverride = input('');

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ field: string; order: number }>();
  @Output() pageChange = new EventEmitter<{ page: number; rows: number }>();

  readonly headerActionsTemplate = contentChild('twTableActions', { read: TemplateRef });
  readonly rowActionsTemplate = contentChild('twRowActions', { read: TemplateRef });

  protected globalFilter = signal('');
  protected sortField = signal<string>('');
  protected sortOrder = signal<1 | -1>(1);
  protected currentPage = signal(1);
  /** Current page size; follows the `rows` input until changed via the rows-per-page select. */
  protected pageSize = linkedSignal(() => this.rows());
  /** Selection is held as a Set internally for O(1) lookups; emitted as an array. */
  protected selection = signal<ReadonlySet<any>>(new Set());

  protected readonly hasHeaderActions = computed(() => !!this.headerActionsTemplate());

  protected readonly hasRowActions = computed(() => !!this.rowActionsTemplate());

  protected readonly totalColumns = computed(() => {
    let count = this.columns().length;
    if (this.selectable()) count++;
    if (this.hasRowActions()) count++;
    return count;
  });

  protected filteredData = computed(() => {
    let result = [...this.data()];
    const columns = this.columns();
    const filter = this.globalFilter().toLowerCase();
    if (filter) {
      result = result.filter(item =>
        columns.some(col => {
          const value = this.getFieldValue(item, col.field);
          return value?.toString().toLowerCase().includes(filter);
        })
      );
    }
    const field = this.sortField();
    if (field) {
      result.sort((a, b) => {
        const aVal = this.getFieldValue(a, field);
        const bVal = this.getFieldValue(b, field);
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return comparison * this.sortOrder();
      });
    }
    return result;
  });

  protected totalRecords = computed(() => this.filteredData().length);
  protected totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

  protected displayedData = computed(() => {
    if (!this.paginator()) return this.filteredData();
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredData().slice(start, start + this.pageSize());
  });

  protected paginationStart = computed(() => {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  protected paginationEnd = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
  });

  protected visiblePages = computed((): Array<number | string> => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: Array<number | string> = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  protected allSelected = computed(() => {
    const displayed = this.displayedData();
    return displayed.length > 0 && displayed.every(row => this.isSelected(row));
  });

  protected someSelected = computed(() => {
    const displayed = this.displayedData();
    const selectedCount = displayed.filter(row => this.isSelected(row)).length;
    return selectedCount > 0 && selectedCount < displayed.length;
  });

  protected containerClasses = computed(() => {
    return this.twClass.merge(
      'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden',
      this.classOverride()
    );
  });

  protected tableWrapperClasses = computed(() => (this.responsive() ? 'overflow-x-auto' : ''));

  protected tableClasses = computed(() => {
    const sizeClasses = TABLE_SIZES[this.size()].text;
    return this.twClass.merge(
      'w-full',
      sizeClasses,
      this.variant() === 'bordered' ? 'border-collapse' : ''
    );
  });

  protected theadClasses = computed(
    () => 'bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700'
  );

  protected tbodyClasses = computed(() => 'divide-y divide-slate-100 dark:divide-slate-700');

  /** Per-column th/td class map, recomputed only when columns/size/variant change. */
  private readonly columnClassMap = computed(() => {
    const sizeClasses = TABLE_SIZES[this.size()].cell;
    const bordered = this.variant() === 'bordered';
    const map = new Map<TableColumn, { th: string; td: string }>();
    for (const col of this.columns()) {
      const alignClasses =
        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
      map.set(col, {
        th: this.twClass.merge(
          'font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap',
          sizeClasses,
          alignClasses,
          col.sortable === false
            ? ''
            : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none'
        ),
        td: this.twClass.merge(
          'text-slate-600 dark:text-slate-400',
          sizeClasses,
          alignClasses,
          bordered ? 'border border-slate-200 dark:border-slate-700' : ''
        ),
      });
    }
    return map;
  });

  protected thClasses(col: TableColumn): string {
    return this.columnClassMap().get(col)?.th ?? '';
  }

  protected tdClasses(col: TableColumn): string {
    return this.columnClassMap().get(col)?.td ?? '';
  }

  /** Row class matrix memoized per selected/odd combination. */
  private readonly rowClassMatrix = computed(() => {
    const striped = this.variant() === 'striped';
    const hover = this.hoverable() ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '';
    const pointer = this.selectable() ? 'cursor-pointer' : '';
    const build = (isSelected: boolean, isOdd: boolean) =>
      this.twClass.merge(
        'transition-colors',
        striped && isOdd ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800',
        hover,
        isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : '',
        pointer
      );
    return {
      selectedOdd: build(true, true),
      selectedEven: build(true, false),
      odd: build(false, true),
      even: build(false, false),
    };
  });

  protected trClasses(row: any, isOdd: boolean): string {
    const matrix = this.rowClassMatrix();
    if (this.isSelected(row)) {
      return isOdd ? matrix.selectedOdd : matrix.selectedEven;
    }
    return isOdd ? matrix.odd : matrix.even;
  }

  protected pageButtonClasses(page: number) {
    const isCurrent = page === this.currentPage();
    return this.twClass.merge(
      'w-8 h-8 text-sm font-medium rounded-lg transition-colors',
      isCurrent
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
    );
  }

  protected ariaSort(col: TableColumn): 'ascending' | 'descending' | 'none' | null {
    if (col.sortable === false) return null;
    if (this.sortField() !== col.field) return 'none';
    return this.sortOrder() === 1 ? 'ascending' : 'descending';
  }

  getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, k) => o?.[k], obj);
  }

  onGlobalFilterChange(event: Event): void {
    const filterInput = event.target as HTMLInputElement;
    this.globalFilter.set(filterInput.value);
    this.currentPage.set(1);
  }

  onSort(col: TableColumn): void {
    if (col.sortable === false) return;
    if (this.sortField() === col.field) {
      this.sortOrder.set(this.sortOrder() === 1 ? -1 : 1);
    } else {
      this.sortField.set(col.field);
      this.sortOrder.set(1);
    }
    this.sortChange.emit({ field: this.sortField(), order: this.sortOrder() });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.pageChange.emit({ page, rows: this.pageSize() });
  }

  onRowsPerPageChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(value) || value <= 0) return;
    this.pageSize.set(value);
    this.currentPage.set(1);
    this.pageChange.emit({ page: 1, rows: value });
  }

  isSelected(row: any): boolean {
    return this.selection().has(row);
  }

  toggleSelection(row: any): void {
    const next = new Set(this.selection());
    if (this.selectionMode() === 'single') {
      const wasSelected = next.has(row);
      next.clear();
      if (!wasSelected) next.add(row);
    } else if (next.has(row)) {
      next.delete(row);
    } else {
      next.add(row);
    }
    this.selection.set(next);
    this.selectionChange.emit([...next]);
  }

  toggleSelectAll(): void {
    const displayed = this.displayedData();
    const next = new Set(this.selection());
    if (this.allSelected()) {
      displayed.forEach(row => next.delete(row));
    } else {
      displayed.forEach(row => next.add(row));
    }
    this.selection.set(next);
    this.selectionChange.emit([...next]);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
    if (this.selectable()) this.toggleSelection(row);
  }

  clearSelection(): void {
    this.selection.set(new Set());
    this.selectionChange.emit([]);
  }

  reset(): void {
    this.globalFilter.set('');
    this.sortField.set('');
    this.sortOrder.set(1);
    this.currentPage.set(1);
    this.clearSelection();
  }
}
