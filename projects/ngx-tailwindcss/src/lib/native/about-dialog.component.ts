import { Component, ChangeDetectionStrategy, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * About dialog component
 * Shows application information, version, credits
 *
 * @example
 * ```html
 * <tw-about-dialog
 *   [open]="showAbout"
 *   appName="My App"
 *   version="1.0.0"
 *   [links]="[{ label: 'Website', url: 'https://example.com' }]"
 *   (close)="showAbout = false"
 * ></tw-about-dialog>
 * ```
 */
@Component({
  selector: 'tw-about-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        (click)="onClose()"
      >
        <!-- Dialog -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center"
          role="dialog"
          [attr.aria-labelledby]="'about-title'"
          (click)="$event.stopPropagation()"
        >
          <!-- App icon and name -->
          <div class="pt-8 pb-4 px-6">
            @if (appIcon()) {
              <img
                [src]="appIcon()"
                [alt]="appName()"
                class="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg"
              />
            } @else {
              <!-- Default app icon -->
              <div
                class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            }

            <h2 id="about-title" class="text-xl font-bold text-gray-900 dark:text-gray-100">
              {{ appName() }}
            </h2>

            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Version {{ version() }}</p>
          </div>

          <!-- Description -->
          @if (description()) {
            <p class="px-6 text-sm text-gray-600 dark:text-gray-400">
              {{ description() }}
            </p>
          }

          <!-- Copyright -->
          @if (copyright()) {
            <p class="px-6 mt-4 text-xs text-gray-500 dark:text-gray-500">
              {{ copyright() }}
            </p>
          }

          <!-- Credits -->
          @if (credits().length > 0) {
            <div class="px-6 mt-4">
              <p class="text-xs text-gray-500 dark:text-gray-500 mb-2">Credits</p>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                @for (credit of credits(); track credit) {
                  <p>{{ credit }}</p>
                }
              </div>
            </div>
          }

          <!-- Links -->
          @if (links().length > 0) {
            <div class="flex justify-center gap-4 px-6 mt-4">
              @for (link of links(); track link.url) {
                <a
                  [href]="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ link.label }}
                </a>
              }
            </div>
          }

          <!-- Actions -->
          <div class="px-6 py-4 mt-4 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-2">
            @if (showUpdateButton()) {
              <button
                type="button"
                class="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                (click)="checkForUpdates.emit()"
              >
                Check for Updates
              </button>
            }

            @if (showLicenseButton()) {
              <button
                type="button"
                class="w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                (click)="viewLicense.emit()"
              >
                View License
              </button>
            }

            <button
              type="button"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              (click)="onClose()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-about-dialog',
  },
})
export class TwAboutDialogComponent {
  // Inputs
  public readonly open = input(false);
  public readonly appName = input('Application');
  public readonly appIcon = input<string | undefined>(undefined);
  public readonly version = input('1.0.0');
  public readonly description = input<string | undefined>(undefined);
  public readonly copyright = input<string | undefined>(undefined);
  public readonly credits = input<string[]>([]);
  public readonly links = input<{ label: string; url: string }[]>([]);
  public readonly showUpdateButton = input(true);
  public readonly showLicenseButton = input(false);

  // Outputs
  public readonly close = output<void>();
  public readonly openChange = output<boolean>();
  public readonly checkForUpdates = output<void>();
  public readonly viewLicense = output<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.onClose();
    }
  }

  protected onClose(): void {
    this.close.emit();
    this.openChange.emit(false);
  }
}
