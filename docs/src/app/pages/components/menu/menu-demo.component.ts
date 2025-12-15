import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwMenuComponent, TwButtonComponent, MenuItem } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwMenuComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './menu-demo.component.html',
})
export class MenuDemoComponent {
  menuItems: MenuItem[] = [
    { label: 'Edit', command: () => console.log('Edit') },
    { label: 'Duplicate', command: () => console.log('Duplicate') },
    { separator: true },
    { label: 'Archive', command: () => console.log('Archive') },
    { label: 'Delete', command: () => console.log('Delete'), styleClass: 'text-rose-600' },
  ];

  basicCode = `<tw-menu [items]="menuItems">
  <tw-button trigger>Open Menu</tw-button>
</tw-menu>

// Component
menuItems: MenuItem[] = [
  { label: 'Edit', command: () => {} },
  { label: 'Duplicate', command: () => {} },
  { separator: true },
  { label: 'Delete', styleClass: 'text-rose-600' },
];`;

  groupsCode = `menuItems = [
  { label: 'Actions', items: [
    { label: 'Edit' },
    { label: 'Duplicate' },
  ]},
  { label: 'Danger Zone', items: [
    { label: 'Delete', styleClass: 'text-rose-600' },
  ]},
];`;
}
