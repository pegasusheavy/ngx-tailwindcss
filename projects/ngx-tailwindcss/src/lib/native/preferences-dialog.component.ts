import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreferencesTab {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'tw-preferences-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="close()"></div>

        <!-- Dialog -->
        <div
          class="relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <!-- macOS-style Header -->
          <div
            class="flex items-center justify-center py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
          >
            <h2 class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ title() }}</h2>
            <button
              (click)="close()"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <svg
                class="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Tab Icons (macOS style) -->
          <div
            class="flex items-center justify-center gap-2 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30"
          >
            @for (tab of tabs(); track tab.id) {
              <button
                (click)="selectedTabId.set(tab.id)"
                [class.bg-blue-100]="selectedTabId() === tab.id"
                [class.dark:bg-blue-900/40]="selectedTabId() === tab.id"
                [class.text-blue-600]="selectedTabId() === tab.id"
                [class.dark:text-blue-400]="selectedTabId() === tab.id"
                class="flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span class="text-xs font-medium">{{ tab.label }}</span>
              </button>
            }
          </div>

          <!-- Content -->
          <div class="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
})
export class TwPreferencesDialogComponent {
  public readonly title = input('Preferences');
  public readonly tabs = input<PreferencesTab[]>([]);
  public readonly defaultTabId = input<string | null>(null);

  public readonly tabChanged = output<string>();
  public readonly closed = output<void>();

  public readonly isOpen = signal(false);
  public readonly selectedTabId = signal<string | null>(null);

  public readonly selectedTab = computed(() => {
    const id = this.selectedTabId() || this.defaultTabId() || this.tabs()[0]?.id;
    return this.tabs().find(t => t.id === id);
  });

  public open(tabId?: string): void {
    this.isOpen.set(true);
    if (tabId) {
      this.selectedTabId.set(tabId);
    } else if (this.defaultTabId()) {
      this.selectedTabId.set(this.defaultTabId());
    } else if (this.tabs().length > 0) {
      this.selectedTabId.set(this.tabs()[0].id);
    }
  }

  public close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  public selectTab(tabId: string): void {
    this.selectedTabId.set(tabId);
    this.tabChanged.emit(tabId);
  }
}
