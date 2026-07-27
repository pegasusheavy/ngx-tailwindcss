import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogType } from './native.types';

/**
 * Confirmation dialog component
 * Asks user to confirm or cancel an action
 *
 * @example
 * ```html
 * <tw-confirm-dialog
 *   [open]="showConfirm"
 *   title="Delete file?"
 *   message="This action cannot be undone."
 *   [destructive]="true"
 *   (confirm)="onDelete()"
 *   (cancel)="showConfirm = false"
 * ></tw-confirm-dialog>
 * ```
 */
@Component({
  selector: 'tw-native-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-native-confirm-dialog',
  },
})
export class TwNativeConfirmDialogComponent {
  // Inputs
  public readonly open = input(false);
  public readonly title = input('Confirm');
  public readonly message = input('Are you sure?');
  public readonly type = input<AlertDialogType>('info');
  public readonly confirmLabel = input('Confirm');
  public readonly cancelLabel = input('Cancel');
  public readonly destructive = input(false);

  // Outputs
  public readonly confirm = output();
  public readonly cancel = output();
  public readonly openChange = output<boolean>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter')
  protected onEnter(): void {
    if (this.open()) {
      this.onConfirm();
    }
  }

  // Computed styles
  protected readonly iconContainerClasses = computed(() => {
    const base = 'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center';

    if (this.destructive()) {
      return `${base} bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400`;
    }

    return `${base} bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400`;
  });

  protected readonly confirmButtonClasses = computed(() => {
    const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors';

    if (this.destructive()) {
      return `${base} bg-red-600 text-white hover:bg-red-700`;
    }

    return `${base} bg-blue-600 text-white hover:bg-blue-700`;
  });

  protected onConfirm(): void {
    this.confirm.emit();
    this.openChange.emit(false);
  }

  protected onCancel(): void {
    this.cancel.emit();
    this.openChange.emit(false);
  }
}
