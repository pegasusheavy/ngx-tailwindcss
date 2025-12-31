import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwSliderComponent, SliderVariant, SliderSize } from './slider.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-slider
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [label]="label()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [showValue]="showValue()"
      [showMinMax]="showMinMax()"
      [showTicks]="showTicks()"
      [tickCount]="tickCount()"
      [classOverride]="classOverride()"
      (onChange)="onSliderChange($event)"
      (onInput)="onSliderInput($event)"
    ></tw-slider>
  `,
  standalone: true,
  imports: [TwSliderComponent],
})
class TestHostComponent {
  @ViewChild(TwSliderComponent) slider!: TwSliderComponent;
  min = signal(0);
  max = signal(100);
  step = signal(1);
  label = signal('');
  variant = signal<SliderVariant>('primary');
  size = signal<SliderSize>('md');
  disabled = signal(false);
  showValue = signal(false);
  showMinMax = signal(false);
  showTicks = signal(false);
  tickCount = signal(5);
  classOverride = signal('');

  changeValue: number | null = null;
  inputValue: number | null = null;

  onSliderChange(value: number) {
    this.changeValue = value;
  }
  onSliderInput(value: number) {
    this.inputValue = value;
  }
}

@Component({
  template: `<tw-slider [(ngModel)]="value"></tw-slider>`,
  standalone: true,
  imports: [TwSliderComponent, FormsModule],
})
class NgModelTestComponent {
  @ViewChild(TwSliderComponent) slider!: TwSliderComponent;
  value = 50;
}

@Component({
  template: `<tw-slider [formControl]="control"></tw-slider>`,
  standalone: true,
  imports: [TwSliderComponent, ReactiveFormsModule],
})
class FormControlTestComponent {
  @ViewChild(TwSliderComponent) slider!: TwSliderComponent;
  control = new FormControl(25);
}

describe('TwSliderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let sliderEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sliderEl = fixture.debugElement.query(By.directive(TwSliderComponent)).nativeElement;
  });

  it('should create the slider', () => {
    expect(sliderEl).toBeTruthy();
    expect(component.slider).toBeTruthy();
  });

  it('should render input element', () => {
    const input = sliderEl.querySelector('input[type="range"]');
    expect(input).toBeTruthy();
  });

  describe('min/max/step', () => {
    it('should set min attribute', () => {
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.min).toBe('0');
    });

    it('should set max attribute', () => {
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.max).toBe('100');
    });

    it('should set step attribute', () => {
      component.step.set(5);
      fixture.detectChanges();
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.step).toBe('5');
    });

    it('should update min/max', () => {
      component.min.set(10);
      component.max.set(200);
      fixture.detectChanges();
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.min).toBe('10');
      expect(input.max).toBe('200');
    });
  });

  describe('label', () => {
    it('should not show label by default', () => {
      const label = sliderEl.querySelector('label');
      expect(label?.textContent?.trim() || '').toBe('');
    });

    it('should show label when provided', () => {
      component.label.set('Volume');
      fixture.detectChanges();
      expect(sliderEl.textContent).toContain('Volume');
    });
  });

  describe('variants', () => {
    it('should apply primary variant by default', () => {
      const fill = sliderEl.querySelector('[class*="bg-blue-600"]');
      expect(fill).toBeTruthy();
    });

    it('should apply success variant', () => {
      component.variant.set('success');
      fixture.detectChanges();
      const fill = sliderEl.querySelector('[class*="bg-emerald-600"]');
      expect(fill).toBeTruthy();
    });

    it('should apply warning variant', () => {
      component.variant.set('warning');
      fixture.detectChanges();
      const fill = sliderEl.querySelector('[class*="bg-amber-500"]');
      expect(fill).toBeTruthy();
    });

    it('should apply danger variant', () => {
      component.variant.set('danger');
      fixture.detectChanges();
      const fill = sliderEl.querySelector('[class*="bg-rose-600"]');
      expect(fill).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const track = sliderEl.querySelector('[class*="h-1"]');
      expect(track).toBeTruthy();
    });

    it('should apply md size by default', () => {
      const track = sliderEl.querySelector('[class*="h-2"]');
      expect(track).toBeTruthy();
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const track = sliderEl.querySelector('[class*="h-3"]');
      expect(track).toBeTruthy();
    });
  });

  describe('disabled state', () => {
    it('should set disabled attribute', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should apply disabled styling', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const track = sliderEl.querySelector('[class*="opacity-50"]');
      expect(track).toBeTruthy();
    });
  });

  describe('showValue', () => {
    it('should show value when enabled', () => {
      component.showValue.set(true);
      fixture.detectChanges();
      // Value should be visible (uses font-semibold)
      const valueDisplay = sliderEl.querySelector('[class*="font-semibold"]');
      expect(valueDisplay).toBeTruthy();
    });
  });

  describe('showMinMax', () => {
    it('should show min/max labels when enabled', () => {
      component.showMinMax.set(true);
      fixture.detectChanges();
      expect(sliderEl.textContent).toContain('0');
      expect(sliderEl.textContent).toContain('100');
    });
  });

  describe('events', () => {
    it('should emit onInput during drag', () => {
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      input.value = '50';
      input.dispatchEvent(new Event('input'));
      expect(component.inputValue).toBe(50);
    });

    it('should emit onChange on release', () => {
      const input = sliderEl.querySelector('input[type="range"]') as HTMLInputElement;
      input.value = '75';
      input.dispatchEvent(new Event('change'));
      expect(component.changeValue).toBe(75);
    });
  });

  describe('class customization', () => {
    it('should apply classOverride', () => {
      component.classOverride.set('custom-slider');
      fixture.detectChanges();
      expect(sliderEl.querySelector('[class*="custom-slider"]')).toBeTruthy();
    });
  });
});

describe('TwSliderComponent with NgModel', () => {
  let fixture: ComponentFixture<NgModelTestComponent>;
  let component: NgModelTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgModelTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(NgModelTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should bind with ngModel', async () => {
    await fixture.whenStable();
    const input = fixture.debugElement.query(By.css('input[type="range"]'))
      .nativeElement as HTMLInputElement;
    expect(input.value).toBe('50');
  });

  it('should update ngModel on change', async () => {
    const input = fixture.debugElement.query(By.css('input[type="range"]'))
      .nativeElement as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.value).toBe(75);
  });
});

describe('TwSliderComponent with FormControl', () => {
  let fixture: ComponentFixture<FormControlTestComponent>;
  let component: FormControlTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(FormControlTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should bind with FormControl', () => {
    const input = fixture.debugElement.query(By.css('input[type="range"]'))
      .nativeElement as HTMLInputElement;
    expect(input.value).toBe('25');
  });

  it('should update FormControl on change', () => {
    const input = fixture.debugElement.query(By.css('input[type="range"]'))
      .nativeElement as HTMLInputElement;
    input.value = '60';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.control.value).toBe(60);
  });

  it('should disable slider when FormControl is disabled', () => {
    component.control.disable();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[type="range"]'))
      .nativeElement as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
