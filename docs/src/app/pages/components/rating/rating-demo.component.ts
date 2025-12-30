import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwRatingComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-rating-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwRatingComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './rating-demo.component.html',
})
export class RatingDemoComponent {
  rating = 3;
  sizeSmValue = 4;
  sizeMdValue = 4;
  sizeLgValue = 4;
  sizeXlValue = 4;
  warningValue = 4;
  primaryValue = 4;
  dangerValue = 4;
  readonlyValue = 4;
  customStarsValue = 7;

  basicCode = `<tw-rating [(ngModel)]="rating"></tw-rating>`;

  sizesCode = `<tw-rating size="sm" [(ngModel)]="value"></tw-rating>
<tw-rating size="md" [(ngModel)]="value"></tw-rating>
<tw-rating size="lg" [(ngModel)]="value"></tw-rating>
<tw-rating size="xl" [(ngModel)]="value"></tw-rating>`;

  variantsCode = `<tw-rating variant="warning" [(ngModel)]="value"></tw-rating>
<tw-rating variant="primary" [(ngModel)]="value"></tw-rating>
<tw-rating variant="danger" [(ngModel)]="value"></tw-rating>`;

  readonlyCode = `<tw-rating [(ngModel)]="value" [readonly]="true"></tw-rating>`;

  starsCode = `<tw-rating [stars]="10" [(ngModel)]="value"></tw-rating>`;
}
