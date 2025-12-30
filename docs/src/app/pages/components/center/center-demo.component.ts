import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwCenterComponent,
  TwSquareComponent,
  TwCircleComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-center-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwCenterComponent,
    TwSquareComponent,
    TwCircleComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './center-demo.component.html',
})
export class CenterDemoComponent {
  basicCode = `<!-- Center both horizontally and vertically -->
<tw-center class="h-40 bg-slate-100">
  <div class="bg-blue-500 text-white p-4 rounded">
    Centered content
  </div>
</tw-center>`;

  axisCode = `<!-- Center horizontally only -->
<tw-center [vertical]="false">...</tw-center>

<!-- Center vertically only -->
<tw-center [horizontal]="false">...</tw-center>`;

  squareCode = `<!-- Square container with centered content -->
<tw-square size="80px" class="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
  <span class="text-white text-2xl">A</span>
</tw-square>`;

  circleCode = `<!-- Circle container with centered content -->
<tw-circle size="64px" class="bg-gradient-to-br from-green-500 to-emerald-500">
  <span class="text-white font-medium">OK</span>
</tw-circle>`;
}

