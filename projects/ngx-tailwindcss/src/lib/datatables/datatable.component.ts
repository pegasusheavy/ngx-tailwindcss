import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TableColumn, TableSize, TableVariant, TwTableComponent } from '../table/table.component';

@Component({
  selector: 'tw-datatables',
  standalone: true,
  imports: [CommonModule, TwTableComponent],
  templateUrl: './datatable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwDatatablesComponent {
  public readonly data = input<unknown[]>([]);
  /**
   * Column definitions forwarded to the underlying tw-table.
   * Columns are sortable by default; set `sortable: false` on a column to disable sorting for it.
   */
  public readonly columns = input<TableColumn[]>([]);
  public readonly title = input('');
  public readonly subtitle = input<string | undefined>(undefined);
  public readonly description = input<string | undefined>(undefined);
  public readonly tableSize = input<TableSize>('md');
  public readonly tableVariant = input<TableVariant>('striped');
  public readonly selectable = input(false);
  public readonly selectionMode = input<'single' | 'multiple'>('multiple');
  public readonly showGlobalFilter = input(true);
  public readonly paginator = input(true);
  public readonly rows = input(10);
  public readonly hoverable = input(true);
  public readonly responsive = input(true);
  public readonly emptyMessage = input('No records found');
  public readonly classOverride = input('');
  public readonly containerClass = input('');
  public readonly toolbarClass = input('');

  public readonly selectionChange = output<unknown[]>();
  public readonly rowClick = output<unknown>();
  public readonly sortChange = output<{ field: string; order: number }>();
  public readonly pageChange = output<{ page: number; rows: number }>();

  protected readonly baseContainerClass =
    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 space-y-6';

  protected readonly baseToolbarClass = 'flex items-center gap-2 flex-wrap';

  protected readonly containerClassList = computed(() =>
    [this.baseContainerClass, this.containerClass()].filter(Boolean).join(' ')
  );

  protected readonly toolbarClassList = computed(() =>
    [this.baseToolbarClass, this.toolbarClass()].filter(Boolean).join(' ')
  );
}
