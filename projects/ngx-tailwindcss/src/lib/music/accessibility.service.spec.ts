import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MusicAccessibilityService } from './accessibility.service';

describe('MusicAccessibilityService', () => {
  let service: MusicAccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MusicAccessibilityService],
    });

    service = TestBed.inject(MusicAccessibilityService);
  });

  describe('initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should have preference signals', () => {
      expect(typeof service.prefersReducedMotion()).toBe('boolean');
      expect(typeof service.prefersHighContrast()).toBe('boolean');
    });

    it('should provide combined preferences object', () => {
      const prefs = service.preferences();
      expect(prefs).toBeDefined();
      expect(typeof prefs.reducedMotion).toBe('boolean');
      expect(typeof prefs.highContrast).toBe('boolean');
    });
  });

  describe('announcement methods', () => {
    it('should have announce method', () => {
      expect(typeof service.announce).toBe('function');
    });

    it('should have announceValueChange method', () => {
      expect(typeof service.announceValueChange).toBe('function');
    });

    it('should have announceStateChange method', () => {
      expect(typeof service.announceStateChange).toBe('function');
    });

    it('should have announcePlaybackStatus method', () => {
      expect(typeof service.announcePlaybackStatus).toBe('function');
    });

    it('should have announcePosition method', () => {
      expect(typeof service.announcePosition).toBe('function');
    });

    it('should have announceError method', () => {
      expect(typeof service.announceError).toBe('function');
    });
  });

  describe('motion helpers', () => {
    it('should have getAnimationDuration method', () => {
      expect(typeof service.getAnimationDuration).toBe('function');
    });

    it('should return a number from getAnimationDuration', () => {
      const duration = service.getAnimationDuration(300, 0);
      expect(typeof duration).toBe('number');
    });

    it('should have getTransitionClass method', () => {
      expect(typeof service.getTransitionClass).toBe('function');
    });

    it('should return a string from getTransitionClass', () => {
      const cls = service.getTransitionClass('transition-all', 'transition-none');
      expect(typeof cls).toBe('string');
    });
  });

  describe('high contrast helpers', () => {
    it('should have checkHighContrast method', () => {
      expect(typeof service.checkHighContrast).toBe('function');
    });

    it('should have getVariant method', () => {
      expect(typeof service.getVariant).toBe('function');
    });
  });

  describe('formatting helpers', () => {
    it('should have formatTime method', () => {
      expect(typeof service.formatTime).toBe('function');
    });

    it('should format time correctly', () => {
      const result = service.formatTime(0);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should have formatPercentage method', () => {
      expect(typeof service.formatPercentage).toBe('function');
    });

    it('should have formatFrequency method', () => {
      expect(typeof service.formatFrequency).toBe('function');
    });

    it('should have formatDecibels method', () => {
      expect(typeof service.formatDecibels).toBe('function');
    });
  });

  describe('ARIA helpers', () => {
    it('should have generateId method', () => {
      expect(typeof service.generateId).toBe('function');
    });

    it('should generate unique IDs', () => {
      const id1 = service.generateId('test');
      const id2 = service.generateId('test');

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });
  });

  describe('screen reader detection', () => {
    it('should have isScreenReaderLikely method', () => {
      expect(typeof service.isScreenReaderLikely).toBe('function');
    });

    it('should return a boolean from isScreenReaderLikely', () => {
      expect(typeof service.isScreenReaderLikely()).toBe('boolean');
    });
  });
});
