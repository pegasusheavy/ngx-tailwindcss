import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwImageComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-image-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwImageComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './image-demo.component.html',
})
export class ImageDemoComponent {
  basicCode = `<tw-image
  src="https://picsum.photos/400/300"
  alt="Sample image"
  [preview]="true">
</tw-image>`;

  sizesCode = `<tw-image src="..." width="200" height="150"></tw-image>
<tw-image src="..." width="300" height="200"></tw-image>`;

  fitCode = `<tw-image src="..." fit="cover"></tw-image>
<tw-image src="..." fit="contain"></tw-image>
<tw-image src="..." fit="fill"></tw-image>`;

  roundedCode = `<tw-image src="..." borderRadius="none"></tw-image>
<tw-image src="..." borderRadius="lg"></tw-image>
<tw-image src="..." borderRadius="full"></tw-image>`;

  previewCode = `<tw-image src="..." [preview]="true"></tw-image>`;

  fallbackCode = `<tw-image
  src="invalid-url"
  fallback="https://via.placeholder.com/400x300?text=Image+Not+Found">
</tw-image>`;
}

