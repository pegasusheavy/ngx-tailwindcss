import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'thirtysecond';
export type NoteAccidental = 'sharp' | 'flat' | 'natural' | 'doubleSharp' | 'doubleFlat' | null;
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type StemDirection = 'up' | 'down' | 'auto';
export type BeamPosition = 'start' | 'middle' | 'end' | 'single' | null;
export type TupletPosition = 'start' | 'middle' | 'end' | null;

export interface TupletConfig {
  ratio: [number, number]; // e.g., [3, 2] for triplet (3 notes in time of 2)
  position: TupletPosition;
  showBracket?: boolean;
  showNumber?: boolean;
  bracketDirection?: 'up' | 'down' | 'auto';
}

export interface BeamConfig {
  position: BeamPosition;
  beamY: number; // Y position of the primary beam
  beamAngle?: number; // Angle in degrees for slanted beams
  beamLevels?: number; // Number of beam levels (1 for 8th, 2 for 16th, etc.)
  breakSecondary?: boolean; // Break secondary beams for rhythmic clarity
}

export interface NoteData {
  name: NoteName;
  octave: number;
  duration: NoteDuration;
  accidental?: NoteAccidental;
  dotted?: boolean;
  doubleDotted?: boolean;
  tied?: boolean;
  stemDirection?: StemDirection;
  tuplet?: TupletConfig;
  beam?: BeamConfig;
}

// Unicode musical symbols
const NOTE_SYMBOLS = {
  whole: '𝅝',
  half: '𝅗𝅥',
  quarter: '𝅘𝅥',
  eighth: '𝅘𝅥𝅮',
  sixteenth: '𝅘𝅥𝅯',
  thirtysecond: '𝅘𝅥𝅰',
};

const REST_SYMBOLS = {
  whole: '𝄻',
  half: '𝄼',
  quarter: '𝄽',
  eighth: '𝄾',
  sixteenth: '𝄿',
  thirtysecond: '𝅀',
};

const ACCIDENTAL_SYMBOLS = {
  sharp: '♯',
  flat: '♭',
  natural: '♮',
  doubleSharp: '𝄪',
  doubleFlat: '𝄫',
};

// Staff line positions (0 = middle C on treble staff)
// Treble: E4=0, F4=0.5, G4=1, A4=1.5, B4=2, C5=2.5, D5=3, E5=3.5, F5=4
const NOTE_POSITIONS: Record<NoteName, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

@Component({
  selector: 'tw-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwNoteComponent {
  // Note properties
  readonly name = input<NoteName>('C');
  readonly octave = input(4, { transform: numberAttribute });
  readonly duration = input<NoteDuration>('quarter');
  readonly accidental = input<NoteAccidental>(null);
  readonly dotted = input(false);
  readonly doubleDotted = input(false);
  readonly isRest = input(false);

  // Display options
  readonly stemDirection = input<StemDirection>('auto');
  readonly beamed = input(false); // Part of a beamed group
  readonly beamPosition = input<BeamPosition>(null);
  readonly beamConfig = input<BeamConfig | null>(null);
  readonly tied = input(false);
  readonly tieDirection = input<'start' | 'end' | null>(null);
  readonly highlighted = input(false);
  readonly color = input<string>('#1E293B');
  readonly highlightColor = input<string>('#3B82F6');
  readonly size = input(24, { transform: numberAttribute }); // Note head size
  readonly lineSpacing = input(10, { transform: numberAttribute });

  // Tuplet options
  readonly tuplet = input<TupletConfig | null>(null);
  readonly tupletNumber = input<number | null>(null); // Shorthand for simple tuplets (3 = triplet)

  // Position (usually set by parent staff/measure)
  readonly x = input(0, { transform: numberAttribute });
  readonly staffTop = input(40, { transform: numberAttribute }); // Y position of top staff line

  readonly classOverride = input('');

  protected readonly noteSymbol = computed(() => {
    if (this.isRest()) {
      return REST_SYMBOLS[this.duration()];
    }
    return NOTE_SYMBOLS[this.duration()];
  });

  protected readonly accidentalSymbol = computed(() => {
    const acc = this.accidental();
    if (!acc) return null;
    return ACCIDENTAL_SYMBOLS[acc];
  });

  // Calculate Y position based on note name and octave
  protected readonly yPosition = computed(() => {
    const name = this.name();
    const octave = this.octave();
    const staffTop = this.staffTop();
    const spacing = this.lineSpacing();

    // Middle C (C4) is at position -2 below the treble staff (ledger line)
    // E4 is on the bottom line of treble staff (position 0)
    const basePosition = NOTE_POSITIONS[name];
    const octaveOffset = (octave - 4) * 7; // 7 positions per octave

    // Position 0 = E4 (bottom line), positive = up, negative = down
    // Treble staff: E4=0, G4=2, B4=4 (lines), F4=1, A4=3, C5=5, D5=6, E5=7 (top line)
    const position = basePosition + octaveOffset - 2; // Adjust so E4 = 0

    // Y increases downward, so higher positions = lower Y
    return staffTop + (4 - position / 2) * spacing;
  });

  protected readonly computedStemDirection = computed(() => {
    const direction = this.stemDirection();
    if (direction !== 'auto') return direction;

    // Auto: stem up if note is below middle line (B4), down if above
    const y = this.yPosition();
    const staffTop = this.staffTop();
    const spacing = this.lineSpacing();
    const middleLineY = staffTop + spacing * 2; // Middle line of staff

    return y > middleLineY ? 'up' : 'down';
  });

  protected readonly needsLedgerLines = computed(() => {
    const y = this.yPosition();
    const staffTop = this.staffTop();
    const spacing = this.lineSpacing();
    const bottomLine = staffTop + spacing * 4;

    const lines: number[] = [];

    // Lines above staff
    if (y < staffTop - spacing) {
      for (let lineY = staffTop - spacing; lineY >= y; lineY -= spacing) {
        lines.push(lineY);
      }
    }

    // Lines below staff
    if (y > bottomLine + spacing) {
      for (let lineY = bottomLine + spacing; lineY <= y; lineY += spacing) {
        lines.push(lineY);
      }
    }

    // Line at middle C (between staffs)
    if (
      y >= bottomLine &&
      y <= bottomLine + spacing &&
      Math.abs(y - bottomLine - spacing / 2) < 2
    ) {
      lines.push(bottomLine + spacing);
    }

    return lines;
  });

  protected readonly stemLength = computed(() => {
    const duration = this.duration();
    const spacing = this.lineSpacing();

    // Whole notes have no stem
    if (duration === 'whole') return 0;

    return spacing * 3.5;
  });

  protected readonly stemX = computed(() => {
    const x = this.x();
    const size = this.size();
    const direction = this.computedStemDirection();

    // Stem is on right side for up, left side for down
    return direction === 'up' ? x + size * 0.4 : x - size * 0.4;
  });

  protected readonly stemY1 = computed(() => {
    const y = this.yPosition();
    return y;
  });

  protected readonly stemY2 = computed(() => {
    const y = this.yPosition();
    const length = this.stemLength();
    const direction = this.computedStemDirection();

    return direction === 'up' ? y - length : y + length;
  });

  protected readonly flagCount = computed(() => {
    const duration = this.duration();
    switch (duration) {
      case 'eighth':
        return 1;
      case 'sixteenth':
        return 2;
      case 'thirtysecond':
        return 3;
      default:
        return 0;
    }
  });

  protected readonly noteColor = computed(() => {
    return this.highlighted() ? this.highlightColor() : this.color();
  });

  protected readonly noteHeadFill = computed(() => {
    const duration = this.duration();
    // Whole and half notes have hollow note heads
    if (duration === 'whole' || duration === 'half') {
      return 'none';
    }
    return this.noteColor();
  });

  protected readonly containerClasses = computed(() => {
    const base = 'relative';
    return [base, this.classOverride()].filter(Boolean).join(' ');
  });

  // Helper to get dot positions
  protected readonly dotPositions = computed(() => {
    const dots: number[] = [];
    const x = this.x();
    const size = this.size();

    if (this.dotted()) {
      dots.push(x + size * 0.7);
    }
    if (this.doubleDotted()) {
      dots.push(x + size * 0.7);
      dots.push(x + size * 1.0);
    }
    return dots;
  });

  // Tuplet computed values
  protected readonly effectiveTuplet = computed((): TupletConfig | null => {
    const tupletConfig = this.tuplet();
    if (tupletConfig) return tupletConfig;

    // Handle shorthand tupletNumber
    const num = this.tupletNumber();
    if (num) {
      return {
        ratio: [num, num === 3 ? 2 : num - 1] as [number, number], // 3:2 for triplet, etc.
        position: 'middle',
        showBracket: true,
        showNumber: true,
        bracketDirection: 'auto',
      };
    }

    return null;
  });

  protected readonly tupletBracketDirection = computed(() => {
    const tuplet = this.effectiveTuplet();
    if (!tuplet) return 'up';

    if (tuplet.bracketDirection && tuplet.bracketDirection !== 'auto') {
      return tuplet.bracketDirection;
    }

    // Auto: opposite of stem direction
    return this.computedStemDirection() === 'up' ? 'down' : 'up';
  });

  protected readonly tupletBracketY = computed(() => {
    const direction = this.tupletBracketDirection();
    const stemY2 = this.stemY2();
    const y = this.yPosition();
    const size = this.size();

    if (direction === 'up') {
      return Math.min(stemY2, y) - size * 1.2;
    } else {
      return Math.max(stemY2, y) + size * 1.2;
    }
  });

  // Beam computed values
  protected readonly effectiveBeamConfig = computed((): BeamConfig | null => {
    const config = this.beamConfig();
    if (config) return config;

    // Create default config from beamPosition
    const position = this.beamPosition();
    if (!position || !this.beamed()) return null;

    return {
      position,
      beamY: this.stemY2(),
      beamAngle: 0,
      beamLevels: this.getBeamLevels(),
      breakSecondary: false,
    };
  });

  protected readonly beamLevels = computed(() => {
    const config = this.effectiveBeamConfig();
    if (config?.beamLevels !== undefined) return config.beamLevels;
    return this.getBeamLevels();
  });

  private getBeamLevels(): number {
    const duration = this.duration();
    switch (duration) {
      case 'eighth':
        return 1;
      case 'sixteenth':
        return 2;
      case 'thirtysecond':
        return 3;
      default:
        return 0;
    }
  }

  protected readonly beamY = computed(() => {
    const config = this.effectiveBeamConfig();
    return config?.beamY ?? this.stemY2();
  });

  // Generate beam paths for this note
  protected readonly beamPaths = computed(() => {
    const config = this.effectiveBeamConfig();
    if (!config || !this.beamed()) return [];

    const paths: { d: string; level: number }[] = [];
    const x = this.stemX();
    const beamY = this.beamY();
    const size = this.size();
    const levels = this.beamLevels();
    const direction = this.computedStemDirection();
    const position = config.position;

    // Beam thickness and spacing
    const beamThickness = size * 0.25;
    const beamSpacing = size * 0.35;

    for (let level = 0; level < levels; level++) {
      const yOffset = direction === 'up' ? level * beamSpacing : -level * beamSpacing;

      const y = beamY + yOffset;

      // Determine beam extension based on position
      let beamPath = '';
      const beamLength = size * 1.5; // Length to next note

      switch (position) {
        case 'start':
          // Beam extends to the right
          beamPath = `M ${x} ${y} h ${beamLength} v ${beamThickness} h -${beamLength} Z`;
          break;
        case 'middle':
          // Beam extends both directions (connects to neighbors)
          beamPath = `M ${x - beamLength / 2} ${y} h ${beamLength} v ${beamThickness} h -${beamLength} Z`;
          break;
        case 'end':
          // Beam extends to the left
          beamPath = `M ${x - beamLength} ${y} h ${beamLength} v ${beamThickness} h -${beamLength} Z`;
          break;
        case 'single':
          // Partial beam (for single note in mixed group)
          const partialLength = size * 0.8;
          beamPath = `M ${x} ${y} h ${partialLength} v ${beamThickness} h -${partialLength} Z`;
          break;
      }

      if (beamPath) {
        paths.push({ d: beamPath, level });
      }
    }

    return paths;
  });

  // Check if this note should show tuplet bracket start
  protected readonly showTupletBracketStart = computed(() => {
    const tuplet = this.effectiveTuplet();
    return tuplet?.position === 'start' && tuplet?.showBracket !== false;
  });

  // Check if this note should show tuplet number
  protected readonly showTupletNumber = computed(() => {
    const tuplet = this.effectiveTuplet();
    if (!tuplet || tuplet.showNumber === false) return false;

    // Show number at the middle of the tuplet group, or on single notes
    return tuplet.position === 'middle' || tuplet.position === 'start';
  });

  protected readonly tupletDisplayNumber = computed(() => {
    const tuplet = this.effectiveTuplet();
    return tuplet?.ratio[0] ?? 3;
  });
}
