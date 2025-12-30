import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTwConfig } from '@pegasusheavy/ngx-tailwindcss';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideAnimations(),
    provideTwConfig({
      animationDuration: 200,
      theme: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
        info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      },
    }),
  ]
};
