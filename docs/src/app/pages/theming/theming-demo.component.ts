import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPalette,
  faMoon,
  faSun,
  faCode,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwButtonComponent,
  TwCardComponent,
  TwAlertComponent,
  TwThemeService,
} from '@quinnjr/ngx-tailwindcss';

@Component({
  selector: 'app-theming-demo',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    TwButtonComponent,
    TwCardComponent,
    TwAlertComponent,
  ],
  templateUrl: './theming-demo.component.html',
})
export class ThemingDemoComponent {
  protected readonly themeService = inject(TwThemeService);

  protected readonly icons = {
    palette: faPalette,
    moon: faMoon,
    sun: faSun,
    code: faCode,
    copy: faCopy,
    check: faCheck,
  };

  protected readonly brandColors = [
    { name: 'primary', var: '--tw-color-primary', description: 'Main brand color' },
    { name: 'primary-hover', var: '--tw-color-primary-hover', description: 'Primary hover state' },
    { name: 'secondary', var: '--tw-color-secondary', description: 'Secondary brand color' },
    { name: 'secondary-hover', var: '--tw-color-secondary-hover', description: 'Secondary hover state' },
  ];

  protected readonly semanticColors = [
    { name: 'success', var: '--tw-color-success', description: 'Success/positive state' },
    { name: 'warning', var: '--tw-color-warning', description: 'Warning/caution state' },
    { name: 'danger', var: '--tw-color-danger', description: 'Error/danger state' },
    { name: 'info', var: '--tw-color-info', description: 'Informational state' },
  ];

  protected readonly surfaceColors = [
    { name: 'background', var: '--tw-color-background', description: 'Page background' },
    { name: 'surface', var: '--tw-color-surface', description: 'Card/modal background' },
    { name: 'surface-alt', var: '--tw-color-surface-alt', description: 'Alternate surface' },
    { name: 'border', var: '--tw-color-border', description: 'Default border color' },
  ];

  protected readonly providerCode = `// app.config.ts
import { provideTwTheme, createTheme } from '@quinnjr/ngx-tailwindcss';

const customTheme = createTheme({
  colors: {
    primary: { light: '#6366f1', dark: '#818cf8' },
    secondary: { light: '#ec4899', dark: '#f472b6' },
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideTwTheme(customTheme),
  ],
};`;

  protected readonly cssOverrideCode = `:root {
  --tw-color-primary: #6366f1;
  --tw-color-primary-hover: #4f46e5;
  --tw-color-secondary: #ec4899;
}

.dark {
  --tw-color-primary: #818cf8;
  --tw-color-primary-hover: #a5b4fc;
  --tw-color-secondary: #f472b6;
}`;

  protected readonly colorModeCode = `import { TwThemeService } from '@quinnjr/ngx-tailwindcss';

export class MyComponent {
  private themeService = inject(TwThemeService);

  toggleDarkMode() {
    // Set to specific mode
    this.themeService.setColorMode('dark');

    // Or cycle through modes
    this.themeService.cycleColorMode();

    // Read current state
    console.log(this.themeService.colorMode());      // 'light' | 'dark' | 'system'
    console.log(this.themeService.resolvedColorMode()); // 'light' | 'dark'
    console.log(this.themeService.isDark());         // boolean
  }
}`;

  protected readonly tailwindCode = `<!-- Use CSS variables in Tailwind's arbitrary value syntax -->
<div class="bg-[var(--tw-color-primary)]">
  Primary background
</div>

<div class="text-[var(--tw-color-danger)]">
  Danger colored text
</div>

<div class="border-[var(--tw-color-border)]">
  Themed border
</div>`;

  protected readonly overrideCode = `<!-- Add classes to existing component styles -->
<tw-button
  variant="primary"
  classOverride="shadow-xl hover:scale-105">
  Enhanced Button
</tw-button>

<!-- Completely replace component styles -->
<tw-button
  classReplace="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full">
  Custom Button
</tw-button>`;
}

