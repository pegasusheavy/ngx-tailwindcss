import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { createTheme, DEFAULT_THEME_COLORS, TW_THEME } from './theme';
import { TwThemeService } from './theme.service';

describe('TwThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('color mode', () => {
    let service: TwThemeService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(TwThemeService);
    });

    it('should default to system mode resolved as light', () => {
      expect(service.colorMode()).toBe('system');
      expect(service.resolvedColorMode()).toBe('light');
      expect(service.isDark()).toBe(false);
    });

    it('should set dark mode and update the document class', () => {
      service.setColorMode('dark');

      expect(service.colorMode()).toBe('dark');
      expect(service.resolvedColorMode()).toBe('dark');
      expect(service.isDark()).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should set light mode and remove the document class', () => {
      service.setColorMode('dark');
      service.setColorMode('light');

      expect(service.resolvedColorMode()).toBe('light');
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should persist the color mode to localStorage', () => {
      service.setColorMode('dark');
      expect(localStorage.getItem('tw-color-mode')).toBe('dark');
    });

    it('should cycle through light, dark and system modes', () => {
      service.setColorMode('light');

      service.cycleColorMode();
      expect(service.colorMode()).toBe('dark');

      service.cycleColorMode();
      expect(service.colorMode()).toBe('system');

      service.cycleColorMode();
      expect(service.colorMode()).toBe('light');
    });
  });

  describe('saved preference', () => {
    it('should restore the saved color mode on initialization', () => {
      localStorage.setItem('tw-color-mode', 'dark');

      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwThemeService);

      expect(service.colorMode()).toBe('dark');
      expect(service.isDark()).toBe(true);
    });

    it('should ignore invalid saved values', () => {
      localStorage.setItem('tw-color-mode', 'purple');

      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwThemeService);

      expect(service.colorMode()).toBe('system');
    });
  });

  describe('theme application', () => {
    it('should apply default theme colors as CSS custom properties', () => {
      TestBed.configureTestingModule({});
      TestBed.inject(TwThemeService);

      const rootStyle = document.documentElement.style;
      expect(rootStyle.getPropertyValue('--tw-color-primary')).toBe(
        DEFAULT_THEME_COLORS.primary.light
      );
      expect(rootStyle.getPropertyValue('--tw-color-text-primary')).toBe(
        DEFAULT_THEME_COLORS.textPrimary.light
      );
    });

    it('should use an injected TW_THEME', () => {
      const customTheme = createTheme({
        name: 'injected',
        colors: { primary: { light: '#111111', dark: '#222222' } },
      });

      TestBed.configureTestingModule({
        providers: [{ provide: TW_THEME, useValue: customTheme }],
      });
      const service = TestBed.inject(TwThemeService);

      expect(service.theme().name).toBe('injected');
      expect(document.documentElement.style.getPropertyValue('--tw-color-primary')).toBe('#111111');
    });

    it('should apply dark values when dark mode is active', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwThemeService);

      service.setColorMode('dark');

      expect(document.documentElement.style.getPropertyValue('--tw-color-primary')).toBe(
        DEFAULT_THEME_COLORS.primary.dark
      );
    });

    it('should re-apply colors when the theme changes', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwThemeService);

      service.setTheme(createTheme({ colors: { primary: { light: '#abcdef', dark: '#fedcba' } } }));

      expect(document.documentElement.style.getPropertyValue('--tw-color-primary')).toBe('#abcdef');
    });
  });

  describe('color helpers', () => {
    let service: TwThemeService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(TwThemeService);
    });

    it('should return the color for the resolved mode', () => {
      expect(service.getColor('primary')).toBe(DEFAULT_THEME_COLORS.primary.light);
      expect(service.getColor('primary', 'dark')).toBe(DEFAULT_THEME_COLORS.primary.dark);
    });

    it('should return an empty string for unknown colors', () => {
      const unknownColor = 'nonexistent' as unknown as keyof typeof DEFAULT_THEME_COLORS;
      expect(service.getColor(unknownColor)).toBe('');
    });

    it('should build kebab-case CSS variable references', () => {
      expect(service.getCssVar('primary')).toBe('var(--tw-color-primary)');
      expect(service.getCssVar('textPrimary')).toBe('var(--tw-color-text-primary)');
    });

    it('should build Tailwind arbitrary value classes', () => {
      expect(service.getTailwindClass('bg', 'primary')).toBe('bg-[var(--tw-color-primary)]');
      expect(service.getTailwindClass('text', 'textMuted')).toBe(
        'text-[var(--tw-color-text-muted)]'
      );
    });
  });
});
