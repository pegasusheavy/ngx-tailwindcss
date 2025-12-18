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
} from '@pegasus-heavy/ngx-tailwindcss';

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
  template: `
    <div class="space-y-12">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <fa-icon [icon]="icons.palette" class="text-white text-xl"></fa-icon>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Theming</h1>
            <p class="text-slate-600 dark:text-slate-300">Customize colors using CSS variables</p>
          </div>
        </div>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
          ngx-tailwindcss provides a flexible theming system using CSS custom properties. You can customize the entire
          color palette by overriding CSS variables, or use Tailwind's utility classes directly.
        </p>
      </div>

      <!-- Quick Start -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Quick Start</h2>

        <tw-card [padded]="true" class="mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">1. Import the theme CSS</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">
            Add the theme CSS to your global styles file to get default CSS variables:
          </p>
          <div class="relative">
            <pre
              class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>/* In your styles.scss or styles.css */
&#64;import '&#64;pegasus-heavy/ngx-tailwindcss/styles/theme.css';</code></pre>
          </div>
        </tw-card>

        <tw-card [padded]="true" class="mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">2. Initialize the theme service (optional)</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">
            Use <code class="text-violet-600 dark:text-violet-400">provideTwTheme()</code> in your app config for
            runtime theming:
          </p>
          <div class="relative">
            <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ providerCode }}</code></pre>
          </div>
        </tw-card>

        <tw-card [padded]="true">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">3. Override CSS variables</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">
            Customize colors by overriding CSS variables in your stylesheet:
          </p>
          <div class="relative">
            <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ cssOverrideCode }}</code></pre>
          </div>
        </tw-card>
      </section>

      <!-- Color Mode Demo -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Color Mode</h2>
        <p class="text-slate-600 dark:text-slate-300 mb-6">
          The library supports light, dark, and system color modes. Use the
          <code class="text-violet-600 dark:text-violet-400">TwThemeService</code> to control the mode:
        </p>

        <tw-card [padded]="true" class="mb-6">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <tw-button (click)="themeService.setColorMode('light')" [variant]="themeService.colorMode() === 'light' ? 'primary' : 'ghost'">
              <fa-icon [icon]="icons.sun"></fa-icon>
              Light
            </tw-button>
            <tw-button (click)="themeService.setColorMode('dark')" [variant]="themeService.colorMode() === 'dark' ? 'primary' : 'ghost'">
              <fa-icon [icon]="icons.moon"></fa-icon>
              Dark
            </tw-button>
            <tw-button (click)="themeService.setColorMode('system')" [variant]="themeService.colorMode() === 'system' ? 'primary' : 'ghost'">
              System
            </tw-button>
          </div>

          <div class="text-sm text-slate-600 dark:text-slate-300">
            <p><strong>Current mode:</strong> {{ themeService.colorMode() }}</p>
            <p><strong>Resolved to:</strong> {{ themeService.resolvedColorMode() }}</p>
            <p><strong>Dark mode active:</strong> {{ themeService.isDark() }}</p>
          </div>
        </tw-card>

        <div class="relative">
          <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ colorModeCode }}</code></pre>
        </div>
      </section>

      <!-- CSS Variables Reference -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">CSS Variables Reference</h2>
        <p class="text-slate-600 dark:text-slate-300 mb-6">
          Here are all the CSS variables you can customize. Each variable has light and dark mode values:
        </p>

        <!-- Brand Colors -->
        <tw-card [padded]="true" class="mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">Brand Colors</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (color of brandColors; track color.name) {
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div class="w-10 h-10 rounded-lg shadow-inner" [style.background]="'var(' + color.var + ')'"></div>
              <div>
                <code class="text-sm font-mono text-violet-600 dark:text-violet-400">{{ color.var }}</code>
                <p class="text-xs text-slate-500 dark:text-slate-300">{{ color.description }}</p>
              </div>
            </div>
            }
          </div>
        </tw-card>

        <!-- Semantic Colors -->
        <tw-card [padded]="true" class="mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">Semantic Colors</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (color of semanticColors; track color.name) {
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div class="w-10 h-10 rounded-lg shadow-inner" [style.background]="'var(' + color.var + ')'"></div>
              <div>
                <code class="text-sm font-mono text-violet-600 dark:text-violet-400">{{ color.var }}</code>
                <p class="text-xs text-slate-500 dark:text-slate-300">{{ color.description }}</p>
              </div>
            </div>
            }
          </div>
        </tw-card>

        <!-- Surface Colors -->
        <tw-card [padded]="true" class="mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">Surface & Background</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (color of surfaceColors; track color.name) {
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div
                class="w-10 h-10 rounded-lg shadow-inner border border-slate-200 dark:border-slate-600"
                [style.background]="'var(' + color.var + ')'"></div>
              <div>
                <code class="text-sm font-mono text-violet-600 dark:text-violet-400">{{ color.var }}</code>
                <p class="text-xs text-slate-500 dark:text-slate-300">{{ color.description }}</p>
              </div>
            </div>
            }
          </div>
        </tw-card>
      </section>

      <!-- Using with Tailwind -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Using with Tailwind Classes</h2>
        <p class="text-slate-600 dark:text-slate-300 mb-6">
          You can use CSS variables directly in Tailwind's arbitrary value syntax:
        </p>

        <tw-card [padded]="true" class="mb-6">
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-[var(--tw-color-primary)] text-white">
              Using: <code>bg-[var(--tw-color-primary)]</code>
            </div>
            <div class="p-4 rounded-lg border-2 border-[var(--tw-color-success)] text-[var(--tw-color-success)]">
              Using: <code>border-[var(--tw-color-success)]</code> and <code>text-[var(--tw-color-success)]</code>
            </div>
            <div
              class="p-4 rounded-lg"
              style="background: var(--tw-color-danger-bg); color: var(--tw-color-danger-text);">
              Using inline styles with CSS variables
            </div>
          </div>
        </tw-card>

        <div class="relative">
          <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ tailwindCode }}</code></pre>
        </div>
      </section>

      <!-- Component Overrides -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Component-Level Customization</h2>
        <p class="text-slate-600 dark:text-slate-300 mb-6">
          Most components support <code class="text-violet-600 dark:text-violet-400">classOverride</code> and
          <code class="text-violet-600 dark:text-violet-400">classReplace</code> props for fine-grained control:
        </p>

        <tw-card [padded]="true" class="mb-6">
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default button:</p>
              <tw-button variant="primary">Default Primary</tw-button>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">With classOverride:</p>
              <tw-button variant="primary" classOverride="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                Gradient Override
              </tw-button>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">With classReplace:</p>
              <tw-button
                classReplace="px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors">
                Fully Custom
              </tw-button>
            </div>
          </div>
        </tw-card>

        <div class="relative">
          <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ overrideCode }}</code></pre>
        </div>
      </section>

      <!-- Dark Mode Handling -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Dark Mode</h2>
        <tw-alert variant="info" alertStyle="soft">
          <p>
            The library uses Tailwind's <code>dark:</code> variant by default, which relies on the <code>.dark</code> class on the
            <code>&lt;html&gt;</code> element. The CSS variables automatically update based on whether dark mode is active.
          </p>
        </tw-alert>

        <div class="mt-6 space-y-4">
          <p class="text-slate-600 dark:text-slate-300">
            <strong>Two approaches to dark mode:</strong>
          </p>
          <ol class="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>CSS Variables (recommended):</strong> Override <code>--tw-color-*</code> variables in
              <code>.dark {{ '{' }} {{ '}' }}</code> blocks
            </li>
            <li>
              <strong>Tailwind dark: prefix:</strong> Components use <code>dark:</code> variants which work automatically
            </li>
          </ol>
        </div>
      </section>
    </div>
  `,
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
import { provideTwTheme, createTheme } from '@pegasus-heavy/ngx-tailwindcss';

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

  protected readonly colorModeCode = `import { TwThemeService } from '@pegasus-heavy/ngx-tailwindcss';

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

