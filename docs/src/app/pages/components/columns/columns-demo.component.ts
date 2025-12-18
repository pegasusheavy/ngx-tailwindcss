import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwColumnsComponent, TwCardComponent } from '@pegasus-heavy/ngx-tailwindcss';
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
  template: `
    <app-page-header
      title="Columns"
      description="Multi-column text layout component using CSS columns for newspaper-style content flow.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <tw-card
        [padded]="true"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
        <tw-columns [count]="2" gap="lg">
          <p class="text-slate-700 dark:text-slate-200 leading-relaxed">
            {{ loremText }}
          </p>
          <p class="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
            {{ loremText }}
          </p>
        </tw-columns>
      </tw-card>
    </app-demo-section>

    <!-- Different Column Counts -->
    <app-demo-section title="Column Counts" [code]="countsCode">
      <div class="space-y-6 bg-slate-100/60 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        @for (cols of columnCounts; track cols) {
          <div>
            <h4 class="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">{{ cols }} Column(s)</h4>
            <tw-card
              [padded]="true"
              class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
              <tw-columns [count]="cols" gap="md">
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  {{ shortText }}
                </p>
              </tw-columns>
            </tw-card>
          </div>
        }
      </div>
    </app-demo-section>

    <!-- Responsive Columns -->
    <app-demo-section title="Responsive Columns" [code]="responsiveCode">
      <tw-card
        [padded]="true"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
        <tw-columns [count]="1" [countMd]="2" [countLg]="3" gap="lg">
          <p class="text-slate-700 dark:text-slate-200 leading-relaxed">
            {{ loremText }}
          </p>
          <p class="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
            {{ loremText }}
          </p>
        </tw-columns>
      </tw-card>
      <p class="text-sm text-slate-500 dark:text-slate-300 mt-2">
        Resize your browser to see the columns change: 1 column on mobile, 2 on tablet, 3 on desktop.
      </p>
    </app-demo-section>

    <!-- With Column Rules -->
    <app-demo-section title="Column Rules (Dividers)" [code]="rulesCode">
      <div class="space-y-6">
        <div>
          <h4 class="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Solid Rule</h4>
          <tw-card
            [padded]="true"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <tw-columns [count]="3" gap="lg" rule="solid" ruleColor="slate-300">
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ shortText }}</p>
            </tw-columns>
          </tw-card>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Dashed Rule</h4>
          <tw-card
            [padded]="true"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <tw-columns [count]="3" gap="lg" rule="dashed" ruleColor="slate-300">
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ shortText }}</p>
            </tw-columns>
          </tw-card>
        </div>
        <div>
          <h4 class="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Dotted Rule</h4>
          <tw-card
            [padded]="true"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <tw-columns [count]="3" gap="lg" rule="dotted" ruleColor="slate-400">
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ shortText }}</p>
            </tw-columns>
          </tw-card>
        </div>
      </div>
    </app-demo-section>

    <!-- Avoid Break -->
    <app-demo-section title="Avoid Break" [code]="avoidBreakCode">
      <tw-card
        [padded]="true"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
        <tw-columns [count]="2" gap="lg" [avoidBreak]="true">
          @for (item of cardItems; track item.title) {
            <div class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg mb-4 border border-transparent dark:border-slate-700/50">
              <h4 class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ item.text }}</p>
            </div>
          }
        </tw-columns>
      </tw-card>
      <p class="text-sm text-slate-500 mt-2">
        With <code class="bg-slate-100 px-1 rounded">avoidBreak</code>, cards won't split across columns.
      </p>
    </app-demo-section>

    <!-- Gap Sizes -->
    <app-demo-section title="Gap Sizes" [code]="gapsCode">
      <div class="space-y-6 bg-slate-100/60 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        @for (gap of gaps; track gap.name) {
          <div>
            <h4 class="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">{{ gap.name }} gap</h4>
            <tw-card
              [padded]="true"
              class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
              <tw-columns [count]="3" [gap]="gap.value">
                <p class="text-xs text-slate-600 dark:text-slate-300">{{ shortText }}</p>
              </tw-columns>
            </tw-card>
          </div>
        }
      </div>
    </app-demo-section>

    <!-- Magazine Layout -->
    <app-demo-section title="Magazine Layout Example" [code]="magazineCode">
      <tw-card
        [padded]="true"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
        <article class="text-slate-900 dark:text-slate-100">
          <h2 class="text-2xl font-bold mb-2">The Future of Web Development</h2>
          <p class="text-slate-500 dark:text-slate-300 text-sm mb-4">By John Doe • December 17, 2025</p>
          <div
            class="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-slate-800 dark:to-slate-900 rounded-lg mb-6 shadow-lg ring-1 ring-slate-200 dark:ring-slate-700">
          </div>
          <tw-columns [count]="1" [countMd]="2" gap="xl" rule="solid" ruleColor="slate-200">
            <p class="text-slate-700 dark:text-slate-200 leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
              {{ loremText }}
            </p>
            <p class="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
              {{ loremText }}
            </p>
            <p class="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
              {{ loremText }}
            </p>
          </tw-columns>
        </article>
      </tw-card>
    </app-demo-section>
  `,
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

