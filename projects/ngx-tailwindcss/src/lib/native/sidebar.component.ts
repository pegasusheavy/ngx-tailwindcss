import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarItem, NativeSidebarVariant, NativeSidebarPosition } from './native.types';
import { TwClassService } from '../core/tw-class.service';

/**
 * Collapsible sidebar navigation component
 * Supports nested items, badges, icons, and multiple variants
 *
 * @example
 * ```html
 * <tw-sidebar-nav [items]="navItems" (itemSelect)="onNavigate($event)"></tw-sidebar-nav>
 * <tw-sidebar-nav [items]="navItems" [collapsed]="isCollapsed" variant="compact"></tw-sidebar-nav>
 * ```
 */
@Component({
  selector: 'tw-sidebar-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside
      [class]="containerClasses()"
      [style.width]="collapsed() ? collapsedWidth() + 'px' : width() + 'px'"
      role="navigation"
      [attr.aria-label]="'Sidebar navigation'"
    >
      <!-- Header -->
      @if (showHeader()) {
        <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          @if (!collapsed()) {
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ headerTitle() }}</span>
          }
          @if (collapsible()) {
            <button
              type="button"
              class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
              (click)="toggleCollapse()"
            >
              <svg
                class="w-4 h-4 text-gray-500 transition-transform"
                [class.rotate-180]="collapsed()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          }
        </div>
      }

      <!-- Navigation items -->
      <nav class="flex-1 overflow-y-auto py-2">
        <ul class="space-y-0.5" role="tree">
          @for (item of items(); track item.id) {
            <li role="treeitem" [attr.aria-expanded]="item.children?.length ? item.expanded : undefined">
              <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, depth: 0 }"></ng-container>
            </li>
          }
        </ul>
      </nav>

      <!-- Footer slot -->
      <div class="border-t border-gray-200 dark:border-gray-700">
        <ng-content select="[sidebarFooter]"></ng-content>
      </div>
    </aside>

    <!-- Item template for recursive rendering -->
    <ng-template #itemTemplate let-item let-depth="depth">
      <div>
        <button
          type="button"
          class="w-full flex items-center gap-2 transition-colors rounded-md"
          [class]="getItemClasses(item, depth)"
          [class.bg-blue-100]="item.active && !collapsed()"
          [class.dark:bg-blue-900/30]="item.active && !collapsed()"
          [class.bg-blue-500]="item.active && collapsed()"
          [class.hover:bg-gray-100]="!item.active && !item.disabled"
          [class.dark:hover:bg-gray-700/50]="!item.active && !item.disabled"
          [class.opacity-50]="item.disabled"
          [class.cursor-not-allowed]="item.disabled"
          [disabled]="item.disabled"
          [attr.aria-current]="item.active ? 'page' : undefined"
          [attr.title]="collapsed() ? item.label : undefined"
          (click)="onItemClick(item)"
        >
          <!-- Icon -->
          @if (item.icon) {
            <span
              class="flex-shrink-0 text-lg"
              [class.text-blue-600]="item.active"
              [class.dark:text-blue-400]="item.active"
              [class.text-gray-500]="!item.active"
              [class.dark:text-gray-400]="!item.active"
            >
              {{ item.icon }}
            </span>
          }

          <!-- Label -->
          @if (!collapsed()) {
            <span
              class="flex-1 truncate text-sm"
              [class.text-blue-700]="item.active"
              [class.dark:text-blue-300]="item.active"
              [class.text-gray-700]="!item.active"
              [class.dark:text-gray-300]="!item.active"
              [class.font-medium]="item.active"
            >
              {{ item.label }}
            </span>
          }

          <!-- Badge -->
          @if (item.badge && !collapsed()) {
            <span class="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {{ item.badge }}
            </span>
          }

          <!-- Expand/collapse arrow for items with children -->
          @if (item.children?.length && !collapsed()) {
            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              [class.rotate-90]="item.expanded"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          }
        </button>

        <!-- Children -->
        @if (item.children?.length && item.expanded && !collapsed()) {
          <ul class="mt-0.5" role="group">
            @for (child of item.children; track child.id) {
              <li role="treeitem">
                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: child, depth: depth + 1 }"></ng-container>
              </li>
            }
          </ul>
        }
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-sidebar-nav',
  },
})
export class TwSidebarNavComponent {
  private readonly twClass = inject(TwClassService);

  // Inputs
  public readonly items = input<SidebarItem[]>([]);
  public readonly variant = input<NativeSidebarVariant>('default');
  public readonly position = input<NativeSidebarPosition>('left');
  public readonly width = input(240);
  public readonly collapsedWidth = input(56);
  public readonly collapsed = input(false);
  public readonly collapsible = input(true);
  public readonly showHeader = input(false);
  public readonly headerTitle = input('Navigation');

  // Outputs
  public readonly itemSelect = output<SidebarItem>();
  public readonly itemExpand = output<SidebarItem>();
  public readonly collapsedChange = output<boolean>();

  // Internal state
  private readonly _collapsed = signal(false);

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const position = this.position();

    const base = 'flex flex-col h-full transition-all duration-200 ease-in-out overflow-hidden';

    const variantClasses: Record<NativeSidebarVariant, string> = {
      default: 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
      compact: 'bg-gray-50 dark:bg-gray-900',
      floating: 'bg-white dark:bg-gray-800 shadow-lg rounded-lg m-2',
    };

    const positionClasses: Record<NativeSidebarPosition, string> = {
      left: 'border-r',
      right: 'border-l',
    };

    return this.twClass.merge(
      base,
      variantClasses[variant],
      variant !== 'floating' ? positionClasses[position] : ''
    );
  });

  protected getItemClasses(item: SidebarItem, depth: number): string {
    const paddingLeft = this.collapsed() ? 'px-3' : `pl-${3 + depth * 3}`;
    return `py-2 pr-3 ${paddingLeft}`;
  }

  protected toggleCollapse(): void {
    const newValue = !this.collapsed();
    this._collapsed.set(newValue);
    this.collapsedChange.emit(newValue);
  }

  protected onItemClick(item: SidebarItem): void {
    if (item.disabled) return;

    // Toggle expansion for items with children
    if (item.children?.length) {
      item.expanded = !item.expanded;
      this.itemExpand.emit(item);
    } else {
      this.itemSelect.emit(item);
    }
  }
}

