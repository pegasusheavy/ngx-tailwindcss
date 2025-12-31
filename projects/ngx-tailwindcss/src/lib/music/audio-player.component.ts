import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTransportComponent } from './transport.component';
import { TwScrubberComponent } from './scrubber.component';
import { TwTimeDisplayComponent } from './time-display.component';
import { TwVolumeDialComponent } from './volume-dial.component';
import { TwWaveformComponent } from './waveform.component';
import { TwButtonComponent } from '../button/button.component';

export type AudioPlayerVariant = 'default' | 'minimal' | 'compact' | 'full';
export type AudioPlayerTheme = 'dark' | 'light' | 'transparent';

export interface AudioTrack {
  src: string;
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
  duration?: number;
}

@Component({
  selector: 'tw-audio-player',
  standalone: true,
  imports: [
    CommonModule,
    TwTransportComponent,
    TwScrubberComponent,
    TwTimeDisplayComponent,
    TwVolumeDialComponent,
    TwWaveformComponent,
    TwButtonComponent,
  ],
  templateUrl: './audio-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwAudioPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioElement') private audioRef!: ElementRef<HTMLAudioElement>;

  readonly track = input<AudioTrack | null>(null);
  readonly src = input<string>(''); // Alternative to track
  readonly autoplay = input(false);
  readonly loop = input(false);
  readonly muted = input(false);
  readonly volume = input(0.8, { transform: numberAttribute });
  readonly variant = input<AudioPlayerVariant>('default');
  readonly theme = input<AudioPlayerTheme>('dark');
  readonly showWaveform = input(false);
  readonly showArtwork = input(true);
  readonly showVolume = input(true);
  readonly showTime = input(true);
  readonly classOverride = input('');

  readonly play = output<void>();
  readonly pause = output<void>();
  readonly ended = output<void>();
  readonly timeUpdate = output<number>();
  readonly volumeChange = output<number>();
  readonly error = output<string>();

  protected readonly isPlaying = signal(false);
  protected readonly currentTime = signal(0);
  protected readonly duration = signal(0);
  protected readonly buffered = signal(0);
  protected readonly internalVolume = signal(0.8);
  protected readonly isMuted = signal(false);
  protected readonly isLooping = signal(false);
  protected readonly isExpanded = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly audioBuffer = signal<AudioBuffer | null>(null);

  private audioContext: AudioContext | null = null;

  protected readonly progress = computed(() => {
    const dur = this.duration();
    if (dur === 0) return 0;
    return this.currentTime() / dur;
  });

  protected readonly bufferedProgress = computed(() => {
    const dur = this.duration();
    if (dur === 0) return 0;
    return this.buffered() / dur;
  });

  protected readonly audioSrc = computed(() => {
    return this.track()?.src || this.src();
  });

  protected readonly trackInfo = computed(() => {
    const track = this.track();
    return {
      title: track?.title || 'Unknown Track',
      artist: track?.artist || 'Unknown Artist',
      album: track?.album,
      artwork: track?.artwork,
    };
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const theme = this.theme();
    const base = 'rounded-xl overflow-hidden';

    const themeClasses: Record<AudioPlayerTheme, string> = {
      dark: 'bg-slate-900 text-white',
      light: 'bg-white text-slate-900 border border-slate-200',
      transparent: 'bg-transparent',
    };

    const variantClasses: Record<AudioPlayerVariant, string> = {
      default: 'p-4',
      minimal: 'p-2',
      compact: 'p-3',
      full: 'p-6',
    };

    return [base, themeClasses[theme], variantClasses[variant], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly textClasses = computed(() => {
    const theme = this.theme();
    return {
      title: theme === 'light' ? 'text-slate-900' : 'text-white',
      artist: theme === 'light' ? 'text-slate-600' : 'text-slate-400',
      time: theme === 'light' ? 'text-slate-500' : 'text-slate-400',
    };
  });

  ngAfterViewInit(): void {
    this.internalVolume.set(this.volume());
    this.isMuted.set(this.muted());
    this.isLooping.set(this.loop());

    if (this.showWaveform() && this.audioSrc()) {
      this.loadAudioBuffer();
    }
  }

  ngOnDestroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  private async loadAudioBuffer(): Promise<void> {
    const src = this.audioSrc();
    if (!src) return;

    try {
      this.isLoading.set(true);
      this.audioContext = new AudioContext();
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffer.set(audioBuffer);
    } catch (err) {
      console.error('Error loading audio buffer:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onPlay(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.play();
    }
  }

  protected onPause(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.pause();
    }
  }

  protected onStop(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.isPlaying.set(false);
    }
  }

  protected onSeek(position: number): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.currentTime = position * this.duration();
    }
  }

  protected onSkipBackward(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  }

  protected onSkipForward(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.currentTime = Math.min(this.duration(), audio.currentTime + 10);
    }
  }

  protected onVolumeChange(value: number): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.volume = value;
      this.internalVolume.set(value);
      this.volumeChange.emit(value);
    }
  }

  protected toggleMute(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.muted = !audio.muted;
      this.isMuted.set(audio.muted);
    }
  }

  protected toggleLoop(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.loop = !audio.loop;
      this.isLooping.set(audio.loop);
    }
  }

  protected toggleExpand(): void {
    this.isExpanded.update(v => !v);
  }

  // Audio element event handlers
  protected onAudioPlay(): void {
    this.isPlaying.set(true);
    this.play.emit();
  }

  protected onAudioPause(): void {
    this.isPlaying.set(false);
    this.pause.emit();
  }

  protected onAudioEnded(): void {
    this.isPlaying.set(false);
    this.ended.emit();
  }

  protected onAudioTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      this.currentTime.set(audio.currentTime);
      this.timeUpdate.emit(audio.currentTime);
    }
  }

  protected onAudioDurationChange(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio && !isNaN(audio.duration)) {
      this.duration.set(audio.duration);
    }
  }

  protected onAudioProgress(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio && audio.buffered.length > 0) {
      this.buffered.set(audio.buffered.end(audio.buffered.length - 1));
    }
  }

  protected onAudioError(): void {
    this.error.emit('Error loading audio');
    this.isLoading.set(false);
  }

  protected onAudioLoadStart(): void {
    this.isLoading.set(true);
  }

  protected onAudioCanPlay(): void {
    this.isLoading.set(false);
  }
}
