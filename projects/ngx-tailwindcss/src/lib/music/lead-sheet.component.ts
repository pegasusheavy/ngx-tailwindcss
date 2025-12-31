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

import { TwStaffComponent, ClefType, KeySignature, StaffTimeSignature } from './staff.component';
import { TwChordDiagramComponent, ChordDefinition, COMMON_CHORDS } from './chord-diagram.component';

export type LeadSheetVariant = 'default' | 'minimal' | 'printed' | 'dark' | 'fakebook';
export type LeadSheetStyle = 'standard' | 'nashville' | 'roman';
export type LeadSheetDisplayMode = 'chords-only' | 'with-staff' | 'with-diagrams' | 'full';
export type SlashStyle = 'simple' | 'rhythmic' | 'none';

export interface LeadSheetChord {
  chord: string; // "Am7", "G/B", "Cmaj7", etc.
  beat?: number; // Beat position within measure (1-based)
  duration?: number; // Duration in beats
  diagram?: ChordDefinition; // Optional chord diagram data
}

export interface SlashPattern {
  beats: number[]; // Which beats get slashes (1-indexed)
  accents?: number[]; // Which beats are accented
  rests?: number[]; // Which beats are rests
}

export interface LeadSheetMeasure {
  chords: LeadSheetChord[];
  repeatStart?: boolean;
  repeatEnd?: boolean;
  repeatCount?: number;
  coda?: boolean;
  segno?: boolean;
  ending?: number; // 1st ending, 2nd ending, etc.
  slashPattern?: SlashPattern; // Custom slash pattern
  melody?: MelodyNote[]; // Optional melody notes
}

export interface MelodyNote {
  pitch: string; // "C4", "D5", etc.
  duration: number; // In beats
  beat: number; // Starting beat (1-indexed)
}

export interface LeadSheetSection {
  name?: string; // "Verse", "Chorus", "Bridge", etc.
  measures: LeadSheetMeasure[];
  rehearsalMark?: string; // "A", "B", etc.
}

export interface LeadSheetData {
  title?: string;
  subtitle?: string;
  artist?: string;
  composer?: string;
  arranger?: string;
  key?: string;
  tempo?: number;
  tempoDescription?: string; // "Moderately", "Swing", etc.
  timeSignature?: string;
  feel?: string; // "Swing", "Straight", "Shuffle", etc.
  style?: string; // "Jazz", "Pop", "Rock", etc.
  sections: LeadSheetSection[];
  copyright?: string;
}

// Nashville number system mapping
const NASHVILLE_MAP: Record<string, Record<string, string>> = {
  C: { C: '1', Dm: '2m', Em: '3m', F: '4', G: '5', Am: '6m', Bdim: '7°' },
  G: { G: '1', Am: '2m', Bm: '3m', C: '4', D: '5', Em: '6m', 'F#dim': '7°' },
  D: { D: '1', Em: '2m', 'F#m': '3m', G: '4', A: '5', Bm: '6m', 'C#dim': '7°' },
  A: { A: '1', Bm: '2m', 'C#m': '3m', D: '4', E: '5', 'F#m': '6m', 'G#dim': '7°' },
  E: { E: '1', 'F#m': '2m', 'G#m': '3m', A: '4', B: '5', 'C#m': '6m', 'D#dim': '7°' },
  F: { F: '1', Gm: '2m', Am: '3m', Bb: '4', C: '5', Dm: '6m', Edim: '7°' },
  Bb: { Bb: '1', Cm: '2m', Dm: '3m', Eb: '4', F: '5', Gm: '6m', Adim: '7°' },
  Eb: { Eb: '1', Fm: '2m', Gm: '3m', Ab: '4', Bb: '5', Cm: '6m', Ddim: '7°' },
  Ab: { Ab: '1', Bbm: '2m', Cm: '3m', Db: '4', Eb: '5', Fm: '6m', Gdim: '7°' },
  Db: { Db: '1', Ebm: '2m', Fm: '3m', Gb: '4', Ab: '5', Bbm: '6m', Cdim: '7°' },
  B: { B: '1', 'C#m': '2m', 'D#m': '3m', E: '4', 'F#': '5', 'G#m': '6m', 'A#dim': '7°' },
  'F#': { 'F#': '1', 'G#m': '2m', 'A#m': '3m', B: '4', 'C#': '5', 'D#m': '6m', 'E#dim': '7°' },
};

// Common slash patterns
const SLASH_PATTERNS: Record<string, SlashPattern> = {
  '4/4-basic': { beats: [1, 2, 3, 4] },
  '4/4-half': { beats: [1, 3] },
  '4/4-swing': { beats: [1, 2, 3, 4], accents: [1, 3] },
  '3/4-basic': { beats: [1, 2, 3] },
  '3/4-waltz': { beats: [1, 2, 3], accents: [1] },
  '6/8-basic': { beats: [1, 2, 3, 4, 5, 6] },
  '6/8-compound': { beats: [1, 4], accents: [1] },
  '2/4-basic': { beats: [1, 2] },
  'cut-time': { beats: [1, 2] },
};

@Component({
  selector: 'tw-lead-sheet',
  standalone: true,
  imports: [CommonModule, TwStaffComponent, TwChordDiagramComponent],
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
  readonly displayMode = input<LeadSheetDisplayMode>('chords-only');
  readonly slashStyle = input<SlashStyle>('simple');
  readonly measuresPerRow = input(4, { transform: numberAttribute });
  readonly showSectionNames = input(true);
  readonly showMeasureNumbers = input(false);
  readonly showSlashes = input(true); // Show rhythm slashes
  readonly showChordDiagrams = input(false); // Show chord diagrams inline
  readonly showMelodyLine = input(false); // Show melody notes on staff
  readonly showRehearsalMarks = input(true); // Show A, B, C rehearsal marks
  readonly diagramSize = input<'sm' | 'md' | 'lg'>('sm');
  readonly interactive = input(false);
  readonly classOverride = input('');

  // Staff configuration (when displaying with staff)
  readonly staffClef = input<ClefType>('treble');
  readonly staffWidth = input(800, { transform: numberAttribute });
  readonly staffHeight = input(80, { transform: numberAttribute });

  readonly chordClick = output<{ section: number; measure: number; chord: LeadSheetChord }>();
  readonly measureClick = output<{ section: number; measure: number }>();

  // Expanded chord diagram state
  protected readonly expandedDiagram = signal<string | null>(null);

  // Exposed for template
  protected readonly COMMON_CHORDS = COMMON_CHORDS;
  protected readonly SLASH_PATTERNS = SLASH_PATTERNS;

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const base = 'rounded-lg p-6';

    const variantClasses: Record<LeadSheetVariant, string> = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700',
      minimal: 'bg-transparent',
      printed: 'bg-[#FFFFF8] border border-slate-300',
      dark: 'bg-slate-950 border border-slate-800',
      fakebook: 'bg-[#FFF9E6] border border-amber-300 font-serif',
    };

    return [base, variantClasses[variant], this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly textClasses = computed(() => {
    const variant = this.variant();

    const classes: Record<
      LeadSheetVariant,
      { title: string; subtitle: string; chord: string; section: string; rehearsal: string }
    > = {
      default: {
        title: 'text-slate-900 dark:text-white',
        subtitle: 'text-slate-600 dark:text-slate-400',
        chord: 'text-blue-600 dark:text-blue-400',
        section: 'text-slate-700 dark:text-slate-300',
        rehearsal: 'text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700',
      },
      minimal: {
        title: 'text-slate-900 dark:text-white',
        subtitle: 'text-slate-500 dark:text-slate-400',
        chord: 'text-slate-800 dark:text-slate-200',
        section: 'text-slate-600 dark:text-slate-400',
        rehearsal: 'text-slate-800 bg-slate-100',
      },
      printed: {
        title: 'text-black',
        subtitle: 'text-slate-700',
        chord: 'text-black',
        section: 'text-slate-800',
        rehearsal: 'text-black bg-slate-200 border border-black',
      },
      dark: {
        title: 'text-white',
        subtitle: 'text-slate-400',
        chord: 'text-cyan-400',
        section: 'text-slate-300',
        rehearsal: 'text-white bg-slate-700',
      },
      fakebook: {
        title: 'text-black',
        subtitle: 'text-amber-800',
        chord: 'text-black font-bold',
        section: 'text-amber-900 italic',
        rehearsal: 'text-black bg-amber-200 border border-amber-600',
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
      fakebook: 'border-amber-400',
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
      fakebook: 'text-amber-600',
    };

    return classes[variant];
  });

  protected readonly staffLineClasses = computed(() => {
    const variant = this.variant();

    const classes: Record<LeadSheetVariant, string> = {
      default: 'stroke-slate-400 dark:stroke-slate-500',
      minimal: 'stroke-slate-300 dark:stroke-slate-600',
      printed: 'stroke-slate-600',
      dark: 'stroke-slate-500',
      fakebook: 'stroke-amber-700',
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
        '1': 'I',
        '2': 'ii',
        '3': 'iii',
        '4': 'IV',
        '5': 'V',
        '6': 'vi',
        '7': 'vii°',
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
    const hasExplicitBeats = measure.chords.every(c => c.beat !== undefined);
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

  // Get chord diagram for a chord symbol
  protected getChordDiagram(chord: LeadSheetChord): ChordDefinition | null {
    // First check if diagram is explicitly provided
    if (chord.diagram) return chord.diagram;

    // Then look up in common chords
    const baseChord = this.getBaseChord(chord.chord);
    return COMMON_CHORDS[baseChord] || null;
  }

  // Extract base chord (e.g., "Am7" -> "Am", "G/B" -> "G")
  protected getBaseChord(chord: string): string {
    // Handle slash chords
    const slashIndex = chord.indexOf('/');
    const mainChord = slashIndex > 0 ? chord.substring(0, slashIndex) : chord;

    // Remove extensions (7, 9, 11, 13, maj7, sus, etc.)
    return mainChord.replace(/[0-9majsusadd]+$/, '');
  }

  // Get slash pattern for a measure
  protected getSlashPatternForMeasure(measure: LeadSheetMeasure): number[] {
    const slashStyleValue = this.slashStyle();
    if (slashStyleValue === 'none') return [];

    // Use custom pattern if provided
    if (measure.slashPattern) {
      return measure.slashPattern.beats;
    }

    // Use default pattern based on time signature
    const ts = this.data()?.timeSignature || '4/4';
    const patternKey = `${ts}-basic`;
    const pattern = SLASH_PATTERNS[patternKey];

    return pattern?.beats || this.getDefaultSlashBeats();
  }

  // Get accent beats for rhythmic slashes
  protected getAccentBeats(measure: LeadSheetMeasure): number[] {
    if (this.slashStyle() !== 'rhythmic') return [];

    if (measure.slashPattern?.accents) {
      return measure.slashPattern.accents;
    }

    // Default accents on 1 and 3 for 4/4
    const ts = this.data()?.timeSignature || '4/4';
    if (ts === '4/4') return [1, 3];
    if (ts === '3/4') return [1];

    return [1];
  }

  // Check if a beat is a rest
  protected isRestBeat(measure: LeadSheetMeasure, beat: number): boolean {
    return measure.slashPattern?.rests?.includes(beat) ?? false;
  }

  // Get default slash beats
  protected getDefaultSlashBeats(): number[] {
    const ts = this.data()?.timeSignature || '4/4';
    const [beats] = ts.split('/').map(Number);
    return Array.from({ length: beats || 4 }, (_, i) => i + 1);
  }

  // Toggle expanded diagram
  protected toggleDiagram(chordId: string): void {
    if (this.expandedDiagram() === chordId) {
      this.expandedDiagram.set(null);
    } else {
      this.expandedDiagram.set(chordId);
    }
  }

  // Generate chord ID for tracking
  protected getChordId(sectionIndex: number, measureIndex: number, chordIndex: number): string {
    return `chord-${sectionIndex}-${measureIndex}-${chordIndex}`;
  }

  // Check if diagram is expanded
  protected isDiagramExpanded(chordId: string): boolean {
    return this.expandedDiagram() === chordId;
  }

  // Get key signature from data
  protected getKeySignature(): KeySignature {
    const key = this.data()?.key || 'C';
    // Convert key string to KeySignature type
    const validKeys: KeySignature[] = [
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'C#',
      'F',
      'Bb',
      'Eb',
      'Ab',
      'Db',
      'Gb',
      'Cb',
    ];
    return validKeys.includes(key as KeySignature) ? (key as KeySignature) : 'C';
  }

  // Get time signature for staff
  protected getStaffTimeSignature(): StaffTimeSignature {
    const ts = this.data()?.timeSignature || '4/4';
    const validTimeSigs: StaffTimeSignature[] = [
      '2/4',
      '3/4',
      '4/4',
      '5/4',
      '6/8',
      '7/8',
      '9/8',
      '12/8',
      'C',
      'C|',
    ];
    return validTimeSigs.includes(ts as StaffTimeSignature) ? (ts as StaffTimeSignature) : '4/4';
  }

  // Render rhythmic slash with stem
  protected getRhythmicSlashPath(
    beat: number,
    isAccent: boolean,
    measureWidth: number,
    beatsPerMeasure: number
  ): string {
    const x = ((beat - 0.5) / beatsPerMeasure) * measureWidth;
    const y = 30;
    const slashHeight = isAccent ? 16 : 12;
    const stemHeight = 20;

    // Slash head (diamond shape for rhythmic notation)
    const headPath = `M ${x - 4} ${y} L ${x} ${y - slashHeight / 2} L ${x + 4} ${y} L ${x} ${y + slashHeight / 2} Z`;

    // Stem
    const stemPath = `M ${x + 4} ${y} L ${x + 4} ${y - stemHeight}`;

    return `${headPath} ${stemPath}`;
  }
}
