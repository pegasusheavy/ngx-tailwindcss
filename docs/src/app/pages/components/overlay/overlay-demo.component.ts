import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwOverlayComponent, TwCardComponent, TwButtonComponent } from '@pegasusheavy/ngx-tailwindcss';
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
  template: `
    <app-page-header
      title="Overlay"
      description="Backdrop overlay component for modals, drawers, and lightboxes.">
    </app-page-header>

    <!-- Basic Usage -->
    <app-demo-section title="Basic Usage" [code]="basicCode">
      <tw-button (click)="basicOpen.set(true)">Open Basic Overlay</tw-button>

      <tw-overlay class="z-50" [visible]="basicOpen()" (close)="basicOpen.set(false)">
        <tw-card [padded]="true" [class]="overlayCardClass">
          <h3 class="text-lg font-semibold mb-2">Basic Overlay</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">Click outside or press Escape to close.</p>
          <tw-button (click)="basicOpen.set(false)">Close</tw-button>
        </tw-card>
      </tw-overlay>
    </app-demo-section>

    <!-- Opacity Levels -->
    <app-demo-section title="Opacity Levels" [code]="opacityCode">
      <div class="flex flex-wrap gap-3">
        @for (opacity of opacities; track opacity.value) {
          <tw-button variant="outline" (click)="openOverlay(opacity.value)">
            {{ opacity.label }}
          </tw-button>
        }
      </div>

      @for (opacity of opacities; track opacity.value) {
        <tw-overlay
          class="z-50"
          [visible]="currentOpacity() === opacity.value"
          [opacity]="opacity.value"
          (close)="currentOpacity.set(null)">
          <tw-card [padded]="true" [class]="overlayCardClass">
            <h3 class="text-lg font-semibold mb-2">{{ opacity.label }} Opacity</h3>
            <p class="text-slate-600 dark:text-slate-300 mb-4">Opacity: {{ opacity.value }}</p>
            <tw-button (click)="currentOpacity.set(null)">Close</tw-button>
          </tw-card>
        </tw-overlay>
      }
    </app-demo-section>

    <!-- With Blur Effect -->
    <app-demo-section title="Blur Effect" [code]="blurCode">
      <div class="flex flex-wrap gap-3">
        @for (blur of blurs; track blur.value) {
          <tw-button variant="outline" (click)="openBlur(blur.value)">
            {{ blur.label }}
          </tw-button>
        }
      </div>

      @for (blur of blurs; track blur.value) {
        <tw-overlay
          class="z-50"
          [visible]="currentBlur() === blur.value"
          [blur]="blur.value"
          opacity="light"
          (close)="currentBlur.set(null)">
          <tw-card [padded]="true" [class]="overlayCardClass">
            <h3 class="text-lg font-semibold mb-2">{{ blur.label }} Blur</h3>
            <p class="text-slate-600 dark:text-slate-300 mb-4">Background blur effect: {{ blur.value }}</p>
            <tw-button (click)="currentBlur.set(null)">Close</tw-button>
          </tw-card>
        </tw-overlay>
      }
    </app-demo-section>

    <!-- Non-dismissible -->
    <app-demo-section title="Non-dismissible Overlay" [code]="nonDismissibleCode">
      <tw-button (click)="nonDismissibleOpen.set(true)">Open Non-dismissible</tw-button>

      <tw-overlay
        class="z-50"
        [visible]="nonDismissibleOpen()"
        [closeOnClick]="false"
        [closeOnEscape]="false"
        (close)="nonDismissibleOpen.set(false)">
        <tw-card [padded]="true" [class]="overlayCardClass">
          <h3 class="text-lg font-semibold mb-2">Important Action Required</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">
            This overlay cannot be dismissed by clicking outside or pressing Escape.
            You must click the button to close it.
          </p>
          <tw-button (click)="nonDismissibleOpen.set(false)">I Understand</tw-button>
        </tw-card>
      </tw-overlay>
    </app-demo-section>

    <!-- Modal Dialog Example -->
    <app-demo-section title="Modal Dialog Example" [code]="modalCode">
      <tw-button (click)="modalOpen.set(true)">Open Modal</tw-button>

      <tw-overlay
        class="z-50"
        [visible]="modalOpen()"
        blur="sm"
        opacity="medium"
        (close)="modalOpen.set(false)">
        <tw-card [class]="modalCardClass">
          <div class="p-6 border-b">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Delete Confirmation</h3>
          </div>
          <div class="p-6">
            <p class="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </div>
          <div class="p-6 bg-slate-50 dark:bg-slate-900/60 flex justify-end gap-3 rounded-b-lg">
            <tw-button variant="ghost" (click)="modalOpen.set(false)">Cancel</tw-button>
            <tw-button variant="danger" (click)="modalOpen.set(false)">Delete</tw-button>
          </div>
        </tw-card>
      </tw-overlay>
    </app-demo-section>

    <!-- Side Drawer Example -->
    <app-demo-section title="Side Drawer Example" [code]="drawerCode">
      <tw-button (click)="drawerOpen.set(true)">Open Drawer</tw-button>

      <tw-overlay
        class="z-50"
        [visible]="drawerOpen()"
        [centered]="false"
        blur="sm"
        opacity="medium"
        (close)="drawerOpen.set(false)">
        <aside class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-xl">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="font-semibold">Settings</h3>
            <tw-button variant="ghost" size="sm" (click)="drawerOpen.set(false)">✕</tw-button>
          </div>
          <div class="p-4 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Theme</label>
              <select class="w-full p-2 border rounded">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Language</label>
              <select class="w-full p-2 border rounded">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </aside>
      </tw-overlay>
    </app-demo-section>

    <!-- Image Lightbox Example -->
    <app-demo-section title="Image Lightbox Example" [code]="lightboxCode">
      <div class="flex gap-4">
        @for (img of images; track img.id) {
          <img
            [src]="img.thumb"
            [alt]="img.alt"
            class="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
            (click)="openLightbox(img)"
          />
        }
      </div>

      <tw-overlay
        [visible]="!!lightboxImage()"
        opacity="dark"
        (close)="lightboxImage.set(null)">
        @if (lightboxImage()) {
          <div class="max-w-4xl mx-4">
            <img
              [src]="lightboxImage()!.full"
              [alt]="lightboxImage()!.alt"
              class="max-h-[80vh] rounded-lg"
            />
            <p class="text-white text-center mt-4">{{ lightboxImage()!.alt }}</p>
          </div>
        }
      </tw-overlay>
    </app-demo-section>
  `,
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

