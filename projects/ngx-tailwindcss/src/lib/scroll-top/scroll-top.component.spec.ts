import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollTopPosition, ScrollTopVariant, TwScrollTopComponent } from './scroll-top.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-scroll-top
      [threshold]="threshold()"
      [position]="position()"
      [variant]="variant()"
      [target]="target()"
    ></tw-scroll-top>
  `,
  standalone: true,
  imports: [TwScrollTopComponent],
})
class TestHostComponent {
  @ViewChild(TwScrollTopComponent) scrollTop!: TwScrollTopComponent;
  threshold = signal(400);
  position = signal<ScrollTopPosition>('bottom-right');
  variant = signal<ScrollTopVariant>('primary');
  target = signal<HTMLElement | null>(null);
}

const scrollTargetSpies = new Map<HTMLElement, ReturnType<typeof vi.fn>>();

function createScrollTarget(scrollTop = 0): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'scrollTop', {
    value: scrollTop,
    writable: true,
    configurable: true,
  });
  const scrollToMock = vi.fn();
  scrollTargetSpies.set(el, scrollToMock);
  el.scrollTo = scrollToMock;
  return el;
}

describe('TwScrollTopComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let scrollTarget: HTMLElement;

  const buttonEl = () => fixture.debugElement.query(By.css('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    scrollTarget = createScrollTarget();
    component.target.set(scrollTarget);
    fixture.detectChanges();
  });

  it('should create the component with a hidden button', () => {
    expect(component.scrollTop).toBeTruthy();
    expect(buttonEl()).toBeNull();
  });

  describe('threshold visibility', () => {
    it('should show the button after scrolling past the threshold', () => {
      (scrollTarget as any).scrollTop = 500;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeTruthy();
    });

    it('should keep the button hidden below the threshold', () => {
      (scrollTarget as any).scrollTop = 100;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeNull();
    });

    it('should hide the button again when scrolling back up', () => {
      (scrollTarget as any).scrollTop = 500;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeTruthy();

      (scrollTarget as any).scrollTop = 0;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeNull();
    });

    it('should respect a custom threshold', () => {
      component.threshold.set(50);
      fixture.detectChanges();
      (scrollTarget as any).scrollTop = 100;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeTruthy();
    });

    it('should rebind the listener when the target changes', () => {
      const newTarget = createScrollTarget(500);
      component.target.set(newTarget);
      fixture.detectChanges();

      // New target reports past-threshold immediately on rebind
      expect(buttonEl()).toBeTruthy();

      // The old target no longer drives visibility
      (newTarget as any).scrollTop = 0;
      newTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      (scrollTarget as any).scrollTop = 900;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(buttonEl()).toBeNull();
    });
  });

  describe('scrollToTop', () => {
    it('should scroll the target element to the top', () => {
      component.scrollTop.scrollToTop();
      expect(scrollTargetSpies.get(scrollTarget)).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should scroll the window when no target is set', () => {
      const windowSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      component.target.set(null);
      fixture.detectChanges();
      component.scrollTop.scrollToTop();
      expect(windowSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      windowSpy.mockRestore();
    });

    it('should scroll to top when the button is clicked', () => {
      (scrollTarget as any).scrollTop = 500;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      buttonEl().nativeElement.click();
      expect(scrollTargetSpies.get(scrollTarget)).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('appearance', () => {
    beforeEach(() => {
      (scrollTarget as any).scrollTop = 500;
      scrollTarget.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
    });

    it('should apply position classes', () => {
      expect(buttonEl().nativeElement.className).toContain('right-6');
      component.position.set('bottom-left');
      fixture.detectChanges();
      expect(buttonEl().nativeElement.className).toContain('left-6');
    });

    it('should apply variant classes', () => {
      expect(buttonEl().nativeElement.className).toContain('bg-blue-600');
      component.variant.set('dark');
      fixture.detectChanges();
      expect(buttonEl().nativeElement.className).toContain('bg-slate-800');
    });
  });
});
