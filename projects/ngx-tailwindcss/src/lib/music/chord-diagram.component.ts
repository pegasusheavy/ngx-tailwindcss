import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChordDiagramVariant = 'default' | 'minimal' | 'detailed' | 'dark';
export type ChordDiagramSize = 'sm' | 'md' | 'lg';

export interface ChordFingering {
  string: number; // 1-6 (1 = high E, 6 = low E)
  fret: number; // 0 = open, -1 = muted, 1+ = fret number
  finger?: number; // 1-4 (index to pinky), 0 = thumb
  barre?: boolean; // Part of a barre chord
}

export interface ChordDefinition {
  name: string; // e.g., "C", "Am", "G7"
  fingerings: ChordFingering[];
  baseFret?: number; // Starting fret position (default 1)
  barreFrom?: number; // String number where barre starts
  barreTo?: number; // String number where barre ends
}

// Common chord definitions
export const COMMON_CHORDS: Record<string, ChordDefinition> = {
  C: {
    name: 'C',
    fingerings: [
      { string: 1, fret: 0 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 0 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
      { string: 6, fret: -1 },
    ],
  },
  G: {
    name: 'G',
    fingerings: [
      { string: 1, fret: 3, finger: 4 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: 3, finger: 2 },
    ],
  },
  D: {
    name: 'D',
    fingerings: [
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: -1 },
      { string: 6, fret: -1 },
    ],
  },
  Am: {
    name: 'Am',
    fingerings: [
      { string: 1, fret: 0 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 },
      { string: 5, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  Em: {
    name: 'Em',
    fingerings: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: 0 },
    ],
  },
  F: {
    name: 'F',
    fingerings: [
      { string: 1, fret: 1, finger: 1, barre: true },
      { string: 2, fret: 1, finger: 1, barre: true },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 3, finger: 4 },
      { string: 5, fret: 3, finger: 3 },
      { string: 6, fret: 1, finger: 1, barre: true },
    ],
    barreFrom: 1,
    barreTo: 6,
  },
};

@Component({
  selector: 'tw-chord-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chord-diagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwChordDiagramComponent {
  // Expose Math for template
  protected readonly Math = Math;

  readonly chord = input<ChordDefinition | string | null>(null);
  readonly customFingerings = input<ChordFingering[]>([]);
  readonly name = input<string>('');
  readonly baseFret = input(1, { transform: numberAttribute });
  readonly fretCount = input(4, { transform: numberAttribute });
  readonly stringCount = input(6, { transform: numberAttribute }); // 6 for guitar, 4 for bass
  readonly variant = input<ChordDiagramVariant>('default');
  readonly size = input<ChordDiagramSize>('md');
  readonly showFingerNumbers = input(true);
  readonly showStringLabels = input(true);
  readonly showChordName = input(true);
  readonly showFretNumber = input(true);
  readonly leftHanded = input(false);
  readonly classOverride = input('');

  protected readonly chordData = computed((): ChordDefinition | null => {
    const chord = this.chord();
    if (!chord) return null;

    if (typeof chord === 'string') {
      return COMMON_CHORDS[chord] || null;
    }

    return chord;
  });

  protected readonly fingerings = computed((): ChordFingering[] => {
    const custom = this.customFingerings();
    if (custom.length > 0) return custom;

    const chordData = this.chordData();
    return chordData?.fingerings || [];
  });

  protected readonly displayName = computed(() => {
    const customName = this.name();
    if (customName) return customName;

    const chordData = this.chordData();
    return chordData?.name || '';
  });

  protected readonly displayBaseFret = computed(() => {
    const chordData = this.chordData();
    return chordData?.baseFret || this.baseFret();
  });

  protected readonly dimensions = computed(() => {
    const size = this.size();
    const frets = this.fretCount();
    const strings = this.stringCount();

    const stringSpacing = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
    const fretSpacing = size === 'sm' ? 16 : size === 'lg' ? 28 : 22;
    const padding = size === 'sm' ? 20 : size === 'lg' ? 35 : 28;
    const nutHeight = 4;
    const fingerRadius = size === 'sm' ? 5 : size === 'lg' ? 9 : 7;

    const width = (strings - 1) * stringSpacing + padding * 2;
    const height = frets * fretSpacing + padding * 2 + (this.showChordName() ? 24 : 0);

    return {
      width,
      height,
      stringSpacing,
      fretSpacing,
      padding,
      nutHeight,
      fingerRadius,
      gridLeft: padding,
      gridTop: padding + (this.showChordName() ? 24 : 0),
    };
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'dark':
        return {
          background: '#1E293B',
          string: '#94A3B8',
          fret: '#64748B',
          nut: '#F8FAFC',
          finger: '#3B82F6',
          fingerText: '#FFFFFF',
          text: '#F8FAFC',
          muted: '#EF4444',
          open: '#22C55E',
        };
      case 'minimal':
        return {
          background: 'transparent',
          string: '#94A3B8',
          fret: '#CBD5E1',
          nut: '#334155',
          finger: '#334155',
          fingerText: '#FFFFFF',
          text: '#334155',
          muted: '#EF4444',
          open: '#22C55E',
        };
      case 'detailed':
        return {
          background: '#FEF3C7',
          string: '#92400E',
          fret: '#B45309',
          nut: '#1F2937',
          finger: '#1F2937',
          fingerText: '#FFFFFF',
          text: '#1F2937',
          muted: '#DC2626',
          open: '#059669',
        };
      default:
        return {
          background: '#FFFFFF',
          string: '#334155',
          fret: '#64748B',
          nut: '#1E293B',
          finger: '#1E293B',
          fingerText: '#FFFFFF',
          text: '#1E293B',
          muted: '#EF4444',
          open: '#22C55E',
        };
    }
  });

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-lg';
    const variantClasses: Record<ChordDiagramVariant, string> = {
      default: 'bg-white border border-slate-200 shadow-sm',
      dark: 'bg-slate-800 border border-slate-700',
      minimal: 'bg-transparent',
      detailed: 'bg-amber-50 border border-amber-200',
    };
    return [base, variantClasses[this.variant()], this.classOverride()].filter(Boolean).join(' ');
  });

  protected getStringX(stringNum: number): number {
    const { gridLeft, stringSpacing } = this.dimensions();
    const strings = this.stringCount();
    const leftHanded = this.leftHanded();

    // String 1 is high E (rightmost for right-handed)
    const adjustedString = leftHanded ? stringNum : strings - stringNum + 1;
    return gridLeft + (adjustedString - 1) * stringSpacing;
  }

  protected getFretY(fretNum: number): number {
    const { gridTop, fretSpacing, nutHeight } = this.dimensions();
    return gridTop + nutHeight + fretNum * fretSpacing;
  }

  protected getFingerPosition(fingering: ChordFingering): { x: number; y: number } | null {
    if (fingering.fret <= 0) return null;

    const x = this.getStringX(fingering.string);
    const y = this.getFretY(fingering.fret) - this.dimensions().fretSpacing / 2;

    return { x, y };
  }

  protected getOpenMutedY(): number {
    return this.dimensions().gridTop - 8;
  }

  protected getBarreData(): { x1: number; x2: number; y: number } | null {
    const chordData = this.chordData();
    if (!chordData?.barreFrom || !chordData?.barreTo) return null;

    const fingerings = this.fingerings();
    const barreFret = fingerings.find(f => f.barre)?.fret;
    if (!barreFret) return null;

    return {
      x1: this.getStringX(chordData.barreFrom),
      x2: this.getStringX(chordData.barreTo),
      y: this.getFretY(barreFret) - this.dimensions().fretSpacing / 2,
    };
  }

  protected readonly strings = computed(() => {
    return Array.from({ length: this.stringCount() }, (_, i) => i + 1);
  });

  protected readonly frets = computed(() => {
    return Array.from({ length: this.fretCount() }, (_, i) => i + 1);
  });

  protected readonly stringLabels = computed(() => {
    const count = this.stringCount();
    if (count === 6) {
      return this.leftHanded() ? ['E', 'B', 'G', 'D', 'A', 'E'] : ['E', 'A', 'D', 'G', 'B', 'E'];
    }
    if (count === 4) {
      return this.leftHanded() ? ['G', 'D', 'A', 'E'] : ['E', 'A', 'D', 'G'];
    }
    return [];
  });
}
