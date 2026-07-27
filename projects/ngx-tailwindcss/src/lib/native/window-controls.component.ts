import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { TitleBarPlatform, WindowControlButton } from './native.types';

/**
 * Window control buttons (minimize, maximize, close)
 * Automatically adapts to platform style (macOS traffic lights, Windows, Linux)
 *
 * @example
 * ```html
 * <tw-window-controls></tw-window-controls>
 * <tw-window-controls platform="macos"></tw-window-controls>
 * <tw-window-controls [showFullscreen]="true"></tw-window-controls>
 * ```
 */
@Component({
  selector: 'tw-window-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './window-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-window-controls',
  },
})
export class TwWindowControlsComponent {
  protected readonly platformService = inject(NativeAppPlatformService);

  // Inputs
  public readonly platform = input<TitleBarPlatform>('auto');
  public readonly showClose = input(true);
  public readonly showMinimize = input(true);
  public readonly showMaximize = input(true);
  public readonly showFullscreen = input(false);
  public readonly disabled = input(false);

  // Outputs
  public readonly closeClick = output();
  public readonly minimizeClick = output();
  public readonly maximizeClick = output();
  public readonly fullscreenClick = output();

  // State
  protected hovered = false;

  // Computed
  protected readonly effectivePlatform = computed(() => {
    const p = this.platform();
    if (p === 'auto') {
      return this.platformService.platform();
    }
    return p;
  });

  protected readonly containerClasses = computed(() => {
    const platform = this.effectivePlatform();

    if (platform === 'macos') {
      return 'flex items-center';
    }
    if (platform === 'windows') {
      return 'flex items-center -mr-1';
    }
    return 'flex items-center';
  });

  // Event handlers
  protected onClose(): void {
    this.closeClick.emit();
    void this.platformService.close();
  }

  protected onMinimize(): void {
    this.minimizeClick.emit();
    void this.platformService.minimize();
  }

  protected onMaximize(): void {
    if (this.showFullscreen()) {
      this.fullscreenClick.emit();
      void this.platformService.toggleFullscreen();
    } else {
      this.maximizeClick.emit();
      void this.platformService.maximize();
    }
  }
}
