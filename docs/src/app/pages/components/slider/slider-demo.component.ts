import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwSliderComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-slider-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwSliderComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './slider-demo.component.html',
})
export class SliderDemoComponent {
  volume = 50;
  brightness = 75;
  sliderValue1 = 60;
  sliderValue2 = 80;
  sliderValue3 = 45;
  sliderValue4 = 25;
  stepValue1 = 50;
  stepValue2 = 50;

  basicCode = `<tw-slider [(ngModel)]="volume" [min]="0" [max]="100"></tw-slider>`;

  variantsCode = `<tw-slider variant="primary" [(ngModel)]="value"></tw-slider>
<tw-slider variant="success" [(ngModel)]="value"></tw-slider>
<tw-slider variant="warning" [(ngModel)]="value"></tw-slider>
<tw-slider variant="danger" [(ngModel)]="value"></tw-slider>`;

  stepsCode = `<tw-slider [min]="0" [max]="100" [step]="10" [(ngModel)]="value"></tw-slider>
<tw-slider [min]="0" [max]="100" [step]="25" [(ngModel)]="value"></tw-slider>`;

  rangeCode = `<tw-slider [(ngModel)]="value" [min]="0" [max]="100" [showValue]="true"></tw-slider>`;
}
