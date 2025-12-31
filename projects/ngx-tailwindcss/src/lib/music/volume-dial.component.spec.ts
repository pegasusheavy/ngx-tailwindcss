import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwVolumeDialComponent, DialVariant, DialSize } from './volume-dial.component';
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
    it('should accept value input', () => {
      component.value.set(75);
      fixture.detectChanges();
      expect(component.dial).toBeTruthy();
    });

    it('should accept min/max inputs', () => {
      component.min.set(10);
      component.max.set(90);
      fixture.detectChanges();
      expect(component.dial).toBeTruthy();
    });

    it('should accept step input', () => {
      component.step.set(5);
      fixture.detectChanges();
      expect(component.dial).toBeTruthy();
    });

    it('should accept variant input', () => {
      const variants: DialVariant[] = ['modern', 'vintage', 'minimal', 'led'];

      for (const variant of variants) {
        component.variant.set(variant);
        fixture.detectChanges();
        expect(component.dial).toBeTruthy();
      }
    });

    it('should accept size input', () => {
      const sizes: DialSize[] = ['sm', 'md', 'lg', 'xl'];

      for (const size of sizes) {
        component.size.set(size);
        fixture.detectChanges();
        expect(component.dial).toBeTruthy();
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
