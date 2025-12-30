import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TwStaffComponent, ClefType, KeySignature, StaffTimeSignature } from './staff.component';
import { TwNoteComponent, NoteDuration, NoteAccidental, NoteName, NoteData } from './note.component';
import { TwNoteInputComponent, PlacedNote, ClipboardData } from './note-input.component';
import { parseMusicXML, parseABCNotation, SheetMusicData, MeasureData } from './sheet-music.component';

// ==================== TYPES ====================

export type ScoreEditorVariant = 'default' | 'print' | 'minimal';
export type ExportFormat = 'musicxml' | 'midi' | 'pdf' | 'abc';

export interface InstrumentPart {
  id: string;
  name: string;
  abbreviation: string;
  clef: ClefType;
  transposition: number; // Semitones (0 = concert pitch)
  muted: boolean;
  solo: boolean;
  volume: number; // 0-1
  color: string;
  notes: PlacedNote[];
  lyrics: LyricEntry[];
}

export interface LyricEntry {
  id: string;
  text: string;
  measure: number;
  beat: number;
  syllableType: 'single' | 'begin' | 'middle' | 'end';
  verse: number;
}

export interface ScoreData {
  title: string;
  composer: string;
  arranger?: string;
  copyright?: string;
  tempo: number;
  keySignature: KeySignature;
  timeSignature: StaffTimeSignature;
  measures: number;
  parts: InstrumentPart[];
}

export interface HistoryEntry {
  parts: InstrumentPart[];
  timestamp: number;
  action: string;
}

export interface TransposeOptions {
  semitones: number;
  partIds?: string[]; // If not specified, transpose all parts
  preserveEnharmonic?: boolean;
}

// Common instrument presets
export const INSTRUMENT_PRESETS: Record<string, Partial<InstrumentPart>> = {
  'piano-treble': { name: 'Piano', abbreviation: 'Pno.', clef: 'treble', transposition: 0 },
  'piano-bass': { name: 'Piano', abbreviation: 'Pno.', clef: 'bass', transposition: 0 },
  'violin': { name: 'Violin', abbreviation: 'Vln.', clef: 'treble', transposition: 0 },
  'viola': { name: 'Viola', abbreviation: 'Vla.', clef: 'alto', transposition: 0 },
  'cello': { name: 'Cello', abbreviation: 'Vc.', clef: 'bass', transposition: 0 },
  'flute': { name: 'Flute', abbreviation: 'Fl.', clef: 'treble', transposition: 0 },
  'clarinet-bb': { name: 'Clarinet in Bb', abbreviation: 'Cl.', clef: 'treble', transposition: 2 },
  'trumpet-bb': { name: 'Trumpet in Bb', abbreviation: 'Tpt.', clef: 'treble', transposition: 2 },
  'horn-f': { name: 'Horn in F', abbreviation: 'Hn.', clef: 'treble', transposition: 7 },
  'voice-soprano': { name: 'Soprano', abbreviation: 'S.', clef: 'treble', transposition: 0 },
  'voice-alto': { name: 'Alto', abbreviation: 'A.', clef: 'treble', transposition: 0 },
  'voice-tenor': { name: 'Tenor', abbreviation: 'T.', clef: 'treble', transposition: 0 },
  'voice-bass': { name: 'Bass', abbreviation: 'B.', clef: 'bass', transposition: 0 },
  'guitar': { name: 'Guitar', abbreviation: 'Gtr.', clef: 'treble', transposition: 12 },
  'bass-guitar': { name: 'Bass Guitar', abbreviation: 'Bass', clef: 'bass', transposition: 12 },
};

// Note names for transposition
const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const CHROMATIC_TO_NOTE: { note: NoteName; accidental: NoteAccidental }[] = [
  { note: 'C', accidental: null },
  { note: 'C', accidental: 'sharp' },
  { note: 'D', accidental: null },
  { note: 'D', accidental: 'sharp' },
  { note: 'E', accidental: null },
  { note: 'F', accidental: null },
  { note: 'F', accidental: 'sharp' },
  { note: 'G', accidental: null },
  { note: 'G', accidental: 'sharp' },
  { note: 'A', accidental: null },
  { note: 'A', accidental: 'sharp' },
  { note: 'B', accidental: null },
];

const NOTE_TO_CHROMATIC: Record<NoteName, number> = {
  'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11,
};

@Component({
  selector: 'tw-score-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TwStaffComponent, TwNoteComponent, TwNoteInputComponent],
  templateUrl: './score-editor.component.html',
  styleUrl: './score-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwScoreEditorComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef);

  // ==================== INPUTS ====================

  readonly variant = input<ScoreEditorVariant>('default');
  readonly width = input(900, { transform: numberAttribute });
  readonly staffHeight = input(100, { transform: numberAttribute });
  readonly measures = input(4, { transform: numberAttribute });
  readonly lineSpacing = input(10, { transform: numberAttribute });
  readonly editable = input(true);

  // Initial score data
  readonly initialScore = input<ScoreData | null>(null);

  // Import inputs
  readonly musicXml = input<string | null>(null);
  readonly abcNotation = input<string | null>(null);

  // Features toggles
  readonly showToolbar = input(true);
  readonly showPartPanel = input(true);
  readonly showLyricsEditor = input(true);
  readonly enableMidiInput = input(false);
  readonly enableKeyboardShortcuts = input(true);
  readonly maxParts = input(16, { transform: numberAttribute });
  readonly maxUndoHistory = input(50, { transform: numberAttribute });

  // ==================== OUTPUTS ====================

  readonly scoreChanged = output<ScoreData>();
  readonly partAdded = output<InstrumentPart>();
  readonly partRemoved = output<string>();
  readonly exportRequested = output<{ format: ExportFormat; data: string | Blob }>();
  readonly parseError = output<string>();

  // ==================== INTERNAL STATE ====================

  protected readonly title = signal('Untitled Score');
  protected readonly composer = signal('');
  protected readonly tempo = signal(120);
  protected readonly keySignature = signal<KeySignature>('C');
  protected readonly timeSignature = signal<StaffTimeSignature>('4/4');

  protected readonly parts = signal<InstrumentPart[]>([]);
  protected readonly selectedPartId = signal<string | null>(null);
  protected readonly editingLyrics = signal(false);
  protected readonly currentLyricText = signal('');

  // Editing state
  protected readonly currentDuration = signal<NoteDuration>('quarter');
  protected readonly currentAccidental = signal<NoteAccidental>(null);
  protected readonly isDotted = signal(false);
  protected readonly isRest = signal(false);
  protected readonly currentVoice = signal<1 | 2 | 3 | 4>(1);

  // History for undo/redo
  protected readonly undoStack = signal<HistoryEntry[]>([]);
  protected readonly redoStack = signal<HistoryEntry[]>([]);

  // UI state
  protected readonly showPartDialog = signal(false);
  protected readonly showTransposeDialog = signal(false);
  protected readonly showExportDialog = signal(false);
  protected readonly transposeAmount = signal(0);
  protected readonly exportFormat = signal<ExportFormat>('musicxml');

  private partIdCounter = 0;
  private lyricIdCounter = 0;

  // ==================== COMPUTED ====================

  protected readonly selectedPart = computed(() => {
    const id = this.selectedPartId();
    return this.parts().find(p => p.id === id) ?? null;
  });

  protected readonly totalHeight = computed(() => {
    const partCount = this.parts().length;
    const staffH = this.staffHeight();
    const gap = 20;
    return Math.max(200, partCount * (staffH + gap) + 100);
  });

  protected readonly canUndo = computed(() => this.undoStack().length > 0);
  protected readonly canRedo = computed(() => this.redoStack().length > 0);

  protected readonly scoreData = computed<ScoreData>(() => ({
    title: this.title(),
    composer: this.composer(),
    tempo: this.tempo(),
    keySignature: this.keySignature(),
    timeSignature: this.timeSignature(),
    measures: this.measures(),
    parts: this.parts(),
  }));

  // ==================== LIFECYCLE ====================

  constructor() {
    // Initialize with default part or initial score
    const initial = this.initialScore();
    if (initial) {
      this.loadScore(initial);
    } else {
      // Add default piano part
      this.addPart('piano-treble');
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ==================== PART MANAGEMENT ====================

  addPart(preset?: string): void {
    if (this.parts().length >= this.maxParts()) return;

    const presetData = preset ? INSTRUMENT_PRESETS[preset] : {};
    const partId = `part-${this.partIdCounter++}`;

    const newPart: InstrumentPart = {
      id: partId,
      name: presetData.name || 'New Part',
      abbreviation: presetData.abbreviation || 'N.P.',
      clef: presetData.clef || 'treble',
      transposition: presetData.transposition || 0,
      muted: false,
      solo: false,
      volume: 1,
      color: this.getPartColor(this.parts().length),
      notes: [],
      lyrics: [],
    };

    this.saveHistory('Add Part');
    this.parts.update(parts => [...parts, newPart]);
    this.selectedPartId.set(partId);
    this.partAdded.emit(newPart);
    this.emitScoreChanged();
  }

  removePart(partId: string): void {
    if (this.parts().length <= 1) return; // Keep at least one part

    this.saveHistory('Remove Part');
    this.parts.update(parts => parts.filter(p => p.id !== partId));

    if (this.selectedPartId() === partId) {
      const remaining = this.parts();
      this.selectedPartId.set(remaining.length > 0 ? remaining[0].id : null);
    }

    this.partRemoved.emit(partId);
    this.emitScoreChanged();
  }

  updatePart(partId: string, updates: Partial<InstrumentPart>): void {
    this.saveHistory('Update Part');
    this.parts.update(parts =>
      parts.map(p => p.id === partId ? { ...p, ...updates } : p)
    );
    this.emitScoreChanged();
  }

  duplicatePart(partId: string): void {
    const part = this.parts().find(p => p.id === partId);
    if (!part || this.parts().length >= this.maxParts()) return;

    const newPartId = `part-${this.partIdCounter++}`;
    const duplicated: InstrumentPart = {
      ...part,
      id: newPartId,
      name: `${part.name} (Copy)`,
      notes: part.notes.map(n => ({ ...n, id: `note-${Date.now()}-${Math.random()}` })),
      lyrics: part.lyrics.map(l => ({ ...l, id: `lyric-${this.lyricIdCounter++}` })),
      color: this.getPartColor(this.parts().length),
    };

    this.saveHistory('Duplicate Part');
    this.parts.update(parts => [...parts, duplicated]);
    this.selectedPartId.set(newPartId);
    this.partAdded.emit(duplicated);
    this.emitScoreChanged();
  }

  selectPart(partId: string): void {
    this.selectedPartId.set(partId);
  }

  private getPartColor(index: number): string {
    const colors = [
      '#1E293B', '#2563EB', '#059669', '#DC2626',
      '#7C3AED', '#EA580C', '#0891B2', '#4F46E5',
    ];
    return colors[index % colors.length];
  }

  // ==================== PART EXTRACTION ====================

  extractPart(partId: string): SheetMusicData {
    const part = this.parts().find(p => p.id === partId);
    if (!part) {
      throw new Error(`Part ${partId} not found`);
    }

    // Group notes by measure
    const measureMap = new Map<number, NoteData[]>();
    for (const note of part.notes) {
      const measureNotes = measureMap.get(note.measure) || [];
      measureNotes.push({
        name: note.name,
        octave: note.octave,
        duration: note.duration,
        accidental: note.accidental,
        dotted: note.dotted,
        doubleDotted: note.doubleDotted,
        tied: note.tied,
      });
      measureMap.set(note.measure, measureNotes);
    }

    const measures: MeasureData[] = [];
    for (let m = 0; m < this.measures(); m++) {
      measures.push({
        notes: measureMap.get(m) || [],
        timeSignature: m === 0 ? this.timeSignature() : undefined,
        keySignature: m === 0 ? this.keySignature() : undefined,
        tempo: m === 0 ? this.tempo() : undefined,
      });
    }

    return {
      title: `${this.title()} - ${part.name}`,
      composer: this.composer(),
      clef: part.clef,
      keySignature: this.keySignature(),
      timeSignature: this.timeSignature(),
      tempo: this.tempo(),
      measures,
    };
  }

  extractAllParts(): Map<string, SheetMusicData> {
    const extracted = new Map<string, SheetMusicData>();
    for (const part of this.parts()) {
      extracted.set(part.id, this.extractPart(part.id));
    }
    return extracted;
  }

  // ==================== TRANSPOSE ====================

  transpose(options: TransposeOptions): void {
    const { semitones, partIds, preserveEnharmonic = false } = options;
    if (semitones === 0) return;

    this.saveHistory(`Transpose ${semitones > 0 ? '+' : ''}${semitones}`);

    this.parts.update(parts =>
      parts.map(part => {
        if (partIds && !partIds.includes(part.id)) return part;

        const transposedNotes = part.notes.map(note =>
          this.transposeNote(note, semitones, preserveEnharmonic)
        );

        return { ...part, notes: transposedNotes };
      })
    );

    this.emitScoreChanged();
  }

  private transposeNote(note: PlacedNote, semitones: number, preserveEnharmonic: boolean): PlacedNote {
    // Convert note to chromatic position
    let chromaticPosition = NOTE_TO_CHROMATIC[note.name];

    // Add accidental offset
    if (note.accidental === 'sharp') chromaticPosition += 1;
    else if (note.accidental === 'doubleSharp') chromaticPosition += 2;
    else if (note.accidental === 'flat') chromaticPosition -= 1;
    else if (note.accidental === 'doubleFlat') chromaticPosition -= 2;

    // Add transposition
    let newChromaticPosition = chromaticPosition + semitones;
    let octaveChange = 0;

    // Handle octave wrapping
    while (newChromaticPosition < 0) {
      newChromaticPosition += 12;
      octaveChange -= 1;
    }
    while (newChromaticPosition >= 12) {
      newChromaticPosition -= 12;
      octaveChange += 1;
    }

    // Convert back to note name and accidental
    const newNoteData = CHROMATIC_TO_NOTE[newChromaticPosition];

    return {
      ...note,
      name: newNoteData.note,
      octave: note.octave + octaveChange,
      accidental: newNoteData.accidental,
    };
  }

  transposeSelectedPart(semitones: number): void {
    const partId = this.selectedPartId();
    if (!partId) return;
    this.transpose({ semitones, partIds: [partId] });
  }

  transposeAll(semitones: number): void {
    this.transpose({ semitones });
  }

  // ==================== LYRICS ====================

  addLyric(partId: string, text: string, measure: number, beat: number, verse = 1): void {
    const lyric: LyricEntry = {
      id: `lyric-${this.lyricIdCounter++}`,
      text,
      measure,
      beat,
      syllableType: 'single',
      verse,
    };

    this.saveHistory('Add Lyric');
    this.parts.update(parts =>
      parts.map(p => p.id === partId
        ? { ...p, lyrics: [...p.lyrics, lyric] }
        : p
      )
    );
    this.emitScoreChanged();
  }

  updateLyric(partId: string, lyricId: string, updates: Partial<LyricEntry>): void {
    this.saveHistory('Update Lyric');
    this.parts.update(parts =>
      parts.map(p => p.id === partId
        ? {
            ...p,
            lyrics: p.lyrics.map(l => l.id === lyricId ? { ...l, ...updates } : l),
          }
        : p
      )
    );
    this.emitScoreChanged();
  }

  removeLyric(partId: string, lyricId: string): void {
    this.saveHistory('Remove Lyric');
    this.parts.update(parts =>
      parts.map(p => p.id === partId
        ? { ...p, lyrics: p.lyrics.filter(l => l.id !== lyricId) }
        : p
      )
    );
    this.emitScoreChanged();
  }

  getLyricsForPart(partId: string, verse = 1): LyricEntry[] {
    const part = this.parts().find(p => p.id === partId);
    return part?.lyrics.filter(l => l.verse === verse) || [];
  }

  // ==================== UNDO/REDO ====================

  private saveHistory(action: string): void {
    const entry: HistoryEntry = {
      parts: JSON.parse(JSON.stringify(this.parts())),
      timestamp: Date.now(),
      action,
    };

    this.undoStack.update(stack => {
      const newStack = [...stack, entry];
      // Limit history size
      if (newStack.length > this.maxUndoHistory()) {
        return newStack.slice(-this.maxUndoHistory());
      }
      return newStack;
    });

    // Clear redo stack on new action
    this.redoStack.set([]);
  }

  undo(): void {
    const stack = this.undoStack();
    if (stack.length === 0) return;

    const entry = stack[stack.length - 1];
    this.undoStack.update(s => s.slice(0, -1));

    // Save current state to redo stack
    this.redoStack.update(s => [...s, {
      parts: JSON.parse(JSON.stringify(this.parts())),
      timestamp: Date.now(),
      action: 'Redo',
    }]);

    this.parts.set(entry.parts);
    this.emitScoreChanged();
  }

  redo(): void {
    const stack = this.redoStack();
    if (stack.length === 0) return;

    const entry = stack[stack.length - 1];
    this.redoStack.update(s => s.slice(0, -1));

    // Save current state to undo stack
    this.undoStack.update(s => [...s, {
      parts: JSON.parse(JSON.stringify(this.parts())),
      timestamp: Date.now(),
      action: 'Undo',
    }]);

    this.parts.set(entry.parts);
    this.emitScoreChanged();
  }

  // ==================== EXPORT ====================

  exportToMusicXML(): string {
    const score = this.scoreData();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
    xml += '<score-partwise version="4.0">\n';

    // Work
    xml += '  <work>\n';
    xml += `    <work-title>${this.escapeXml(score.title)}</work-title>\n`;
    xml += '  </work>\n';

    // Identification
    xml += '  <identification>\n';
    if (score.composer) {
      xml += `    <creator type="composer">${this.escapeXml(score.composer)}</creator>\n`;
    }
    xml += '    <encoding>\n';
    xml += '      <software>ngx-tailwindcss Score Editor</software>\n';
    xml += `      <encoding-date>${new Date().toISOString().split('T')[0]}</encoding-date>\n`;
    xml += '    </encoding>\n';
    xml += '  </identification>\n';

    // Part list
    xml += '  <part-list>\n';
    for (const part of score.parts) {
      xml += `    <score-part id="${part.id}">\n`;
      xml += `      <part-name>${this.escapeXml(part.name)}</part-name>\n`;
      xml += `      <part-abbreviation>${this.escapeXml(part.abbreviation)}</part-abbreviation>\n`;
      xml += '    </score-part>\n';
    }
    xml += '  </part-list>\n';

    // Parts
    for (const part of score.parts) {
      xml += `  <part id="${part.id}">\n`;

      // Group notes by measure
      const measureNotes = new Map<number, PlacedNote[]>();
      for (const note of part.notes) {
        const notes = measureNotes.get(note.measure) || [];
        notes.push(note);
        measureNotes.set(note.measure, notes);
      }

      for (let m = 0; m < score.measures; m++) {
        xml += `    <measure number="${m + 1}">\n`;

        // Attributes (first measure)
        if (m === 0) {
          xml += '      <attributes>\n';
          xml += '        <divisions>4</divisions>\n';
          xml += this.keySignatureToXml(score.keySignature);
          xml += this.timeSignatureToXml(score.timeSignature);
          xml += this.clefToXml(part.clef);
          xml += '      </attributes>\n';

          // Direction (tempo)
          xml += '      <direction placement="above">\n';
          xml += '        <direction-type>\n';
          xml += `          <metronome><beat-unit>quarter</beat-unit><per-minute>${score.tempo}</per-minute></metronome>\n`;
          xml += '        </direction-type>\n';
          xml += `        <sound tempo="${score.tempo}"/>\n`;
          xml += '      </direction>\n';
        }

        // Notes
        const notes = measureNotes.get(m) || [];
        if (notes.length === 0) {
          // Add whole rest
          xml += '      <note>\n';
          xml += '        <rest/>\n';
          xml += '        <duration>16</duration>\n';
          xml += '        <type>whole</type>\n';
          xml += '      </note>\n';
        } else {
          for (const note of notes.sort((a, b) => a.beat - b.beat)) {
            xml += this.noteToXml(note);
          }
        }

        xml += '    </measure>\n';
      }

      xml += '  </part>\n';
    }

    xml += '</score-partwise>\n';
    return xml;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private keySignatureToXml(key: KeySignature): string {
    const fifths: Record<KeySignature, number> = {
      'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7,
      'F': -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7,
    };
    return `        <key><fifths>${fifths[key]}</fifths></key>\n`;
  }

  private timeSignatureToXml(time: StaffTimeSignature): string {
    if (time === 'C') return '        <time symbol="common"><beats>4</beats><beat-type>4</beat-type></time>\n';
    if (time === 'C|') return '        <time symbol="cut"><beats>2</beats><beat-type>2</beat-type></time>\n';
    const [beats, beatType] = time.split('/');
    return `        <time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time>\n`;
  }

  private clefToXml(clef: ClefType): string {
    const clefMap: Record<ClefType, { sign: string; line: number }> = {
      'treble': { sign: 'G', line: 2 },
      'bass': { sign: 'F', line: 4 },
      'alto': { sign: 'C', line: 3 },
      'tenor': { sign: 'C', line: 4 },
      'percussion': { sign: 'percussion', line: 2 },
    };
    const c = clefMap[clef];
    return `        <clef><sign>${c.sign}</sign><line>${c.line}</line></clef>\n`;
  }

  private noteToXml(note: PlacedNote): string {
    let xml = '      <note>\n';

    // Pitch
    xml += '        <pitch>\n';
    xml += `          <step>${note.name}</step>\n`;
    if (note.accidental === 'sharp') xml += '          <alter>1</alter>\n';
    else if (note.accidental === 'flat') xml += '          <alter>-1</alter>\n';
    else if (note.accidental === 'doubleSharp') xml += '          <alter>2</alter>\n';
    else if (note.accidental === 'doubleFlat') xml += '          <alter>-2</alter>\n';
    xml += `          <octave>${note.octave}</octave>\n`;
    xml += '        </pitch>\n';

    // Duration (in divisions - assuming 4 divisions per quarter)
    const durationMap: Record<NoteDuration, number> = {
      'whole': 16, 'half': 8, 'quarter': 4, 'eighth': 2, 'sixteenth': 1, 'thirtysecond': 0.5,
    };
    let dur = durationMap[note.duration] || 4;
    if (note.dotted) dur *= 1.5;
    xml += `        <duration>${dur}</duration>\n`;

    // Type
    xml += `        <type>${note.duration}</type>\n`;

    // Dot
    if (note.dotted) {
      xml += '        <dot/>\n';
    }

    // Accidental (display)
    if (note.accidental) {
      const accMap: Record<string, string> = {
        'sharp': 'sharp', 'flat': 'flat', 'natural': 'natural',
        'doubleSharp': 'double-sharp', 'doubleFlat': 'double-flat',
      };
      xml += `        <accidental>${accMap[note.accidental]}</accidental>\n`;
    }

    xml += '      </note>\n';
    return xml;
  }

  exportToMidi(): Uint8Array {
    // Basic MIDI file export
    const score = this.scoreData();
    const ticksPerQuarter = 480;
    const tracks: Uint8Array[] = [];

    // Track 0: Tempo track
    const tempoTrack = this.createMidiTempoTrack(score.tempo, ticksPerQuarter);
    tracks.push(tempoTrack);

    // Track per part
    for (const part of score.parts) {
      const noteTrack = this.createMidiNoteTrack(part, ticksPerQuarter);
      tracks.push(noteTrack);
    }

    // Assemble MIDI file
    return this.assembleMidiFile(tracks, ticksPerQuarter);
  }

  private createMidiTempoTrack(tempo: number, ticksPerQuarter: number): Uint8Array {
    const events: number[] = [];

    // Delta time 0
    events.push(0);
    // Tempo meta event
    const microsPerQuarter = Math.round(60000000 / tempo);
    events.push(0xFF, 0x51, 0x03);
    events.push((microsPerQuarter >> 16) & 0xFF);
    events.push((microsPerQuarter >> 8) & 0xFF);
    events.push(microsPerQuarter & 0xFF);

    // End of track
    events.push(0, 0xFF, 0x2F, 0x00);

    return this.createMidiTrackChunk(new Uint8Array(events));
  }

  private createMidiNoteTrack(part: InstrumentPart, ticksPerQuarter: number): Uint8Array {
    const events: number[] = [];

    // Track name
    events.push(0); // Delta time
    events.push(0xFF, 0x03); // Track name meta event
    const nameBytes = new TextEncoder().encode(part.name);
    events.push(nameBytes.length);
    events.push(...nameBytes);

    // Sort notes by position
    const sortedNotes = [...part.notes].sort((a, b) =>
      (a.measure * 1000 + a.beat) - (b.measure * 1000 + b.beat)
    );

    let lastTick = 0;

    for (const note of sortedNotes) {
      const tick = (note.measure * 4 + note.beat / 2) * ticksPerQuarter;
      const midiNote = this.noteToMidi(note.name, note.octave, note.accidental ?? null, part.transposition);
      const velocity = 80;
      const durationTicks = this.durationToTicks(note.duration, note.dotted ?? false, ticksPerQuarter);

      // Note on
      const deltaOn = tick - lastTick;
      events.push(...this.toVariableLength(Math.max(0, deltaOn)));
      events.push(0x90, midiNote, velocity);
      lastTick = tick;

      // Note off
      events.push(...this.toVariableLength(durationTicks));
      events.push(0x80, midiNote, 0);
      lastTick = tick + durationTicks;
    }

    // End of track
    events.push(0, 0xFF, 0x2F, 0x00);

    return this.createMidiTrackChunk(new Uint8Array(events));
  }

  private noteToMidi(name: NoteName, octave: number, accidental: NoteAccidental, transposition: number): number {
    let midi = NOTE_TO_CHROMATIC[name] + (octave + 1) * 12;
    if (accidental === 'sharp') midi += 1;
    else if (accidental === 'flat') midi -= 1;
    else if (accidental === 'doubleSharp') midi += 2;
    else if (accidental === 'doubleFlat') midi -= 2;
    return Math.max(0, Math.min(127, midi - transposition));
  }

  private durationToTicks(duration: NoteDuration, dotted: boolean, ticksPerQuarter: number): number {
    const durationMap: Record<NoteDuration, number> = {
      'whole': 4, 'half': 2, 'quarter': 1, 'eighth': 0.5, 'sixteenth': 0.25, 'thirtysecond': 0.125,
    };
    let ticks = durationMap[duration] * ticksPerQuarter;
    if (dotted) ticks *= 1.5;
    return Math.round(ticks);
  }

  private toVariableLength(value: number): number[] {
    if (value < 128) return [value];
    const bytes: number[] = [];
    bytes.unshift(value & 0x7F);
    value >>= 7;
    while (value > 0) {
      bytes.unshift((value & 0x7F) | 0x80);
      value >>= 7;
    }
    return bytes;
  }

  private createMidiTrackChunk(data: Uint8Array): Uint8Array {
    const chunk = new Uint8Array(8 + data.length);
    // "MTrk"
    chunk[0] = 0x4D; chunk[1] = 0x54; chunk[2] = 0x72; chunk[3] = 0x6B;
    // Length (big-endian)
    const len = data.length;
    chunk[4] = (len >> 24) & 0xFF;
    chunk[5] = (len >> 16) & 0xFF;
    chunk[6] = (len >> 8) & 0xFF;
    chunk[7] = len & 0xFF;
    chunk.set(data, 8);
    return chunk;
  }

  private assembleMidiFile(tracks: Uint8Array[], ticksPerQuarter: number): Uint8Array {
    const totalLength = 14 + tracks.reduce((sum, t) => sum + t.length, 0);
    const file = new Uint8Array(totalLength);
    let offset = 0;

    // Header chunk "MThd"
    file[offset++] = 0x4D; file[offset++] = 0x54; file[offset++] = 0x68; file[offset++] = 0x64;
    // Header length (6)
    file[offset++] = 0; file[offset++] = 0; file[offset++] = 0; file[offset++] = 6;
    // Format (1 = multiple tracks)
    file[offset++] = 0; file[offset++] = 1;
    // Number of tracks
    const numTracks = tracks.length;
    file[offset++] = (numTracks >> 8) & 0xFF;
    file[offset++] = numTracks & 0xFF;
    // Ticks per quarter
    file[offset++] = (ticksPerQuarter >> 8) & 0xFF;
    file[offset++] = ticksPerQuarter & 0xFF;

    // Tracks
    for (const track of tracks) {
      file.set(track, offset);
      offset += track.length;
    }

    return file;
  }

  exportToABC(): string {
    const score = this.scoreData();
    let abc = '';

    // Header
    abc += `X:1\n`;
    abc += `T:${score.title}\n`;
    if (score.composer) abc += `C:${score.composer}\n`;
    abc += `M:${score.timeSignature === 'C' ? 'C' : (score.timeSignature === 'C|' ? 'C|' : score.timeSignature)}\n`;
    abc += `L:1/8\n`;
    abc += `Q:1/4=${score.tempo}\n`;
    abc += `K:${score.keySignature}\n`;

    // Notes (first part only for simplicity)
    const part = score.parts[0];
    if (part) {
      const measureGroups: string[] = [];

      for (let m = 0; m < score.measures; m++) {
        const measureNotes = part.notes
          .filter(n => n.measure === m)
          .sort((a, b) => a.beat - b.beat);

        if (measureNotes.length === 0) {
          measureGroups.push('z4'); // Whole rest
        } else {
          const noteStrings = measureNotes.map(n => this.noteToABC(n));
          measureGroups.push(noteStrings.join(''));
        }
      }

      abc += measureGroups.join('|') + '|]\n';
    }

    return abc;
  }

  private noteToABC(note: PlacedNote): string {
    let abc = '';

    // Accidental
    if (note.accidental === 'sharp') abc += '^';
    else if (note.accidental === 'flat') abc += '_';
    else if (note.accidental === 'natural') abc += '=';
    else if (note.accidental === 'doubleSharp') abc += '^^';
    else if (note.accidental === 'doubleFlat') abc += '__';

    // Note name (lowercase for octave 5+)
    const name = note.octave >= 5 ? note.name.toLowerCase() : note.name;
    abc += name;

    // Octave modifiers
    if (note.octave >= 6) {
      abc += "'".repeat(note.octave - 5);
    } else if (note.octave <= 3) {
      abc += ','.repeat(4 - note.octave);
    }

    // Duration
    const durationMap: Record<NoteDuration, string> = {
      'whole': '8', 'half': '4', 'quarter': '2', 'eighth': '', 'sixteenth': '/2', 'thirtysecond': '/4',
    };
    abc += durationMap[note.duration] || '';

    return abc;
  }

  async exportToPDF(): Promise<Blob> {
    // Generate a simple PDF using canvas
    // In production, you'd want to use a library like jsPDF
    const svg = this.elementRef.nativeElement.querySelector('svg');
    if (!svg) {
      throw new Error('No SVG element found');
    }

    // Create canvas from SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    canvas.width = this.width() * 2;
    canvas.height = this.totalHeight() * 2;

    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Draw to canvas
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      img.onerror = reject;
      img.src = svgUrl;
    });

    // Convert to PDF (basic - just an image)
    // For real PDF with text, use jsPDF
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'application/pdf');
    });
  }

  async export(format: ExportFormat): Promise<void> {
    let data: string | Blob;

    switch (format) {
      case 'musicxml':
        data = this.exportToMusicXML();
        break;
      case 'midi':
        const midiData = this.exportToMidi();
        data = new Blob([midiData.buffer as ArrayBuffer], { type: 'audio/midi' });
        break;
      case 'abc':
        data = this.exportToABC();
        break;
      case 'pdf':
        data = await this.exportToPDF();
        break;
      default:
        return;
    }

    this.exportRequested.emit({ format, data });
  }

  downloadExport(format: ExportFormat): void {
    this.export(format).then(() => {
      // Trigger download
      const score = this.scoreData();
      const filename = `${score.title.replace(/\s+/g, '_') || 'score'}`;

      let content: string | Blob;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'musicxml':
          content = this.exportToMusicXML();
          mimeType = 'application/vnd.recordare.musicxml+xml';
          extension = 'musicxml';
          break;
        case 'midi':
          const midiBytes = this.exportToMidi();
          content = new Blob([midiBytes.buffer as ArrayBuffer], { type: 'audio/midi' });
          mimeType = 'audio/midi';
          extension = 'mid';
          break;
        case 'abc':
          content = this.exportToABC();
          mimeType = 'text/plain';
          extension = 'abc';
          break;
        default:
          return;
      }

      const blob = typeof content === 'string'
        ? new Blob([content], { type: mimeType })
        : content;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ==================== IMPORT ====================

  importMusicXML(xmlString: string): void {
    const parsed = parseMusicXML(xmlString);
    if (!parsed) {
      this.parseError.emit('Failed to parse MusicXML');
      return;
    }

    this.loadFromSheetMusic(parsed);
  }

  importABC(abcString: string): void {
    const parsed = parseABCNotation(abcString);
    if (!parsed) {
      this.parseError.emit('Failed to parse ABC notation');
      return;
    }

    this.loadFromSheetMusic(parsed);
  }

  private loadFromSheetMusic(data: SheetMusicData): void {
    this.saveHistory('Import');

    this.title.set(data.title || 'Untitled');
    this.composer.set(data.composer || '');
    this.tempo.set(data.tempo || 120);
    this.keySignature.set(data.keySignature);
    this.timeSignature.set(data.timeSignature);

    // Convert measures to notes
    const notes: PlacedNote[] = [];
    let noteId = 0;

    data.measures.forEach((measure, measureIndex) => {
      measure.notes.forEach((note, noteIndex) => {
        const totalNotes = measure.notes.length;
        const x = 130 + measureIndex * 150 + (noteIndex / totalNotes) * 140;

        notes.push({
          id: `note-${noteId++}`,
          ...note,
          x,
          measure: measureIndex,
          beat: noteIndex,
          voice: 1,
        });
      });
    });

    // Create single part
    const part: InstrumentPart = {
      id: 'part-0',
      name: 'Part 1',
      abbreviation: 'P1',
      clef: data.clef,
      transposition: 0,
      muted: false,
      solo: false,
      volume: 1,
      color: '#1E293B',
      notes,
      lyrics: [],
    };

    this.parts.set([part]);
    this.selectedPartId.set('part-0');
    this.emitScoreChanged();
  }

  loadScore(score: ScoreData): void {
    this.saveHistory('Load Score');

    this.title.set(score.title);
    this.composer.set(score.composer);
    this.tempo.set(score.tempo);
    this.keySignature.set(score.keySignature);
    this.timeSignature.set(score.timeSignature);
    this.parts.set(score.parts);

    if (score.parts.length > 0) {
      this.selectedPartId.set(score.parts[0].id);
    }

    this.emitScoreChanged();
  }

  // ==================== KEYBOARD SHORTCUTS ====================

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enableKeyboardShortcuts() || !this.editable()) return;

    const key = event.key.toLowerCase();

    // Undo/Redo
    if ((event.ctrlKey || event.metaKey) && key === 'z') {
      event.preventDefault();
      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      return;
    }

    // Save/Export
    if ((event.ctrlKey || event.metaKey) && key === 's') {
      event.preventDefault();
      this.showExportDialog.set(true);
      return;
    }
  }

  // ==================== HELPERS ====================

  private emitScoreChanged(): void {
    this.scoreChanged.emit(this.scoreData());
  }

  // Note handler from TwNoteInputComponent
  onPartNotesChanged(partId: string, notes: PlacedNote[]): void {
    this.saveHistory('Edit Notes');
    this.parts.update(parts =>
      parts.map(p => p.id === partId ? { ...p, notes } : p)
    );
    this.emitScoreChanged();
  }

  protected readonly Math = Math;
  protected readonly Object = Object;
  protected readonly INSTRUMENT_PRESETS = INSTRUMENT_PRESETS;
  protected readonly durationOptions: NoteDuration[] = ['whole', 'half', 'quarter', 'eighth', 'sixteenth'];

  protected readonly voiceColors: Record<number, string> = {
    1: '#1E293B',
    2: '#2563EB',
    3: '#059669',
    4: '#DC2626',
  };

  protected toggleDotted(): void {
    this.isDotted.update(d => !d);
  }

  protected toggleRest(): void {
    this.isRest.update(r => !r);
  }

  protected setVoice(voice: number): void {
    this.currentVoice.set(voice as 1 | 2 | 3 | 4);
  }
}

