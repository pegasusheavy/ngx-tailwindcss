import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AudioContextService } from './audio-context.service';

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
