import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwRippleDirective } from './ripple.directive';

// jsdom does not implement the Web Animations API
if (!Element.prototype.animate) {
  Element.prototype.animate = vi.fn(
    () => ({ onfinish: null, cancel: vi.fn() }) as unknown as Animation
  );
}

@Component({
  template: `
    <button
      twRipple
      [rippleColor]="rippleColor()"
      [rippleDuration]="rippleDuration()"
      [rippleDisabled]="rippleDisabled()"
      [rippleCentered]="rippleCentered()"
      data-testid="ripple-button"
    >
      Click me
    </button>
  `,
  standalone: true,
  imports: [TwRippleDirective],
})
class TestHostComponent {
  rippleColor = signal('rgba(255, 255, 255, 0.4)');
  rippleDuration = signal(600);
  rippleDisabled = signal(false);
  rippleCentered = signal(false);
}

describe('TwRippleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let buttonNative: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    buttonNative = fixture.debugElement.query(
      By.css('[data-testid="ripple-button"]')
    ).nativeElement;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(buttonNative).toBeTruthy();
  });

  it('should set overflow hidden on host element', () => {
    expect(buttonNative.style.overflow).toBe('hidden');
  });

  it('should have default ripple color', () => {
    expect(component.rippleColor()).toBe('rgba(255, 255, 255, 0.4)');
  });

  it('should have default ripple duration', () => {
    expect(component.rippleDuration()).toBe(600);
  });

  it('should have rippleDisabled as false by default', () => {
    expect(component.rippleDisabled()).toBe(false);
  });

  it('should have rippleCentered as false by default', () => {
    expect(component.rippleCentered()).toBe(false);
  });

  it('should allow custom ripple color', () => {
    component.rippleColor.set('rgba(0, 0, 255, 0.5)');
    fixture.detectChanges();
    expect(component.rippleColor()).toBe('rgba(0, 0, 255, 0.5)');
  });

  it('should allow disabling ripple', () => {
    component.rippleDisabled.set(true);
    fixture.detectChanges();
    expect(component.rippleDisabled()).toBe(true);
  });

  it('should render a ripple element on mousedown', () => {
    buttonNative.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 })
    );

    const ripple = buttonNative.querySelector('span');
    expect(ripple).toBeTruthy();
    expect(ripple?.style.backgroundColor).toBeTruthy();
  });

  it('should not render a ripple on mousedown when disabled', () => {
    component.rippleDisabled.set(true);
    fixture.detectChanges();

    buttonNative.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 })
    );

    expect(buttonNative.querySelector('span')).toBeNull();
  });
});
