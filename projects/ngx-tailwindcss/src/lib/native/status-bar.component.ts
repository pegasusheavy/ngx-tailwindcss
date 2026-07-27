import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
  templateUrl: './status-bar.component.html',
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
