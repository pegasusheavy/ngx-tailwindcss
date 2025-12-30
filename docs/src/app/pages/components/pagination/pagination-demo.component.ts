import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwPaginationComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwPaginationComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './pagination-demo.component.html',
})
export class PaginationDemoComponent {
  currentPage = 1;
  totalPages = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  basicCode = `<tw-pagination
  [currentPage]="currentPage"
  [totalPages]="totalPages"
  (pageChange)="onPageChange($event)">
</tw-pagination>`;

  variantsCode = `<tw-pagination variant="default" [totalPages]="10"></tw-pagination>
<tw-pagination variant="simple" [totalPages]="10"></tw-pagination>
<tw-pagination variant="numbered" [totalPages]="10"></tw-pagination>`;

  sizesCode = `<tw-pagination size="sm" [totalPages]="10"></tw-pagination>
<tw-pagination size="md" [totalPages]="10"></tw-pagination>
<tw-pagination size="lg" [totalPages]="10"></tw-pagination>`;

  siblingCountCode = `<tw-pagination [totalPages]="20" [siblingCount]="1"></tw-pagination>
<tw-pagination [totalPages]="20" [siblingCount]="2"></tw-pagination>`;
}

