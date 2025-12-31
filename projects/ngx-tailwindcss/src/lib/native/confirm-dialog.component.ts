import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostListener,
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
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        (click)="onCancel()"
      >
        <!-- Dialog -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          role="dialog"
          [attr.aria-labelledby]="'confirm-title'"
          [attr.aria-describedby]="'confirm-message'"
          (click)="$event.stopPropagation()"
        >
          <!-- Header with icon -->
          <div class="flex items-start gap-4 p-6">
            <!-- Icon -->
            <div [class]="iconContainerClasses()">
              @if (destructive()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h3 id="confirm-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ title() }}
              </h3>
              <p id="confirm-message" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {{ message() }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button type="button" [class]="confirmButtonClasses()" (click)="onConfirm()">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
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
  public readonly confirm = output<void>();
  public readonly cancel = output<void>();
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
