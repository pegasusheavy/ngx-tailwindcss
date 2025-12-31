import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { DEFAULT_THEME, TW_THEME, TwTheme } from './theme';
import { TwThemeService } from './theme.service';

/**
 * Provides ngx-tailwindcss theme configuration at the application level
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * import { provideTwTheme, createTheme } from '@pegasus-heavy/ngx-tailwindcss';
 *
 * const myTheme = createTheme({
 *   colors: {
 *     primary: { light: '#6366f1', dark: '#818cf8' },
 *     secondary: { light: '#ec4899', dark: '#f472b6' },
 *   }
 * });
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTwTheme(myTheme),
 *   ],
 * };
 * ```
 */
export function provideTwTheme(theme?: TwTheme): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TW_THEME,
      useValue: theme ?? DEFAULT_THEME,
    },
    // Initialize the theme service on app startup
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const themeService = inject(TwThemeService);
        return () => {
          // The service initializes itself in the constructor
          // This just ensures it's created at app startup
          return Promise.resolve();
        };
      },
      multi: true,
    },
  ]);
}

/**
 * Provides theme configuration as a standard provider
 * Useful for lazy-loaded modules or component-level overrides
 */
export function withTwTheme(theme: TwTheme): Provider[] {
  return [
    {
      provide: TW_THEME,
      useValue: theme,
    },
  ];
}
