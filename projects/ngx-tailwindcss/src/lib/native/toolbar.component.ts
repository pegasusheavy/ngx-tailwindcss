import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarItem, ToolbarVariant, ToolbarPosition } from './native.types';

/**
 * Toolbar / Action bar component
 * Displays action buttons with icons and tooltips
 *
 * @example
 * ```html
 * <tw-toolbar [items]="toolbarItems" (itemClick)="onToolbarAction($event)"></tw-toolbar>
 * ```
 */
@Component({
  selector: 'tw-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()" role="toolbar" [attr.aria-label]="'Toolbar'">
      @for (item of items(); track item.id) {
        @switch (item.type) {
          @case ('separator') {
            <div [class]="separatorClasses()"></div>
          }
          @case ('spacer') {
            <div class="flex-1"></div>
          }
          @case ('dropdown') {
            <div class="relative">
              <button
                type="button"
                [class]="getButtonClasses(item)"
                [attr.aria-label]="item.tooltip || item.label"
                [attr.title]="item.tooltip || item.label"
                [disabled]="item.disabled"
                (click)="toggleDropdown(item)"
              >
                @if (item.icon) {
                  <span class="text-base">{{ item.icon }}</span>
                }
                @if (item.label && showLabels()) {
                  <span class="text-sm">{{ item.label }}</span>
                }
                <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
              </button>

              @if (openDropdownId === item.id && item.items?.length) {
                <div class="absolute top-full left-0 mt-1 py-1 min-w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  @for (subItem of item.items; track subItem.id) {
                    @if (subItem.type === 'separator') {
                      <div class="h-px my-1 bg-gray-200 dark:bg-gray-700"></div>
                    } @else {
                      <button
                        type="button"
                        class="w-full px-3 py-1.5 flex items-center gap-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        [class.opacity-50]="subItem.disabled"
                        [disabled]="subItem.disabled"
                        (click)="onItemClick(subItem)"
                      >
                        @if (subItem.icon) {
                          <span>{{ subItem.icon }}</span>
                        }
                        <span>{{ subItem.label }}</span>
                      </button>
                    }
                  }
                </div>
              }
            </div>
          }
          @case ('toggle') {
            <button
              type="button"
              [class]="getButtonClasses(item)"
              [class.bg-blue-100]="item.active"
              [class.dark:bg-blue-900/50]="item.active"
              [class.text-blue-600]="item.active"
              [class.dark:text-blue-400]="item.active"
              [attr.aria-label]="item.tooltip || item.label"
              [attr.title]="item.tooltip || item.label"
              [attr.aria-pressed]="item.active"
              [disabled]="item.disabled"
              (click)="onItemClick(item)"
            >
              @if (item.icon) {
                <span class="text-base">{{ item.icon }}</span>
              }
              @if (item.label && showLabels()) {
                <span class="text-sm">{{ item.label }}</span>
              }
            </button>
          }
          @default {
            <button
              type="button"
              [class]="getButtonClasses(item)"
              [attr.aria-label]="item.tooltip || item.label"
              [attr.title]="item.tooltip || item.label"
              [disabled]="item.disabled"
              (click)="onItemClick(item)"
            >
              @if (item.icon) {
                <span class="text-base">{{ item.icon }}</span>
              }
              @if (item.label && showLabels()) {
                <span class="text-sm">{{ item.label }}</span>
              }
            </button>
          }
        }
      }

      <!-- Overflow menu for responsive -->
      <ng-content select="[toolbarOverflow]"></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-toolbar block',
  },
})
export class TwToolbarComponent {
  // Inputs
  public readonly items = input<ToolbarItem[]>([]);
  public readonly variant = input<ToolbarVariant>('default');
  public readonly position = input<ToolbarPosition>('top');
  public readonly showLabels = input(false);

  // Outputs
  public readonly itemClick = output<ToolbarItem>();

  // State
  protected openDropdownId: string | null = null;

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const position = this.position();

    const base = 'flex items-center gap-1 p-1';

    const variantClasses: Record<ToolbarVariant, string> = {
      default: 'bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      compact: 'bg-gray-50 dark:bg-gray-900',
      large: 'bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2',
    };

    const positionClasses: Record<ToolbarPosition, string> = {
      top: 'border-b',
      bottom: 'border-t',
      left: 'flex-col border-r',
      right: 'flex-col border-l',
    };

    return `${base} ${variantClasses[variant]} ${positionClasses[position]}`;
  });

  protected readonly separatorClasses = computed(() => {
    const position = this.position();

    if (position === 'left' || position === 'right') {
      return 'w-full h-px my-1 bg-gray-300 dark:bg-gray-600';
    }
    return 'w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600';
  });

  protected getButtonClasses(item: ToolbarItem): string {
    const variant = this.variant();
    const base = 'flex items-center gap-1.5 rounded transition-colors';

    const sizeClasses: Record<ToolbarVariant, string> = {
      default: 'p-1.5',
      compact: 'p-1',
      large: 'p-2',
    };

    const stateClasses = item.disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300';

    return `${base} ${sizeClasses[variant]} ${stateClasses}`;
  }

  protected toggleDropdown(item: ToolbarItem): void {
    if (this.openDropdownId === item.id) {
      this.openDropdownId = null;
    } else {
      this.openDropdownId = item.id;
    }
  }

  protected onItemClick(item: ToolbarItem): void {
    if (item.disabled) return;

    if (item.action) {
      item.action();
    }

    this.itemClick.emit(item);
    this.openDropdownId = null;
  }
}

