import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeSidebarPosition, NativeSidebarVariant, SidebarItem } from './native.types';
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
  templateUrl: './sidebar.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
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
      variant === 'floating' ? '' : positionClasses[position]
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
