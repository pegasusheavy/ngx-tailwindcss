import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type LeadSheetVariant = 'default' | 'minimal' | 'printed' | 'dark';
export type LeadSheetStyle = 'standard' | 'nashville' | 'roman';

export interface LeadSheetChord {
  chord: string; // "Am7", "G/B", "Cmaj7", etc.
  beat?: number; // Beat position within measure (1-based)
  duration?: number; // Duration in beats
}

export interface LeadSheetMeasure {
  chords: LeadSheetChord[];
  repeatStart?: boolean;
  repeatEnd?: boolean;
  repeatCount?: number;
  coda?: boolean;
  segno?: boolean;
  ending?: number; // 1st ending, 2nd ending, etc.
}

export interface LeadSheetSection {
  name?: string; // "Verse", "Chorus", "Bridge", etc.
  measures: LeadSheetMeasure[];
}

export interface LeadSheetData {
  title?: string;
  artist?: string;
  key?: string;
  tempo?: number;
  timeSignature?: string;
  sections: LeadSheetSection[];
}

// Nashville number system mapping
const NASHVILLE_MAP: Record<string, Record<string, string>> = {
  C: { C: '1', Dm: '2m', Em: '3m', F: '4', G: '5', Am: '6m', Bdim: '7°' },
  G: { G: '1', Am: '2m', Bm: '3m', C: '4', D: '5', Em: '6m', 'F#dim': '7°' },
  D: { D: '1', Em: '2m', 'F#m': '3m', G: '4', A: '5', Bm: '6m', 'C#dim': '7°' },
  A: { A: '1', Bm: '2m', 'C#m': '3m', D: '4', E: '5', 'F#m': '6m', 'G#dim': '7°' },
  E: { E: '1', 'F#m': '2m', 'G#m': '3m', A: '4', B: '5', 'C#m': '6m', 'D#dim': '7°' },
  F: { F: '1', Gm: '2m', Am: '3m', Bb: '4', C: '5', Dm: '6m', Edim: '7°' },
};

@Component({
  selector: 'tw-lead-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwLeadSheetComponent {
  readonly data = input<LeadSheetData | null>(null);
  readonly variant = input<LeadSheetVariant>('default');
  readonly style = input<LeadSheetStyle>('standard');
  readonly measuresPerRow = input(4, { transform: numberAttribute });
  readonly showSectionNames = input(true);
  readonly showMeasureNumbers = input(false);
  readonly showSlashes = input(true); // Show rhythm slashes
  readonly interactive = input(false);
  readonly classOverride = input('');

  readonly chordClick = output<{ section: number; measure: number; chord: LeadSheetChord }>();
  readonly measureClick = output<{ section: number; measure: number }>();

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const base = 'rounded-lg p-6';

    const variantClasses: Record<LeadSheetVariant, string> = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700',
      minimal: 'bg-transparent',
      printed: 'bg-[#FFFFF8] border border-slate-300',
      dark: 'bg-slate-950 border border-slate-800',
    };

    return [base, variantClasses[variant], this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly textClasses = computed(() => {
    const variant = this.variant();

    const classes: Record<LeadSheetVariant, { title: string; subtitle: string; chord: string; section: string }> = {
      default: {
        title: 'text-slate-900 dark:text-white',
        subtitle: 'text-slate-600 dark:text-slate-400',
        chord: 'text-blue-600 dark:text-blue-400',
        section: 'text-slate-700 dark:text-slate-300',
      },
      minimal: {
        title: 'text-slate-900 dark:text-white',
        subtitle: 'text-slate-500 dark:text-slate-400',
        chord: 'text-slate-800 dark:text-slate-200',
        section: 'text-slate-600 dark:text-slate-400',
      },
      printed: {
        title: 'text-black',
        subtitle: 'text-slate-700',
        chord: 'text-black',
        section: 'text-slate-800',
      },
      dark: {
        title: 'text-white',
        subtitle: 'text-slate-400',
        chord: 'text-cyan-400',
        section: 'text-slate-300',
      },
    };

    return classes[variant];
  });

  protected readonly measureClasses = computed(() => {
    const variant = this.variant();
    const base = 'border-r last:border-r-0 px-3 py-4 min-h-[80px] flex flex-col justify-center';

    const borderClasses: Record<LeadSheetVariant, string> = {
      default: 'border-slate-300 dark:border-slate-600',
      minimal: 'border-slate-200 dark:border-slate-700',
      printed: 'border-slate-400',
      dark: 'border-slate-700',
    };

    return [base, borderClasses[variant]].join(' ');
  });

  protected readonly slashClasses = computed(() => {
    const variant = this.variant();

    const classes: Record<LeadSheetVariant, string> = {
      default: 'text-slate-400 dark:text-slate-500',
      minimal: 'text-slate-300 dark:text-slate-600',
      printed: 'text-slate-500',
      dark: 'text-slate-600',
    };

    return classes[variant];
  });

  protected convertChord(chord: string): string {
    const style = this.style();
    const key = this.data()?.key || 'C';

    if (style === 'standard') return chord;

    if (style === 'nashville') {
      const keyMap = NASHVILLE_MAP[key];
      if (keyMap) {
        // Try to find the base chord
        const baseChord = chord.replace(/[0-9maj].*/, '');
        const modifier = chord.replace(baseChord, '');
        const nashville = keyMap[baseChord];
        if (nashville) return nashville + modifier;
      }
      return chord;
    }

    if (style === 'roman') {
      // Roman numeral conversion
      const romanMap: Record<string, string> = {
        '1': 'I', '2': 'ii', '3': 'iii', '4': 'IV', '5': 'V', '6': 'vi', '7': 'vii°',
      };
      const keyMap = NASHVILLE_MAP[key];
      if (keyMap) {
        const baseChord = chord.replace(/[0-9maj].*/, '');
        const modifier = chord.replace(baseChord, '');
        const nashville = keyMap[baseChord];
        if (nashville) {
          const num = nashville.replace(/[m°]/, '');
          const isMinor = nashville.includes('m');
          const isDim = nashville.includes('°');
          const roman = romanMap[num];
          if (roman) {
            const result = isMinor ? roman.toLowerCase() : roman;
            return result + (isDim ? '°' : '') + modifier;
          }
        }
      }
      return chord;
    }

    return chord;
  }

  protected getMeasureRows(section: LeadSheetSection): LeadSheetMeasure[][] {
    const perRow = this.measuresPerRow();
    const rows: LeadSheetMeasure[][] = [];

    for (let i = 0; i < section.measures.length; i += perRow) {
      rows.push(section.measures.slice(i, i + perRow));
    }

    return rows;
  }

  protected getSlashCount(measure: LeadSheetMeasure, beatsPerMeasure: number): number {
    // Calculate how many slashes to show based on chord positions
    if (measure.chords.length === 0) return beatsPerMeasure;

    // If all chords have explicit beats, calculate slashes
    const hasExplicitBeats = measure.chords.every((c) => c.beat !== undefined);
    if (hasExplicitBeats) {
      return beatsPerMeasure;
    }

    // Otherwise, just show chords
    return 0;
  }

  protected getBeatsPerMeasure(): number {
    const ts = this.data()?.timeSignature || '4/4';
    const [beats] = ts.split('/').map(Number);
    return beats || 4;
  }

  protected getMeasureGlobalIndex(sectionIndex: number, measureIndex: number): number {
    let count = 0;
    const sections = this.data()?.sections || [];

    for (let i = 0; i < sectionIndex; i++) {
      count += sections[i].measures.length;
    }

    return count + measureIndex + 1;
  }

  protected onChordClick(sectionIndex: number, measureIndex: number, chord: LeadSheetChord): void {
    if (!this.interactive()) return;
    this.chordClick.emit({ section: sectionIndex, measure: measureIndex, chord });
  }

  protected onMeasureClick(sectionIndex: number, measureIndex: number): void {
    if (!this.interactive()) return;
    this.measureClick.emit({ section: sectionIndex, measure: measureIndex });
  }
}

