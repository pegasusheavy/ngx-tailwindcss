import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTimelineComponent, TimelineEvent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-timeline-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwTimelineComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './timeline-demo.component.html',
})
export class TimelineDemoComponent {
  events: TimelineEvent[] = [
    {
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      date: '2024-01-15',
      color: 'success',
    },
    {
      title: 'Processing',
      description: 'Your order is being processed',
      date: '2024-01-16',
      color: 'success',
    },
    {
      title: 'Shipped',
      description: 'Your order has been shipped',
      date: '2024-01-17',
      color: 'primary',
    },
    {
      title: 'Delivered',
      description: 'Estimated delivery date',
      date: '2024-01-20',
      color: 'secondary',
    },
  ];

  simpleEvents: TimelineEvent[] = [
    { title: 'Version 1.0', description: 'Initial release', date: '2024-01-01' },
    { title: 'Version 1.1', description: 'Bug fixes and improvements', date: '2024-02-01' },
    { title: 'Version 2.0', description: 'Major update with new features', date: '2024-03-01' },
  ];

  basicCode = `<tw-timeline [events]="events"></tw-timeline>

// Component
events: TimelineEvent[] = [
  { title: 'Order Placed', description: '...', date: '2024-01-15', color: 'success' },
  { title: 'Processing', description: '...', date: '2024-01-16', color: 'success' },
  { title: 'Shipped', description: '...', date: '2024-01-17', color: 'primary' },
  { title: 'Delivered', description: '...', date: '2024-01-20' },
];`;

  alignCode = `<tw-timeline [events]="events" align="left"></tw-timeline>
<tw-timeline [events]="events" align="alternate"></tw-timeline>`;
}
