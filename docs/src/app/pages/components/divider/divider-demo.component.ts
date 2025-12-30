import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwDividerComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-divider-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwDividerComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './divider-demo.component.html',
})
export class DividerDemoComponent {
  basicCode = `<tw-divider></tw-divider>`;

  orientationCode = `<tw-divider orientation="horizontal"></tw-divider>
<tw-divider orientation="vertical"></tw-divider>`;

  stylesCode = `<tw-divider dividerStyle="solid"></tw-divider>
<tw-divider dividerStyle="dashed"></tw-divider>
<tw-divider dividerStyle="dotted"></tw-divider>`;

  withLabelCode = `<tw-divider label="OR"></tw-divider>
<tw-divider label="Continue" labelPosition="left"></tw-divider>
<tw-divider label="End" labelPosition="right"></tw-divider>`;

  spacingCode = `<tw-divider spacing="sm"></tw-divider>
<tw-divider spacing="md"></tw-divider>
<tw-divider spacing="lg"></tw-divider>`;
}

