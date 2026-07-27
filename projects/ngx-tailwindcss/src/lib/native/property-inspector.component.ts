import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PropertyItem {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'color' | 'date' | 'object' | 'array' | 'null';
  editable?: boolean;
  category?: string;
}

@Component({
  selector: 'tw-property-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-inspector.component.html',
})
export class TwPropertyInspectorComponent {
  public readonly title = input('Properties');
  public readonly properties = input<PropertyItem[]>([]);

  public readonly propertyChanged = output<{ property: PropertyItem; value: unknown }>();
  public readonly refresh = output();
  public readonly objectExpanded = output<PropertyItem>();
  public readonly valueCopied = output<PropertyItem>();

  public readonly collapsedCategories = signal(new Set<string>());

  public readonly categories = computed(() => {
    const cats = new Set<string>();
    this.properties().forEach(p => cats.add(p.category || ''));
    return [...cats].sort();
  });

  public getPropertiesByCategory(category: string): PropertyItem[] {
    return this.properties().filter(p => (p.category || '') === category);
  }

  public toggleCategory(category: string): void {
    const current = new Set(this.collapsedCategories());
    if (current.has(category)) {
      current.delete(category);
    } else {
      current.add(category);
    }
    this.collapsedCategories.set(current);
  }

  public updateProperty(property: PropertyItem, value: unknown): void {
    this.propertyChanged.emit({ property, value });
  }

  public copyValue(property: PropertyItem): void {
    void navigator.clipboard.writeText(String(property.value));
    this.valueCopied.emit(property);
  }

  public expandObject(property: PropertyItem): void {
    this.objectExpanded.emit(property);
  }

  public formatValue(value: unknown): string {
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  }

  public getArrayLength(value: unknown): number {
    return Array.isArray(value) ? value.length : 0;
  }
}
