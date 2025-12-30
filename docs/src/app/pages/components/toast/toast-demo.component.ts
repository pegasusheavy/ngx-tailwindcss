import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwToastService, TwButtonComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './toast-demo.component.html',
})
export class ToastDemoComponent {
  private toastService = inject(TwToastService);

  showSuccess(): void {
    this.toastService.success('Operation completed successfully!');
  }

  showError(): void {
    this.toastService.error('An error occurred. Please try again.');
  }

  showWarning(): void {
    this.toastService.warning('Please review your input.');
  }

  showInfo(): void {
    this.toastService.info('New updates are available.');
  }

  basicCode = `// Inject the service
private toastService = inject(TwToastService);

// Show toasts
this.toastService.success('Operation completed!');
this.toastService.error('An error occurred.');
this.toastService.warning('Please review.');
this.toastService.info('New updates available.');`;

  positionCode = `this.toastService.show({
  message: 'Toast message',
  variant: 'success',
  position: 'top-right', // 'top-left', 'top-center', 'bottom-right', etc.
});`;

  optionsCode = `this.toastService.show({
  message: 'Custom toast',
  variant: 'info',
  duration: 5000, // 5 seconds
  dismissible: true,
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked'),
  },
});`;
}
