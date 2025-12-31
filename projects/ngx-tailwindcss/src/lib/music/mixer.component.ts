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
export type MixerBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ChannelGroup {
  id: string;
  name: string;
  channelIds: string[];
  color?: string;
  collapsed?: boolean;
  linkVolume?: boolean; // When true, volume changes affect all grouped channels
  linkMute?: boolean; // When true, mute affects all grouped channels
  linkSolo?: boolean; // When true, solo affects all grouped channels
}

export interface MixerSection {
  id: string;
  name: string;
  channelIds: string[];
  collapsed: boolean;
  color?: string;
}

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
  groupId?: string; // Reference to channel group
  sectionId?: string; // Reference to section
}

export interface MixerState {
  channels: MixerChannel[];
  masterVolume: number;
  masterMute: boolean;
  groups: ChannelGroup[];
  sections: MixerSection[];
}

// Responsive breakpoint configurations
const BREAKPOINT_CONFIGS: Record<
  MixerBreakpoint,
  { maxChannels: number; size: MixerSize; showLabels: boolean }
> = {
  xs: { maxChannels: 2, size: 'sm', showLabels: false },
  sm: { maxChannels: 4, size: 'sm', showLabels: true },
  md: { maxChannels: 6, size: 'md', showLabels: true },
  lg: { maxChannels: 8, size: 'md', showLabels: true },
  xl: { maxChannels: 12, size: 'lg', showLabels: true },
};

@Component({
  selector: 'tw-mixer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwChannelStripComponent,
    TwVolumeDialComponent,
    TwVuMeterComponent,
  ],
  templateUrl: './mixer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwMixerComponent {
  readonly channels = input<MixerChannel[]>([]);
  readonly groups = input<ChannelGroup[]>([]); // NEW: Channel groups
  readonly sections = input<MixerSection[]>([]); // NEW: Collapsible sections
  readonly variant = input<MixerVariant>('default');
  readonly size = input<MixerSize>('md');
  readonly showMasterChannel = input(true);
  readonly showRecordArm = input(false);
  readonly showChannelNumbers = input(true);
  readonly showSectionHeaders = input(true); // NEW: Show section headers
  readonly showGroupIndicators = input(true); // NEW: Show group color indicators
  readonly maxVisibleChannels = input(8, { transform: numberAttribute });
  readonly scrollable = input(true);
  readonly responsive = input(false); // NEW: Enable responsive breakpoints
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
  readonly sectionToggle = output<{ sectionId: string; collapsed: boolean }>();
  readonly groupChange = output<{ groupId: string; channels: MixerChannel[] }>();

  protected readonly internalMasterVolume = signal(75);
  protected readonly masterMute = signal(false);
  protected readonly scrollOffset = signal(0);
  protected readonly collapsedSections = signal<Set<string>>(new Set());
  protected readonly currentBreakpoint = signal<MixerBreakpoint>('md');

  protected readonly visibleChannels = computed(() => {
    const all = this.channels();
    const collapsed = this.collapsedSections();
    const sectionsList = this.sections();

    // Filter out channels in collapsed sections
    let filtered = all;
    if (sectionsList.length > 0) {
      const collapsedChannelIds = new Set<string>();
      for (const section of sectionsList) {
        if (collapsed.has(section.id)) {
          for (const id of section.channelIds) {
            collapsedChannelIds.add(id);
          }
        }
      }
      filtered = all.filter(ch => !collapsedChannelIds.has(ch.id));
    }

    const max = this.effectiveMaxChannels();
    const offset = this.scrollOffset();

    if (!this.scrollable() || filtered.length <= max) {
      return filtered;
    }

    return filtered.slice(offset, offset + max);
  });

  // Effective max channels based on responsive mode
  protected readonly effectiveMaxChannels = computed(() => {
    if (this.responsive()) {
      return BREAKPOINT_CONFIGS[this.currentBreakpoint()].maxChannels;
    }
    return this.maxVisibleChannels();
  });

  // Effective size based on responsive mode
  protected readonly effectiveSize = computed(() => {
    if (this.responsive()) {
      return BREAKPOINT_CONFIGS[this.currentBreakpoint()].size;
    }
    return this.size();
  });

  // Whether to show labels based on responsive mode
  protected readonly effectiveShowLabels = computed(() => {
    if (this.responsive()) {
      return BREAKPOINT_CONFIGS[this.currentBreakpoint()].showLabels;
    }
    return this.showChannelNumbers();
  });

  // Organized channels by section
  protected readonly channelsBySection = computed(() => {
    const channels = this.channels();
    const sectionsList = this.sections();
    const collapsed = this.collapsedSections();

    if (sectionsList.length === 0) {
      return [{ section: null, channels, collapsed: false }];
    }

    const result: Array<{
      section: MixerSection | null;
      channels: MixerChannel[];
      collapsed: boolean;
    }> = [];
    const assignedIds = new Set<string>();

    for (const section of sectionsList) {
      const sectionChannels = channels.filter(ch => section.channelIds.includes(ch.id));
      for (const ch of sectionChannels) {
        assignedIds.add(ch.id);
      }
      result.push({
        section,
        channels: sectionChannels,
        collapsed: collapsed.has(section.id),
      });
    }

    // Add unassigned channels
    const unassigned = channels.filter(ch => !assignedIds.has(ch.id));
    if (unassigned.length > 0) {
      result.unshift({ section: null, channels: unassigned, collapsed: false });
    }

    return result;
  });

  // Get group for a channel
  protected getChannelGroup(channel: MixerChannel): ChannelGroup | undefined {
    if (!channel.groupId) return undefined;
    return this.groups().find(g => g.id === channel.groupId);
  }

  // Check if channel is in a group
  protected isChannelGrouped(channel: MixerChannel): boolean {
    return !!channel.groupId && this.groups().some(g => g.id === channel.groupId);
  }

  protected readonly canScrollLeft = computed(() => {
    return this.scrollable() && this.scrollOffset() > 0;
  });

  protected readonly canScrollRight = computed(() => {
    const all = this.channels();
    const max = this.effectiveMaxChannels();
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
    return this.effectiveSize();
  });

  // Responsive container classes
  protected readonly responsiveClasses = computed(() => {
    if (!this.responsive()) return '';
    return 'w-full';
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

    // Handle linked group changes
    if (channel.groupId) {
      const group = this.groups().find(g => g.id === channel.groupId);
      if (group) {
        const linkedChannels = this.applyGroupChanges(channel, updatedChannel, group);
        if (linkedChannels.length > 0) {
          this.groupChange.emit({ groupId: group.id, channels: linkedChannels });
        }
      }
    }

    this.channelChange.emit({ channel: updatedChannel, index });
    this.emitState();
  }

  // Apply changes to linked group members
  private applyGroupChanges(
    original: MixerChannel,
    updated: MixerChannel,
    group: ChannelGroup
  ): MixerChannel[] {
    const linkedChannels: MixerChannel[] = [];
    const channels = this.channels();

    for (const channelId of group.channelIds) {
      if (channelId === original.id) continue;

      const linkedChannel = channels.find(c => c.id === channelId);
      if (!linkedChannel) continue;

      const changes: Partial<MixerChannel> = {};

      if (group.linkVolume && original.volume !== updated.volume) {
        // Apply relative volume change
        const volumeDelta = updated.volume - original.volume;
        changes.volume = Math.max(0, Math.min(100, linkedChannel.volume + volumeDelta));
      }

      if (group.linkMute && original.mute !== updated.mute) {
        changes.mute = updated.mute;
      }

      if (group.linkSolo && original.solo !== updated.solo) {
        changes.solo = updated.solo;
      }

      if (Object.keys(changes).length > 0) {
        linkedChannels.push({ ...linkedChannel, ...changes });
      }
    }

    return linkedChannels;
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
      this.scrollOffset.update(v => Math.max(0, v - 1));
    }
  }

  protected scrollRight(): void {
    if (this.canScrollRight()) {
      const max = this.channels().length - this.effectiveMaxChannels();
      this.scrollOffset.update(v => Math.min(max, v + 1));
    }
  }

  // Toggle section collapse
  protected toggleSection(sectionId: string): void {
    this.collapsedSections.update(set => {
      const newSet = new Set(set);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });

    const collapsed = this.collapsedSections().has(sectionId);
    this.sectionToggle.emit({ sectionId, collapsed });
  }

  // Check if section is collapsed
  protected isSectionCollapsed(sectionId: string): boolean {
    return this.collapsedSections().has(sectionId);
  }

  // Update breakpoint based on container width (call from resize observer)
  updateBreakpoint(width: number): void {
    let bp: MixerBreakpoint = 'xl';
    if (width < 400) bp = 'xs';
    else if (width < 640) bp = 'sm';
    else if (width < 768) bp = 'md';
    else if (width < 1024) bp = 'lg';

    this.currentBreakpoint.set(bp);
  }

  private emitState(): void {
    const state: MixerState = {
      channels: this.channels(),
      masterVolume: this.internalMasterVolume(),
      masterMute: this.masterMute(),
      groups: this.groups(),
      sections: this.sections().map(s => ({
        ...s,
        collapsed: this.collapsedSections().has(s.id),
      })),
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
      inputGain: 0,
      auxSends: [],
    };
  }
}
