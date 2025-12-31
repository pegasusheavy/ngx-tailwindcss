import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ClefType = 'treble' | 'bass' | 'alto' | 'tenor' | 'percussion';
export type StaffVariant = 'default' | 'printed' | 'handwritten' | 'minimal';
export type KeySignature =
  | 'C'
  | 'G'
  | 'D'
  | 'A'
  | 'E'
  | 'B'
  | 'F#'
  | 'C#'
  | 'F'
  | 'Bb'
  | 'Eb'
  | 'Ab'
  | 'Db'
  | 'Gb'
  | 'Cb';
export type StaffTimeSignature =
  | '2/4'
  | '3/4'
  | '4/4'
  | '5/4'
  | '6/8'
  | '7/8'
  | '9/8'
  | '12/8'
  | 'C'
  | 'C|';

interface KeySignatureInfo {
  sharps: number;
  flats: number;
  positions: number[]; // Line positions for accidentals
}

const KEY_SIGNATURES: Record<KeySignature, KeySignatureInfo> = {
  C: { sharps: 0, flats: 0, positions: [] },
  G: { sharps: 1, flats: 0, positions: [0] }, // F#
  D: { sharps: 2, flats: 0, positions: [0, 3] }, // F#, C#
  A: { sharps: 3, flats: 0, positions: [0, 3, -1] }, // F#, C#, G#
  E: { sharps: 4, flats: 0, positions: [0, 3, -1, 2] }, // F#, C#, G#, D#
  B: { sharps: 5, flats: 0, positions: [0, 3, -1, 2, 5] }, // F#, C#, G#, D#, A#
  'F#': { sharps: 6, flats: 0, positions: [0, 3, -1, 2, 5, 1] },
  'C#': { sharps: 7, flats: 0, positions: [0, 3, -1, 2, 5, 1, 4] },
  F: { sharps: 0, flats: 1, positions: [4] }, // Bb
  Bb: { sharps: 0, flats: 2, positions: [4, 1] }, // Bb, Eb
  Eb: { sharps: 0, flats: 3, positions: [4, 1, 5] }, // Bb, Eb, Ab
  Ab: { sharps: 0, flats: 4, positions: [4, 1, 5, 2] },
  Db: { sharps: 0, flats: 5, positions: [4, 1, 5, 2, 6] },
  Gb: { sharps: 0, flats: 6, positions: [4, 1, 5, 2, 6, 3] },
  Cb: { sharps: 0, flats: 7, positions: [4, 1, 5, 2, 6, 3, 0] },
};

// SVG paths for musical symbols
const CLEF_PATHS = {
  treble:
    'M16.5 63c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 2.2 1.2 4.2 3 5.2V98c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V68.2c1.8-1 3-3 3-5.2zM10.5 45c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15S10.5 53.3 10.5 45z',
  bass: 'M8 32c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm28-8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 16c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z',
  alto: 'M4 16h8v64H4V16zm16 0h4v64h-4V16z',
  tenor: 'M4 16h8v64H4V16zm16 0h4v64h-4V16z',
  percussion: 'M8 24h8v8H8v-8zm0 24h8v8H8v-8zm16-24h8v8h-8v-8zm0 24h8v8h-8v-8z',
};

@Component({
  selector: 'tw-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwStaffComponent {
  readonly clef = input<ClefType>('treble');
  readonly keySignature = input<KeySignature>('C');
  readonly timeSignature = input<StaffTimeSignature | null>('4/4');
  readonly measures = input(4, { transform: numberAttribute });
  readonly width = input(800, { transform: numberAttribute });
  readonly height = input(120, { transform: numberAttribute });
  readonly lineSpacing = input(10, { transform: numberAttribute }); // Space between staff lines
  readonly variant = input<StaffVariant>('default');
  readonly showClef = input(true);
  readonly showKeySignature = input(true);
  readonly showTimeSignature = input(true);
  readonly showBarLines = input(true);
  readonly showEndBarLine = input(true);
  readonly grandStaff = input(false); // Show treble + bass (piano)
  readonly classOverride = input('');

  // Computed measurements
  protected readonly staffTop = computed(() => {
    const height = this.height();
    const totalStaffHeight = this.lineSpacing() * 4;
    return (height - totalStaffHeight) / 2;
  });

  protected readonly staffLines = computed(() => {
    const top = this.staffTop();
    const spacing = this.lineSpacing();
    return Array.from({ length: 5 }, (_, i) => top + i * spacing);
  });

  protected readonly measureWidth = computed(() => {
    const width = this.width();
    const clefWidth = this.showClef() ? 50 : 0;
    const keyWidth = this.showKeySignature() ? this.keySignatureWidth() : 0;
    const timeWidth = this.showTimeSignature() && this.timeSignature() ? 30 : 0;
    const availableWidth = width - clefWidth - keyWidth - timeWidth - 20; // padding
    return availableWidth / this.measures();
  });

  protected readonly keySignatureWidth = computed(() => {
    const key = this.keySignature();
    const info = KEY_SIGNATURES[key];
    const count = info.sharps || info.flats;
    return count * 12 + 10;
  });

  protected readonly barLinePositions = computed(() => {
    const measures = this.measures();
    const measureW = this.measureWidth();
    const startX = this.contentStartX();
    const positions: number[] = [];

    for (let i = 1; i <= measures; i++) {
      positions.push(startX + i * measureW);
    }

    return positions;
  });

  protected readonly contentStartX = computed(() => {
    let x = 10; // Left padding
    if (this.showClef()) x += 50;
    if (this.showKeySignature()) x += this.keySignatureWidth();
    if (this.showTimeSignature() && this.timeSignature()) x += 30;
    return x;
  });

  protected readonly colors = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'printed':
        return {
          line: '#000000',
          symbol: '#000000',
          background: '#FFFFF8',
        };
      case 'handwritten':
        return {
          line: '#2C3E50',
          symbol: '#1A252F',
          background: '#FDF6E3',
        };
      case 'minimal':
        return {
          line: '#CBD5E1',
          symbol: '#64748B',
          background: 'transparent',
        };
      default:
        return {
          line: '#334155',
          symbol: '#1E293B',
          background: '#FFFFFF',
        };
    }
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const base = 'rounded-lg overflow-hidden';
    const variantClasses: Record<StaffVariant, string> = {
      default: 'bg-white dark:bg-slate-100 shadow-sm border border-slate-200',
      printed: 'bg-[#FFFFF8]',
      handwritten: 'bg-[#FDF6E3] shadow-inner',
      minimal: 'bg-transparent',
    };
    return [base, variantClasses[variant], this.classOverride()].filter(Boolean).join(' ');
  });

  protected readonly clefPath = computed(() => {
    return CLEF_PATHS[this.clef()];
  });

  protected readonly clefViewBox = computed(() => {
    const clef = this.clef();
    switch (clef) {
      case 'treble':
        return '0 0 50 100';
      case 'bass':
        return '0 0 50 60';
      default:
        return '0 0 40 80';
    }
  });

  protected readonly clefSize = computed(() => {
    const clef = this.clef();
    const spacing = this.lineSpacing();
    switch (clef) {
      case 'treble':
        return { width: 35, height: spacing * 7, y: this.staffTop() - spacing * 1.5 };
      case 'bass':
        return { width: 30, height: spacing * 3.5, y: this.staffTop() - spacing * 0.25 };
      default:
        return { width: 25, height: spacing * 4, y: this.staffTop() };
    }
  });

  protected readonly keySignatureAccidentals = computed(() => {
    const key = this.keySignature();
    const info = KEY_SIGNATURES[key];
    const isSharp = info.sharps > 0;
    const count = info.sharps || info.flats;
    const positions = info.positions;
    const startX = this.showClef() ? 55 : 15;
    const spacing = this.lineSpacing();
    const top = this.staffTop();

    return positions.slice(0, count).map((pos, i) => ({
      x: startX + i * 12,
      y: top + pos * (spacing / 2),
      type: isSharp ? 'sharp' : 'flat',
    }));
  });

  protected readonly timeSignaturePosition = computed(() => {
    let x = 15;
    if (this.showClef()) x += 50;
    if (this.showKeySignature()) x += this.keySignatureWidth();
    return x;
  });

  protected getTimeSignatureParts(): { top: string; bottom: string } | null {
    const sig = this.timeSignature();
    if (!sig) return null;

    if (sig === 'C') return { top: 'C', bottom: '' };
    if (sig === 'C|') return { top: 'C|', bottom: '' };

    const [top, bottom] = sig.split('/');
    return { top, bottom };
  }

  protected readonly ledgerLineCount = computed(() => 2); // Lines above/below staff

  // Generate ledger lines for notes outside the staff
  protected getLedgerLines(notePosition: number): number[] {
    const top = this.staffTop();
    const spacing = this.lineSpacing();
    const lines: number[] = [];

    // Positions above staff (negative)
    if (notePosition < 0) {
      for (let i = -2; i >= notePosition; i -= 2) {
        lines.push(top + (i * spacing) / 2);
      }
    }

    // Positions below staff (> 8)
    if (notePosition > 8) {
      for (let i = 10; i <= notePosition; i += 2) {
        lines.push(top + (i * spacing) / 2);
      }
    }

    return lines;
  }
}
