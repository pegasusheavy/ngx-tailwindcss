import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwChannelStripComponent, ChannelStripState } from './channel-strip.component';
import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';

export type MixerVariant = 'default' | 'compact' | 'studio' | 'vintage';
export type MixerSize = 'sm' | 'md' | 'lg';

export interface MixerChannel {
  id: string;
  label: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  record?: boolean;
  meterLevel?: number;
  meterLevelRight?: number;
  color?: string;
}

export interface MixerState {
  channels: MixerChannel[];
  masterVolume: number;
  masterMute: boolean;
}

@Component({
  selector: 'tw-mixer',
  standalone: true,
  imports: [CommonModule, FormsModule, TwChannelStripComponent, TwVolumeDialComponent, TwVuMeterComponent],
  templateUrl: './mixer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwMixerComponent {
  readonly channels = input<MixerChannel[]>([]);
  readonly variant = input<MixerVariant>('default');
  readonly size = input<MixerSize>('md');
  readonly showMasterChannel = input(true);
  readonly showRecordArm = input(false);
  readonly showChannelNumbers = input(true);
  readonly maxVisibleChannels = input(8, { transform: numberAttribute });
  readonly scrollable = input(true);
  readonly masterLabel = input('Master');
  readonly masterVolume = input(75, { transform: numberAttribute });
  readonly masterMeterLevel = input(0, { transform: numberAttribute });
  readonly masterMeterLevelRight = input(0, { transform: numberAttribute });
  readonly disabled = input(false);
  readonly classOverride = input('');

  readonly channelChange = output<{ channel: MixerChannel; index: number }>();
  readonly masterChange = output<{ volume: number; mute: boolean }>();
  readonly stateChange = output<MixerState>();
  readonly soloChange = output<{ channel: MixerChannel; index: number; solo: boolean }>();

  protected readonly internalMasterVolume = signal(75);
  protected readonly masterMute = signal(false);
  protected readonly scrollOffset = signal(0);

  protected readonly visibleChannels = computed(() => {
    const all = this.channels();
    const max = this.maxVisibleChannels();
    const offset = this.scrollOffset();

    if (!this.scrollable() || all.length <= max) {
      return all;
    }

    return all.slice(offset, offset + max);
  });

  protected readonly canScrollLeft = computed(() => {
    return this.scrollable() && this.scrollOffset() > 0;
  });

  protected readonly canScrollRight = computed(() => {
    const all = this.channels();
    const max = this.maxVisibleChannels();
    const offset = this.scrollOffset();
    return this.scrollable() && offset + max < all.length;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const baseClasses = 'flex gap-1 rounded-xl overflow-hidden';

    const variantClasses: Record<MixerVariant, string> = {
      default: 'bg-slate-900 border border-slate-700 p-3',
      compact: 'bg-slate-950 border border-slate-800 p-2',
      studio: 'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 p-4 shadow-xl',
      vintage: 'bg-gradient-to-b from-amber-950 to-stone-950 border-2 border-amber-800/50 p-4',
    };

    const sizeClasses: Record<MixerSize, string> = {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    };

    return [baseClasses, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly channelStripVariant = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'vintage':
        return 'vintage';
      case 'compact':
        return 'compact';
      case 'studio':
        return 'default';
      default:
        return 'default';
    }
  });

  protected readonly stripSize = computed(() => {
    return this.size();
  });

  protected onChannelStateChange(state: ChannelStripState, index: number): void {
    const channel = this.channels()[index];
    if (!channel) return;

    const updatedChannel: MixerChannel = {
      ...channel,
      volume: state.volume,
      pan: state.pan,
      mute: state.mute,
      solo: state.solo,
      record: state.record,
    };

    this.channelChange.emit({ channel: updatedChannel, index });
    this.emitState();
  }

  protected onChannelSoloChange(solo: boolean, index: number): void {
    const channel = this.channels()[index];
    if (!channel) return;

    this.soloChange.emit({ channel, index, solo });
  }

  protected onMasterVolumeChange(volume: number): void {
    this.internalMasterVolume.set(volume);
    this.masterChange.emit({ volume, mute: this.masterMute() });
    this.emitState();
  }

  protected toggleMasterMute(): void {
    const newMute = !this.masterMute();
    this.masterMute.set(newMute);
    this.masterChange.emit({ volume: this.internalMasterVolume(), mute: newMute });
    this.emitState();
  }

  protected scrollLeft(): void {
    if (this.canScrollLeft()) {
      this.scrollOffset.update((v) => Math.max(0, v - 1));
    }
  }

  protected scrollRight(): void {
    if (this.canScrollRight()) {
      const max = this.channels().length - this.maxVisibleChannels();
      this.scrollOffset.update((v) => Math.min(max, v + 1));
    }
  }

  private emitState(): void {
    const state: MixerState = {
      channels: this.channels(),
      masterVolume: this.internalMasterVolume(),
      masterMute: this.masterMute(),
    };
    this.stateChange.emit(state);
  }

  protected getChannelState(channel: MixerChannel): ChannelStripState {
    return {
      volume: channel.volume,
      pan: channel.pan,
      mute: channel.mute,
      solo: channel.solo,
      record: channel.record ?? false,
    };
  }
}

