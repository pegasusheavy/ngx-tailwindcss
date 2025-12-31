import { Injectable, signal, computed, OnDestroy } from '@angular/core';

// ============================================================================
// TYPES
// ============================================================================

/**
 * MIDI message types
 */
export type MidiMessageType =
  | 'noteOn'
  | 'noteOff'
  | 'controlChange'
  | 'programChange'
  | 'pitchBend'
  | 'aftertouch'
  | 'channelPressure'
  | 'sysex'
  | 'clock'
  | 'start'
  | 'stop'
  | 'continue'
  | 'activeSensing'
  | 'reset'
  | 'unknown';

/**
 * Parsed MIDI message
 */
export interface MidiMessage {
  type: MidiMessageType;
  channel: number; // 0-15
  data1: number; // Note number or CC number
  data2: number; // Velocity or CC value
  timestamp: number;
  raw: Uint8Array;
}

/**
 * MIDI device info
 */
export interface MidiDeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
  type: 'input' | 'output';
  state: 'connected' | 'disconnected';
  connection: 'open' | 'closed' | 'pending';
}

/**
 * MIDI CC (Control Change) mapping
 */
export interface MidiCCMapping {
  id: string;
  ccNumber: number;
  channel: number; // -1 for any channel
  minValue: number; // Output range min
  maxValue: number; // Output range max
  inverted: boolean;
  curve: 'linear' | 'logarithmic' | 'exponential';
  description?: string;
}

/**
 * MIDI Learn state
 */
export interface MidiLearnState {
  active: boolean;
  targetId: string | null;
  lastMessage: MidiMessage | null;
  timeout: ReturnType<typeof setTimeout> | null;
}

/**
 * MIDI note info with name
 */
export interface MidiNoteInfo {
  number: number;
  name: string;
  octave: number;
  frequency: number;
}

/**
 * CC value change event
 */
export interface CCValueChangeEvent {
  mappingId: string;
  ccNumber: number;
  channel: number;
  rawValue: number;
  scaledValue: number;
}

/**
 * Note names for MIDI note numbers
 */
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Common CC numbers
 */
export const MIDI_CC = {
  MODULATION: 1,
  BREATH: 2,
  FOOT: 4,
  PORTAMENTO_TIME: 5,
  DATA_ENTRY_MSB: 6,
  VOLUME: 7,
  BALANCE: 8,
  PAN: 10,
  EXPRESSION: 11,
  EFFECT_1: 12,
  EFFECT_2: 13,
  GENERAL_1: 16,
  GENERAL_2: 17,
  GENERAL_3: 18,
  GENERAL_4: 19,
  BANK_SELECT_LSB: 32,
  SUSTAIN: 64,
  PORTAMENTO: 65,
  SOSTENUTO: 66,
  SOFT_PEDAL: 67,
  LEGATO: 68,
  HOLD_2: 69,
  RESONANCE: 71,
  RELEASE: 72,
  ATTACK: 73,
  CUTOFF: 74,
  DECAY: 75,
  VIBRATO_RATE: 76,
  VIBRATO_DEPTH: 77,
  VIBRATO_DELAY: 78,
  REVERB: 91,
  TREMOLO: 92,
  CHORUS: 93,
  DETUNE: 94,
  PHASER: 95,
  DATA_INCREMENT: 96,
  DATA_DECREMENT: 97,
  NRPN_LSB: 98,
  NRPN_MSB: 99,
  RPN_LSB: 100,
  RPN_MSB: 101,
  ALL_SOUND_OFF: 120,
  RESET_CONTROLLERS: 121,
  LOCAL_CONTROL: 122,
  ALL_NOTES_OFF: 123,
  OMNI_OFF: 124,
  OMNI_ON: 125,
  MONO_ON: 126,
  POLY_ON: 127,
} as const;

// ============================================================================
// SERVICE
// ============================================================================

/**
 * Service for Web MIDI API integration
 *
 * @example
 * ```typescript
 * // Basic usage
 * const midiService = inject(MidiService);
 *
 * // Request MIDI access
 * await midiService.requestAccess();
 *
 * // Listen for note events
 * midiService.onNoteOn((msg) => {
 *   console.log(`Note ${msg.data1} velocity ${msg.data2}`);
 * });
 *
 * // Set up CC mapping for a fader
 * midiService.addCCMapping({
 *   id: 'fader1',
 *   ccNumber: 7,
 *   channel: -1,
 *   minValue: -60,
 *   maxValue: 12,
 *   inverted: false,
 *   curve: 'linear',
 * });
 *
 * // MIDI Learn mode
 * midiService.startMidiLearn('fader1');
 * // User moves a knob on their controller...
 * // The CC is automatically mapped
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MidiService implements OnDestroy {
  // State
  private _midiAccess: MIDIAccess | null = null;
  private readonly _available = signal(false);
  private readonly _connected = signal(false);
  private readonly _inputs = signal<Map<string, MidiDeviceInfo>>(new Map());
  private readonly _outputs = signal<Map<string, MidiDeviceInfo>>(new Map());
  private readonly _activeNotes = signal<Map<number, MidiMessage>>(new Map());
  private readonly _ccMappings = signal<Map<string, MidiCCMapping>>(new Map());
  private readonly _ccValues = signal<Map<number, number>>(new Map());
  private readonly _learnState = signal<MidiLearnState>({
    active: false,
    targetId: null,
    lastMessage: null,
    timeout: null,
  });

  // Event listeners
  private noteOnListeners: Array<(msg: MidiMessage) => void> = [];
  private noteOffListeners: Array<(msg: MidiMessage) => void> = [];
  private ccListeners: Array<(event: CCValueChangeEvent) => void> = [];
  private messageListeners: Array<(msg: MidiMessage) => void> = [];
  private learnCompleteListeners: Array<(mapping: MidiCCMapping) => void> = [];

  // MIDI input references
  private connectedInputs: MIDIInput[] = [];

  // =========================================================================
  // PUBLIC SIGNALS
  // =========================================================================

  /** Whether Web MIDI API is available */
  readonly available = this._available.asReadonly();

  /** Whether MIDI access has been granted */
  readonly connected = this._connected.asReadonly();

  /** Available MIDI input devices */
  readonly inputs = computed(() => Array.from(this._inputs().values()));

  /** Available MIDI output devices */
  readonly outputs = computed(() => Array.from(this._outputs().values()));

  /** Currently active (held) notes */
  readonly activeNotes = computed(() => Array.from(this._activeNotes().values()));

  /** Current CC mappings */
  readonly ccMappings = computed(() => Array.from(this._ccMappings().values()));

  /** MIDI Learn state */
  readonly learnState = this._learnState.asReadonly();

  /** Whether MIDI Learn is active */
  readonly isLearning = computed(() => this._learnState().active);

  constructor() {
    this._available.set(this.checkMidiSupport());
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  // =========================================================================
  // MIDI ACCESS
  // =========================================================================

  /**
   * Check if Web MIDI API is supported
   */
  checkMidiSupport(): boolean {
    return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
  }

  /**
   * Request MIDI access from the browser
   * @param sysex Whether to request SysEx access (may require user permission)
   */
  async requestAccess(sysex: boolean = false): Promise<boolean> {
    if (!this._available()) {
      console.warn('Web MIDI API is not supported in this browser');
      return false;
    }

    try {
      this._midiAccess = await navigator.requestMIDIAccess({ sysex });
      this._connected.set(true);

      // Set up device listeners
      this._midiAccess.onstatechange = this.handleStateChange.bind(this);

      // Initialize device lists
      this.updateDeviceLists();

      // Connect to all inputs
      this.connectAllInputs();

      return true;
    } catch (error) {
      console.error('Failed to get MIDI access:', error);
      return false;
    }
  }

  /**
   * Disconnect from MIDI
   */
  disconnect(): void {
    // Remove input listeners
    for (const input of this.connectedInputs) {
      input.onmidimessage = null;
    }
    this.connectedInputs = [];

    // Clear state
    this._inputs.set(new Map());
    this._outputs.set(new Map());
    this._activeNotes.set(new Map());
    this._connected.set(false);
    this._midiAccess = null;

    // Clear learn state
    const learnState = this._learnState();
    if (learnState.timeout) {
      clearTimeout(learnState.timeout);
    }
    this._learnState.set({
      active: false,
      targetId: null,
      lastMessage: null,
      timeout: null,
    });
  }

  private handleStateChange(event: Event): void {
    this.updateDeviceLists();

    const midiEvent = event as MIDIConnectionEvent;
    const port = midiEvent.port;

    if (port && port.type === 'input') {
      if (port.state === 'connected') {
        this.connectInput(port as MIDIInput);
      }
    }
  }

  private updateDeviceLists(): void {
    if (!this._midiAccess) return;

    const inputs = new Map<string, MidiDeviceInfo>();
    const outputs = new Map<string, MidiDeviceInfo>();

    this._midiAccess.inputs.forEach((input, id) => {
      inputs.set(id, {
        id,
        name: input.name ?? 'Unknown Input',
        manufacturer: input.manufacturer ?? 'Unknown',
        type: 'input',
        state: input.state ?? 'disconnected',
        connection: input.connection ?? 'closed',
      });
    });

    this._midiAccess.outputs.forEach((output, id) => {
      outputs.set(id, {
        id,
        name: output.name ?? 'Unknown Output',
        manufacturer: output.manufacturer ?? 'Unknown',
        type: 'output',
        state: output.state ?? 'disconnected',
        connection: output.connection ?? 'closed',
      });
    });

    this._inputs.set(inputs);
    this._outputs.set(outputs);
  }

  private connectAllInputs(): void {
    if (!this._midiAccess) return;

    this._midiAccess.inputs.forEach(input => {
      this.connectInput(input);
    });
  }

  private connectInput(input: MIDIInput): void {
    if (this.connectedInputs.includes(input)) return;

    input.onmidimessage = this.handleMidiMessage.bind(this);
    this.connectedInputs.push(input);
  }

  // =========================================================================
  // MESSAGE HANDLING
  // =========================================================================

  private handleMidiMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data || data.length === 0) return;

    const message = this.parseMidiMessage(data, event.timeStamp);

    // Handle MIDI Learn
    if (this._learnState().active && message.type === 'controlChange') {
      this.handleLearnMessage(message);
    }

    // Update active notes
    if (message.type === 'noteOn' && message.data2 > 0) {
      this._activeNotes.update(notes => {
        const newNotes = new Map(notes);
        newNotes.set(message.data1, message);
        return newNotes;
      });
    } else if (message.type === 'noteOff' || (message.type === 'noteOn' && message.data2 === 0)) {
      this._activeNotes.update(notes => {
        const newNotes = new Map(notes);
        newNotes.delete(message.data1);
        return newNotes;
      });
    }

    // Update CC values
    if (message.type === 'controlChange') {
      this._ccValues.update(values => {
        const newValues = new Map(values);
        newValues.set(message.channel * 128 + message.data1, message.data2);
        return newValues;
      });
    }

    // Notify listeners
    this.notifyListeners(message);
  }

  private parseMidiMessage(data: Uint8Array, timestamp: number): MidiMessage {
    const status = data[0];
    const type = this.getMessageType(status);
    const channel = status & 0x0f;
    const data1 = data.length > 1 ? data[1] : 0;
    const data2 = data.length > 2 ? data[2] : 0;

    return {
      type,
      channel,
      data1,
      data2,
      timestamp,
      raw: data,
    };
  }

  private getMessageType(status: number): MidiMessageType {
    const type = status & 0xf0;

    switch (type) {
      case 0x80:
        return 'noteOff';
      case 0x90:
        return 'noteOn';
      case 0xa0:
        return 'aftertouch';
      case 0xb0:
        return 'controlChange';
      case 0xc0:
        return 'programChange';
      case 0xd0:
        return 'channelPressure';
      case 0xe0:
        return 'pitchBend';
      case 0xf0:
        switch (status) {
          case 0xf0:
            return 'sysex';
          case 0xf8:
            return 'clock';
          case 0xfa:
            return 'start';
          case 0xfb:
            return 'continue';
          case 0xfc:
            return 'stop';
          case 0xfe:
            return 'activeSensing';
          case 0xff:
            return 'reset';
          default:
            return 'unknown';
        }
      default:
        return 'unknown';
    }
  }

  private notifyListeners(message: MidiMessage): void {
    // All message listeners
    for (const listener of this.messageListeners) {
      listener(message);
    }

    // Type-specific listeners
    switch (message.type) {
      case 'noteOn':
        if (message.data2 > 0) {
          for (const listener of this.noteOnListeners) {
            listener(message);
          }
        } else {
          // Note on with velocity 0 = note off
          for (const listener of this.noteOffListeners) {
            listener(message);
          }
        }
        break;

      case 'noteOff':
        for (const listener of this.noteOffListeners) {
          listener(message);
        }
        break;

      case 'controlChange':
        this.handleCCMessage(message);
        break;
    }
  }

  // =========================================================================
  // CC MAPPING
  // =========================================================================

  /**
   * Add a CC mapping
   */
  addCCMapping(mapping: MidiCCMapping): void {
    this._ccMappings.update(mappings => {
      const newMappings = new Map(mappings);
      newMappings.set(mapping.id, mapping);
      return newMappings;
    });
  }

  /**
   * Remove a CC mapping
   */
  removeCCMapping(id: string): void {
    this._ccMappings.update(mappings => {
      const newMappings = new Map(mappings);
      newMappings.delete(id);
      return newMappings;
    });
  }

  /**
   * Get a CC mapping by ID
   */
  getCCMapping(id: string): MidiCCMapping | undefined {
    return this._ccMappings().get(id);
  }

  /**
   * Update a CC mapping
   */
  updateCCMapping(id: string, updates: Partial<MidiCCMapping>): void {
    const existing = this._ccMappings().get(id);
    if (existing) {
      this._ccMappings.update(mappings => {
        const newMappings = new Map(mappings);
        newMappings.set(id, { ...existing, ...updates });
        return newMappings;
      });
    }
  }

  /**
   * Clear all CC mappings
   */
  clearCCMappings(): void {
    this._ccMappings.set(new Map());
  }

  private handleCCMessage(message: MidiMessage): void {
    const mappings = this._ccMappings();

    for (const [id, mapping] of mappings) {
      // Check if this CC matches the mapping
      if (mapping.ccNumber !== message.data1) continue;
      if (mapping.channel !== -1 && mapping.channel !== message.channel) continue;

      // Scale the value
      const scaledValue = this.scaleValue(message.data2, mapping);

      const event: CCValueChangeEvent = {
        mappingId: id,
        ccNumber: message.data1,
        channel: message.channel,
        rawValue: message.data2,
        scaledValue,
      };

      // Notify CC listeners
      for (const listener of this.ccListeners) {
        listener(event);
      }
    }
  }

  private scaleValue(rawValue: number, mapping: MidiCCMapping): number {
    // Normalize to 0-1
    let normalized = rawValue / 127;

    // Apply curve
    switch (mapping.curve) {
      case 'logarithmic':
        normalized = Math.log(1 + normalized * 9) / Math.log(10);
        break;
      case 'exponential':
        normalized = (Math.pow(10, normalized) - 1) / 9;
        break;
      // 'linear' - no change
    }

    // Invert if needed
    if (mapping.inverted) {
      normalized = 1 - normalized;
    }

    // Scale to output range
    return mapping.minValue + normalized * (mapping.maxValue - mapping.minValue);
  }

  // =========================================================================
  // MIDI LEARN
  // =========================================================================

  /**
   * Start MIDI Learn mode for a control
   * @param targetId The ID of the control to learn
   * @param timeoutMs Timeout in milliseconds (0 = no timeout)
   */
  startMidiLearn(targetId: string, timeoutMs: number = 10000): void {
    // Clear any existing timeout
    const currentState = this._learnState();
    if (currentState.timeout) {
      clearTimeout(currentState.timeout);
    }

    // Set up timeout
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (timeoutMs > 0) {
      timeout = setTimeout(() => {
        this.cancelMidiLearn();
      }, timeoutMs);
    }

    this._learnState.set({
      active: true,
      targetId,
      lastMessage: null,
      timeout,
    });
  }

  /**
   * Cancel MIDI Learn mode
   */
  cancelMidiLearn(): void {
    const currentState = this._learnState();
    if (currentState.timeout) {
      clearTimeout(currentState.timeout);
    }

    this._learnState.set({
      active: false,
      targetId: null,
      lastMessage: null,
      timeout: null,
    });
  }

  /**
   * Complete MIDI Learn with a specific CC
   */
  completeMidiLearn(ccNumber: number, channel: number = -1): void {
    const state = this._learnState();
    if (!state.active || !state.targetId) return;

    // Get existing mapping or create new one
    const existingMapping = this._ccMappings().get(state.targetId);

    const mapping: MidiCCMapping = existingMapping
      ? { ...existingMapping, ccNumber, channel }
      : {
          id: state.targetId,
          ccNumber,
          channel,
          minValue: 0,
          maxValue: 127,
          inverted: false,
          curve: 'linear',
        };

    this.addCCMapping(mapping);

    // Notify learn complete listeners
    for (const listener of this.learnCompleteListeners) {
      listener(mapping);
    }

    // Clean up
    this.cancelMidiLearn();
  }

  private handleLearnMessage(message: MidiMessage): void {
    const state = this._learnState();
    if (!state.active || !state.targetId) return;

    // Update last message
    this._learnState.update(s => ({ ...s, lastMessage: message }));

    // Auto-complete after receiving a CC message
    this.completeMidiLearn(message.data1, message.channel);
  }

  // =========================================================================
  // MIDI OUTPUT
  // =========================================================================

  /**
   * Send a MIDI message to an output
   */
  sendMessage(outputId: string, data: number[]): void {
    if (!this._midiAccess) return;

    let output: MIDIOutput | undefined;
    this._midiAccess.outputs.forEach((o, id) => {
      if (id === outputId) {
        output = o;
      }
    });

    if (output) {
      output.send(data);
    }
  }

  /**
   * Send a Note On message
   */
  sendNoteOn(outputId: string, note: number, velocity: number = 127, channel: number = 0): void {
    this.sendMessage(outputId, [0x90 | channel, note, velocity]);
  }

  /**
   * Send a Note Off message
   */
  sendNoteOff(outputId: string, note: number, velocity: number = 0, channel: number = 0): void {
    this.sendMessage(outputId, [0x80 | channel, note, velocity]);
  }

  /**
   * Send a Control Change message
   */
  sendCC(outputId: string, cc: number, value: number, channel: number = 0): void {
    this.sendMessage(outputId, [0xb0 | channel, cc, Math.round(value)]);
  }

  /**
   * Send a Program Change message
   */
  sendProgramChange(outputId: string, program: number, channel: number = 0): void {
    this.sendMessage(outputId, [0xc0 | channel, program]);
  }

  /**
   * Send a Pitch Bend message
   */
  sendPitchBend(outputId: string, value: number, channel: number = 0): void {
    // value: -8192 to 8191, centered at 0
    const normalized = Math.round(value + 8192);
    const lsb = normalized & 0x7f;
    const msb = (normalized >> 7) & 0x7f;
    this.sendMessage(outputId, [0xe0 | channel, lsb, msb]);
  }

  /**
   * Send All Notes Off
   */
  sendAllNotesOff(outputId: string, channel: number = 0): void {
    this.sendCC(outputId, MIDI_CC.ALL_NOTES_OFF, 0, channel);
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================

  /**
   * Register a note on listener
   */
  onNoteOn(callback: (msg: MidiMessage) => void): () => void {
    this.noteOnListeners.push(callback);
    return () => {
      const index = this.noteOnListeners.indexOf(callback);
      if (index > -1) this.noteOnListeners.splice(index, 1);
    };
  }

  /**
   * Register a note off listener
   */
  onNoteOff(callback: (msg: MidiMessage) => void): () => void {
    this.noteOffListeners.push(callback);
    return () => {
      const index = this.noteOffListeners.indexOf(callback);
      if (index > -1) this.noteOffListeners.splice(index, 1);
    };
  }

  /**
   * Register a CC value change listener
   */
  onCCChange(callback: (event: CCValueChangeEvent) => void): () => void {
    this.ccListeners.push(callback);
    return () => {
      const index = this.ccListeners.indexOf(callback);
      if (index > -1) this.ccListeners.splice(index, 1);
    };
  }

  /**
   * Register a raw message listener
   */
  onMessage(callback: (msg: MidiMessage) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) this.messageListeners.splice(index, 1);
    };
  }

  /**
   * Register a MIDI Learn complete listener
   */
  onLearnComplete(callback: (mapping: MidiCCMapping) => void): () => void {
    this.learnCompleteListeners.push(callback);
    return () => {
      const index = this.learnCompleteListeners.indexOf(callback);
      if (index > -1) this.learnCompleteListeners.splice(index, 1);
    };
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Get note info from MIDI note number
   */
  getNoteInfo(noteNumber: number): MidiNoteInfo {
    const name = NOTE_NAMES[noteNumber % 12];
    const octave = Math.floor(noteNumber / 12) - 1;
    const frequency = 440 * Math.pow(2, (noteNumber - 69) / 12);

    return { number: noteNumber, name, octave, frequency };
  }

  /**
   * Get MIDI note number from note name and octave
   */
  getNoteNumber(name: string, octave: number): number {
    const noteIndex = NOTE_NAMES.indexOf(name.toUpperCase());
    if (noteIndex === -1) return -1;
    return (octave + 1) * 12 + noteIndex;
  }

  /**
   * Get current CC value
   */
  getCCValue(ccNumber: number, channel: number = 0): number {
    return this._ccValues().get(channel * 128 + ccNumber) ?? 0;
  }

  /**
   * Convert raw CC value (0-127) to a range
   */
  mapCCValue(rawValue: number, min: number, max: number): number {
    return min + (rawValue / 127) * (max - min);
  }

  /**
   * Convert a value from a range to raw CC (0-127)
   */
  unmapCCValue(value: number, min: number, max: number): number {
    return Math.round(((value - min) / (max - min)) * 127);
  }

  /**
   * Export CC mappings to JSON
   */
  exportMappings(): string {
    const mappings = Array.from(this._ccMappings().values());
    return JSON.stringify(mappings, null, 2);
  }

  /**
   * Import CC mappings from JSON
   */
  importMappings(json: string): void {
    try {
      const mappings: MidiCCMapping[] = JSON.parse(json);
      for (const mapping of mappings) {
        this.addCCMapping(mapping);
      }
    } catch (error) {
      console.error('Failed to import MIDI mappings:', error);
    }
  }
}
