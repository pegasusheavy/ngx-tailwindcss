import { Injectable, inject } from '@angular/core';
import { ColorMode, TwThemeService } from 'ngx-tailwindcss';

export type Theme = ColorMode;

/**
 * Thin wrapper around the library's TwThemeService so the docs shell and the
 * /theming demo share a single source of truth for the color mode.
 *
 * The library service owns persistence (localStorage 'tw-color-mode') and the
 * `<html class="dark">` toggle; this wrapper only re-exposes that API under
 * the names the docs templates already use. It never writes storage on init —
 * persistence happens only when the user picks a theme via setTheme().
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly twTheme = inject(TwThemeService);

  /** The user's theme preference */
  readonly theme = this.twTheme.colorMode.asReadonly();

  /** Whether dark mode is currently active (resolved from theme preference) */
  readonly isDark = this.twTheme.isDark.asReadonly();

  /** Set the theme preference */
  setTheme(theme: Theme): void {
    this.twTheme.setColorMode(theme);
  }

  /** Toggle between light and dark (ignores system) */
  toggleTheme(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  /** Cycle through themes: light -> dark -> system */
  cycleTheme(): void {
    this.twTheme.cycleColorMode();
  }
}
