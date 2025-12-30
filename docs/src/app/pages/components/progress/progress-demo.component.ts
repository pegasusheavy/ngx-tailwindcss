import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwProgressComponent, TwProgressCircularComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-progress-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwProgressComponent,
    TwProgressCircularComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './progress-demo.component.html',
})
export class ProgressDemoComponent {
  progress = 65;

  basicCode = `<tw-progress [value]="65"></tw-progress>`;

  variantsCode = `<tw-progress variant="primary" [value]="75"></tw-progress>
<tw-progress variant="success" [value]="100"></tw-progress>
<tw-progress variant="warning" [value]="50"></tw-progress>
<tw-progress variant="danger" [value]="25"></tw-progress>`;

  sizesCode = `<tw-progress size="sm" [value]="60"></tw-progress>
<tw-progress size="md" [value]="60"></tw-progress>
<tw-progress size="lg" [value]="60"></tw-progress>`;

  stripedCode = `<tw-progress [value]="70" [striped]="true"></tw-progress>
<tw-progress [value]="70" [striped]="true" [animated]="true"></tw-progress>`;

  labelCode = `<tw-progress [value]="75" [showValue]="true"></tw-progress>`;

  indeterminateCode = `<tw-progress [indeterminate]="true"></tw-progress>`;

  circularCode = `<tw-progress-circular [value]="75" [size]="80" [showValue]="true"></tw-progress-circular>`;
}
