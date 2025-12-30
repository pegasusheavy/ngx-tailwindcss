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

export type AudioStatsVariant = 'default' | 'minimal' | 'detailed' | 'compact' | 'pro' | 'light' | 'highContrast';
export type AudioStatsSize = 'sm' | 'md' | 'lg';

export interface AudioFileInfo {
  name?: string;
  duration: number; // seconds
  sampleRate: number; // Hz
  bitDepth?: number; // bits
  channels: number;
  fileSize?: number; // bytes
  codec?: string;
  codecProfile?: string; // e.g., "AAC-LC", "AAC-HE"
  bitrate?: number; // kbps
  bitrateMode?: 'CBR' | 'VBR' | 'ABR'; // Constant, Variable, Average
  format?: string; // mp3, wav, etc.
  container?: string; // mp4, mkv, etc.
  encoder?: string; // e.g., "LAME 3.100"
  replayGain?: number; // dB
  peakLevel?: number; // 0-1
  loudness?: number; // LUFS
}

// Common codec descriptions
export const CODEC_INFO: Record<string, { name: string; description: string; lossy: boolean }> = {
  'mp3': { name: 'MP3', description: 'MPEG Audio Layer III', lossy: true },
  'aac': { name: 'AAC', description: 'Advanced Audio Coding', lossy: true },
  'aac-lc': { name: 'AAC-LC', description: 'Low Complexity AAC', lossy: true },
  'aac-he': { name: 'AAC-HE', description: 'High Efficiency AAC', lossy: true },
  'opus': { name: 'Opus', description: 'Opus Interactive Audio', lossy: true },
  'vorbis': { name: 'Vorbis', description: 'Ogg Vorbis', lossy: true },
  'flac': { name: 'FLAC', description: 'Free Lossless Audio Codec', lossy: false },
  'alac': { name: 'ALAC', description: 'Apple Lossless Audio Codec', lossy: false },
  'wav': { name: 'WAV', description: 'Waveform Audio', lossy: false },
  'pcm': { name: 'PCM', description: 'Pulse Code Modulation', lossy: false },
  'aiff': { name: 'AIFF', description: 'Audio Interchange File Format', lossy: false },
  'dsd': { name: 'DSD', description: 'Direct Stream Digital', lossy: false },
  'wma': { name: 'WMA', description: 'Windows Media Audio', lossy: true },
  'ac3': { name: 'AC-3', description: 'Dolby Digital', lossy: true },
  'eac3': { name: 'E-AC-3', description: 'Dolby Digital Plus', lossy: true },
  'dts': { name: 'DTS', description: 'Digital Theater Systems', lossy: true },
};

/**
 * Audio Stats component for displaying audio file information
 *
 * @example
 * ```html
 * <tw-audio-stats [audioInfo]="fileInfo"></tw-audio-stats>
 * <tw-audio-stats [duration]="180" [sampleRate]="44100" [channels]="2"></tw-audio-stats>
 * ```
 */
@Component({
  selector: 'tw-audio-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwAudioStatsComponent {
  // Configuration
  readonly variant = input<AudioStatsVariant>('default');
  readonly size = input<AudioStatsSize>('md');

  // Audio info object (alternative to individual inputs)
  readonly audioInfo = input<AudioFileInfo | null>(null);

  // Individual inputs (used if audioInfo is not provided)
  readonly name = input<string | null>(null);
  readonly duration = input(0, { transform: numberAttribute }); // seconds
  readonly sampleRate = input(44100, { transform: numberAttribute }); // Hz
  readonly bitDepth = input<number | null>(null);
  readonly channels = input(2, { transform: numberAttribute });
  readonly fileSize = input<number | null>(null); // bytes
  readonly codec = input<string | null>(null);
  readonly bitrate = input<number | null>(null); // kbps
  readonly format = input<string | null>(null);

  // Display options
  readonly showName = input(true);
  readonly showDuration = input(true);
  readonly showSampleRate = input(true);
  readonly showBitDepth = input(true);
  readonly showChannels = input(true);
  readonly showFileSize = input(true);
  readonly showCodec = input(true);
  readonly showBitrate = input(true);
  readonly showFormat = input(true);
  readonly showQualityIndicator = input(false);
  readonly showCodecDetails = input(false); // Show expanded codec info
  readonly showStreamingEstimate = input(false); // Show streaming bandwidth estimate
  readonly showStorageEstimate = input(false); // Show storage for different durations
  readonly showTechnicalSummary = input(true); // Show technical summary line
  readonly showLoudness = input(false); // Show loudness/replay gain info
  readonly classOverride = input('');

  // Outputs
  readonly infoClick = output<string>(); // Emits the clicked stat key

  // Computed effective values
  protected readonly effectiveInfo = computed((): AudioFileInfo => {
    const info = this.audioInfo();
    if (info) return info;

    return {
      name: this.name() || undefined,
      duration: this.duration(),
      sampleRate: this.sampleRate(),
      bitDepth: this.bitDepth() || undefined,
      channels: this.channels(),
      fileSize: this.fileSize() || undefined,
      codec: this.codec() || undefined,
      bitrate: this.bitrate() || undefined,
      format: this.format() || undefined,
    };
  });

  // Formatted displays
  protected readonly formattedDuration = computed(() => {
    const info = this.effectiveInfo();
    const duration = info.duration;
    if (duration <= 0) return '0:00';

    const hours = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = Math.floor(duration % 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  protected readonly formattedSampleRate = computed(() => {
    const info = this.effectiveInfo();
    const rate = info.sampleRate;
    if (rate >= 1000) {
      return `${(rate / 1000).toFixed(1)} kHz`;
    }
    return `${rate} Hz`;
  });

  protected readonly formattedBitDepth = computed(() => {
    const info = this.effectiveInfo();
    return info.bitDepth ? `${info.bitDepth}-bit` : '—';
  });

  protected readonly formattedChannels = computed(() => {
    const info = this.effectiveInfo();
    const channels = info.channels;
    switch (channels) {
      case 1: return 'Mono';
      case 2: return 'Stereo';
      case 6: return '5.1 Surround';
      case 8: return '7.1 Surround';
      default: return `${channels} ch`;
    }
  });

  protected readonly formattedFileSize = computed(() => {
    const info = this.effectiveInfo();
    const size = info.fileSize;
    if (!size) return '—';

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  });

  protected readonly formattedBitrate = computed(() => {
    const info = this.effectiveInfo();
    return info.bitrate ? `${info.bitrate} kbps` : '—';
  });

  protected readonly formattedCodec = computed(() => {
    const info = this.effectiveInfo();
    return info.codec || '—';
  });

  protected readonly formattedFormat = computed(() => {
    const info = this.effectiveInfo();
    return info.format?.toUpperCase() || '—';
  });

  protected readonly qualityLevel = computed((): 'low' | 'medium' | 'high' | 'lossless' => {
    const info = this.effectiveInfo();
    const sampleRate = info.sampleRate;
    const bitDepth = info.bitDepth || 16;
    const bitrate = info.bitrate;

    // Lossless formats
    if (info.codec?.toLowerCase().includes('flac') ||
        info.codec?.toLowerCase().includes('alac') ||
        info.format?.toLowerCase() === 'wav') {
      return 'lossless';
    }

    // High quality (HD audio)
    if (sampleRate >= 96000 || bitDepth >= 24) {
      return 'high';
    }

    // Standard CD quality or high bitrate
    if (sampleRate >= 44100 && (bitrate ? bitrate >= 256 : true)) {
      return 'medium';
    }

    return 'low';
  });

  protected readonly qualityIndicatorColor = computed(() => {
    const level = this.qualityLevel();
    switch (level) {
      case 'lossless': return 'bg-emerald-500';
      case 'high': return 'bg-blue-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-red-500';
    }
  });

  protected readonly qualityLabel = computed(() => {
    const level = this.qualityLevel();
    switch (level) {
      case 'lossless': return 'Lossless';
      case 'high': return 'Hi-Res';
      case 'medium': return 'Standard';
      case 'low': return 'Low';
    }
  });

  // Codec details
  protected readonly codecDetails = computed(() => {
    const info = this.effectiveInfo();
    const codecKey = info.codec?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const codecInfo = CODEC_INFO[codecKey] || null;

    return {
      info: codecInfo,
      profile: info.codecProfile,
      bitrateMode: info.bitrateMode,
      encoder: info.encoder,
      isLossy: codecInfo?.lossy ?? true,
    };
  });

  // Streaming bandwidth estimate (in Mbps for 1 hour)
  protected readonly streamingEstimate = computed(() => {
    const info = this.effectiveInfo();
    const bitrate = info.bitrate || this.estimateBitrate();

    // MB per hour
    const mbPerHour = (bitrate * 60 * 60) / 8 / 1024;
    return {
      mbPerHour: mbPerHour.toFixed(1),
      gbPerHour: (mbPerHour / 1024).toFixed(2),
      mbpsRequired: (bitrate / 1000).toFixed(2),
    };
  });

  // Estimated storage for different durations
  protected readonly storageEstimates = computed(() => {
    const info = this.effectiveInfo();
    const bytesPerSecond = info.fileSize && info.duration > 0
      ? info.fileSize / info.duration
      : this.estimateBytesPerSecond();

    return {
      perMinute: this.formatBytes(bytesPerSecond * 60),
      perHour: this.formatBytes(bytesPerSecond * 3600),
      per10Hours: this.formatBytes(bytesPerSecond * 36000),
    };
  });

  // Loudness info
  protected readonly loudnessInfo = computed(() => {
    const info = this.effectiveInfo();
    return {
      replayGain: info.replayGain,
      peakLevel: info.peakLevel,
      peakDb: info.peakLevel ? (20 * Math.log10(info.peakLevel)).toFixed(1) : null,
      loudness: info.loudness,
    };
  });

  // Data rate (bytes per second)
  protected readonly dataRate = computed(() => {
    const info = this.effectiveInfo();
    if (info.fileSize && info.duration > 0) {
      return info.fileSize / info.duration;
    }
    return this.estimateBytesPerSecond();
  });

  // Formatted data rate
  protected readonly formattedDataRate = computed(() => {
    const rate = this.dataRate();
    if (rate < 1024) return `${rate.toFixed(0)} B/s`;
    if (rate < 1024 * 1024) return `${(rate / 1024).toFixed(1)} KB/s`;
    return `${(rate / (1024 * 1024)).toFixed(2)} MB/s`;
  });

  // Total samples
  protected readonly totalSamples = computed(() => {
    const info = this.effectiveInfo();
    return Math.round(info.duration * info.sampleRate);
  });

  // Formatted total samples
  protected readonly formattedTotalSamples = computed(() => {
    const samples = this.totalSamples();
    if (samples < 1000) return samples.toString();
    if (samples < 1000000) return `${(samples / 1000).toFixed(1)}K`;
    if (samples < 1000000000) return `${(samples / 1000000).toFixed(1)}M`;
    return `${(samples / 1000000000).toFixed(2)}B`;
  });

  // Helper: Estimate bitrate from other parameters
  private estimateBitrate(): number {
    const info = this.effectiveInfo();
    const bitDepth = info.bitDepth || 16;
    const sampleRate = info.sampleRate;
    const channels = info.channels;

    // For lossless: actual data rate
    // For lossy: estimate based on quality level
    const rawBitrate = (bitDepth * sampleRate * channels) / 1000; // kbps

    const codec = info.codec?.toLowerCase() || '';
    if (codec.includes('flac') || codec.includes('alac') || info.format?.toLowerCase() === 'wav') {
      return rawBitrate * 0.6; // ~60% compression for FLAC
    }

    // Default lossy estimate
    return 256; // Assume reasonable quality
  }

  // Helper: Estimate bytes per second
  private estimateBytesPerSecond(): number {
    const bitrate = this.effectiveInfo().bitrate || this.estimateBitrate();
    return (bitrate * 1000) / 8;
  }

  // Helper: Format bytes
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  // Stats array for iteration
  protected readonly stats = computed(() => {
    const info = this.effectiveInfo();
    const stats: { key: string; label: string; value: string; show: boolean }[] = [
      { key: 'duration', label: 'Duration', value: this.formattedDuration(), show: this.showDuration() },
      { key: 'sampleRate', label: 'Sample Rate', value: this.formattedSampleRate(), show: this.showSampleRate() },
      { key: 'bitDepth', label: 'Bit Depth', value: this.formattedBitDepth(), show: this.showBitDepth() && !!info.bitDepth },
      { key: 'channels', label: 'Channels', value: this.formattedChannels(), show: this.showChannels() },
      { key: 'fileSize', label: 'Size', value: this.formattedFileSize(), show: this.showFileSize() && !!info.fileSize },
      { key: 'bitrate', label: 'Bitrate', value: this.formattedBitrate(), show: this.showBitrate() && !!info.bitrate },
      { key: 'codec', label: 'Codec', value: this.formattedCodec(), show: this.showCodec() && !!info.codec },
      { key: 'format', label: 'Format', value: this.formattedFormat(), show: this.showFormat() && !!info.format },
    ];

    return stats.filter(s => s.show);
  });

  // Click handler
  protected onStatClick(key: string): void {
    this.infoClick.emit(key);
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'rounded-lg';

    const variantClasses: Record<AudioStatsVariant, string> = {
      default: 'bg-slate-800 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      detailed: 'bg-slate-900 border border-slate-600 p-4',
      compact: 'bg-slate-800 border border-slate-700 p-2',
      pro: 'bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-900/50 p-4',
      light: 'bg-white border border-slate-200 shadow-sm p-4',
      highContrast: 'bg-black border-2 border-white p-4',
    };

    const sizeClasses: Record<AudioStatsSize, string> = {
      sm: 'text-xs min-w-[180px]',
      md: 'text-sm min-w-[220px]',
      lg: 'text-base min-w-[280px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly labelClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<AudioStatsVariant, string> = {
      default: 'text-slate-500',
      minimal: 'text-slate-600 dark:text-slate-400',
      detailed: 'text-slate-400',
      compact: 'text-slate-500',
      pro: 'text-cyan-500/70',
      light: 'text-slate-600',
      highContrast: 'text-white',
    };

    return variantClasses[variant];
  });

  protected readonly valueClasses = computed(() => {
    const variant = this.variant();

    const variantClasses: Record<AudioStatsVariant, string> = {
      default: 'text-slate-200 font-mono',
      minimal: 'text-slate-800 dark:text-slate-200 font-mono',
      detailed: 'text-white font-mono',
      compact: 'text-slate-300 font-mono',
      pro: 'text-cyan-300 font-mono',
      light: 'text-slate-800 font-mono',
      highContrast: 'text-yellow-400 font-mono',
    };

    return variantClasses[variant];
  });

  // Expose CODEC_INFO for template
  protected readonly CODEC_INFO = CODEC_INFO;
}

