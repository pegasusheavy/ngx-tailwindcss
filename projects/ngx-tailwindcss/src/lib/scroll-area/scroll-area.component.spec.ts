import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ScrollAreaDirection,
  ScrollAreaScrollbar,
  TwScrollAreaComponent,
} from './scroll-area.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-scroll-area
      [direction]="direction()"
      [scrollbar]="scrollbar()"
      [height]="height()"
      [thin]="thin()"
      [dark]="dark()"
      [smooth]="smooth()"
      [class]="customClass()"
    >
      <p>Scrollable content</p>
    </tw-scroll-area>
  `,
  standalone: true,
  imports: [TwScrollAreaComponent],
})
class TestHostComponent {
  @ViewChild(TwScrollAreaComponent) scrollArea!: TwScrollAreaComponent;
  direction = signal<ScrollAreaDirection>('vertical');
  scrollbar = signal<ScrollAreaScrollbar>('auto');
  height = signal<string | undefined>(undefined);
  thin = signal(false);
  dark = signal(false);
  smooth = signal(true);
  customClass = signal('');
}

describe('TwScrollAreaComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let scrollAreaEl: HTMLElement;
  let container: HTMLElement;
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    scrollAreaEl = fixture.debugElement.query(By.directive(TwScrollAreaComponent)).nativeElement;
    container = scrollAreaEl.querySelector('div')!;
    scrollToSpy = vi.fn();
    container.scrollTo = scrollToSpy as unknown as typeof container.scrollTo;
  });

  it('should create the scroll area and project content', () => {
    expect(component.scrollArea).toBeTruthy();
    expect(scrollAreaEl.textContent).toContain('Scrollable content');
  });

  describe('scroll methods', () => {
    it('should forward scrollTo options to the container element', () => {
      component.scrollArea.scrollTo({ top: 120, left: 30, behavior: 'auto' });
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 120, left: 30, behavior: 'auto' });
    });

    it('should scroll to top', () => {
      component.scrollArea.scrollToTop();
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should scroll to top without smoothing when requested', () => {
      component.scrollArea.scrollToTop(false);
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });

    it('should scroll to bottom using the container scrollHeight', () => {
      Object.defineProperty(container, 'scrollHeight', { value: 640, configurable: true });
      component.scrollArea.scrollToBottom();
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 640, behavior: 'smooth' });
    });

    it('should scroll to left', () => {
      component.scrollArea.scrollToLeft();
      expect(scrollToSpy).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' });
    });

    it('should scroll to right using the container scrollWidth', () => {
      Object.defineProperty(container, 'scrollWidth', { value: 480, configurable: true });
      component.scrollArea.scrollToRight();
      expect(scrollToSpy).toHaveBeenCalledWith({ left: 480, behavior: 'smooth' });
    });
  });

  describe('direction', () => {
    it('should apply vertical overflow by default', () => {
      expect(container.className).toContain('overflow-y-auto');
      expect(container.className).toContain('overflow-x-hidden');
    });

    it('should apply horizontal overflow', () => {
      component.direction.set('horizontal');
      fixture.detectChanges();
      expect(container.className).toContain('overflow-x-auto');
      expect(container.className).toContain('overflow-y-hidden');
    });

    it('should apply both-direction overflow', () => {
      component.direction.set('both');
      fixture.detectChanges();
      expect(container.className).toContain('overflow-auto');
    });
  });

  describe('scrollbar appearance', () => {
    it('should apply the styled scrollbar base class', () => {
      expect(container.className).toContain('scroll-area-styled');
    });

    it('should apply the hidden scrollbar class', () => {
      component.scrollbar.set('hidden');
      fixture.detectChanges();
      expect(container.className).toContain('scroll-area-hidden');
    });

    it('should apply thin and dark scrollbar classes', () => {
      component.thin.set(true);
      component.dark.set(true);
      fixture.detectChanges();
      expect(container.className).toContain('scroll-area-thin');
      expect(container.className).toContain('scroll-area-dark');
    });
  });

  describe('smooth scrolling', () => {
    it('should apply scroll-smooth by default', () => {
      expect(container.className).toContain('scroll-smooth');
    });

    it('should omit scroll-smooth when disabled', () => {
      component.smooth.set(false);
      fixture.detectChanges();
      expect(container.className).not.toContain('scroll-smooth');
    });
  });

  describe('dimensions and custom classes', () => {
    it('should apply a fixed height style', () => {
      component.height.set('300px');
      fixture.detectChanges();
      expect(container.style.height).toBe('300px');
    });

    it('should merge additional classes', () => {
      component.customClass.set('custom-scroll-area');
      fixture.detectChanges();
      expect(container.className).toContain('custom-scroll-area');
    });
  });
});
