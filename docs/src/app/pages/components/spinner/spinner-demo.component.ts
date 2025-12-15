import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSpinnerComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-spinner-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSpinnerComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './spinner-demo.component.html',
})
export class SpinnerDemoComponent {
  basicCode = `<tw-spinner></tw-spinner>`;

  variantsCode = `<tw-spinner variant="border"></tw-spinner>
<tw-spinner variant="dots"></tw-spinner>
<tw-spinner variant="pulse"></tw-spinner>
<tw-spinner variant="bars"></tw-spinner>`;

  sizesCode = `<tw-spinner size="sm"></tw-spinner>
<tw-spinner size="md"></tw-spinner>
<tw-spinner size="lg"></tw-spinner>
<tw-spinner size="xl"></tw-spinner>`;

  colorsCode = `<tw-spinner color="primary"></tw-spinner>
<tw-spinner color="secondary"></tw-spinner>
<tw-spinner color="success"></tw-spinner>
<tw-spinner color="warning"></tw-spinner>
<tw-spinner color="danger"></tw-spinner>`;

  overlayCode = `<div class="relative p-8 bg-slate-100 rounded-lg">
  <tw-spinner [overlay]="true"></tw-spinner>
  <p>Content behind the overlay</p>
</div>`;
}

