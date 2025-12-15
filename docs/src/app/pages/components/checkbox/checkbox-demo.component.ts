import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwCheckboxComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwCheckboxComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
  checked = false;
  termsAccepted = false;
  variantPrimary = true;
  variantSecondary = true;
  variantSuccess = true;
  variantWarning = true;
  variantDanger = true;
  sizeSm = true;
  sizeMd = true;
  sizeLg = true;
  stateChecked = true;
  disabledChecked = true;

  basicCode = `<tw-checkbox [(ngModel)]="checked">Accept terms and conditions</tw-checkbox>`;

  variantsCode = `<tw-checkbox variant="primary" [(ngModel)]="value">Primary</tw-checkbox>
<tw-checkbox variant="secondary" [(ngModel)]="value">Secondary</tw-checkbox>
<tw-checkbox variant="success" [(ngModel)]="value">Success</tw-checkbox>
<tw-checkbox variant="warning" [(ngModel)]="value">Warning</tw-checkbox>
<tw-checkbox variant="danger" [(ngModel)]="value">Danger</tw-checkbox>`;

  sizesCode = `<tw-checkbox size="sm" [(ngModel)]="value">Small</tw-checkbox>
<tw-checkbox size="md" [(ngModel)]="value">Medium</tw-checkbox>
<tw-checkbox size="lg" [(ngModel)]="value">Large</tw-checkbox>`;

  statesCode = `<tw-checkbox [(ngModel)]="checked">Checked</tw-checkbox>
<tw-checkbox [indeterminate]="true">Indeterminate</tw-checkbox>
<tw-checkbox [disabled]="true">Disabled</tw-checkbox>`;
}
