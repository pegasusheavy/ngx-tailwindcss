import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwOverlayComponent, TwCardComponent, TwButtonComponent } from 'ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwOverlayComponent,
    TwCardComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './overlay-demo.component.html',
})
export class OverlayDemoComponent {
  basicOpen = signal(false);
  nonDismissibleOpen = signal(false);
  modalOpen = signal(false);
  drawerOpen = signal(false);
  lightboxImage = signal<{ id: number; thumb: string; full: string; alt: string } | null>(null);

  currentOpacity = signal<'light' | 'medium' | 'dark' | 'solid' | null>(null);
  currentBlur = signal<'none' | 'sm' | 'md' | 'lg' | null>(null);

  opacities: { label: string; value: 'light' | 'medium' | 'dark' | 'solid' }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Medium', value: 'medium' },
    { label: 'Dark', value: 'dark' },
    { label: 'Solid', value: 'solid' },
  ];

  blurs: { label: string; value: 'none' | 'sm' | 'md' | 'lg' }[] = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  images = [
    { id: 1, thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop', full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', alt: 'Mountain landscape' },
    { id: 2, thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop', full: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', alt: 'Nature scene' },
    { id: 3, thumb: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200&h=200&fit=crop', full: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200', alt: 'Forest path' },
  ];

  openOverlay(opacity: 'light' | 'medium' | 'dark' | 'solid') {
    this.currentOpacity.set(opacity);
  }

  openBlur(blur: 'none' | 'sm' | 'md' | 'lg') {
    this.currentBlur.set(blur);
  }

  openLightbox(img: { id: number; thumb: string; full: string; alt: string }) {
    this.lightboxImage.set(img);
  }

  basicCode = `<tw-button (click)="isOpen = true">Open</tw-button>

<tw-overlay [visible]="isOpen" (close)="isOpen = false">
  <tw-card [padded]="true">
    <h3>Overlay Content</h3>
    <tw-button (click)="isOpen = false">Close</tw-button>
  </tw-card>
</tw-overlay>`;

  opacityCode = `<!-- Light (25% black) -->
<tw-overlay opacity="light">...</tw-overlay>

<!-- Medium (50% black) - default -->
<tw-overlay opacity="medium">...</tw-overlay>

<!-- Dark (75% black) -->
<tw-overlay opacity="dark">...</tw-overlay>

<!-- Solid (100% black) -->
<tw-overlay opacity="solid">...</tw-overlay>`;

  blurCode = `<!-- No blur -->
<tw-overlay blur="none">...</tw-overlay>

<!-- Small blur -->
<tw-overlay blur="sm" opacity="light">...</tw-overlay>

<!-- Medium blur -->
<tw-overlay blur="md" opacity="light">...</tw-overlay>

<!-- Large blur -->
<tw-overlay blur="lg" opacity="light">...</tw-overlay>`;

  nonDismissibleCode = `<tw-overlay
  [visible]="isOpen"
  [closeOnClick]="false"
  [closeOnEscape]="false"
  (close)="isOpen = false">
  <tw-card>
    <p>Must click button to close</p>
    <tw-button (click)="isOpen = false">Close</tw-button>
  </tw-card>
</tw-overlay>`;

  modalCode = `<tw-overlay [visible]="isOpen" blur="sm" (close)="isOpen = false">
  <tw-card class="max-w-lg">
    <div class="p-6 border-b">
      <h3>Modal Title</h3>
    </div>
    <div class="p-6">
      Modal content...
    </div>
    <div class="p-6 bg-slate-50 flex justify-end gap-3">
      <tw-button variant="ghost">Cancel</tw-button>
      <tw-button>Confirm</tw-button>
    </div>
  </tw-card>
</tw-overlay>`;

  drawerCode = `<tw-overlay [visible]="isOpen" [centered]="false" (close)="isOpen = false">
  <aside class="fixed right-0 top-0 h-full w-80 bg-white">
    <!-- Drawer content -->
  </aside>
</tw-overlay>`;

  lightboxCode = `<tw-overlay [visible]="!!image" opacity="dark" (close)="image = null">
  @if (image) {
    <img [src]="image.full" class="max-h-[80vh]" />
  }
</tw-overlay>`;

  readonly overlayCardClass = 'max-w-md bg-white dark:bg-slate-800 dark:shadow-slate-900/50 duration-200 hover:shadow-xl p-6 rounded-xl shadow-lg transition-all';
  readonly modalCardClass = 'max-w-lg w-full mx-4 bg-white dark:bg-slate-900/80 rounded-2xl shadow-2xl overflow-hidden';
}

