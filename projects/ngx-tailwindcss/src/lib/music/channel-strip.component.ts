import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';

export type ChannelStripVariant = 'default' | 'compact' | 'minimal' | 'vintage';
export type ChannelStripSize = 'sm' | 'md' | 'lg';

export interface ChannelStripState {
  volume: number; // 0-100
  pan: number; // -100 to 100
  mute: boolean;
  solo: boolean;
  record: boolean;
}

@Component({
  selector: 'tw-channel-strip',
  standalone: true,
  imports: [CommonModule, FormsModule, TwVolumeDialComponent, TwVuMeterComponent],
  templateUrl: './channel-strip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwChannelStripComponent),
      multi: true,
    },
  ],
})
export class TwChannelStripComponent implements ControlValueAccessor {
  readonly label = input('Channel');
  readonly channelNumber = input(1, { transform: numberAttribute });
  readonly variant = input<ChannelStripVariant>('default');
  readonly size = input<ChannelStripSize>('md');
  readonly showMeter = input(true);
  readonly showPan = input(true);
  readonly showMuteSolo = input(true);
  readonly showRecord = input(false);
  readonly showLabel = input(true);
  readonly meterLevel = input(0, { transform: numberAttribute }); // 0-100
  readonly meterPeak = input(0, { transform: numberAttribute }); // 0-100
  readonly stereo = input(false);
  readonly meterLevelRight = input(0, { transform: numberAttribute });
  readonly meterPeakRight = input(0, { transform: numberAttribute });
  readonly disabled = input(false);
  readonly classOverride = input('');

  readonly volumeChange = output<number>();
  readonly panChange = output<number>();
  readonly muteChange = output<boolean>();
  readonly soloChange = output<boolean>();
  readonly recordChange = output<boolean>();
  readonly stateChange = output<ChannelStripState>();

  protected readonly volume = signal(75);
  protected readonly pan = signal(0);
  protected readonly mute = signal(false);
  protected readonly solo = signal(false);
  protected readonly record = signal(false);

  private onChange: (value: ChannelStripState) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const baseClasses = 'flex flex-col items-center rounded-lg transition-colors';

    const variantClasses: Record<ChannelStripVariant, string> = {
      default: 'bg-slate-800 border border-slate-700',
      compact: 'bg-slate-900 border border-slate-800',
      minimal: 'bg-transparent',
      vintage: 'bg-gradient-to-b from-amber-950 to-stone-950 border border-amber-900/50',
    };

    const sizeClasses: Record<ChannelStripSize, string> = {
      sm: 'p-2 gap-2 min-w-[60px]',
      md: 'p-3 gap-3 min-w-[80px]',
      lg: 'p-4 gap-4 min-w-[100px]',
    };

    return [baseClasses, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly buttonSize = computed(() => {
    const size = this.size();
    return size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  });

  protected readonly dialSize = computed(() => {
    const size = this.size();
    return size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  });

  protected readonly labelClasses = computed(() => {
    const size = this.size();
    const base = 'text-center font-medium truncate w-full';
    const sizeClass = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';
    return [base, sizeClass].join(' ');
  });

  protected onVolumeChange(value: number): void {
    this.volume.set(value);
    this.volumeChange.emit(value);
    this.emitState();
  }

  protected onPanChange(value: number): void {
    this.pan.set(value);
    this.panChange.emit(value);
    this.emitState();
  }

  protected toggleMute(): void {
    const newValue = !this.mute();
    this.mute.set(newValue);
    this.muteChange.emit(newValue);
    this.emitState();
  }

  protected toggleSolo(): void {
    const newValue = !this.solo();
    this.solo.set(newValue);
    this.soloChange.emit(newValue);
    this.emitState();
  }

  protected toggleRecord(): void {
    const newValue = !this.record();
    this.record.set(newValue);
    this.recordChange.emit(newValue);
    this.emitState();
  }

  private emitState(): void {
    const state: ChannelStripState = {
      volume: this.volume(),
      pan: this.pan(),
      mute: this.mute(),
      solo: this.solo(),
      record: this.record(),
    };
    this.stateChange.emit(state);
    this.onChange(state);
  }

  // ControlValueAccessor
  writeValue(value: ChannelStripState | null): void {
    if (value) {
      this.volume.set(value.volume ?? 75);
      this.pan.set(value.pan ?? 0);
      this.mute.set(value.mute ?? false);
      this.solo.set(value.solo ?? false);
      this.record.set(value.record ?? false);
    }
  }

  registerOnChange(fn: (value: ChannelStripState) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Disabled state is managed via input
  }
}

