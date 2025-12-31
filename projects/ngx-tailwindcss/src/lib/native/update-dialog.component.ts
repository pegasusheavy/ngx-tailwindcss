import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UpdateDialogInfo {
  currentVersion: string;
  newVersion: string;
  releaseDate?: string;
  changelog?: string;
  downloadSize?: string;
  mandatory?: boolean;
}

@Component({
  selector: 'tw-update-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="!updateInfo()?.mandatory && close()"
        ></div>

        <!-- Dialog -->
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 text-center">
            <!-- Update Icon -->
            <div class="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Update Available
            </h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A new version of {{ appName() }} is available!
            </p>
          </div>

          <!-- Version Info -->
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
            <div class="flex items-center justify-center gap-4 text-sm">
              <div class="text-center">
                <div class="text-slate-500">Current</div>
                <div class="font-mono font-medium text-slate-700 dark:text-slate-300">
                  v{{ updateInfo()?.currentVersion }}
                </div>
              </div>
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div class="text-center">
                <div class="text-slate-500">New</div>
                <div class="font-mono font-medium text-blue-600 dark:text-blue-400">
                  v{{ updateInfo()?.newVersion }}
                </div>
              </div>
            </div>

            @if (updateInfo()?.downloadSize) {
              <div class="mt-2 text-center text-xs text-slate-500">
                Download size: {{ updateInfo()?.downloadSize }}
              </div>
            }
          </div>

          <!-- Changelog -->
          @if (updateInfo()?.changelog) {
            <div class="px-6 py-4 max-h-48 overflow-y-auto">
              <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">What's New</h3>
              <div class="text-sm text-slate-600 dark:text-slate-400 prose dark:prose-invert prose-sm max-w-none">
                {{ updateInfo()?.changelog }}
              </div>
            </div>
          }

          <!-- Download Progress -->
          @if (isDownloading()) {
            <div class="px-6 py-4">
              <div class="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Downloading update...</span>
                <span>{{ downloadProgress() }}%</span>
              </div>
              <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 rounded-full transition-all duration-300"
                  [style.width.%]="downloadProgress()"
                ></div>
              </div>
            </div>
          }

          <!-- Auto-update Toggle -->
          @if (!isDownloading() && showAutoUpdate()) {
            <div class="px-6 py-3 border-t border-slate-200 dark:border-slate-700">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-slate-700 dark:text-slate-300">Automatically install updates</span>
                <button
                  (click)="toggleAutoUpdate()"
                  [class.bg-blue-600]="autoUpdate()"
                  [class.bg-slate-200]="!autoUpdate()"
                  [class.dark:bg-slate-700]="!autoUpdate()"
                  class="relative w-11 h-6 rounded-full transition-colors"
                >
                  <span
                    [class.translate-x-5]="autoUpdate()"
                    [class.translate-x-0]="!autoUpdate()"
                    class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  ></span>
                </button>
              </label>
            </div>
          }

          <!-- Actions -->
          <div class="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            @if (!isDownloading()) {
              @if (!updateInfo()?.mandatory) {
                <button
                  (click)="remindLater()"
                  class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Remind Me Later
                </button>
              }
              <button
                (click)="startDownload()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Download Update
              </button>
            } @else {
              <button
                (click)="cancelDownload()"
                class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              @if (downloadProgress() === 100) {
                <button
                  (click)="installUpdate()"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Install & Restart
                </button>
              }
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class TwUpdateDialogComponent {
  public readonly appName = input('Application');
  public readonly updateInfo = input<UpdateDialogInfo | null>(null);
  public readonly showAutoUpdate = input(true);

  public readonly downloadStarted = output<void>();
  public readonly downloadCancelled = output<void>();
  public readonly installClicked = output<void>();
  public readonly remindLaterClicked = output<void>();
  public readonly autoUpdateChanged = output<boolean>();
  public readonly closed = output<void>();

  public readonly isOpen = signal(false);
  public readonly isDownloading = signal(false);
  public readonly downloadProgress = signal(0);
  public readonly autoUpdate = signal(true);

  public open(info: UpdateDialogInfo): void {
    // Update info is passed via input
    this.isDownloading.set(false);
    this.downloadProgress.set(0);
    this.isOpen.set(true);
  }

  public close(): void {
    if (!this.updateInfo()?.mandatory) {
      this.isOpen.set(false);
      this.closed.emit();
    }
  }

  public startDownload(): void {
    this.isDownloading.set(true);
    this.downloadProgress.set(0);
    this.downloadStarted.emit();
  }

  public cancelDownload(): void {
    this.isDownloading.set(false);
    this.downloadProgress.set(0);
    this.downloadCancelled.emit();
  }

  public installUpdate(): void {
    this.installClicked.emit();
  }

  public remindLater(): void {
    this.remindLaterClicked.emit();
    this.close();
  }

  public toggleAutoUpdate(): void {
    this.autoUpdate.update(v => !v);
    this.autoUpdateChanged.emit(this.autoUpdate());
  }

  public setDownloadProgress(progress: number): void {
    this.downloadProgress.set(Math.min(100, Math.max(0, progress)));
  }
}

