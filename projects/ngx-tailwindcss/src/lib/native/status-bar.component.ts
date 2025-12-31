import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBarItem } from './native.types';

/**
 * Application status bar component
 * Displays status information at the bottom of the window
 *
 * @example
 * ```html
 * <tw-status-bar [items]="statusItems" (itemClick)="onStatusClick($event)"></tw-status-bar>
 * ```
 */
@Component({
  selector: 'tw-status-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      class="flex items-center justify-between h-6 px-2 text-xs bg-blue-600 text-white select-none"
      role="status"
    >
      <!-- Left items -->
      <div class="flex items-center gap-2 min-w-0">
        @for (item of leftItems(); track item.id) {
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
          ></ng-container>
        }
      </div>

      <!-- Center items -->
      <div class="flex items-center gap-2">
        @for (item of centerItems(); track item.id) {
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
          ></ng-container>
        }
      </div>

      <!-- Right items -->
      <div class="flex items-center gap-2 min-w-0">
        @for (item of rightItems(); track item.id) {
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
          ></ng-container>
        }
      </div>
    </footer>

    <!-- Item template -->
    <ng-template #itemTemplate let-item>
      @if (item.clickable) {
        <button
          type="button"
          class="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors truncate"
          [attr.title]="item.tooltip"
          (click)="onItemClick(item)"
        >
          @if (item.icon) {
            <span class="flex-shrink-0">{{ item.icon }}</span>
          }
          <span class="truncate">{{ item.content }}</span>
        </button>
      } @else {
        <span class="flex items-center gap-1 px-1.5 truncate" [attr.title]="item.tooltip">
          @if (item.icon) {
            <span class="flex-shrink-0">{{ item.icon }}</span>
          }
          <span class="truncate">{{ item.content }}</span>
        </span>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-status-bar block',
  },
})
export class TwStatusBarComponent {
  // Inputs
  public readonly items = input<StatusBarItem[]>([]);
  public readonly variant = input<'default' | 'minimal'>('default');

  // Outputs
  public readonly itemClick = output<StatusBarItem>();

  // Computed - sort items by position and priority
  protected readonly leftItems = computed(() =>
    this.items()
      .filter(i => i.position === 'left')
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
  );

  protected readonly centerItems = computed(() =>
    this.items()
      .filter(i => i.position === 'center')
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
  );

  protected readonly rightItems = computed(() =>
    this.items()
      .filter(i => i.position === 'right')
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
  );

  protected onItemClick(item: StatusBarItem): void {
    if (item.action) {
      item.action();
    }
    this.itemClick.emit(item);
  }
}
