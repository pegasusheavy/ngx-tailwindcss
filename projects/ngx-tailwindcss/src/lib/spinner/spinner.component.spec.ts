import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  TwSpinnerComponent,
  TwLoadingOverlayComponent,
  SpinnerSize,
  SpinnerVariant,
  SpinnerColor,
} from './spinner.component';

@Component({
  template: ` <tw-spinner [size]="size()" [variant]="variant()" [color]="color()"></tw-spinner> `,
  standalone: true,
  imports: [TwSpinnerComponent],
})
class TestHostComponent {
  @ViewChild(TwSpinnerComponent) spinner!: TwSpinnerComponent;
  size = signal<SpinnerSize>('md');
  variant = signal<SpinnerVariant>('border');
  color = signal<SpinnerColor>('primary');
}

@Component({
  template: `
    <tw-loading-overlay
      [size]="size()"
      [variant]="variant()"
      [color]="color()"
      [message]="message()"
      [overlay]="overlayType()"
    ></tw-loading-overlay>
  `,
  standalone: true,
  imports: [TwLoadingOverlayComponent],
})
class OverlayTestComponent {
  @ViewChild(TwLoadingOverlayComponent) loadingOverlay!: TwLoadingOverlayComponent;
  size = signal<SpinnerSize>('lg');
  variant = signal<SpinnerVariant>('border');
  color = signal<SpinnerColor>('primary');
  message = signal('');
  overlayType = signal<'full' | 'inline'>('inline');
}

describe('TwSpinnerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let spinnerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spinnerEl = fixture.debugElement.query(By.directive(TwSpinnerComponent)).nativeElement;
  });

  it('should create the spinner', () => {
    expect(spinnerEl).toBeTruthy();
    expect(component.spinner).toBeTruthy();
  });

  describe('variants', () => {
    it('should render border variant by default', () => {
      const spinner = spinnerEl.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
      expect(spinner?.className).toContain('rounded-full');
    });

    it('should render dots variant', () => {
      component.variant.set('dots');
      fixture.detectChanges();
      const dots = spinnerEl.querySelectorAll('.dot-bounce');
      expect(dots.length).toBe(3);
    });

    it('should render pulse variant', () => {
      component.variant.set('pulse');
      fixture.detectChanges();
      const pulse = spinnerEl.querySelector('.animate-pulse');
      expect(pulse).toBeTruthy();
    });

    it('should render bars variant', () => {
      component.variant.set('bars');
      fixture.detectChanges();
      // The bars variant renders 4 bars
      const container = spinnerEl.querySelector('div');
      const bars = container?.querySelectorAll('div');
      expect(bars?.length).toBe(4);
    });
  });

  describe('sizes', () => {
    describe('border variant', () => {
      it('should apply xs size', () => {
        component.size.set('xs');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('w-4');
        expect(spinner?.className).toContain('h-4');
      });

      it('should apply sm size', () => {
        component.size.set('sm');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('w-5');
        expect(spinner?.className).toContain('h-5');
      });

      it('should apply md size', () => {
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('w-6');
        expect(spinner?.className).toContain('h-6');
      });

      it('should apply lg size', () => {
        component.size.set('lg');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('w-8');
        expect(spinner?.className).toContain('h-8');
      });

      it('should apply xl size', () => {
        component.size.set('xl');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('w-10');
        expect(spinner?.className).toContain('h-10');
      });
    });
  });

  describe('colors', () => {
    describe('border variant', () => {
      it('should apply primary color', () => {
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-blue-600');
      });

      it('should apply success color', () => {
        component.color.set('success');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-emerald-600');
      });

      it('should apply warning color', () => {
        component.color.set('warning');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-amber-500');
      });

      it('should apply danger color', () => {
        component.color.set('danger');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-rose-600');
      });

      it('should apply info color', () => {
        component.color.set('info');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-cyan-600');
      });

      it('should apply neutral color', () => {
        component.color.set('neutral');
        fixture.detectChanges();
        const spinner = spinnerEl.querySelector('.animate-spin');
        expect(spinner?.className).toContain('border-slate-400');
      });
    });

    describe('dots variant', () => {
      it('should apply color to dots', () => {
        component.variant.set('dots');
        component.color.set('success');
        fixture.detectChanges();
        const dot = spinnerEl.querySelector('.dot-bounce');
        expect(dot?.className).toContain('bg-emerald-600');
      });
    });

    describe('pulse variant', () => {
      it('should apply color to pulse', () => {
        component.variant.set('pulse');
        component.color.set('danger');
        fixture.detectChanges();
        const pulse = spinnerEl.querySelector('.animate-pulse');
        expect(pulse?.className).toContain('bg-rose-600');
      });
    });

    describe('bars variant', () => {
      it('should apply color to bars', () => {
        component.variant.set('bars');
        component.color.set('warning');
        fixture.detectChanges();
        const bar = spinnerEl.querySelector('.bar-stretch');
        expect(bar?.className).toContain('bg-amber-500');
      });
    });
  });

  describe('accessibility', () => {
    it('should have role status', () => {
      // Role is on the inner container div
      const container = spinnerEl.querySelector('[role="status"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-label', () => {
      const container = spinnerEl.querySelector('[aria-label="Loading"]');
      expect(container).toBeTruthy();
    });
  });
});

describe('TwLoadingOverlayComponent', () => {
  let fixture: ComponentFixture<OverlayTestComponent>;
  let component: OverlayTestComponent;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    overlayEl = fixture.debugElement.query(By.directive(TwLoadingOverlayComponent)).nativeElement;
  });

  it('should create the loading overlay', () => {
    expect(overlayEl).toBeTruthy();
    expect(component.loadingOverlay).toBeTruthy();
  });

  it('should contain a spinner', () => {
    const spinner = overlayEl.querySelector('tw-spinner');
    expect(spinner).toBeTruthy();
  });

  describe('overlay types', () => {
    it('should apply inline overlay by default', () => {
      expect(overlayEl.querySelector('.absolute')).toBeTruthy();
    });

    it('should apply full overlay', () => {
      component.overlayType.set('full');
      fixture.detectChanges();
      expect(overlayEl.querySelector('.fixed')).toBeTruthy();
    });
  });

  describe('message', () => {
    it('should display message when provided', () => {
      component.message.set('Loading data...');
      fixture.detectChanges();
      expect(overlayEl.textContent).toContain('Loading data...');
    });

    it('should not display message when empty', () => {
      const messageEl = overlayEl.querySelector('p');
      expect(messageEl).toBeNull();
    });
  });

  it('should pass size to spinner', () => {
    // lg size classes for border spinner include w-8 h-8
    const spinnerEl = overlayEl.querySelector('.animate-spin');
    expect(spinnerEl?.className).toContain('w-8');
    expect(spinnerEl?.className).toContain('h-8');
  });

  it('should pass variant to spinner', () => {
    component.variant.set('dots');
    fixture.detectChanges();
    // dots variant renders elements with dot-bounce class
    const dots = overlayEl.querySelectorAll('.dot-bounce');
    expect(dots.length).toBe(3);
  });

  it('should pass color to spinner', () => {
    component.color.set('success');
    fixture.detectChanges();
    // success color has border-emerald-600 class on border spinner
    const spinnerEl = overlayEl.querySelector('.animate-spin');
    expect(spinnerEl?.className).toContain('border-emerald-600');
  });
});
