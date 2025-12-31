import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GraphicEQVariant = 'default' | 'studio' | 'minimal' | 'neon' | 'light' | 'highContrast';
export type GraphicEQBandCount = 5 | 10 | 15 | 31;

export interface EQBandValue {
  frequency: number;
  gain: number; // -12 to +12 dB typically
}

export interface EQPreset {
  id: string;
  name: string;
  description?: string;
  category?: EQPresetCategory;
  values: Record<number, number>; // frequency -> gain mapping
}

export type EQPresetCategory = 'flat' | 'music' | 'voice' | 'instrument' | 'correction' | 'custom';

// Standard frequency bands
const BAND_FREQUENCIES: Record<GraphicEQBandCount, number[]> = {
  5: [60, 250, 1000, 4000, 16000],
  10: [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
  15: [25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000, 16000],
  31: [
    20, 25, 31, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
    2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
  ],
};

// Built-in EQ presets
export const EQ_PRESETS: EQPreset[] = [
  // Flat
  {
    id: 'flat',
    name: 'Flat',
    description: 'No EQ applied',
    category: 'flat',
    values: {},
  },

  // Music Genre Presets
  {
    id: 'rock',
    name: 'Rock',
    description: 'Punchy midrange, enhanced bass and presence',
    category: 'music',
    values: { 31: 4, 63: 3, 125: 2, 250: 0, 500: -1, 1000: 1, 2000: 3, 4000: 4, 8000: 3, 16000: 2 },
  },
  {
    id: 'pop',
    name: 'Pop',
    description: 'Bright and punchy with clear vocals',
    category: 'music',
    values: { 31: 2, 63: 3, 125: 2, 250: 1, 500: 2, 1000: 3, 2000: 2, 4000: 3, 8000: 4, 16000: 3 },
  },
  {
    id: 'jazz',
    name: 'Jazz',
    description: 'Warm and natural with smooth highs',
    category: 'music',
    values: { 31: 2, 63: 3, 125: 2, 250: 1, 500: 0, 1000: -1, 2000: 0, 4000: 1, 8000: 2, 16000: 2 },
  },
  {
    id: 'classical',
    name: 'Classical',
    description: 'Wide dynamic range, natural balance',
    category: 'music',
    values: { 31: 0, 63: 0, 125: 0, 250: 0, 500: 0, 1000: 0, 2000: 1, 4000: 1, 8000: 2, 16000: 1 },
  },
  {
    id: 'electronic',
    name: 'Electronic',
    description: 'Deep bass, crisp highs',
    category: 'music',
    values: { 31: 5, 63: 4, 125: 3, 250: 1, 500: 0, 1000: 1, 2000: 2, 4000: 3, 8000: 4, 16000: 4 },
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    description: 'Heavy bass, clear mids for vocals',
    category: 'music',
    values: { 31: 6, 63: 5, 125: 4, 250: 2, 500: 1, 1000: 2, 2000: 1, 4000: 2, 8000: 3, 16000: 2 },
  },
  {
    id: 'metal',
    name: 'Metal',
    description: 'Scooped mids, heavy bass and treble',
    category: 'music',
    values: {
      31: 4,
      63: 3,
      125: 2,
      250: -1,
      500: -3,
      1000: -2,
      2000: 0,
      4000: 3,
      8000: 4,
      16000: 3,
    },
  },
  {
    id: 'acoustic',
    name: 'Acoustic',
    description: 'Natural warmth, detailed highs',
    category: 'music',
    values: { 31: 1, 63: 2, 125: 2, 250: 2, 500: 1, 1000: 0, 2000: 1, 4000: 2, 8000: 3, 16000: 2 },
  },
  {
    id: 'rnb',
    name: 'R&B',
    description: 'Smooth bass, warm mids, silky highs',
    category: 'music',
    values: { 31: 4, 63: 4, 125: 3, 250: 2, 500: 1, 1000: 2, 2000: 2, 4000: 2, 8000: 3, 16000: 2 },
  },
  {
    id: 'country',
    name: 'Country',
    description: 'Twangy highs, full low-mids',
    category: 'music',
    values: { 31: 2, 63: 2, 125: 2, 250: 3, 500: 2, 1000: 1, 2000: 2, 4000: 4, 8000: 4, 16000: 3 },
  },

  // Voice Presets
  {
    id: 'voice-clarity',
    name: 'Voice Clarity',
    description: 'Enhanced speech intelligibility',
    category: 'voice',
    values: {
      31: -3,
      63: -2,
      125: -1,
      250: 0,
      500: 2,
      1000: 3,
      2000: 4,
      4000: 3,
      8000: 2,
      16000: 0,
    },
  },
  {
    id: 'podcast',
    name: 'Podcast',
    description: 'Clear voice, reduced rumble',
    category: 'voice',
    values: {
      31: -6,
      63: -4,
      125: -2,
      250: 0,
      500: 1,
      1000: 2,
      2000: 3,
      4000: 2,
      8000: 1,
      16000: 0,
    },
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'Professional radio/TV sound',
    category: 'voice',
    values: {
      31: -4,
      63: -2,
      125: 0,
      250: 1,
      500: 2,
      1000: 3,
      2000: 4,
      4000: 3,
      8000: 2,
      16000: 1,
    },
  },
  {
    id: 'deep-voice',
    name: 'Deep Voice',
    description: 'Enhanced bass for deeper voices',
    category: 'voice',
    values: { 31: 2, 63: 3, 125: 3, 250: 2, 500: 1, 1000: 1, 2000: 2, 4000: 2, 8000: 1, 16000: 0 },
  },

  // Instrument Presets
  {
    id: 'bass-boost',
    name: 'Bass Boost',
    description: 'Enhanced low frequencies',
    category: 'instrument',
    values: { 31: 6, 63: 5, 125: 4, 250: 2, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0, 16000: 0 },
  },
  {
    id: 'treble-boost',
    name: 'Treble Boost',
    description: 'Enhanced high frequencies',
    category: 'instrument',
    values: { 31: 0, 63: 0, 125: 0, 250: 0, 500: 0, 1000: 1, 2000: 2, 4000: 4, 8000: 5, 16000: 6 },
  },
  {
    id: 'mid-scoop',
    name: 'Mid Scoop',
    description: 'Reduced midrange for V-shaped response',
    category: 'instrument',
    values: {
      31: 3,
      63: 2,
      125: 1,
      250: -1,
      500: -3,
      1000: -3,
      2000: -1,
      4000: 1,
      8000: 2,
      16000: 3,
    },
  },
  {
    id: 'vocal-cut',
    name: 'Vocal Cut',
    description: 'Reduced vocal frequencies for karaoke',
    category: 'instrument',
    values: {
      31: 0,
      63: 0,
      125: 0,
      250: -2,
      500: -4,
      1000: -6,
      2000: -4,
      4000: -2,
      8000: 0,
      16000: 0,
    },
  },
  {
    id: 'guitar-presence',
    name: 'Guitar Presence',
    description: 'Enhanced guitar frequencies',
    category: 'instrument',
    values: { 31: 0, 63: 1, 125: 2, 250: 3, 500: 2, 1000: 2, 2000: 3, 4000: 4, 8000: 3, 16000: 1 },
  },
  {
    id: 'drums',
    name: 'Drums',
    description: 'Punchy kick and crisp cymbals',
    category: 'instrument',
    values: { 31: 4, 63: 3, 125: 2, 250: 0, 500: -1, 1000: 0, 2000: 1, 4000: 2, 8000: 4, 16000: 3 },
  },

  // Correction Presets
  {
    id: 'loudness',
    name: 'Loudness',
    description: 'Fletcher-Munson compensation for low volume',
    category: 'correction',
    values: { 31: 6, 63: 5, 125: 3, 250: 1, 500: 0, 1000: 0, 2000: 0, 4000: 1, 8000: 3, 16000: 5 },
  },
  {
    id: 'small-speakers',
    name: 'Small Speakers',
    description: 'Compensation for tiny speakers',
    category: 'correction',
    values: { 31: 5, 63: 4, 125: 3, 250: 2, 500: 1, 1000: 0, 2000: 0, 4000: 1, 8000: 2, 16000: 2 },
  },
  {
    id: 'laptop',
    name: 'Laptop',
    description: 'Optimized for laptop speakers',
    category: 'correction',
    values: { 31: 4, 63: 3, 125: 3, 250: 2, 500: 1, 1000: 0, 2000: 1, 4000: 2, 8000: 2, 16000: 1 },
  },
  {
    id: 'headphones',
    name: 'Headphones',
    description: 'Natural response for headphones',
    category: 'correction',
    values: {
      31: -1,
      63: 0,
      125: 0,
      250: 0,
      500: 0,
      1000: 0,
      2000: -1,
      4000: -1,
      8000: 0,
      16000: 0,
    },
  },
  {
    id: 'hearing-protection',
    name: 'Hearing Protection',
    description: 'Reduced harsh frequencies',
    category: 'correction',
    values: {
      31: 0,
      63: 0,
      125: 0,
      250: 0,
      500: 0,
      1000: 0,
      2000: -2,
      4000: -4,
      8000: -3,
      16000: -2,
    },
  },
];

@Component({
  selector: 'tw-graphic-eq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphic-eq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwGraphicEQComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class TwGraphicEQComponent implements ControlValueAccessor {
  readonly bandCount = input<GraphicEQBandCount>(10);
  readonly minGain = input(-12, { transform: numberAttribute });
  readonly maxGain = input(12, { transform: numberAttribute });
  readonly step = input(0.5, { transform: numberAttribute });
  readonly variant = input<GraphicEQVariant>('default');
  readonly sliderHeight = input(150, { transform: numberAttribute });
  readonly showLabels = input(true);
  readonly showValues = input(false);
  readonly showCurve = input(true);
  readonly showPresets = input(true);
  readonly showPresetDropdown = input(true);
  readonly presetCategories = input<EQPresetCategory[]>([
    'flat',
    'music',
    'voice',
    'instrument',
    'correction',
  ]);
  readonly customPresets = input<EQPreset[]>([]);
  readonly interactive = input(true);
  readonly disabled = input(false);
  readonly classOverride = input('');

  readonly bandChange = output<EQBandValue>();
  readonly valuesChange = output<EQBandValue[]>();
  readonly presetApplied = output<EQPreset>();
  readonly presetSaved = output<EQPreset>();

  protected readonly bandValues = signal<number[]>([]);
  protected readonly draggingBand = signal<number | null>(null);
  protected readonly currentPreset = signal<EQPreset | null>(null);
  protected readonly showPresetMenu = signal(false);
  protected readonly presetSearchQuery = signal('');

  // Expose presets to template
  protected readonly EQ_PRESETS = EQ_PRESETS;

  private onChange: (value: EQBandValue[]) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly frequencies = computed(() => {
    return BAND_FREQUENCIES[this.bandCount()];
  });

  // Available presets based on enabled categories
  protected readonly availablePresets = computed(() => {
    const categories = this.presetCategories();
    const builtIn = EQ_PRESETS.filter(p => p.category && categories.includes(p.category));
    const custom = this.customPresets().filter(
      p => !p.category || categories.includes(p.category) || categories.includes('custom')
    );
    return [...builtIn, ...custom];
  });

  // Filtered presets based on search query
  protected readonly filteredPresets = computed(() => {
    const query = this.presetSearchQuery().toLowerCase().trim();
    const presets = this.availablePresets();

    if (!query) return presets;

    return presets.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  });

  // Presets grouped by category
  protected readonly presetsByCategory = computed(() => {
    const presets = this.filteredPresets();
    const grouped = new Map<EQPresetCategory, EQPreset[]>();

    for (const preset of presets) {
      const category = preset.category || 'custom';
      const list = grouped.get(category) || [];
      list.push(preset);
      grouped.set(category, list);
    }

    return grouped;
  });

  // Category display names
  protected readonly categoryNames: Record<EQPresetCategory, string> = {
    flat: 'Flat',
    music: 'Music Genres',
    voice: 'Voice & Speech',
    instrument: 'Instruments',
    correction: 'Correction',
    custom: 'Custom',
  };

  protected readonly bands = computed(() => {
    const freqs = this.frequencies();
    const values = this.bandValues();

    return freqs.map((freq, i) => ({
      frequency: freq,
      gain: values[i] ?? 0,
      label: this.formatFrequency(freq),
    }));
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();

    const schemes: Record<
      GraphicEQVariant,
      {
        background: string;
        slider: string;
        fill: string;
        track: string;
        label: string;
        value: string;
        curve: string;
        grid: string;
      }
    > = {
      default: {
        background: 'bg-slate-900',
        slider: 'bg-slate-600',
        fill: 'bg-blue-500',
        track: 'bg-slate-700',
        label: 'text-slate-400',
        value: 'text-slate-300',
        curve: '#3B82F6',
        grid: '#334155',
      },
      studio: {
        background: 'bg-slate-950',
        slider: 'bg-slate-500',
        fill: 'bg-green-500',
        track: 'bg-slate-800',
        label: 'text-slate-500',
        value: 'text-green-400',
        curve: '#22C55E',
        grid: '#1E293B',
      },
      minimal: {
        background: 'bg-white dark:bg-slate-900',
        slider: 'bg-slate-400 dark:bg-slate-500',
        fill: 'bg-slate-700 dark:bg-slate-300',
        track: 'bg-slate-200 dark:bg-slate-700',
        label: 'text-slate-500 dark:text-slate-400',
        value: 'text-slate-700 dark:text-slate-300',
        curve: '#64748B',
        grid: '#E2E8F0',
      },
      neon: {
        background: 'bg-black',
        slider: 'bg-purple-600',
        fill: 'bg-cyan-400',
        track: 'bg-slate-800',
        label: 'text-purple-400',
        value: 'text-cyan-400',
        curve: '#22D3EE',
        grid: '#581C87',
      },
      light: {
        background: 'bg-white',
        slider: 'bg-slate-400',
        fill: 'bg-blue-600',
        track: 'bg-slate-200',
        label: 'text-slate-600',
        value: 'text-slate-800',
        curve: '#2563EB',
        grid: '#E2E8F0',
      },
      highContrast: {
        background: 'bg-black',
        slider: 'bg-white',
        fill: 'bg-yellow-400',
        track: 'bg-gray-800',
        label: 'text-white',
        value: 'text-yellow-400',
        curve: '#FFFF00',
        grid: '#FFFFFF',
      },
    };

    return schemes[variant];
  });

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-xl p-4';
    const disabled = this.disabled() ? 'opacity-50 pointer-events-none' : '';
    return [base, this.colors().background, disabled, this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly curvePath = computed(() => {
    const bands = this.bands();
    const height = this.sliderHeight();
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const bandWidth = 100 / bands.length;

    const points = bands.map((band, i) => {
      const x = (i + 0.5) * bandWidth;
      const normalizedGain = (band.gain - minGain) / (maxGain - minGain);
      const y = (1 - normalizedGain) * height;
      return { x, y };
    });

    // Create smooth curve using bezier
    let path = `M 0 ${height / 2}`;

    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        path += ` L ${points[i].x} ${points[i].y}`;
      } else {
        const prevX = points[i - 1].x;
        const prevY = points[i - 1].y;
        const currX = points[i].x;
        const currY = points[i].y;
        const midX = (prevX + currX) / 2;
        path += ` Q ${prevX + (midX - prevX) * 0.5} ${prevY}, ${midX} ${(prevY + currY) / 2}`;
        path += ` Q ${midX + (currX - midX) * 0.5} ${currY}, ${currX} ${currY}`;
      }
    }

    path += ` L 100 ${height / 2}`;
    return path;
  });

  protected onBandMouseDown(event: MouseEvent, bandIndex: number): void {
    if (!this.interactive() || this.disabled()) return;
    this.draggingBand.set(bandIndex);
    this.updateBandFromEvent(event, bandIndex);

    const onMove = (e: MouseEvent) => {
      if (this.draggingBand() !== null) {
        this.updateBandFromEvent(e, this.draggingBand()!);
      }
    };

    const onUp = () => {
      this.draggingBand.set(null);
      this.onTouched();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    event.preventDefault();
  }

  protected onBandTouchStart(event: TouchEvent, bandIndex: number): void {
    if (!this.interactive() || this.disabled()) return;
    this.draggingBand.set(bandIndex);
    const touch = event.touches[0];
    this.updateBandFromTouch(touch, bandIndex);

    const onMove = (e: TouchEvent) => {
      if (this.draggingBand() !== null && e.touches[0]) {
        this.updateBandFromTouch(e.touches[0], this.draggingBand()!);
      }
    };

    const onEnd = () => {
      this.draggingBand.set(null);
      this.onTouched();
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
    event.preventDefault();
  }

  private updateBandFromEvent(event: MouseEvent, bandIndex: number): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = event.clientY - rect.top;
    this.updateBandValue(bandIndex, y, rect.height);
  }

  private updateBandFromTouch(touch: Touch, bandIndex: number): void {
    const target = document.querySelector(`[data-band="${bandIndex}"]`) as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    this.updateBandValue(bandIndex, y, rect.height);
  }

  private updateBandValue(bandIndex: number, y: number, height: number): void {
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const step = this.step();

    const percentage = 1 - Math.max(0, Math.min(1, y / height));
    let gain = minGain + percentage * (maxGain - minGain);
    gain = Math.round(gain / step) * step;
    gain = Math.max(minGain, Math.min(maxGain, gain));

    this.bandValues.update(values => {
      const newValues = [...values];
      newValues[bandIndex] = gain;
      return newValues;
    });

    const freq = this.frequencies()[bandIndex];
    this.bandChange.emit({ frequency: freq, gain });
    this.emitValues();
  }

  private emitValues(): void {
    const values = this.bands().map(b => ({ frequency: b.frequency, gain: b.gain }));
    this.onChange(values);
    this.valuesChange.emit(values);
  }

  protected resetBand(bandIndex: number): void {
    this.bandValues.update(values => {
      const newValues = [...values];
      newValues[bandIndex] = 0;
      return newValues;
    });
    this.emitValues();
  }

  protected resetAll(): void {
    this.bandValues.set(this.frequencies().map(() => 0));
    this.currentPreset.set(EQ_PRESETS[0]); // Flat preset
    this.emitValues();
  }

  // Preset methods
  applyPreset(preset: EQPreset): void {
    const freqs = this.frequencies();
    const values = freqs.map(freq => {
      // Find closest frequency in preset
      const presetFreqs = Object.keys(preset.values).map(Number);
      if (presetFreqs.length === 0) return 0;

      const closest = presetFreqs.reduce((prev, curr) =>
        Math.abs(curr - freq) < Math.abs(prev - freq) ? curr : prev
      );

      return preset.values[closest] ?? 0;
    });

    this.bandValues.set(values);
    this.currentPreset.set(preset);
    this.showPresetMenu.set(false);
    this.presetApplied.emit(preset);
    this.emitValues();
  }

  saveAsPreset(name: string, description?: string): EQPreset {
    const bands = this.bands();
    const values: Record<number, number> = {};

    for (const band of bands) {
      if (band.gain !== 0) {
        values[band.frequency] = band.gain;
      }
    }

    const preset: EQPreset = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category: 'custom',
      values,
    };

    this.currentPreset.set(preset);
    this.presetSaved.emit(preset);
    return preset;
  }

  getPresetById(id: string): EQPreset | undefined {
    return this.availablePresets().find(p => p.id === id);
  }

  protected togglePresetMenu(): void {
    this.showPresetMenu.update(v => !v);
    if (this.showPresetMenu()) {
      this.presetSearchQuery.set('');
    }
  }

  protected closePresetMenu(): void {
    this.showPresetMenu.set(false);
  }

  protected onPresetSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.presetSearchQuery.set(input.value);
  }

  // Check if current values match a preset
  protected isPresetActive(preset: EQPreset): boolean {
    return this.currentPreset()?.id === preset.id;
  }

  // Get quick presets for button bar (most popular)
  protected readonly quickPresets = computed(() => {
    return ['flat', 'rock', 'pop', 'bass-boost', 'voice-clarity']
      .map(id => this.getPresetById(id))
      .filter((p): p is EQPreset => p !== undefined);
  });

  protected getBandFillHeight(gain: number): string {
    const minGain = this.minGain();
    const maxGain = this.maxGain();
    const height = this.sliderHeight();

    if (gain >= 0) {
      const percentage = gain / maxGain;
      return `${percentage * (height / 2)}px`;
    } else {
      const percentage = Math.abs(gain) / Math.abs(minGain);
      return `${percentage * (height / 2)}px`;
    }
  }

  protected getBandFillPosition(gain: number): string {
    const height = this.sliderHeight();
    if (gain >= 0) {
      return `${height / 2 - (gain / this.maxGain()) * (height / 2)}px`;
    }
    return `${height / 2}px`;
  }

  private formatFrequency(freq: number): string {
    if (freq >= 1000) {
      return `${freq / 1000}k`;
    }
    return `${freq}`;
  }

  // ControlValueAccessor
  writeValue(value: EQBandValue[] | null): void {
    if (value) {
      const gains = this.frequencies().map(freq => {
        const band = value.find(b => b.frequency === freq);
        return band?.gain ?? 0;
      });
      this.bandValues.set(gains);
    } else {
      this.bandValues.set(this.frequencies().map(() => 0));
    }
  }

  registerOnChange(fn: (value: EQBandValue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }
}
