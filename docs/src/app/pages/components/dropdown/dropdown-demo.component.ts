import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faPen,
  faCopy,
  faTrash,
  faEllipsisVertical,
  faShare,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
  TwDropdownDividerComponent,
  TwDropdownHeaderComponent,
  TwDropdownTriggerDirective,
  TwButtonComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TwDropdownComponent,
    TwDropdownMenuComponent,
    TwDropdownItemDirective,
    TwDropdownDividerComponent,
    TwDropdownHeaderComponent,
    TwDropdownTriggerDirective,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './dropdown-demo.component.html',
})
export class DropdownDemoComponent {
  protected icons = {
    chevronDown: faChevronDown,
    pen: faPen,
    copy: faCopy,
    trash: faTrash,
    ellipsis: faEllipsisVertical,
    share: faShare,
    eye: faEye,
  };

  onAction(action: string): void {
    console.log('Action:', action);
  }

  // Code examples
  basicCode = `<tw-dropdown>
  <tw-button twDropdownTrigger variant="outline">
    Options
    <fa-icon [icon]="faChevronDown" class="ml-2"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem (click)="onAction('edit')">Edit</button>
    <button twDropdownItem (click)="onAction('duplicate')">Duplicate</button>
    <button twDropdownItem (click)="onAction('archive')">Archive</button>
  </tw-dropdown-menu>
</tw-dropdown>`;

  headersCode = `<tw-dropdown>
  <tw-button twDropdownTrigger variant="primary">
    Actions
    <fa-icon [icon]="faChevronDown" class="ml-2"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <tw-dropdown-header>Manage</tw-dropdown-header>
    <button twDropdownItem (click)="onAction('edit')">
      <fa-icon [icon]="faPen" class="mr-2"></fa-icon>
      Edit
    </button>
    <button twDropdownItem (click)="onAction('duplicate')">
      <fa-icon [icon]="faCopy" class="mr-2"></fa-icon>
      Duplicate
    </button>
    <tw-dropdown-divider></tw-dropdown-divider>
    <tw-dropdown-header>Danger Zone</tw-dropdown-header>
    <button twDropdownItem class="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
      <fa-icon [icon]="faTrash" class="mr-2"></fa-icon>
      Delete
    </button>
  </tw-dropdown-menu>
</tw-dropdown>`;

  positionsCode = `<!-- Bottom Start (default) -->
<tw-dropdown position="bottom-start">
  <tw-button twDropdownTrigger>Bottom Start</tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>Option 1</button>
    <button twDropdownItem>Option 2</button>
  </tw-dropdown-menu>
</tw-dropdown>

<!-- Bottom End -->
<tw-dropdown position="bottom-end">
  <tw-button twDropdownTrigger>Bottom End</tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>Option 1</button>
    <button twDropdownItem>Option 2</button>
  </tw-dropdown-menu>
</tw-dropdown>

<!-- Available: bottom-start, bottom-end, top-start, top-end -->`;

  iconCode = `<tw-dropdown>
  <tw-button twDropdownTrigger variant="ghost" [iconOnly]="true">
    <fa-icon twButtonIcon [icon]="faEllipsisVertical"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>View Details</button>
    <button twDropdownItem>Edit</button>
    <button twDropdownItem>Share</button>
    <tw-dropdown-divider></tw-dropdown-divider>
    <button twDropdownItem class="text-rose-600">Delete</button>
  </tw-dropdown-menu>
</tw-dropdown>`;
}
