import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSplitterComponent, TwSplitterPaneComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-splitter-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSplitterComponent,
    TwSplitterPaneComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      title="Splitter"
      description="Resizable split pane component for creating adjustable layouts.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <div class="h-[300px] border rounded-lg overflow-hidden">
        <tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
          <div twSplitterPane class="p-4 bg-slate-50">
            <h3 class="font-semibold mb-2">Left Panel</h3>
            <p class="text-sm text-slate-600">Drag the divider to resize.</p>
          </div>
          <div twSplitterPane class="p-4">
            <h3 class="font-semibold mb-2">Right Panel</h3>
            <p class="text-sm text-slate-600">This panel takes up the remaining space.</p>
          </div>
        </tw-splitter>
      </div>
    </app-demo-section>

    <!-- Vertical Split -->
    <app-demo-section title="Vertical Split" [code]="verticalCode">
      <div class="h-[400px] border rounded-lg overflow-hidden">
        <tw-splitter direction="vertical" [initialSizes]="[40, 60]">
          <div twSplitterPane class="p-4 bg-blue-50">
            <h3 class="font-semibold mb-2">Top Panel</h3>
            <p class="text-sm text-slate-600">Code editor area</p>
          </div>
          <div twSplitterPane class="p-4 bg-slate-50">
            <h3 class="font-semibold mb-2">Bottom Panel</h3>
            <p class="text-sm text-slate-600">Console output area</p>
          </div>
        </tw-splitter>
      </div>
    </app-demo-section>

    <!-- With Minimum Sizes -->
    <app-demo-section title="Minimum Sizes" [code]="minSizesCode">
      <div class="h-[300px] border rounded-lg overflow-hidden">
        <tw-splitter
          direction="horizontal"
          [initialSizes]="[50, 50]"
          [minSizes]="[150, 200]">
          <div twSplitterPane class="p-4 bg-green-50">
            <h3 class="font-semibold mb-2">Min 150px</h3>
            <p class="text-sm text-slate-600">This panel won't shrink below 150px.</p>
          </div>
          <div twSplitterPane class="p-4">
            <h3 class="font-semibold mb-2">Min 200px</h3>
            <p class="text-sm text-slate-600">This panel won't shrink below 200px.</p>
          </div>
        </tw-splitter>
      </div>
    </app-demo-section>

    <!-- Gutter Sizes -->
    <app-demo-section title="Gutter Sizes" [code]="gutterCode">
      <div class="space-y-4">
        @for (size of gutterSizes; track size) {
          <div class="h-[150px] border rounded-lg overflow-hidden">
            <tw-splitter direction="horizontal" [gutterSize]="size">
              <div twSplitterPane class="p-4 bg-slate-50">
                <span class="font-semibold">{{ size }} gutter</span>
              </div>
              <div twSplitterPane class="p-4">
                Content
              </div>
            </tw-splitter>
          </div>
        }
      </div>
    </app-demo-section>

    <!-- IDE-like Layout -->
    <app-demo-section title="IDE-like Layout" [code]="ideCode">
      <div class="h-[500px] border rounded-lg overflow-hidden bg-slate-900">
        <tw-splitter direction="horizontal" [initialSizes]="[20, 80]" [minSizes]="[150, 300]">
          <div twSplitterPane class="bg-slate-800 p-2">
            <div class="text-slate-400 text-xs uppercase mb-2">Explorer</div>
            <div class="space-y-1">
              <div class="text-slate-300 text-sm px-2 py-1 hover:bg-slate-700 rounded cursor-pointer">📁 src</div>
              <div class="text-slate-300 text-sm px-2 py-1 hover:bg-slate-700 rounded cursor-pointer ml-2">📄 app.ts</div>
              <div class="text-slate-300 text-sm px-2 py-1 hover:bg-slate-700 rounded cursor-pointer ml-2">📄 main.ts</div>
              <div class="text-slate-300 text-sm px-2 py-1 hover:bg-slate-700 rounded cursor-pointer">📁 assets</div>
            </div>
          </div>
          <div twSplitterPane>
            <tw-splitter direction="vertical" [initialSizes]="[70, 30]">
              <div twSplitterPane class="bg-slate-900 p-4">
                <div class="font-mono text-sm text-slate-300">
                  <div><span class="text-purple-400">import</span> {{ '{' }} Component {{ '}' }} <span class="text-purple-400">from</span> <span class="text-green-400">'&#64;angular/core'</span>;</div>
                  <div class="mt-2"><span class="text-purple-400">&#64;Component</span>({{ '{' }}</div>
                  <div>  selector: <span class="text-green-400">'app-root'</span>,</div>
                  <div>{{ '}' }})</div>
                </div>
              </div>
              <div twSplitterPane class="bg-slate-950 p-2">
                <div class="text-slate-400 text-xs uppercase mb-1">Terminal</div>
                <div class="font-mono text-sm text-green-400">$ ng serve</div>
              </div>
            </tw-splitter>
          </div>
        </tw-splitter>
      </div>
    </app-demo-section>
  `,
})
export class SplitterDemoComponent {
  gutterSizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

  basicCode = `<tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
  <div twSplitterPane class="p-4 bg-slate-50">
    Left Panel
  </div>
  <div twSplitterPane class="p-4">
    Right Panel
  </div>
</tw-splitter>`;

  verticalCode = `<tw-splitter direction="vertical" [initialSizes]="[40, 60]">
  <div twSplitterPane class="p-4 bg-blue-50">
    Top Panel
  </div>
  <div twSplitterPane class="p-4 bg-slate-50">
    Bottom Panel
  </div>
</tw-splitter>`;

  minSizesCode = `<tw-splitter
  direction="horizontal"
  [initialSizes]="[50, 50]"
  [minSizes]="[150, 200]">
  <div twSplitterPane>
    Min 150px panel
  </div>
  <div twSplitterPane>
    Min 200px panel
  </div>
</tw-splitter>`;

  gutterCode = `<!-- Small gutter -->
<tw-splitter gutterSize="sm">...</tw-splitter>

<!-- Medium gutter (default) -->
<tw-splitter gutterSize="md">...</tw-splitter>

<!-- Large gutter -->
<tw-splitter gutterSize="lg">...</tw-splitter>`;

  ideCode = `<tw-splitter direction="horizontal" [initialSizes]="[20, 80]">
  <div twSplitterPane>
    <!-- File explorer -->
  </div>
  <div twSplitterPane>
    <tw-splitter direction="vertical" [initialSizes]="[70, 30]">
      <div twSplitterPane>
        <!-- Code editor -->
      </div>
      <div twSplitterPane>
        <!-- Terminal -->
      </div>
    </tw-splitter>
  </div>
</tw-splitter>`;
}

