import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwBleedComponent } from '@quinnjr/ngx-tailwindcss';
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
  templateUrl: './bleed-demo.component.html',
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

