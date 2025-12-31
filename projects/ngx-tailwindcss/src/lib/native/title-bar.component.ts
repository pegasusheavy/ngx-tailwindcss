import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { TwWindowControlsComponent } from './window-controls.component';
import { TitleBarVariant, TitleBarPlatform } from './native.types';

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
  template: `
    <header
      [class]="containerClasses()"
      [style.--webkit-app-region]="'drag'"
      (dblclick)="onDoubleClick()"
    >
      <!-- Left section (macOS controls + icon/title on Windows/Linux) -->
      <div class="flex items-center gap-2 min-w-0" [style.--webkit-app-region]="'no-drag'">
        @if (effectivePlatform() === 'macos') {
          <tw-window-controls
            [platform]="effectivePlatform()"
            [showClose]="showClose()"
            [showMinimize]="showMinimize()"
            [showMaximize]="showMaximize()"
            [showFullscreen]="showFullscreen()"
          ></tw-window-controls>
        } @else {
          @if (showIcon() && icon()) {
            <img [src]="icon()" [alt]="title()" class="w-4 h-4 object-contain" />
          }
        }
      </div>

      <!-- Center section (Title) -->
      <div
        class="flex-1 flex items-center min-w-0"
        [class.justify-center]="effectivePlatform() === 'macos'"
        [class.ml-2]="effectivePlatform() !== 'macos'"
      >
        @if (showIcon() && icon() && effectivePlatform() === 'macos') {
          <img [src]="icon()" [alt]="title()" class="w-4 h-4 mr-2 object-contain" />
        }
        <span class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
          {{ title() }}
        </span>
      </div>

      <!-- Right section (Windows/Linux controls) -->
      <div [style.--webkit-app-region]="'no-drag'">
        @if (effectivePlatform() !== 'macos') {
          <tw-window-controls
            [platform]="effectivePlatform()"
            [showClose]="showClose()"
            [showMinimize]="showMinimize()"
            [showMaximize]="showMaximize()"
            [showFullscreen]="showFullscreen()"
          ></tw-window-controls>
        }
      </div>

      <!-- Custom content slot -->
      <ng-content></ng-content>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
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
  public readonly doubleClick = output<void>();

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
    const h = this.height();

    const base = 'flex items-center select-none';

    // Height
    const heightClass = `h-[${h}px]`;

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

    return [base, heightClass, paddingClasses[platform] || 'px-2', variantClasses[variant]].join(
      ' '
    );
  });

  protected onDoubleClick(): void {
    this.doubleClick.emit();
    this.platformService.maximize();
  }
}
