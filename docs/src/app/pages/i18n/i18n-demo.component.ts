import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TwI18nService,
  TwTranslations,
  TwCardComponent,
  TwCardHeaderDirective,
  TwCardTitleDirective,
  TwCardBodyDirective,
} from 'ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../shared/demo-section.component';

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

@Component({
  selector: 'app-i18n-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwCardComponent,
    TwCardHeaderDirective,
    TwCardTitleDirective,
    TwCardBodyDirective,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './i18n-demo.component.html',
})
export class I18nDemoComponent {
  i18nService = inject(TwI18nService);

  // Demo state
  selectedLocale = signal('en');
  translationKey = signal('common.loading');

  locales = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ar', label: 'العربية (RTL)' },
    { value: 'he', label: 'עברית (RTL)' },
  ];

  commonKeys = [
    'common.loading',
    'common.close',
    'common.cancel',
    'common.confirm',
    'common.save',
    'common.delete',
    'common.search',
    'common.noResults',
    'button.loading',
    'input.clearInput',
    'modal.closeModal',
    'table.noData',
    'pagination.nextPage',
  ];

  // Small in-demo translation bundles so the live panel actually changes.
  // (Nested objects are partial; the service deep-merges them over the
  // English defaults at runtime.)
  private readonly demoTranslations = {
    es: {
      common: {
        loading: 'Cargando...',
        close: 'Cerrar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        search: 'Buscar',
        noResults: 'No se encontraron resultados',
      },
      button: { loading: 'Cargando, por favor espere' },
      input: { clearInput: 'Borrar entrada' },
      modal: { closeModal: 'Cerrar ventana modal' },
      table: { noData: 'No hay datos disponibles', pageOf: 'Página {page} de {total}' },
      pagination: { nextPage: 'Ir a la página siguiente' },
    },
    fr: {
      common: {
        loading: 'Chargement...',
        close: 'Fermer',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        delete: 'Supprimer',
        search: 'Rechercher',
        noResults: 'Aucun résultat trouvé',
      },
      button: { loading: 'Chargement, veuillez patienter' },
      input: { clearInput: 'Effacer la saisie' },
      modal: { closeModal: 'Fermer la fenêtre modale' },
      table: { noData: 'Aucune donnée disponible', pageOf: 'Page {page} sur {total}' },
      pagination: { nextPage: 'Page suivante' },
    },
    de: {
      common: {
        loading: 'Wird geladen...',
        close: 'Schließen',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        save: 'Speichern',
        delete: 'Löschen',
        search: 'Suchen',
        noResults: 'Keine Ergebnisse gefunden',
      },
      button: { loading: 'Wird geladen, bitte warten' },
      input: { clearInput: 'Eingabe löschen' },
      modal: { closeModal: 'Modales Fenster schließen' },
      table: { noData: 'Keine Daten verfügbar', pageOf: 'Seite {page} von {total}' },
      pagination: { nextPage: 'Nächste Seite' },
    },
    ar: {
      common: {
        loading: 'جارٍ التحميل...',
        close: 'إغلاق',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        save: 'حفظ',
        delete: 'حذف',
        search: 'بحث',
        noResults: 'لا توجد نتائج',
      },
      button: { loading: 'جارٍ التحميل، يرجى الانتظار' },
      input: { clearInput: 'مسح الإدخال' },
      modal: { closeModal: 'إغلاق النافذة' },
      table: { noData: 'لا توجد بيانات', pageOf: 'صفحة {page} من {total}' },
      pagination: { nextPage: 'الصفحة التالية' },
    },
    he: {
      common: {
        loading: 'טוען...',
        close: 'סגור',
        cancel: 'ביטול',
        confirm: 'אישור',
        save: 'שמור',
        delete: 'מחק',
        search: 'חיפוש',
        noResults: 'לא נמצאו תוצאות',
      },
      button: { loading: 'טוען, אנא המתן' },
      input: { clearInput: 'נקה קלט' },
      modal: { closeModal: 'סגור חלון' },
      table: { noData: 'אין נתונים זמינים', pageOf: 'עמוד {page} מתוך {total}' },
      pagination: { nextPage: 'העמוד הבא' },
    },
  } as Record<string, DeepPartial<TwTranslations>>;

  changeLocale(locale: string): void {
    this.selectedLocale.set(locale);
    this.i18nService.setLocale(locale);
    // Register the demo bundle for this locale (empty object resets to the
    // English defaults).
    this.i18nService.setTranslations((this.demoTranslations[locale] ?? {}) as Partial<TwTranslations>);
  }

  getTranslation(key: string): string {
    return this.i18nService.translate(key);
  }

  getInterpolatedTranslation(): string {
    return this.i18nService.translate('table.pageOf', { page: 3, total: 10 });
  }

  // Code examples
  setupCode = `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTwTranslations, provideTwLocale } from 'ngx-tailwindcss';

// Spanish translations
const spanishTranslations = {
  common: {
    loading: 'Cargando...',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    search: 'Buscar',
    noResults: 'No se encontraron resultados',
  },
  button: {
    loading: 'Cargando, por favor espere',
  },
  modal: {
    close: 'Cerrar',
    closeModal: 'Cerrar ventana modal',
  },
  // ... more translations
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide custom translations
    provideTwTranslations(spanishTranslations),

    // Optionally set default locale
    provideTwLocale('es-ES'),
  ],
};`;

  serviceCode = `import { TwI18nService } from 'ngx-tailwindcss';

@Component({...})
export class MyComponent {
  private i18n = inject(TwI18nService);

  // Get current locale
  get currentLocale() {
    return this.i18n.locale();
  }

  // Check text direction
  get isRtl() {
    return this.i18n.isRtl();
  }

  // Simple translation
  get loadingText() {
    return this.i18n.translate('common.loading');
    // or shorthand: this.i18n.t('common.loading')
  }

  // Translation with interpolation
  get pageInfo() {
    return this.i18n.translate('table.pageOf', {
      page: this.currentPage,
      total: this.totalPages
    });
    // "Page 3 of 10"
  }

  // Change locale at runtime
  switchLanguage(locale: string) {
    this.i18n.setLocale(locale);
  }

  // Get all translations for a component
  get tableTranslations() {
    return this.i18n.getComponentTranslations('table');
  }
}`;

  rtlCode = `// RTL is automatically detected for these languages:
// Arabic (ar), Hebrew (he), Persian/Farsi (fa), Urdu (ur),
// Pashto (ps), Sindhi (sd), Yiddish (yi), Divehi (dv)

// The service automatically sets dir="rtl" on <html>
// when an RTL locale is detected.

// Check RTL status in your component:
@Component({
  template: \`
    <div [class.rtl]="i18n.isRtl()">
      <p [style.text-align]="i18n.isRtl() ? 'right' : 'left'">
        {{ i18n.t('common.greeting') }}
      </p>
    </div>
  \`
})
export class MyComponent {
  i18n = inject(TwI18nService);
}`;

  translationInterfaceCode = `// The TwTranslations interface defines all translatable strings
interface TwTranslations {
  common: {
    loading: string;
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    search: string;
    clear: string;
    select: string;
    selectAll: string;
    deselectAll: string;
    noResults: string;
    noData: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    // ... and more
  };

  button: { loading: string; };

  input: {
    placeholder: string;
    clearInput: string;
    showPassword: string;
    hidePassword: string;
    characterCount: string;  // "{count} characters"
    maxCharacters: string;   // "{count} of {max} characters"
  };

  select: {
    placeholder: string;
    noOptions: string;
    searchPlaceholder: string;
    clearSelection: string;
    selectOption: string;
    optionsAvailable: string; // "{count} options available"
  };

  modal: { close: string; closeModal: string; };
  alert: { dismiss: string; dismissAlert: string; };
  toast: { dismiss: string; dismissToast: string; };

  table: {
    noData: string;
    loading: string;
    sortAscending: string;
    sortDescending: string;
    rowsPerPage: string;
    pageOf: string;          // "Page {page} of {total}"
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
    selectedRows: string;    // "{count} row(s) selected"
  };

  pagination: {
    page: string;
    of: string;
    goToPage: string;        // "Go to page {page}"
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
  };

  datepicker: {
    selectDate: string;
    today: string;
    clear: string;
    months: string[];        // Full month names
    monthsShort: string[];   // Abbreviated month names
    weekdays: string[];      // Full weekday names
    weekdaysShort: string[]; // Abbreviated weekday names
    weekdaysMin: string[];   // Minimal weekday names (Su, Mo, etc.)
  };

  // ... plus translations for all 30+ components
}`;

  interpolationCode = `// Translation strings can include placeholders with {paramName} syntax

// In your translation file:
{
  "table": {
    "pageOf": "Page {page} of {total}",
    "selectedRows": "{count} row(s) selected"
  },
  "input": {
    "maxCharacters": "{count} of {max} characters"
  }
}

// In your component:
this.i18n.translate('table.pageOf', { page: 3, total: 10 });
// → "Page 3 of 10"

this.i18n.translate('table.selectedRows', { count: 5 });
// → "5 row(s) selected"

this.i18n.translate('input.maxCharacters', { count: 45, max: 100 });
// → "45 of 100 characters"`;
}

