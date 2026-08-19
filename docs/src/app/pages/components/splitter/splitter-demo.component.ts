import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSplitterComponent, TwSplitterPaneComponent } from 'ngx-tailwindcss';
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
  templateUrl: './splitter-demo.component.html',
})
export class SplitterDemoComponent {
  gutterSizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

  basicCode = `<tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
  <div twSplitterPaneStart class="p-4 bg-slate-50">
    Left Panel
  </div>
  <div twSplitterPaneEnd class="p-4">
    Right Panel
  </div>
</tw-splitter>`;

  verticalCode = `<tw-splitter direction="vertical" [initialSizes]="[40, 60]">
  <div twSplitterPaneStart class="p-4 bg-blue-50">
    Top Panel
  </div>
  <div twSplitterPaneEnd class="p-4 bg-slate-50">
    Bottom Panel
  </div>
</tw-splitter>`;

  minSizesCode = `<tw-splitter
  direction="horizontal"
  [initialSizes]="[50, 50]"
  [minSizes]="[150, 200]">
  <div twSplitterPaneStart>
    Min 150px panel
  </div>
  <div twSplitterPaneEnd>
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
  <div twSplitterPaneStart>
    <!-- File explorer -->
  </div>
  <div twSplitterPaneEnd>
    <tw-splitter direction="vertical" [initialSizes]="[70, 30]">
      <div twSplitterPaneStart>
        <!-- Code editor -->
      </div>
      <div twSplitterPaneEnd>
        <!-- Terminal -->
      </div>
    </tw-splitter>
  </div>
</tw-splitter>`;
}
