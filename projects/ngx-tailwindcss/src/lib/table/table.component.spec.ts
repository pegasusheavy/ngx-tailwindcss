import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TableColumn, TwTableComponent } from './table.component';
import { TwClassService } from '../core/tw-class.service';

interface Row {
  id: number;
  name: string;
  age: number;
}

@Component({
  template: `
    <tw-table
      [data]="data()"
      [columns]="columns()"
      [selectable]="selectable()"
      [selectionMode]="selectionMode()"
      [paginator]="paginator()"
      [rows]="rows()"
      [rowsPerPageOptions]="rowsPerPageOptions()"
      [trackByFn]="trackByFn"
      (selectionChange)="onSelectionChangeSpy($event)"
      (sortChange)="onSortChangeSpy($event)"
      (pageChange)="onPageChangeSpy($event)"
      (rowClick)="onRowClickSpy($event)"
      data-testid="test-table"
    >
      <ng-template #twTableActions>
        <button type="button" data-testid="header-action">Export</button>
      </ng-template>
      <ng-template #twRowActions let-row>
        <button type="button" data-testid="row-action">Edit {{ row.name }}</button>
      </ng-template>
    </tw-table>
  `,
  standalone: true,
  imports: [TwTableComponent],
})
class TestHostComponent {
  @ViewChild(TwTableComponent) table!: TwTableComponent;
  data = signal<Row[]>([
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Carol', age: 35 },
  ]);
  columns = signal<TableColumn[]>([
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
  ]);
  selectable = signal(false);
  selectionMode = signal<'single' | 'multiple'>('multiple');
  paginator = signal(false);
  rows = signal(10);
  rowsPerPageOptions = signal([2, 5, 10]);
  trackByFn = (item: Row) => item.id;

  onSelectionChangeSpy = vi.fn();
  onSortChangeSpy = vi.fn();
  onPageChangeSpy = vi.fn();
  onRowClickSpy = vi.fn();
}

describe('TwTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let tableEl: DebugElement;

  const bodyRows = () => tableEl.queryAll(By.css('tbody tr'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tableEl = fixture.debugElement.query(By.directive(TwTableComponent));
  });

  it('should create the table', () => {
    expect(tableEl).toBeTruthy();
    expect(component.table).toBeTruthy();
  });

  it('should render one row per data item', () => {
    expect(bodyRows().length).toBe(3);
    expect(tableEl.nativeElement.textContent).toContain('Alice');
    expect(tableEl.nativeElement.textContent).toContain('Bob');
    expect(tableEl.nativeElement.textContent).toContain('Carol');
  });

  describe('data reactivity', () => {
    it('should re-render when data is replaced after init', () => {
      component.data.set([
        { id: 4, name: 'Dave', age: 40 },
        { id: 5, name: 'Eve', age: 45 },
      ]);
      fixture.detectChanges();

      expect(bodyRows().length).toBe(2);
      expect(tableEl.nativeElement.textContent).toContain('Dave');
      expect(tableEl.nativeElement.textContent).toContain('Eve');
      expect(tableEl.nativeElement.textContent).not.toContain('Alice');
    });

    it('should re-render when columns are replaced after init', () => {
      component.columns.set([{ field: 'id', header: 'Identifier' }]);
      fixture.detectChanges();

      const headers = tableEl.queryAll(By.css('th'));
      expect(headers.length).toBe(2); // id column + row actions column
      expect(tableEl.nativeElement.textContent).toContain('Identifier');
      expect(tableEl.nativeElement.textContent).not.toContain('Age');
    });

    it('should show empty message when data is emptied after init', () => {
      component.data.set([]);
      fixture.detectChanges();
      expect(tableEl.nativeElement.textContent).toContain('No records found');
    });
  });

  describe('sorting', () => {
    const nameHeader = () => tableEl.queryAll(By.css('th'))[0];
    const nameSortButton = () => nameHeader().query(By.css('button'));

    it('should render sortable header content in a button', () => {
      expect(nameSortButton()).toBeTruthy();
      expect(nameSortButton().nativeElement.textContent).toContain('Name');
    });

    it('should expose aria-sort="none" on sortable unsorted columns', () => {
      expect(nameHeader().nativeElement.getAttribute('aria-sort')).toBe('none');
    });

    it('should toggle aria-sort ascending/descending on sort', () => {
      nameSortButton().nativeElement.click();
      fixture.detectChanges();
      expect(nameHeader().nativeElement.getAttribute('aria-sort')).toBe('ascending');
      expect(component.onSortChangeSpy).toHaveBeenCalledWith({ field: 'name', order: 1 });

      nameSortButton().nativeElement.click();
      fixture.detectChanges();
      expect(nameHeader().nativeElement.getAttribute('aria-sort')).toBe('descending');
      expect(component.onSortChangeSpy).toHaveBeenCalledWith({ field: 'name', order: -1 });
    });

    it('should sort displayed rows', () => {
      nameSortButton().nativeElement.click();
      fixture.detectChanges();
      const cells = bodyRows().map(row => row.nativeElement.textContent);
      expect(cells[0]).toContain('Alice');
      expect(cells[2]).toContain('Carol');
    });

    it('should not render a sort button for non-sortable columns', () => {
      component.columns.set([{ field: 'name', header: 'Name', sortable: false }]);
      fixture.detectChanges();
      const header = tableEl.queryAll(By.css('th'))[0];
      expect(header.query(By.css('button'))).toBeNull();
      expect(header.nativeElement.getAttribute('aria-sort')).toBeNull();
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      component.selectable.set(true);
      fixture.detectChanges();
    });

    it('should label the select-all and row checkboxes', () => {
      const selectAll = tableEl.query(By.css('thead input[type="checkbox"]'));
      const rowCheckbox = tableEl.query(By.css('tbody input[type="checkbox"]'));
      expect(selectAll.nativeElement.getAttribute('aria-label')).toBe('Select all rows');
      expect(rowCheckbox.nativeElement.getAttribute('aria-label')).toBe('Select row');
    });

    it('should toggle selection on row click and emit an array', () => {
      bodyRows()[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.onSelectionChangeSpy).toHaveBeenCalledWith([component.data()[0]]);
      expect(component.table.isSelected(component.data()[0])).toBe(true);
    });

    it('should deselect an already selected row', () => {
      const row = component.data()[0];
      component.table.toggleSelection(row);
      component.table.toggleSelection(row);
      expect(component.table.isSelected(row)).toBe(false);
      expect(component.onSelectionChangeSpy).toHaveBeenLastCalledWith([]);
    });

    it('should keep a single selection in single mode', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      component.table.toggleSelection(component.data()[0]);
      component.table.toggleSelection(component.data()[1]);
      expect(component.table.isSelected(component.data()[0])).toBe(false);
      expect(component.table.isSelected(component.data()[1])).toBe(true);
    });

    it('should select and clear all displayed rows via select-all', () => {
      component.table.toggleSelectAll();
      expect(component.onSelectionChangeSpy).toHaveBeenLastCalledWith(component.data());
      component.table.toggleSelectAll();
      expect(component.onSelectionChangeSpy).toHaveBeenLastCalledWith([]);
    });

    it('should apply the selected row class', () => {
      bodyRows()[0].nativeElement.click();
      fixture.detectChanges();
      expect(bodyRows()[0].nativeElement.className).toContain('bg-blue-50');
    });

    it('should clear selection via clearSelection', () => {
      component.table.toggleSelectAll();
      component.table.clearSelection();
      expect(component.onSelectionChangeSpy).toHaveBeenLastCalledWith([]);
    });
  });

  describe('action templates', () => {
    it('should render the header actions template', () => {
      const headerAction = tableEl.query(By.css('[data-testid="header-action"]'));
      expect(headerAction).toBeTruthy();
      expect(headerAction.nativeElement.textContent).toContain('Export');
    });

    it('should render the row actions template once per row with row context', () => {
      const rowActions = tableEl.queryAll(By.css('[data-testid="row-action"]'));
      expect(rowActions.length).toBe(3);
      expect(rowActions[0].nativeElement.textContent).toContain('Edit Alice');
      expect(rowActions[1].nativeElement.textContent).toContain('Edit Bob');
    });

    it('should render an Actions header column', () => {
      const headers = tableEl.queryAll(By.css('th'));
      expect(headers.at(-1)!.nativeElement.textContent).toContain('Actions');
    });
  });

  describe('pagination and rows per page', () => {
    beforeEach(() => {
      component.paginator.set(true);
      component.rows.set(2);
      fixture.detectChanges();
    });

    it('should paginate using the rows input', () => {
      expect(bodyRows().length).toBe(2);
    });

    it('should render a labeled rows-per-page select with the options', () => {
      const select = tableEl.query(By.css('select[aria-label="Rows per page"]'));
      expect(select).toBeTruthy();
      const options = select.queryAll(By.css('option'));
      expect(options.map(o => o.nativeElement.textContent.trim())).toEqual(['2', '5', '10']);
    });

    it('should update page size and emit pageChange when changed', () => {
      const select = tableEl.query(By.css('select[aria-label="Rows per page"]'))
        .nativeElement as HTMLSelectElement;
      select.value = '5';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.onPageChangeSpy).toHaveBeenCalledWith({ page: 1, rows: 5 });
      expect(bodyRows().length).toBe(3);
    });

    it('should follow a later change to the rows input', () => {
      component.rows.set(1);
      fixture.detectChanges();
      expect(bodyRows().length).toBe(1);
    });

    it('should emit pageChange when navigating pages', () => {
      component.table.goToPage(2);
      expect(component.onPageChangeSpy).toHaveBeenCalledWith({ page: 2, rows: 2 });
    });
  });
});
