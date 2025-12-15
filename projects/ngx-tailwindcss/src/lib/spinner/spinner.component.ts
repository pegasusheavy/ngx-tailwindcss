import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'border' | 'dots' | 'pulse' | 'bars';
export type SpinnerColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

@Component({
  selector: 'tw-spinner',
  standalone: true,
  imports: [CommonModule],
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
  @Input() set color(val: SpinnerColor | string) {
    this._color.set(val);
  }

  protected _size = signal<SpinnerSize>('md');
  protected _variant = signal<SpinnerVariant>('border');
  protected _color = signal<SpinnerColor | string>('primary');

  protected variantVal = computed(() => this._variant());

  // Border color classes for border variant
  private readonly borderColors: Record<SpinnerColor, string> = {
    primary: 'border-blue-600',
    secondary: 'border-slate-600',
    success: 'border-emerald-600',
    warning: 'border-amber-500',
    danger: 'border-rose-600',
    info: 'border-cyan-600',
    neutral: 'border-slate-400',
  };

  // Background color classes for dots/pulse/bars variants
  private readonly bgColors: Record<SpinnerColor, string> = {
    primary: 'bg-blue-600',
    secondary: 'bg-slate-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-rose-600',
    info: 'bg-cyan-600',
    neutral: 'bg-slate-400',
  };

  private getBorderColor(): string {
    const clr = this._color();
    if (clr in this.borderColors) {
      return this.borderColors[clr as SpinnerColor];
    }
    // If it's a custom Tailwind class, use it directly
    return clr.startsWith('border-') ? clr : `border-${clr}`;
  }

  private getBgColor(): string {
    const clr = this._color();
    if (clr in this.bgColors) {
      return this.bgColors[clr as SpinnerColor];
    }
    // If it's a custom Tailwind class, use it directly
    return clr.startsWith('bg-') ? clr : `bg-${clr}`;
  }

  protected borderClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'w-4 h-4 border-2',
      sm: 'w-5 h-5 border-2',
      md: 'w-6 h-6 border-2',
      lg: 'w-8 h-8 border-[3px]',
      xl: 'w-10 h-10 border-4',
    };

    return [
      'inline-block rounded-full border-t-transparent animate-spin',
      sizeClasses[sz],
      this.getBorderColor(),
    ].join(' ');
  });

  protected dotsContainerClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'gap-0.5',
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
      xl: 'gap-2.5',
    };

    return ['inline-flex items-center', sizeClasses[sz]].join(' ');
  });

  protected dotClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
    };

    return ['rounded-full dot-bounce', sizeClasses[sz], this.getBgColor()].join(' ');
  });

  protected pulseClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10',
    };

    return ['rounded-full animate-pulse', sizeClasses[sz], this.getBgColor()].join(' ');
  });

  protected barsContainerClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'gap-0.5 h-4',
      sm: 'gap-0.5 h-5',
      md: 'gap-1 h-6',
      lg: 'gap-1 h-8',
      xl: 'gap-1.5 h-10',
    };

    return ['inline-flex items-center', sizeClasses[sz]].join(' ');
  });

  protected barClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<SpinnerSize, string> = {
      xs: 'w-0.5',
      sm: 'w-1',
      md: 'w-1',
      lg: 'w-1.5',
      xl: 'w-2',
    };

    return ['h-full rounded-full bar-stretch', sizeClasses[sz], this.getBgColor()].join(' ');
  });
}

@Component({
  selector: 'tw-loading-overlay',
  standalone: true,
  imports: [CommonModule, TwSpinnerComponent],
  templateUrl: './loading-overlay.component.html',
})
export class TwLoadingOverlayComponent {
  @Input() set size(val: SpinnerSize) {
    this._size.set(val);
  }
  @Input() set variant(val: SpinnerVariant) {
    this._variant.set(val);
  }
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
      full: 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm',
      inline: 'absolute inset-0 bg-white/80 backdrop-blur-sm rounded-inherit',
    };

    return ['flex items-center justify-center', overlayStyles[ovl]].join(' ');
  });

  protected messageClasses = computed(() => 'text-sm font-medium text-slate-600');
}
