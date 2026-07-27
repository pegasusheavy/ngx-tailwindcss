import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
  public showLabel = true;

  protected icons = {
    sun: faSun,
    moon: faMoon,
    system: faCircleHalfStroke,
  };

  protected readonly themeIcon = computed(() => {
    switch (this.themeService.theme()) {
      case 'light':
        return this.icons.sun;
      case 'dark':
        return this.icons.moon;
      case 'system':
        return this.icons.system;
    }
  });

  protected readonly themeLabel = computed<string>(() => {
    switch (this.themeService.theme()) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  });
}
