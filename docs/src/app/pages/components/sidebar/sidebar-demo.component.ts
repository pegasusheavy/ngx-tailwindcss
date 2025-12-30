import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSidebarComponent, TwButtonComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-sidebar-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSidebarComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './sidebar-demo.component.html',
})
export class SidebarDemoComponent {
  leftSidebarVisible = false;
  rightSidebarVisible = false;

  basicCode = `<tw-button (click)="sidebarVisible = true">Open Sidebar</tw-button>

<tw-sidebar [visibleInput]="sidebarVisible" (visibleChange)="sidebarVisible = $event" position="left" header="Menu">
  <p>Sidebar content</p>
</tw-sidebar>`;

  positionsCode = `<tw-sidebar position="left">...</tw-sidebar>
<tw-sidebar position="right">...</tw-sidebar>
<tw-sidebar position="top">...</tw-sidebar>
<tw-sidebar position="bottom">...</tw-sidebar>`;

  sizesCode = `<tw-sidebar size="sm">...</tw-sidebar>
<tw-sidebar size="md">...</tw-sidebar>
<tw-sidebar size="lg">...</tw-sidebar>
<tw-sidebar size="full">...</tw-sidebar>`;
}
