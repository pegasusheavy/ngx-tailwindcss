import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwFocusTrapDirective } from '../directives';

export interface PreferencesTab {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'tw-preferences-dialog',
  standalone: true,
  imports: [CommonModule, TwFocusTrapDirective],
  templateUrl: './preferences-dialog.component.html',
})
export class TwPreferencesDialogComponent {
  public readonly title = input('Preferences');
  public readonly tabs = input<PreferencesTab[]>([]);
  public readonly defaultTabId = input<string | null>(null);

  public readonly tabChanged = output<string>();
  public readonly closed = output();

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
