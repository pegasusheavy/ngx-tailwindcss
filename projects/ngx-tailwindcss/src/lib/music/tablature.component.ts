import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TablatureVariant = 'default' | 'minimal' | 'printed' | 'dark';
export type TablatureTechnique = 'hammer' | 'pull' | 'slide' | 'bend' | 'vibrato' | 'tap' | 'harmonic' | 'mute';

export interface TabNote {
  string: number; // 1-6 (1 = high E)
  fret: number | string; // Fret number or 'x' for muted
  duration?: number; // In beats (1 = quarter, 0.5 = eighth, etc.)
  technique?: TablatureTechnique;
  bendTarget?: number; // Target fret for bends
  slideTarget?: number; // Target fret for slides
}

export interface TabMeasure {
  notes: TabNote[][]; // Array of simultaneous notes for each beat position
  timeSignature?: string;
}

const TECHNIQUE_SYMBOLS: Record<TablatureTechnique, string> = {
  hammer: 'h',
  pull: 'p',
  slide: '/',
  bend: 'b',
  vibrato: '~',
  tap: 't',
  harmonic: '*',
  mute: 'x',
};

@Component({
  selector: 'tw-tablature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tablature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwTablatureComponent {
  readonly measures = input<TabMeasure[]>([]);
  readonly stringCount = input(6, { transform: numberAttribute }); // 6 for guitar, 4 for bass
  readonly width = input(800, { transform: numberAttribute });
  readonly variant = input<TablatureVariant>('default');
  readonly showMeasureNumbers = input(true);
  readonly showStringLabels = input(true);
  readonly showBarLines = input(true);
  readonly beatsPerMeasure = input(4, { transform: numberAttribute });
  readonly interactive = input(false);
  readonly classOverride = input('');

  readonly noteClick = output<{ measure: number; beat: number; note: TabNote }>();
  readonly measureClick = output<number>();

  protected readonly stringSpacing = computed(() => {
    const variant = this.variant();
    return variant === 'minimal' ? 14 : 18;
  });

  protected readonly measureWidth = computed(() => {
    const totalWidth = this.width();
    const labelWidth = this.showStringLabels() ? 30 : 0;
    const measures = this.measures();
    if (measures.length === 0) return totalWidth - labelWidth;

    return (totalWidth - labelWidth - 20) / Math.max(1, measures.length);
  });

  protected readonly height = computed(() => {
    const strings = this.stringCount();
    const spacing = this.stringSpacing();
    const padding = 40;
    return (strings - 1) * spacing + padding;
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'dark':
        return {
          background: '#1E293B',
          line: '#475569',
          text: '#F1F5F9',
          note: '#3B82F6',
          technique: '#F59E0B',
          barLine: '#64748B',
        };
      case 'minimal':
        return {
          background: 'transparent',
          line: '#CBD5E1',
          text: '#475569',
          note: '#334155',
          technique: '#6366F1',
          barLine: '#94A3B8',
        };
      case 'printed':
        return {
          background: '#FFFFF8',
          line: '#000000',
          text: '#000000',
          note: '#000000',
          technique: '#000000',
          barLine: '#000000',
        };
      default:
        return {
          background: '#FFFFFF',
          line: '#64748B',
          text: '#1E293B',
          note: '#1E293B',
          technique: '#7C3AED',
          barLine: '#334155',
        };
    }
  });

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-lg overflow-x-auto';
    const variantClasses: Record<TablatureVariant, string> = {
      default: 'bg-white border border-slate-200 shadow-sm',
      dark: 'bg-slate-800 border border-slate-700',
      minimal: 'bg-transparent',
      printed: 'bg-[#FFFFF8] border border-slate-200',
    };
    return [base, variantClasses[this.variant()], this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly stringLabels = computed(() => {
    const count = this.stringCount();
    if (count === 6) return ['e', 'B', 'G', 'D', 'A', 'E'];
    if (count === 4) return ['G', 'D', 'A', 'E'];
    if (count === 5) return ['G', 'D', 'A', 'E', 'B'];
    return Array.from({ length: count }, (_, i) => `${i + 1}`);
  });

  protected readonly strings = computed(() => {
    return Array.from({ length: this.stringCount() }, (_, i) => i + 1);
  });

  protected getStringY(stringNum: number): number {
    const spacing = this.stringSpacing();
    return 20 + (stringNum - 1) * spacing;
  }

  protected getMeasureX(measureIndex: number): number {
    const labelWidth = this.showStringLabels() ? 30 : 0;
    const measureW = this.measureWidth();
    return labelWidth + measureIndex * measureW;
  }

  protected getBeatX(measureIndex: number, beatIndex: number): number {
    const measureX = this.getMeasureX(measureIndex);
    const measureW = this.measureWidth();
    const beats = this.beatsPerMeasure();
    const beatWidth = measureW / (beats + 1);
    return measureX + beatWidth * (beatIndex + 1);
  }

  protected getNoteAtBeat(measure: TabMeasure, beatIndex: number): TabNote[] {
    if (!measure.notes || beatIndex >= measure.notes.length) {
      return [];
    }
    return measure.notes[beatIndex] || [];
  }

  protected getTechniqueSymbol(technique?: TablatureTechnique): string {
    if (!technique) return '';
    return TECHNIQUE_SYMBOLS[technique] || '';
  }

  protected onNoteClick(measureIndex: number, beatIndex: number, note: TabNote): void {
    if (!this.interactive()) return;
    this.noteClick.emit({ measure: measureIndex, beat: beatIndex, note });
  }

  protected onMeasureClick(measureIndex: number): void {
    if (!this.interactive()) return;
    this.measureClick.emit(measureIndex);
  }

  protected readonly beats = computed(() => {
    return Array.from({ length: this.beatsPerMeasure() }, (_, i) => i);
  });
}

