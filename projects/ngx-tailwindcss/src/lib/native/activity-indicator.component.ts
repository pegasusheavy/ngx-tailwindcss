import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ActivityIndicatorVariant = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
export type ActivityIndicatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'tw-activity-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-indicator.component.html',
  styles: [
    `
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-50%);
        }
      }
    `,
  ],
})
export class TwActivityIndicatorComponent {
  public readonly variant = input<ActivityIndicatorVariant>('spinner');
  public readonly size = input<ActivityIndicatorSize>('md');
  public readonly color = input('text-blue-600');
  public readonly label = input('');
  public readonly inline = input(false);

  public readonly containerClasses = computed(() => {
    const classes = [this.color()];
    if (this.inline()) {
      classes.push('inline-flex items-center gap-2');
    } else {
      classes.push('flex flex-col items-center gap-2');
    }
    return classes.join(' ');
  });

  public readonly sizeClasses = computed(() => {
    const sizeMap: Record<ActivityIndicatorSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };
    return sizeMap[this.size()];
  });

  public readonly dotSizeClasses = computed(() => {
    const sizeMap: Record<ActivityIndicatorSize, string> = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };
    return sizeMap[this.size()];
  });

  public barClasses(index: number): string {
    const sizeMap: Record<ActivityIndicatorSize, { width: string; heights: string[] }> = {
      xs: { width: 'w-0.5', heights: ['h-2', 'h-3', 'h-2', 'h-3'] },
      sm: { width: 'w-1', heights: ['h-3', 'h-4', 'h-3', 'h-4'] },
      md: { width: 'w-1', heights: ['h-4', 'h-6', 'h-4', 'h-6'] },
      lg: { width: 'w-1.5', heights: ['h-5', 'h-8', 'h-5', 'h-8'] },
      xl: { width: 'w-2', heights: ['h-6', 'h-10', 'h-6', 'h-10'] },
    };
    const config = sizeMap[this.size()];
    return `${config.width} ${config.heights[index]}`;
  }

  public readonly labelClasses = computed(() => {
    const sizeMap: Record<ActivityIndicatorSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };
    return `${sizeMap[this.size()]} text-slate-600 dark:text-slate-400`;
  });
}
