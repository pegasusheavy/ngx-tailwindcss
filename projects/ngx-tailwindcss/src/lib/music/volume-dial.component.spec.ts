import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { DialSize, DialVariant, TwVolumeDialComponent } from './volume-dial.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-volume-dial
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [label]="label()"
      [unit]="unit()"
      [showValue]="showValue()"
      [showTicks]="showTicks()"
      (valueChange)="onValueChange($event)"
    ></tw-volume-dial>
  `,
  standalone: true,
  imports: [TwVolumeDialComponent],
})
class TestHostComponent {
  @ViewChild(TwVolumeDialComponent) dial!: TwVolumeDialComponent;
  value = signal(50);
  min = signal(0);
  max = signal(100);
  step = signal(1);
  variant = signal<DialVariant>('modern');
  size = signal<DialSize>('md');
  disabled = signal(false);
  label = signal('Volume');
  unit = signal('%');
  showValue = signal(true);
  showTicks = signal(true);

  valueChanges: number[] = [];
  onValueChange(value: number): void {
    this.valueChanges.push(value);
  }
}

describe('TwVolumeDialComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let svgEl: SVGElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    svgEl = fixture.debugElement.query(By.css('svg')).nativeElement;
  });

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component.dial).toBeTruthy();
    });

    it('should render SVG element', () => {
      expect(svgEl).toBeTruthy();
      expect(svgEl.tagName.toLowerCase()).toBe('svg');
    });
  });

  describe('inputs', () => {
    it('should reflect the bound value in aria-valuenow', () => {
      component.value.set(75);
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-valuenow')).toBe('75');
    });

    it('should render the value text when showValue is enabled', () => {
      component.value.set(42);
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).textContent).toContain('42');
    });

    it('should clamp keyboard-driven changes at max', () => {
      component.min.set(10);
      component.max.set(90);
      component.value.set(90);
      fixture.detectChanges();

      svgEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-valuenow')).toBe('90');
      expect(component.valueChanges).toHaveLength(0);
    });

    it('should clamp to min via the Home key', () => {
      component.min.set(10);
      component.max.set(90);
      fixture.detectChanges();

      svgEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-valuenow')).toBe('10');
      expect(component.valueChanges).toContain(10);
    });

    it('should jump to max via the End key', () => {
      svgEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-valuenow')).toBe('100');
      expect(component.valueChanges).toContain(100);
    });

    it('should apply the step to keyboard increments', () => {
      component.step.set(5);
      fixture.detectChanges();

      svgEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-valuenow')).toBe('55');
      expect(component.valueChanges).toContain(55);
    });

    it('should resize the SVG according to the size input', () => {
      const expected: Record<Exclude<DialSize, 'xs'>, string> = {
        sm: '48',
        md: '72',
        lg: '96',
        xl: '128',
      };

      for (const [size, dimension] of Object.entries(expected)) {
        component.size.set(size as DialSize);
        fixture.detectChanges();

        expect(svgEl.getAttribute('width')).toBe(dimension);
        expect(svgEl.getAttribute('height')).toBe(dimension);
      }
    });

    it('should render each variant without errors', () => {
      const variants: DialVariant[] = ['modern', 'vintage', 'minimal', 'led'];

      for (const variant of variants) {
        component.variant.set(variant);
        fixture.detectChanges();

        expect(svgEl.querySelectorAll('path').length).toBeGreaterThan(0);
      }
    });
  });

  describe('disabled state', () => {
    it('should set tabindex to -1 when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(svgEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should set aria-disabled when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(svgEl.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('accessibility', () => {
    it('should have role="slider"', () => {
      expect(svgEl.getAttribute('role')).toBe('slider');
    });

    it('should have aria-valuenow', () => {
      expect(svgEl.getAttribute('aria-valuenow')).toBeTruthy();
    });

    it('should have aria-valuemin', () => {
      expect(svgEl.getAttribute('aria-valuemin')).toBeTruthy();
    });

    it('should have aria-valuemax', () => {
      expect(svgEl.getAttribute('aria-valuemax')).toBeTruthy();
    });

    it('should have aria-label', () => {
      expect(svgEl.getAttribute('aria-label')).toBeTruthy();
    });

    it('should be focusable when enabled', () => {
      expect(svgEl.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('SVG structure', () => {
    it('should have path elements for the dial', () => {
      const paths = svgEl.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('should have circle element for the knob', () => {
      const circles = svgEl.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });
});
