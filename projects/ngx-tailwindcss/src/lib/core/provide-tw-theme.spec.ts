import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { provideTwTheme, withTwTheme } from './provide-tw-theme';
import { createTheme, DEFAULT_THEME, TW_THEME } from './theme';
import { TwThemeService } from './theme.service';

describe('provideTwTheme', () => {
  describe('provideTwTheme()', () => {
    it('should provide the default theme when none is given', () => {
      TestBed.configureTestingModule({
        providers: [provideTwTheme()],
      });

      expect(TestBed.inject(TW_THEME)).toBe(DEFAULT_THEME);
    });

    it('should provide a custom theme', () => {
      const customTheme = createTheme({
        name: 'branded',
        colors: { primary: { light: '#6366f1', dark: '#818cf8' } },
      });

      TestBed.configureTestingModule({
        providers: [provideTwTheme(customTheme)],
      });

      const theme = TestBed.inject(TW_THEME);
      expect(theme.name).toBe('branded');
      expect(theme.colors.primary).toEqual({ light: '#6366f1', dark: '#818cf8' });
    });

    it('should make the theme service pick up the provided theme', () => {
      const customTheme = createTheme({
        name: 'branded',
        colors: { primary: { light: '#111111', dark: '#222222' } },
      });

      TestBed.configureTestingModule({
        providers: [provideTwTheme(customTheme)],
      });

      const service = TestBed.inject(TwThemeService);
      expect(service.theme().name).toBe('branded');
      expect(service.getColor('primary', 'light')).toBe('#111111');
    });
  });

  describe('withTwTheme()', () => {
    it('should provide the given theme', () => {
      const customTheme = createTheme({ name: 'scoped' });

      TestBed.configureTestingModule({
        providers: [withTwTheme(customTheme)],
      });

      expect(TestBed.inject(TW_THEME).name).toBe('scoped');
    });
  });
});
