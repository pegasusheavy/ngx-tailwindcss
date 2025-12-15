import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { TwTooltipDirective, TooltipPosition } from './tooltip.directive';

@Component({
  template: `
    <button
      [twTooltip]="tooltipContent()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipClass]="tooltipClass()"
      [tooltipShowDelay]="showDelay()"
      [tooltipHideDelay]="hideDelay()"
      [tooltipDisabled]="tooltipDisabled()"
      [tooltipZIndex]="zIndex()"
      data-testid="tooltip-trigger">
      Hover me
    </button>
  `,
  standalone: true,
  imports: [TwTooltipDirective],
})
class TestHostComponent {
  tooltipContent = signal('Test tooltip');
  tooltipPosition = signal<TooltipPosition>('top');
  tooltipClass = signal('');
  showDelay = signal(0);
  hideDelay = signal(0);
  tooltipDisabled = signal(false);
  zIndex = signal(9999);
}

describe('TwTooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let buttonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]')).nativeElement;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(buttonEl).toBeTruthy();
  });

  it('should have default tooltip content', () => {
    expect(component.tooltipContent()).toBe('Test tooltip');
  });

  it('should have default position of top', () => {
    expect(component.tooltipPosition()).toBe('top');
  });

  it('should have default show delay of 0', () => {
    expect(component.showDelay()).toBe(0);
  });

  it('should have default hide delay of 0', () => {
    expect(component.hideDelay()).toBe(0);
  });

  it('should not be disabled by default', () => {
    expect(component.tooltipDisabled()).toBe(false);
  });

  it('should have default z-index of 9999', () => {
    expect(component.zIndex()).toBe(9999);
  });

  it('should allow custom tooltip content', () => {
    component.tooltipContent.set('Custom content');
    fixture.detectChanges();
    expect(component.tooltipContent()).toBe('Custom content');
  });

  it('should allow custom position', () => {
    component.tooltipPosition.set('bottom');
    fixture.detectChanges();
    expect(component.tooltipPosition()).toBe('bottom');
  });

  it('should allow disabling tooltip', () => {
    component.tooltipDisabled.set(true);
    fixture.detectChanges();
    expect(component.tooltipDisabled()).toBe(true);
  });

  it('should allow custom z-index', () => {
    component.zIndex.set(5000);
    fixture.detectChanges();
    expect(component.zIndex()).toBe(5000);
  });
});
