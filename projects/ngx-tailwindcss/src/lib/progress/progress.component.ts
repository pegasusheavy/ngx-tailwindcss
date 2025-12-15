import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'tw-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
})
export class TwProgressComponent {
  @Input() set value(val: number) {
    this._value.set(val);
  }
  @Input() set max(val: number) {
    this._max.set(val);
  }
  @Input() set size(val: ProgressSize) {
    this._size.set(val);
  }
  @Input() set variant(val: ProgressVariant) {
    this._variant.set(val);
  }
  @Input() set label(val: string) {
    this._label.set(val);
  }
  @Input() set showValue(val: boolean) {
    this._showValue.set(val);
  }
  @Input() set labelPosition(val: 'top' | 'bottom' | 'inside') {
    this._labelPosition.set(val);
  }
  @Input() set striped(val: boolean) {
    this._striped.set(val);
  }
  @Input() set animated(val: boolean) {
    this._animated.set(val);
  }
  @Input() set indeterminate(val: boolean) {
    this._indeterminate.set(val);
  }

  protected _value = signal(0);
  protected _max = signal(100);
  protected _size = signal<ProgressSize>('md');
  protected _variant = signal<ProgressVariant>('primary');
  protected _label = signal('');
  protected _showValue = signal(false);
  protected _labelPosition = signal<'top' | 'bottom' | 'inside'>('top');
  protected _striped = signal(false);
  protected _animated = signal(false);
  protected _indeterminate = signal(false);

  protected valueNum = computed(() => this._value());
  protected maxNum = computed(() => this._max());
  protected labelText = computed(() => this._label());
  protected showValueFlag = computed(() => this._showValue());
  protected labelPositionVal = computed(() => this._labelPosition());

  protected percentage = computed(() => {
    const val = this._value();
    const maxVal = this._max();
    return Math.min(Math.max(Math.round((val / maxVal) * 100), 0), 100);
  });

  protected containerClasses = computed(() => 'w-full');

  protected trackClasses = computed(() => {
    const size = this._size();

    const sizeClasses: Record<ProgressSize, string> = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    return ['w-full overflow-hidden rounded-full bg-slate-200', sizeClasses[size]].join(' ');
  });

  protected barClasses = computed(() => {
    const size = this._size();
    const variant = this._variant();
    const striped = this._striped();
    const animated = this._animated();
    const indeterminate = this._indeterminate();
    const labelPosition = this._labelPosition();

    const variantClasses: Record<ProgressVariant, string> = {
      primary: 'bg-blue-600',
      secondary: 'bg-slate-600',
      success: 'bg-emerald-600',
      warning: 'bg-amber-500',
      danger: 'bg-rose-600',
      info: 'bg-cyan-600',
    };

    const sizeClasses: Record<ProgressSize, string> = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const classes = [
      'rounded-full transition-all duration-300 ease-out',
      sizeClasses[size],
      variantClasses[variant],
    ];

    if (labelPosition === 'inside') {
      classes.push('flex items-center justify-center');
    }

    if (striped) {
      classes.push(
        'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]'
      );
    }

    if (animated && striped) {
      classes.push('animate-[progress-stripes_1s_linear_infinite]');
    }

    if (indeterminate) {
      classes.push('animate-[progress-indeterminate_1.5s_ease-in-out_infinite]');
    }

    return classes.join(' ');
  });
}

@Component({
  selector: 'tw-progress-circular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-circular.component.html',
  styles: [
    `
      :host {
        display: inline-block;
      }
      @keyframes circular-rotate {
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes circular-dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }
      .circular-rotate {
        animation: circular-rotate 2s linear infinite;
      }
      .circular-dash {
        animation: circular-dash 1.5s ease-in-out infinite;
      }
    `,
  ],
})
export class TwProgressCircularComponent {
  @Input() set value(val: number) {
    this._value.set(val);
  }
  @Input() set max(val: number) {
    this._max.set(val);
  }
  @Input() set size(val: number) {
    this._size.set(val);
  }
  @Input() set variant(val: ProgressVariant) {
    this._variant.set(val);
  }
  @Input() set showValue(val: boolean) {
    this._showValue.set(val);
  }
  @Input() set indeterminate(val: boolean) {
    this._indeterminate.set(val);
  }
  @Input() set thickness(val: number) {
    this._thickness.set(val);
  }

  protected _value = signal(0);
  protected _max = signal(100);
  protected _size = signal(48);
  protected _variant = signal<ProgressVariant>('primary');
  protected _showValue = signal(false);
  protected _indeterminate = signal(false);
  protected _thickness = signal(4);

  protected sizeValue = computed(() => this._size());
  protected valueNum = computed(() => this._value());
  protected maxNum = computed(() => this._max());
  protected showValueFlag = computed(() => this._showValue());
  protected indeterminateFlag = computed(() => this._indeterminate());
  protected strokeWidth = computed(() => this._thickness());

  // Circle with radius 15.9155 has circumference of ~100
  private readonly CIRCUMFERENCE = 100;

  protected percentage = computed(() => {
    const val = this._value();
    const maxVal = this._max();
    return Math.min(Math.max((val / maxVal) * 100, 0), 100);
  });

  protected dashOffset = computed(() => {
    const pct = this.percentage();
    return this.CIRCUMFERENCE - (pct / 100) * this.CIRCUMFERENCE;
  });

  protected strokeColor = computed(() => {
    const variant = this._variant();

    const colors: Record<ProgressVariant, string> = {
      primary: '#2563eb',
      secondary: '#475569',
      success: '#059669',
      warning: '#f59e0b',
      danger: '#e11d48',
      info: '#0891b2',
    };

    return colors[variant];
  });

  protected valueClasses = computed(() => {
    const sz = this._size();
    const fontSize =
      sz < 40 ? 'text-[10px]' : sz < 56 ? 'text-xs' : sz < 72 ? 'text-sm' : 'text-base';
    return `absolute inset-0 flex items-center justify-center font-semibold text-slate-700 ${fontSize}`;
  });
}
