import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwSelectComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwSelectComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './select-demo.component.html',
})
export class SelectDemoComponent {
  selectedCountry = '';
  selectedSize = 'md';

  countries = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
  ];

  sizes = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' },
  ];

  basicCode = `<tw-select
  [options]="countries"
  [(ngModel)]="selectedCountry"
  placeholder="Select a country">
</tw-select>`;

  variantsCode = `<tw-select variant="default" [options]="options"></tw-select>
<tw-select variant="filled" [options]="options"></tw-select>`;

  sizesCode = `<tw-select size="sm" [options]="options"></tw-select>
<tw-select size="md" [options]="options"></tw-select>
<tw-select size="lg" [options]="options"></tw-select>`;

  statesCode = `<tw-select [disabled]="true" [options]="options" placeholder="Disabled"></tw-select>
<tw-select error="Required" [options]="options" placeholder="With Error"></tw-select>`;
}
