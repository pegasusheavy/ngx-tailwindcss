import { Component, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  TwInputComponent,
  TwTextareaComponent,
  TwLabelDirective,
  TwHintDirective,
  TwErrorDirective,
  InputVariant,
  InputSize,
} from './input.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-input
      [type]="type()"
      [variant]="variant()"
      [size]="size()"
      [label]="label()"
      [placeholder]="placeholder()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [clearable]="clearable()"
      [classOverride]="classOverride()"
      data-testid="test-input">
    </tw-input>
  `,
  standalone: true,
  imports: [TwInputComponent, FormsModule],
})
class TestHostComponent {
  @ViewChild(TwInputComponent) input!: TwInputComponent;
  type = signal('text');
  variant = signal<InputVariant>('default');
  size = signal<InputSize>('md');
  label = signal('');
  placeholder = signal('');
  hint = signal('');
  error = signal('');
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
  clearable = signal(false);
  classOverride = signal('');
}

describe('TwInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: HTMLInputElement;
  let hostEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostEl = fixture.debugElement.query(By.directive(TwInputComponent)).nativeElement;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create the input', () => {
    expect(inputEl).toBeTruthy();
    expect(component.input).toBeTruthy();
  });

  it('should have block class on host', () => {
    expect(hostEl.className).toContain('block');
  });

  describe('type', () => {
    it('should set input type', () => {
      component.type.set('email');
      fixture.detectChanges();
      expect(inputEl.type).toBe('email');
    });

    it('should support password type', () => {
      component.type.set('password');
      fixture.detectChanges();
      expect(inputEl.type).toBe('password');
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      expect(inputEl.className).toContain('border');
      expect(inputEl.className).toContain('rounded-lg');
    });
  });

  describe('sizes', () => {
    it('should apply default size classes', () => {
      expect(inputEl.className).toContain('text-sm');
    });
  });

  describe('label', () => {
    it('should not show label by default', () => {
      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeNull();
    });

    it('should show label when provided', () => {
      component.label.set('Email Address');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toContain('Email Address');
    });

    it('should show required indicator', () => {
      component.label.set('Email');
      component.required.set(true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.textContent).toContain('*');
    });
  });

  describe('placeholder', () => {
    it('should set placeholder', () => {
      component.placeholder.set('Enter your email');
      fixture.detectChanges();
      expect(inputEl.placeholder).toBe('Enter your email');
    });
  });

  describe('hint', () => {
    it('should show hint when provided', () => {
      component.hint.set('This is a hint');
      fixture.detectChanges();

      const hint = fixture.debugElement.query(By.css('.text-slate-500'));
      expect(hint).toBeTruthy();
      expect(hint.nativeElement.textContent).toContain('This is a hint');
    });

    it('should not show hint when error is present', () => {
      component.hint.set('This is a hint');
      component.error.set('This is an error');
      fixture.detectChanges();

      const hint = fixture.debugElement.query(By.css('.text-slate-500'));
      expect(hint).toBeNull();
    });
  });

  describe('error', () => {
    it('should show error when provided', () => {
      component.error.set('This field is required');
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('This field is required');
    });

    it('should set aria-invalid when error is present', () => {
      component.error.set('Error');
      fixture.detectChanges();
      expect(inputEl.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('disabled', () => {
    it('should disable input', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      expect(inputEl.disabled).toBe(true);
    });
  });

  describe('readonly', () => {
    it('should make input readonly', () => {
      component.readonly.set(true);
      fixture.detectChanges();
      expect(inputEl.readOnly).toBe(true);
    });
  });

  describe('clearable', () => {
    it('should not show clear button by default', () => {
      const clearBtn = fixture.debugElement.query(By.css('button[aria-label="Clear input"]'));
      expect(clearBtn).toBeNull();
    });
  });
});

@Component({
  template: `
    <tw-textarea
      [variant]="variant()"
      [label]="label()"
      [rows]="rows()"
      [maxlength]="maxlength()"
      [showCount]="showCount()"
      [autoResize]="autoResize()"
      [error]="error()"
      data-testid="test-textarea">
    </tw-textarea>
  `,
  standalone: true,
  imports: [TwTextareaComponent, FormsModule],
})
class TextareaHostComponent {
  @ViewChild(TwTextareaComponent) textarea!: TwTextareaComponent;
  variant = signal<InputVariant>('default');
  label = signal('');
  rows = signal(4);
  maxlength = signal<number | null>(null);
  showCount = signal(false);
  autoResize = signal(false);
  error = signal('');
}

describe('TwTextareaComponent', () => {
  let fixture: ComponentFixture<TextareaHostComponent>;
  let component: TextareaHostComponent;
  let textareaEl: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    textareaEl = fixture.debugElement.query(By.css('textarea')).nativeElement;
  });

  it('should create the textarea', () => {
    expect(textareaEl).toBeTruthy();
    expect(component.textarea).toBeTruthy();
  });

  it('should set rows', () => {
    component.rows.set(6);
    fixture.detectChanges();
    expect(textareaEl.rows).toBe(6);
  });

  it('should apply resize classes by default', () => {
    expect(textareaEl.className).toContain('resize-y');
  });
});

@Component({
  template: `
    <tw-label [required]="required()" [class]="labelClass()">Label Text</tw-label>
    <tw-hint [class]="hintClass()">Hint text</tw-hint>
    <tw-error [class]="errorClass()">Error text</tw-error>
  `,
  standalone: true,
  imports: [TwLabelDirective, TwHintDirective, TwErrorDirective],
})
class DirectivesHostComponent {
  required = signal(false);
  labelClass = signal('');
  hintClass = signal('');
  errorClass = signal('');
}

describe('Input directives', () => {
  let fixture: ComponentFixture<DirectivesHostComponent>;
  let component: DirectivesHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectivesHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectivesHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('TwLabelDirective', () => {
    it('should apply label classes', () => {
      const label = fixture.debugElement.query(By.directive(TwLabelDirective)).nativeElement;
      expect(label.className).toContain('text-sm');
      expect(label.className).toContain('font-medium');
    });

    it('should merge custom class', () => {
      component.labelClass.set('custom-label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.directive(TwLabelDirective)).nativeElement;
      expect(label.className).toContain('custom-label');
    });
  });

  describe('TwHintDirective', () => {
    it('should apply hint classes', () => {
      const hint = fixture.debugElement.query(By.directive(TwHintDirective)).nativeElement;
      expect(hint.className).toContain('text-xs');
      expect(hint.className).toContain('text-slate-500');
    });
  });

  describe('TwErrorDirective', () => {
    it('should apply error classes', () => {
      const error = fixture.debugElement.query(By.directive(TwErrorDirective)).nativeElement;
      expect(error.className).toContain('text-xs');
      expect(error.className).toContain('text-rose-600');
    });

    it('should have role alert', () => {
      const error = fixture.debugElement.query(By.directive(TwErrorDirective)).nativeElement;
      expect(error.getAttribute('role')).toBe('alert');
    });
  });
});
