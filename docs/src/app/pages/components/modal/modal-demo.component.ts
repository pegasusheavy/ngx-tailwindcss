import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwModalComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
  TwModalBodyComponent,
  TwModalFooterComponent,
  TwConfirmDialogComponent,
  TwButtonComponent,
  TwInputComponent,
} from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwModalComponent,
    TwModalHeaderComponent,
    TwModalTitleComponent,
    TwModalBodyComponent,
    TwModalFooterComponent,
    TwConfirmDialogComponent,
    TwButtonComponent,
    TwInputComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  basicModal = signal(false);
  formModal = signal(false);
  confirmDialog = signal(false);
  largeModal = signal(false);

  // Code examples
  basicCode = `// In your component
isOpen = signal(false);

// In your template
<tw-button variant="primary" (click)="isOpen.set(true)">Open Modal</tw-button>

<tw-modal [(open)]="isOpen" size="md">
  <tw-modal-header>
    <tw-modal-title>Modal Title</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <p>This is the modal content.</p>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="isOpen.set(false)">Cancel</tw-button>
    <tw-button variant="primary" (click)="isOpen.set(false)">Save</tw-button>
  </tw-modal-footer>
</tw-modal>`;

  formCode = `<tw-modal [(open)]="formModal" size="md">
  <tw-modal-header>
    <tw-modal-title>Edit Profile</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <div class="space-y-4">
      <tw-input label="Full Name" placeholder="Enter your name"></tw-input>
      <tw-input label="Email" type="email" placeholder="you@example.com"></tw-input>
      <tw-input label="Username" placeholder="@username"></tw-input>
    </div>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="formModal.set(false)">Cancel</tw-button>
    <tw-button variant="primary" (click)="formModal.set(false)">Save</tw-button>
  </tw-modal-footer>
</tw-modal>`;

  confirmCode = `<tw-confirm-dialog
  [(open)]="confirmDialog"
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  (confirm)="onConfirm()"
  (cancel)="onCancel()">
</tw-confirm-dialog>`;

  largeCode = `<tw-modal [(open)]="largeModal" size="xl">
  <tw-modal-header>
    <tw-modal-title>Terms and Conditions</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <div class="prose prose-slate max-w-none">
      <p>Lorem ipsum dolor sit amet...</p>
    </div>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="largeModal.set(false)">Decline</tw-button>
    <tw-button variant="primary" (click)="largeModal.set(false)">Accept</tw-button>
  </tw-modal-footer>
</tw-modal>

<!-- Available sizes: sm, md, lg, xl, full -->`;
}
