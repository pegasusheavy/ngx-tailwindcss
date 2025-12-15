import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwClassDirective, TwVariantDirective } from './class-merge.directive';
import { TwClassService } from '../core/tw-class.service';
import { provideTwConfig } from '../core/provide-tw-config';

@Component({
  template: `
    <div
      [twClass]="baseClasses"
      [twClassMerge]="mergeClasses"
      [twClassIf]="conditionalClasses"
      data-testid="class-merge-target"
    >
      Content
    </div>
  `,
  standalone: true,
  imports: [TwClassDirective],
})
class TestHostComponent {
  baseClasses = 'px-4 py-2 bg-blue-500';
  mergeClasses = '';
  conditionalClasses: Record<string, boolean | undefined> = {};
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

  it('should have default base classes', () => {
    expect(component.baseClasses).toBe('px-4 py-2 bg-blue-500');
  });

  it('should have default empty merge classes', () => {
    expect(component.mergeClasses).toBe('');
  });

  it('should have default empty conditional classes', () => {
    expect(component.conditionalClasses).toEqual({});
  });

  it('should allow setting conditional classes', () => {
    component.conditionalClasses = { 'text-white': true, 'font-bold': true };
    expect(component.conditionalClasses['text-white']).toBe(true);
    expect(component.conditionalClasses['font-bold']).toBe(true);
  });

  it('should allow setting merge classes', () => {
    component.mergeClasses = 'px-8';
    expect(component.mergeClasses).toBe('px-8');
  });

  it('should allow updating base classes', () => {
    component.baseClasses = 'p-8 m-4';
    expect(component.baseClasses).toBe('p-8 m-4');
  });

  it('should handle empty base classes', () => {
    component.baseClasses = '';
    expect(component.baseClasses).toBe('');
  });
});

@Component({
  template: ` <div [twVariant]="variant" data-testid="variant-target">Content</div> `,
  standalone: true,
  imports: [TwVariantDirective],
})
class VariantHostComponent {
  variant = 'primary';
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

  it('should have default primary variant', () => {
    expect(component.variant).toBe('primary');
  });

  it('should allow changing variant', () => {
    component.variant = 'secondary';
    expect(component.variant).toBe('secondary');
  });

  it('should allow setting empty variant', () => {
    component.variant = '';
    expect(component.variant).toBe('');
  });

  it('should handle unknown variant', () => {
    component.variant = 'unknown';
    expect(component.variant).toBe('unknown');
  });
});
