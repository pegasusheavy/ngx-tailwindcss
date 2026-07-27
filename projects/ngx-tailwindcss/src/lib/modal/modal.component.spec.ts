import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ModalSize,
  TwModalComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
} from './modal.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-modal
      [open]="isOpen()"
      (openChange)="onOpenChange($event)"
      [size]="size()"
      [closeOnBackdropClick]="closeOnBackdropClick()"
      [closeOnEscape]="closeOnEscape()"
      [showCloseButton]="showCloseButton()"
      [centered]="centered()"
      (opened)="onOpened()"
      (closed)="onClosed()"
      data-testid="test-modal"
    >
      <div data-testid="modal-content">Modal Content</div>
    </tw-modal>
  `,
  standalone: true,
  imports: [TwModalComponent],
})
class TestHostComponent {
  @ViewChild(TwModalComponent) modal!: TwModalComponent;
  isOpen = signal(false);
  size = signal<ModalSize>('md');
  closeOnBackdropClick = signal(true);
  closeOnEscape = signal(true);
  showCloseButton = signal(true);
  centered = signal(true);
  openedCount = 0;
  closedCount = 0;

  onOpenChange(value: boolean): void {
    this.isOpen.set(value);
  }

  onOpened(): void {
    this.openedCount++;
  }

  onClosed(): void {
    this.closedCount++;
  }
}

describe('TwModalComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render modal when closed', () => {
    const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(modal).toBeNull();
  });

  it('should render modal when open', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(modal).toBeTruthy();
  });

  it('should render content', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('[data-testid="modal-content"]'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent).toContain('Modal Content');
  });

  describe('sizes', () => {
    const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

    sizes.forEach(size => {
      it(`should apply ${size} size class`, () => {
        component.isOpen.set(true);
        component.size.set(size);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('[role="dialog"]'));
        switch (size) {
          case 'sm': {
            expect(panel.nativeElement.className).toContain('max-w-sm');

            break;
          }
          case 'md': {
            expect(panel.nativeElement.className).toContain('max-w-md');

            break;
          }
          case 'lg': {
            expect(panel.nativeElement.className).toContain('max-w-lg');

            break;
          }
          case 'xl': {
            expect(panel.nativeElement.className).toContain('max-w-xl');

            break;
          }
          case 'full': {
            expect(panel.nativeElement.className).toContain('max-w-full');

            break;
          }
          // No default
        }
      });
    });
  });

  describe('close button', () => {
    it('should show close button by default', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const closeBtn = fixture.debugElement.query(By.css('[aria-label="Close modal"]'));
      expect(closeBtn).toBeTruthy();
    });

    it('should hide close button when showCloseButton is false', () => {
      component.isOpen.set(true);
      component.showCloseButton.set(false);
      fixture.detectChanges();

      const closeBtn = fixture.debugElement.query(By.css('[aria-label="Close modal"]'));
      expect(closeBtn).toBeNull();
    });

    it('should close modal when close button clicked', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const closeBtn = fixture.debugElement.query(By.css('[aria-label="Close modal"]'));
      closeBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
      expect(component.closedCount).toBe(1);
    });
  });

  describe('backdrop click', () => {
    const containerEl = (): HTMLElement | null =>
      fixture.debugElement.query(By.css('.overflow-y-auto'))?.nativeElement ?? null;

    it('should close when the backdrop area is clicked', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      containerEl()!.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
      expect(component.closedCount).toBe(1);
    });

    it('should not close when closeOnBackdropClick is false', () => {
      component.closeOnBackdropClick.set(false);
      component.isOpen.set(true);
      fixture.detectChanges();

      containerEl()!.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
      expect(component.closedCount).toBe(0);
    });

    it('should not close when the panel itself is clicked', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement;
      panel.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog"', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
      expect(modal).toBeTruthy();
    });

    it('should have aria-modal attribute', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
      expect(modal.nativeElement.getAttribute('aria-modal')).toBe('true');
    });

    it('should not emit an empty aria-labelledby when unset', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
      expect(modal.nativeElement.hasAttribute('aria-labelledby')).toBe(false);
      expect(modal.nativeElement.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  describe('public methods', () => {
    it('should close modal via closeModal()', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      component.modal.closeModal();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });
});

@Component({
  template: `
    <tw-modal [open]="true">
      <tw-modal-header>
        <tw-modal-title>My Title</tw-modal-title>
      </tw-modal-header>
    </tw-modal>
  `,
  standalone: true,
  imports: [TwModalComponent, TwModalHeaderComponent, TwModalTitleComponent],
})
class TitledHostComponent {}

describe('TwModalComponent with projected title', () => {
  let fixture: ComponentFixture<TitledHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitledHostComponent, NoopAnimationsModule],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TitledHostComponent);
    fixture.detectChanges();
  });

  it('should auto-link aria-labelledby to the projected title id', () => {
    const dialog = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement;
    const title = fixture.debugElement.query(By.css('tw-modal-title')).nativeElement;

    expect(title.id).toBeTruthy();
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
  });
});
