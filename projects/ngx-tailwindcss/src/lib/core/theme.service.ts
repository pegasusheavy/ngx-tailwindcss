import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { DEFAULT_THEME, generateThemeCssProperties, TW_THEME, TwTheme } from './theme';

export type ColorMode = 'light' | 'dark' | 'system';

/**
 * Service for managing the library theme and color mode
 *
 * This service:
 * - Applies CSS custom properties for theme colors
 * - Manages light/dark mode switching
 * - Persists color mode preference to localStorage
 * - Respects system color scheme preferences
 *
 * @example
 * ```typescript
 * // In a component
 * export class MyComponent {
 *   private themeService = inject(TwThemeService);
 *
 *   toggleDarkMode() {
 *     this.themeService.setColorMode(
 *       this.themeService.colorMode() === 'dark' ? 'light' : 'dark'
 *     );
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TwThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injectedTheme = inject(TW_THEME, { optional: true });

  private readonly STORAGE_KEY = 'tw-color-mode';
  private mediaQuery: MediaQueryList | null = null;

  /** Current theme configuration */
  public readonly theme = signal<TwTheme>(this.injectedTheme ?? DEFAULT_THEME);

  /** Current color mode setting (light, dark, or system) */
  public readonly colorMode = signal<ColorMode>('system');

  /** Resolved color mode (actual light or dark, resolving 'system' to its value) */
  public readonly resolvedColorMode = signal<'light' | 'dark'>('light');

  /** Whether dark mode is currently active */
  public readonly isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();
    }
  }

  /**
   * Initializes the theme service
   */
  private initialize(): void {
    // Load saved color mode preference
    const savedMode = this.getSavedColorMode();
    if (savedMode) {
      this.colorMode.set(savedMode);
    }

    // Set up system preference detection
    this.setupSystemPreferenceListener();

    // Apply the theme
    this.applyTheme();
    this.updateColorMode();
  }

  /**
   * Sets up listener for system color scheme changes
   */
  private setupSystemPreferenceListener(): void {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    fromEvent<MediaQueryListEvent>(this.mediaQuery, 'change')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.colorMode() === 'system') {
          this.updateColorMode();
        }
      });
  }

  /**
   * Gets the saved color mode from localStorage
   */
  private getSavedColorMode(): ColorMode | null {
    if (typeof localStorage === 'undefined') return null;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return null;
  }

  /**
   * Sets the color mode
   */
  public setColorMode(mode: ColorMode): void {
    this.colorMode.set(mode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, mode);
    }

    this.updateColorMode();
  }

  /**
   * Cycles through color modes: light -> dark -> system -> light
   */
  public cycleColorMode(): void {
    const current = this.colorMode();
    const next: ColorMode = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setColorMode(next);
  }

  /**
   * Updates the resolved color mode based on current setting
   */
  private updateColorMode(): void {
    const mode = this.colorMode();
    let resolved: 'light' | 'dark';

    if (mode === 'system') {
      resolved = this.mediaQuery?.matches ? 'dark' : 'light';
    } else {
      resolved = mode;
    }

    this.resolvedColorMode.set(resolved);
    this.isDark.set(resolved === 'dark');

    // Update document class for Tailwind dark mode
    const html = this.document.documentElement;
    if (resolved === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Apply theme colors for the resolved mode
    this.applyThemeColors(resolved);
  }

  /**
   * Sets a new theme configuration
   */
  public setTheme(theme: TwTheme): void {
    this.theme.set(theme);
    this.applyTheme();
  }

  /**
   * Applies the current theme's CSS custom properties
   */
  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.applyThemeColors(this.resolvedColorMode());
  }

  /**
   * Applies theme colors for a specific color mode
   */
  private applyThemeColors(mode: 'light' | 'dark'): void {
    const theme = this.theme();
    const cssProps = generateThemeCssProperties(theme);
    const properties = mode === 'dark' ? cssProps.dark : cssProps.light;

    const root = this.document.documentElement;
    for (const [prop, value] of Object.entries(properties)) {
      root.style.setProperty(prop, value);
    }
  }

  /**
   * Gets the current value of a theme color
   */
  public getColor(colorName: keyof TwTheme['colors'], mode?: 'light' | 'dark'): string {
    const theme = this.theme();
    const colorValue = theme.colors[colorName];
    if (!colorValue) return '';

    const resolvedMode = mode ?? this.resolvedColorMode();
    return resolvedMode === 'dark' ? colorValue.dark : colorValue.light;
  }

  /**
   * Gets the CSS variable name for a theme color
   */
  public getCssVar(colorName: string): string {
    const kebabName = colorName.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `var(--tw-color-${kebabName})`;
  }

  /**
   * Gets the CSS variable reference for use in Tailwind arbitrary values
   * @example 'bg-[var(--tw-color-primary)]'
   */
  public getTailwindClass(property: 'bg' | 'text' | 'border' | 'ring', colorName: string): string {
    return `${property}-[${this.getCssVar(colorName)}]`;
  }
}
