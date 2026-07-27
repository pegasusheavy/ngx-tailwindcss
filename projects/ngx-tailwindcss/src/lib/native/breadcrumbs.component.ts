import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
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
  templateUrl: './breadcrumbs.component.html',
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
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
  public readonly homeSelect = output();
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
      const inputEl = document.querySelector<HTMLInputElement>('.tw-breadcrumbs-nav input');
      inputEl?.focus();
      inputEl?.select();
    }, 0);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.editPath.set('');
  }

  protected onPathInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.editPath.set(inputEl.value);
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
    } catch (error) {
      console.error('Failed to copy path:', error);
    }
  }

  // Public method to get current path
  public getPath(): string {
    return this.items()
      .map(i => i.path || i.label)
      .join(this.separator());
  }
}
