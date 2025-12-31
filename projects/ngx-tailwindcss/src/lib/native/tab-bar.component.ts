import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabItem, TabBarVariant, TabBarPosition, TabEvent } from './native.types';

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
  template: `
    <div [class]="containerClasses()" role="tablist" [attr.aria-label]="'Document tabs'">
      <!-- Tabs container with horizontal scroll -->
      <div
        class="flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        #tabsContainer
      >
        @for (tab of tabs(); track tab.id; let i = $index) {
          <div
            class="flex-shrink-0 group relative"
            [class.order-first]="tab.pinned"
            draggable="true"
            (dragstart)="onDragStart(tab, i, $event)"
            (dragover)="onDragOver($event)"
            (drop)="onDrop(i, $event)"
          >
            <button
              type="button"
              [class]="getTabClasses(tab)"
              role="tab"
              [attr.aria-selected]="tab.id === activeTabId()"
              [attr.aria-controls]="'tabpanel-' + tab.id"
              [attr.title]="tab.tooltip || tab.label"
              (click)="selectTab(tab, i)"
              (auxclick)="onMiddleClick(tab, i, $event)"
            >
              <!-- Pin indicator -->
              @if (tab.pinned) {
                <svg
                  class="w-3 h-3 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"
                  />
                </svg>
              }

              <!-- Icon -->
              @if (tab.icon) {
                <span class="flex-shrink-0 text-sm">{{ tab.icon }}</span>
              }

              <!-- Label -->
              <span class="truncate max-w-32">{{ tab.label }}</span>

              <!-- Dirty indicator -->
              @if (tab.dirty) {
                <span class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
              }

              <!-- Close button -->
              @if (tab.closable !== false && !tab.pinned) {
                <button
                  type="button"
                  class="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  [attr.aria-label]="'Close ' + tab.label"
                  (click)="closeTab(tab, i, $event)"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              }
            </button>

            <!-- Active indicator (for underline variant) -->
            @if (variant() === 'underline' && tab.id === activeTabId()) {
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            }
          </div>
        }
      </div>

      <!-- Add tab button -->
      @if (showAddButton()) {
        <button
          type="button"
          class="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          [attr.aria-label]="'New tab'"
          (click)="addTab.emit()"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      }

      <!-- Overflow menu -->
      @if (showOverflowMenu()) {
        <div class="relative flex-shrink-0">
          <button
            type="button"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            [attr.aria-label]="'More tabs'"
            (click)="overflowMenuOpen.set(!overflowMenuOpen())"
          >
            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
              />
            </svg>
          </button>

          @if (overflowMenuOpen()) {
            <div
              class="absolute right-0 top-full mt-1 w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
            >
              <button
                type="button"
                class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                (click)="closeAllTabs()"
              >
                Close All Tabs
              </button>
              <button
                type="button"
                class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                (click)="closeOtherTabs()"
              >
                Close Other Tabs
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
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
  public readonly addTab = output<void>();
  public readonly closeAll = output<void>();
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
