import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwContainerComponent, ContainerSize } from './container.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-container
      [size]="size()"
      [centered]="centered()"
      [padding]="padding()"
      [class]="customClass()"
    >
      <p>Container content</p>
    </tw-container>
  `,
  standalone: true,
  imports: [TwContainerComponent],
})
class TestHostComponent {
  @ViewChild(TwContainerComponent) container!: TwContainerComponent;
  size = signal<ContainerSize>('xl');
  centered = signal(true);
  padding = signal<'none' | 'sm' | 'md' | 'lg'>('md');
  customClass = signal('');
}

describe('TwContainerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let containerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    containerEl = fixture.debugElement.query(By.directive(TwContainerComponent)).nativeElement;
  });

  it('should create the container', () => {
    expect(containerEl).toBeTruthy();
    expect(component.container).toBeTruthy();
  });

  it('should render content', () => {
    expect(containerEl.textContent).toContain('Container content');
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-screen-sm');
    });

    it('should apply md size', () => {
      component.size.set('md');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-screen-md');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-screen-lg');
    });

    it('should apply xl size by default', () => {
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-screen-xl');
    });

    it('should apply 2xl size', () => {
      component.size.set('2xl');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-screen-2xl');
    });

    it('should apply full size', () => {
      component.size.set('full');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-full');
    });

    it('should apply prose size', () => {
      component.size.set('prose');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('max-w-prose');
    });
  });

  describe('centered', () => {
    it('should center by default', () => {
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('mx-auto');
    });

    it('should not center when false', () => {
      component.centered.set(false);
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).not.toContain('mx-auto');
    });
  });

  describe('padding', () => {
    it('should apply md padding by default', () => {
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('px-4');
    });

    it('should apply sm padding', () => {
      component.padding.set('sm');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('px-2');
    });

    it('should apply lg padding', () => {
      component.padding.set('lg');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('px-6');
    });

    it('should apply no padding', () => {
      component.padding.set('none');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).not.toContain('px-');
    });
  });

  describe('custom class', () => {
    it('should apply custom class', () => {
      component.customClass.set('custom-class');
      fixture.detectChanges();
      const inner = containerEl.querySelector('div');
      expect(inner?.className).toContain('custom-class');
    });
  });

  it('should have w-full class', () => {
    const inner = containerEl.querySelector('div');
    expect(inner?.className).toContain('w-full');
  });
});
