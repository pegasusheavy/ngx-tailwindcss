import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwContainerComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-container-demo',
  standalone: true,
  imports: [CommonModule, TwContainerComponent, DemoSectionComponent, PageHeaderComponent],
  templateUrl: './container-demo.component.html',
})
export class ContainerDemoComponent {
  basicCode = `<tw-container size="lg" [centered]="true">
  <div class="bg-slate-100 p-4 rounded">
    Content inside a large centered container
  </div>
</tw-container>`;

  sizesCode = `<!-- Small container (640px max) -->
<tw-container size="sm">...</tw-container>

<!-- Medium container (768px max) -->
<tw-container size="md">...</tw-container>

<!-- Large container (1024px max) -->
<tw-container size="lg">...</tw-container>

<!-- Extra large container (1280px max) -->
<tw-container size="xl">...</tw-container>

<!-- 2XL container (1536px max) -->
<tw-container size="2xl">...</tw-container>

<!-- Prose container (65ch max - ideal for reading) -->
<tw-container size="prose">...</tw-container>`;

  paddingCode = `<!-- No padding -->
<tw-container padding="none">...</tw-container>

<!-- Small padding -->
<tw-container padding="sm">...</tw-container>

<!-- Medium padding (default) -->
<tw-container padding="md">...</tw-container>

<!-- Large padding -->
<tw-container padding="lg">...</tw-container>`;

  alignmentCode = `<!-- Centered (default) -->
<tw-container [centered]="true">...</tw-container>

<!-- Left aligned -->
<tw-container [centered]="false">...</tw-container>`;
}

