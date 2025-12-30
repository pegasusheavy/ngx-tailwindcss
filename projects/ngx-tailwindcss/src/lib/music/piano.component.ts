import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type PianoVariant = 'classic' | 'modern' | 'minimal';
export type PianoSize = 'sm' | 'md' | 'lg';

export interface PianoKey {
  note: string;
  octave: number;
  midi: number;
  isBlack: boolean;
  position?: number;
}

export interface NoteEvent {
  note: string;
  octave: number;
  midi: number;
  velocity: number;
}

export interface ActiveNote {
  velocity: number;
  timestamp: number;
  source: 'mouse' | 'touch' | 'midi' | 'api';
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = ['C#', 'D#', 'F#', 'G#', 'A#'];
const BLACK_KEY_OFFSETS = [0.65, 1.75, 3.6, 4.7, 5.8]; // Position multipliers for black keys within an octave

/**
 * Interactive Piano Keyboard component
 *
 * @example
 * ```html
 * <tw-piano
 *   [startOctave]="3"
 *   [octaves]="2"
 *   (noteOn)="playNote($event)"
 *   (noteOff)="stopNote($event)"
 * ></tw-piano>
 * ```
 */
@Component({
  selector: 'tw-piano',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piano.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwPianoComponent {
  private readonly twClass = inject(TwClassService);

  // Configuration
  readonly startOctave = input(4);
  readonly octaves = input(2);
  readonly velocity = input(100);

  // Display options
  readonly variant = input<PianoVariant>('classic');
  readonly size = input<PianoSize>('md');
  readonly showLabels = input(false);
  readonly showOctaveLabels = input(false);
  readonly highlightedNotes = input<string[]>([]);
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Custom sizing via CSS variables (override size presets)
  readonly customWhiteKeyWidth = input<number | null>(null);
  readonly customKeyHeight = input<number | null>(null);

  // Velocity-sensitive display
  readonly velocitySensitive = input(false); // Show velocity as color intensity
  readonly velocityColorMode = input<'brightness' | 'hue' | 'saturation'>('brightness');

  // MIDI input
  readonly enableMidi = input(false);
  readonly midiChannel = input(-1); // -1 = all channels, 0-15 = specific channel

  // Outputs
  readonly noteOn = output<NoteEvent>();
  readonly noteOff = output<NoteEvent>();
  readonly midiConnected = output<MidiDevice>();
  readonly midiDisconnected = output<MidiDevice>();
  readonly midiError = output<string>();

  // Internal state
  private readonly activeKeys = signal<Map<string, ActiveNote>>(new Map());
  protected readonly availableMidiDevices = signal<MidiDevice[]>([]);
  protected readonly connectedMidiDevice = signal<MidiDevice | null>(null);

  private midiAccess: MIDIAccess | null = null;
  private midiInputs: MIDIInput[] = [];

  // Size configurations
  private readonly sizeConfig = computed(() => {
    const configs: Record<PianoSize, { whiteWidth: number; height: number }> = {
      sm: { whiteWidth: 24, height: 100 },
      md: { whiteWidth: 36, height: 150 },
      lg: { whiteWidth: 48, height: 200 },
    };
    const config = configs[this.size()];

    // Apply custom overrides
    return {
      whiteWidth: this.customWhiteKeyWidth() ?? config.whiteWidth,
      height: this.customKeyHeight() ?? config.height,
    };
  });

  protected readonly height = computed(() => this.sizeConfig().height);
  protected readonly whiteKeyWidth = computed(() => this.sizeConfig().whiteWidth);
  protected readonly blackKeyWidth = computed(() => this.sizeConfig().whiteWidth * 0.6);

  // CSS variable style bindings for custom sizing
  protected readonly cssVarStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (this.customWhiteKeyWidth()) styles['--tw-music-piano-white-key-width'] = `${this.customWhiteKeyWidth()}px`;
    if (this.customKeyHeight()) styles['--tw-music-piano-white-key-height'] = `${this.customKeyHeight()}px`;
    return styles;
  });

  protected readonly octaveRange = computed(() => {
    const start = this.startOctave();
    const count = this.octaves();
    return Array.from({ length: count }, (_, i) => start + i);
  });

  protected readonly whiteKeys = computed((): PianoKey[] => {
    const keys: PianoKey[] = [];
    const start = this.startOctave();
    const count = this.octaves();

    for (let o = 0; o < count; o++) {
      const octave = start + o;
      for (const note of WHITE_NOTES) {
        keys.push({
          note,
          octave,
          midi: this.noteToMidi(note, octave),
          isBlack: false,
        });
      }
    }

    return keys;
  });

  protected readonly blackKeys = computed((): PianoKey[] => {
    const keys: PianoKey[] = [];
    const start = this.startOctave();
    const count = this.octaves();
    const whiteWidth = this.whiteKeyWidth();

    for (let o = 0; o < count; o++) {
      const octave = start + o;
      const octaveOffset = o * 7 * whiteWidth;

      BLACK_NOTES.forEach((note, i) => {
        keys.push({
          note,
          octave,
          midi: this.noteToMidi(note, octave),
          isBlack: true,
          position: octaveOffset + BLACK_KEY_OFFSETS[i] * whiteWidth - this.blackKeyWidth() / 2,
        });
      });
    }

    return keys;
  });

  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'inline-block select-none';

    const variantClasses: Record<PianoVariant, string> = {
      classic: 'p-2 bg-slate-900 rounded-lg shadow-xl',
      modern: 'p-1 bg-slate-800 rounded-xl shadow-lg',
      minimal: '',
    };

    return this.twClass.merge(baseClasses, variantClasses[variant], this.classOverride());
  });

  protected whiteKeyClasses(key: PianoKey): string {
    const variant = this.variant();
    const isActive = this.isKeyActive(key);
    const isHighlighted = this.isKeyHighlighted(key);

    const baseClasses = `
      relative h-full border-r last:border-r-0
      transition-all duration-75
      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400
    `;

    const variantClasses: Record<PianoVariant, string> = {
      classic: `
        bg-gradient-to-b from-white to-slate-100
        border-slate-300
        shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1)]
        rounded-b-md
        ${isActive ? 'from-slate-200 to-slate-300 shadow-inner' : 'hover:from-slate-50'}
        ${isHighlighted ? 'from-blue-100 to-blue-200' : ''}
      `,
      modern: `
        bg-white
        border-slate-200
        rounded-b-lg
        ${isActive ? 'bg-slate-200 scale-y-[0.98] origin-top' : 'hover:bg-slate-50'}
        ${isHighlighted ? 'bg-blue-100' : ''}
      `,
      minimal: `
        bg-white dark:bg-slate-200
        border-slate-300 dark:border-slate-400
        rounded-b
        ${isActive ? 'bg-slate-300 dark:bg-slate-400' : 'hover:bg-slate-100 dark:hover:bg-slate-300'}
        ${isHighlighted ? 'bg-blue-200 dark:bg-blue-300' : ''}
      `,
    };

    return this.twClass.merge(
      baseClasses,
      variantClasses[variant],
      this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    );
  }

  protected blackKeyClasses(key: PianoKey): string {
    const variant = this.variant();
    const isActive = this.isKeyActive(key);
    const isHighlighted = this.isKeyHighlighted(key);

    const baseClasses = `
      absolute top-0 z-10
      transition-all duration-75
      focus:outline-none focus:ring-2 focus:ring-blue-400
    `;

    const variantClasses: Record<PianoVariant, string> = {
      classic: `
        bg-gradient-to-b from-slate-800 to-slate-900
        rounded-b-md
        shadow-[2px_4px_6px_rgba(0,0,0,0.4)]
        ${isActive ? 'from-slate-700 to-slate-800 shadow-inner h-[60%]' : 'hover:from-slate-700'}
        ${isHighlighted ? 'from-blue-700 to-blue-900' : ''}
      `,
      modern: `
        bg-slate-800
        rounded-b-lg
        shadow-lg
        ${isActive ? 'bg-slate-700 scale-y-[0.95] origin-top' : 'hover:bg-slate-700'}
        ${isHighlighted ? 'bg-blue-700' : ''}
      `,
      minimal: `
        bg-slate-800 dark:bg-slate-900
        rounded-b
        ${isActive ? 'bg-slate-600 dark:bg-slate-700' : 'hover:bg-slate-700 dark:hover:bg-slate-800'}
        ${isHighlighted ? 'bg-blue-800 dark:bg-blue-900' : ''}
      `,
    };

    return this.twClass.merge(
      baseClasses,
      variantClasses[variant],
      this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    );
  }

  protected labelClasses(keyType: 'white' | 'black'): string {
    if (keyType === 'white') {
      return 'absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-500';
    }
    return 'absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-400';
  }

  protected isKeyActive(key: PianoKey): boolean {
    return this.activeKeys().has(this.getKeyId(key));
  }

  protected getKeyVelocity(key: PianoKey): number {
    const activeNote = this.activeKeys().get(this.getKeyId(key));
    return activeNote?.velocity ?? 0;
  }

  protected getVelocityStyle(key: PianoKey): Record<string, string> {
    if (!this.velocitySensitive() || !this.isKeyActive(key)) {
      return {};
    }

    const velocity = this.getKeyVelocity(key);
    const normalizedVelocity = velocity / 127;
    const mode = this.velocityColorMode();

    if (mode === 'brightness') {
      // Brighter = higher velocity
      const brightness = 0.5 + normalizedVelocity * 0.5;
      return { filter: `brightness(${brightness})` };
    } else if (mode === 'hue') {
      // Blue (soft) to Red (hard)
      const hue = (1 - normalizedVelocity) * 240; // 240=blue, 0=red
      return { filter: `hue-rotate(${hue - 200}deg)` };
    } else {
      // Saturation mode
      const saturation = 0.3 + normalizedVelocity * 0.7;
      return { filter: `saturate(${saturation})` };
    }
  }

  protected getVelocityIndicatorWidth(key: PianoKey): number {
    if (!this.velocitySensitive() || !this.isKeyActive(key)) {
      return 0;
    }
    const velocity = this.getKeyVelocity(key);
    return (velocity / 127) * 100;
  }

  protected getNoteSource(key: PianoKey): string | null {
    const activeNote = this.activeKeys().get(this.getKeyId(key));
    return activeNote?.source ?? null;
  }

  protected isKeyHighlighted(key: PianoKey): boolean {
    const highlighted = this.highlightedNotes();
    return highlighted.includes(key.note) || highlighted.includes(`${key.note}${key.octave}`);
  }

  // Event handlers
  onKeyDown(key: PianoKey, source: 'mouse' | 'touch' = 'mouse'): void {
    if (this.disabled()) return;

    const keyId = this.getKeyId(key);
    const keys = new Map(this.activeKeys());
    keys.set(keyId, {
      velocity: this.velocity(),
      timestamp: Date.now(),
      source,
    });
    this.activeKeys.set(keys);

    this.noteOn.emit({
      note: key.note,
      octave: key.octave,
      midi: key.midi,
      velocity: this.velocity(),
    });
  }

  onKeyUp(key: PianoKey): void {
    if (this.disabled()) return;

    const keyId = this.getKeyId(key);
    const keys = new Map(this.activeKeys());
    if (keys.has(keyId)) {
      keys.delete(keyId);
      this.activeKeys.set(keys);

      this.noteOff.emit({
        note: key.note,
        octave: key.octave,
        midi: key.midi,
        velocity: 0,
      });
    }
  }

  onTouchStart(event: TouchEvent, key: PianoKey): void {
    event.preventDefault();
    this.onKeyDown(key, 'touch');
  }

  onTouchEnd(key: PianoKey): void {
    this.onKeyUp(key);
  }

  // MIDI handling
  async initMidi(): Promise<void> {
    if (!this.enableMidi()) return;

    if (!navigator.requestMIDIAccess) {
      this.midiError.emit('Web MIDI API not supported in this browser');
      return;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.updateMidiDevices();

      // Listen for device changes
      this.midiAccess.addEventListener('statechange', () => {
        this.updateMidiDevices();
      });
    } catch (error) {
      this.midiError.emit(`MIDI access denied: ${error}`);
    }
  }

  private updateMidiDevices(): void {
    if (!this.midiAccess) return;

    const devices: MidiDevice[] = [];

    // Disconnect old inputs
    for (const input of this.midiInputs) {
      input.onmidimessage = null;
    }
    this.midiInputs = [];

    // Connect to all inputs
    this.midiAccess.inputs.forEach((input: MIDIInput) => {
      devices.push({
        id: input.id,
        name: input.name ?? 'Unknown Device',
        manufacturer: input.manufacturer ?? 'Unknown',
      });

      input.onmidimessage = (event: MIDIMessageEvent) => this.handleMidiMessage(event);
      this.midiInputs.push(input);

      if (input.state === 'connected') {
        this.connectedMidiDevice.set({
          id: input.id,
          name: input.name ?? 'Unknown Device',
          manufacturer: input.manufacturer ?? 'Unknown',
        });
        this.midiConnected.emit(this.connectedMidiDevice()!);
      }
    });

    this.availableMidiDevices.set(devices);
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data || data.length < 3) return;

    const status = data[0];
    const channel = status & 0x0f;
    const command = status & 0xf0;
    const noteNumber = data[1];
    const velocity = data[2];

    // Check channel filter
    const targetChannel = this.midiChannel();
    if (targetChannel !== -1 && channel !== targetChannel) return;

    // Note On (0x90) or Note Off (0x80)
    if (command === 0x90 && velocity > 0) {
      this.handleMidiNoteOn(noteNumber, velocity);
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      this.handleMidiNoteOff(noteNumber);
    }
  }

  private handleMidiNoteOn(midiNote: number, velocity: number): void {
    const key = this.midiToKey(midiNote);
    if (!key) return;

    const keyId = this.getKeyId(key);
    const keys = new Map(this.activeKeys());
    keys.set(keyId, {
      velocity,
      timestamp: Date.now(),
      source: 'midi',
    });
    this.activeKeys.set(keys);

    this.noteOn.emit({
      note: key.note,
      octave: key.octave,
      midi: midiNote,
      velocity,
    });
  }

  private handleMidiNoteOff(midiNote: number): void {
    const key = this.midiToKey(midiNote);
    if (!key) return;

    const keyId = this.getKeyId(key);
    const keys = new Map(this.activeKeys());
    if (keys.has(keyId)) {
      keys.delete(keyId);
      this.activeKeys.set(keys);

      this.noteOff.emit({
        note: key.note,
        octave: key.octave,
        midi: midiNote,
        velocity: 0,
      });
    }
  }

  private midiToKey(midiNote: number): PianoKey | undefined {
    const allKeys = [...this.whiteKeys(), ...this.blackKeys()];
    return allKeys.find(k => k.midi === midiNote);
  }

  disconnectMidi(): void {
    for (const input of this.midiInputs) {
      input.onmidimessage = null;
    }
    this.midiInputs = [];
    this.midiAccess = null;

    const device = this.connectedMidiDevice();
    if (device) {
      this.midiDisconnected.emit(device);
    }
    this.connectedMidiDevice.set(null);
    this.availableMidiDevices.set([]);
  }

  // Utilities
  private getKeyId(key: PianoKey): string {
    return `${key.note}${key.octave}`;
  }

  private noteToMidi(note: string, octave: number): number {
    const noteMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
    };
    return (octave + 1) * 12 + noteMap[note];
  }

  // Public methods
  pressKey(note: string, octave: number, velocity?: number): void {
    const key = this.findKey(note, octave);
    if (key) {
      const keyId = this.getKeyId(key);
      const keys = new Map(this.activeKeys());
      keys.set(keyId, {
        velocity: velocity ?? this.velocity(),
        timestamp: Date.now(),
        source: 'api',
      });
      this.activeKeys.set(keys);

      this.noteOn.emit({
        note: key.note,
        octave: key.octave,
        midi: key.midi,
        velocity: velocity ?? this.velocity(),
      });
    }
  }

  releaseKey(note: string, octave: number): void {
    const key = this.findKey(note, octave);
    if (key) {
      this.onKeyUp(key);
    }
  }

  releaseAllKeys(): void {
    this.activeKeys.set(new Map());
  }

  // Press key by MIDI note number
  pressKeyByMidi(midiNote: number, velocity?: number): void {
    const key = this.midiToKey(midiNote);
    if (key) {
      this.pressKey(key.note, key.octave, velocity);
    }
  }

  releaseKeyByMidi(midiNote: number): void {
    const key = this.midiToKey(midiNote);
    if (key) {
      this.releaseKey(key.note, key.octave);
    }
  }

  private findKey(note: string, octave: number): PianoKey | undefined {
    const allKeys = [...this.whiteKeys(), ...this.blackKeys()];
    return allKeys.find(k => k.note === note && k.octave === octave);
  }

  // Get current velocity of active note
  getActiveNoteVelocity(note: string, octave: number): number {
    const key = this.findKey(note, octave);
    if (key) {
      return this.getKeyVelocity(key);
    }
    return 0;
  }

  // Get all active notes with their velocities
  getActiveNotes(): Array<{ note: string; octave: number; midi: number; velocity: number; source: string }> {
    const result: Array<{ note: string; octave: number; midi: number; velocity: number; source: string }> = [];
    const allKeys = [...this.whiteKeys(), ...this.blackKeys()];

    for (const [keyId, activeNote] of this.activeKeys()) {
      const key = allKeys.find(k => this.getKeyId(k) === keyId);
      if (key) {
        result.push({
          note: key.note,
          octave: key.octave,
          midi: key.midi,
          velocity: activeNote.velocity,
          source: activeNote.source,
        });
      }
    }

    return result;
  }
}

