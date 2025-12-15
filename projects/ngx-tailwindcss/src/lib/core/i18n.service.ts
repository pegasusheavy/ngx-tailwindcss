import {
  Injectable,
  InjectionToken,
  inject,
  signal,
  computed,
  effect,
  LOCALE_ID,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Default translations for the component library.
 */
export interface TwTranslations {
  // Common
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
    show: string;
    hide: string;
    expand: string;
    collapse: string;
    more: string;
    less: string;
    yes: string;
    no: string;
    ok: string;
    retry: string;
    back: string;
    next: string;
    previous: string;
    first: string;
    last: string;
    of: string;
    to: string;
    from: string;
  };

  // Components
  button: {
    loading: string;
  };

  input: {
    placeholder: string;
    clearInput: string;
    showPassword: string;
    hidePassword: string;
    characterCount: string;
    maxCharacters: string;
  };

  select: {
    placeholder: string;
    noOptions: string;
    searchPlaceholder: string;
    clearSelection: string;
    selectOption: string;
    optionsAvailable: string;
  };

  modal: {
    close: string;
    closeModal: string;
  };

  alert: {
    dismiss: string;
    dismissAlert: string;
  };

  toast: {
    dismiss: string;
    dismissToast: string;
  };

  table: {
    noData: string;
    loading: string;
    sortAscending: string;
    sortDescending: string;
    sortNone: string;
    rowsPerPage: string;
    pageOf: string;
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
    selectedRows: string;
    selectRow: string;
    selectAllRows: string;
  };

  pagination: {
    page: string;
    of: string;
    goToPage: string;
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
  };

  datepicker: {
    selectDate: string;
    selectTime: string;
    today: string;
    clear: string;
    previousMonth: string;
    nextMonth: string;
    previousYear: string;
    nextYear: string;
    months: string[];
    monthsShort: string[];
    weekdays: string[];
    weekdaysShort: string[];
    weekdaysMin: string[];
  };

  timepicker: {
    selectTime: string;
    hour: string;
    minute: string;
    second: string;
    am: string;
    pm: string;
  };

  upload: {
    dragDrop: string;
    browse: string;
    or: string;
    maxFileSize: string;
    allowedTypes: string;
    uploading: string;
    uploadComplete: string;
    uploadFailed: string;
    removeFile: string;
  };

  tree: {
    expand: string;
    collapse: string;
    expandAll: string;
    collapseAll: string;
  };

  accordion: {
    expand: string;
    collapse: string;
  };

  tabs: {
    selectTab: string;
  };

  slider: {
    value: string;
    minValue: string;
    maxValue: string;
  };

  rating: {
    rating: string;
    outOf: string;
    clear: string;
  };

  stepper: {
    step: string;
    of: string;
    completed: string;
    current: string;
    upcoming: string;
  };

  avatar: {
    image: string;
    status: string;
    online: string;
    offline: string;
    away: string;
    busy: string;
  };

  chip: {
    remove: string;
    removeChip: string;
  };

  dropdown: {
    open: string;
    close: string;
    selectOption: string;
  };

  popover: {
    close: string;
  };

  sidebar: {
    open: string;
    close: string;
    navigation: string;
  };

  progress: {
    progress: string;
    complete: string;
    percent: string;
  };

  spinner: {
    loading: string;
  };

  skeleton: {
    loading: string;
  };

  breadcrumb: {
    navigation: string;
    currentPage: string;
  };

  menu: {
    menu: string;
    submenu: string;
  };

  timeline: {
    timeline: string;
    event: string;
  };

  image: {
    loading: string;
    error: string;
    preview: string;
    closePreview: string;
    zoomIn: string;
    zoomOut: string;
  };
}

/**
 * Default English translations.
 */
export const TW_DEFAULT_TRANSLATIONS: TwTranslations = {
  common: {
    loading: 'Loading...',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    clear: 'Clear',
    select: 'Select',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    noResults: 'No results found',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    required: 'Required',
    optional: 'Optional',
    show: 'Show',
    hide: 'Hide',
    expand: 'Expand',
    collapse: 'Collapse',
    more: 'More',
    less: 'Less',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    first: 'First',
    last: 'Last',
    of: 'of',
    to: 'to',
    from: 'from',
  },

  button: {
    loading: 'Loading, please wait',
  },

  input: {
    placeholder: 'Enter value',
    clearInput: 'Clear input',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    characterCount: '{count} characters',
    maxCharacters: '{count} of {max} characters',
  },

  select: {
    placeholder: 'Select an option',
    noOptions: 'No options available',
    searchPlaceholder: 'Search...',
    clearSelection: 'Clear selection',
    selectOption: 'Select option',
    optionsAvailable: '{count} options available',
  },

  modal: {
    close: 'Close',
    closeModal: 'Close modal dialog',
  },

  alert: {
    dismiss: 'Dismiss',
    dismissAlert: 'Dismiss alert',
  },

  toast: {
    dismiss: 'Dismiss',
    dismissToast: 'Dismiss notification',
  },

  table: {
    noData: 'No data available',
    loading: 'Loading data...',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    sortNone: 'No sorting',
    rowsPerPage: 'Rows per page',
    pageOf: 'Page {page} of {total}',
    firstPage: 'Go to first page',
    lastPage: 'Go to last page',
    nextPage: 'Go to next page',
    previousPage: 'Go to previous page',
    selectedRows: '{count} row(s) selected',
    selectRow: 'Select row',
    selectAllRows: 'Select all rows',
  },

  pagination: {
    page: 'Page',
    of: 'of',
    goToPage: 'Go to page {page}',
    firstPage: 'Go to first page',
    lastPage: 'Go to last page',
    nextPage: 'Go to next page',
    previousPage: 'Go to previous page',
  },

  datepicker: {
    selectDate: 'Select date',
    selectTime: 'Select time',
    today: 'Today',
    clear: 'Clear',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  },

  timepicker: {
    selectTime: 'Select time',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    am: 'AM',
    pm: 'PM',
  },

  upload: {
    dragDrop: 'Drag and drop files here',
    browse: 'Browse',
    or: 'or',
    maxFileSize: 'Maximum file size: {size}',
    allowedTypes: 'Allowed types: {types}',
    uploading: 'Uploading...',
    uploadComplete: 'Upload complete',
    uploadFailed: 'Upload failed',
    removeFile: 'Remove file',
  },

  tree: {
    expand: 'Expand',
    collapse: 'Collapse',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
  },

  accordion: {
    expand: 'Expand section',
    collapse: 'Collapse section',
  },

  tabs: {
    selectTab: 'Select {tab} tab',
  },

  slider: {
    value: 'Value: {value}',
    minValue: 'Minimum value: {value}',
    maxValue: 'Maximum value: {value}',
  },

  rating: {
    rating: 'Rating',
    outOf: 'out of {max}',
    clear: 'Clear rating',
  },

  stepper: {
    step: 'Step {current}',
    of: 'of {total}',
    completed: 'Completed',
    current: 'Current',
    upcoming: 'Upcoming',
  },

  avatar: {
    image: 'Avatar image',
    status: 'Status',
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    busy: 'Busy',
  },

  chip: {
    remove: 'Remove',
    removeChip: 'Remove {label}',
  },

  dropdown: {
    open: 'Open menu',
    close: 'Close menu',
    selectOption: 'Select option',
  },

  popover: {
    close: 'Close popover',
  },

  sidebar: {
    open: 'Open sidebar',
    close: 'Close sidebar',
    navigation: 'Navigation',
  },

  progress: {
    progress: 'Progress',
    complete: 'Complete',
    percent: '{value}% complete',
  },

  spinner: {
    loading: 'Loading',
  },

  skeleton: {
    loading: 'Loading content',
  },

  breadcrumb: {
    navigation: 'Breadcrumb navigation',
    currentPage: 'Current page',
  },

  menu: {
    menu: 'Menu',
    submenu: 'Submenu',
  },

  timeline: {
    timeline: 'Timeline',
    event: 'Event',
  },

  image: {
    loading: 'Loading image',
    error: 'Failed to load image',
    preview: 'Preview image',
    closePreview: 'Close preview',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
};

/**
 * Injection token for providing custom translations.
 */
export const TW_TRANSLATIONS = new InjectionToken<Partial<TwTranslations>>('TW_TRANSLATIONS');

/**
 * Injection token for the current locale.
 */
export const TW_LOCALE = new InjectionToken<string>('TW_LOCALE');

/**
 * RTL language codes.
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'dv'];

/**
 * Service for internationalization and localization.
 */
@Injectable({ providedIn: 'root' })
export class TwI18nService {
  private document = inject(DOCUMENT);
  private customTranslations = signal<Partial<TwTranslations> | null>(null);
  private _locale = signal<string>('en');
  private _direction = signal<'ltr' | 'rtl'>('ltr');

  /** Current locale */
  readonly locale = this._locale.asReadonly();

  /** Current text direction (ltr or rtl) */
  readonly direction = this._direction.asReadonly();

  /** Whether the current locale is RTL */
  readonly isRtl = computed(() => this._direction() === 'rtl');

  /** Current translations merged with defaults */
  readonly translations = computed(() => {
    const custom = this.customTranslations();
    if (!custom) return TW_DEFAULT_TRANSLATIONS;

    return this.deepMerge(
      TW_DEFAULT_TRANSLATIONS as unknown as Record<string, unknown>,
      custom as unknown as Record<string, unknown>
    ) as unknown as TwTranslations;
  });

  constructor() {
    // Try to detect locale from Angular's LOCALE_ID or browser
    try {
      const localeId = inject(LOCALE_ID, { optional: true });
      if (localeId) {
        this.setLocale(localeId);
      }
    } catch {
      // Use browser locale if available
      if (typeof navigator !== 'undefined') {
        this.setLocale(navigator.language || 'en');
      }
    }

    // Try to inject custom translations
    try {
      const customTranslations = inject(TW_TRANSLATIONS, { optional: true });
      if (customTranslations) {
        this.customTranslations.set(customTranslations);
      }
    } catch {
      // No custom translations provided
    }

    // Update document direction when direction changes
    effect(() => {
      const dir = this._direction();
      if (this.document.documentElement) {
        this.document.documentElement.setAttribute('dir', dir);
      }
    });
  }

  /**
   * Set the current locale.
   */
  setLocale(locale: string): void {
    this._locale.set(locale);
    const langCode = locale.split('-')[0].toLowerCase();
    this._direction.set(RTL_LANGUAGES.includes(langCode) ? 'rtl' : 'ltr');
  }

  /**
   * Set custom translations (merged with defaults).
   */
  setTranslations(translations: Partial<TwTranslations>): void {
    this.customTranslations.set(translations);
  }

  /**
   * Get a translation string with optional interpolation.
   */
  translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: unknown = this.translations();

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Interpolate parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() ?? `{${paramKey}}`;
      });
    }

    return value;
  }

  /**
   * Shorthand for translate().
   */
  t(key: string, params?: Record<string, string | number>): string {
    return this.translate(key, params);
  }

  /**
   * Get all translations for a component.
   */
  getComponentTranslations<K extends keyof TwTranslations>(component: K): TwTranslations[K] {
    return this.translations()[component];
  }

  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = this.deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }

    return result;
  }
}

/**
 * Provider function for custom translations.
 */
export function provideTwTranslations(translations: Partial<TwTranslations>) {
  return {
    provide: TW_TRANSLATIONS,
    useValue: translations,
  };
}

/**
 * Provider function for setting the locale.
 */
export function provideTwLocale(locale: string) {
  return {
    provide: TW_LOCALE,
    useValue: locale,
  };
}

