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
  @Input() public data: unknown[] = [];
  @Input() public columns: TableColumn[] = [];
  @Input() public title = '';
  @Input() public subtitle?: string;
  @Input() public description?: string;
  @Input() public tableSize: TableSize = 'md';
  @Input() public tableVariant: TableVariant = 'striped';
  @Input() public selectable = false;
  @Input() public selectionMode: 'single' | 'multiple' = 'multiple';
  @Input() public showGlobalFilter = true;
  @Input() public paginator = true;
  @Input() public rows = 10;
  @Input() public hoverable = true;
  @Input() public responsive = true;
  @Input() public emptyMessage = 'No records found';
  @Input() public classOverride = '';
  @Input() public containerClass = '';
  @Input() public toolbarClass = '';

  @Output() public selectionChange = new EventEmitter<unknown[]>();
  @Output() public rowClick = new EventEmitter<unknown>();
  @Output() public sortChange = new EventEmitter<{ field: string; order: number }>();
  @Output() public pageChange = new EventEmitter<{ page: number; rows: number }>();

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


