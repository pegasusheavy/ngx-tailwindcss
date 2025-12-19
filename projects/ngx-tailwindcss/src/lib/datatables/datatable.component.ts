import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  TableColumn,
  TableSize,
  TableVariant,
  TwTableComponent,
} from '../table/table.component';

@Component({
  selector: 'tw-datatables',
  standalone: true,
  imports: [CommonModule, TwTableComponent],
  templateUrl: './datatable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwDatatablesComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() description?: string;
  @Input() tableSize: TableSize = 'md';
  @Input() tableVariant: TableVariant = 'striped';
  @Input() selectable = false;
  @Input() selectionMode: 'single' | 'multiple' = 'multiple';
  @Input() showGlobalFilter = true;
  @Input() paginator = true;
  @Input() rows = 10;
  @Input() hoverable = true;
  @Input() responsive = true;
  @Input() emptyMessage = 'No records found';
  @Input() classOverride = '';
  @Input() containerClass = '';
  @Input() toolbarClass = '';

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{ field: string; order: number }>();
  @Output() pageChange = new EventEmitter<{ page: number; rows: number }>();

  protected readonly baseContainerClass =
    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 space-y-6';

  protected readonly baseToolbarClass = 'flex items-center gap-2 flex-wrap';

  protected get containerClassList(): string {
    return [this.baseContainerClass, this.containerClass].filter(Boolean).join(' ');
  }

  protected get toolbarClassList(): string {
    return [this.baseToolbarClass, this.toolbarClass].filter(Boolean).join(' ');
  }
}


