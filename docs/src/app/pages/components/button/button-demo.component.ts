import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faCheck, faTrash, faHeart, faGear } from '@fortawesome/free-solid-svg-icons';
import { TwButtonComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
  isLoading = signal(false);

  protected icons = {
    plus: faPlus,
    check: faCheck,
    trash: faTrash,
    heart: faHeart,
    gear: faGear,
  };

  simulateLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }

  // Code examples
  variantsCode = `<tw-button variant="primary">Primary</tw-button>
<tw-button variant="secondary">Secondary</tw-button>
<tw-button variant="success">Success</tw-button>
<tw-button variant="warning">Warning</tw-button>
<tw-button variant="danger">Danger</tw-button>
<tw-button variant="info">Info</tw-button>
<tw-button variant="ghost">Ghost</tw-button>
<tw-button variant="outline">Outline</tw-button>
<tw-button variant="link">Link</tw-button>`;

  sizesCode = `<tw-button variant="primary" size="xs">Extra Small</tw-button>
<tw-button variant="primary" size="sm">Small</tw-button>
<tw-button variant="primary" size="md">Medium</tw-button>
<tw-button variant="primary" size="lg">Large</tw-button>
<tw-button variant="primary" size="xl">Extra Large</tw-button>`;

  statesCode = `<tw-button variant="primary" [disabled]="true">Disabled</tw-button>
<tw-button variant="primary" [loading]="true">Loading</tw-button>
<tw-button variant="secondary" [loading]="isLoading()" (click)="simulateLoading()">
  Click to Load
</tw-button>`;

  iconsCode = `<!-- Icon before text -->
<tw-button variant="primary">
  <fa-icon [icon]="faPlus" twButtonIcon></fa-icon>
  Add Item
</tw-button>

<!-- Icon after text -->
<tw-button variant="danger">
  Delete
  <fa-icon [icon]="faTrash" twButtonIconEnd></fa-icon>
</tw-button>`;

  iconOnlyCode = `<tw-button variant="primary" [iconOnly]="true" size="sm">
  <fa-icon [icon]="faPlus" twButtonIcon></fa-icon>
</tw-button>
<tw-button variant="secondary" [iconOnly]="true">
  <fa-icon [icon]="faHeart" twButtonIcon></fa-icon>
</tw-button>
<tw-button variant="ghost" [iconOnly]="true" size="lg">
  <fa-icon [icon]="faGear" twButtonIcon></fa-icon>
</tw-button>`;

  fullWidthCode = `<tw-button variant="primary" [fullWidth]="true">Full Width Primary</tw-button>
<tw-button variant="outline" [fullWidth]="true">Full Width Outline</tw-button>`;

  customCode = `<!-- Override specific classes -->
<tw-button
  variant="primary"
  classOverride="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
  Gradient Button
</tw-button>

<!-- Replace all classes -->
<tw-button
  classReplace="px-6 py-2 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800">
  Custom Button
</tw-button>`;
}
