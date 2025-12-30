import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type TransportVariant = 'modern' | 'minimal' | 'classic' | 'compact';
export type TransportSize = 'sm' | 'md' | 'lg';

/**
 * Transport Controls component for audio/video playback
 *
 * @example
 * ```html
 * <tw-transport
 *   [playing]="isPlaying"
 *   (play)="onPlay()"
 *   (pause)="onPause()"
 *   (stop)="onStop()"
 * ></tw-transport>
 * ```
 */
@Component({
  selector: 'tw-transport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transport.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwTransportComponent {
  private readonly twClass = inject(TwClassService);

  // State inputs
  readonly playing = input(false);
  readonly recording = input(false);
  readonly looping = input(false);
  readonly shuffling = input(false);
  readonly disabled = input(false);

  // Display options
  readonly variant = input<TransportVariant>('modern');
  readonly size = input<TransportSize>('md');
  readonly showStop = input(true);
  readonly showRecord = input(false);
  readonly showRewind = input(false);
  readonly showFastForward = input(false);
  readonly showSkipButtons = input(true);
  readonly showLoop = input(true);
  readonly showShuffle = input(false);
  readonly classOverride = input('');

  // Outputs
  readonly play = output<void>();
  readonly pause = output<void>();
  readonly stop = output<void>();
  readonly record = output<void>();
  readonly rewind = output<void>();
  readonly fastForward = output<void>();
  readonly skipPrevious = output<void>();
  readonly skipNext = output<void>();
  readonly loopToggle = output<boolean>();
  readonly shuffleToggle = output<boolean>();

  // Size configurations
  private readonly sizeConfig = computed(() => {
    const configs: Record<TransportSize, { button: string; icon: string; primaryButton: string }> = {
      sm: {
        button: 'w-8 h-8',
        icon: 'w-4 h-4',
        primaryButton: 'w-10 h-10',
      },
      md: {
        button: 'w-10 h-10',
        icon: 'w-5 h-5',
        primaryButton: 'w-12 h-12',
      },
      lg: {
        button: 'w-12 h-12',
        icon: 'w-6 h-6',
        primaryButton: 'w-14 h-14',
      },
    };
    return configs[this.size()];
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'inline-flex items-center gap-1';

    const variantClasses: Record<TransportVariant, string> = {
      modern: 'p-2 bg-slate-100 dark:bg-slate-800 rounded-xl',
      minimal: '',
      classic: 'p-2 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 shadow-inner',
      compact: 'p-1 bg-slate-900 rounded-lg',
    };

    return this.twClass.merge(baseClasses, variantClasses[variant], this.classOverride());
  });

  protected buttonClasses(type: string, isPrimary = false, isActive = false): string {
    const variant = this.variant();
    const size = this.sizeConfig();

    const baseClasses = `
      inline-flex items-center justify-center rounded-lg
      transition-all duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const buttonSize = isPrimary ? size.primaryButton : size.button;

    let variantClasses = '';

    if (variant === 'modern') {
      if (isPrimary) {
        variantClasses = 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg focus:ring-blue-400';
      } else if (type === 'record') {
        variantClasses = 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-400';
      } else if (type === 'toggle') {
        variantClasses = isActive
          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 focus:ring-blue-400'
          : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 focus:ring-slate-400';
      } else {
        variantClasses = 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-400';
      }
    } else if (variant === 'minimal') {
      if (isPrimary) {
        variantClasses = 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 focus:ring-slate-400';
      } else if (type === 'toggle') {
        variantClasses = isActive
          ? 'text-blue-600 dark:text-blue-400 focus:ring-blue-400'
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:ring-slate-400';
      } else {
        variantClasses = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400';
      }
    } else if (variant === 'classic') {
      if (isPrimary) {
        variantClasses = 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-md border border-green-700 focus:ring-green-400';
      } else if (type === 'record') {
        variantClasses = 'bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 hover:from-slate-400 hover:to-slate-500 text-slate-700 dark:text-slate-300 border border-slate-400 dark:border-slate-500 focus:ring-slate-400';
      } else if (type === 'toggle') {
        variantClasses = isActive
          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 focus:ring-amber-400'
          : 'bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 text-slate-600 dark:text-slate-400 border border-slate-400 dark:border-slate-500 focus:ring-slate-400';
      } else {
        variantClasses = 'bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 hover:from-slate-400 hover:to-slate-500 text-slate-700 dark:text-slate-300 border border-slate-400 dark:border-slate-500 focus:ring-slate-400';
      }
    } else if (variant === 'compact') {
      if (isPrimary) {
        variantClasses = 'bg-emerald-500 hover:bg-emerald-400 text-white focus:ring-emerald-400';
      } else if (type === 'record') {
        variantClasses = 'bg-slate-800 hover:bg-slate-700 text-slate-400 focus:ring-slate-400';
      } else if (type === 'toggle') {
        variantClasses = isActive
          ? 'bg-slate-700 text-emerald-400 focus:ring-emerald-400'
          : 'bg-transparent text-slate-500 hover:text-slate-300 focus:ring-slate-400';
      } else {
        variantClasses = 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 focus:ring-slate-400';
      }
    }

    return this.twClass.merge(baseClasses, buttonSize, variantClasses);
  }

  protected iconClasses(type?: string): string {
    const size = this.sizeConfig();
    let colorClass = '';

    if (type === 'primary') {
      colorClass = '';
    } else if (type === 'record') {
      colorClass = 'text-slate-500 dark:text-slate-400';
    } else if (type === 'record-active') {
      colorClass = 'text-red-500 animate-pulse';
    } else if (type === 'active') {
      colorClass = '';
    }

    return this.twClass.merge(size.icon, colorClass);
  }

  // Event handlers
  onPlayPause(): void {
    if (this.playing()) {
      this.pause.emit();
    } else {
      this.play.emit();
    }
  }

  onStop(): void {
    this.stop.emit();
  }

  onRecord(): void {
    this.record.emit();
  }

  onRewind(): void {
    this.rewind.emit();
  }

  onFastForward(): void {
    this.fastForward.emit();
  }

  onSkipPrevious(): void {
    this.skipPrevious.emit();
  }

  onSkipNext(): void {
    this.skipNext.emit();
  }

  onLoopToggle(): void {
    this.loopToggle.emit(!this.looping());
  }

  onShuffleToggle(): void {
    this.shuffleToggle.emit(!this.shuffling());
  }
}

