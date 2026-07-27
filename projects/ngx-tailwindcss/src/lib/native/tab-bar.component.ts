import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarPosition, TabBarVariant, TabEvent, TabItem } from './native.types';

/**
 * Document/file tab bar component
 * Supports closable tabs, drag to reorder, pinning, and dirty indicators
 *
 * @example
 * ```html
 * <tw-tab-bar [tabs]="openTabs" [activeTabId]="currentTabId" (tabSelect)="onTabSelect($event)"></tw-tab-bar>
 * ```
 */
@Component({
  selector: 'tw-tab-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-bar.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .scrollbar-thin::-webkit-scrollbar {
        height: 4px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        border-radius: 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-tab-bar',
  },
})
export class TwTabBarComponent {
  // Inputs
  public readonly tabs = input<TabItem[]>([]);
  public readonly activeTabId = input<string | null>(null);
  public readonly variant = input<TabBarVariant>('default');
  public readonly position = input<TabBarPosition>('top');
  public readonly showAddButton = input(true);
  public readonly showOverflowMenu = input(true);

  // Outputs
  public readonly tabSelect = output<TabEvent>();
  public readonly tabClose = output<TabEvent>();
  public readonly tabPin = output<TabEvent>();
  public readonly tabReorder = output<{ from: number; to: number }>();
  public readonly addTab = output();
  public readonly closeAll = output();
  public readonly closeOthers = output<string>(); // ID of tab to keep

  // State
  protected readonly overflowMenuOpen = signal(false);
  private draggedTabIndex: number | null = null;

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const position = this.position();

    const base = 'flex items-center';

    const variantClasses: Record<TabBarVariant, string> = {
      default: 'bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      pills: 'bg-transparent p-1 gap-1',
      underline: 'bg-transparent border-b border-gray-200 dark:border-gray-700',
      boxed: 'bg-gray-50 dark:bg-gray-900 p-1 rounded-lg',
    };

    return `${base} ${variantClasses[variant]}`;
  });

  protected getTabClasses(tab: TabItem): string {
    const variant = this.variant();
    const isActive = tab.id === this.activeTabId();

    const base = 'flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors';

    const variantClasses: Record<TabBarVariant, { active: string; inactive: string }> = {
      default: {
        active:
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-t-2 border-t-blue-500',
        inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
      },
      pills: {
        active: 'bg-blue-500 text-white rounded-md',
        inactive:
          'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md',
      },
      underline: {
        active: 'text-blue-600 dark:text-blue-400 font-medium',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
      },
      boxed: {
        active: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm',
        inactive:
          'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-md',
      },
    };

    const classes = variantClasses[variant];
    return `${base} ${isActive ? classes.active : classes.inactive}`;
  }

  protected selectTab(tab: TabItem, index: number): void {
    this.tabSelect.emit({ tab, index, action: 'select' });
  }

  protected closeTab(tab: TabItem, index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.tabClose.emit({ tab, index, action: 'close' });
  }

  protected onMiddleClick(tab: TabItem, index: number, event: MouseEvent): void {
    // Middle click to close
    if (event.button === 1 && tab.closable !== false && !tab.pinned) {
      event.preventDefault();
      this.tabClose.emit({ tab, index, action: 'close' });
    }
  }

  protected onDragStart(tab: TabItem, index: number, event: DragEvent): void {
    this.draggedTabIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', tab.id);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  protected onDrop(toIndex: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggedTabIndex !== null && this.draggedTabIndex !== toIndex) {
      this.tabReorder.emit({ from: this.draggedTabIndex, to: toIndex });
    }
    this.draggedTabIndex = null;
  }

  protected closeAllTabs(): void {
    this.overflowMenuOpen.set(false);
    this.closeAll.emit();
  }

  protected closeOtherTabs(): void {
    this.overflowMenuOpen.set(false);
    const activeId = this.activeTabId();
    if (activeId) {
      this.closeOthers.emit(activeId);
    }
  }
}
