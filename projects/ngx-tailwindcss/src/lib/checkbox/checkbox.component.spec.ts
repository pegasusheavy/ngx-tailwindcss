import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwCheckboxComponent, CheckboxVariant, CheckboxSize } from './checkbox.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-checkbox
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      [name]="name()"
      [value]="value()"
      [readonly]="readonly()"
      [classOverride]="classOverride()"
      (onChange)="onCheckboxChange($event)"
      (onFocus)="onFocus($event)"
      (onBlur)="onBlur($event)"
    >
      {{ label() }}
    </tw-checkbox>
  `,
  standalone: true,
  imports: [TwCheckboxComponent],
})
class TestHostComponent {
  @ViewChild(TwCheckboxComponent) checkbox!: TwCheckboxComponent;
  variant = signal<CheckboxVariant>('primary');
  size = signal<CheckboxSize>('md');
  disabled = signal(false);
  indeterminate = signal(false);
  name = signal('test-checkbox');
  value = signal<any>('test-value');
  readonly = signal(false);
  classOverride = signal('');
  label = signal('Test Label');

  changeEvent: any = null;
  focusEvent: FocusEvent | null = null;
  blurEvent: FocusEvent | null = null;

  onCheckboxChange(event: { checked: boolean; value: any }) {
    this.changeEvent = event;
  }
  onFocus(event: FocusEvent) {
    this.focusEvent = event;
  }
  onBlur(event: FocusEvent) {
    this.blurEvent = event;
  }
}

@Component({
  template: `<tw-checkbox [(ngModel)]="checked">NgModel Checkbox</tw-checkbox>`,
  standalone: true,
  imports: [TwCheckboxComponent, FormsModule],
})
class NgModelTestComponent {
  @ViewChild(TwCheckboxComponent) checkbox!: TwCheckboxComponent;
  checked = false;
}

@Component({
  template: `<tw-checkbox [formControl]="control">FormControl Checkbox</tw-checkbox>`,
  standalone: true,
  imports: [TwCheckboxComponent, ReactiveFormsModule],
})
class FormControlTestComponent {
  @ViewChild(TwCheckboxComponent) checkbox!: TwCheckboxComponent;
  control = new FormControl(false);
}

describe('TwCheckboxComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let checkboxEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    checkboxEl = fixture.debugElement.query(By.directive(TwCheckboxComponent)).nativeElement;
  });

  it('should create the checkbox', () => {
    expect(checkboxEl).toBeTruthy();
    expect(component.checkbox).toBeTruthy();
  });

  it('should render label text', () => {
    expect(checkboxEl.textContent).toContain('Test Label');
  });

  describe('variants', () => {
    it('should apply primary variant by default', () => {
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('text-blue-600');
    });

    it('should apply success variant', () => {
      component.variant.set('success');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('text-emerald-600');
    });

    it('should apply warning variant', () => {
      component.variant.set('warning');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('text-amber-500');
    });

    it('should apply danger variant', () => {
      component.variant.set('danger');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('text-rose-600');
    });

    it('should apply secondary variant', () => {
      component.variant.set('secondary');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('text-slate-600');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('w-5');
      expect(input?.className).toContain('h-5');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('w-4');
      expect(input?.className).toContain('h-4');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input');
      expect(input?.className).toContain('w-6');
      expect(input?.className).toContain('h-6');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled styling', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const label = checkboxEl.querySelector('label');
      expect(label?.className).toContain('opacity-50');
      expect(label?.className).toContain('cursor-not-allowed');
    });

    it('should set input as disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const input = checkboxEl.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should not toggle when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      component.checkbox.toggle();
      expect(component.changeEvent).toBeNull();
    });
  });

  describe('readonly state', () => {
    it('should not toggle when readonly', () => {
      component.readonly.set(true);
      fixture.detectChanges();
      component.checkbox.toggle();
      expect(component.changeEvent).toBeNull();
    });
  });

  describe('checkbox interactions', () => {
    it('should toggle on click', () => {
      const input = checkboxEl.querySelector('input') as HTMLInputElement;
      input.click();
      fixture.detectChanges();
      expect(component.changeEvent).not.toBeNull();
      expect(component.changeEvent.checked).toBe(true);
    });

    it('should emit value on change', () => {
      const input = checkboxEl.querySelector('input') as HTMLInputElement;
      input.click();
      fixture.detectChanges();
      expect(component.changeEvent.value).toBe('test-value');
    });

    it('should toggle programmatically', () => {
      component.checkbox.toggle();
      fixture.detectChanges();
      expect(component.changeEvent.checked).toBe(true);
    });
  });

  describe('focus/blur events', () => {
    it('should emit onBlur event', () => {
      const input = checkboxEl.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(component.blurEvent).not.toBeNull();
    });
  });

  describe('class customization', () => {
    it('should apply classOverride', () => {
      component.classOverride.set('custom-class');
      fixture.detectChanges();
      const label = checkboxEl.querySelector('label');
      expect(label?.className).toContain('custom-class');
    });
  });
});

describe('TwCheckboxComponent with NgModel', () => {
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
    component.checked = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('should update ngModel on change', async () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.checked).toBe(true);
  });
});

describe('TwCheckboxComponent with FormControl', () => {
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
    component.control.setValue(true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('should update FormControl on change', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(component.control.value).toBe(true);
  });

  it('should disable checkbox when FormControl is disabled', () => {
    component.control.disable();
    fixture.detectChanges();

    const checkboxEl = fixture.debugElement.query(By.directive(TwCheckboxComponent)).nativeElement;
    const label = checkboxEl.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});
