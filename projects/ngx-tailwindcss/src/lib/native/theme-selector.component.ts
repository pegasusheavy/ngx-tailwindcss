import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
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
  templateUrl: './theme-selector.component.html',
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

  public readonly modes: Array<{ value: ThemeMode; label: string }> = [
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
