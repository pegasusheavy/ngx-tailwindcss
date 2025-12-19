import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTableComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwTableComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './table-demo.component.html',
})
export class TableDemoComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
  ];

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
  ];

  basicCode = `<tw-table [data]="users" [columns]="columns"></tw-table>

// Component
users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  // ...
];

columns = [
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'role', header: 'Role' },
];`;

  variantsCode = `<tw-table [data]="users" [columns]="columns" variant="default"></tw-table>
<tw-table [data]="users" [columns]="columns" variant="striped"></tw-table>`;

  sizesCode = `<tw-table [data]="users" [columns]="columns" size="sm"></tw-table>
<tw-table [data]="users" [columns]="columns" size="md"></tw-table>
<tw-table [data]="users" [columns]="columns" size="lg"></tw-table>`;

  hoverCode = `<tw-table [data]="users" [columns]="columns" [hoverable]="true"></tw-table>`;

  filterCode = `<tw-table
  [data]="users"
  [columns]="columns"
  showGlobalFilter="true"
  filterPlaceholder="Search customers..."
  [paginator]="true"
  [rows]="3"
  tableVariant="bordered"
  classOverride="text-slate-700 dark:text-slate-300"
></tw-table>`;
}
