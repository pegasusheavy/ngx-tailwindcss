import { Provider, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { TW_CONFIG, TwConfig, DEFAULT_TW_CONFIG } from './tw-config';

/**
 * Provides ngx-tailwindcss configuration at the application level
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTwConfig({
 *       theme: {
 *         primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
 *       },
 *       animationDuration: 300,
 *     }),
 *   ],
 * };
 * ```
 */
export function provideTwConfig(config?: Partial<TwConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TW_CONFIG,
      useValue: { ...DEFAULT_TW_CONFIG, ...config },
    },
  ]);
}

/**
 * Provides ngx-tailwindcss configuration as a standard provider
 * Useful for component-level configuration overrides
 */
export function withTwConfig(config: Partial<TwConfig>): Provider {
  return {
    provide: TW_CONFIG,
    useValue: { ...DEFAULT_TW_CONFIG, ...config },
  };
}

