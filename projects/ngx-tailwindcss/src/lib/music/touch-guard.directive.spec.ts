import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TwTouchGuardDirective } from './touch-guard.directive';

/** Create a synthetic touch event jsdom can dispatch */
function makeTouchEvent(type: string, x: number = 0, y: number = 0): TouchEvent {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touch = { clientX: x, clientY: y };
  Object.defineProperty(event, 'touches', { value: [touch] });
  Object.defineProperty(event, 'changedTouches', { value: [touch] });
  return event as unknown as TouchEvent;
}

@Component({
  template: `
    <button
      twTouchGuard
      [requireLongPress]="requireLongPress()"
      (guardedClick)="clicks.push($event)"
      (longPress)="longPresses.push($event)"
    >
      Guarded
    </button>
  `,
  standalone: true,
  imports: [TwTouchGuardDirective],
})
class TestHostComponent {
  readonly requireLongPress = signal(false);
  readonly clicks: Array<MouseEvent | TouchEvent> = [];
  readonly longPresses: TouchEvent[] = [];
}

describe('TwTouchGuardDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should create the host with the directive applied', () => {
      expect(buttonEl).toBeTruthy();
    });

    it('should register touchmove as non-passive so drags can preventDefault', () => {
      const spy = vi.spyOn(EventTarget.prototype, 'addEventListener');

      const localFixture = TestBed.createComponent(TestHostComponent);
      localFixture.detectChanges();

      const touchmoveCall = spy.mock.calls.find(([type]) => type === 'touchmove');
      expect(touchmoveCall).toBeDefined();
      expect(touchmoveCall?.[2]).toEqual({ passive: false });

      spy.mockRestore();
    });
  });

  describe('tap without requireLongPress', () => {
    it('should emit guardedClick on a plain tap', () => {
      buttonEl.dispatchEvent(makeTouchEvent('touchstart'));
      buttonEl.dispatchEvent(makeTouchEvent('touchend'));

      expect(component.clicks.length).toBe(1);
      expect(component.longPresses.length).toBe(0);
    });
  });

  describe('requireLongPress (touch)', () => {
    beforeEach(() => {
      component.requireLongPress.set(true);
      fixture.detectChanges();
    });

    it('should not emit guardedClick on a short tap', () => {
      vi.useFakeTimers();

      buttonEl.dispatchEvent(makeTouchEvent('touchstart'));
      vi.advanceTimersByTime(100); // Shorter than the 500ms default
      buttonEl.dispatchEvent(makeTouchEvent('touchend'));

      expect(component.clicks.length).toBe(0);
      expect(component.longPresses.length).toBe(0);
    });

    it('should emit longPress and guardedClick after a long press', () => {
      vi.useFakeTimers();

      buttonEl.dispatchEvent(makeTouchEvent('touchstart'));
      vi.advanceTimersByTime(600); // Longer than the 500ms default
      expect(component.longPresses.length).toBe(1);

      buttonEl.dispatchEvent(makeTouchEvent('touchend'));

      expect(component.clicks.length).toBe(1);
    });

    it('should cancel the long press when the touch moves', () => {
      vi.useFakeTimers();

      buttonEl.dispatchEvent(makeTouchEvent('touchstart', 0, 0));
      buttonEl.dispatchEvent(makeTouchEvent('touchmove', 2, 0));
      vi.advanceTimersByTime(600);
      buttonEl.dispatchEvent(makeTouchEvent('touchend', 2, 0));

      expect(component.longPresses.length).toBe(0);
      expect(component.clicks.length).toBe(0);
    });
  });

  describe('requireLongPress (mouse)', () => {
    beforeEach(() => {
      component.requireLongPress.set(true);
      fixture.detectChanges();
    });

    it('should not emit guardedClick on a short click', () => {
      vi.useFakeTimers();

      buttonEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      vi.advanceTimersByTime(100);
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(component.clicks.length).toBe(0);
    });

    it('should emit guardedClick after the mouse button is held long enough', () => {
      vi.useFakeTimers();

      buttonEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      vi.advanceTimersByTime(600);
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(component.clicks.length).toBe(1);
      // The longPress output stays touch-only
      expect(component.longPresses.length).toBe(0);
    });
  });
});
