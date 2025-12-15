import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideTwConfig, withTwConfig } from './provide-tw-config';
import { TW_CONFIG, TwConfig, DEFAULT_TW_CONFIG } from './tw-config';

describe('provideTwConfig', () => {
  describe('provideTwConfig()', () => {
    it('should provide TW_CONFIG token', () => {
      TestBed.configureTestingModule({
        providers: [provideTwConfig()],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config).toBeDefined();
    });

    it('should use default config when no config provided', () => {
      TestBed.configureTestingModule({
        providers: [provideTwConfig()],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.prefix).toBe(DEFAULT_TW_CONFIG.prefix);
      expect(config.animationDuration).toBe(DEFAULT_TW_CONFIG.animationDuration);
    });

    it('should merge custom config with defaults', () => {
      TestBed.configureTestingModule({
        providers: [
          provideTwConfig({
            prefix: 'custom',
            animationDuration: 500,
          }),
        ],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.prefix).toBe('custom');
      expect(config.animationDuration).toBe(500);
      // Default values should still be present
      expect(config.useAngularAnimations).toBe(DEFAULT_TW_CONFIG.useAngularAnimations);
    });

    it('should allow custom theme configuration', () => {
      TestBed.configureTestingModule({
        providers: [
          provideTwConfig({
            theme: {
              primary: 'bg-purple-600 text-white',
              secondary: 'bg-gray-200 text-gray-800',
            },
          }),
        ],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.theme?.primary).toBe('bg-purple-600 text-white');
      expect(config.theme?.secondary).toBe('bg-gray-200 text-gray-800');
    });

    it('should allow disabling Angular animations', () => {
      TestBed.configureTestingModule({
        providers: [
          provideTwConfig({
            useAngularAnimations: false,
          }),
        ],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.useAngularAnimations).toBe(false);
    });
  });

  describe('withTwConfig()', () => {
    it('should return a provider', () => {
      const provider = withTwConfig({ prefix: 'test' }) as { provide: unknown; useValue: unknown };
      expect(provider).toBeDefined();
      expect(provider.provide).toBe(TW_CONFIG);
    });

    it('should merge config with defaults', () => {
      TestBed.configureTestingModule({
        providers: [withTwConfig({ prefix: 'component' })],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.prefix).toBe('component');
      expect(config.animationDuration).toBe(DEFAULT_TW_CONFIG.animationDuration);
    });

    it('should allow complete config override', () => {
      const customConfig: Partial<TwConfig> = {
        prefix: 'custom',
        animationDuration: 300,
        useAngularAnimations: false,
        theme: {
          primary: 'bg-indigo-500 text-white',
        },
      };

      TestBed.configureTestingModule({
        providers: [withTwConfig(customConfig)],
      });

      const config = TestBed.inject(TW_CONFIG);
      expect(config.prefix).toBe('custom');
      expect(config.animationDuration).toBe(300);
      expect(config.useAngularAnimations).toBe(false);
      expect(config.theme?.primary).toBe('bg-indigo-500 text-white');
    });
  });
});

