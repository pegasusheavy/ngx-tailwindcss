import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwStickyComponent, TwCardComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-sticky-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwStickyComponent,
    TwCardComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      title="Sticky"
      description="Sticky positioning component for creating fixed headers, sidebars, and floating elements.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <div class="h-[300px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/60 dark:bg-slate-900/70">
        <tw-sticky
          position="top"
          offset="none"
          class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 class="font-semibold">Sticky Header</h3>
          </div>
        </tw-sticky>
        <div class="p-4 space-y-4">
          @for (i of scrollItems; track i) {
            <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">
              Content item {{ i }}
            </div>
          }
        </div>
      </div>
    </app-demo-section>

    <!-- With Offset -->
    <app-demo-section title="With Offset" [code]="offsetCode">
      <div class="h-[300px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/60 dark:bg-slate-900/70">
        <tw-sticky
          position="top"
          offset="md"
          class="bg-blue-500 text-white shadow-md">
          <div class="p-4">
            <h3 class="font-semibold">Sticky with 1rem offset from top</h3>
          </div>
        </tw-sticky>
        <div class="p-4 space-y-4 pt-20">
          @for (i of scrollItems; track i) {
            <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">
              Content item {{ i }}
            </div>
          }
        </div>
      </div>
    </app-demo-section>

    <!-- Sidebar Layout -->
    <app-demo-section title="Sticky Sidebar" [code]="sidebarCode">
      <div class="h-[400px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/60 dark:bg-slate-900/70">
        <div class="flex">
          <div class="flex-1 p-4 space-y-4">
            <h3 class="font-semibold text-lg text-slate-900 dark:text-white">Main Content</h3>
            @for (i of longScrollItems; track i) {
              <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/60">
                <h4 class="font-medium">Article Section {{ i }}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            }
          </div>
          <div class="w-64 border-l border-slate-200 dark:border-slate-700">
            <tw-sticky position="top" offset="sm">
              <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md">
                <h4 class="font-semibold mb-3">Table of Contents</h4>
                <ul class="space-y-2 text-sm">
                  @for (i of longScrollItems; track i) {
                    <li class="text-blue-600 hover:underline cursor-pointer dark:text-blue-300">Section {{ i }}</li>
                  }
                </ul>
              </div>
            </tw-sticky>
          </div>
        </div>
      </div>
    </app-demo-section>

    <!-- Custom Offset -->
    <app-demo-section title="Custom Offset" [code]="customOffsetCode">
      <div class="h-[300px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100/60 dark:bg-slate-900/70">
        <div class="h-12 bg-slate-800 text-white flex items-center px-4 border-b border-slate-700">
          Fixed Top Bar
        </div>
        <tw-sticky
          position="top"
          customOffset="48px"
          [zIndex]="5"
          class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
          <div class="p-3 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="font-semibold">Sticky below the top bar (48px offset)</h3>
          </div>
        </tw-sticky>
        <div class="p-4 space-y-4">
          @for (i of scrollItems; track i) {
            <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded border border-transparent dark:border-slate-700/50">
              Content item {{ i }}
            </div>
          }
        </div>
      </div>
    </app-demo-section>

    <!-- Offsets Reference -->
    <app-demo-section title="Offset Sizes" [code]="offsetsCode">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-100/60 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        @for (offset of offsets; track offset.name) {
          <tw-card [padded]="true" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="text-center">
              <div class="font-mono text-lg font-semibold text-blue-600">{{ offset.name }}</div>
              <div class="text-sm text-slate-500 dark:text-slate-300">{{ offset.value }}</div>
            </div>
          </tw-card>
        }
      </div>
    </app-demo-section>
  `,
})
export class StickyDemoComponent {
  scrollItems = Array.from({ length: 10 }, (_, i) => i + 1);
  longScrollItems = Array.from({ length: 8 }, (_, i) => i + 1);

  offsets = [
    { name: 'none', value: '0' },
    { name: 'xs', value: '0.25rem' },
    { name: 'sm', value: '0.5rem' },
    { name: 'md', value: '1rem' },
    { name: 'lg', value: '1.5rem' },
    { name: 'xl', value: '2rem' },
  ];

  basicCode = `<tw-sticky position="top" offset="none">
  <header class="bg-white shadow-sm p-4">
    Sticky Header
  </header>
</tw-sticky>`;

  offsetCode = `<tw-sticky position="top" offset="md">
  <div class="p-4 bg-blue-500 text-white">
    Sticky with 1rem offset
  </div>
</tw-sticky>`;

  sidebarCode = `<div class="flex">
  <main class="flex-1">
    <!-- Main scrolling content -->
  </main>
  <aside class="w-64">
    <tw-sticky position="top" offset="sm">
      <nav class="p-4">
        Table of Contents
      </nav>
    </tw-sticky>
  </aside>
</div>`;

  customOffsetCode = `<!-- When you need to account for a fixed header -->
<tw-sticky position="top" customOffset="60px" [zIndex]="5">
  <div class="p-4 bg-white">
    Sticky below the fixed header
  </div>
</tw-sticky>`;

  offsetsCode = `<!-- Available offset presets -->
offset="none"  // 0
offset="xs"    // 0.25rem
offset="sm"    // 0.5rem
offset="md"    // 1rem
offset="lg"    // 1.5rem
offset="xl"    // 2rem

<!-- Or use a custom value -->
customOffset="60px"`;
}

