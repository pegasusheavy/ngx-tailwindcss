import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MusicAccessibilityService } from './accessibility.service';

export type FaderVariant = 'default' | 'studio' | 'minimal' | 'vintage' | 'channel';
export type FaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type FaderOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'tw-fader',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './fader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwFaderComponent),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
  },
})
export class TwFaderComponent implements ControlValueAccessor, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly a11y = inject(MusicAccessibilityService);

  @ViewChild('track') private trackRef!: ElementRef<HTMLDivElement>;

  constructor() {
    // Watch for peakLevel changes
    effect(() => {
      const level = this.peakLevel();
      this.updatePeakHold(level);
    });
  }

  ngOnDestroy(): void {
    if (this.peakHoldTimeout) {
      clearTimeout(this.peakHoldTimeout);
    }
  }

  readonly min = input(-60, { transform: numberAttribute }); // dB
  readonly max = input(12, { transform: numberAttribute }); // dB
  readonly step = input(0.1, { transform: numberAttribute });
  readonly defaultValue = input(0, { transform: numberAttribute }); // Unity gain
  readonly orientation = input<FaderOrientation>('vertical');
  readonly variant = input<FaderVariant>('default');
  readonly size = input<FaderSize>('md');
  readonly label = input<string>('');
  readonly showValue = input(true);
  readonly showScale = input(true);
  readonly showPeakMeter = input(false);
  readonly peakLevel = input(0, { transform: numberAttribute }); // 0-100
  readonly peakHold = input(true); // Enable peak hold indicator
  readonly peakHoldTime = input(1500, { transform: numberAttribute }); // ms before peak decay
  readonly snapToZero = input(true);
  readonly snapThreshold = input(2, { transform: numberAttribute }); // dB
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Custom dimensions (override size presets)
  readonly customWidth = input<number | null>(null);
  readonly customHeight = input<number | null>(null);
  readonly customTrackLength = input<number | null>(null);

  // Mobile / Touch options
  readonly hapticFeedback = input(true); // Enable haptic feedback on value changes
  readonly touchGuard = input(false); // Prevent accidental touches
  readonly minTouchDuration = input(0); // Minimum touch duration (ms) before interaction
  readonly snapHaptic = input(true); // Haptic feedback when snapping to zero

  // Accessibility options
  readonly announceChanges = input(true); // Announce value changes to screen readers
  readonly reducedMotion = input<boolean | 'auto'>('auto'); // Respect reduced motion preference

  // Channel strip specific
  readonly channelNumber = input<number | null>(null);
  readonly showChannelNumber = input(true);
  readonly muted = input(false);
  readonly soloed = input(false);

  readonly valueChange = output<number>();
  readonly hapticTrigger = output<'change' | 'snap' | 'boundary'>(); // Haptic feedback trigger points

  protected readonly internalValue = signal(0);
  protected readonly isDragging = signal(false);
  protected readonly peakHoldLevel = signal(0); // Peak hold indicator position (0-100)

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  private peakHoldTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastPeakLevel = 0;

  protected readonly dimensions = computed(() => {
    const size = this.size();
    const orientation = this.orientation();
    const variant = this.variant();

    const configs: Record<FaderSize, { trackLength: number; trackWidth: number; capWidth: number; capHeight: number }> = {
      sm: { trackLength: 100, trackWidth: 8, capWidth: 24, capHeight: 12 },
      md: { trackLength: 150, trackWidth: 10, capWidth: 32, capHeight: 16 },
      lg: { trackLength: 200, trackWidth: 12, capWidth: 40, capHeight: 20 },
      xl: { trackLength: 280, trackWidth: 14, capWidth: 48, capHeight: 24 },
    };

    // Channel variant uses taller/wider dimensions
    const channelConfigs: Record<FaderSize, { trackLength: number; trackWidth: number; capWidth: number; capHeight: number }> = {
      sm: { trackLength: 120, trackWidth: 10, capWidth: 32, capHeight: 16 },
      md: { trackLength: 180, trackWidth: 12, capWidth: 40, capHeight: 20 },
      lg: { trackLength: 240, trackWidth: 14, capWidth: 48, capHeight: 24 },
      xl: { trackLength: 320, trackWidth: 16, capWidth: 56, capHeight: 28 },
    };

    const config = variant === 'channel' ? channelConfigs[size] : configs[size];

    // Apply custom overrides
    const trackLength = this.customTrackLength() ?? config.trackLength;
    const trackWidth = config.trackWidth;
    const capWidth = config.capWidth;
    const capHeight = config.capHeight;

    // Calculate container dimensions
    let width = orientation === 'vertical' ? capWidth + 50 : trackLength + 40;
    let height = orientation === 'vertical' ? trackLength + 60 : capWidth + 40;

    // Apply custom dimensions if provided
    if (this.customWidth()) {
      width = this.customWidth()!;
    }
    if (this.customHeight()) {
      height = this.customHeight()!;
    }

    return {
      trackLength,
      trackWidth,
      capWidth,
      capHeight,
      width,
      height,
    };
  });

  // CSS variable style bindings for custom sizing
  protected readonly cssVarStyles = computed(() => {
    const styles: Record<string, string> = {};
    const dims = this.dimensions();
    if (this.customHeight()) styles['--tw-music-fader-height'] = `${dims.height}px`;
    if (this.customWidth()) styles['--tw-music-fader-width'] = `${dims.width}px`;
    if (this.customTrackLength()) styles['--tw-music-fader-track-length'] = `${dims.trackLength}px`;
    return styles;
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();

    const schemes: Record<FaderVariant, {
      track: string;
      fill: string;
      cap: string;
      capHighlight: string;
      capLine: string;
      text: string;
      scale: string;
      peakHold: string;
      container: string;
    }> = {
      default: {
        track: 'bg-slate-700',
        fill: 'bg-blue-500',
        cap: 'bg-gradient-to-b from-slate-300 to-slate-400',
        capHighlight: 'bg-slate-200',
        capLine: 'bg-slate-500',
        text: 'text-slate-300',
        scale: 'text-slate-500',
        peakHold: 'bg-red-500',
        container: '',
      },
      studio: {
        track: 'bg-slate-800',
        fill: 'bg-green-500',
        cap: 'bg-gradient-to-b from-slate-200 to-slate-300',
        capHighlight: 'bg-white',
        capLine: 'bg-slate-400',
        text: 'text-slate-200',
        scale: 'text-slate-400',
        peakHold: 'bg-red-500',
        container: '',
      },
      minimal: {
        track: 'bg-slate-300 dark:bg-slate-700',
        fill: 'bg-slate-600 dark:bg-slate-400',
        cap: 'bg-white dark:bg-slate-300',
        capHighlight: 'bg-slate-100 dark:bg-white',
        capLine: 'bg-slate-300 dark:bg-slate-500',
        text: 'text-slate-700 dark:text-slate-300',
        scale: 'text-slate-400 dark:text-slate-500',
        peakHold: 'bg-red-400',
        container: '',
      },
      vintage: {
        track: 'bg-amber-900',
        fill: 'bg-amber-500',
        cap: 'bg-gradient-to-b from-amber-200 to-amber-300',
        capHighlight: 'bg-amber-100',
        capLine: 'bg-amber-600',
        text: 'text-amber-200',
        scale: 'text-amber-400',
        peakHold: 'bg-red-600',
        container: '',
      },
      channel: {
        track: 'bg-slate-900',
        fill: 'bg-gradient-to-t from-green-600 via-green-500 to-yellow-500',
        cap: 'bg-gradient-to-b from-slate-100 to-slate-300 shadow-lg',
        capHighlight: 'bg-white',
        capLine: 'bg-slate-400',
        text: 'text-slate-200',
        scale: 'text-slate-500',
        peakHold: 'bg-red-500',
        container: 'bg-slate-800 rounded-lg p-2 border border-slate-700',
      },
    };

    return schemes[variant];
  });

  protected readonly containerClasses = computed(() => {
    const orientation = this.orientation();
    const base = 'relative flex items-center gap-2';
    const orientationClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
    const disabled = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    return [base, orientationClass, disabled, this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly trackClasses = computed(() => {
    const orientation = this.orientation();
    const { trackLength, trackWidth } = this.dimensions();
    const base = 'relative rounded-full overflow-hidden';

    return {
      class: [base, this.colors().track].join(' '),
      style: orientation === 'vertical'
        ? { width: `${trackWidth}px`, height: `${trackLength}px` }
        : { width: `${trackLength}px`, height: `${trackWidth}px` },
    };
  });

  protected readonly fillStyle = computed(() => {
    const value = this.internalValue();
    const min = this.min();
    const max = this.max();
    const orientation = this.orientation();
    const percentage = ((value - min) / (max - min)) * 100;

    if (orientation === 'vertical') {
      return { height: `${percentage}%`, bottom: 0 };
    }
    return { width: `${percentage}%`, left: 0 };
  });

  protected readonly capPosition = computed(() => {
    const value = this.internalValue();
    const min = this.min();
    const max = this.max();
    const { trackLength, capHeight } = this.dimensions();
    const orientation = this.orientation();

    const percentage = (value - min) / (max - min);
    const position = percentage * (trackLength - capHeight);

    if (orientation === 'vertical') {
      return { bottom: `${position}px` };
    }
    return { left: `${position}px` };
  });

  protected readonly capClasses = computed(() => {
    const { capWidth, capHeight } = this.dimensions();
    const orientation = this.orientation();
    const base = 'absolute rounded-sm shadow-lg cursor-grab active:cursor-grabbing';
    const transform = orientation === 'vertical' ? '-translate-x-1/2 left-1/2' : '-translate-y-1/2 top-1/2';

    return {
      class: [base, transform, this.colors().cap].join(' '),
      style: {
        width: orientation === 'vertical' ? `${capWidth}px` : `${capHeight}px`,
        height: orientation === 'vertical' ? `${capHeight}px` : `${capWidth}px`,
      },
    };
  });

  protected readonly scaleMarks = computed(() => {
    const min = this.min();
    const max = this.max();
    const marks: { value: number; label: string; position: number }[] = [];

    // Common dB marks
    const commonMarks = [12, 6, 0, -6, -12, -18, -24, -36, -48, -60];
    const filteredMarks = commonMarks.filter((m) => m >= min && m <= max);

    for (const mark of filteredMarks) {
      const position = ((mark - min) / (max - min)) * 100;
      marks.push({
        value: mark,
        label: mark === 0 ? '0' : mark > 0 ? `+${mark}` : `${mark}`,
        position,
      });
    }

    return marks;
  });

  protected readonly displayValue = computed(() => {
    const value = this.internalValue();
    if (value <= this.min()) return '-∞';
    if (value >= 0) return `+${value.toFixed(1)}`;
    return value.toFixed(1);
  });

  protected readonly peakHoldPosition = computed(() => {
    const peakLevel = this.peakHoldLevel();
    const { trackLength, capHeight } = this.dimensions();
    const position = (peakLevel / 100) * (trackLength - 4);
    return position;
  });

  // Update peak hold when peakLevel input changes
  updatePeakHold(level: number): void {
    if (!this.peakHold()) return;

    if (level > this.lastPeakLevel || level > this.peakHoldLevel()) {
      this.peakHoldLevel.set(level);
      this.lastPeakLevel = level;

      // Clear existing timeout
      if (this.peakHoldTimeout) {
        clearTimeout(this.peakHoldTimeout);
      }

      // Set decay timeout
      this.peakHoldTimeout = setTimeout(() => {
        this.peakHoldLevel.set(this.peakLevel());
        this.lastPeakLevel = this.peakLevel();
      }, this.peakHoldTime());
    }

    this.lastPeakLevel = level;
  }

  // Call this from ngOnChanges or effect to track peakLevel changes
  protected checkPeakLevel(): void {
    const currentPeak = this.peakLevel();
    this.updatePeakHold(currentPeak);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    this.startDrag(event.clientX, event.clientY);
    event.preventDefault();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
    event.preventDefault();
  }

  private startDrag(clientX: number, clientY: number): void {
    this.isDragging.set(true);
    this.updateValueFromPosition(clientX, clientY);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? e.touches[0] : e;
      this.updateValueFromPosition(pos.clientX, pos.clientY);
    };

    const onUp = () => {
      this.isDragging.set(false);
      this.onTouched();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }

  private updateValueFromPosition(clientX: number, clientY: number): void {
    if (!this.trackRef) return;

    const rect = this.trackRef.nativeElement.getBoundingClientRect();
    const orientation = this.orientation();
    const min = this.min();
    const max = this.max();

    let percentage: number;
    if (orientation === 'vertical') {
      percentage = 1 - (clientY - rect.top) / rect.height;
    } else {
      percentage = (clientX - rect.left) / rect.width;
    }

    percentage = Math.max(0, Math.min(1, percentage));
    let value = min + percentage * (max - min);

    // Snap to zero
    if (this.snapToZero() && Math.abs(value) < this.snapThreshold()) {
      value = 0;
    }

    // Apply step
    const step = this.step();
    value = Math.round(value / step) * step;

    this.setValue(value);
  }

  private setValue(value: number): void {
    const clampedValue = Math.max(this.min(), Math.min(this.max(), value));
    const previousValue = this.internalValue();
    this.internalValue.set(clampedValue);
    this.onChange(clampedValue);
    this.valueChange.emit(clampedValue);

    // Announce to screen readers (only on significant changes)
    if (this.announceChanges() && Math.abs(clampedValue - previousValue) >= 1) {
      const labelName = this.label() || (this.channelNumber() ? `Channel ${this.channelNumber()}` : 'Fader');
      this.a11y.announceValueChange(labelName, `${clampedValue.toFixed(1)}`, 'dB');
    }
  }

  protected resetToDefault(): void {
    this.setValue(this.defaultValue());
  }

  // ControlValueAccessor
  writeValue(value: number): void {
    this.internalValue.set(value ?? this.defaultValue());
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }
}

