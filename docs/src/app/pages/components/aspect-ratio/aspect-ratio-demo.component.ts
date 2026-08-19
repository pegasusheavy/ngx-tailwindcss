import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwAspectRatioComponent } from 'ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-aspect-ratio-demo',
  standalone: true,
  imports: [CommonModule, TwAspectRatioComponent, DemoSectionComponent, PageHeaderComponent],
  templateUrl: './aspect-ratio-demo.component.html',
})
export class AspectRatioDemoComponent {
  basicCode = `<!-- Video aspect ratio (16:9) -->
<tw-aspect-ratio ratio="video">
  <img src="image.jpg" class="object-cover w-full h-full" />
</tw-aspect-ratio>`;

  presetsCode = `<!-- Square (1:1) -->
<tw-aspect-ratio ratio="square">...</tw-aspect-ratio>

<!-- Video (16:9) -->
<tw-aspect-ratio ratio="video">...</tw-aspect-ratio>

<!-- Portrait (3:4) -->
<tw-aspect-ratio ratio="portrait">...</tw-aspect-ratio>

<!-- Wide (2:1) -->
<tw-aspect-ratio ratio="wide">...</tw-aspect-ratio>

<!-- Ultrawide (21:9) -->
<tw-aspect-ratio ratio="ultrawide">...</tw-aspect-ratio>`;

  customCode = `<!-- Custom 4:3 ratio -->
<tw-aspect-ratio ratio="custom" [customRatio]="4/3">
  <iframe src="..."></iframe>
</tw-aspect-ratio>`;

  imagesCode = `<!-- Square thumbnail -->
<tw-aspect-ratio ratio="square" class="rounded-lg overflow-hidden shadow-md">
  <img src="photo.jpg" alt="Mountain landscape" class="w-full h-full object-cover" />
</tw-aspect-ratio>

<!-- Video preview -->
<tw-aspect-ratio ratio="video" class="rounded-lg overflow-hidden shadow-md">
  <img src="photo.jpg" alt="Hiking trail" class="w-full h-full object-cover" />
</tw-aspect-ratio>

<!-- Portrait photo -->
<tw-aspect-ratio ratio="portrait" class="rounded-lg overflow-hidden shadow-md">
  <img src="photo.jpg" alt="Forest path" class="w-full h-full object-cover" />
</tw-aspect-ratio>`;
}

