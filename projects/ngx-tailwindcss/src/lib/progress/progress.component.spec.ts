import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwProgressComponent, TwProgressCircularComponent, ProgressSize, ProgressVariant } from './progress.component';

@Component({
  template: `
    <tw-progress
      [value]="value()"
      [max]="max()"
      [size]="size()"
      [variant]="variant()"
      [label]="label()"
      [showValue]="showValue()"
      [labelPosition]="labelPosition()"
      [striped]="striped()"
      [animated]="animated()"
      [indeterminate]="indeterminate()"
    ></tw-progress>
  `,
  standalone: true,
  imports: [TwProgressComponent],
})
class TestHostComponent {
  @ViewChild(TwProgressComponent) progress!: TwProgressComponent;
  value = signal(50);
  max = signal(100);
  size = signal<ProgressSize>('md');
  variant = signal<ProgressVariant>('primary');
  label = signal('Progress');
  showValue = signal(false);
  labelPosition = signal<'top' | 'bottom' | 'inside'>('top');
  striped = signal(false);
  animated = signal(false);
  indeterminate = signal(false);
}

@Component({
  template: `
    <tw-progress-circular
      [value]="value()"
      [max]="max()"
      [size]="size()"
      [variant]="variant()"
      [showValue]="showValue()"
      [indeterminate]="indeterminate()"
      [thickness]="thickness()"
    ></tw-progress-circular>
  `,
  standalone: true,
  imports: [TwProgressCircularComponent],
})
class CircularTestComponent {
  @ViewChild(TwProgressCircularComponent) progress!: TwProgressCircularComponent;
  value = signal(75);
  max = signal(100);
  size = signal(48);
  variant = signal<ProgressVariant>('primary');
  showValue = signal(false);
  indeterminate = signal(false);
  thickness = signal(4);
}

describe('TwProgressComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let progressEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    progressEl = fixture.debugElement.query(By.directive(TwProgressComponent)).nativeElement;
  });

  it('should create the progress bar', () => {
    expect(progressEl).toBeTruthy();
    expect(component.progress).toBeTruthy();
  });

  describe('value and max', () => {
    it('should calculate correct percentage', () => {
      component.value.set(50);
      component.max.set(100);
      fixture.detectChanges();
      const bar = progressEl.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('should cap percentage at 100', () => {
      component.value.set(150);
      component.max.set(100);
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div') as HTMLElement;
      expect(bar?.style.width).toBe('100%');
    });

    it('should not go below 0', () => {
      component.value.set(-10);
      component.max.set(100);
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div') as HTMLElement;
      expect(bar?.style.width).toBe('0%');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const track = progressEl.querySelector('.overflow-hidden');
      expect(track?.className).toContain('h-2.5');
    });

    it('should apply xs size', () => {
      component.size.set('xs');
      fixture.detectChanges();
      const track = progressEl.querySelector('.overflow-hidden');
      expect(track?.className).toContain('h-1');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const track = progressEl.querySelector('.overflow-hidden');
      expect(track?.className).toContain('h-1.5');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const track = progressEl.querySelector('.overflow-hidden');
      expect(track?.className).toContain('h-4');
    });
  });

  describe('variants', () => {
    it('should apply primary variant by default', () => {
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-blue-600');
    });

    it('should apply success variant', () => {
      component.variant.set('success');
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-emerald-600');
    });

    it('should apply warning variant', () => {
      component.variant.set('warning');
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-amber-500');
    });

    it('should apply danger variant', () => {
      component.variant.set('danger');
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-rose-600');
    });

    it('should apply info variant', () => {
      component.variant.set('info');
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-cyan-600');
    });
  });

  describe('label and value display', () => {
    it('should show label when provided', () => {
      component.label.set('Loading...');
      fixture.detectChanges();
      expect(progressEl.textContent).toContain('Loading...');
    });

    it('should show value when showValue is true', () => {
      component.showValue.set(true);
      component.value.set(75);
      fixture.detectChanges();
      expect(progressEl.textContent).toContain('75%');
    });
  });

  describe('striped and animated', () => {
    it('should apply striped pattern', () => {
      component.striped.set(true);
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('bg-[linear-gradient');
    });

    it('should apply animation when striped and animated', () => {
      component.striped.set(true);
      component.animated.set(true);
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('progress-stripes-animated');
    });
  });

  describe('indeterminate', () => {
    it('should apply indeterminate animation', () => {
      component.indeterminate.set(true);
      fixture.detectChanges();
      const bar = progressEl.querySelector('.overflow-hidden > div');
      expect(bar?.className).toContain('progress-indeterminate-animated');
    });
  });

  describe('accessibility', () => {
    it('should have progressbar role', () => {
      const bar = progressEl.querySelector('[role="progressbar"]');
      expect(bar).toBeTruthy();
    });

    it('should have aria-valuenow', () => {
      const bar = progressEl.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('should have aria-valuemin', () => {
      const bar = progressEl.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('should have aria-valuemax', () => {
      const bar = progressEl.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute('aria-valuemax')).toBe('100');
    });
  });
});

describe('TwProgressCircularComponent', () => {
  let fixture: ComponentFixture<CircularTestComponent>;
  let component: CircularTestComponent;
  let progressEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    progressEl = fixture.debugElement.query(By.directive(TwProgressCircularComponent)).nativeElement;
  });

  it('should create the circular progress', () => {
    expect(progressEl).toBeTruthy();
    expect(component.progress).toBeTruthy();
  });

  it('should render SVG element', () => {
    const svg = progressEl.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  describe('size', () => {
    it('should apply custom size', () => {
      component.size.set(64);
      fixture.detectChanges();
      const svg = progressEl.querySelector('svg') as SVGElement;
      // SVG uses style.width and style.height in pixels
      expect(svg?.style.width).toBe('64px');
      expect(svg?.style.height).toBe('64px');
    });
  });

  describe('variants', () => {
    it('should apply primary stroke color', () => {
      const circle = progressEl.querySelectorAll('circle')[1];
      expect(circle?.getAttribute('stroke')).toBe('#2563eb');
    });

    it('should apply success stroke color', () => {
      component.variant.set('success');
      fixture.detectChanges();
      const circle = progressEl.querySelectorAll('circle')[1];
      expect(circle?.getAttribute('stroke')).toBe('#059669');
    });

    it('should apply warning stroke color', () => {
      component.variant.set('warning');
      fixture.detectChanges();
      const circle = progressEl.querySelectorAll('circle')[1];
      expect(circle?.getAttribute('stroke')).toBe('#f59e0b');
    });

    it('should apply danger stroke color', () => {
      component.variant.set('danger');
      fixture.detectChanges();
      const circle = progressEl.querySelectorAll('circle')[1];
      expect(circle?.getAttribute('stroke')).toBe('#e11d48');
    });
  });

  describe('value display', () => {
    it('should show value when showValue is true', () => {
      component.showValue.set(true);
      component.value.set(75);
      fixture.detectChanges();
      expect(progressEl.textContent).toContain('75%');
    });
  });

  describe('indeterminate', () => {
    it('should apply indeterminate animations', () => {
      component.indeterminate.set(true);
      fixture.detectChanges();
      const svg = progressEl.querySelector('svg');
      expect(svg?.className.baseVal).toContain('circular-rotate');
    });
  });

  describe('thickness', () => {
    it('should apply custom thickness', () => {
      component.thickness.set(8);
      fixture.detectChanges();
      const circles = progressEl.querySelectorAll('circle');
      expect(circles[0]?.getAttribute('stroke-width')).toBe('8');
      expect(circles[1]?.getAttribute('stroke-width')).toBe('8');
    });
  });

  describe('accessibility', () => {
    it('should have progressbar role', () => {
      // Role is on the wrapper div, not the SVG
      const wrapper = progressEl.querySelector('[role="progressbar"]');
      expect(wrapper).toBeTruthy();
    });

    it('should have aria-valuenow', () => {
      // aria-valuenow is on the wrapper div
      const wrapper = progressEl.querySelector('[role="progressbar"]');
      expect(wrapper?.getAttribute('aria-valuenow')).toBe('75');
    });
  });
});
