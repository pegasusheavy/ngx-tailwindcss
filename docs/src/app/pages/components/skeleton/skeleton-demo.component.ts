import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSkeletonComponent, TwSkeletonTextComponent } from 'ngx-tailwindcss';
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

  profileCode = `<div style="display: flex; align-items: center; gap: 16px;">
  <tw-skeleton variant="circular" width="56px" height="56px"></tw-skeleton>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <tw-skeleton width="150px" height="18px"></tw-skeleton>
    <tw-skeleton width="100px" height="14px"></tw-skeleton>
  </div>
</div>`;
}
