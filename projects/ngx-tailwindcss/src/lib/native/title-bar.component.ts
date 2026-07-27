import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { TwWindowControlsComponent } from './window-controls.component';
import { TitleBarPlatform, TitleBarVariant } from './native.types';

/**
 * Custom window title bar component
 * Replaces the native title bar with a draggable custom one
 *
 * @example
 * ```html
 * <tw-title-bar title="My App"></tw-title-bar>
 * <tw-title-bar title="My App" [showIcon]="true" icon="assets/icon.png"></tw-title-bar>
 * <tw-title-bar variant="transparent" platform="macos"></tw-title-bar>
 * ```
 */
@Component({
  selector: 'tw-title-bar',
  standalone: true,
  imports: [CommonModule, TwWindowControlsComponent],
  templateUrl: './title-bar.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .tw-title-bar-drag {
        -webkit-app-region: drag;
        app-region: drag;
      }

      .tw-title-bar-no-drag {
        -webkit-app-region: no-drag;
        app-region: no-drag;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-title-bar',
  },
})
export class TwTitleBarComponent {
  protected readonly platformService = inject(NativeAppPlatformService);

  // Inputs
  public readonly title = input('');
  public readonly icon = input<string | undefined>(undefined);
  public readonly showIcon = input(false);
  public readonly variant = input<TitleBarVariant>('default');
  public readonly platform = input<TitleBarPlatform>('auto');
  public readonly height = input(32);
  public readonly showClose = input(true);
  public readonly showMinimize = input(true);
  public readonly showMaximize = input(true);
  public readonly showFullscreen = input(false);

  // Outputs
  public readonly doubleClick = output();

  // Computed
  protected readonly effectivePlatform = computed(() => {
    const p = this.platform();
    if (p === 'auto') {
      return this.platformService.platform();
    }
    return p;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const platform = this.effectivePlatform();

    const base = 'flex items-center select-none';

    // Platform-specific padding
    const paddingClasses: Record<string, string> = {
      macos: 'px-3',
      windows: 'pl-2 pr-0',
      linux: 'px-2',
      web: 'px-2',
    };

    // Variant styling
    const variantClasses: Record<TitleBarVariant, string> = {
      default: 'bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      transparent: 'bg-transparent',
      unified:
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50',
    };

    return [base, paddingClasses[platform] || 'px-2', variantClasses[variant]].join(' ');
  });

  protected onDoubleClick(): void {
    this.doubleClick.emit();
    void this.platformService.maximize();
  }
}
