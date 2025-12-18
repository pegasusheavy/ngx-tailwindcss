import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwStackComponent,
  TwVStackComponent,
  TwHStackComponent,
} from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-stack-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwStackComponent,
    TwVStackComponent,
    TwHStackComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './stack-demo.component.html',
})
export class StackDemoComponent {
  basicCode = `<!-- Vertical stack (default) -->
<tw-stack spacing="md">
  <div class="bg-blue-100 p-4 rounded">Item 1</div>
  <div class="bg-blue-100 p-4 rounded">Item 2</div>
  <div class="bg-blue-100 p-4 rounded">Item 3</div>
</tw-stack>

<!-- Horizontal stack -->
<tw-stack direction="horizontal" spacing="md">
  <div class="bg-green-100 p-4 rounded">Item 1</div>
  <div class="bg-green-100 p-4 rounded">Item 2</div>
  <div class="bg-green-100 p-4 rounded">Item 3</div>
</tw-stack>`;

  shorthandCode = `<!-- VStack - vertical stacking shorthand -->
<tw-vstack spacing="md">
  <div>Stacked vertically</div>
  <div>Stacked vertically</div>
</tw-vstack>

<!-- HStack - horizontal stacking shorthand -->
<tw-hstack spacing="md">
  <div>Stacked horizontally</div>
  <div>Stacked horizontally</div>
</tw-hstack>`;

  spacingCode = `<tw-stack spacing="xs">...</tw-stack>  <!-- gap-1 -->
<tw-stack spacing="sm">...</tw-stack>  <!-- gap-2 -->
<tw-stack spacing="md">...</tw-stack>  <!-- gap-4 (default) -->
<tw-stack spacing="lg">...</tw-stack>  <!-- gap-6 -->
<tw-stack spacing="xl">...</tw-stack>  <!-- gap-8 -->
<tw-stack spacing="2xl">...</tw-stack> <!-- gap-12 -->
<tw-stack spacing="3xl">...</tw-stack> <!-- gap-16 -->`;

  alignCode = `<tw-stack direction="horizontal" align="start">...</tw-stack>
<tw-stack direction="horizontal" align="center">...</tw-stack>
<tw-stack direction="horizontal" align="end">...</tw-stack>
<tw-stack direction="horizontal" align="stretch">...</tw-stack>`;

  justifyCode = `<tw-stack direction="horizontal" justify="start">...</tw-stack>
<tw-stack direction="horizontal" justify="center">...</tw-stack>
<tw-stack direction="horizontal" justify="end">...</tw-stack>
<tw-stack direction="horizontal" justify="between">...</tw-stack>`;
}

