import { Component, input, output, signal, computed, effect, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  preview?: string;
}

@Component({
  selector: 'tw-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Theme Mode -->
      <div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Appearance</h3>
        <div class="flex gap-3">
          @for (mode of modes; track mode.value) {
            <button
              (click)="selectMode(mode.value)"
              [class.ring-2]="currentMode() === mode.value"
              [class.ring-blue-500]="currentMode() === mode.value"
              class="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <!-- Preview -->
              <div
                class="w-16 h-12 rounded-lg border-2 overflow-hidden"
                [class.border-blue-500]="currentMode() === mode.value"
                [class.border-slate-300]="currentMode() !== mode.value"
                [class.dark:border-slate-600]="currentMode() !== mode.value"
              >
                @switch (mode.value) {
                  @case ('light') {
                    <div class="h-full bg-white flex flex-col">
                      <div class="h-2 bg-slate-200"></div>
                      <div class="flex-1 p-1 space-y-0.5">
                        <div class="h-1 w-3/4 bg-slate-300 rounded"></div>
                        <div class="h-1 w-1/2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  }
                  @case ('dark') {
                    <div class="h-full bg-slate-900 flex flex-col">
                      <div class="h-2 bg-slate-800"></div>
                      <div class="flex-1 p-1 space-y-0.5">
                        <div class="h-1 w-3/4 bg-slate-700 rounded"></div>
                        <div class="h-1 w-1/2 bg-slate-800 rounded"></div>
                      </div>
                    </div>
                  }
                  @case ('system') {
                    <div class="h-full flex">
                      <div class="w-1/2 bg-white flex flex-col">
                        <div class="h-2 bg-slate-200"></div>
                        <div class="flex-1 p-0.5 space-y-0.5">
                          <div class="h-1 w-3/4 bg-slate-300 rounded"></div>
                        </div>
                      </div>
                      <div class="w-1/2 bg-slate-900 flex flex-col">
                        <div class="h-2 bg-slate-800"></div>
                        <div class="flex-1 p-0.5 space-y-0.5">
                          <div class="h-1 w-3/4 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  }
                }
              </div>
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{
                mode.label
              }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Accent Color -->
      <div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Accent Color</h3>
        <div class="flex flex-wrap gap-2">
          @for (color of accentColors; track color.value) {
            <button
              (click)="selectAccentColor(color.value)"
              [style.background-color]="color.value"
              [class.ring-2]="currentAccentColor() === color.value"
              [class.ring-offset-2]="currentAccentColor() === color.value"
              class="w-8 h-8 rounded-full transition-transform hover:scale-110"
              [title]="color.name"
            >
              @if (currentAccentColor() === color.value) {
                <svg
                  class="w-full h-full text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            </button>
          }
          <!-- Custom Color -->
          <label
            class="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors overflow-hidden"
            title="Custom color"
          >
            <input
              type="color"
              [value]="currentAccentColor()"
              (input)="selectAccentColor($any($event.target).value)"
              class="w-12 h-12 -m-2 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <!-- Font Size -->
      <div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Font Size</h3>
        <div class="flex items-center gap-4">
          <span class="text-xs text-slate-500">A</span>
          <input
            type="range"
            [min]="12"
            [max]="20"
            [step]="1"
            [value]="fontSize()"
            (input)="setFontSize($any($event.target).valueAsNumber)"
            class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <span class="text-lg text-slate-500">A</span>
          <span class="w-12 text-sm text-slate-600 dark:text-slate-400 text-right"
            >{{ fontSize() }}px</span
          >
        </div>
      </div>

      <!-- Theme Presets -->
      @if (presets().length > 0) {
        <div>
          <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Theme Presets</h3>
          <div class="grid grid-cols-2 gap-3">
            @for (preset of presets(); track preset.id) {
              <button
                (click)="selectPreset(preset)"
                [class.ring-2]="selectedPresetId() === preset.id"
                [class.ring-blue-500]="selectedPresetId() === preset.id"
                class="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <!-- Color Preview -->
                <div class="flex -space-x-1">
                  <div
                    class="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800"
                    [style.background-color]="preset.colors.primary"
                  ></div>
                  <div
                    class="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800"
                    [style.background-color]="preset.colors.secondary"
                  ></div>
                  <div
                    class="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800"
                    [style.background-color]="preset.colors.accent"
                  ></div>
                </div>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{
                  preset.name
                }}</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- Accessibility Options -->
      <div>
        <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Accessibility</h3>
        <div class="space-y-3">
          <!-- High Contrast -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-slate-700 dark:text-slate-300">High Contrast</span>
            <button
              (click)="toggleHighContrast()"
              [class.bg-blue-600]="highContrast()"
              [class.bg-slate-200]="!highContrast()"
              [class.dark:bg-slate-700]="!highContrast()"
              class="relative w-11 h-6 rounded-full transition-colors"
            >
              <span
                [class.translate-x-5]="highContrast()"
                [class.translate-x-0]="!highContrast()"
                class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              ></span>
            </button>
          </label>

          <!-- Reduced Motion -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-slate-700 dark:text-slate-300">Reduce Motion</span>
            <button
              (click)="toggleReducedMotion()"
              [class.bg-blue-600]="reducedMotion()"
              [class.bg-slate-200]="!reducedMotion()"
              [class.dark:bg-slate-700]="!reducedMotion()"
              class="relative w-11 h-6 rounded-full transition-colors"
            >
              <span
                [class.translate-x-5]="reducedMotion()"
                [class.translate-x-0]="!reducedMotion()"
                class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              ></span>
            </button>
          </label>
        </div>
      </div>
    </div>
  `,
})
export class TwThemeSelectorComponent {
  private readonly document = inject(DOCUMENT);

  public readonly presets = input<ThemePreset[]>([]);
  public readonly defaultMode = input<ThemeMode>('system');
  public readonly defaultAccentColor = input('#3b82f6');

  public readonly modeChanged = output<ThemeMode>();
  public readonly accentColorChanged = output<string>();
  public readonly fontSizeChanged = output<number>();
  public readonly presetSelected = output<ThemePreset>();
  public readonly highContrastChanged = output<boolean>();
  public readonly reducedMotionChanged = output<boolean>();

  public readonly currentMode = signal<ThemeMode>('system');
  public readonly currentAccentColor = signal('#3b82f6');
  public readonly fontSize = signal(14);
  public readonly selectedPresetId = signal<string | null>(null);
  public readonly highContrast = signal(false);
  public readonly reducedMotion = signal(false);

  public readonly modes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  public readonly accentColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Gray', value: '#6b7280' },
  ];

  constructor() {
    effect(() => {
      this.currentMode.set(this.defaultMode());
    });

    effect(() => {
      this.currentAccentColor.set(this.defaultAccentColor());
    });

    // Apply theme mode to document
    effect(() => {
      const mode = this.currentMode();
      const isDark =
        mode === 'dark' ||
        (mode === 'system' &&
          this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        this.document.documentElement.classList.add('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
      }
    });

    // Apply font size
    effect(() => {
      this.document.documentElement.style.fontSize = `${this.fontSize()}px`;
    });

    // Apply accent color as CSS variable
    effect(() => {
      this.document.documentElement.style.setProperty(
        '--tw-accent-color',
        this.currentAccentColor()
      );
    });
  }

  public selectMode(mode: ThemeMode): void {
    this.currentMode.set(mode);
    this.modeChanged.emit(mode);
  }

  public selectAccentColor(color: string): void {
    this.currentAccentColor.set(color);
    this.accentColorChanged.emit(color);
  }

  public setFontSize(size: number): void {
    this.fontSize.set(size);
    this.fontSizeChanged.emit(size);
  }

  public selectPreset(preset: ThemePreset): void {
    this.selectedPresetId.set(preset.id);
    this.selectAccentColor(preset.colors.primary);
    this.presetSelected.emit(preset);
  }

  public toggleHighContrast(): void {
    this.highContrast.update(v => !v);
    this.highContrastChanged.emit(this.highContrast());

    if (this.highContrast()) {
      this.document.documentElement.classList.add('high-contrast');
    } else {
      this.document.documentElement.classList.remove('high-contrast');
    }
  }

  public toggleReducedMotion(): void {
    this.reducedMotion.update(v => !v);
    this.reducedMotionChanged.emit(this.reducedMotion());

    if (this.reducedMotion()) {
      this.document.documentElement.classList.add('reduce-motion');
    } else {
      this.document.documentElement.classList.remove('reduce-motion');
    }
  }
}
