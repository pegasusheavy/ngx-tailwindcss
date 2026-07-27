import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTableComponent } from '@quinnjr/ngx-tailwindcss';
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

  selectedUsers: any[] = [];

  onSelectionChange(selection: any[]): void {
    this.selectedUsers = selection;
  }

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
  showGlobalFilter
  filterPlaceholder="Search customers..."
  [paginator]="true"
  [rows]="3"
  variant="bordered"
></tw-table>`;

  selectableCode = `<tw-table
  [data]="users"
  [columns]="columns"
  [selectable]="true"
  selectionMode="multiple"
  (selectionChange)="onSelectionChange($event)"
></tw-table>

<p>Selected: {{ selectedUsers.length }}</p>`;
}
