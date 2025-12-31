import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
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
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <!-- Dialog -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          role="alertdialog"
          [attr.aria-labelledby]="'alert-title'"
          [attr.aria-describedby]="'alert-message'"
        >
          <!-- Header with icon -->
          <div class="flex items-start gap-4 p-6">
            <!-- Icon -->
            <div [class]="iconContainerClasses()">
              @switch (type()) {
                @case ('success') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
                @case ('warning') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                }
                @case ('error') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
                @default {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              }
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h3 id="alert-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ title() }}
              </h3>
              <p id="alert-message" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {{ message() }}
              </p>

              <!-- Don't show again checkbox -->
              @if (showDontAskAgain()) {
                <label
                  class="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    [checked]="dontAskAgain()"
                    (change)="dontAskAgain.set(!dontAskAgain())"
                  />
                  Don't show this again
                </label>
              }
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
            <button type="button" [class]="buttonClasses()" (click)="onConfirm()">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
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
