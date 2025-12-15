import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwCardComponent,
  TwCardHeaderDirective,
  TwCardTitleDirective,
  TwCardSubtitleDirective,
  TwCardBodyDirective,
  TwCardFooterDirective,
  TwCardMediaDirective,
  TwButtonComponent,
  TwBadgeComponent,
} from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwCardComponent,
    TwCardHeaderDirective,
    TwCardTitleDirective,
    TwCardSubtitleDirective,
    TwCardBodyDirective,
    TwCardFooterDirective,
    TwCardMediaDirective,
    TwButtonComponent,
    TwBadgeComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './card-demo.component.html',
})
export class CardDemoComponent {
  // Code examples
  variantsCode = `<tw-card variant="elevated">
  <tw-card-body>Elevated card with shadow</tw-card-body>
</tw-card>

<tw-card variant="outlined">
  <tw-card-body>Outlined card with border</tw-card-body>
</tw-card>

<tw-card variant="filled">
  <tw-card-body>Filled card with background</tw-card-body>
</tw-card>

<tw-card variant="ghost">
  <tw-card-body>Ghost transparent card</tw-card-body>
</tw-card>`;

  headerFooterCode = `<tw-card variant="elevated">
  <tw-card-header>
    <tw-card-title>Card Title</tw-card-title>
    <tw-card-subtitle>Supporting text</tw-card-subtitle>
  </tw-card-header>
  <tw-card-body>
    <p>Main content area of the card.</p>
  </tw-card-body>
  <tw-card-footer>
    <tw-button variant="ghost" size="sm">Cancel</tw-button>
    <tw-button variant="primary" size="sm">Save</tw-button>
  </tw-card-footer>
</tw-card>`;

  mediaCode = `<tw-card variant="elevated">
  <tw-card-media position="top">
    <img src="image.jpg" alt="Description" class="w-full h-48 object-cover">
  </tw-card-media>
  <tw-card-body>
    <h3 class="font-semibold">Card Title</h3>
    <p class="text-sm text-slate-600">Card description text.</p>
  </tw-card-body>
</tw-card>`;

  interactiveCode = `<!-- Hoverable card -->
<tw-card variant="outlined" [hoverable]="true">
  <tw-card-body>Hover to see the lift effect</tw-card-body>
</tw-card>

<!-- Clickable card -->
<tw-card variant="outlined" [clickable]="true">
  <tw-card-body>Click to trigger an action</tw-card-body>
</tw-card>

<!-- Both hoverable and clickable -->
<tw-card variant="outlined" [hoverable]="true" [clickable]="true">
  <tw-card-body>Interactive card</tw-card-body>
</tw-card>`;

  complexCode = `<tw-card variant="elevated">
  <tw-card-media position="top">
    <img src="code.jpg" alt="Code" class="w-full h-40 object-cover">
  </tw-card-media>
  <tw-card-header>
    <div class="flex items-start justify-between">
      <div>
        <tw-card-title>ngx-tailwindcss</tw-card-title>
        <tw-card-subtitle>Angular + Tailwind</tw-card-subtitle>
      </div>
      <tw-badge variant="success" badgeStyle="soft">New</tw-badge>
    </div>
  </tw-card-header>
  <tw-card-body>
    <p>Beautiful Angular components for Tailwind CSS 4+.</p>
    <div class="flex flex-wrap gap-2 mt-4">
      <tw-badge variant="neutral" [pill]="true">Angular</tw-badge>
      <tw-badge variant="neutral" [pill]="true">Tailwind</tw-badge>
    </div>
  </tw-card-body>
  <tw-card-footer>
    <tw-button variant="primary" size="sm" [fullWidth]="true">Learn More</tw-button>
  </tw-card-footer>
</tw-card>`;
}
