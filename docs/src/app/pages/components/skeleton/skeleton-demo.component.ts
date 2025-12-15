import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSkeletonComponent, TwSkeletonTextComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-skeleton-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSkeletonComponent,
    TwSkeletonTextComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './skeleton-demo.component.html',
})
export class SkeletonDemoComponent {
  basicCode = `<tw-skeleton></tw-skeleton>
<tw-skeleton width="200px"></tw-skeleton>
<tw-skeleton width="100%" height="20px"></tw-skeleton>`;

  shapesCode = `<tw-skeleton variant="rectangular" width="200px" height="100px"></tw-skeleton>
<tw-skeleton variant="circular" width="64px" height="64px"></tw-skeleton>
<tw-skeleton variant="rounded" width="200px" height="100px"></tw-skeleton>`;

  textCode = `<tw-skeleton-text [lineCount]="3"></tw-skeleton-text>`;

  cardCode = `<tw-skeleton-card></tw-skeleton-card>`;
}
