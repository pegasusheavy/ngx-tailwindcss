import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type TimeDisplayVariant = 'default' | 'led' | 'digital' | 'flip' | 'minimal';
export type TimeDisplayMode = 'time' | 'bpm' | 'bars' | 'samples';
export type TimeDisplaySize = 'sm' | 'md' | 'lg' | 'xl';

interface FlipSegment {
  id: string;
  value: string;
  separator: boolean;
}

/**
 * Time Display component for showing playback time, BPM, etc.
 *
 * @example
 * ```html
 * <tw-time-display [value]="currentTime" [total]="duration"></tw-time-display>
 * <tw-time-display [value]="bpm" mode="bpm" variant="led"></tw-time-display>
 * ```
 */
@Component({
  selector: 'tw-time-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwTimeDisplayComponent {
  private readonly twClass = inject(TwClassService);

  // Value inputs
  readonly value = input(0);
  readonly total = input(0);
  readonly bpm = input(120);
  readonly bar = input(1);
  readonly beat = input(1);
  readonly sampleRate = input(44100);

  // Display options
  readonly variant = input<TimeDisplayVariant>('default');
  readonly mode = input<TimeDisplayMode>('time');
  readonly size = input<TimeDisplaySize>('md');
  readonly showTotal = input(true);
  readonly showRemaining = input(false);
  readonly showLabel = input(false);
  readonly label = input<string>('');
  readonly showHours = input<'auto' | 'always' | 'never'>('auto');
  readonly showMilliseconds = input(false);
  readonly classOverride = input('');

  // Size configurations
  private readonly sizeConfig = computed(() => {
    const configs: Record<TimeDisplaySize, { text: string; led: string; flip: string }> = {
      sm: { text: 'text-sm', led: 'text-lg', flip: 'text-base' },
      md: { text: 'text-base', led: 'text-2xl', flip: 'text-xl' },
      lg: { text: 'text-lg', led: 'text-4xl', flip: 'text-2xl' },
      xl: { text: 'text-xl', led: 'text-5xl', flip: 'text-3xl' },
    };
    return configs[this.size()];
  });

  // Display text computation
  protected readonly displayText = computed(() => {
    const mode = this.mode();

    switch (mode) {
      case 'time': {
        const time = this.showRemaining() ? this.total() - this.value() : this.value();
        const prefix = this.showRemaining() ? '-' : '';
        return prefix + this.formatTime(time);
      }
      case 'bpm': {
        return `${this.bpm().toFixed(1)} BPM`;
      }
      case 'bars': {
        return `${this.bar()}.${this.beat()}`;
      }
      case 'samples': {
        const samples = Math.floor(this.value() * this.sampleRate());
        return samples.toLocaleString();
      }
      default: {
        return this.formatTime(this.value());
      }
    }
  });

  protected readonly displayChars = computed(() => {
    return this.displayText().split('');
  });

  protected readonly ghostText = computed(() => {
    // Create a "ghost" text for LCD effect (all 8s and colons)
    const text = this.displayText();
    return text.replace(/\d/g, '8').replace(/[^\d:.-]/g, ' ');
  });

  protected readonly flipSegments = computed((): FlipSegment[] => {
    const time = this.value();
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);

    const segments: FlipSegment[] = [];
    const showHrs = this.showHours() === 'always' || (this.showHours() === 'auto' && hrs > 0);

    if (showHrs) {
      segments.push({ id: 'h', value: hrs.toString().padStart(2, '0'), separator: true });
    }
    segments.push({ id: 'm', value: mins.toString().padStart(2, '0'), separator: true });
    segments.push({ id: 's', value: secs.toString().padStart(2, '0'), separator: false });

    return segments;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'inline-flex items-center';

    const variantClasses: Record<TimeDisplayVariant, string> = {
      default: '',
      led: 'px-3 py-2 bg-slate-900 rounded-lg border border-slate-700',
      digital: 'px-4 py-2 bg-slate-800 rounded-lg font-mono relative',
      flip: 'px-2',
      minimal: '',
    };

    return this.twClass.merge(baseClasses, variantClasses[variant], this.classOverride());
  });

  protected charClasses(char: string): string {
    const size = this.sizeConfig();
    const isDigit = /\d/.test(char);
    const isSeparator = char === ':' || char === '.';

    const baseClasses = `${size.led} font-mono font-bold`;

    if (isDigit) {
      return this.twClass.merge(
        baseClasses,
        'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
      );
    }
    if (isSeparator) {
      return this.twClass.merge(baseClasses, 'text-emerald-400/70 mx-0.5');
    }
    return this.twClass.merge(baseClasses, 'text-emerald-400/50');
  }

  protected readonly digitalClasses = computed(() => {
    const size = this.sizeConfig();
    return this.twClass.merge('font-mono font-bold relative', size.led, 'text-amber-400');
  });

  protected readonly flipCardClasses = computed(() => {
    const size = this.sizeConfig();
    return this.twClass.merge(
      'bg-slate-800 text-white font-bold rounded px-2 py-1 shadow-md',
      size.flip
    );
  });

  protected readonly separatorClasses = computed(() => {
    const size = this.sizeConfig();
    return this.twClass.merge('text-slate-500 font-bold', size.flip);
  });

  protected readonly defaultClasses = computed(() => {
    const size = this.sizeConfig();
    return this.twClass.merge(
      'font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums',
      size.text
    );
  });

  // Utility
  formatTime(seconds: number): string {
    if (!seconds || !Number.isFinite(seconds) || seconds < 0) {
      return this.showHours() === 'always' ? '0:00:00' : '0:00';
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    let result = '';
    const showHrs = this.showHours() === 'always' || (this.showHours() === 'auto' && hrs > 0);

    if (showHrs) {
      result = `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      result = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    if (this.showMilliseconds()) {
      result += `.${ms.toString().padStart(3, '0')}`;
    }

    return result;
  }
}
