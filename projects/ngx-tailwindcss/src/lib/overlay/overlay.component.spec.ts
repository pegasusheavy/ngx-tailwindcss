import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TwOverlayComponent } from './overlay.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-overlay
      [visible]="visible()"
      [lockScroll]="lockScroll()"
      [zIndex]="zIndex()"
      [closeOnClick]="closeOnClick()"
      [closeOnEscape]="closeOnEscape()"
      (close)="closeCount = closeCount + 1"
    >
      <div data-testid="overlay-content">Content</div>
    </tw-overlay>
  `,
  standalone: true,
  imports: [TwOverlayComponent],
})
class TestHostComponent {
  visible = signal(false);
  lockScroll = signal(true);
  zIndex = signal(50);
  closeOnClick = signal(true);
  closeOnEscape = signal(true);
  closeCount = 0;
}

describe('TwOverlayComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  const overlayEl = (): HTMLElement | null =>
    fixture.debugElement.query(By.css('.fixed.inset-0'))?.nativeElement ?? null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when hidden', () => {
    expect(overlayEl()).toBeNull();
  });

  it('should render content when visible', () => {
    component.visible.set(true);
    fixture.detectChanges();

    expect(overlayEl()).toBeTruthy();
    const content = fixture.debugElement.query(By.css('[data-testid="overlay-content"]'));
    expect(content).toBeTruthy();
  });

  describe('zIndex', () => {
    it('should apply zIndex as an inline style', () => {
      component.visible.set(true);
      component.zIndex.set(1234);
      fixture.detectChanges();

      expect(overlayEl()!.style.zIndex).toBe('1234');
    });
  });

  describe('lockScroll', () => {
    it('should lock body scroll while visible', () => {
      component.visible.set(true);
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('hidden');

      component.visible.set(false);
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('');
    });

    it('should not lock body scroll when lockScroll is false', () => {
      component.lockScroll.set(false);
      component.visible.set(true);
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('');
    });

    it('should restore the previous overflow value', () => {
      document.body.style.overflow = 'scroll';
      component.visible.set(true);
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('hidden');

      component.visible.set(false);
      fixture.detectChanges();

      expect(document.body.style.overflow).toBe('scroll');
    });
  });

  describe('closing', () => {
    it('should emit close on overlay click', () => {
      component.visible.set(true);
      fixture.detectChanges();

      overlayEl()!.click();
      fixture.detectChanges();

      expect(component.closeCount).toBe(1);
    });

    it('should not emit close when clicking content', () => {
      component.visible.set(true);
      fixture.detectChanges();

      const content = fixture.debugElement.query(
        By.css('[data-testid="overlay-content"]')
      ).nativeElement;
      content.click();
      fixture.detectChanges();

      expect(component.closeCount).toBe(0);
    });

    it('should emit close on Escape', () => {
      component.visible.set(true);
      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(component.closeCount).toBe(1);
    });
  });
});
