import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwScrollTopComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-scroll-top-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwScrollTopComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './scroll-top-demo.component.html',
})
export class ScrollTopDemoComponent {
  basicCode = `<tw-scroll-top></tw-scroll-top>`;

  variantsCode = `<tw-scroll-top variant="primary"></tw-scroll-top>
<tw-scroll-top variant="secondary"></tw-scroll-top>
<tw-scroll-top variant="dark"></tw-scroll-top>`;

  positionsCode = `<tw-scroll-top position="bottom-right"></tw-scroll-top>
<tw-scroll-top position="bottom-left"></tw-scroll-top>
<tw-scroll-top position="bottom-center"></tw-scroll-top>`;

  thresholdCode = `<!-- Show after scrolling 200px -->
<tw-scroll-top [threshold]="200"></tw-scroll-top>

<!-- Show after scrolling 600px -->
<tw-scroll-top [threshold]="600"></tw-scroll-top>`;

  behaviorCode = `<!-- Smooth scroll (default) -->
<tw-scroll-top behavior="smooth"></tw-scroll-top>

<!-- Instant scroll -->
<tw-scroll-top behavior="instant"></tw-scroll-top>`;

  customTargetCode = `<div #scrollContainer class="h-64 overflow-auto">
  <!-- Content here -->
  <tw-scroll-top [target]="scrollContainer"></tw-scroll-top>
</div>`;
}

