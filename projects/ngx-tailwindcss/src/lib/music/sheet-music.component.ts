import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwStaffComponent, ClefType, KeySignature, StaffTimeSignature } from './staff.component';
import {
  TwNoteComponent,
  NoteData,
  NoteName,
  NoteDuration,
  NoteAccidental,
} from './note.component';

export type SheetMusicVariant = 'default' | 'printed' | 'handwritten' | 'minimal';
export type SheetMusicLayout = 'scroll' | 'pages' | 'single';

export interface MeasureData {
  notes: NoteData[];
  timeSignature?: StaffTimeSignature;
  keySignature?: KeySignature;
  tempo?: number;
  repeatStart?: boolean;
  repeatEnd?: boolean;
  endingNumber?: number;
}

export interface SheetMusicData {
  title?: string;
  composer?: string;
  arranger?: string;
  tempo?: number;
  clef: ClefType;
  keySignature: KeySignature;
  timeSignature: StaffTimeSignature;
  measures: MeasureData[];
  grandStaff?: boolean;
}

// MusicXML to SheetMusicData converter
export function parseMusicXML(xmlString: string): SheetMusicData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('MusicXML parse error:', parseError.textContent);
      return null;
    }

    // Get score-partwise (most common format)
    const scorePartwise = doc.querySelector('score-partwise');
    if (!scorePartwise) {
      console.error('Unsupported MusicXML format - only score-partwise is supported');
      return null;
    }

    // Extract metadata
    const workTitle = doc.querySelector('work work-title')?.textContent || '';
    const movementTitle = doc.querySelector('movement-title')?.textContent || '';
    const creator = doc.querySelector('identification creator[type="composer"]')?.textContent || '';

    // Get the first part (for simplicity)
    const part = doc.querySelector('part');
    if (!part) return null;

    const measures: MeasureData[] = [];
    let currentClef: ClefType = 'treble';
    let currentKey: KeySignature = 'C';
    let currentTime: StaffTimeSignature = '4/4';
    let currentTempo = 120;
    let currentDivisions = 1; // Duration divisions per quarter note

    // Parse all measures
    const measureElements = part.querySelectorAll('measure');
    measureElements.forEach((measureEl, measureIndex) => {
      const notes: NoteData[] = [];

      // Parse attributes (clef, key, time) - usually only in first measure
      const attributes = measureEl.querySelector('attributes');
      if (attributes) {
        // Divisions
        const divisions = attributes.querySelector('divisions');
        if (divisions) {
          currentDivisions = parseInt(divisions.textContent || '1', 10);
        }

        // Clef
        const clef = attributes.querySelector('clef');
        if (clef) {
          const sign = clef.querySelector('sign')?.textContent || 'G';
          const line = clef.querySelector('line')?.textContent || '2';
          if (sign === 'G' && line === '2') currentClef = 'treble';
          else if (sign === 'F' && line === '4') currentClef = 'bass';
          else if (sign === 'C' && line === '3') currentClef = 'alto';
          else if (sign === 'C' && line === '4') currentClef = 'tenor';
        }

        // Key signature
        const key = attributes.querySelector('key');
        if (key) {
          const fifths = parseInt(key.querySelector('fifths')?.textContent || '0', 10);
          const mode = key.querySelector('mode')?.textContent || 'major';
          currentKey = fifthsToKeySignature(fifths, mode);
        }

        // Time signature
        const time = attributes.querySelector('time');
        if (time) {
          const beats = time.querySelector('beats')?.textContent || '4';
          const beatType = time.querySelector('beat-type')?.textContent || '4';
          currentTime = `${beats}/${beatType}` as StaffTimeSignature;
        }
      }

      // Parse direction (tempo)
      const direction = measureEl.querySelector('direction');
      if (direction) {
        const sound = direction.querySelector('sound');
        if (sound) {
          const tempo = sound.getAttribute('tempo');
          if (tempo) currentTempo = parseInt(tempo, 10);
        }
      }

      // Parse notes
      const noteElements = measureEl.querySelectorAll('note');
      noteElements.forEach(noteEl => {
        // Skip rest for now (could add rest support)
        const isRest = noteEl.querySelector('rest') !== null;
        if (isRest) return;

        // Skip chord notes (they're part of previous note)
        const isChord = noteEl.querySelector('chord') !== null;
        if (isChord) return; // Simplified - full implementation would handle chords

        // Pitch
        const pitch = noteEl.querySelector('pitch');
        if (!pitch) return;

        const step = (pitch.querySelector('step')?.textContent as NoteName) || 'C';
        const octave = parseInt(pitch.querySelector('octave')?.textContent || '4', 10);
        const alter = parseInt(pitch.querySelector('alter')?.textContent || '0', 10);

        // Duration
        const durationEl = noteEl.querySelector('duration');
        const duration = durationEl
          ? parseInt(durationEl.textContent || '1', 10)
          : currentDivisions;
        const type = noteEl.querySelector('type')?.textContent || 'quarter';

        // Accidental
        let accidental: NoteAccidental = null;
        if (alter === 1) accidental = 'sharp';
        else if (alter === -1) accidental = 'flat';
        else if (alter === 2) accidental = 'doubleSharp';
        else if (alter === -2) accidental = 'doubleFlat';

        // Check for explicit accidental
        const accidentalEl = noteEl.querySelector('accidental');
        if (accidentalEl) {
          const accText = accidentalEl.textContent;
          if (accText === 'natural') accidental = 'natural';
        }

        // Dotted
        const dotted = noteEl.querySelector('dot') !== null;

        // Tied
        const tieStart = noteEl.querySelector('tie[type="start"]') !== null;

        notes.push({
          name: step,
          octave,
          duration: musicXMLTypeToDuration(type),
          accidental,
          dotted,
          tied: tieStart,
        });
      });

      measures.push({
        notes,
        timeSignature: measureIndex === 0 ? currentTime : undefined,
        keySignature: measureIndex === 0 ? currentKey : undefined,
        tempo: measureIndex === 0 ? currentTempo : undefined,
      });
    });

    return {
      title: workTitle || movementTitle || 'Untitled',
      composer: creator,
      clef: currentClef,
      keySignature: currentKey,
      timeSignature: currentTime,
      tempo: currentTempo,
      measures,
    };
  } catch (error) {
    console.error('Error parsing MusicXML:', error);
    return null;
  }
}

function fifthsToKeySignature(fifths: number, mode: string): KeySignature {
  // Key signatures based on circle of fifths
  // Positive = sharps, Negative = flats
  const majorKeys: Record<number, KeySignature> = {
    [-7]: 'Cb',
    [-6]: 'Gb',
    [-5]: 'Db',
    [-4]: 'Ab',
    [-3]: 'Eb',
    [-2]: 'Bb',
    [-1]: 'F',
    [0]: 'C',
    [1]: 'G',
    [2]: 'D',
    [3]: 'A',
    [4]: 'E',
    [5]: 'B',
    [6]: 'F#',
    [7]: 'C#',
  };
  // Minor keys - map to relative major's key signature
  const minorToMajor: Record<number, KeySignature> = {
    [-7]: 'Cb',
    [-6]: 'Gb',
    [-5]: 'Db',
    [-4]: 'Ab',
    [-3]: 'Eb',
    [-2]: 'Bb',
    [-1]: 'F',
    [0]: 'C',
    [1]: 'G',
    [2]: 'D',
    [3]: 'A',
    [4]: 'E',
    [5]: 'B',
    [6]: 'F#',
    [7]: 'C#',
  };

  // For minor keys, we use the same key signature as the relative major
  // Minor key = major key 3 half-steps up (or same fifths value uses same accidentals)
  const keyMap = mode === 'minor' ? minorToMajor : majorKeys;
  return keyMap[fifths] || 'C';
}

function musicXMLTypeToDuration(type: string): NoteDuration {
  const mapping: Record<string, NoteDuration> = {
    whole: 'whole',
    half: 'half',
    quarter: 'quarter',
    eighth: 'eighth',
    '16th': 'sixteenth',
    '32nd': 'thirtysecond',
  };
  return mapping[type] || 'quarter';
}

// ABC notation parser
export function parseABCNotation(abcString: string): SheetMusicData | null {
  try {
    const lines = abcString.split('\n').map(l => l.trim());
    let title = '';
    let composer = '';
    let tempo = 120;
    let timeSignature: StaffTimeSignature = '4/4';
    let keySignature: KeySignature = 'C';
    let defaultNoteLength = 'eighth'; // L:1/8 is common default
    const measures: MeasureData[] = [];

    // Parse header fields
    for (const line of lines) {
      if (line.startsWith('T:')) {
        title = line.substring(2).trim();
      } else if (line.startsWith('C:')) {
        composer = line.substring(2).trim();
      } else if (line.startsWith('Q:')) {
        // Tempo: Q:1/4=120 or Q:120
        const tempoMatch = line.match(/(\d+)$/);
        if (tempoMatch) tempo = parseInt(tempoMatch[1], 10);
      } else if (line.startsWith('M:')) {
        // Meter/time signature: M:4/4, M:C, M:C|
        const meter = line.substring(2).trim();
        if (meter === 'C') timeSignature = 'C';
        else if (meter === 'C|') timeSignature = 'C|';
        else timeSignature = meter as StaffTimeSignature;
      } else if (line.startsWith('K:')) {
        // Key: K:C, K:G, K:Dm, K:F#m
        const key = line.substring(2).trim();
        keySignature = abcKeyToKeySignature(key);
      } else if (line.startsWith('L:')) {
        // Default note length: L:1/8, L:1/4
        const length = line.substring(2).trim();
        if (length === '1/4') defaultNoteLength = 'quarter';
        else if (length === '1/8') defaultNoteLength = 'eighth';
        else if (length === '1/16') defaultNoteLength = 'sixteenth';
        else if (length === '1/2') defaultNoteLength = 'half';
      }
    }

    // Find music body (after header)
    let musicBody = '';
    let inBody = false;
    for (const line of lines) {
      if (line.startsWith('K:')) {
        inBody = true;
        continue;
      }
      if (inBody && !line.startsWith('%') && line.length > 0) {
        musicBody += line + ' ';
      }
    }

    // Parse music body
    const measureStrings = musicBody.split('|').filter(m => m.trim().length > 0);

    for (const measureStr of measureStrings) {
      const notes: NoteData[] = [];
      const tokens = tokenizeABC(measureStr.trim());

      for (const token of tokens) {
        const noteData = parseABCNote(token, defaultNoteLength as NoteDuration);
        if (noteData) {
          notes.push(noteData);
        }
      }

      if (notes.length > 0) {
        measures.push({ notes });
      }
    }

    return {
      title: title || 'Untitled',
      composer,
      clef: 'treble',
      keySignature,
      timeSignature,
      tempo,
      measures,
    };
  } catch (error) {
    console.error('Error parsing ABC notation:', error);
    return null;
  }
}

function abcKeyToKeySignature(key: string): KeySignature {
  // Remove mode suffixes and extract key
  const keyMatch = key.match(/^([A-G][#b]?)/i);
  if (!keyMatch) return 'C';

  let keyLetter = keyMatch[1];
  // Normalize
  if (keyLetter.includes('#')) keyLetter = keyLetter.replace('#', '#');
  if (keyLetter.includes('b')) keyLetter = keyLetter.replace('b', 'b');

  // Map to KeySignature
  const keyMap: Record<string, KeySignature> = {
    C: 'C',
    G: 'G',
    D: 'D',
    A: 'A',
    E: 'E',
    B: 'B',
    'F#': 'F#',
    'C#': 'C#',
    F: 'F',
    Bb: 'Bb',
    Eb: 'Eb',
    Ab: 'Ab',
    Db: 'Db',
    Gb: 'Gb',
    Cb: 'Cb',
  };

  return keyMap[keyLetter] || 'C';
}

function tokenizeABC(str: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < str.length) {
    const char = str[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Note: [A-Ga-g] with optional modifiers
    if (/[A-Ga-gz]/.test(char)) {
      let token = '';

      // Check for preceding accidental
      if (i > 0 && /[\^_=]/.test(str[i - 1])) {
        // Already captured
      }

      // Accidentals
      if (/[\^_=]/.test(char)) {
        token += char;
        i++;
        if (i < str.length && /[\^_]/.test(str[i])) {
          token += str[i];
          i++;
        }
      }

      // Note letter
      if (i < str.length && /[A-Ga-gz]/.test(str[i])) {
        token += str[i];
        i++;
      }

      // Octave modifiers (commas for lower, apostrophes for higher)
      while (i < str.length && /[',]/.test(str[i])) {
        token += str[i];
        i++;
      }

      // Duration modifier (number or fraction)
      while (i < str.length && /[\d\/]/.test(str[i])) {
        token += str[i];
        i++;
      }

      if (token.length > 0) {
        tokens.push(token);
      }
    } else if (/[\^_=]/.test(char)) {
      // Accidental at start
      let token = char;
      i++;
      if (i < str.length && /[\^_]/.test(str[i])) {
        token += str[i];
        i++;
      }
      if (i < str.length && /[A-Ga-g]/.test(str[i])) {
        token += str[i];
        i++;
        while (i < str.length && /[',]/.test(str[i])) {
          token += str[i];
          i++;
        }
        while (i < str.length && /[\d\/]/.test(str[i])) {
          token += str[i];
          i++;
        }
      }
      tokens.push(token);
    } else {
      i++;
    }
  }

  return tokens;
}

function parseABCNote(token: string, defaultDuration: NoteDuration): NoteData | null {
  // Skip rests
  if (token.includes('z') || token.includes('Z')) return null;

  let accidental: NoteAccidental = null;
  let noteLetter = '';
  let octaveModifier = 0;
  let durationMod = '';

  let i = 0;

  // Parse accidentals
  if (token[i] === '^') {
    accidental = 'sharp';
    i++;
    if (token[i] === '^') {
      accidental = 'doubleSharp';
      i++;
    }
  } else if (token[i] === '_') {
    accidental = 'flat';
    i++;
    if (token[i] === '_') {
      accidental = 'doubleFlat';
      i++;
    }
  } else if (token[i] === '=') {
    accidental = 'natural';
    i++;
  }

  // Parse note letter
  if (i < token.length && /[A-Ga-g]/.test(token[i])) {
    noteLetter = token[i];
    i++;
  } else {
    return null;
  }

  // Parse octave modifiers
  while (i < token.length) {
    if (token[i] === "'") {
      octaveModifier++;
      i++;
    } else if (token[i] === ',') {
      octaveModifier--;
      i++;
    } else {
      break;
    }
  }

  // Parse duration
  while (i < token.length && /[\d\/]/.test(token[i])) {
    durationMod += token[i];
    i++;
  }

  // Determine octave
  // ABC: C D E F G A B = C4 to B4
  // lowercase c d e f g a b = C5 to B5
  const isLowerCase = noteLetter === noteLetter.toLowerCase();
  const baseOctave = isLowerCase ? 5 : 4;
  const octave = baseOctave + octaveModifier;

  // Determine duration
  let duration = defaultDuration;
  if (durationMod) {
    duration = abcDurationToDuration(durationMod, defaultDuration);
  }

  return {
    name: noteLetter.toUpperCase() as NoteName,
    octave,
    duration,
    accidental,
    dotted: false,
  };
}

function abcDurationToDuration(mod: string, defaultDuration: NoteDuration): NoteDuration {
  // Duration modifiers: 2 = double, /2 = half, 3/2 = dotted, etc.
  const durationOrder: NoteDuration[] = [
    'thirtysecond',
    'sixteenth',
    'eighth',
    'quarter',
    'half',
    'whole',
  ];
  const defaultIndex = durationOrder.indexOf(defaultDuration);

  if (mod === '2') {
    return durationOrder[Math.min(defaultIndex + 1, durationOrder.length - 1)];
  } else if (mod === '4') {
    return durationOrder[Math.min(defaultIndex + 2, durationOrder.length - 1)];
  } else if (mod === '/2' || mod === '/') {
    return durationOrder[Math.max(defaultIndex - 1, 0)];
  } else if (mod === '/4') {
    return durationOrder[Math.max(defaultIndex - 2, 0)];
  }

  return defaultDuration;
}

// Sample music for demo
export const SAMPLE_MUSIC: SheetMusicData = {
  title: 'Sample Melody',
  composer: 'Demo',
  clef: 'treble',
  keySignature: 'C',
  timeSignature: '4/4',
  tempo: 120,
  measures: [
    {
      notes: [
        { name: 'C', octave: 4, duration: 'quarter' },
        { name: 'E', octave: 4, duration: 'quarter' },
        { name: 'G', octave: 4, duration: 'quarter' },
        { name: 'C', octave: 5, duration: 'quarter' },
      ],
    },
    {
      notes: [
        { name: 'B', octave: 4, duration: 'half' },
        { name: 'G', octave: 4, duration: 'half' },
      ],
    },
    {
      notes: [
        { name: 'A', octave: 4, duration: 'quarter' },
        { name: 'F', octave: 4, duration: 'quarter' },
        { name: 'D', octave: 4, duration: 'quarter' },
        { name: 'B', octave: 3, duration: 'quarter' },
      ],
    },
    {
      notes: [{ name: 'C', octave: 4, duration: 'whole' }],
    },
  ],
};

@Component({
  selector: 'tw-sheet-music',
  standalone: true,
  imports: [CommonModule, TwStaffComponent, TwNoteComponent],
  templateUrl: './sheet-music.component.html',
  styleUrl: './sheet-music.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwSheetMusicComponent {
  readonly music = input<SheetMusicData | null>(null);
  readonly variant = input<SheetMusicVariant>('default');
  readonly layout = input<SheetMusicLayout>('scroll');
  readonly width = input(800, { transform: numberAttribute });
  readonly staffHeight = input(120, { transform: numberAttribute });
  readonly measuresPerLine = input(4, { transform: numberAttribute });
  readonly lineSpacing = input(10, { transform: numberAttribute });
  readonly showTitle = input(true);
  readonly showComposer = input(true);
  readonly showTempo = input(true);
  readonly showMeasureNumbers = input(true);
  readonly interactive = input(false);
  readonly playbackPosition = input<number | null>(null); // Current playback measure.beat (e.g., 2.5 = measure 2, beat 3)
  readonly highlightedNotes = input<{ measure: number; noteIndex: number }[]>([]);
  readonly classOverride = input('');

  // Import inputs - MusicXML or ABC string
  readonly musicXml = input<string | null>(null);
  readonly abcNotation = input<string | null>(null);

  // Zoom controls
  readonly zoom = input(1, { transform: numberAttribute });
  readonly minZoom = input(0.5, { transform: numberAttribute });
  readonly maxZoom = input(2, { transform: numberAttribute });
  readonly zoomStep = input(0.1, { transform: numberAttribute });
  readonly showZoomControls = input(true);

  // Print styling
  readonly printFriendly = input(false);

  readonly noteClick = output<{ measure: number; noteIndex: number; note: NoteData }>();
  readonly measureClick = output<number>();
  readonly zoomChange = output<number>();
  readonly parseError = output<string>();

  protected readonly currentPage = signal(0);
  protected readonly currentZoom = signal(1);

  // Parse imported notation
  protected readonly parsedMusic = computed(() => {
    const xmlInput = this.musicXml();
    const abcInput = this.abcNotation();

    if (xmlInput) {
      const result = parseMusicXML(xmlInput);
      if (!result) {
        this.parseError.emit('Failed to parse MusicXML');
      }
      return result;
    }

    if (abcInput) {
      const result = parseABCNotation(abcInput);
      if (!result) {
        this.parseError.emit('Failed to parse ABC notation');
      }
      return result;
    }

    return null;
  });

  constructor() {
    // Sync zoom input to signal
    effect(() => {
      this.currentZoom.set(this.zoom());
    });
  }

  protected readonly musicData = computed(() => {
    // Priority: direct music input > parsed MusicXML > parsed ABC > sample
    const directMusic = this.music();
    if (directMusic) return directMusic;

    const parsed = this.parsedMusic();
    if (parsed) return parsed;

    return SAMPLE_MUSIC;
  });

  protected readonly effectiveWidth = computed(() => {
    return this.width() * this.currentZoom();
  });

  protected readonly effectiveStaffHeight = computed(() => {
    return this.staffHeight() * this.currentZoom();
  });

  protected readonly effectiveLineSpacing = computed(() => {
    return this.lineSpacing() * this.currentZoom();
  });

  protected readonly totalLines = computed(() => {
    const measures = this.musicData().measures.length;
    const perLine = this.measuresPerLine();
    return Math.ceil(measures / perLine);
  });

  protected readonly lines = computed(() => {
    const music = this.musicData();
    const perLine = this.measuresPerLine();
    const lines: MeasureData[][] = [];

    for (let i = 0; i < music.measures.length; i += perLine) {
      lines.push(music.measures.slice(i, i + perLine));
    }

    return lines;
  });

  protected readonly totalHeight = computed(() => {
    const lines = this.totalLines();
    const staffH = this.staffHeight();
    const titleHeight = this.showTitle() && this.musicData().title ? 50 : 0;
    const composerHeight = this.showComposer() && this.musicData().composer ? 24 : 0;
    const lineGap = 40;

    return titleHeight + composerHeight + lines * (staffH + lineGap);
  });

  protected readonly containerClasses = computed(() => {
    const layout = this.layout();
    const isPrint = this.printFriendly();
    const base = isPrint ? 'print-sheet-music' : 'rounded-lg overflow-hidden';

    const layoutClasses: Record<SheetMusicLayout, string> = {
      scroll: 'overflow-x-auto overflow-y-visible',
      pages: 'overflow-hidden',
      single: 'overflow-visible',
    };

    const variantClasses: Record<SheetMusicVariant, string> = {
      default: isPrint
        ? 'bg-white'
        : 'bg-white dark:bg-slate-100 shadow-sm border border-slate-200',
      printed: 'bg-[#FFFFF8] shadow-md print:shadow-none',
      handwritten: 'bg-[#FDF6E3] shadow-inner print:shadow-none',
      minimal: 'bg-transparent',
    };

    const printClasses = isPrint ? 'print:shadow-none print:border-none print:rounded-none' : '';

    return [
      base,
      layoutClasses[layout],
      variantClasses[this.variant()],
      printClasses,
      this.classOverride(),
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly wrapperClasses = computed(() => {
    const isPrint = this.printFriendly();
    return isPrint ? 'sheet-music-wrapper print-mode' : 'sheet-music-wrapper';
  });

  protected readonly titleClasses = computed(() => {
    const variant = this.variant();
    const base = 'text-center font-serif font-bold';
    const size = 'text-2xl';
    const color = variant === 'minimal' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900';
    return [base, size, color].join(' ');
  });

  protected readonly subtitleClasses = computed(() => {
    const variant = this.variant();
    const base = 'text-center font-serif italic';
    const size = 'text-sm';
    const color = variant === 'minimal' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600';
    return [base, size, color].join(' ');
  });

  protected readonly staffVariant = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'printed':
        return 'printed';
      case 'handwritten':
        return 'handwritten';
      case 'minimal':
        return 'minimal';
      default:
        return 'default';
    }
  });

  protected getMeasureStartX(measureIndex: number, lineIndex: number): number {
    const perLine = this.measuresPerLine();
    const measureInLine = measureIndex % perLine;
    const width = this.width();
    const margin = 80; // Space for clef/key/time
    const availableWidth = width - margin - 20;
    const measureWidth = availableWidth / perLine;

    return margin + measureInLine * measureWidth;
  }

  protected getNoteX(
    measureIndex: number,
    noteIndex: number,
    totalNotes: number,
    lineIndex: number
  ): number {
    const measureX = this.getMeasureStartX(measureIndex, lineIndex);
    const perLine = this.measuresPerLine();
    const width = this.width();
    const margin = 80;
    const availableWidth = width - margin - 20;
    const measureWidth = availableWidth / perLine;

    const noteSpacing = measureWidth / (totalNotes + 1);
    return measureX + noteSpacing * (noteIndex + 1);
  }

  protected isNoteHighlighted(measureIndex: number, noteIndex: number): boolean {
    return this.highlightedNotes().some(
      h => h.measure === measureIndex && h.noteIndex === noteIndex
    );
  }

  protected isPlaybackPosition(measureIndex: number): boolean {
    const pos = this.playbackPosition();
    return pos !== null && Math.floor(pos) === measureIndex;
  }

  protected onNoteClick(measureIndex: number, noteIndex: number, note: NoteData): void {
    if (!this.interactive()) return;
    this.noteClick.emit({ measure: measureIndex, noteIndex, note });
  }

  protected onMeasureClick(measureIndex: number): void {
    if (!this.interactive()) return;
    this.measureClick.emit(measureIndex);
  }

  protected getLineY(lineIndex: number): number {
    const titleHeight = this.showTitle() && this.musicData().title ? 50 : 0;
    const composerHeight = this.showComposer() && this.musicData().composer ? 24 : 0;
    const staffH = this.staffHeight();
    const lineGap = 40;

    return titleHeight + composerHeight + lineIndex * (staffH + lineGap);
  }

  protected getMeasureGlobalIndex(lineIndex: number, measureInLineIndex: number): number {
    return lineIndex * this.measuresPerLine() + measureInLineIndex;
  }

  // Pagination for 'pages' layout
  protected nextPage(): void {
    const maxPage = this.totalLines() - 1;
    if (this.currentPage() < maxPage) {
      this.currentPage.update(p => p + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
    }
  }

  // Zoom methods
  protected zoomIn(): void {
    const newZoom = Math.min(this.currentZoom() + this.zoomStep(), this.maxZoom());
    this.currentZoom.set(newZoom);
    this.zoomChange.emit(newZoom);
  }

  protected zoomOut(): void {
    const newZoom = Math.max(this.currentZoom() - this.zoomStep(), this.minZoom());
    this.currentZoom.set(newZoom);
    this.zoomChange.emit(newZoom);
  }

  protected resetZoom(): void {
    this.currentZoom.set(1);
    this.zoomChange.emit(1);
  }

  protected setZoom(zoom: number): void {
    const clampedZoom = Math.max(this.minZoom(), Math.min(this.maxZoom(), zoom));
    this.currentZoom.set(clampedZoom);
    this.zoomChange.emit(clampedZoom);
  }

  // Enhanced playback position calculation
  protected getPlaybackCursorX(measureIndex: number, lineIndex: number): number {
    const pos = this.playbackPosition();
    if (pos === null) return 0;

    const measurePart = Math.floor(pos);
    const beatPart = pos - measurePart;

    if (measurePart !== measureIndex) return 0;

    // Calculate position within measure based on beat fraction
    const measureX = this.getMeasureStartX(measureIndex, lineIndex);
    const perLine = this.measuresPerLine();
    const width = this.effectiveWidth();
    const margin = 80 * this.currentZoom();
    const availableWidth = width - margin - 20;
    const measureWidth = availableWidth / perLine;

    return measureX + beatPart * measureWidth;
  }

  protected getPlaybackLineIndex(measureIndex: number): number {
    return Math.floor(measureIndex / this.measuresPerLine());
  }

  protected isPlaybackInLine(lineIndex: number): boolean {
    const pos = this.playbackPosition();
    if (pos === null) return false;

    const measureIndex = Math.floor(pos);
    const playbackLine = this.getPlaybackLineIndex(measureIndex);
    return playbackLine === lineIndex;
  }

  // Print functionality
  protected print(): void {
    window.print();
  }

  // Import methods for external use
  importMusicXML(xmlString: string): SheetMusicData | null {
    return parseMusicXML(xmlString);
  }

  importABC(abcString: string): SheetMusicData | null {
    return parseABCNotation(abcString);
  }

  // Re-export parsers for external use
  static parseMusicXML = parseMusicXML;
  static parseABCNotation = parseABCNotation;

  protected readonly Math = Math;
}
