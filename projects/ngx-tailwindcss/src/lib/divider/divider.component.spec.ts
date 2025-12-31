import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  TwDividerComponent,
  DividerOrientation,
  DividerVariant,
  DividerLabelPosition,
} from './divider.component';

@Component({
  template: `
    <tw-divider
      [orientation]="orientation()"
      [variant]="variant()"
      [labelPosition]="labelPosition()"
      [color]="color()"
      [spacing]="spacing()"
      [label]="label()"
    ></tw-divider>
  `,
  standalone: true,
  imports: [TwDividerComponent],
})
class TestHostComponent {
  @ViewChild(TwDividerComponent) divider!: TwDividerComponent;
  orientation = signal<DividerOrientation>('horizontal');
  variant = signal<DividerVariant>('solid');
  labelPosition = signal<DividerLabelPosition>('center');
  color = signal('');
  spacing = signal<'sm' | 'md' | 'lg'>('md');
  label = signal('');
}

describe('TwDividerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let dividerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dividerEl = fixture.debugElement.query(By.directive(TwDividerComponent)).nativeElement;
  });

  it('should create the divider', () => {
    expect(dividerEl).toBeTruthy();
    expect(component.divider).toBeTruthy();
  });

  describe('orientation', () => {
    it('should render horizontal divider by default', () => {
      const hr = dividerEl.querySelector('hr');
      expect(hr).toBeTruthy();
      expect(hr?.className).toContain('border-t');
    });

    it('should render vertical divider', () => {
      component.orientation.set('vertical');
      fixture.detectChanges();
      const line = dividerEl.querySelector('.vertical-line');
      expect(line).toBeTruthy();
      expect(line?.className).toContain('border-l');
    });

    it('should have vertical host class when vertical', () => {
      component.orientation.set('vertical');
      fixture.detectChanges();
      expect(dividerEl.classList.contains('vertical')).toBe(true);
    });
  });

  describe('variants', () => {
    it('should apply solid variant by default', () => {
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('divider-solid');
    });

    it('should apply dashed variant', () => {
      component.variant.set('dashed');
      fixture.detectChanges();
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('divider-dashed');
    });

    it('should apply dotted variant', () => {
      component.variant.set('dotted');
      fixture.detectChanges();
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('divider-dotted');
    });
  });

  describe('spacing', () => {
    it('should apply sm spacing', () => {
      component.spacing.set('sm');
      fixture.detectChanges();
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('my-2');
    });

    it('should apply md spacing by default', () => {
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('my-4');
    });

    it('should apply lg spacing', () => {
      component.spacing.set('lg');
      fixture.detectChanges();
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('my-8');
    });
  });

  describe('custom color', () => {
    it('should apply default color', () => {
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('border-slate-300');
    });

    it('should apply custom color class', () => {
      component.color.set('border-red-500');
      fixture.detectChanges();
      const hr = dividerEl.querySelector('hr');
      expect(hr?.className).toContain('border-red-500');
    });
  });

  describe('label', () => {
    beforeEach(() => {
      component.label.set('OR');
      fixture.detectChanges();
    });

    it('should render label when provided', () => {
      expect(dividerEl.textContent).toContain('OR');
    });

    it('should render with flex container when has label', () => {
      const container = dividerEl.querySelector('.flex.items-center');
      expect(container).toBeTruthy();
    });

    describe('label position', () => {
      it('should have equal lines when center position', () => {
        const lines = dividerEl.querySelectorAll('[class*="flex-1"]');
        expect(lines.length).toBe(2);
      });

      it('should have short first line when left position', () => {
        component.labelPosition.set('left');
        fixture.detectChanges();
        const firstLine = dividerEl.querySelector('[class*="w-8"]');
        expect(firstLine).toBeTruthy();
      });

      it('should have short last line when right position', () => {
        component.labelPosition.set('right');
        fixture.detectChanges();
        const lines = dividerEl.querySelectorAll('[class*="border-t"]');
        const lastLine = lines[lines.length - 1];
        expect(lastLine?.className).toContain('w-8');
      });
    });
  });

  describe('vertical with spacing', () => {
    beforeEach(() => {
      component.orientation.set('vertical');
      fixture.detectChanges();
    });

    it('should apply sm spacing for vertical', () => {
      component.spacing.set('sm');
      fixture.detectChanges();
      const line = dividerEl.querySelector('.vertical-line');
      expect(line?.className).toContain('mx-2');
    });

    it('should apply md spacing for vertical', () => {
      const line = dividerEl.querySelector('.vertical-line');
      expect(line?.className).toContain('mx-4');
    });

    it('should apply lg spacing for vertical', () => {
      component.spacing.set('lg');
      fixture.detectChanges();
      const line = dividerEl.querySelector('.vertical-line');
      expect(line?.className).toContain('mx-8');
    });
  });
});
