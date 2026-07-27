import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'border' | 'dots' | 'pulse' | 'bars';
export type SpinnerColor =
  'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

// Border color classes for border variant
const BORDER_COLORS: Record<SpinnerColor, string> = {
  primary: 'border-blue-600',
  secondary: 'border-slate-600',
  success: 'border-emerald-600',
  warning: 'border-amber-500',
  danger: 'border-rose-600',
  info: 'border-cyan-600',
  neutral: 'border-slate-400',
};

// Background color classes for dots/pulse/bars variants
const BG_COLORS: Record<SpinnerColor, string> = {
  primary: 'bg-blue-600',
  secondary: 'bg-slate-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-rose-600',
  info: 'bg-cyan-600',
  neutral: 'bg-slate-400',
};

const BORDER_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-10 h-10 border-4',
};

const DOTS_CONTAINER_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
  xl: 'gap-2.5',
};

const DOT_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
  xl: 'w-3 h-3',
};

const PULSE_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

const BARS_CONTAINER_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'gap-0.5 h-4',
  sm: 'gap-0.5 h-5',
  md: 'gap-1 h-6',
  lg: 'gap-1 h-8',
  xl: 'gap-1.5 h-10',
};

const BAR_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'w-0.5',
  sm: 'w-1',
  md: 'w-1',
  lg: 'w-1.5',
  xl: 'w-2',
};

@Component({
  selector: 'tw-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styles: [
    `
      @keyframes bounce-dot {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
      @keyframes stretch-bar {
        0%,
        40%,
        100% {
          transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
        }
      }
      .dot-bounce {
        animation: bounce-dot 1.4s infinite ease-in-out both;
      }
      .bar-stretch {
        animation: stretch-bar 1.2s infinite ease-in-out;
      }
    `,
  ],
})
export class TwSpinnerComponent {
  @Input() set size(val: SpinnerSize) {
    this._size.set(val);
  }
  @Input() set variant(val: SpinnerVariant) {
    this._variant.set(val);
  }
  /**
   * Spinner color. Accepts a named color, or a complete Tailwind utility class
   * matching the variant (e.g. `border-red-500` for the border variant,
   * `bg-red-500` for dots/pulse/bars). Partial values such as `red-500` are
   * not supported because Tailwind cannot generate classes composed at runtime.
   */
  @Input() set color(val: SpinnerColor | string) {
    this._color.set(val);
  }

  protected _size = signal<SpinnerSize>('md');
  protected _variant = signal<SpinnerVariant>('border');
  protected _color = signal<SpinnerColor | string>('primary');

  protected variantVal = computed(() => this._variant());

  private getBorderColor(): string {
    const clr = this._color();
    if (clr in BORDER_COLORS) {
      return BORDER_COLORS[clr as SpinnerColor];
    }
    // Custom colors must be a complete utility class (e.g. border-red-500)
    return clr;
  }

  private getBgColor(): string {
    const clr = this._color();
    if (clr in BG_COLORS) {
      return BG_COLORS[clr as SpinnerColor];
    }
    // Custom colors must be a complete utility class (e.g. bg-red-500)
    return clr;
  }

  protected borderClasses = computed(() => {
    return [
      'inline-block rounded-full border-t-transparent animate-spin',
      BORDER_SIZE_CLASSES[this._size()],
      this.getBorderColor(),
    ].join(' ');
  });

  protected dotsContainerClasses = computed(() => {
    return ['inline-flex items-center', DOTS_CONTAINER_SIZE_CLASSES[this._size()]].join(' ');
  });

  protected dotClasses = computed(() => {
    return ['rounded-full dot-bounce', DOT_SIZE_CLASSES[this._size()], this.getBgColor()].join(' ');
  });

  protected pulseClasses = computed(() => {
    return ['rounded-full animate-pulse', PULSE_SIZE_CLASSES[this._size()], this.getBgColor()].join(
      ' '
    );
  });

  protected barsContainerClasses = computed(() => {
    return ['inline-flex items-center', BARS_CONTAINER_SIZE_CLASSES[this._size()]].join(' ');
  });

  protected barClasses = computed(() => {
    return [
      'h-full rounded-full bar-stretch',
      BAR_SIZE_CLASSES[this._size()],
      this.getBgColor(),
    ].join(' ');
  });
}

@Component({
  selector: 'tw-loading-overlay',
  standalone: true,
  imports: [CommonModule, TwSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-overlay.component.html',
})
export class TwLoadingOverlayComponent {
  @Input() set size(val: SpinnerSize) {
    this._size.set(val);
  }
  @Input() set variant(val: SpinnerVariant) {
    this._variant.set(val);
  }
  /**
   * Spinner color. Accepts a named color, or a complete Tailwind utility class
   * matching the variant (e.g. `border-red-500` for the border variant,
   * `bg-red-500` for dots/pulse/bars).
   */
  @Input() set color(val: SpinnerColor | string) {
    this._color.set(val);
  }
  @Input() set message(val: string) {
    this._message.set(val);
  }
  @Input() set overlay(val: 'full' | 'inline') {
    this._overlay.set(val);
  }

  protected _size = signal<SpinnerSize>('lg');
  protected _variant = signal<SpinnerVariant>('border');
  protected _color = signal<SpinnerColor | string>('primary');
  protected _message = signal('');
  protected _overlay = signal<'full' | 'inline'>('inline');

  protected sizeVal = computed(() => this._size());
  protected variantVal = computed(() => this._variant());
  protected colorVal = computed(() => this._color());
  protected messageVal = computed(() => this._message());

  protected overlayClasses = computed(() => {
    const ovl = this._overlay();

    const overlayStyles: Record<string, string> = {
      full: 'fixed inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm',
      inline:
        'absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[inherit]',
    };

    return ['flex items-center justify-center', overlayStyles[ovl]].join(' ');
  });

  protected messageClasses = computed(
    () => 'text-sm font-medium text-slate-600 dark:text-slate-400'
  );
}
