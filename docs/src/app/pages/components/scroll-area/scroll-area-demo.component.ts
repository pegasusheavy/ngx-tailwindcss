import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwScrollAreaComponent, TwButtonComponent } from '@quinnjr/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-scroll-area-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwScrollAreaComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './scroll-area-demo.component.html',
})
export class ScrollAreaDemoComponent {
  @ViewChild('scrollArea') scrollAreaRef!: TwScrollAreaComponent;

  items = Array.from({ length: 15 }, (_, i) => i + 1);
  longItems = Array.from({ length: 25 }, (_, i) => i + 1);
  columns = ['Name', 'Email', 'Role', 'Department', 'Location', 'Status', 'Actions'];
  tableRows = Array.from({ length: 12 }, (_, i) => i + 1);

  basicCode = `<tw-scroll-area height="200px">
  <div class="p-4 space-y-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <!-- More items -->
  </div>
</tw-scroll-area>`;

  horizontalCode = `<tw-scroll-area direction="horizontal">
  <div class="flex gap-4 p-4">
    <div class="flex-shrink-0 w-48">Card 1</div>
    <div class="flex-shrink-0 w-48">Card 2</div>
    <!-- More cards -->
  </div>
</tw-scroll-area>`;

  visibilityCode = `<!-- Auto (default) - shows when needed -->
<tw-scroll-area scrollbar="auto">...</tw-scroll-area>

<!-- Show only on hover -->
<tw-scroll-area scrollbar="hover">...</tw-scroll-area>

<!-- Always visible -->
<tw-scroll-area scrollbar="always">...</tw-scroll-area>

<!-- Hidden (still scrollable) -->
<tw-scroll-area scrollbar="hidden">...</tw-scroll-area>`;

  thinCode = `<tw-scroll-area height="200px" [thin]="true">
  <!-- Content -->
</tw-scroll-area>`;

  darkCode = `<tw-scroll-area height="200px" [dark]="true" class="bg-slate-800">
  <!-- Dark themed content -->
</tw-scroll-area>`;

  programmaticCode = `<tw-scroll-area #scrollArea height="200px">
  <!-- Content -->
</tw-scroll-area>

<button (click)="scrollArea.scrollToTop()">Top</button>
<button (click)="scrollArea.scrollToBottom()">Bottom</button>`;

  bothCode = `<tw-scroll-area direction="both" height="200px">
  <div class="w-[800px]">
    <!-- Wide content that scrolls both ways -->
  </div>
</tw-scroll-area>`;
}

