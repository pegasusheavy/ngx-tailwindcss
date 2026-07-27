import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TwFocusTrapDirective } from './focus-trap.directive';

// jsdom reports zero layout metrics, which the trap's visibility
// filter treats as hidden; report a non-zero size for the tests
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get: () => 10,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get: () => 10,
  });
});

@Component({
  template: `
    <div
      twFocusTrap
      [focusTrapAutoFocus]="autoFocus()"
      [focusTrapRestoreFocus]="restoreFocus()"
      [focusTrapInitialFocus]="initialFocus()"
      data-testid="focus-trap"
    >
      <input type="text" data-testid="first-input" placeholder="First" />
      <button data-testid="middle-button">Middle</button>
      <input type="text" data-testid="last-input" placeholder="Last" />
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

  it('should wrap focus to the first element when tabbing from the last', () => {
    const firstInput = fixture.debugElement.query(By.css('[data-testid="first-input"]'))
      .nativeElement as HTMLElement;
    const lastInput = fixture.debugElement.query(By.css('[data-testid="last-input"]'))
      .nativeElement as HTMLElement;

    lastInput.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    lastInput.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(firstInput);
  });

  it('should wrap focus to the last element when shift-tabbing from the first', () => {
    const firstInput = fixture.debugElement.query(By.css('[data-testid="first-input"]'))
      .nativeElement as HTMLElement;
    const lastInput = fixture.debugElement.query(By.css('[data-testid="last-input"]'))
      .nativeElement as HTMLElement;

    firstInput.focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    firstInput.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lastInput);
  });

  it('should pull focus back into the trap when it escapes', () => {
    const firstInput = fixture.debugElement.query(By.css('[data-testid="first-input"]'))
      .nativeElement as HTMLElement;

    (document.activeElement as HTMLElement | null)?.blur();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    );

    expect(document.activeElement).toBe(firstInput);
  });

  it('should not intercept Tab in the middle of the trap', () => {
    const middleButton = fixture.debugElement.query(By.css('[data-testid="middle-button"]'))
      .nativeElement as HTMLElement;

    middleButton.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    middleButton.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(middleButton);
  });
});
