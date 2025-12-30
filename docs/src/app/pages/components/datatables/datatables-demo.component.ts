import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwDatatablesComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-datatables-demo',
  standalone: true,
  imports: [CommonModule, TwDatatablesComponent, DemoSectionComponent, PageHeaderComponent],
  templateUrl: './datatables-demo.component.html',
})
export class DatatablesDemoComponent {
  users = [
    {
      id: 1,
      name: 'Nora Delgado',
      email: 'nora@stellar.team',
      role: 'Admin',
      status: 'Active',
      created: '2025-11-12',
    },
    {
      id: 2,
      name: 'Marcus Finch',
      email: 'marcus@stellar.team',
      role: 'Designer',
      status: 'Active',
      created: '2025-10-28',
    },
    {
      id: 3,
      name: 'Priya Shah',
      email: 'priya@stellar.team',
      role: 'Engineer',
      status: 'Pending',
      created: '2025-10-02',
    },
    {
      id: 4,
      name: 'Leo Park',
      email: 'leo@stellar.team',
      role: 'Product',
      status: 'Active',
      created: '2025-09-15',
    },
    {
      id: 5,
      name: 'Ivy Morales',
      email: 'ivy@stellar.team',
      role: 'Research',
      status: 'Idle',
      created: '2025-08-29',
    },
    {
      id: 6,
      name: 'Cassidy Brandt',
      email: 'cassidy@stellar.team',
      role: 'Support',
      status: 'Active',
      created: '2025-07-10',
    },
  ];

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
    { field: 'status', header: 'Status' },
    { field: 'created', header: 'Joined' },
  ];

  basicCode = `<tw-datatables
  [data]="users"
  [columns]="columns"
  title="Customer Directory"
  subtitle="Live CRM data"
  description="Sort, search, select, and paginate without additional wiring."
  [paginator]="true"
  [rows]="5"
  [selectable]="true"
  [showGlobalFilter]="true"
  tableVariant="striped"
  tableSize="md"
>
  <button
    twDatatablesActions
    class="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
  >
    Export CSV
  </button>
</tw-datatables>`;

  compactCode = `<tw-datatables
  [data]="users"
  [columns]="columns"
  title="Compact View"
  description="Perfect for dashboards that need a tighter density."
  [paginator]="false"
  [rows]="users.length"
  tableVariant="bordered"
  tableSize="sm"
  [showGlobalFilter]="false"
>
  <button twDatatablesActions class="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white">
    Bulk Actions
  </button>
</tw-datatables>`;
}








