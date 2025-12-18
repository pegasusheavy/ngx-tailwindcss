import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwBleedComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-bleed-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwBleedComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      title="Bleed"
      description="Break out of container constraints for full-width elements within constrained layouts.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
        <div class="max-w-md mx-auto bg-white dark:bg-slate-900/80 p-6">
          <h3 class="font-semibold mb-2 text-slate-900 dark:text-white">Constrained Content</h3>
          <p class="text-slate-600 dark:text-slate-300 dark:text-slate-300 text-sm mb-4">This content is within a max-w-md container.</p>

          <tw-bleed direction="horizontal" amount="md">
            <div class="bg-blue-500 text-white p-6 text-center">
              This section bleeds outside the container
            </div>
          </tw-bleed>

          <p class="text-slate-600 dark:text-slate-300 dark:text-slate-300 text-sm mt-4">Back to the constrained container.</p>
        </div>
      </div>
    </app-demo-section>

    <!-- Full Width Bleed -->
    <app-demo-section title="Full Width Bleed" [code]="fullWidthCode">
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/50 dark:bg-slate-900/80">
        <div class="max-w-lg mx-auto bg-white dark:bg-slate-900/90 p-6">
          <h3 class="font-semibold mb-2 text-slate-900 dark:text-white">Article Title</h3>
          <p class="text-slate-600 dark:text-slate-300 dark:text-slate-300 text-sm mb-4">Introduction paragraph within the container bounds.</p>

          <tw-bleed direction="horizontal" amount="full">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
              alt="Mountain landscape"
              class="w-full h-48 object-cover"
            />
          </tw-bleed>

          <p class="text-slate-600 dark:text-slate-300 dark:text-slate-300 text-sm mt-4">The article continues after the full-width image.</p>
        </div>
      </div>
    </app-demo-section>

    <!-- Bleed Amounts -->
    <app-demo-section title="Bleed Amounts" [code]="amountsCode">
      <div class="space-y-6">
        @for (amt of amounts; track amt.name) {
          <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
            <div class="max-w-sm mx-auto bg-white dark:bg-slate-900/90 p-4">
              <p class="text-xs text-slate-500 dark:text-slate-300 mb-2">{{ amt.name }} ({{ amt.value }})</p>
              <tw-bleed direction="horizontal" [amount]="amt.value">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 text-center text-sm">
                  Bleeds {{ amt.name }}
                </div>
              </tw-bleed>
            </div>
          </div>
        }
      </div>
    </app-demo-section>

    <!-- Directional Bleed -->
    <app-demo-section title="Directional Bleed" [code]="directionalCode">
      <div class="space-y-6">
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
          <div class="max-w-sm mx-auto bg-white dark:bg-slate-900/90 p-4">
            <p class="text-xs text-slate-500 dark:text-slate-300 mb-2">Left only</p>
            <tw-bleed direction="left" amount="lg">
              <div class="bg-green-500 text-white p-3 text-sm">
                Bleeds left
              </div>
            </tw-bleed>
          </div>
        </div>

        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
          <div class="max-w-sm mx-auto bg-white dark:bg-slate-900/90 p-4">
            <p class="text-xs text-slate-500 dark:text-slate-300 mb-2">Right only</p>
            <tw-bleed direction="right" amount="lg">
              <div class="bg-orange-500 text-white p-3 text-sm">
                Bleeds right
              </div>
            </tw-bleed>
          </div>
        </div>

        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
          <div class="max-w-sm mx-auto bg-white dark:bg-slate-900/90 p-4">
            <p class="text-xs text-slate-500 dark:text-slate-300 mb-2">Horizontal (both sides)</p>
            <tw-bleed direction="horizontal" amount="lg">
              <div class="bg-blue-500 text-white p-3 text-sm text-center">
                Bleeds both sides
              </div>
            </tw-bleed>
          </div>
        </div>
      </div>
    </app-demo-section>

    <!-- Preserve Padding -->
    <app-demo-section title="Preserve Padding" [code]="preservePaddingCode">
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100/60 dark:bg-slate-900/70">
        <div class="max-w-md mx-auto bg-white dark:bg-slate-900/90 p-6">
          <p class="text-slate-600 dark:text-slate-300 text-sm mb-4">With <code class="bg-slate-100 px-1 rounded">preservePadding</code>, the content stays aligned while the background extends:</p>

          <tw-bleed direction="horizontal" amount="md" [preservePadding]="true">
            <div class="bg-slate-100 py-6">
              <p class="text-slate-700">Content stays aligned with the container while the background bleeds out.</p>
            </div>
          </tw-bleed>

          <p class="text-slate-600 dark:text-slate-300 text-sm mt-4">Text continues in the container.</p>
        </div>
      </div>
    </app-demo-section>

    <!-- Real World Example -->
    <app-demo-section title="Real World: Blog Post" [code]="blogCode">
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900/80">
        <article class="max-w-2xl mx-auto px-6 py-8">
          <header class="mb-6">
            <h1 class="text-2xl font-bold text-slate-900">Exploring the Mountains</h1>
            <p class="text-slate-500 dark:text-slate-300 mt-2">A journey through the wilderness</p>
          </header>

          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            The morning sun cast golden rays across the valley as we began our ascent.
            The air was crisp and filled with the scent of pine trees.
          </p>

          <tw-bleed direction="horizontal" amount="full">
            <figure class="my-0">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=500&fit=crop"
                alt="Mountain vista"
                class="w-full h-64 object-cover"
              />
              <figcaption class="text-center text-sm text-slate-500 dark:text-slate-300 py-2 bg-slate-50">
                The view from the summit at sunrise
              </figcaption>
            </figure>
          </tw-bleed>

          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
            After hours of climbing, we finally reached the summit. The panoramic view
            stretched for miles in every direction, making every step of the journey worthwhile.
          </p>

          <tw-bleed direction="horizontal" amount="lg" [preservePadding]="true">
            <blockquote class="border-l-4 border-blue-500 bg-blue-50 py-4 my-6">
              <p class="text-blue-900 italic">
                "The mountains are calling and I must go." — John Muir
              </p>
            </blockquote>
          </tw-bleed>

          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            As we descended, the setting sun painted the sky in brilliant oranges and purples,
            a perfect end to an unforgettable day.
          </p>
        </article>
      </div>
    </app-demo-section>
  `,
})
export class BleedDemoComponent {
  amounts: { name: string; value: 'sm' | 'md' | 'lg' | 'xl' | 'full' }[] = [
    { name: 'Small', value: 'sm' },
    { name: 'Medium', value: 'md' },
    { name: 'Large', value: 'lg' },
    { name: 'Extra Large', value: 'xl' },
    { name: 'Full', value: 'full' },
  ];

  basicCode = `<div class="max-w-md mx-auto">
  <p>Constrained content...</p>

  <tw-bleed direction="horizontal" amount="md">
    <div class="bg-blue-500 p-6">
      This bleeds outside the container
    </div>
  </tw-bleed>

  <p>Back to constrained...</p>
</div>`;

  fullWidthCode = `<tw-bleed direction="horizontal" amount="full">
  <img
    src="hero.jpg"
    class="w-full h-48 object-cover"
  />
</tw-bleed>`;

  amountsCode = `<!-- Small: 1rem -->
<tw-bleed amount="sm">...</tw-bleed>

<!-- Medium: 2rem -->
<tw-bleed amount="md">...</tw-bleed>

<!-- Large: 4rem -->
<tw-bleed amount="lg">...</tw-bleed>

<!-- Extra Large: 6rem -->
<tw-bleed amount="xl">...</tw-bleed>

<!-- Full viewport width -->
<tw-bleed amount="full">...</tw-bleed>`;

  directionalCode = `<!-- Bleed left only -->
<tw-bleed direction="left" amount="lg">...</tw-bleed>

<!-- Bleed right only -->
<tw-bleed direction="right" amount="lg">...</tw-bleed>

<!-- Bleed both sides (default) -->
<tw-bleed direction="horizontal" amount="lg">...</tw-bleed>

<!-- Bleed all directions -->
<tw-bleed direction="all" amount="lg">...</tw-bleed>`;

  preservePaddingCode = `<!-- Background bleeds, content stays aligned -->
<tw-bleed
  direction="horizontal"
  amount="md"
  [preservePadding]="true">
  <div class="bg-slate-100 py-6">
    Content stays in original position
  </div>
</tw-bleed>`;

  blogCode = `<article class="max-w-2xl mx-auto px-6">
  <h1>Article Title</h1>
  <p>Introduction paragraph...</p>

  <!-- Full-width hero image -->
  <tw-bleed direction="horizontal" amount="full">
    <img src="hero.jpg" class="w-full" />
  </tw-bleed>

  <p>More content...</p>

  <!-- Quote with extended background -->
  <tw-bleed amount="lg" [preservePadding]="true">
    <blockquote class="bg-blue-50 py-4">
      "A meaningful quote..."
    </blockquote>
  </tw-bleed>
</article>`;
}

