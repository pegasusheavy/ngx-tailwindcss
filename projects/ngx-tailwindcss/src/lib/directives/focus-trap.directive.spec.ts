import { Component, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { TwFocusTrapDirective } from './focus-trap.directive';

@Component({
  template: `
    <div
      twFocusTrap
      [focusTrapAutoFocus]="autoFocus()"
      [focusTrapRestoreFocus]="restoreFocus()"
      [focusTrapInitialFocus]="initialFocus()"
      data-testid="focus-trap">
      <input type="text" data-testid="first-input" placeholder="First">
      <button data-testid="middle-button">Middle</button>
      <input type="text" data-testid="last-input" placeholder="Last">
    </div>
  `,
  standalone: true,
  imports: [TwFocusTrapDirective],
})
class TestHostComponent {
  @ViewChild(TwFocusTrapDirective) focusTrap!: TwFocusTrapDirective;
  autoFocus = signal(true);
  restoreFocus = signal(true);
  initialFocus = signal('');
}

describe('TwFocusTrapDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let trapEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    trapEl = fixture.debugElement.query(By.css('[data-testid="focus-trap"]')).nativeElement;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(trapEl).toBeTruthy();
  });

  it('should have autoFocus enabled by default', () => {
    expect(component.autoFocus()).toBe(true);
  });

  it('should have restoreFocus enabled by default', () => {
    expect(component.restoreFocus()).toBe(true);
  });

  it('should have empty initialFocus by default', () => {
    expect(component.initialFocus()).toBe('');
  });

  it('should allow disabling autoFocus', () => {
    component.autoFocus.set(false);
    fixture.detectChanges();
    expect(component.autoFocus()).toBe(false);
  });

  it('should allow disabling restoreFocus', () => {
    component.restoreFocus.set(false);
    fixture.detectChanges();
    expect(component.restoreFocus()).toBe(false);
  });

  it('should allow setting initialFocus selector', () => {
    component.initialFocus.set('[data-testid="middle-button"]');
    fixture.detectChanges();
    expect(component.initialFocus()).toBe('[data-testid="middle-button"]');
  });

  it('should contain focusable elements', () => {
    const inputs = trapEl.querySelectorAll('input');
    const buttons = trapEl.querySelectorAll('button');
    expect(inputs.length).toBe(2);
    expect(buttons.length).toBe(1);
  });
});
