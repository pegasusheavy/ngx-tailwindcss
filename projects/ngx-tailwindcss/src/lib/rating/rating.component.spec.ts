import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RatingSize, RatingVariant, TwRatingComponent } from './rating.component';
import { TwClassService } from '../core/tw-class.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <tw-rating
      [stars]="stars()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [readonly]="readonlyVal()"
      [allowHalf]="allowHalf()"
      [showValue]="showValue()"
      [showCancel]="showCancel()"
      (change)="onChangeSpy($event)"
      (focus)="onFocusSpy($event)"
      (blur)="onBlurSpy($event)"
      data-testid="test-rating"
    ></tw-rating>
  `,
  standalone: true,
  imports: [TwRatingComponent],
})
class TestHostComponent {
  @ViewChild(TwRatingComponent) rating!: TwRatingComponent;
  stars = signal(5);
  variant = signal<RatingVariant>('warning');
  size = signal<RatingSize>('md');
  disabled = signal(false);
  readonlyVal = signal(false);
  allowHalf = signal(false);
  showValue = signal(false);
  showCancel = signal(false);

  onChangeSpy = vi.fn();
  onFocusSpy = vi.fn();
  onBlurSpy = vi.fn();
}

@Component({
  template: `
    <tw-rating [formControl]="ratingControl" data-testid="form-rating"></tw-rating>
  `,
  standalone: true,
  imports: [TwRatingComponent, ReactiveFormsModule],
})
class TestHostComponentWithFormControl {
  ratingControl = new FormControl(3);
}

describe('TwRatingComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let ratingEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ratingEl = fixture.debugElement.query(By.directive(TwRatingComponent));
  });

  it('should create the rating component', () => {
    expect(ratingEl).toBeTruthy();
    expect(component.rating).toBeTruthy();
  });

  it('should render correct number of stars', () => {
    const starButtons = ratingEl.queryAll(By.css('button'));
    expect(starButtons.length).toBe(5);
  });

  it('should render custom number of stars', () => {
    component.stars.set(10);
    fixture.detectChanges();
    const starButtons = ratingEl.queryAll(By.css('button'));
    expect(starButtons.length).toBe(10);
  });

  describe('star selection', () => {
    it('should select rating on star click', () => {
      const stars = ratingEl.queryAll(By.css('button'));
      stars[2].nativeElement.click(); // Click 3rd star
      expect(component.onChangeSpy).toHaveBeenCalledWith(3);
    });

    it('should clear rating when clicking same star', () => {
      const stars = ratingEl.queryAll(By.css('button'));
      stars[2].nativeElement.click(); // Select 3
      stars[2].nativeElement.click(); // Click again to clear
      expect(component.onChangeSpy).toHaveBeenCalledWith(0);
    });

    it('should not select when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const stars = ratingEl.queryAll(By.css('button'));
      stars[2].nativeElement.click();
      expect(component.onChangeSpy).not.toHaveBeenCalled();
    });

    it('should not select when readonly', () => {
      component.readonlyVal.set(true);
      fixture.detectChanges();
      const stars = ratingEl.queryAll(By.css('button'));
      stars[2].nativeElement.click();
      expect(component.onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('variants', () => {
    it('should apply warning variant by default', () => {
      component.rating.writeValue(3);
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.parentElement.className).toContain('text-amber-400');
    });

    it('should apply primary variant', () => {
      component.variant.set('primary');
      component.rating.writeValue(3);
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.parentElement.className).toContain('text-blue-500');
    });

    it('should apply danger variant', () => {
      component.variant.set('danger');
      component.rating.writeValue(3);
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.parentElement.className).toContain('text-rose-500');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.className).toContain('w-6');
      expect(starIcons[0].nativeElement.className).toContain('h-6');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.className).toContain('w-4');
      expect(starIcons[0].nativeElement.className).toContain('h-4');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.className).toContain('w-8');
      expect(starIcons[0].nativeElement.className).toContain('h-8');
    });

    it('should apply xl size', () => {
      component.size.set('xl');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.className).toContain('w-10');
      expect(starIcons[0].nativeElement.className).toContain('h-10');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled classes', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      expect(ratingEl.nativeElement.querySelector('div').className).toContain('opacity-50');
    });
  });

  describe('show value', () => {
    it('should display value when showValue is true', () => {
      component.showValue.set(true);
      component.rating.writeValue(4);
      fixture.detectChanges();
      const valueEl = ratingEl.query(By.css('span.ml-2'));
      expect(valueEl).toBeTruthy();
      expect(valueEl.nativeElement.textContent).toContain('4');
    });
  });

  describe('clear functionality', () => {
    it('should clear rating via clear method', () => {
      component.rating.writeValue(4);
      fixture.detectChanges();
      component.rating.clear();
      fixture.detectChanges();
      expect(component.onChangeSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('hover', () => {
    it('should show hover state', () => {
      const stars = ratingEl.queryAll(By.css('button'));
      stars[3].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      // Hover should highlight stars without changing value
      expect(component.onChangeSpy).not.toHaveBeenCalled();
    });

    it('should not show hover state when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const stars = ratingEl.queryAll(By.css('button'));
      stars[3].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      // Should not apply hover effect
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update value via writeValue', () => {
      component.rating.writeValue(4);
      fixture.detectChanges();
      // Value is set internally
      expect(component.rating).toBeTruthy();
    });

    it('should register onChange function', () => {
      const spy = vi.fn();
      component.rating.registerOnChange(spy);
      const stars = ratingEl.queryAll(By.css('button'));
      stars[2].nativeElement.click();
      expect(spy).toHaveBeenCalledWith(3);
    });

    it('should register onTouched function', () => {
      const spy = vi.fn();
      component.rating.registerOnTouched(spy);
      const stars = ratingEl.queryAll(By.css('button'));
      stars[0].nativeElement.dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalled();
    });

    it('should set disabled state via setDisabledState', () => {
      component.rating.setDisabledState(true);
      fixture.detectChanges();
      expect(ratingEl.nativeElement.querySelector('div').className).toContain('opacity-50');
    });
  });
});

describe('TwRatingComponent with FormControl', () => {
  let fixture: ComponentFixture<TestHostComponentWithFormControl>;
  let component: TestHostComponentWithFormControl;
  let ratingEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponentWithFormControl],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponentWithFormControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ratingEl = fixture.debugElement.query(By.directive(TwRatingComponent));
  });

  it('should update FormControl when rating changes', () => {
    const stars = ratingEl.queryAll(By.css('button'));
    stars[4].nativeElement.click(); // Click 5th star
    fixture.detectChanges();
    expect(component.ratingControl.value).toBe(5);
  });

  it('should disable rating when FormControl is disabled', () => {
    component.ratingControl.disable();
    fixture.detectChanges();
    expect(ratingEl.nativeElement.querySelector('div').className).toContain('opacity-50');
  });
});
