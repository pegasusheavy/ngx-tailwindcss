import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectOption, SelectSize, SelectVariant, TwSelectComponent } from './select.component';
import { TwClassService } from '../core/tw-class.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <tw-select
      [options]="options()"
      [placeholder]="placeholder()"
      [label]="label()"
      [size]="size()"
      [variant]="variant()"
      [disabled]="disabled()"
      [filter]="filter()"
      [hint]="hint()"
      [error]="errorMsg()"
      (onChange)="onChangeSpy($event)"
      (onToggle)="onToggleSpy($event)"
      data-testid="test-select"
    ></tw-select>
  `,
  standalone: true,
  imports: [TwSelectComponent],
})
class TestHostComponent {
  @ViewChild(TwSelectComponent) select!: TwSelectComponent;
  options = signal<SelectOption[]>([
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Disabled Option', value: '4', disabled: true },
  ]);
  placeholder = signal('Select an option');
  label = signal('');
  size = signal<SelectSize>('md');
  variant = signal<SelectVariant>('default');
  disabled = signal(false);
  filter = signal(false);
  hint = signal('');
  errorMsg = signal('');

  onChangeSpy = vi.fn();
  onToggleSpy = vi.fn();
}

@Component({
  template: `
    <tw-select [options]="options" [formControl]="selectControl" data-testid="form-select"></tw-select>
  `,
  standalone: true,
  imports: [TwSelectComponent, ReactiveFormsModule],
})
class TestHostComponentWithFormControl {
  selectControl = new FormControl('2');
  options: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}

describe('TwSelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let selectEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    selectEl = fixture.debugElement.query(By.directive(TwSelectComponent));
  });

  it('should create the select component', () => {
    expect(selectEl).toBeTruthy();
    expect(component.select).toBeTruthy();
  });

  it('should render placeholder text', () => {
    const triggerButton = selectEl.query(By.css('button'));
    expect(triggerButton.nativeElement.textContent).toContain('Select an option');
  });

  it('should render label when provided', () => {
    component.label.set('Choose option');
    fixture.detectChanges();
    const labelEl = selectEl.query(By.css('label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Choose option');
  });

  describe('dropdown toggle', () => {
    it('should open dropdown on trigger click', () => {
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
      expect(component.onToggleSpy).toHaveBeenCalledWith(true);
    });

    it('should close dropdown on second click', () => {
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
      triggerButton.nativeElement.click();
      fixture.detectChanges();
      expect(component.onToggleSpy).toHaveBeenCalledWith(false);
    });

    it('should not open dropdown when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
      expect(component.onToggleSpy).not.toHaveBeenCalled();
    });
  });

  describe('option selection', () => {
    beforeEach(() => {
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
    });

    it('should render options in dropdown', () => {
      const options = selectEl.queryAll(By.css('[role="option"]'));
      expect(options.length).toBe(4);
    });

    it('should select option on click', () => {
      const options = selectEl.queryAll(By.css('[role="option"]'));
      options[1].nativeElement.click();
      fixture.detectChanges();
      expect(component.onChangeSpy).toHaveBeenCalledWith({ label: 'Option 2', value: '2' });
    });

    it('should display selected option label', () => {
      const options = selectEl.queryAll(By.css('[role="option"]'));
      options[0].nativeElement.click();
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.textContent).toContain('Option 1');
    });

    it('should not select disabled option', () => {
      const options = selectEl.queryAll(By.css('[role="option"]'));
      options[3].nativeElement.click();
      fixture.detectChanges();
      expect(component.onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('py-2.5');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('py-1.5');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('py-3');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled classes', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('opacity-50');
      expect(triggerButton.nativeElement.className).toContain('cursor-not-allowed');
    });
  });

  describe('error state', () => {
    it('should apply error classes', () => {
      component.errorMsg.set('This field is required');
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('border-rose-500');
    });
  });

  describe('keyboard navigation', () => {
    it('should open dropdown on Enter key', () => {
      const triggerButton = selectEl.query(By.css('button'));
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      triggerButton.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.onToggleSpy).toHaveBeenCalledWith(true);
    });

    it('should open dropdown on Space key', () => {
      const triggerButton = selectEl.query(By.css('button'));
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      triggerButton.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.onToggleSpy).toHaveBeenCalledWith(true);
    });

    it('should open dropdown on ArrowDown key', () => {
      const triggerButton = selectEl.query(By.css('button'));
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      triggerButton.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      // Should open the dropdown
    });
  });

  describe('filter', () => {
    beforeEach(() => {
      component.filter.set(true);
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show filter input', () => {
      const filterInput = selectEl.query(By.css('input'));
      expect(filterInput).toBeTruthy();
    });
  });

  describe('clear method', () => {
    it('should clear selection', () => {
      component.select.writeValue('1');
      fixture.detectChanges();
      component.select.clear();
      fixture.detectChanges();
      expect(component.onChangeSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update value via writeValue', () => {
      component.select.writeValue('2');
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.textContent).toContain('Option 2');
    });

    it('should register onChange function', () => {
      const spy = vi.fn();
      component.select.registerOnChange(spy);
      const triggerButton = selectEl.query(By.css('button'));
      triggerButton.nativeElement.click();
      fixture.detectChanges();
      const options = selectEl.queryAll(By.css('[role="option"]'));
      options[0].nativeElement.click();
      expect(spy).toHaveBeenCalledWith('1');
    });

    it('should set disabled state via setDisabledState', () => {
      component.select.setDisabledState(true);
      fixture.detectChanges();
      const triggerButton = selectEl.query(By.css('button'));
      expect(triggerButton.nativeElement.className).toContain('opacity-50');
    });
  });
});

describe('TwSelectComponent with FormControl', () => {
  let fixture: ComponentFixture<TestHostComponentWithFormControl>;
  let component: TestHostComponentWithFormControl;
  let selectEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponentWithFormControl],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponentWithFormControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
    selectEl = fixture.debugElement.query(By.directive(TwSelectComponent));
  });

  it('should update select when FormControl value changes', () => {
    component.selectControl.setValue('3');
    fixture.detectChanges();
    const triggerButton = selectEl.query(By.css('button'));
    expect(triggerButton.nativeElement.textContent).toContain('Option 3');
  });

  it('should update FormControl when select changes', () => {
    const triggerButton = selectEl.query(By.css('button'));
    triggerButton.nativeElement.click();
    fixture.detectChanges();
    const options = selectEl.queryAll(By.css('[role="option"]'));
    options[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.selectControl.value).toBe('1');
  });

  it('should disable select when FormControl is disabled', () => {
    component.selectControl.disable();
    fixture.detectChanges();
    const triggerButton = selectEl.query(By.css('button'));
    expect(triggerButton.nativeElement.className).toContain('opacity-50');
  });
});
