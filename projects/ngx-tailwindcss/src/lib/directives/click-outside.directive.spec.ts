import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div
      (twClickOutside)="onClickOutside($event)"
      [clickOutsideEnabled]="enabled()"
      [clickOutsideExclude]="excludeSelectors()"
      [clickOutsideDelay]="delay()"
      data-testid="click-outside-target"
    >
      <button data-testid="inside-button">Inside</button>
    </div>
    <button data-testid="outside-button">Outside</button>
  `,
  standalone: true,
  imports: [TwClickOutsideDirective],
})
class TestHostComponent {
  enabled = signal(true);
  excludeSelectors = signal<string[]>([]);
  delay = signal(0);
  clickOutsideCount = 0;
  lastEvent: MouseEvent | null = null;

  onClickOutside(event: MouseEvent): void {
    this.clickOutsideCount++;
    this.lastEvent = event;
  }
}

describe('TwClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let targetEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    targetEl = fixture.debugElement.query(
      By.css('[data-testid="click-outside-target"]')
    ).nativeElement;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(targetEl).toBeTruthy();
  });

  it('should be enabled by default', () => {
    expect(component.enabled()).toBe(true);
  });

  it('should have empty exclude selectors by default', () => {
    expect(component.excludeSelectors()).toEqual([]);
  });

  it('should have delay of 0 by default', () => {
    expect(component.delay()).toBe(0);
  });

  it('should allow disabling', () => {
    component.enabled.set(false);
    fixture.detectChanges();
    expect(component.enabled()).toBe(false);
  });

  it('should allow setting exclude selectors', () => {
    component.excludeSelectors.set(['.excluded-class']);
    fixture.detectChanges();
    expect(component.excludeSelectors()).toEqual(['.excluded-class']);
  });

  it('should allow setting delay', () => {
    component.delay.set(200);
    fixture.detectChanges();
    expect(component.delay()).toBe(200);
  });

  it('should initialize click count at 0', () => {
    expect(component.clickOutsideCount).toBe(0);
  });

  it('should emit when clicking outside the element', async () => {
    // Flush the microtask that attaches the document listener
    await Promise.resolve();

    const outsideButton = fixture.debugElement.query(By.css('[data-testid="outside-button"]'))
      .nativeElement as HTMLElement;
    outsideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.clickOutsideCount).toBe(1);
    expect(component.lastEvent).toBeInstanceOf(MouseEvent);
  });

  it('should not emit when clicking inside the element', async () => {
    await Promise.resolve();

    const insideButton = fixture.debugElement.query(By.css('[data-testid="inside-button"]'))
      .nativeElement as HTMLElement;
    insideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.clickOutsideCount).toBe(0);
  });

  it('should not emit when clicking an excluded element', async () => {
    component.excludeSelectors.set(['[data-testid="outside-button"]']);
    fixture.detectChanges();
    await Promise.resolve();

    const outsideButton = fixture.debugElement.query(By.css('[data-testid="outside-button"]'))
      .nativeElement as HTMLElement;
    outsideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.clickOutsideCount).toBe(0);
  });

  it('should not emit when detection is disabled', async () => {
    component.enabled.set(false);
    fixture.detectChanges();
    await Promise.resolve();

    const outsideButton = fixture.debugElement.query(By.css('[data-testid="outside-button"]'))
      .nativeElement as HTMLElement;
    outsideButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.clickOutsideCount).toBe(0);
  });
});
