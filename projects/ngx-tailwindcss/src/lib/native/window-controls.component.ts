import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  computed,
} from '@angular/core';
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
  template: `
    <div
      [class]="containerClasses()"
      (mouseenter)="hovered = true"
      (mouseleave)="hovered = false"
    >
      @if (effectivePlatform() === 'macos') {
        <!-- macOS Traffic Lights -->
        <div class="flex items-center gap-2">
          @if (showClose()) {
            <button
              type="button"
              class="group relative w-3 h-3 rounded-full transition-all duration-150"
              [class.bg-red-500]="!disabled()"
              [class.bg-gray-400]="disabled()"
              [class.hover:bg-red-600]="!disabled()"
              [attr.aria-label]="'Close'"
              [disabled]="disabled()"
              (click)="onClose()"
            >
              @if (hovered && !disabled()) {
                <svg class="absolute inset-0 w-3 h-3 text-red-900 opacity-0 group-hover:opacity-100" viewBox="0 0 12 12">
                  <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              }
            </button>
          }
          @if (showMinimize()) {
            <button
              type="button"
              class="group relative w-3 h-3 rounded-full transition-all duration-150"
              [class.bg-yellow-500]="!disabled()"
              [class.bg-gray-400]="disabled()"
              [class.hover:bg-yellow-600]="!disabled()"
              [attr.aria-label]="'Minimize'"
              [disabled]="disabled()"
              (click)="onMinimize()"
            >
              @if (hovered && !disabled()) {
                <svg class="absolute inset-0 w-3 h-3 text-yellow-900 opacity-0 group-hover:opacity-100" viewBox="0 0 12 12">
                  <path d="M2.5 6h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              }
            </button>
          }
          @if (showMaximize()) {
            <button
              type="button"
              class="group relative w-3 h-3 rounded-full transition-all duration-150"
              [class.bg-green-500]="!disabled()"
              [class.bg-gray-400]="disabled()"
              [class.hover:bg-green-600]="!disabled()"
              [attr.aria-label]="platformService.windowState().isMaximized ? 'Restore' : 'Maximize'"
              [disabled]="disabled()"
              (click)="onMaximize()"
            >
              @if (hovered && !disabled()) {
                <svg class="absolute inset-0 w-3 h-3 text-green-900 opacity-0 group-hover:opacity-100" viewBox="0 0 12 12">
                  @if (showFullscreen()) {
                    <!-- Fullscreen arrows -->
                    <path d="M2 4V2h2M10 4V2H8M2 8v2h2M10 8v2H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  } @else {
                    <!-- Maximize diagonal -->
                    <path d="M3 9L9 3M9 3H5M9 3v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  }
                </svg>
              }
            </button>
          }
        </div>
      } @else if (effectivePlatform() === 'windows') {
        <!-- Windows Style -->
        <div class="flex items-center">
          @if (showMinimize()) {
            <button
              type="button"
              class="w-11 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="'Minimize'"
              [disabled]="disabled()"
              (click)="onMinimize()"
            >
              <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 16 16">
                <path d="M3 8h10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              </svg>
            </button>
          }
          @if (showMaximize()) {
            <button
              type="button"
              class="w-11 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="platformService.windowState().isMaximized ? 'Restore' : 'Maximize'"
              [disabled]="disabled()"
              (click)="onMaximize()"
            >
              @if (platformService.windowState().isMaximized) {
                <!-- Restore icon -->
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 16 16">
                  <rect x="3" y="5" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
                  <path d="M5 5V3h8v8h-2" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>
              } @else {
                <!-- Maximize icon -->
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 16 16">
                  <rect x="3" y="3" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>
              }
            </button>
          }
          @if (showClose()) {
            <button
              type="button"
              class="w-11 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group"
              [attr.aria-label]="'Close'"
              [disabled]="disabled()"
              (click)="onClose()"
            >
              <svg class="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-white" viewBox="0 0 16 16">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              </svg>
            </button>
          }
        </div>
      } @else {
        <!-- Linux / Generic Style -->
        <div class="flex items-center gap-1.5">
          @if (showMinimize()) {
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="'Minimize'"
              [disabled]="disabled()"
              (click)="onMinimize()"
            >
              <svg class="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" viewBox="0 0 14 14">
                <path d="M2 10h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          }
          @if (showMaximize()) {
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="platformService.windowState().isMaximized ? 'Restore' : 'Maximize'"
              [disabled]="disabled()"
              (click)="onMaximize()"
            >
              <svg class="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" viewBox="0 0 14 14">
                <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5" rx="1"/>
              </svg>
            </button>
          }
          @if (showClose()) {
            <button
              type="button"
              class="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group"
              [attr.aria-label]="'Close'"
              [disabled]="disabled()"
              (click)="onClose()"
            >
              <svg class="w-3.5 h-3.5 text-gray-600 dark:text-gray-300 group-hover:text-white" viewBox="0 0 14 14">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          }
        </div>
      }
    </div>
  `,
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
  public readonly closeClick = output<void>();
  public readonly minimizeClick = output<void>();
  public readonly maximizeClick = output<void>();
  public readonly fullscreenClick = output<void>();

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
    } else if (platform === 'windows') {
      return 'flex items-center -mr-1';
    }
    return 'flex items-center';
  });

  // Event handlers
  protected onClose(): void {
    this.closeClick.emit();
    this.platformService.close();
  }

  protected onMinimize(): void {
    this.minimizeClick.emit();
    this.platformService.minimize();
  }

  protected onMaximize(): void {
    if (this.showFullscreen()) {
      this.fullscreenClick.emit();
      this.platformService.toggleFullscreen();
    } else {
      this.maximizeClick.emit();
      this.platformService.maximize();
    }
  }
}

