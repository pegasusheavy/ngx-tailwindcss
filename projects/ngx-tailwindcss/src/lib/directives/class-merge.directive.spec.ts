import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwClassDirective, TwVariantDirective } from './class-merge.directive';
import { TwClassService } from '../core/tw-class.service';
import { provideTwConfig } from '../core/provide-tw-config';

@Component({
  template: `
    <div
      [twClass]="baseClasses()"
      [twClassMerge]="mergeClasses()"
      [twClassIf]="conditionalClasses()"
      data-testid="class-merge-target"
    >
      Content
    </div>
  `,
  standalone: true,
  imports: [TwClassDirective],
})
class TestHostComponent {
  baseClasses = signal('px-4 py-2 bg-blue-500');
  mergeClasses = signal('');
  conditionalClasses = signal<Record<string, boolean | undefined>>({});
}

describe('TwClassDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let targetEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    targetEl = fixture.debugElement.query(
      By.css('[data-testid="class-merge-target"]')
    ).nativeElement;
  });

  it('should create the directive', () => {
    expect(targetEl).toBeTruthy();
  });

  it('should apply base classes to the DOM', () => {
    expect(targetEl.classList.contains('px-4')).toBe(true);
    expect(targetEl.classList.contains('py-2')).toBe(true);
    expect(targetEl.classList.contains('bg-blue-500')).toBe(true);
  });

  it('should apply the merged result to the DOM (README example)', () => {
    component.mergeClasses.set('px-8 bg-red-500');
    fixture.detectChanges();

    expect(targetEl.classList.contains('px-8')).toBe(true);
    expect(targetEl.classList.contains('py-2')).toBe(true);
    expect(targetEl.classList.contains('bg-red-500')).toBe(true);
    expect(targetEl.classList.contains('px-4')).toBe(false);
    expect(targetEl.classList.contains('bg-blue-500')).toBe(false);
  });

  it('should apply conditional classes to the DOM when the condition is true', () => {
    component.conditionalClasses.set({ 'font-bold': true, 'opacity-50': false });
    fixture.detectChanges();

    expect(targetEl.classList.contains('font-bold')).toBe(true);
    expect(targetEl.classList.contains('opacity-50')).toBe(false);
  });

  it('should remove conditional classes when the condition flips back to false', () => {
    component.conditionalClasses.set({ 'font-bold': true });
    fixture.detectChanges();
    expect(targetEl.classList.contains('font-bold')).toBe(true);

    component.conditionalClasses.set({ 'font-bold': false });
    fixture.detectChanges();
    expect(targetEl.classList.contains('font-bold')).toBe(false);
  });

  it('should update the DOM when base classes change', () => {
    component.baseClasses.set('p-8 m-4');
    fixture.detectChanges();

    expect(targetEl.classList.contains('p-8')).toBe(true);
    expect(targetEl.classList.contains('m-4')).toBe(true);
    expect(targetEl.classList.contains('px-4')).toBe(false);
  });

  it('should handle empty base classes', () => {
    component.baseClasses.set('');
    fixture.detectChanges();

    expect(targetEl.classList.contains('px-4')).toBe(false);
    expect(targetEl.classList.contains('bg-blue-500')).toBe(false);
  });
});

@Component({
  template: ` <div [twVariant]="variant()" data-testid="variant-target">Content</div> `,
  standalone: true,
  imports: [TwVariantDirective],
})
class VariantHostComponent {
  variant = signal('primary');
}

describe('TwVariantDirective', () => {
  let fixture: ComponentFixture<VariantHostComponent>;
  let component: VariantHostComponent;
  let targetEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantHostComponent],
      providers: [
        provideTwConfig({
          theme: {
            primary: 'bg-blue-600 text-white',
            secondary: 'bg-gray-600 text-white',
          },
        }),
        TwClassService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    targetEl = fixture.debugElement.query(By.css('[data-testid="variant-target"]')).nativeElement;
  });

  it('should create the directive', () => {
    expect(targetEl).toBeTruthy();
  });

  it('should apply variant classes to the DOM', () => {
    expect(targetEl.classList.contains('bg-blue-600')).toBe(true);
    expect(targetEl.classList.contains('text-white')).toBe(true);
  });

  it('should swap variant classes in the DOM when the variant changes', () => {
    component.variant.set('secondary');
    fixture.detectChanges();

    expect(targetEl.classList.contains('bg-gray-600')).toBe(true);
    expect(targetEl.classList.contains('bg-blue-600')).toBe(false);
  });

  it('should remove variant classes for an unknown variant', () => {
    component.variant.set('unknown');
    fixture.detectChanges();

    expect(targetEl.classList.contains('bg-blue-600')).toBe(false);
    expect(targetEl.classList.contains('text-white')).toBe(false);
  });
});
