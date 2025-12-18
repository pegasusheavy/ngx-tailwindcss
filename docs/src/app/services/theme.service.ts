import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ngx-tailwindcss-theme';
  private isBrowser: boolean;

  /** The user's theme preference */
  readonly theme = signal<Theme>('system');

  /** Whether dark mode is currently active (resolved from theme preference) */
  readonly isDark = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Load saved preference
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        this.theme.set(saved);
      }

      // Initial resolution
      this.resolveTheme();

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.resolveTheme();
        }
      });

      // Effect to update DOM and save preference when theme changes
      effect(() => {
        const currentTheme = this.theme();
        this.resolveTheme();
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      });
    }
  }

  /** Set the theme preference */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /** Toggle between light and dark (ignores system) */
  toggleTheme(): void {
    const current = this.isDark();
    this.setTheme(current ? 'light' : 'dark');
  }

  /** Cycle through themes: light -> dark -> system */
  cycleTheme(): void {
    const current = this.theme();
    const next: Theme =
      current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setTheme(next);
  }

  private resolveTheme(): void {
    if (!this.isBrowser) return;

    const theme = this.theme();
    let isDark: boolean;

    if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }

    this.isDark.set(isDark);

    // Update the DOM
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

