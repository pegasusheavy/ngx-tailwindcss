import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwDatatablesComponent } from './datatable.component';
import { TableColumn } from '../table/table.component';
import { TwClassService } from '../core/tw-class.service';

interface Person {
  name: string;
  age: number;
}

@Component({
  template: `
    <tw-datatables
      [data]="data()"
      [columns]="columns()"
      [title]="title()"
      [subtitle]="subtitle()"
      [paginator]="false"
      [showGlobalFilter]="false"
      data-testid="test-datatables"
    >
    </tw-datatables>
  `,
  standalone: true,
  imports: [TwDatatablesComponent],
})
class TestHostComponent {
  @ViewChild(TwDatatablesComponent) datatables!: TwDatatablesComponent;
  data = signal<Person[]>([
    { name: 'Ada', age: 36 },
    { name: 'Grace', age: 45 },
  ]);
  columns = signal<TableColumn[]>([
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
  ]);
  title = signal('People');
  subtitle = signal('');
}

describe('TwDatatablesComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the datatables wrapper', () => {
    expect(component.datatables).toBeTruthy();
  });

  it('should render the title', () => {
    const heading = fixture.debugElement.query(By.css('h3'));
    expect(heading.nativeElement.textContent).toContain('People');
  });

  it('should render the subtitle when provided', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Directory');

    component.subtitle.set('Directory');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Directory');
  });

  it('should render rows from data', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Ada');
    expect(rows[1].nativeElement.textContent).toContain('Grace');
  });

  it('should re-render when data is replaced after init', () => {
    component.data.set([
      { name: 'Katherine', age: 101 },
      { name: 'Margaret', age: 88 },
      { name: 'Radia', age: 71 },
    ]);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);
    expect(rows[0].nativeElement.textContent).toContain('Katherine');
    expect(fixture.nativeElement.textContent).not.toContain('Ada');
  });

  it('should re-render when columns are replaced after init', () => {
    component.columns.set([{ field: 'name', header: 'Full Name' }]);
    fixture.detectChanges();

    const headers = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headers.length).toBe(1);
    expect(headers[0].nativeElement.textContent).toContain('Full Name');
  });
});
