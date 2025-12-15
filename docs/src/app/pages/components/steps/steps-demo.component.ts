import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwStepsComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-steps-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwStepsComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './steps-demo.component.html',
})
export class StepsDemoComponent {
  currentStep = 1;

  steps = [
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Set up your profile' },
    { label: 'Review', description: 'Review and submit' },
  ];

  basicCode = `<tw-steps [steps]="steps" [activeIndex]="currentStep"></tw-steps>

// Component
steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review and submit' },
];
activeIndex = 1;`;

  orientationCode = `<tw-steps orientation="horizontal" [steps]="steps"></tw-steps>
<tw-steps orientation="vertical" [steps]="steps"></tw-steps>`;

  sizesCode = `<tw-steps size="sm" [steps]="steps"></tw-steps>
<tw-steps size="md" [steps]="steps"></tw-steps>
<tw-steps size="lg" [steps]="steps"></tw-steps>`;
}
