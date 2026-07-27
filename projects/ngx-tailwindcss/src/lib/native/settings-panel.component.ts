import {
  Component,
  computed,
  contentChildren,
  Directive,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SettingsCategory {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface SettingItem {
  id: string;
  categoryId: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'text' | 'number' | 'color' | 'path' | 'shortcut';
  value: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
}

@Directive({
  selector: '[twSettingTemplate]',
  standalone: true,
})
export class TwSettingTemplateDirective {
  public readonly settingId = input.required<string>({ alias: 'twSettingTemplate' });
  constructor(public readonly template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'tw-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-panel.component.html',
})
export class TwSettingsPanelComponent {
  public readonly categories = input<SettingsCategory[]>([]);
  public readonly settings = input<SettingItem[]>([]);

  public readonly settingChanged = output<{ setting: SettingItem; value: unknown }>();
  public readonly resetToDefaults = output();
  public readonly exportSettings = output();
  public readonly importSettings = output();
  public readonly browsePath = output<SettingItem>();
  public readonly editShortcut = output<SettingItem>();

  public readonly templates = contentChildren(TwSettingTemplateDirective);

  public readonly searchQuery = signal('');
  public readonly selectedCategoryId = signal<string | null>(null);

  public readonly selectedCategory = computed(() => {
    const id = this.selectedCategoryId();
    if (!id && this.categories().length > 0) {
      return this.categories()[0];
    }
    return this.categories().find(c => c.id === id);
  });

  public readonly filteredSettings = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const categoryId = this.selectedCategory()?.id;

    return this.settings().filter(setting => {
      const matchesCategory = !categoryId || setting.categoryId === categoryId;
      const matchesQuery =
        !query ||
        setting.label.toLowerCase().includes(query) ||
        setting.description?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  public toggleSetting(setting: SettingItem): void {
    const newValue = !setting.value;
    this.settingChanged.emit({ setting, value: newValue });
  }

  public updateSetting(setting: SettingItem, value: unknown): void {
    this.settingChanged.emit({ setting, value });
  }
}
