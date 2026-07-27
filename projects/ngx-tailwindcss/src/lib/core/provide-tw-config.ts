import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { DEFAULT_TW_CONFIG, TW_CONFIG, TwConfig } from './tw-config';

/**
 * Merges a partial configuration with the defaults, deep-merging nested keys
 * so a partial `theme` or `classOverrides` override keeps the other defaults.
 */
function mergeTwConfig(config?: Partial<TwConfig>): TwConfig {
  return {
    ...DEFAULT_TW_CONFIG,
    ...config,
    theme: { ...DEFAULT_TW_CONFIG.theme, ...config?.theme },
    classOverrides: { ...DEFAULT_TW_CONFIG.classOverrides, ...config?.classOverrides },
  };
}

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
      useValue: mergeTwConfig(config),
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
    useValue: mergeTwConfig(config),
  };
}
