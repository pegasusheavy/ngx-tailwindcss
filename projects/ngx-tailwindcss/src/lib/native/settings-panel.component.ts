import {
  Component,
  input,
  output,
  signal,
  computed,
  TemplateRef,
  contentChildren,
  Directive,
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
  options?: { label: string; value: unknown }[];
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
  template: `
    <div class="flex h-full bg-white dark:bg-slate-900">
      <!-- Sidebar -->
      <div class="w-56 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <!-- Search -->
        <div class="p-3 border-b border-slate-200 dark:border-slate-700">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search settings..."
              class="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <!-- Categories -->
        <nav class="flex-1 overflow-y-auto p-2">
          @for (category of categories(); track category.id) {
            <button
              (click)="selectedCategoryId.set(category.id)"
              [class.bg-blue-50]="selectedCategoryId() === category.id"
              [class.dark:bg-blue-900/30]="selectedCategoryId() === category.id"
              [class.text-blue-600]="selectedCategoryId() === category.id"
              [class.dark:text-blue-400]="selectedCategoryId() === category.id"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg
                class="w-5 h-5 flex-shrink-0 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{{ category.label }}</span>
            </button>
          }
        </nav>

        <!-- Footer Actions -->
        <div class="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            (click)="resetToDefaults.emit()"
            class="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            (click)="exportSettings.emit()"
            class="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Export Settings
          </button>
          <button
            (click)="importSettings.emit()"
            class="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Import Settings
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        @if (selectedCategory()) {
          <div class="p-6">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {{ selectedCategory()?.label }}
            </h2>
            @if (selectedCategory()?.description) {
              <p class="text-sm text-slate-500 mb-6">{{ selectedCategory()?.description }}</p>
            }

            <div class="space-y-6">
              @for (setting of filteredSettings(); track setting.id) {
                <div
                  class="flex items-start justify-between gap-8 py-4 border-b border-slate-100 dark:border-slate-800"
                >
                  <div class="flex-1">
                    <label
                      [for]="setting.id"
                      class="font-medium text-slate-900 dark:text-slate-100"
                    >
                      {{ setting.label }}
                    </label>
                    @if (setting.description) {
                      <p class="text-sm text-slate-500 mt-1">{{ setting.description }}</p>
                    }
                  </div>

                  <div class="flex-shrink-0 w-64">
                    @switch (setting.type) {
                      @case ('toggle') {
                        <button
                          [id]="setting.id"
                          (click)="toggleSetting(setting)"
                          [disabled]="setting.disabled || false"
                          [class.bg-blue-600]="setting.value"
                          [class.bg-slate-200]="!setting.value"
                          [class.dark:bg-slate-700]="!setting.value"
                          class="relative w-11 h-6 rounded-full transition-colors disabled:opacity-50"
                        >
                          <span
                            [class.translate-x-5]="setting.value"
                            [class.translate-x-0]="!setting.value"
                            class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                          ></span>
                        </button>
                      }
                      @case ('select') {
                        <select
                          [id]="setting.id"
                          [ngModel]="setting.value"
                          (ngModelChange)="updateSetting(setting, $event)"
                          [disabled]="setting.disabled || false"
                          class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                          @for (option of setting.options; track option.value) {
                            <option [ngValue]="option.value">{{ option.label }}</option>
                          }
                        </select>
                      }
                      @case ('text') {
                        <input
                          type="text"
                          [id]="setting.id"
                          [ngModel]="setting.value"
                          (ngModelChange)="updateSetting(setting, $event)"
                          [disabled]="setting.disabled || false"
                          [placeholder]="setting.placeholder || ''"
                          class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        />
                      }
                      @case ('number') {
                        <input
                          type="number"
                          [id]="setting.id"
                          [ngModel]="setting.value"
                          (ngModelChange)="updateSetting(setting, $event)"
                          [disabled]="setting.disabled || false"
                          [min]="setting.min ?? null"
                          [max]="setting.max ?? null"
                          [step]="setting.step || 1"
                          class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        />
                      }
                      @case ('color') {
                        <div class="flex items-center gap-2">
                          <input
                            type="color"
                            [id]="setting.id"
                            [ngModel]="setting.value"
                            (ngModelChange)="updateSetting(setting, $event)"
                            [disabled]="setting.disabled || false"
                            class="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer disabled:opacity-50"
                          />
                          <input
                            type="text"
                            [ngModel]="setting.value"
                            (ngModelChange)="updateSetting(setting, $event)"
                            [disabled]="setting.disabled || false"
                            class="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                          />
                        </div>
                      }
                      @case ('path') {
                        <div class="flex items-center gap-2">
                          <input
                            type="text"
                            [id]="setting.id"
                            [ngModel]="setting.value"
                            (ngModelChange)="updateSetting(setting, $event)"
                            [disabled]="setting.disabled || false"
                            [placeholder]="setting.placeholder || 'Select path...'"
                            class="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                          />
                          <button
                            (click)="browsePath.emit(setting)"
                            [disabled]="setting.disabled || false"
                            class="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors disabled:opacity-50"
                          >
                            Browse
                          </button>
                        </div>
                      }
                      @case ('shortcut') {
                        <button
                          [id]="setting.id"
                          (click)="editShortcut.emit(setting)"
                          [disabled]="setting.disabled || false"
                          class="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-mono transition-colors disabled:opacity-50"
                        >
                          {{ setting.value || 'Click to set...' }}
                        </button>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TwSettingsPanelComponent {
  public readonly categories = input<SettingsCategory[]>([]);
  public readonly settings = input<SettingItem[]>([]);

  public readonly settingChanged = output<{ setting: SettingItem; value: unknown }>();
  public readonly resetToDefaults = output<void>();
  public readonly exportSettings = output<void>();
  public readonly importSettings = output<void>();
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
