import { Component, input, output, signal, computed } from '@angular/core';
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
  template: `
    <div class="h-full flex flex-col bg-white dark:bg-slate-900">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700"
      >
        <h3 class="font-medium text-slate-900 dark:text-slate-100">{{ title() }}</h3>
        <button
          (click)="refresh.emit()"
          class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <!-- Properties -->
      <div class="flex-1 overflow-y-auto">
        @for (category of categories(); track category) {
          <div class="border-b border-slate-200 dark:border-slate-700">
            <button
              (click)="toggleCategory(category)"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <svg
                class="w-4 h-4 transition-transform"
                [class.rotate-90]="!collapsedCategories().has(category)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {{ category || 'General' }}
            </button>

            @if (!collapsedCategories().has(category)) {
              <div class="pb-2">
                @for (prop of getPropertiesByCategory(category); track prop.key) {
                  <div
                    class="flex items-start px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div class="w-1/2 flex items-center gap-2 pr-2">
                      <span
                        class="text-sm text-slate-600 dark:text-slate-400 truncate"
                        [title]="prop.key"
                      >
                        {{ prop.key }}
                      </span>
                      <button
                        (click)="copyValue(prop)"
                        class="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-600"
                        title="Copy value"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="w-1/2">
                      @if (prop.editable) {
                        @switch (prop.type) {
                          @case ('boolean') {
                            <button
                              (click)="updateProperty(prop, !prop.value)"
                              [class.bg-blue-600]="prop.value"
                              [class.bg-slate-200]="!prop.value"
                              class="relative w-8 h-5 rounded-full transition-colors"
                            >
                              <span
                                [class.translate-x-3]="prop.value"
                                class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                              ></span>
                            </button>
                          }
                          @case ('color') {
                            <input
                              type="color"
                              [ngModel]="prop.value"
                              (ngModelChange)="updateProperty(prop, $event)"
                              class="w-8 h-6 rounded cursor-pointer"
                            />
                          }
                          @case ('number') {
                            <input
                              type="number"
                              [ngModel]="prop.value"
                              (ngModelChange)="updateProperty(prop, $event)"
                              class="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded border-none"
                            />
                          }
                          @default {
                            <input
                              type="text"
                              [ngModel]="prop.value"
                              (ngModelChange)="updateProperty(prop, $event)"
                              class="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded border-none"
                            />
                          }
                        }
                      } @else {
                        @switch (prop.type) {
                          @case ('boolean') {
                            <span
                              [class.text-green-600]="prop.value"
                              [class.text-red-600]="!prop.value"
                              class="text-sm font-mono"
                            >
                              {{ prop.value }}
                            </span>
                          }
                          @case ('null') {
                            <span class="text-sm font-mono text-slate-400 italic">null</span>
                          }
                          @case ('color') {
                            <div class="flex items-center gap-2">
                              <div
                                class="w-4 h-4 rounded"
                                [style.background-color]="prop.value"
                              ></div>
                              <span class="text-sm font-mono text-slate-700 dark:text-slate-300">{{
                                prop.value
                              }}</span>
                            </div>
                          }
                          @case ('object') {
                            <button
                              (click)="expandObject(prop)"
                              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {{ '{...}' }}
                            </button>
                          }
                          @case ('array') {
                            <button
                              (click)="expandObject(prop)"
                              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              [{{ getArrayLength(prop.value) }} items]
                            </button>
                          }
                          @default {
                            <span
                              class="text-sm font-mono text-slate-700 dark:text-slate-300 break-all"
                            >
                              {{ formatValue(prop.value) }}
                            </span>
                          }
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        @if (properties().length === 0) {
          <div class="flex flex-col items-center justify-center py-12 text-slate-500">
            <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p>No properties to display</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class TwPropertyInspectorComponent {
  public readonly title = input('Properties');
  public readonly properties = input<PropertyItem[]>([]);

  public readonly propertyChanged = output<{ property: PropertyItem; value: unknown }>();
  public readonly refresh = output<void>();
  public readonly objectExpanded = output<PropertyItem>();
  public readonly valueCopied = output<PropertyItem>();

  public readonly collapsedCategories = signal(new Set<string>());

  public readonly categories = computed(() => {
    const cats = new Set<string>();
    this.properties().forEach(p => cats.add(p.category || ''));
    return Array.from(cats).sort();
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
    navigator.clipboard.writeText(String(property.value));
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
