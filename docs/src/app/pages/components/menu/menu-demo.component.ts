import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwMenuComponent,
  TwButtonComponent,
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownTriggerDirective,
  MenuItem,
} from '@quinnjr/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwMenuComponent,
    TwButtonComponent,
    TwDropdownComponent,
    TwDropdownMenuComponent,
    TwDropdownTriggerDirective,
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

  fileMenuItems: MenuItem[] = [
    { label: 'New File', shortcut: '⌘N' },
    { label: 'New Window', shortcut: '⌘⇧N' },
    { separator: true },
    { label: 'Open...', shortcut: '⌘O' },
    { label: 'Save', shortcut: '⌘S' },
    { label: 'Save As...', shortcut: '⌘⇧S' },
    { separator: true },
    { label: 'Print', shortcut: '⌘P' },
  ];

  groupedMenuItems: MenuItem[] = [
    { label: 'Account', items: [
      { label: 'Profile' },
      { label: 'Settings' },
      { label: 'Billing' },
    ]},
    { label: 'Team', items: [
      { label: 'Members' },
      { label: 'Invite' },
    ]},
    { separator: true },
    { label: 'Sign Out', styleClass: 'text-rose-600' },
  ];

  editMenuItems: MenuItem[] = [
    { label: 'Cut', shortcut: '⌘X' },
    { label: 'Copy', shortcut: '⌘C' },
    { label: 'Paste', shortcut: '⌘V', disabled: true },
    { separator: true },
    { label: 'Select All', shortcut: '⌘A' },
  ];

  basicCode = `<tw-dropdown>
  <tw-button twDropdownTrigger variant="outline">Actions</tw-button>
  <tw-dropdown-menu>
    <tw-menu [items]="menuItems"></tw-menu>
  </tw-dropdown-menu>
</tw-dropdown>

// Component
menuItems: MenuItem[] = [
  { label: 'Edit', command: () => {} },
  { label: 'Duplicate', command: () => {} },
  { separator: true },
  { label: 'Delete', styleClass: 'text-rose-600' },
];`;

  fileMenuCode = `<tw-menu [items]="fileMenuItems"></tw-menu>

// Component
fileMenuItems: MenuItem[] = [
  { label: 'New File', shortcut: '⌘N' },
  { label: 'New Window', shortcut: '⌘⇧N' },
  { separator: true },
  { label: 'Open...', shortcut: '⌘O' },
  { label: 'Save', shortcut: '⌘S' },
  { label: 'Save As...', shortcut: '⌘⇧S' },
  { separator: true },
  { label: 'Print', shortcut: '⌘P' },
];`;

  groupsCode = `<tw-menu [items]="groupedMenuItems"></tw-menu>

// Component
groupedMenuItems: MenuItem[] = [
  { label: 'Account', items: [
    { label: 'Profile' },
    { label: 'Settings' },
    { label: 'Billing' },
  ]},
  { label: 'Team', items: [
    { label: 'Members' },
    { label: 'Invite' },
  ]},
  { separator: true },
  { label: 'Sign Out', styleClass: 'text-rose-600' },
];`;

  disabledCode = `<tw-menu [items]="editMenuItems"></tw-menu>

// Component
editMenuItems: MenuItem[] = [
  { label: 'Cut', shortcut: '⌘X' },
  { label: 'Copy', shortcut: '⌘C' },
  { label: 'Paste', shortcut: '⌘V', disabled: true },
  { separator: true },
  { label: 'Select All', shortcut: '⌘A' },
];`;
}
