import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioContextService } from './audio-context.service';

class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
  addEventListener = vi.fn();
}

class MockAnalyserNode extends MockAudioNode {
  fftSize = 2048;
  smoothingTimeConstant = 0.8;
  minDecibels = -90;
  maxDecibels = -10;
  frequencyBinCount = 1024;
}

class MockGainNode extends MockAudioNode {
  gain = { value: 1 };
}

class MockAudioContext {
  state = 'running';
  sampleRate = 44_100;
  destination = new MockAudioNode();
  createMediaElementSource = vi.fn(() => new MockAudioNode());
  createAnalyser = vi.fn(() => new MockAnalyserNode());
  createGain = vi.fn(() => new MockGainNode());
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

describe('AudioContextService', () => {
  let service: AudioContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioContextService],
    });

    service = TestBed.inject(AudioContextService);
  });

  describe('initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should start with suspended state', () => {
      expect(service.state()).toBe('suspended');
    });

    it('should report not running initially', () => {
      expect(service.isRunning()).toBe(false);
    });

    it('should have zero sources initially', () => {
      expect(service.sourceCount()).toBe(0);
    });
  });

  describe('service methods exist', () => {
    it('should have getContext method', () => {
      expect(typeof service.getContext).toBe('function');
    });

    it('should have resume method', () => {
      expect(typeof service.resume).toBe('function');
    });

    it('should have suspend method', () => {
      expect(typeof service.suspend).toBe('function');
    });

    it('should have close method', () => {
      expect(typeof service.close).toBe('function');
    });

    it('should have connectMediaElement method', () => {
      expect(typeof service.connectMediaElement).toBe('function');
    });

    it('should have connectMediaStream method', () => {
      expect(typeof service.connectMediaStream).toBe('function');
    });

    it('should have connectAudioBuffer method', () => {
      expect(typeof service.connectAudioBuffer).toBe('function');
    });

    it('should have connectOscillator method', () => {
      expect(typeof service.connectOscillator).toBe('function');
    });

    it('should have createAnalyser method', () => {
      expect(typeof service.createAnalyser).toBe('function');
    });

    it('should have createGain method', () => {
      expect(typeof service.createGain).toBe('function');
    });

    it('should have createFilter method', () => {
      expect(typeof service.createFilter).toBe('function');
    });

    it('should have createCompressor method', () => {
      expect(typeof service.createCompressor).toBe('function');
    });

    it('should have createStereoPanner method', () => {
      expect(typeof service.createStereoPanner).toBe('function');
    });

    it('should have createDelay method', () => {
      expect(typeof service.createDelay).toBe('function');
    });

    it('should have getFrequencyData method', () => {
      expect(typeof service.getFrequencyData).toBe('function');
    });

    it('should have getTimeDomainData method', () => {
      expect(typeof service.getTimeDomainData).toBe('function');
    });

    it('should have binToFrequency method', () => {
      expect(typeof service.binToFrequency).toBe('function');
    });

    it('should have frequencyToBin method', () => {
      expect(typeof service.frequencyToBin).toBe('function');
    });
  });

  describe('media element connection tracking', () => {
    beforeEach(() => {
      vi.stubGlobal('AudioContext', MockAudioContext);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should return the existing source when connecting the same element twice', async () => {
      const element = document.createElement('audio');

      const first = await service.connectMediaElement(element);
      const second = await service.connectMediaElement(element);

      expect(second.id).toBe(first.id);
      expect(service.sourceCount()).toBe(1);
    });

    it('should report whether an element is connected', async () => {
      const element = document.createElement('audio');
      expect(service.isElementConnected(element)).toBe(false);

      await service.connectMediaElement(element);
      expect(service.isElementConnected(element)).toBe(true);

      const other = document.createElement('audio');
      expect(service.isElementConnected(other)).toBe(false);
    });

    it('should clear element tracking on disconnect', async () => {
      const element = document.createElement('audio');
      const source = await service.connectMediaElement(element);

      service.disconnectSource(source.id);

      expect(service.isElementConnected(element)).toBe(false);
      expect(service.sourceCount()).toBe(0);

      // Reconnecting after disconnect creates a fresh source
      const reconnected = await service.connectMediaElement(element);
      expect(reconnected.id).not.toBe(source.id);
    });
  });

  describe('signals', () => {
    it('should have state signal', () => {
      expect(service.state).toBeDefined();
      expect(typeof service.state()).toBe('string');
    });

    it('should have isRunning signal', () => {
      expect(service.isRunning).toBeDefined();
      expect(typeof service.isRunning()).toBe('boolean');
    });

    it('should have sourceCount signal', () => {
      expect(service.sourceCount).toBeDefined();
      expect(typeof service.sourceCount()).toBe('number');
    });

    it('should have sources signal', () => {
      expect(service.sources).toBeDefined();
      expect(Array.isArray(service.sources())).toBe(true);
    });
  });
});
