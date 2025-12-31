import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject, debounceTime } from 'rxjs';

import { TwStaffComponent, ClefType, KeySignature, StaffTimeSignature } from './staff.component';
import {
  TwNoteComponent,
  NoteDuration,
  NoteAccidental,
  NoteName,
  NoteData,
} from './note.component';

export type Voice = 1 | 2 | 3 | 4;

export interface PlacedNote extends NoteData {
  id: string;
  x: number;
  measure: number;
  beat: number;
  voice: Voice;
  selected?: boolean;
}

export interface NoteInputMeasureData {
  notes: PlacedNote[];
  voice1: PlacedNote[];
  voice2: PlacedNote[];
  voice3: PlacedNote[];
  voice4: PlacedNote[];
}

export interface NoteInputEvent {
  type: 'add' | 'remove' | 'move' | 'update';
  note: PlacedNote;
  previousState?: PlacedNote;
}

export interface ClipboardData {
  notes: PlacedNote[];
  measureStart: number;
  measureEnd: number;
}

// MIDI note number to note name mapping
const MIDI_NOTE_NAMES: NoteName[] = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
const MIDI_NOTE_ACCIDENTALS: (NoteAccidental | null)[] = [
  null,
  'sharp',
  null,
  'sharp',
  null,
  null,
  'sharp',
  null,
  'sharp',
  null,
  'sharp',
  null,
];

// Keyboard shortcuts for note durations
const DURATION_SHORTCUTS: Record<string, NoteDuration> = {
  '1': 'whole',
  '2': 'half',
  '3': 'quarter',
  '4': 'eighth',
  '5': 'sixteenth',
  '6': 'thirtysecond',
};

// Keyboard shortcuts for note names
const NOTE_SHORTCUTS: Record<string, NoteName> = {
  c: 'C',
  d: 'D',
  e: 'E',
  f: 'F',
  g: 'G',
  a: 'A',
  b: 'B',
};

@Component({
  selector: 'tw-note-input',
  standalone: true,
  imports: [CommonModule, TwStaffComponent, TwNoteComponent],
  templateUrl: './note-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block outline-none',
    '[attr.tabindex]': '0',
  },
})
export class TwNoteInputComponent implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly staffContainer = viewChild<ElementRef<HTMLDivElement>>('staffContainer');

  // Staff configuration (pass-through to tw-staff)
  readonly clef = input<ClefType>('treble');
  readonly keySignature = input<KeySignature>('C');
  readonly timeSignature = input<StaffTimeSignature>('4/4');
  readonly measures = input(4, { transform: numberAttribute });
  readonly width = input(800, { transform: numberAttribute });
  readonly height = input(150, { transform: numberAttribute });
  readonly lineSpacing = input(10, { transform: numberAttribute });

  // Note input options
  readonly editable = input(true);
  readonly showVoiceColors = input(true);
  readonly maxVoices = input<1 | 2 | 3 | 4>(4);
  readonly enableMidiInput = input(false);
  readonly enableKeyboardShortcuts = input(true);
  readonly snapToGrid = input(true);
  readonly gridDivision = input<4 | 8 | 16>(8); // Subdivisions per measure

  // Initial data
  readonly initialNotes = input<PlacedNote[]>([]);

  // Outputs
  readonly noteAdded = output<NoteInputEvent>();
  readonly noteRemoved = output<NoteInputEvent>();
  readonly noteMoved = output<NoteInputEvent>();
  readonly noteUpdated = output<NoteInputEvent>();
  readonly selectionChanged = output<PlacedNote[]>();
  readonly notesChanged = output<PlacedNote[]>();
  readonly measureCopied = output<ClipboardData>();
  readonly measurePasted = output<{ measure: number; notes: PlacedNote[] }>();

  // Internal state
  protected readonly notes = signal<PlacedNote[]>([]);
  protected readonly selectedNotes = signal<PlacedNote[]>([]);
  protected readonly currentVoice = signal<Voice>(1);
  protected readonly currentDuration = signal<NoteDuration>('quarter');
  protected readonly currentAccidental = signal<NoteAccidental>(null);
  protected readonly isDotted = signal(false);
  protected readonly isRest = signal(false);
  protected readonly hoverPosition = signal<{
    x: number;
    y: number;
    note: NoteName;
    octave: number;
    measure: number;
    beat: number;
  } | null>(null);
  protected readonly isDragging = signal(false);
  protected readonly draggedNote = signal<PlacedNote | null>(null);
  protected readonly clipboard = signal<ClipboardData | null>(null);
  protected readonly undoStack = signal<PlacedNote[][]>([]);
  protected readonly redoStack = signal<PlacedNote[][]>([]);

  // MIDI state
  private midiAccess: MIDIAccess | null = null;
  protected readonly midiConnected = signal(false);
  protected readonly midiDeviceName = signal<string | null>(null);

  // Note ID counter
  private noteIdCounter = 0;

  // Voice colors
  protected readonly voiceColors: Record<Voice, string> = {
    1: '#1E293B', // Slate (default)
    2: '#2563EB', // Blue
    3: '#059669', // Emerald
    4: '#DC2626', // Red
  };

  protected getVoiceColorByNumber(voice: number): string {
    const v = voice as Voice;
    return this.voiceColors[v] ?? this.voiceColors[1];
  }

  // Computed values
  protected readonly staffTop = computed(() => {
    const h = this.height();
    const totalStaffHeight = this.lineSpacing() * 4;
    return (h - totalStaffHeight) / 2;
  });

  protected readonly measureWidth = computed(() => {
    const w = this.width();
    const clefWidth = 50;
    const keyWidth = 40;
    const timeWidth = 30;
    const availableWidth = w - clefWidth - keyWidth - timeWidth - 20;
    return availableWidth / this.measures();
  });

  protected readonly contentStartX = computed(() => {
    return 50 + 40 + 30 + 10; // clef + key + time + padding
  });

  protected readonly gridPositions = computed(() => {
    const positions: number[] = [];
    const startX = this.contentStartX();
    const measureW = this.measureWidth();
    const divisions = this.gridDivision();
    const measureCount = this.measures();

    for (let m = 0; m < measureCount; m++) {
      for (let d = 0; d < divisions; d++) {
        positions.push(startX + m * measureW + (d / divisions) * measureW);
      }
    }

    return positions;
  });

  protected readonly notesByVoice = computed(() => {
    const allNotes = this.notes();
    return {
      1: allNotes.filter(n => n.voice === 1),
      2: allNotes.filter(n => n.voice === 2),
      3: allNotes.filter(n => n.voice === 3),
      4: allNotes.filter(n => n.voice === 4),
    };
  });

  ngAfterViewInit(): void {
    // Initialize with initial notes
    const initial = this.initialNotes();
    if (initial.length > 0) {
      this.notes.set([...initial]);
    }

    // Setup MIDI if enabled
    if (this.enableMidiInput()) {
      this.initMidi();
    }

    // Focus element for keyboard input
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.disconnectMidi();
  }

  // ==================== CLICK TO PLACE ====================

  onStaffClick(event: MouseEvent): void {
    if (!this.editable()) return;

    const position = this.getPositionFromEvent(event);
    if (!position) return;

    // Check if clicking on existing note
    const clickedNote = this.findNoteAtPosition(position.x, position.y);
    if (clickedNote) {
      this.toggleNoteSelection(clickedNote);
      return;
    }

    // Place new note
    this.placeNote(position);
  }

  onStaffMouseMove(event: MouseEvent): void {
    if (!this.editable()) return;

    const position = this.getPositionFromEvent(event);
    if (position) {
      this.hoverPosition.set(position);
    } else {
      this.hoverPosition.set(null);
    }
  }

  onStaffMouseLeave(): void {
    this.hoverPosition.set(null);
  }

  private getPositionFromEvent(
    event: MouseEvent
  ): {
    x: number;
    y: number;
    note: NoteName;
    octave: number;
    measure: number;
    beat: number;
  } | null {
    const container = this.staffContainer()?.nativeElement;
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if within staff area
    const staffTop = this.staffTop();
    const staffBottom = staffTop + this.lineSpacing() * 4;
    const startX = this.contentStartX();
    const endX = this.width() - 10;

    if (x < startX || x > endX) return null;

    // Snap to grid if enabled
    let snappedX = x;
    if (this.snapToGrid()) {
      const positions = this.gridPositions();
      const closest = positions.reduce((prev, curr) =>
        Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
      );
      snappedX = closest;
    }

    // Calculate note from Y position
    const { note, octave } = this.yToNote(y);

    // Calculate measure and beat
    const measureWidth = this.measureWidth();
    const measure = Math.floor((snappedX - startX) / measureWidth);
    const beatPosition = ((snappedX - startX) % measureWidth) / measureWidth;
    const beat = Math.floor(beatPosition * this.gridDivision());

    return { x: snappedX, y, note, octave, measure, beat };
  }

  private yToNote(y: number): { note: NoteName; octave: number } {
    const staffTop = this.staffTop();
    const spacing = this.lineSpacing();

    // Calculate position relative to staff
    // Position 0 = top line (F5 in treble), each half-space is one step
    const position = (y - staffTop) / (spacing / 2);

    // Map position to note (treble clef: F5 at top)
    const noteNames: NoteName[] = [
      'F',
      'E',
      'D',
      'C',
      'B',
      'A',
      'G',
      'F',
      'E',
      'D',
      'C',
      'B',
      'A',
      'G',
    ];
    const octaves = [5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3];

    const index = Math.round(position);
    const clampedIndex = Math.max(0, Math.min(noteNames.length - 1, index));

    return {
      note: noteNames[clampedIndex],
      octave: octaves[clampedIndex],
    };
  }

  private placeNote(position: {
    x: number;
    note: NoteName;
    octave: number;
    measure: number;
    beat: number;
  }): void {
    const newNote: PlacedNote = {
      id: `note-${this.noteIdCounter++}`,
      name: position.note,
      octave: position.octave,
      duration: this.currentDuration(),
      accidental: this.currentAccidental(),
      dotted: this.isDotted(),
      x: position.x,
      measure: position.measure,
      beat: position.beat,
      voice: this.currentVoice(),
    };

    if (this.isRest()) {
      // Place as rest - we store it but render differently
      (newNote as any).isRest = true;
    }

    this.saveUndoState();
    this.notes.update(notes => [...notes, newNote]);

    this.noteAdded.emit({ type: 'add', note: newNote });
    this.notesChanged.emit(this.notes());
  }

  // ==================== DRAG TO REPOSITION ====================

  onNoteMouseDown(event: MouseEvent, note: PlacedNote): void {
    if (!this.editable()) return;
    event.stopPropagation();

    this.isDragging.set(true);
    this.draggedNote.set(note);

    const onMouseMove = (e: MouseEvent) => {
      const position = this.getPositionFromEvent(e);
      if (position && this.draggedNote()) {
        this.updateDraggedNotePosition(position);
      }
    };

    const onMouseUp = () => {
      this.finalizeDrag();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private updateDraggedNotePosition(position: {
    x: number;
    note: NoteName;
    octave: number;
    measure: number;
    beat: number;
  }): void {
    const dragged = this.draggedNote();
    if (!dragged) return;

    const updatedNote: PlacedNote = {
      ...dragged,
      name: position.note,
      octave: position.octave,
      x: position.x,
      measure: position.measure,
      beat: position.beat,
    };

    this.draggedNote.set(updatedNote);
  }

  private finalizeDrag(): void {
    const dragged = this.draggedNote();
    if (dragged) {
      this.saveUndoState();

      const previousState = this.notes().find(n => n.id === dragged.id);

      this.notes.update(notes => notes.map(n => (n.id === dragged.id ? dragged : n)));

      this.noteMoved.emit({
        type: 'move',
        note: dragged,
        previousState,
      });
      this.notesChanged.emit(this.notes());
    }

    this.isDragging.set(false);
    this.draggedNote.set(null);
  }

  // ==================== KEYBOARD SHORTCUTS ====================

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enableKeyboardShortcuts() || !this.editable()) return;

    const key = event.key.toLowerCase();

    // Duration shortcuts (1-6)
    if (DURATION_SHORTCUTS[key]) {
      event.preventDefault();
      this.currentDuration.set(DURATION_SHORTCUTS[key]);
      return;
    }

    // Note name shortcuts (a-g)
    if (NOTE_SHORTCUTS[key]) {
      event.preventDefault();
      this.placeNoteByName(NOTE_SHORTCUTS[key]);
      return;
    }

    // Accidentals
    if (key === '#' || event.key === 'Sharp') {
      event.preventDefault();
      this.toggleAccidental('sharp');
      return;
    }
    if (key === '-' || event.key === 'Minus') {
      event.preventDefault();
      this.toggleAccidental('flat');
      return;
    }
    if (key === '=' || event.key === 'Equal') {
      event.preventDefault();
      this.toggleAccidental('natural');
      return;
    }

    // Dot
    if (key === '.') {
      event.preventDefault();
      this.isDotted.update(v => !v);
      return;
    }

    // Rest
    if (key === 'r') {
      event.preventDefault();
      this.isRest.update(v => !v);
      return;
    }

    // Voice selection (v + 1-4)
    if (key === 'v') {
      event.preventDefault();
      // Wait for next key
      return;
    }

    // Delete selected
    if (key === 'delete' || key === 'backspace') {
      event.preventDefault();
      this.deleteSelectedNotes();
      return;
    }

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

    // Copy/Paste
    if ((event.ctrlKey || event.metaKey) && key === 'c') {
      event.preventDefault();
      this.copySelectedMeasures();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && key === 'v') {
      event.preventDefault();
      this.pasteFromClipboard();
      return;
    }

    // Select all
    if ((event.ctrlKey || event.metaKey) && key === 'a') {
      event.preventDefault();
      this.selectAllNotes();
      return;
    }

    // Arrow keys for navigation
    if (key === 'arrowup') {
      event.preventDefault();
      this.moveSelectedNotes(0, 1);
      return;
    }
    if (key === 'arrowdown') {
      event.preventDefault();
      this.moveSelectedNotes(0, -1);
      return;
    }
    if (key === 'arrowleft') {
      event.preventDefault();
      this.moveSelectedNotes(-1, 0);
      return;
    }
    if (key === 'arrowright') {
      event.preventDefault();
      this.moveSelectedNotes(1, 0);
      return;
    }

    // Voice shortcuts (1-4 with shift)
    if (event.shiftKey && ['1', '2', '3', '4'].includes(key)) {
      event.preventDefault();
      const voice = parseInt(key) as Voice;
      if (voice <= this.maxVoices()) {
        this.currentVoice.set(voice);
      }
      return;
    }
  }

  private placeNoteByName(name: NoteName): void {
    const hover = this.hoverPosition();
    if (!hover) {
      // Place at first available position
      const x = this.contentStartX() + 20;
      this.placeNote({
        x,
        note: name,
        octave: 4,
        measure: 0,
        beat: 0,
      });
    } else {
      this.placeNote({
        ...hover,
        note: name,
      });
    }
  }

  private toggleAccidental(acc: NoteAccidental): void {
    const current = this.currentAccidental();
    this.currentAccidental.set(current === acc ? null : acc);
  }

  // ==================== MIDI INPUT ====================

  private async initMidi(): Promise<void> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.midiConnected.set(true);

      const inputs = this.midiAccess.inputs;
      inputs.forEach(input => {
        this.midiDeviceName.set(input.name ?? 'Unknown MIDI Device');
        input.onmidimessage = event => this.handleMidiMessage(event as MIDIMessageEvent);
      });

      // Listen for device changes
      this.midiAccess.onstatechange = () => {
        this.updateMidiDevices();
      };
    } catch (error) {
      console.warn('MIDI not available:', error);
      this.midiConnected.set(false);
    }
  }

  private updateMidiDevices(): void {
    if (!this.midiAccess) return;

    const inputs = this.midiAccess.inputs;
    let hasInputs = false;

    inputs.forEach(input => {
      hasInputs = true;
      this.midiDeviceName.set(input.name ?? 'Unknown MIDI Device');
      input.onmidimessage = event => this.handleMidiMessage(event as MIDIMessageEvent);
    });

    if (!hasInputs) {
      this.midiConnected.set(false);
      this.midiDeviceName.set(null);
    } else {
      this.midiConnected.set(true);
    }
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data) return;

    const command = data[0] >> 4;
    const noteNumber = data[1];
    const velocity = data[2];

    // Note On (0x9) with velocity > 0
    if (command === 9 && velocity > 0) {
      const { note, octave, accidental } = this.midiNoteToNote(noteNumber);

      // Place note at current cursor position or next available
      const hover = this.hoverPosition();
      const x = hover?.x ?? this.getNextNotePosition();

      this.placeNote({
        x,
        note,
        octave,
        measure: hover?.measure ?? 0,
        beat: hover?.beat ?? 0,
      });

      // Update current accidental if needed
      if (accidental) {
        this.currentAccidental.set(accidental);
      }
    }
  }

  private midiNoteToNote(midiNote: number): {
    note: NoteName;
    octave: number;
    accidental: NoteAccidental;
  } {
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;

    return {
      note: MIDI_NOTE_NAMES[noteIndex],
      octave,
      accidental: MIDI_NOTE_ACCIDENTALS[noteIndex],
    };
  }

  private getNextNotePosition(): number {
    const allNotes = this.notes();
    if (allNotes.length === 0) {
      return this.contentStartX() + 20;
    }

    const lastNote = allNotes.reduce((prev, curr) => (curr.x > prev.x ? curr : prev));
    return lastNote.x + this.measureWidth() / this.gridDivision();
  }

  private disconnectMidi(): void {
    if (this.midiAccess) {
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = null;
      });
      this.midiAccess = null;
    }
    this.midiConnected.set(false);
  }

  // ==================== VOICE SEPARATION ====================

  setVoice(voice: Voice): void {
    if (voice <= this.maxVoices()) {
      this.currentVoice.set(voice);
    }
  }

  getVoiceColor(voice: Voice): string {
    return this.showVoiceColors() ? this.voiceColors[voice] : this.voiceColors[1];
  }

  // ==================== COPY/PASTE ====================

  copySelectedMeasures(): void {
    const selected = this.selectedNotes();
    if (selected.length === 0) return;

    const measureStart = Math.min(...selected.map(n => n.measure));
    const measureEnd = Math.max(...selected.map(n => n.measure));

    const clipboardData: ClipboardData = {
      notes: selected.map(n => ({ ...n })),
      measureStart,
      measureEnd,
    };

    this.clipboard.set(clipboardData);
    this.measureCopied.emit(clipboardData);
  }

  pasteFromClipboard(targetMeasure?: number): void {
    const clip = this.clipboard();
    if (!clip) return;

    const target = targetMeasure ?? 0;
    const offset = target - clip.measureStart;

    const pastedNotes: PlacedNote[] = clip.notes.map(n => ({
      ...n,
      id: `note-${this.noteIdCounter++}`,
      measure: n.measure + offset,
      x: n.x + offset * this.measureWidth(),
    }));

    this.saveUndoState();
    this.notes.update(notes => [...notes, ...pastedNotes]);
    this.measurePasted.emit({ measure: target, notes: pastedNotes });
    this.notesChanged.emit(this.notes());
  }

  // ==================== SELECTION ====================

  private toggleNoteSelection(note: PlacedNote): void {
    const selected = this.selectedNotes();
    const isSelected = selected.some(n => n.id === note.id);

    if (isSelected) {
      this.selectedNotes.update(sel => sel.filter(n => n.id !== note.id));
    } else {
      this.selectedNotes.update(sel => [...sel, note]);
    }

    this.selectionChanged.emit(this.selectedNotes());
  }

  selectAllNotes(): void {
    this.selectedNotes.set([...this.notes()]);
    this.selectionChanged.emit(this.selectedNotes());
  }

  clearSelection(): void {
    this.selectedNotes.set([]);
    this.selectionChanged.emit([]);
  }

  private findNoteAtPosition(x: number, y: number): PlacedNote | null {
    const allNotes = this.notes();
    const threshold = this.lineSpacing() * 0.8;

    return (
      allNotes.find(note => {
        const noteY = this.noteToY(note.name, note.octave);
        return Math.abs(note.x - x) < threshold && Math.abs(noteY - y) < threshold;
      }) ?? null
    );
  }

  protected noteToY(name: NoteName, octave: number): number {
    const staffTop = this.staffTop();
    const spacing = this.lineSpacing();

    // Map note to position (treble clef)
    const notePositions: Record<NoteName, number> = {
      F: 0,
      E: 1,
      D: 2,
      C: 3,
      B: 4,
      A: 5,
      G: 6,
    };

    const basePosition = notePositions[name];
    const octaveOffset = (5 - octave) * 7;

    return staffTop + (basePosition + octaveOffset) * (spacing / 2);
  }

  isNoteSelected(note: PlacedNote): boolean {
    return this.selectedNotes().some(n => n.id === note.id);
  }

  // ==================== DELETE / MODIFY ====================

  deleteSelectedNotes(): void {
    const selected = this.selectedNotes();
    if (selected.length === 0) return;

    this.saveUndoState();

    const selectedIds = new Set(selected.map(n => n.id));
    this.notes.update(notes => notes.filter(n => !selectedIds.has(n.id)));

    selected.forEach(note => {
      this.noteRemoved.emit({ type: 'remove', note });
    });

    this.selectedNotes.set([]);
    this.notesChanged.emit(this.notes());
  }

  deleteNote(note: PlacedNote): void {
    this.saveUndoState();
    this.notes.update(notes => notes.filter(n => n.id !== note.id));
    this.noteRemoved.emit({ type: 'remove', note });
    this.notesChanged.emit(this.notes());
  }

  private moveSelectedNotes(beatDelta: number, pitchDelta: number): void {
    const selected = this.selectedNotes();
    if (selected.length === 0) return;

    this.saveUndoState();

    const noteNames: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    this.notes.update(notes =>
      notes.map(n => {
        if (!selected.some(s => s.id === n.id)) return n;

        let newOctave = n.octave;
        let newNoteIndex = noteNames.indexOf(n.name) + pitchDelta;

        // Handle octave changes
        while (newNoteIndex < 0) {
          newNoteIndex += 7;
          newOctave--;
        }
        while (newNoteIndex >= 7) {
          newNoteIndex -= 7;
          newOctave++;
        }

        // Handle beat movement
        let newBeat = n.beat + beatDelta;
        let newMeasure = n.measure;
        const grid = this.gridDivision();

        while (newBeat < 0) {
          newBeat += grid;
          newMeasure--;
        }
        while (newBeat >= grid) {
          newBeat -= grid;
          newMeasure++;
        }

        // Calculate new X position
        const newX =
          this.contentStartX() +
          newMeasure * this.measureWidth() +
          (newBeat / grid) * this.measureWidth();

        return {
          ...n,
          name: noteNames[newNoteIndex],
          octave: newOctave,
          beat: newBeat,
          measure: Math.max(0, newMeasure),
          x: newX,
        };
      })
    );

    this.notesChanged.emit(this.notes());
  }

  // ==================== UNDO/REDO ====================

  private saveUndoState(): void {
    this.undoStack.update(stack => [...stack, [...this.notes()]]);
    this.redoStack.set([]); // Clear redo on new action
  }

  undo(): void {
    const stack = this.undoStack();
    if (stack.length === 0) return;

    const previousState = stack[stack.length - 1];
    this.undoStack.update(s => s.slice(0, -1));
    this.redoStack.update(s => [...s, [...this.notes()]]);
    this.notes.set(previousState);
    this.notesChanged.emit(this.notes());
  }

  redo(): void {
    const stack = this.redoStack();
    if (stack.length === 0) return;

    const nextState = stack[stack.length - 1];
    this.redoStack.update(s => s.slice(0, -1));
    this.undoStack.update(s => [...s, [...this.notes()]]);
    this.notes.set(nextState);
    this.notesChanged.emit(this.notes());
  }

  // ==================== PUBLIC API ====================

  getNotes(): PlacedNote[] {
    return [...this.notes()];
  }

  setNotes(notes: PlacedNote[]): void {
    this.saveUndoState();
    this.notes.set([...notes]);
    this.notesChanged.emit(this.notes());
  }

  clearAllNotes(): void {
    this.saveUndoState();
    this.notes.set([]);
    this.selectedNotes.set([]);
    this.notesChanged.emit([]);
  }

  setDuration(duration: NoteDuration): void {
    this.currentDuration.set(duration);
  }

  setAccidental(accidental: NoteAccidental): void {
    this.currentAccidental.set(accidental);
  }

  setDotted(dotted: boolean): void {
    this.isDotted.set(dotted);
  }

  setRestMode(rest: boolean): void {
    this.isRest.set(rest);
  }
}
