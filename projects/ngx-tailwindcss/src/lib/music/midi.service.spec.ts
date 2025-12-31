import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { MidiService, MidiMessage, MidiCCMapping, MIDI_CC } from './midi.service';

// Mock Web MIDI API
const createMockMIDIAccess = () => {
  const inputs = new Map<string, MockMIDIInput>();
  const outputs = new Map<string, MockMIDIOutput>();

  class MockMIDIInput {
    id = 'input-1';
    name = 'Test MIDI Input';
    manufacturer = 'Test';
    state: MIDIPortDeviceState = 'connected';
    connection: MIDIPortConnectionState = 'open';
    onmidimessage: ((event: MIDIMessageEvent) => void) | null = null;

    // Helper to simulate receiving a message
    simulateMessage(data: number[]): void {
      if (this.onmidimessage) {
        const event = {
          data: new Uint8Array(data),
          timeStamp: performance.now(),
        } as MIDIMessageEvent;
        this.onmidimessage(event);
      }
    }
  }

  class MockMIDIOutput {
    id = 'output-1';
    name = 'Test MIDI Output';
    manufacturer = 'Test';
    state: MIDIPortDeviceState = 'connected';
    connection: MIDIPortConnectionState = 'open';
    sentMessages: number[][] = [];

    send(data: number[]): void {
      this.sentMessages.push(data);
    }
  }

  const mockInput = new MockMIDIInput();
  const mockOutput = new MockMIDIOutput();
  inputs.set('input-1', mockInput);
  outputs.set('output-1', mockOutput);

  return {
    inputs: {
      forEach: (callback: (input: MockMIDIInput, id: string) => void) => {
        inputs.forEach(callback);
      },
      get: (id: string) => inputs.get(id),
      size: inputs.size,
    },
    outputs: {
      forEach: (callback: (output: MockMIDIOutput, id: string) => void) => {
        outputs.forEach(callback);
      },
      get: (id: string) => outputs.get(id),
      size: outputs.size,
    },
    onstatechange: null as ((event: Event) => void) | null,
    _mockInput: mockInput,
    _mockOutput: mockOutput,
  };
};

describe('MidiService', () => {
  let service: MidiService;
  let mockMidiAccess: ReturnType<typeof createMockMIDIAccess>;

  beforeEach(() => {
    mockMidiAccess = createMockMIDIAccess();

    // Mock navigator.requestMIDIAccess
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(mockMidiAccess),
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [MidiService],
    });

    service = TestBed.inject(MidiService);
  });

  afterEach(() => {
    service.disconnect();
  });

  describe('initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should detect MIDI support', () => {
      expect(service.checkMidiSupport()).toBe(true);
    });

    it('should not be connected initially', () => {
      expect(service.connected()).toBe(false);
    });
  });

  describe('requestAccess', () => {
    it('should request MIDI access and connect', async () => {
      const result = await service.requestAccess();

      expect(result).toBe(true);
      expect(service.connected()).toBe(true);
    });

    it('should populate input devices', async () => {
      await service.requestAccess();

      const inputs = service.inputs();
      expect(inputs.length).toBe(1);
      expect(inputs[0].name).toBe('Test MIDI Input');
    });

    it('should populate output devices', async () => {
      await service.requestAccess();

      const outputs = service.outputs();
      expect(outputs.length).toBe(1);
      expect(outputs[0].name).toBe('Test MIDI Output');
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clear state', async () => {
      await service.requestAccess();
      expect(service.connected()).toBe(true);

      service.disconnect();

      expect(service.connected()).toBe(false);
      expect(service.inputs().length).toBe(0);
      expect(service.outputs().length).toBe(0);
    });
  });

  describe('message parsing', () => {
    it('should parse Note On messages', async () => {
      await service.requestAccess();

      const receivedMessages: MidiMessage[] = [];
      service.onNoteOn(msg => receivedMessages.push(msg));

      // Note On: channel 0, note 60 (C4), velocity 100
      mockMidiAccess._mockInput.simulateMessage([0x90, 60, 100]);

      expect(receivedMessages.length).toBe(1);
      expect(receivedMessages[0].type).toBe('noteOn');
      expect(receivedMessages[0].channel).toBe(0);
      expect(receivedMessages[0].data1).toBe(60);
      expect(receivedMessages[0].data2).toBe(100);
    });

    it('should parse Note Off messages', async () => {
      await service.requestAccess();

      const receivedMessages: MidiMessage[] = [];
      service.onNoteOff(msg => receivedMessages.push(msg));

      // Note Off: channel 0, note 60, velocity 0
      mockMidiAccess._mockInput.simulateMessage([0x80, 60, 0]);

      expect(receivedMessages.length).toBe(1);
      expect(receivedMessages[0].type).toBe('noteOff');
      expect(receivedMessages[0].data1).toBe(60);
    });

    it('should treat Note On with velocity 0 as Note Off', async () => {
      await service.requestAccess();

      const noteOffMessages: MidiMessage[] = [];
      service.onNoteOff(msg => noteOffMessages.push(msg));

      // Note On with velocity 0 = Note Off
      mockMidiAccess._mockInput.simulateMessage([0x90, 60, 0]);

      expect(noteOffMessages.length).toBe(1);
    });

    it('should parse Control Change messages', async () => {
      await service.requestAccess();

      const receivedMessages: MidiMessage[] = [];
      service.onMessage(msg => {
        if (msg.type === 'controlChange') {
          receivedMessages.push(msg);
        }
      });

      // CC: channel 0, CC#7 (volume), value 100
      mockMidiAccess._mockInput.simulateMessage([0xb0, 7, 100]);

      expect(receivedMessages.length).toBe(1);
      expect(receivedMessages[0].type).toBe('controlChange');
      expect(receivedMessages[0].data1).toBe(7);
      expect(receivedMessages[0].data2).toBe(100);
    });
  });

  describe('active notes tracking', () => {
    it('should track active notes on Note On', async () => {
      await service.requestAccess();

      mockMidiAccess._mockInput.simulateMessage([0x90, 60, 100]);
      mockMidiAccess._mockInput.simulateMessage([0x90, 64, 80]);

      const activeNotes = service.activeNotes();
      expect(activeNotes.length).toBe(2);
    });

    it('should remove notes on Note Off', async () => {
      await service.requestAccess();

      mockMidiAccess._mockInput.simulateMessage([0x90, 60, 100]);
      mockMidiAccess._mockInput.simulateMessage([0x80, 60, 0]);

      const activeNotes = service.activeNotes();
      expect(activeNotes.length).toBe(0);
    });
  });

  describe('CC mapping', () => {
    const testMapping: MidiCCMapping = {
      id: 'test-fader',
      ccNumber: 7,
      channel: -1,
      minValue: -60,
      maxValue: 12,
      inverted: false,
      curve: 'linear',
    };

    it('should add CC mapping', () => {
      service.addCCMapping(testMapping);

      const mappings = service.ccMappings();
      expect(mappings.length).toBe(1);
      expect(mappings[0].id).toBe('test-fader');
    });

    it('should remove CC mapping', () => {
      service.addCCMapping(testMapping);
      service.removeCCMapping('test-fader');

      expect(service.ccMappings().length).toBe(0);
    });

    it('should get CC mapping by ID', () => {
      service.addCCMapping(testMapping);

      const mapping = service.getCCMapping('test-fader');
      expect(mapping).toBeDefined();
      expect(mapping?.ccNumber).toBe(7);
    });

    it('should update CC mapping', () => {
      service.addCCMapping(testMapping);
      service.updateCCMapping('test-fader', { minValue: -40 });

      const mapping = service.getCCMapping('test-fader');
      expect(mapping?.minValue).toBe(-40);
    });

    it('should emit scaled value on CC change', async () => {
      await service.requestAccess();
      service.addCCMapping(testMapping);

      const ccEvents: { mappingId: string; scaledValue: number }[] = [];
      service.onCCChange(event => ccEvents.push(event));

      // CC#7 = 64 (midpoint of 0-127)
      mockMidiAccess._mockInput.simulateMessage([0xb0, 7, 64]);

      expect(ccEvents.length).toBe(1);
      expect(ccEvents[0].mappingId).toBe('test-fader');
      // midpoint should map to value between min (-60) and max (12)
      // Just verify it's in the right range
      expect(ccEvents[0].scaledValue).toBeGreaterThan(-30);
      expect(ccEvents[0].scaledValue).toBeLessThan(-15);
    });

    it('should apply inverted mapping', async () => {
      await service.requestAccess();

      const invertedMapping: MidiCCMapping = {
        ...testMapping,
        inverted: true,
      };
      service.addCCMapping(invertedMapping);

      const ccEvents: { scaledValue: number }[] = [];
      service.onCCChange(event => ccEvents.push(event));

      // CC#7 = 0 (minimum) -> should map to maximum when inverted
      mockMidiAccess._mockInput.simulateMessage([0xb0, 7, 0]);

      expect(ccEvents[0].scaledValue).toBe(12);
    });

    it('should clear all mappings', () => {
      service.addCCMapping(testMapping);
      service.addCCMapping({ ...testMapping, id: 'test-fader-2', ccNumber: 10 });

      service.clearCCMappings();

      expect(service.ccMappings().length).toBe(0);
    });
  });

  describe('MIDI Learn', () => {
    it('should start MIDI Learn mode', () => {
      service.startMidiLearn('test-control');

      expect(service.isLearning()).toBe(true);
      expect(service.learnState().targetId).toBe('test-control');
    });

    it('should cancel MIDI Learn mode', () => {
      service.startMidiLearn('test-control');
      service.cancelMidiLearn();

      expect(service.isLearning()).toBe(false);
      expect(service.learnState().targetId).toBeNull();
    });

    it('should auto-complete learn on CC message', async () => {
      await service.requestAccess();

      const learnCompleteEvents: MidiCCMapping[] = [];
      service.onLearnComplete(mapping => learnCompleteEvents.push(mapping));

      service.startMidiLearn('test-control');

      // Send a CC message
      mockMidiAccess._mockInput.simulateMessage([0xb0, 74, 64]);

      expect(service.isLearning()).toBe(false);
      expect(learnCompleteEvents.length).toBe(1);
      expect(learnCompleteEvents[0].ccNumber).toBe(74);
    });

    it('should timeout MIDI Learn', async () => {
      vi.useFakeTimers();

      service.startMidiLearn('test-control', 1000);
      expect(service.isLearning()).toBe(true);

      vi.advanceTimersByTime(1100);

      expect(service.isLearning()).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('MIDI output', () => {
    it('should send Note On message', async () => {
      await service.requestAccess();

      service.sendNoteOn('output-1', 60, 100, 0);

      expect(mockMidiAccess._mockOutput.sentMessages).toContainEqual([0x90, 60, 100]);
    });

    it('should send Note Off message', async () => {
      await service.requestAccess();

      service.sendNoteOff('output-1', 60, 0, 0);

      expect(mockMidiAccess._mockOutput.sentMessages).toContainEqual([0x80, 60, 0]);
    });

    it('should send CC message', async () => {
      await service.requestAccess();

      service.sendCC('output-1', MIDI_CC.VOLUME, 100, 0);

      expect(mockMidiAccess._mockOutput.sentMessages).toContainEqual([0xb0, 7, 100]);
    });

    it('should send Program Change message', async () => {
      await service.requestAccess();

      service.sendProgramChange('output-1', 5, 0);

      expect(mockMidiAccess._mockOutput.sentMessages).toContainEqual([0xc0, 5]);
    });

    it('should send All Notes Off', async () => {
      await service.requestAccess();

      service.sendAllNotesOff('output-1', 0);

      expect(mockMidiAccess._mockOutput.sentMessages).toContainEqual([0xb0, 123, 0]);
    });
  });

  describe('utility methods', () => {
    it('should get note info from MIDI number', () => {
      const info = service.getNoteInfo(60);

      expect(info.name).toBe('C');
      expect(info.octave).toBe(4);
      expect(info.frequency).toBeCloseTo(261.63, 1);
    });

    it('should get MIDI number from note name', () => {
      expect(service.getNoteNumber('C', 4)).toBe(60);
      expect(service.getNoteNumber('A', 4)).toBe(69);
    });

    it('should map CC value to range', () => {
      expect(service.mapCCValue(0, 0, 100)).toBe(0);
      expect(service.mapCCValue(127, 0, 100)).toBe(100);
      expect(service.mapCCValue(64, 0, 100)).toBeCloseTo(50.4, 0);
    });

    it('should unmap value to CC', () => {
      expect(service.unmapCCValue(0, 0, 100)).toBe(0);
      expect(service.unmapCCValue(100, 0, 100)).toBe(127);
      expect(service.unmapCCValue(50, 0, 100)).toBe(64);
    });

    it('should export mappings to JSON', () => {
      service.addCCMapping({
        id: 'test',
        ccNumber: 7,
        channel: -1,
        minValue: 0,
        maxValue: 127,
        inverted: false,
        curve: 'linear',
      });

      const json = service.exportMappings();
      const parsed = JSON.parse(json);

      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('test');
    });

    it('should import mappings from JSON', () => {
      const json = JSON.stringify([
        {
          id: 'imported',
          ccNumber: 10,
          channel: 0,
          minValue: -1,
          maxValue: 1,
          inverted: false,
          curve: 'linear',
        },
      ]);

      service.importMappings(json);

      const mapping = service.getCCMapping('imported');
      expect(mapping).toBeDefined();
      expect(mapping?.ccNumber).toBe(10);
    });
  });

  describe('event listener cleanup', () => {
    it('should unsubscribe note on listener', async () => {
      await service.requestAccess();

      const messages: MidiMessage[] = [];
      const unsubscribe = service.onNoteOn(msg => messages.push(msg));

      mockMidiAccess._mockInput.simulateMessage([0x90, 60, 100]);
      expect(messages.length).toBe(1);

      unsubscribe();

      mockMidiAccess._mockInput.simulateMessage([0x90, 64, 100]);
      expect(messages.length).toBe(1); // Should not have increased
    });

    it('should unsubscribe CC listener', async () => {
      await service.requestAccess();
      service.addCCMapping({
        id: 'test',
        ccNumber: 7,
        channel: -1,
        minValue: 0,
        maxValue: 127,
        inverted: false,
        curve: 'linear',
      });

      const events: unknown[] = [];
      const unsubscribe = service.onCCChange(event => events.push(event));

      mockMidiAccess._mockInput.simulateMessage([0xb0, 7, 100]);
      expect(events.length).toBe(1);

      unsubscribe();

      mockMidiAccess._mockInput.simulateMessage([0xb0, 7, 50]);
      expect(events.length).toBe(1);
    });
  });
});

describe('MIDI_CC constants', () => {
  it('should have correct MODULATION value', () => {
    expect(MIDI_CC.MODULATION).toBe(1);
  });

  it('should have correct VOLUME value', () => {
    expect(MIDI_CC.VOLUME).toBe(7);
  });

  it('should have correct PAN value', () => {
    expect(MIDI_CC.PAN).toBe(10);
  });

  it('should have correct SUSTAIN value', () => {
    expect(MIDI_CC.SUSTAIN).toBe(64);
  });

  it('should have correct ALL_NOTES_OFF value', () => {
    expect(MIDI_CC.ALL_NOTES_OFF).toBe(123);
  });
});
