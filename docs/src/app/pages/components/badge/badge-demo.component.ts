import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwBadgeComponent, TwBadgeGroupComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwBadgeComponent,
    TwBadgeGroupComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
  onRemove(): void {
    console.log('Badge removed');
  }

  // Code examples
  variantsCode = `<tw-badge variant="primary">Primary</tw-badge>
<tw-badge variant="secondary">Secondary</tw-badge>
<tw-badge variant="success">Success</tw-badge>
<tw-badge variant="warning">Warning</tw-badge>
<tw-badge variant="danger">Danger</tw-badge>
<tw-badge variant="info">Info</tw-badge>
<tw-badge variant="neutral">Neutral</tw-badge>`;

  stylesCode = `<!-- Solid style -->
<tw-badge variant="primary" badgeStyle="solid">Solid</tw-badge>

<!-- Soft style -->
<tw-badge variant="primary" badgeStyle="soft">Soft</tw-badge>

<!-- Outline style -->
<tw-badge variant="primary" badgeStyle="outline">Outline</tw-badge>

<!-- Dot style (with status indicator) -->
<tw-badge variant="success" badgeStyle="dot">Online</tw-badge>`;

  sizesCode = `<tw-badge variant="primary" size="sm">Small</tw-badge>
<tw-badge variant="primary" size="md">Medium</tw-badge>
<tw-badge variant="primary" size="lg">Large</tw-badge>`;

  pillCode = `<tw-badge variant="primary" [pill]="true">Pill Badge</tw-badge>
<tw-badge variant="success" [pill]="true">Active</tw-badge>
<tw-badge variant="info" [pill]="true">99+</tw-badge>`;

  removableCode = `<tw-badge
  variant="primary"
  [removable]="true"
  (remove)="onRemove()">
  Removable
</tw-badge>

<tw-badge
  variant="success"
  badgeStyle="soft"
  [removable]="true"
  (remove)="onRemove()">
  Tag
</tw-badge>`;

  groupCode = `<tw-badge-group gap="sm">
  <tw-badge variant="primary" badgeStyle="soft">Angular</tw-badge>
  <tw-badge variant="info" badgeStyle="soft">TypeScript</tw-badge>
  <tw-badge variant="success" badgeStyle="soft">Tailwind</tw-badge>
  <tw-badge variant="warning" badgeStyle="soft">CSS</tw-badge>
</tw-badge-group>`;
}
