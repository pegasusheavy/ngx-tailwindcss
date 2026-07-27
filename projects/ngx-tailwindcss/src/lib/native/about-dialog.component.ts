import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
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
  templateUrl: './about-dialog.component.html',
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
  public readonly links = input<Array<{ label: string; url: string }>>([]);
  public readonly showUpdateButton = input(true);
  public readonly showLicenseButton = input(false);

  // Outputs
  public readonly close = output();
  public readonly openChange = output<boolean>();
  public readonly checkForUpdates = output();
  public readonly viewLicense = output();

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
