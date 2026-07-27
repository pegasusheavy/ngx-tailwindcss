import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MusicAccessibilityService } from './accessibility.service';

/** Access to the service's private announcement internals for queue tests */
interface AnnouncementInternals {
  politeRegion: HTMLElement | null;
  assertiveRegion: HTMLElement | null;
  announcementQueue: Array<{ message: string; priority: string; timestamp: number }>;
  isProcessingQueue: boolean;
  processAnnouncementQueue(): void;
}

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

  describe('announcement queue', () => {
    it('should not wedge the queue pump when live regions are missing', () => {
      const internals = service as unknown as AnnouncementInternals;

      internals.politeRegion = null;
      internals.assertiveRegion = null;
      internals.announcementQueue.push({
        message: 'dropped',
        priority: 'polite',
        timestamp: Date.now(),
      });

      internals.processAnnouncementQueue();

      expect(internals.isProcessingQueue).toBe(false);
      expect(internals.announcementQueue.length).toBe(0);
    });

    it('should re-create missing live regions on announce', () => {
      const internals = service as unknown as AnnouncementInternals;

      internals.politeRegion = null;
      internals.assertiveRegion = null;

      service.announce('hello');

      expect(internals.politeRegion).not.toBeNull();
      expect(internals.assertiveRegion).not.toBeNull();
    });

    it('should coalesce queued value announcements with the same label', () => {
      const internals = service as unknown as AnnouncementInternals;

      // The first announcement is consumed immediately by the queue pump;
      // the following ones queue up while the pump is busy.
      service.announceValueChange('Volume', 10, '%');
      service.announceValueChange('Volume', 20, '%');
      service.announceValueChange('Volume', 30, '%');

      expect(internals.announcementQueue.length).toBe(1);
      expect(internals.announcementQueue[0].message).toBe('Volume: 30 %');
    });

    it('should keep announcements with different labels separate', () => {
      const internals = service as unknown as AnnouncementInternals;

      service.announceValueChange('Volume', 10, '%');
      service.announceValueChange('Volume', 20, '%');
      service.announceValueChange('Pan', -5);

      expect(internals.announcementQueue.length).toBe(2);
      expect(internals.announcementQueue.map(a => a.message)).toEqual(['Volume: 20 %', 'Pan: -5']);
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

    it('should not count its own live regions as screen reader indicators', () => {
      // The service injects aria-live regions itself; they must be excluded
      expect(service.isScreenReaderLikely()).toBe(false);

      const external = document.createElement('div');
      external.setAttribute('aria-live', 'polite');
      document.body.append(external);

      expect(service.isScreenReaderLikely()).toBe(true);

      external.remove();
    });
  });
});
