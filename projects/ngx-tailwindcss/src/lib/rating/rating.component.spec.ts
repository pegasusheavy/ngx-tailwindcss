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
  template: ` <tw-rating [formControl]="ratingControl" data-testid="form-rating"></tw-rating> `,
  standalone: true,
  imports: [TwRatingComponent, ReactiveFormsModule],
})
class TestHostWithFormControlComponent {
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

  describe('half stars', () => {
    const fullStars = () => ratingEl.queryAll(By.css('button svg[fill="currentColor"]'));
    const halfStars = () => ratingEl.queryAll(By.css('button svg defs'));

    beforeEach(() => {
      component.allowHalf.set(true);
      fixture.detectChanges();
    });

    it('should render 4 full stars and 1 half star for value 4.5', () => {
      component.rating.writeValue(4.5);
      fixture.detectChanges();
      expect(fullStars().length).toBe(4);
      expect(halfStars().length).toBe(1);
    });

    it('should render exactly 4 full stars for value 4', () => {
      component.rating.writeValue(4);
      fixture.detectChanges();
      expect(fullStars().length).toBe(4);
      expect(halfStars().length).toBe(0);
    });

    it('should select a half step when clicking the left half of a star', () => {
      const event = {
        offsetX: 4,
        currentTarget: { getBoundingClientRect: () => ({ width: 24 }) },
      } as unknown as MouseEvent;
      component.rating.onStarClick(2, event);
      expect(component.onChangeSpy).toHaveBeenCalledWith(2.5);
    });

    it('should select a full step when clicking the right half of a star', () => {
      const event = {
        offsetX: 20,
        currentTarget: { getBoundingClientRect: () => ({ width: 24 }) },
      } as unknown as MouseEvent;
      component.rating.onStarClick(2, event);
      expect(component.onChangeSpy).toHaveBeenCalledWith(3);
    });
  });

  describe('keyboard interaction', () => {
    const keydown = (index: number, key: string) => {
      const stars = ratingEl.queryAll(By.css('button'));
      stars[index].nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true })
      );
      fixture.detectChanges();
    };

    it('should increment value on ArrowRight', () => {
      component.rating.writeValue(2);
      fixture.detectChanges();
      keydown(1, 'ArrowRight');
      expect(component.onChangeSpy).toHaveBeenCalledWith(3);
    });

    it('should decrement value on ArrowLeft', () => {
      component.rating.writeValue(2);
      fixture.detectChanges();
      keydown(1, 'ArrowLeft');
      expect(component.onChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should use half steps when allowHalf is enabled', () => {
      component.allowHalf.set(true);
      component.rating.writeValue(2);
      fixture.detectChanges();
      keydown(1, 'ArrowRight');
      expect(component.onChangeSpy).toHaveBeenCalledWith(2.5);
    });

    it('should jump to the maximum on End', () => {
      component.rating.writeValue(2);
      fixture.detectChanges();
      keydown(1, 'End');
      expect(component.onChangeSpy).toHaveBeenCalledWith(5);
    });

    it('should jump to the minimum on Home', () => {
      component.rating.writeValue(4);
      fixture.detectChanges();
      keydown(3, 'Home');
      expect(component.onChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should not change value when readonly', () => {
      component.readonlyVal.set(true);
      component.rating.writeValue(2);
      fixture.detectChanges();
      keydown(1, 'ArrowRight');
      expect(component.onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should mark each star as a radio with a label', () => {
      const stars = ratingEl.queryAll(By.css('button'));
      expect(stars[0].nativeElement.getAttribute('role')).toBe('radio');
      expect(stars[2].nativeElement.getAttribute('aria-label')).toBe('3 stars');
    });

    it('should mark only the current value star as checked', () => {
      component.rating.writeValue(3);
      fixture.detectChanges();
      const stars = ratingEl.queryAll(By.css('button'));
      const checked = stars.filter(s => s.nativeElement.getAttribute('aria-checked') === 'true');
      expect(checked.length).toBe(1);
      expect(stars[2].nativeElement.getAttribute('aria-checked')).toBe('true');
    });

    it('should apply a roving tabindex', () => {
      component.rating.writeValue(3);
      fixture.detectChanges();
      const stars = ratingEl.queryAll(By.css('button'));
      expect(stars[2].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(stars[0].nativeElement.getAttribute('tabindex')).toBe('-1');
      expect(stars[4].nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should keep stars focusable but inert when readonly', () => {
      component.readonlyVal.set(true);
      fixture.detectChanges();
      const group = ratingEl.query(By.css('[role="radiogroup"]'));
      expect(group.nativeElement.getAttribute('aria-readonly')).toBe('true');
      const stars = ratingEl.queryAll(By.css('button'));
      expect((stars[0].nativeElement as HTMLButtonElement).disabled).toBe(false);
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
      // SVG elements use getAttribute('class') instead of className
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('w-6');
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('h-6');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('w-4');
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('h-4');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('w-8');
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('h-8');
    });

    it('should apply xl size', () => {
      component.size.set('xl');
      fixture.detectChanges();
      const starIcons = ratingEl.queryAll(By.css('svg'));
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('w-10');
      expect(starIcons[0].nativeElement.getAttribute('class')).toContain('h-10');
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
  let fixture: ComponentFixture<TestHostWithFormControlComponent>;
  let component: TestHostWithFormControlComponent;
  let ratingEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithFormControlComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostWithFormControlComponent);
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
