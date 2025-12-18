import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  EventEmitter,
  inject,
  Input,
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

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title = '';
  @Input() size: TableSize = 'md';
  @Input() variant: TableVariant = 'default';
  @Input({ transform: booleanAttribute }) selectable = false;
  @Input() selectionMode: 'single' | 'multiple' = 'multiple';
  @Input({ transform: booleanAttribute }) showGlobalFilter = false;
  @Input() filterPlaceholder = 'Search...';
  @Input({ transform: booleanAttribute }) paginator = false;
  @Input({ transform: numberAttribute }) rows = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];
  @Input() emptyMessage = 'No records found';
  @Input({ transform: booleanAttribute }) hoverable = true;
  @Input({ transform: booleanAttribute }) responsive = true;
  @Input() trackByFn: (item: any) => any = item => item;
  @Input() classOverride = '';

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ field: string; order: number }>();
  @Output() pageChange = new EventEmitter<{ page: number; rows: number }>();

  @ContentChild('twTableActions') headerActionsTemplate!: TemplateRef<any>;
  @ContentChild('twRowActions') rowActionsTemplate!: TemplateRef<any>;

  protected globalFilter = signal('');
  protected sortField = signal<string>('');
  protected sortOrder = signal<1 | -1>(1);
  protected currentPage = signal(1);
  protected selection = signal<any[]>([]);

  protected get hasHeaderActions(): boolean {
    return !!this.headerActionsTemplate;
  }

  protected get hasRowActions(): boolean {
    return !!this.rowActionsTemplate;
  }

  protected get totalColumns(): number {
    let count = this.columns.length;
    if (this.selectable) count++;
    if (this.hasRowActions) count++;
    return count;
  }

  protected filteredData = computed(() => {
    let result = [...this.data];
    const filter = this.globalFilter().toLowerCase();
    if (filter) {
      result = result.filter(item =>
        this.columns.some(col => {
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
  protected totalPages = computed(() => Math.ceil(this.totalRecords() / this.rows));

  protected displayedData = computed(() => {
    if (!this.paginator) return this.filteredData();
    const start = (this.currentPage() - 1) * this.rows;
    return this.filteredData().slice(start, start + this.rows);
  });

  protected paginationStart = computed(() => {
    if (this.totalRecords() === 0) return 0;
    return (this.currentPage() - 1) * this.rows + 1;
  });

  protected paginationEnd = computed(() => {
    return Math.min(this.currentPage() * this.rows, this.totalRecords());
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
      this.classOverride
    );
  });

  protected tableWrapperClasses = computed(() => (this.responsive ? 'overflow-x-auto' : ''));

  protected tableClasses = computed(() => {
    const sizeClasses = TABLE_SIZES[this.size].text;
    return this.twClass.merge(
      'w-full',
      sizeClasses,
      this.variant === 'bordered' ? 'border-collapse' : ''
    );
  });

  protected theadClasses = computed(() => 'bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700');

  protected thClasses(col: TableColumn) {
    const sizeClasses = TABLE_SIZES[this.size].cell;
    const alignClasses =
      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
    return this.twClass.merge(
      'font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap',
      sizeClasses,
      alignClasses,
      col.sortable === false ? '' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none'
    );
  }

  protected tbodyClasses = computed(() => 'divide-y divide-slate-100 dark:divide-slate-700');

  protected trClasses(row: any, isOdd: boolean) {
    const isSelected = this.isSelected(row);
    return this.twClass.merge(
      'transition-colors',
      this.variant === 'striped' && isOdd ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800',
      this.hoverable ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
      isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : '',
      this.selectable ? 'cursor-pointer' : ''
    );
  }

  protected tdClasses(col: TableColumn) {
    const sizeClasses = TABLE_SIZES[this.size].cell;
    const alignClasses =
      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
    return this.twClass.merge(
      'text-slate-600 dark:text-slate-400',
      sizeClasses,
      alignClasses,
      this.variant === 'bordered' ? 'border border-slate-200 dark:border-slate-700' : ''
    );
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

  getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, k) => o?.[k], obj);
  }

  onGlobalFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.globalFilter.set(input.value);
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
    this.pageChange.emit({ page, rows: this.rows });
  }

  isSelected(row: any): boolean {
    return this.selection().includes(row);
  }

  toggleSelection(row: any): void {
    const current = this.selection();
    const index = current.indexOf(row);
    if (this.selectionMode === 'single') {
      this.selection.set(index === -1 ? [row] : []);
    } else if (index === -1) {
      this.selection.set([...current, row]);
    } else {
      this.selection.set(current.filter(r => r !== row));
    }
    this.selectionChange.emit(this.selection());
  }

  toggleSelectAll(): void {
    const displayed = this.displayedData();
    if (this.allSelected()) {
      this.selection.set(this.selection().filter(r => !displayed.includes(r)));
    } else {
      const newSelection = [...this.selection()];
      displayed.forEach(row => {
        if (!newSelection.includes(row)) newSelection.push(row);
      });
      this.selection.set(newSelection);
    }
    this.selectionChange.emit(this.selection());
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
    if (this.selectable) this.toggleSelection(row);
  }

  clearSelection(): void {
    this.selection.set([]);
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
