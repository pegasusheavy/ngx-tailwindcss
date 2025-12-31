import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ==================== TYPES ====================

export type DynamicType =
  | 'ppp'
  | 'pp'
  | 'p'
  | 'mp'
  | 'mf'
  | 'f'
  | 'ff'
  | 'fff'
  | 'sfz'
  | 'sfp'
  | 'fp'
  | 'rf'
  | 'rfz'
  | 'fz';

export type ArticulationType =
  | 'staccato'
  | 'staccatissimo'
  | 'accent'
  | 'marcato'
  | 'tenuto'
  | 'fermata'
  | 'breath'
  | 'caesura';

export type OrnamentType =
  | 'trill'
  | 'mordent'
  | 'invertedMordent'
  | 'turn'
  | 'invertedTurn'
  | 'shake'
  | 'graceNote'
  | 'appoggiatura'
  | 'acciaccatura';

export type RepeatType =
  | 'repeatStart'
  | 'repeatEnd'
  | 'repeatBoth'
  | 'coda'
  | 'segno'
  | 'daCoda'
  | 'dalSegno'
  | 'daCapo'
  | 'fine'
  | 'toCoda';

export type HairpinType = 'crescendo' | 'decrescendo' | 'diminuendo';

export type PedalType = 'pedalDown' | 'pedalUp' | 'pedalSustain' | 'pedalLine';

export type TempoType =
  | 'largo'
  | 'larghetto'
  | 'adagio'
  | 'andante'
  | 'andantino'
  | 'moderato'
  | 'allegretto'
  | 'allegro'
  | 'vivace'
  | 'presto'
  | 'prestissimo'
  | 'accelerando'
  | 'ritardando'
  | 'rallentando'
  | 'aTempo'
  | 'rubato';

export type SymbolCategory =
  | 'dynamic'
  | 'articulation'
  | 'ornament'
  | 'repeat'
  | 'hairpin'
  | 'pedal'
  | 'tempo'
  | 'slur'
  | 'phrase';

export interface SlurPoints {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction?: 'up' | 'down' | 'auto';
  curvature?: number; // 0-1, how curved the slur is
}

// ==================== SYMBOL DATA ====================

const DYNAMIC_SYMBOLS: Record<DynamicType, string> = {
  ppp: '𝆏𝆏𝆏',
  pp: '𝆏𝆏',
  p: '𝆏',
  mp: '𝆐𝆏',
  mf: '𝆐𝆑',
  f: '𝆑',
  ff: '𝆑𝆑',
  fff: '𝆑𝆑𝆑',
  sfz: 'sfz',
  sfp: 'sfp',
  fp: 'fp',
  rf: 'rf',
  rfz: 'rfz',
  fz: 'fz',
};

const ARTICULATION_SYMBOLS: Record<
  ArticulationType,
  { symbol: string; isPath?: boolean; path?: string }
> = {
  staccato: { symbol: '•' },
  staccatissimo: { symbol: '▾' },
  accent: { symbol: '>' },
  marcato: { symbol: '^' },
  tenuto: { symbol: '–' },
  fermata: { symbol: '𝄐' },
  breath: { symbol: ',' },
  caesura: { symbol: '//' },
};

const ORNAMENT_SYMBOLS: Record<OrnamentType, { symbol: string; text?: string }> = {
  trill: { symbol: 'tr', text: 'tr' },
  mordent: { symbol: '𝆖' },
  invertedMordent: { symbol: '𝆗' },
  turn: { symbol: '𝆗' },
  invertedTurn: { symbol: '𝆘' },
  shake: { symbol: '~' },
  graceNote: { symbol: '♪' },
  appoggiatura: { symbol: '♪' },
  acciaccatura: { symbol: '♪' },
};

const REPEAT_SYMBOLS: Record<RepeatType, { symbol?: string; text?: string }> = {
  repeatStart: { symbol: '𝄆' },
  repeatEnd: { symbol: '𝄇' },
  repeatBoth: { symbol: '𝄇𝄆' },
  coda: { symbol: '𝄌' },
  segno: { symbol: '𝄋' },
  daCoda: { text: 'D.C. al Coda' },
  dalSegno: { text: 'D.S.' },
  daCapo: { text: 'D.C.' },
  fine: { text: 'Fine' },
  toCoda: { text: 'To Coda' },
};

const TEMPO_MARKINGS: Record<TempoType, { text: string; bpmRange?: [number, number] }> = {
  largo: { text: 'Largo', bpmRange: [40, 60] },
  larghetto: { text: 'Larghetto', bpmRange: [60, 66] },
  adagio: { text: 'Adagio', bpmRange: [66, 76] },
  andante: { text: 'Andante', bpmRange: [76, 108] },
  andantino: { text: 'Andantino', bpmRange: [80, 108] },
  moderato: { text: 'Moderato', bpmRange: [108, 120] },
  allegretto: { text: 'Allegretto', bpmRange: [112, 120] },
  allegro: { text: 'Allegro', bpmRange: [120, 168] },
  vivace: { text: 'Vivace', bpmRange: [168, 176] },
  presto: { text: 'Presto', bpmRange: [168, 200] },
  prestissimo: { text: 'Prestissimo', bpmRange: [200, 240] },
  accelerando: { text: 'accel.' },
  ritardando: { text: 'rit.' },
  rallentando: { text: 'rall.' },
  aTempo: { text: 'a tempo' },
  rubato: { text: 'rubato' },
};

const PEDAL_SYMBOLS: Record<PedalType, { symbol?: string; text?: string }> = {
  pedalDown: { text: 'Ped.' },
  pedalUp: { symbol: '*' },
  pedalSustain: { symbol: '⌐' },
  pedalLine: { symbol: '___' },
};

@Component({
  selector: 'tw-musical-symbol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './musical-symbol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwMusicalSymbolComponent {
  // Symbol type inputs
  readonly category = input<SymbolCategory>('dynamic');
  readonly dynamic = input<DynamicType | null>(null);
  readonly articulation = input<ArticulationType | null>(null);
  readonly ornament = input<OrnamentType | null>(null);
  readonly repeat = input<RepeatType | null>(null);
  readonly hairpin = input<HairpinType | null>(null);
  readonly pedal = input<PedalType | null>(null);
  readonly tempo = input<TempoType | null>(null);

  // Slur/phrase inputs
  readonly slur = input<SlurPoints | null>(null);
  readonly phrase = input<SlurPoints | null>(null);

  // Hairpin dimensions
  readonly hairpinWidth = input(60, { transform: numberAttribute });
  readonly hairpinHeight = input(10, { transform: numberAttribute });

  // Position and styling
  readonly x = input(0, { transform: numberAttribute });
  readonly y = input(0, { transform: numberAttribute });
  readonly size = input(16, { transform: numberAttribute });
  readonly color = input('#1E293B');
  readonly highlighted = input(false);
  readonly highlightColor = input('#3B82F6');

  // Optional custom text (for tempo with BPM)
  readonly customText = input<string | null>(null);
  readonly showBpm = input(false);
  readonly bpm = input<number | null>(null);

  readonly classOverride = input('');

  // Computed values
  protected readonly effectiveColor = computed(() => {
    return this.highlighted() ? this.highlightColor() : this.color();
  });

  protected readonly dynamicData = computed(() => {
    const type = this.dynamic();
    if (!type) return null;
    return {
      symbol: DYNAMIC_SYMBOLS[type],
      isItalic: ['sfz', 'sfp', 'fp', 'rf', 'rfz', 'fz'].includes(type),
    };
  });

  protected readonly articulationData = computed(() => {
    const type = this.articulation();
    if (!type) return null;
    return ARTICULATION_SYMBOLS[type];
  });

  protected readonly ornamentData = computed(() => {
    const type = this.ornament();
    if (!type) return null;
    return ORNAMENT_SYMBOLS[type];
  });

  protected readonly repeatData = computed(() => {
    const type = this.repeat();
    if (!type) return null;
    return REPEAT_SYMBOLS[type];
  });

  protected readonly tempoData = computed(() => {
    const type = this.tempo();
    if (!type) return null;

    const data = TEMPO_MARKINGS[type];
    let text = this.customText() ?? data.text;

    // Add BPM if requested
    if (this.showBpm()) {
      const bpmValue = this.bpm();
      if (bpmValue) {
        text += ` (♩ = ${bpmValue})`;
      } else if (data.bpmRange) {
        text += ` (♩ = ${data.bpmRange[0]}-${data.bpmRange[1]})`;
      }
    }

    return { text, bpmRange: data.bpmRange };
  });

  protected readonly pedalData = computed(() => {
    const type = this.pedal();
    if (!type) return null;
    return PEDAL_SYMBOLS[type];
  });

  protected readonly hairpinPath = computed(() => {
    const type = this.hairpin();
    if (!type) return null;

    const w = this.hairpinWidth();
    const h = this.hairpinHeight();
    const x = this.x();
    const y = this.y();

    if (type === 'crescendo') {
      // Opens to the right: < shape
      return `M ${x} ${y} L ${x + w} ${y - h / 2} M ${x} ${y} L ${x + w} ${y + h / 2}`;
    } else {
      // Diminuendo/decrescendo: opens to the left > shape
      return `M ${x} ${y - h / 2} L ${x + w} ${y} M ${x} ${y + h / 2} L ${x + w} ${y}`;
    }
  });

  protected readonly slurPath = computed(() => {
    const points = this.slur() || this.phrase();
    if (!points) return null;

    return this.calculateSlurPath(points);
  });

  private calculateSlurPath(points: SlurPoints): string {
    const { startX, startY, endX, endY, direction = 'auto', curvature = 0.5 } = points;

    // Determine curve direction
    const midX = (startX + endX) / 2;
    const dist = Math.abs(endX - startX);
    const curveHeight = dist * curvature * 0.3;

    let curveDir = direction;
    if (curveDir === 'auto') {
      curveDir = startY > endY ? 'up' : 'down';
    }

    const curveOffset = curveDir === 'up' ? -curveHeight : curveHeight;

    // Bezier control points
    const cp1X = startX + dist * 0.25;
    const cp1Y = startY + curveOffset;
    const cp2X = endX - dist * 0.25;
    const cp2Y = endY + curveOffset;

    return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  }

  protected readonly containerClasses = computed(() => {
    const base = 'relative';
    return [base, this.classOverride()].filter(Boolean).join(' ');
  });

  // SVG dimensions for container
  protected readonly svgWidth = computed(() => {
    const cat = this.category();
    if (cat === 'hairpin') return this.hairpinWidth() + 20;
    if (cat === 'slur' || cat === 'phrase') {
      const points = this.slur() || this.phrase();
      if (points) {
        return Math.abs(points.endX - points.startX) + 40;
      }
    }
    return this.size() * 4;
  });

  protected readonly svgHeight = computed(() => {
    const cat = this.category();
    if (cat === 'hairpin') return this.hairpinHeight() + 20;
    if (cat === 'slur' || cat === 'phrase') {
      const points = this.slur() || this.phrase();
      if (points) {
        return Math.abs(points.endY - points.startY) + 60;
      }
    }
    return this.size() * 2;
  });

  // Grace note rendering
  protected readonly graceNoteData = computed(() => {
    const orn = this.ornament();
    if (orn !== 'graceNote' && orn !== 'appoggiatura' && orn !== 'acciaccatura') {
      return null;
    }

    return {
      slashed: orn === 'acciaccatura',
      stemmed: true,
      size: this.size() * 0.6,
    };
  });
}
