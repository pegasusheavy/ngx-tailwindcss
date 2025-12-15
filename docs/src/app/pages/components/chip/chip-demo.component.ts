import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwChipComponent, TwChipsComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-chip-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwChipComponent,
    TwChipsComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './chip-demo.component.html',
})
export class ChipDemoComponent {
  tags = ['Angular', 'TypeScript', 'Tailwind', 'CSS'];
  inputTags = ['React', 'Vue', 'Svelte'];

  onRemove(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onTagAdded(tag: string): void {
    console.log('Tag added:', tag);
  }

  onTagRemoved(event: { value: string; index: number }): void {
    console.log('Tag removed:', event.value);
  }

  basicCode = `<tw-chip label="Default"></tw-chip>
<tw-chip label="Removable" [removable]="true" (onRemove)="handleRemove()"></tw-chip>`;

  variantsCode = `<tw-chip variant="primary" label="Primary"></tw-chip>
<tw-chip variant="secondary" label="Secondary"></tw-chip>
<tw-chip variant="success" label="Success"></tw-chip>
<tw-chip variant="warning" label="Warning"></tw-chip>
<tw-chip variant="danger" label="Danger"></tw-chip>
<tw-chip variant="info" label="Info"></tw-chip>`;

  stylesCode = `<tw-chip chipStyle="solid" label="Solid"></tw-chip>
<tw-chip chipStyle="soft" label="Soft"></tw-chip>
<tw-chip chipStyle="outline" label="Outline"></tw-chip>`;

  sizesCode = `<tw-chip size="sm" label="Small"></tw-chip>
<tw-chip size="md" label="Medium"></tw-chip>
<tw-chip size="lg" label="Large"></tw-chip>`;

  removableCode = `@for (tag of tags; track tag) {
  <tw-chip
    [label]="tag"
    variant="primary"
    chipStyle="outline"
    [removable]="true"
    (onRemove)="onRemove(tag)">
  </tw-chip>
}`;

  chipsInputCode = `<!-- Chips input with two-way binding -->
<tw-chips
  [(values)]="tags"
  variant="primary"
  chipStyle="soft"
  placeholder="Type and press Enter..."
  (onAdd)="onTagAdded($event)"
  (onRemove)="onTagRemoved($event)">
</tw-chips>`;
}

