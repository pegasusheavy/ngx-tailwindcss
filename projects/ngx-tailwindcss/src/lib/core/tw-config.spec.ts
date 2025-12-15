import { describe, it, expect } from 'vitest';
import { TW_CONFIG, DEFAULT_TW_CONFIG, TwConfig } from './tw-config';

describe('TwConfig', () => {
  describe('TW_CONFIG InjectionToken', () => {
    it('should be defined', () => {
      expect(TW_CONFIG).toBeDefined();
    });

    it('should have correct token description', () => {
      expect(TW_CONFIG.toString()).toContain('TW_CONFIG');
    });
  });

  describe('DEFAULT_TW_CONFIG', () => {
    it('should have default prefix', () => {
      expect(DEFAULT_TW_CONFIG.prefix).toBe('tw');
    });

    it('should have default animation duration', () => {
      expect(DEFAULT_TW_CONFIG.animationDuration).toBe(200);
    });

    it('should have angular animations enabled by default', () => {
      expect(DEFAULT_TW_CONFIG.useAngularAnimations).toBe(true);
    });

    it('should have theme configuration', () => {
      expect(DEFAULT_TW_CONFIG.theme).toBeDefined();
    });

    it('should have primary theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.primary).toContain('bg-blue-600');
      expect(DEFAULT_TW_CONFIG.theme?.primary).toContain('text-white');
    });

    it('should have secondary theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.secondary).toContain('bg-slate-600');
    });

    it('should have success theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.success).toContain('bg-emerald-600');
    });

    it('should have warning theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.warning).toContain('bg-amber-500');
    });

    it('should have danger theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.danger).toContain('bg-rose-600');
    });

    it('should have info theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.info).toContain('bg-cyan-600');
    });

    it('should have neutral theme', () => {
      expect(DEFAULT_TW_CONFIG.theme?.neutral).toContain('bg-slate-200');
    });

    it('should include hover states in theme colors', () => {
      expect(DEFAULT_TW_CONFIG.theme?.primary).toContain('hover:bg-blue-700');
    });
  });

  describe('TwConfig interface', () => {
    it('should allow partial configuration', () => {
      const partialConfig: Partial<TwConfig> = {
        prefix: 'custom',
      };
      expect(partialConfig.prefix).toBe('custom');
    });

    it('should allow theme override', () => {
      const customConfig: TwConfig = {
        theme: {
          primary: 'bg-purple-600 text-white',
        },
      };
      expect(customConfig.theme?.primary).toBe('bg-purple-600 text-white');
    });

    it('should allow class overrides', () => {
      const configWithOverrides: TwConfig = {
        classOverrides: {
          button: {
            base: 'custom-button-base',
          },
        },
      };
      expect(configWithOverrides.classOverrides?.button?.base).toBe('custom-button-base');
    });
  });
});

