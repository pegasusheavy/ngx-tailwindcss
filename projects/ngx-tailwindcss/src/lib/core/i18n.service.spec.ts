import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  provideTwLocale,
  provideTwTranslations,
  TW_DEFAULT_TRANSLATIONS,
  TwI18nService,
} from './i18n.service';

/**
 * Overrides navigator.language for the duration of a test.
 */
function setBrowserLanguage(language: string): void {
  Object.defineProperty(window.navigator, 'language', {
    value: language,
    configurable: true,
  });
}

function restoreBrowserLanguage(): void {
  delete (window.navigator as { language?: string }).language;
}

describe('TwI18nService', () => {
  afterEach(() => {
    restoreBrowserLanguage();
  });

  describe('locale resolution', () => {
    it('should default to an ltr locale', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.locale()).toBeTruthy();
      expect(service.direction()).toBe('ltr');
      expect(service.isRtl()).toBe(false);
    });

    it('should use a provided TW_LOCALE', () => {
      TestBed.configureTestingModule({
        providers: [provideTwLocale('he')],
      });
      const service = TestBed.inject(TwI18nService);

      expect(service.locale()).toBe('he');
      expect(service.isRtl()).toBe(true);
      expect(service.direction()).toBe('rtl');
    });

    it('should prefer TW_LOCALE over LOCALE_ID', () => {
      TestBed.configureTestingModule({
        providers: [provideTwLocale('ar'), { provide: LOCALE_ID, useValue: 'fr-FR' }],
      });
      const service = TestBed.inject(TwI18nService);

      expect(service.locale()).toBe('ar');
      expect(service.isRtl()).toBe(true);
    });

    it('should use a non-default LOCALE_ID when TW_LOCALE is absent', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: LOCALE_ID, useValue: 'fa' }],
      });
      const service = TestBed.inject(TwI18nService);

      expect(service.locale()).toBe('fa');
      expect(service.isRtl()).toBe(true);
    });

    it('should fall back to the browser locale when LOCALE_ID is the default', () => {
      setBrowserLanguage('he-IL');

      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.locale()).toBe('he-IL');
      expect(service.isRtl()).toBe(true);
    });
  });

  describe('setLocale()', () => {
    it('should update locale and direction', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      service.setLocale('ar-EG');
      expect(service.locale()).toBe('ar-EG');
      expect(service.direction()).toBe('rtl');
      expect(service.isRtl()).toBe(true);

      service.setLocale('en');
      expect(service.direction()).toBe('ltr');
      expect(service.isRtl()).toBe(false);
    });
  });

  describe('translate()', () => {
    it('should return default translations', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('common.loading')).toBe('Loading...');
      expect(service.translate('modal.closeModal')).toBe('Close modal dialog');
    });

    it('should return the key for unknown translations', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('common.doesNotExist')).toBe('common.doesNotExist');
      expect(service.translate('nope.nothing')).toBe('nope.nothing');
    });

    it('should return the key for non-string values', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('common')).toBe('common');
      expect(service.translate('datepicker.months')).toBe('datepicker.months');
    });

    it('should interpolate parameters', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('input.characterCount', { count: 5 })).toBe('5 characters');
      expect(service.translate('table.pageOf', { page: 2, total: 10 })).toBe('Page 2 of 10');
    });

    it('should keep placeholders for missing parameters', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('input.characterCount', {})).toBe('{count} characters');
    });

    it('should expose the t() shorthand', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.t('common.close')).toBe('Close');
    });
  });

  describe('custom translations', () => {
    it('should merge provided translations with defaults', () => {
      TestBed.configureTestingModule({
        providers: [
          provideTwTranslations({
            common: { ...TW_DEFAULT_TRANSLATIONS.common, loading: 'Chargement...' },
          }),
        ],
      });
      const service = TestBed.inject(TwI18nService);

      expect(service.translate('common.loading')).toBe('Chargement...');
      expect(service.translate('common.close')).toBe('Close');
    });

    it('should merge translations set at runtime', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      service.setTranslations({
        common: { ...TW_DEFAULT_TRANSLATIONS.common, close: 'Fermer' },
      });

      expect(service.translate('common.close')).toBe('Fermer');
      expect(service.translate('common.loading')).toBe('Loading...');
    });
  });

  describe('getComponentTranslations()', () => {
    it('should return the translations for a component', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(TwI18nService);

      expect(service.getComponentTranslations('button')).toEqual(TW_DEFAULT_TRANSLATIONS.button);
    });
  });
});
