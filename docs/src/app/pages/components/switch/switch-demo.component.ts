import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwSwitchComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwSwitchComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './switch-demo.component.html',
})
export class SwitchDemoComponent {
  darkMode = false;
  notifications = true;

  basicCode = `<tw-switch [(ngModel)]="darkMode">Dark Mode</tw-switch>`;

  variantsCode = `<tw-switch variant="primary">Primary</tw-switch>
<tw-switch variant="secondary">Secondary</tw-switch>
<tw-switch variant="success">Success</tw-switch>
<tw-switch variant="warning">Warning</tw-switch>
<tw-switch variant="danger">Danger</tw-switch>`;

  sizesCode = `<tw-switch size="sm">Small</tw-switch>
<tw-switch size="md">Medium</tw-switch>
<tw-switch size="lg">Large</tw-switch>`;

  labelPositionCode = `<tw-switch labelPosition="right">Label Right</tw-switch>
<tw-switch labelPosition="left">Label Left</tw-switch>`;
}
