import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ScrubberVariant = 'default' | 'thin' | 'thick' | 'youtube' | 'spotify';

export interface ScrubberMarker {
  time: number;
  label?: string;
  color?: string;
}

export interface ScrubberThumbnail {
  time: number;
  url: string;
  width?: number;
  height?: number;
}

export interface ThumbnailSpriteConfig {
  url: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  interval: number; // seconds between each frame
  totalFrames: number;
}

/**
 * Progress Bar / Scrubber component for audio/video timeline
 *
 * @example
 * ```html
 * <tw-scrubber
 *   [currentTime]="position"
 *   [duration]="totalDuration"
 *   (seek)="onSeek($event)"
 * ></tw-scrubber>
 * ```
 */
@Component({
  selector: 'tw-scrubber',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrubber.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwScrubberComponent {
  private readonly twClass = inject(TwClassService);
  private readonly trackContainer = viewChild<ElementRef<HTMLDivElement>>('trackContainer');

  // Time inputs
  readonly currentTime = input(0);
  readonly duration = input(100);
  readonly buffered = input(0);

  // Display options
  readonly variant = input<ScrubberVariant>('default');
  readonly showTime = input(true);
  readonly timePosition = input<'outside' | 'inside'>('outside');
  readonly showRemaining = input(false);
  readonly showBuffered = input(true);
  readonly showThumb = input(true);
  readonly showHoverPreview = input(true);
  readonly showMarkers = input(false);
  readonly markers = input<ScrubberMarker[]>([]);
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Thumbnail preview options
  readonly showThumbnailPreview = input(false);
  readonly thumbnails = input<ScrubberThumbnail[]>([]);
  readonly thumbnailSprite = input<ThumbnailSpriteConfig | null>(null);
  readonly thumbnailWidth = input(160);
  readonly thumbnailHeight = input(90);
  readonly thumbnailOffset = input(60); // Distance above scrubber in px
  readonly thumbnailBorderRadius = input(4);
  readonly videoElement = input<HTMLVideoElement | null>(null); // For live thumbnail generation

  // Outputs
  readonly seek = output<number>();
  readonly seekStart = output<void>();
  readonly seekEnd = output<void>();

  // Internal state
  protected readonly hoverPosition = signal<number | null>(null);
  protected readonly isDragging = signal(false);

  // Computed values
  protected readonly progressPercent = computed(() => {
    const dur = this.duration();
    if (dur <= 0) return 0;
    return (this.currentTime() / dur) * 100;
  });

  protected readonly containerClasses = computed(() => {
    const baseClasses = 'flex items-center gap-3';
    return this.twClass.merge(baseClasses, this.classOverride());
  });

  protected readonly trackContainerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'relative flex-1 cursor-pointer rounded-full overflow-hidden';

    const heightClasses: Record<ScrubberVariant, string> = {
      default: 'h-2',
      thin: 'h-1',
      thick: 'h-3',
      youtube: 'h-1 hover:h-2 transition-all duration-150',
      spotify: 'h-1 group',
    };

    const bgClasses: Record<ScrubberVariant, string> = {
      default: 'bg-slate-200 dark:bg-slate-700',
      thin: 'bg-slate-200 dark:bg-slate-700',
      thick: 'bg-slate-200 dark:bg-slate-700',
      youtube: 'bg-white/30',
      spotify: 'bg-slate-600',
    };

    return this.twClass.merge(
      baseClasses,
      heightClasses[variant],
      bgClasses[variant],
      this.disabled() ? 'opacity-50 cursor-not-allowed' : ''
    );
  });

  protected readonly bufferedClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'absolute top-0 left-0 h-full pointer-events-none';

    const colorClasses: Record<ScrubberVariant, string> = {
      default: 'bg-slate-300 dark:bg-slate-600',
      thin: 'bg-slate-300 dark:bg-slate-600',
      thick: 'bg-slate-300 dark:bg-slate-600',
      youtube: 'bg-white/50',
      spotify: 'bg-slate-500',
    };

    return this.twClass.merge(baseClasses, colorClasses[variant]);
  });

  protected readonly progressClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'absolute top-0 left-0 h-full pointer-events-none transition-all duration-75';

    const colorClasses: Record<ScrubberVariant, string> = {
      default: 'bg-blue-500',
      thin: 'bg-blue-500',
      thick: 'bg-gradient-to-r from-blue-500 to-blue-400',
      youtube: 'bg-red-600',
      spotify: 'bg-emerald-500',
    };

    return this.twClass.merge(baseClasses, colorClasses[variant]);
  });

  protected readonly thumbClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 pointer-events-none';

    const sizeClasses: Record<ScrubberVariant, string> = {
      default: 'w-4 h-4',
      thin: 'w-3 h-3',
      thick: 'w-5 h-5',
      youtube: 'w-3 h-3 opacity-0 hover:opacity-100 scale-0 hover:scale-100',
      spotify: 'w-3 h-3 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100',
    };

    const colorClasses: Record<ScrubberVariant, string> = {
      default: 'bg-blue-500 shadow-md',
      thin: 'bg-blue-500 shadow-sm',
      thick: 'bg-white shadow-lg border-2 border-blue-500',
      youtube: 'bg-red-600',
      spotify: 'bg-white shadow-md',
    };

    return this.twClass.merge(baseClasses, sizeClasses[variant], colorClasses[variant]);
  });

  protected readonly markerClasses = computed(() => {
    return 'absolute top-0 bottom-0 w-0.5 bg-yellow-500 -translate-x-1/2 pointer-events-none';
  });

  protected readonly hoverPreviewClasses = computed(() => {
    return 'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap';
  });

  protected readonly thumbnailContainerClasses = computed(() => {
    return 'absolute left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center';
  });

  protected readonly thumbnailImageClasses = computed(() => {
    const radius = this.thumbnailBorderRadius();
    return `shadow-lg border-2 border-slate-700 bg-slate-900 overflow-hidden`;
  });

  // Get the current thumbnail for hover position
  protected readonly currentThumbnail = computed(() => {
    const pos = this.hoverPosition();
    if (pos === null) return null;

    const time = pos * this.duration();
    const thumbnails = this.thumbnails();
    const sprite = this.thumbnailSprite();

    // Try individual thumbnails first
    if (thumbnails.length > 0) {
      return this.findClosestThumbnail(time, thumbnails);
    }

    // Try sprite sheet
    if (sprite) {
      return this.getThumbnailFromSprite(time, sprite);
    }

    return null;
  });

  // Get sprite background position for current time
  protected readonly spritePosition = computed(() => {
    const pos = this.hoverPosition();
    if (pos === null) return null;

    const sprite = this.thumbnailSprite();
    if (!sprite) return null;

    const time = pos * this.duration();
    const frameIndex = Math.min(
      Math.floor(time / sprite.interval),
      sprite.totalFrames - 1
    );

    const col = frameIndex % sprite.columns;
    const row = Math.floor(frameIndex / sprite.columns);

    return {
      x: -col * sprite.frameWidth,
      y: -row * sprite.frameHeight,
      width: sprite.frameWidth,
      height: sprite.frameHeight,
    };
  });

  protected readonly timeClasses = computed(() => {
    return 'text-sm font-mono text-slate-600 dark:text-slate-400 tabular-nums min-w-[3.5rem]';
  });

  protected readonly timeInsideClasses = computed(() => {
    return 'text-xs font-mono text-white/90 tabular-nums';
  });

  // Event handlers
  onMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.isDragging.set(true);
    this.seekStart.emit();
    this.updatePosition(event.clientX);

    const onMouseMove = (e: MouseEvent): void => {
      this.updatePosition(e.clientX);
    };
    const onMouseUp = (): void => {
      this.isDragging.set(false);
      this.seekEnd.emit();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) {
      const position = this.getPositionFromEvent(event.clientX);
      this.hoverPosition.set(position);
    }
  }

  onMouseLeave(): void {
    if (!this.isDragging()) {
      this.hoverPosition.set(null);
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.isDragging.set(true);
    this.seekStart.emit();
    const touch = event.touches[0];
    this.updatePosition(touch.clientX);

    const onTouchMove = (e: TouchEvent): void => {
      const t = e.touches[0];
      this.updatePosition(t.clientX);
    };
    const onTouchEnd = (): void => {
      this.isDragging.set(false);
      this.seekEnd.emit();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const dur = this.duration();
    const current = this.currentTime();
    let newTime = current;
    const smallStep = dur * 0.01; // 1%
    const largeStep = dur * 0.1;  // 10%

    switch (event.key) {
      case 'ArrowRight': {
        newTime = Math.min(dur, current + smallStep);
        break;
      }
      case 'ArrowLeft': {
        newTime = Math.max(0, current - smallStep);
        break;
      }
      case 'ArrowUp':
      case 'PageUp': {
        newTime = Math.min(dur, current + largeStep);
        break;
      }
      case 'ArrowDown':
      case 'PageDown': {
        newTime = Math.max(0, current - largeStep);
        break;
      }
      case 'Home': {
        newTime = 0;
        break;
      }
      case 'End': {
        newTime = dur;
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();
    this.seek.emit(newTime);
  }

  private updatePosition(clientX: number): void {
    const position = this.getPositionFromEvent(clientX);
    const time = position * this.duration();
    this.seek.emit(time);
  }

  private getPositionFromEvent(clientX: number): number {
    const container = this.trackContainer()?.nativeElement;
    if (!container) return 0;

    const rect = container.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, position));
  }

  // Utility
  formatTime(seconds: number): string {
    if (!seconds || !Number.isFinite(seconds) || seconds < 0) return '0:00';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private findClosestThumbnail(
    time: number,
    thumbnails: ScrubberThumbnail[]
  ): ScrubberThumbnail | null {
    if (thumbnails.length === 0) return null;

    // Sort thumbnails by time
    const sorted = [...thumbnails].sort((a, b) => a.time - b.time);

    // Find closest thumbnail
    let closest = sorted[0];
    let minDiff = Math.abs(time - closest.time);

    for (const thumb of sorted) {
      const diff = Math.abs(time - thumb.time);
      if (diff < minDiff) {
        minDiff = diff;
        closest = thumb;
      }
      // If we've passed the time, no need to continue
      if (thumb.time > time && minDiff < diff) break;
    }

    return closest;
  }

  private getThumbnailFromSprite(
    time: number,
    sprite: ThumbnailSpriteConfig
  ): ScrubberThumbnail | null {
    const frameIndex = Math.min(
      Math.floor(time / sprite.interval),
      sprite.totalFrames - 1
    );

    return {
      time: frameIndex * sprite.interval,
      url: sprite.url,
      width: sprite.frameWidth,
      height: sprite.frameHeight,
    };
  }

  // Generate thumbnail canvas from video element (optional advanced feature)
  protected generateVideoThumbnail(time: number): string | null {
    const video = this.videoElement();
    if (!video) return null;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = this.thumbnailWidth();
      canvas.height = this.thumbnailHeight();

      // Save current time and seek
      const currentTime = video.currentTime;

      // Note: For live thumbnails, you'd need to handle this differently
      // as seeking causes video to pause/buffer
      // This is mainly for reference implementation

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.7);
    } catch {
      return null;
    }
  }
}




