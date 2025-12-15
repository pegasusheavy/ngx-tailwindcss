import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwBreadcrumbComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-breadcrumb-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwBreadcrumbComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './breadcrumb-demo.component.html',
})
export class BreadcrumbDemoComponent {
  items = [
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Breadcrumb' },
  ];

  basicCode = `<tw-breadcrumb [items]="items"></tw-breadcrumb>

// Component
items = [
  { label: 'Home', url: '/' },
  { label: 'Components', url: '/components' },
  { label: 'Breadcrumb' },
];`;

  separatorsCode = `<tw-breadcrumb [items]="items" separator="slash"></tw-breadcrumb>
<tw-breadcrumb [items]="items" separator="chevron"></tw-breadcrumb>
<tw-breadcrumb [items]="items" separator="arrow"></tw-breadcrumb>
<tw-breadcrumb [items]="items" separator="dot"></tw-breadcrumb>`;

  sizesCode = `<tw-breadcrumb [items]="items" size="sm"></tw-breadcrumb>
<tw-breadcrumb [items]="items" size="md"></tw-breadcrumb>
<tw-breadcrumb [items]="items" size="lg"></tw-breadcrumb>`;
}

