import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <button
      (click)="themeService.cycleTheme()"
      class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out"
      [ngClass]="{
        'bg-amber-100 text-amber-700 hover:bg-amber-200': themeService.theme() === 'light',
        'bg-indigo-600 text-white hover:bg-indigo-700': themeService.theme() === 'dark',
        'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600': themeService.theme() === 'system'
      }"
      [title]="'Theme: ' + getThemeLabel() + ' (click to change)'">
      <fa-icon [icon]="getThemeIcon()" class="text-base"></fa-icon>
      @if (showLabel) {
        <span class="hidden sm:inline">{{ getThemeLabel() }}</span>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
  public showLabel = true;

  protected icons = {
    sun: faSun,
    moon: faMoon,
    system: faCircleHalfStroke,
  };

  public getThemeIcon() {
    switch (this.themeService.theme()) {
      case 'light':
        return this.icons.sun;
      case 'dark':
        return this.icons.moon;
      case 'system':
        return this.icons.system;
    }
  }

  public getThemeLabel(): string {
    switch (this.themeService.theme()) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  }
}

