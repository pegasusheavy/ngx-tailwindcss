import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NativeBreadcrumbItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  data?: unknown;
}

/**
 * Breadcrumb navigation component
 * Shows path-based navigation with click-to-navigate
 *
 * @example
 * ```html
 * <tw-breadcrumbs-nav [items]="breadcrumbs" (itemSelect)="onNavigate($event)"></tw-breadcrumbs-nav>
 * ```
 */
@Component({
  selector: 'tw-breadcrumbs-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="flex items-center text-sm"
      [attr.aria-label]="'Breadcrumb'"
    >
      <ol class="flex items-center gap-1">
        <!-- Home/Root -->
        @if (showHome()) {
          <li class="flex items-center">
            <button
              type="button"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="'Go to home'"
              (click)="onHomeClick()"
            >
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </button>
            @if (items().length > 0) {
              <span class="mx-1 text-gray-400">/</span>
            }
          </li>
        }

        @for (item of items(); track item.id; let i = $index; let last = $last) {
          <li class="flex items-center min-w-0">
            @if (last) {
              <!-- Current item (not clickable) -->
              <span
                class="flex items-center gap-1 px-1 py-0.5 text-gray-900 dark:text-gray-100 font-medium truncate max-w-48"
                [attr.aria-current]="'page'"
              >
                @if (item.icon) {
                  <span class="flex-shrink-0">{{ item.icon }}</span>
                }
                <span class="truncate">{{ item.label }}</span>
              </span>
            } @else {
              <!-- Clickable breadcrumb -->
              <button
                type="button"
                class="flex items-center gap-1 px-1 py-0.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate max-w-48"
                (click)="onItemClick(item)"
              >
                @if (item.icon) {
                  <span class="flex-shrink-0">{{ item.icon }}</span>
                }
                <span class="truncate">{{ item.label }}</span>
              </button>
              <span class="mx-1 text-gray-400 flex-shrink-0">/</span>
            }
          </li>
        }
      </ol>

      <!-- Editable path mode -->
      @if (editable() && isEditing()) {
        <div class="absolute inset-0 flex items-center bg-white dark:bg-gray-800 px-2">
          <input
            type="text"
            class="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            [value]="editPath()"
            (input)="onPathInput($event)"
            (keydown.enter)="submitPath()"
            (keydown.escape)="cancelEdit()"
            (blur)="cancelEdit()"
            #pathInput
          />
        </div>
      }

      <!-- Edit button -->
      @if (editable() && !isEditing()) {
        <button
          type="button"
          class="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          [attr.aria-label]="'Edit path'"
          (click)="startEdit()"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
      }

      <!-- Copy path button -->
      @if (showCopyButton()) {
        <button
          type="button"
          class="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          [attr.aria-label]="'Copy path'"
          (click)="copyPath()"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
          </svg>
        </button>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-breadcrumbs-nav',
  },
})
export class TwBreadcrumbsNavComponent {
  // Inputs
  public readonly items = input<NativeBreadcrumbItem[]>([]);
  public readonly showHome = input(true);
  public readonly editable = input(false);
  public readonly showCopyButton = input(false);
  public readonly separator = input('/');

  // Outputs
  public readonly itemSelect = output<NativeBreadcrumbItem>();
  public readonly homeSelect = output<void>();
  public readonly pathChange = output<string>();
  public readonly pathCopy = output<string>();

  // State
  protected readonly isEditing = signal(false);
  protected readonly editPath = signal('');

  protected onHomeClick(): void {
    this.homeSelect.emit();
  }

  protected onItemClick(item: NativeBreadcrumbItem): void {
    this.itemSelect.emit(item);
  }

  protected startEdit(): void {
    const path = this.items()
      .map(i => i.label)
      .join(this.separator());
    this.editPath.set(path);
    this.isEditing.set(true);

    // Focus input after render
    setTimeout(() => {
      const input = document.querySelector('.tw-breadcrumbs-nav input') as HTMLInputElement;
      input?.focus();
      input?.select();
    }, 0);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.editPath.set('');
  }

  protected onPathInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editPath.set(input.value);
  }

  protected submitPath(): void {
    this.pathChange.emit(this.editPath());
    this.cancelEdit();
  }

  protected async copyPath(): Promise<void> {
    const path = this.items()
      .map(i => i.path || i.label)
      .join(this.separator());

    try {
      await navigator.clipboard.writeText(path);
      this.pathCopy.emit(path);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  }

  // Public method to get current path
  public getPath(): string {
    return this.items()
      .map(i => i.path || i.label)
      .join(this.separator());
  }
}

