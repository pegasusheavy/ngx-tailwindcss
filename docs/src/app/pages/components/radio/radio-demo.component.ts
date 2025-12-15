import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwRadioButtonComponent, TwRadioGroupComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwRadioButtonComponent,
    TwRadioGroupComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
  selectedOption = 'option1';
  variantPrimary = 'a';
  variantSuccess = 'a';
  variantDanger = 'a';
  sizeSm = 'a';
  sizeMd = 'a';
  sizeLg = 'a';
  orientationVertical = '1';
  orientationHorizontal = '1';

  basicCode = `<tw-radio-group [(ngModel)]="selectedOption">
  <tw-radio-button value="option1" label="Option 1"></tw-radio-button>
  <tw-radio-button value="option2" label="Option 2"></tw-radio-button>
  <tw-radio-button value="option3" label="Option 3"></tw-radio-button>
</tw-radio-group>`;

  variantsCode = `<tw-radio-button variant="primary" label="Primary"></tw-radio-button>
<tw-radio-button variant="success" label="Success"></tw-radio-button>
<tw-radio-button variant="danger" label="Danger"></tw-radio-button>`;

  sizesCode = `<tw-radio-button size="sm" label="Small"></tw-radio-button>
<tw-radio-button size="md" label="Medium"></tw-radio-button>
<tw-radio-button size="lg" label="Large"></tw-radio-button>`;

  orientationCode = `<tw-radio-group orientation="horizontal">...</tw-radio-group>
<tw-radio-group orientation="vertical">...</tw-radio-group>`;
}
