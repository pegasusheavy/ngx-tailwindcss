import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwToastService, TwButtonComponent, ToastPosition } from '@quinnjr/ngx-tailwindcss';
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

  showAtPosition(position: ToastPosition): void {
    this.toastService.setPosition(position);
    this.toastService.show({
      variant: 'info',
      message: `Toast shown at ${position}`,
    });
  }

  showWithDuration(): void {
    this.toastService.show({
      variant: 'info',
      message: 'This toast stays for 10 seconds.',
      duration: 10_000,
    });
  }

  showWithAction(): void {
    this.toastService.show({
      variant: 'success',
      title: 'Item archived',
      message: 'The item was moved to the archive.',
      action: {
        label: 'Undo',
        onClick: () => this.toastService.info('Archive undone.'),
      },
    });
  }

  basicCode = `// Inject the service
private toastService = inject(TwToastService);

// Show toasts
this.toastService.success('Operation completed!');
this.toastService.error('An error occurred.');
this.toastService.warning('Please review.');
this.toastService.info('New updates available.');`;

  positionCode = `// Position is set on the service, not per toast
this.toastService.setPosition('top-right');
// 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

this.toastService.show({
  message: 'Toast message',
  variant: 'info',
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
