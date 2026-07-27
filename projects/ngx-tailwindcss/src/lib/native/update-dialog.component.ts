import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwFocusTrapDirective } from '../directives';

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
  imports: [CommonModule, TwFocusTrapDirective],
  templateUrl: './update-dialog.component.html',
})
export class TwUpdateDialogComponent {
  public readonly appName = input('Application');
  public readonly updateInfo = input<UpdateDialogInfo | null>(null);
  public readonly showAutoUpdate = input(true);

  public readonly downloadStarted = output();
  public readonly downloadCancelled = output();
  public readonly installClicked = output();
  public readonly remindLaterClicked = output();
  public readonly autoUpdateChanged = output<boolean>();
  public readonly closed = output();

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
