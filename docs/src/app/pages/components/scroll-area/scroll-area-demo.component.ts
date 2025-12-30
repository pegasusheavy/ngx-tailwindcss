import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwScrollAreaComponent, TwButtonComponent } from '@pegasusheavy/ngx-tailwindcss';
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
  template: `
    <app-page-header
      title="Scroll Area"
      description="Styled scrollable container with customizable scrollbar appearance.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <tw-scroll-area
        height="200px"
        class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/80 shadow-sm">
        <div class="p-4 space-y-4">
          @for (i of items; track i) {
            <div class="p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">
              Item {{ i }}
            </div>
          }
        </div>
      </tw-scroll-area>
    </app-demo-section>

    <!-- Horizontal Scroll -->
    <app-demo-section title="Horizontal Scroll" [code]="horizontalCode">
      <tw-scroll-area
        direction="horizontal"
        class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900/70">
        <div class="flex gap-4 p-4">
          @for (i of items; track i) {
            <div class="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
              Card {{ i }}
            </div>
          }
        </div>
      </tw-scroll-area>
    </app-demo-section>

    <!-- Scrollbar Visibility -->
    <app-demo-section title="Scrollbar Visibility" [code]="visibilityCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium mb-2">Auto (default)</h4>
          <tw-scroll-area height="150px" scrollbar="auto" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
            <div class="p-4 space-y-2">
              @for (i of items; track i) {
                <div class="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-sm border border-transparent dark:border-slate-700/50">Item {{ i }}</div>
              }
            </div>
          </tw-scroll-area>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2">Hover only</h4>
          <tw-scroll-area height="150px" scrollbar="hover" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
            <div class="p-4 space-y-2">
              @for (i of items; track i) {
                <div class="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-sm border border-transparent dark:border-slate-700/50">Item {{ i }}</div>
              }
            </div>
          </tw-scroll-area>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2">Always visible</h4>
          <tw-scroll-area height="150px" scrollbar="always" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
            <div class="p-4 space-y-2">
              @for (i of items; track i) {
                <div class="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-sm border border-transparent dark:border-slate-700/50">Item {{ i }}</div>
              }
            </div>
          </tw-scroll-area>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2">Hidden</h4>
          <tw-scroll-area height="150px" scrollbar="hidden" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
            <div class="p-4 space-y-2">
              @for (i of items; track i) {
                <div class="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-sm border border-transparent dark:border-slate-700/50">Item {{ i }}</div>
              }
            </div>
          </tw-scroll-area>
        </div>
      </div>
    </app-demo-section>

    <!-- Thin Scrollbar -->
    <app-demo-section title="Thin Scrollbar" [code]="thinCode">
      <tw-scroll-area height="200px" [thin]="true" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
        <div class="p-4 space-y-4">
          @for (i of items; track i) {
            <div class="p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">Item {{ i }} - This has a thin scrollbar</div>
          }
        </div>
      </tw-scroll-area>
    </app-demo-section>

    <!-- Dark Mode -->
    <app-demo-section title="Dark Mode Scrollbar" [code]="darkCode">
      <tw-scroll-area
        height="200px"
        [dark]="true"
        class="bg-slate-800 border border-slate-700 rounded-lg">
        <div class="p-4 space-y-4">
          @for (i of items; track i) {
            <div class="p-3 bg-slate-700 rounded text-slate-200 border border-slate-600">
              Dark mode item {{ i }}
            </div>
          }
        </div>
      </tw-scroll-area>
    </app-demo-section>

    <!-- Programmatic Scrolling -->
    <app-demo-section title="Programmatic Scrolling" [code]="programmaticCode">
      <div class="space-y-4">
        <div class="flex gap-2">
          <tw-button (click)="scrollArea.scrollToTop()">Scroll to Top</tw-button>
          <tw-button (click)="scrollArea.scrollToBottom()">Scroll to Bottom</tw-button>
        </div>
        <tw-scroll-area #scrollArea height="200px" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
          <div class="p-4 space-y-4">
            @for (i of longItems; track i) {
              <div class="p-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">Item {{ i }}</div>
            }
          </div>
        </tw-scroll-area>
      </div>
    </app-demo-section>

    <!-- Both Directions -->
    <app-demo-section title="Both Directions" [code]="bothCode">
      <tw-scroll-area direction="both" height="200px" maxWidth="100%" class="border border-slate-200 dark:border-slate-700 rounded-lg bg-white/60 dark:bg-slate-900/70">
        <div class="w-[800px] p-4">
          <table class="w-full">
            <thead>
            <tr>
              @for (col of columns; track col) {
                <th
                  class="px-4 py-2 text-left bg-slate-100 dark:bg-slate-900/70 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  {{ col }}
                </th>
              }
            </tr>
            </thead>
            <tbody>
              @for (row of tableRows; track row) {
                <tr>
                  @for (col of columns; track col) {
                    <td
                      class="px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {{ col }} {{ row }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </tw-scroll-area>
    </app-demo-section>
  `,
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

