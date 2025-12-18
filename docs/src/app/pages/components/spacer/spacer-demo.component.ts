import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwSpacerComponent, TwWrapComponent, SpacerSize } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-spacer-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSpacerComponent,
    TwWrapComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './spacer-demo.component.html',
})
export class SpacerDemoComponent {
  basicCode = `<!-- Vertical spacer -->
<div class="bg-blue-100 p-4">Item 1</div>
<tw-spacer axis="vertical" size="lg"></tw-spacer>
<div class="bg-blue-100 p-4">Item 2</div>`;

  horizontalCode = `<!-- Horizontal spacer in flex container -->
<div class="flex">
  <span>Left</span>
  <tw-spacer axis="horizontal" size="auto" class="flex-1"></tw-spacer>
  <span>Right</span>
</div>`;

  wrapCode = `<tw-wrap spacing="md">
  <span class="bg-blue-100 px-3 py-1 rounded">Tag 1</span>
  <span class="bg-blue-100 px-3 py-1 rounded">Tag 2</span>
  <span class="bg-blue-100 px-3 py-1 rounded">Tag 3</span>
</tw-wrap>`;

  sizesCode = `<tw-spacer size="xs"></tw-spacer>  <!-- h-1 or w-1 -->
<tw-spacer size="sm"></tw-spacer>  <!-- h-2 or w-2 -->
<tw-spacer size="md"></tw-spacer>  <!-- h-4 or w-4 -->
<tw-spacer size="lg"></tw-spacer>  <!-- h-6 or w-6 -->
<tw-spacer size="xl"></tw-spacer>  <!-- h-8 or w-8 -->
<tw-spacer size="2xl"></tw-spacer> <!-- h-12 or w-12 -->
<tw-spacer size="3xl"></tw-spacer> <!-- h-16 or w-16 -->
<tw-spacer size="auto"></tw-spacer> <!-- flex-1 -->`;

  // Sizes for demos
  spacerSizes: SpacerSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
}

