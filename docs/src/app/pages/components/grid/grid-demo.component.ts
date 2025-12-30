import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwGridComponent, TwSimpleGridComponent, GridCols } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwGridComponent,
    TwSimpleGridComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './grid-demo.component.html',
})
export class GridDemoComponent {
  basicCode = `<tw-grid [cols]="3" gap="md">
  <div class="bg-blue-100 p-4 rounded">1</div>
  <div class="bg-blue-100 p-4 rounded">2</div>
  <div class="bg-blue-100 p-4 rounded">3</div>
  <div class="bg-blue-100 p-4 rounded">4</div>
  <div class="bg-blue-100 p-4 rounded">5</div>
  <div class="bg-blue-100 p-4 rounded">6</div>
</tw-grid>`;

  responsiveCode = `<tw-grid [cols]="1" [colsSm]="2" [colsMd]="3" [colsLg]="4" gap="md">
  <div>Responsive item 1</div>
  <div>Responsive item 2</div>
  <div>Responsive item 3</div>
  <div>Responsive item 4</div>
</tw-grid>`;

  simpleGridCode = `<!-- Auto-fit grid with minimum 200px columns -->
<tw-simple-grid minChildWidth="200px" gap="md">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</tw-simple-grid>`;

  gapCode = `<tw-grid [cols]="3" gap="xs">...</tw-grid>  <!-- gap-1 -->
<tw-grid [cols]="3" gap="sm">...</tw-grid>  <!-- gap-2 -->
<tw-grid [cols]="3" gap="md">...</tw-grid>  <!-- gap-4 -->
<tw-grid [cols]="3" gap="lg">...</tw-grid>  <!-- gap-6 -->
<tw-grid [cols]="3" gap="xl">...</tw-grid>  <!-- gap-8 -->`;

  // Column counts for demos
  columnCounts: GridCols[] = [2, 3, 4, 5, 6];
}

