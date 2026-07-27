import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogType } from './native.types';

/**
 * Alert dialog component
 * Shows informational, warning, or error messages
 *
 * @example
 * ```html
 * <tw-alert-dialog
 *   [open]="showAlert"
 *   title="Success"
 *   message="Your changes have been saved."
 *   type="success"
 *   (confirm)="onDismiss()"
 * ></tw-alert-dialog>
 * ```
 */
@Component({
  selector: 'tw-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-alert-dialog',
  },
})
export class TwAlertDialogComponent {
  // Inputs
  public readonly open = input(false);
  public readonly title = input('');
  public readonly message = input('');
  public readonly type = input<AlertDialogType>('info');
  public readonly confirmLabel = input('OK');
  public readonly showDontAskAgain = input(false);

  // Outputs
  public readonly confirm = output<{ dontAskAgain: boolean }>();
  public readonly openChange = output<boolean>();

  // State
  protected readonly dontAskAgain = signal(false);

  // Computed styles
  protected readonly iconContainerClasses = computed(() => {
    const type = this.type();
    const base = 'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center';

    const typeClasses: Record<AlertDialogType, string> = {
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    };

    return `${base} ${typeClasses[type]}`;
  });

  protected readonly buttonClasses = computed(() => {
    const type = this.type();
    const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors';

    if (type === 'error') {
      return `${base} bg-red-600 text-white hover:bg-red-700`;
    }

    return `${base} bg-blue-600 text-white hover:bg-blue-700`;
  });

  protected onConfirm(): void {
    this.confirm.emit({ dontAskAgain: this.dontAskAgain() });
    this.openChange.emit(false);
  }
}
