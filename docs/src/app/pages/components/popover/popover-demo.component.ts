import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwPopoverComponent, TwButtonComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-popover-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwPopoverComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent {
  basicCode = `<tw-popover>
  <tw-button trigger>Open Popover</tw-button>
  <div content>
    Popover content goes here
  </div>
</tw-popover>`;

  positionsCode = `<tw-popover position="top">...</tw-popover>
<tw-popover position="bottom">...</tw-popover>
<tw-popover position="left">...</tw-popover>
<tw-popover position="right">...</tw-popover>`;

  triggersCode = `<tw-popover trigger="click">...</tw-popover>
<tw-popover trigger="hover">...</tw-popover>`;
}

