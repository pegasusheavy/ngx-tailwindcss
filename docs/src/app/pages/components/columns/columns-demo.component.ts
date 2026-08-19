import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwColumnsComponent, TwCardComponent } from 'ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-columns-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwColumnsComponent,
    TwCardComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './columns-demo.component.html',
})
export class ColumnsDemoComponent {
  columnCounts: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  gaps: { name: string; value: 'sm' | 'md' | 'lg' | 'xl' }[] = [
    { name: 'Small', value: 'sm' },
    { name: 'Medium', value: 'md' },
    { name: 'Large', value: 'lg' },
    { name: 'Extra Large', value: 'xl' },
  ];

  cardItems = [
    { title: 'Card One', text: 'This is the first card with some content that demonstrates the avoid break feature.' },
    { title: 'Card Two', text: 'The second card also has content and won\'t split across columns.' },
    { title: 'Card Three', text: 'Third card in the list showing how columns handle discrete items.' },
    { title: 'Card Four', text: 'Fourth and final card in this demo section.' },
  ];

  loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

  shortText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`;

  basicCode = `<tw-columns [count]="2" gap="lg">
  <p>First paragraph of text that will flow...</p>
  <p>Second paragraph continues in the columns...</p>
</tw-columns>`;

  countsCode = `<!-- 1 column -->
<tw-columns [count]="1">...</tw-columns>

<!-- 2 columns -->
<tw-columns [count]="2">...</tw-columns>

<!-- 3 columns -->
<tw-columns [count]="3">...</tw-columns>

<!-- Up to 6 columns supported -->
<tw-columns [count]="6">...</tw-columns>`;

  responsiveCode = `<!-- 1 col on mobile, 2 on md, 3 on lg -->
<tw-columns
  [count]="1"
  [countMd]="2"
  [countLg]="3"
  gap="lg">
  <p>Content flows into columns responsively...</p>
</tw-columns>`;

  rulesCode = `<!-- Solid divider line between columns -->
<tw-columns [count]="3" rule="solid" ruleColor="slate-300">
  ...
</tw-columns>

<!-- Dashed divider -->
<tw-columns [count]="3" rule="dashed" ruleColor="slate-300">
  ...
</tw-columns>

<!-- Dotted divider -->
<tw-columns [count]="3" rule="dotted" ruleColor="slate-400">
  ...
</tw-columns>`;

  avoidBreakCode = `<!-- Cards won't split across columns -->
<tw-columns [count]="2" [avoidBreak]="true">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</tw-columns>`;

  gapsCode = `<tw-columns gap="none">...</tw-columns>  <!-- 0 -->
<tw-columns gap="xs">...</tw-columns>    <!-- 0.5rem -->
<tw-columns gap="sm">...</tw-columns>    <!-- 1rem -->
<tw-columns gap="md">...</tw-columns>    <!-- 1.5rem -->
<tw-columns gap="lg">...</tw-columns>    <!-- 2rem -->
<tw-columns gap="xl">...</tw-columns>    <!-- 3rem -->`;

  magazineCode = `<article>
  <h2 class="text-2xl font-bold">Article Title</h2>
  <img src="hero.jpg" class="w-full rounded-lg mb-6" />

  <tw-columns
    [count]="1"
    [countMd]="2"
    gap="xl"
    rule="solid"
    ruleColor="slate-200">
    <p class="first-letter:text-4xl first-letter:font-bold">
      Lorem ipsum...
    </p>
  </tw-columns>
</article>`;
}

