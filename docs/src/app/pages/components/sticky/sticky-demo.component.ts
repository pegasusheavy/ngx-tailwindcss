import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwStickyComponent, TwCardComponent } from 'ngx-tailwindcss';
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
  templateUrl: './sticky-demo.component.html',
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

