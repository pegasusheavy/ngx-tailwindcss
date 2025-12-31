import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-demo-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './demo-section.component.html',
})
export class DemoSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() code = '';

  protected showCode = signal(false);
  protected copied = signal(false);

  toggleCode(): void {
    this.showCode.update(v => !v);
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      console.error('Failed to copy code');
    }
  }
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() description = '';
}
