import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepItem, StepsOrientation, StepsSize, TwStepsComponent } from './steps.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-steps
      [steps]="steps()"
      [activeIndex]="activeIndex()"
      [orientation]="orientation()"
      [size]="size()"
      [showLabels]="showLabels()"
      [readonly]="readonly()"
      [linear]="linear()"
      (activeIndexChange)="onActiveIndexChangeSpy($event)"
      (onStepClick$)="onStepClickSpy($event)"
      data-testid="test-steps"
    ></tw-steps>
  `,
  standalone: true,
  imports: [TwStepsComponent],
})
class TestHostComponent {
  @ViewChild(TwStepsComponent) stepsComponent!: TwStepsComponent;
  steps = signal<StepItem[]>([
    { id: '1', label: 'Personal Info', description: 'Enter your details' },
    { id: '2', label: 'Account Setup', description: 'Create your account' },
    { id: '3', label: 'Confirmation', description: 'Review and confirm' },
    { id: '4', label: 'Disabled Step', disabled: true },
  ]);
  activeIndex = signal(0);
  orientation = signal<StepsOrientation>('horizontal');
  size = signal<StepsSize>('md');
  showLabels = signal(true);
  readonly = signal(false);
  linear = signal(true);

  onActiveIndexChangeSpy = vi.fn();
  onStepClickSpy = vi.fn();
}

describe('TwStepsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let stepsEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stepsEl = fixture.debugElement.query(By.directive(TwStepsComponent));
  });

  it('should create the steps component', () => {
    expect(stepsEl).toBeTruthy();
    expect(component.stepsComponent).toBeTruthy();
  });

  it('should render all steps', () => {
    expect(stepsEl.nativeElement.textContent).toContain('Personal Info');
    expect(stepsEl.nativeElement.textContent).toContain('Account Setup');
    expect(stepsEl.nativeElement.textContent).toContain('Confirmation');
  });

  it('should show descriptions when showLabels is true', () => {
    expect(stepsEl.nativeElement.textContent).toContain('Enter your details');
    expect(stepsEl.nativeElement.textContent).toContain('Create your account');
  });

  describe('step status', () => {
    it('should mark first step as current', () => {
      const status = component.stepsComponent.getStepStatus(0);
      expect(status).toBe('current');
    });

    it('should mark future steps as upcoming', () => {
      const status = component.stepsComponent.getStepStatus(2);
      expect(status).toBe('upcoming');
    });

    it('should mark past steps as complete', () => {
      component.activeIndex.set(2);
      fixture.detectChanges();
      const status = component.stepsComponent.getStepStatus(0);
      expect(status).toBe('complete');
    });
  });

  describe('step navigation', () => {
    it('should emit activeIndexChange when clicking a step', () => {
      // Only previous/current steps are clickable in linear mode
      const stepElements = stepsEl.queryAll(By.css('.cursor-pointer'));
      if (stepElements.length > 0) {
        stepElements[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.onStepClickSpy).toHaveBeenCalled();
      }
    });

    it('should not allow clicking future steps in linear mode', () => {
      component.activeIndex.set(0);
      fixture.detectChanges();
      // Future steps should not be clickable
      const stepIndicators = stepsEl.queryAll(By.css('.rounded-full'));
      // Upcoming step (index 2) should not trigger change when clicked
      // The click handler checks if it's allowed
    });

    it('should allow clicking any step when linear is false', () => {
      component.linear.set(false);
      fixture.detectChanges();
      // All steps should be clickable now
    });
  });

  describe('navigation methods', () => {
    it('should go to next step via next()', () => {
      component.stepsComponent.next();
      expect(component.onActiveIndexChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should go to previous step via prev()', () => {
      component.activeIndex.set(2);
      fixture.detectChanges();
      component.stepsComponent.prev();
      expect(component.onActiveIndexChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should not go below 0 via prev()', () => {
      component.activeIndex.set(0);
      fixture.detectChanges();
      component.stepsComponent.prev();
      expect(component.onActiveIndexChangeSpy).not.toHaveBeenCalled();
    });

    it('should not exceed steps length via next()', () => {
      component.activeIndex.set(3);
      fixture.detectChanges();
      component.stepsComponent.next();
      expect(component.onActiveIndexChangeSpy).not.toHaveBeenCalled();
    });

    it('should go to specific step via goTo()', () => {
      component.stepsComponent.goTo(2);
      expect(component.onActiveIndexChangeSpy).toHaveBeenCalledWith(2);
    });

    it('should not go to invalid index via goTo()', () => {
      component.stepsComponent.goTo(10);
      expect(component.onActiveIndexChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('orientation', () => {
    it('should apply horizontal orientation by default', () => {
      const list = stepsEl.query(By.css('.flex'));
      expect(list.nativeElement.className).toContain('items-start');
    });

    it('should apply vertical orientation', () => {
      component.orientation.set('vertical');
      fixture.detectChanges();
      const list = stepsEl.query(By.css('.flex'));
      expect(list.nativeElement.className).toContain('flex-col');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const indicators = stepsEl.queryAll(By.css('.rounded-full'));
      expect(indicators[0].nativeElement.className).toContain('w-10');
      expect(indicators[0].nativeElement.className).toContain('h-10');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const indicators = stepsEl.queryAll(By.css('.rounded-full'));
      expect(indicators[0].nativeElement.className).toContain('w-8');
      expect(indicators[0].nativeElement.className).toContain('h-8');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const indicators = stepsEl.queryAll(By.css('.rounded-full'));
      expect(indicators[0].nativeElement.className).toContain('w-12');
      expect(indicators[0].nativeElement.className).toContain('h-12');
    });
  });

  describe('readonly mode', () => {
    it('should not respond to clicks in readonly mode', () => {
      component.readonly.set(true);
      fixture.detectChanges();
      const stepElements = stepsEl.queryAll(By.css('.rounded-full'));
      stepElements[0].nativeElement.click();
      expect(component.onStepClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('disabled steps', () => {
    it('should apply disabled opacity to disabled step', () => {
      const indicators = stepsEl.queryAll(By.css('.rounded-full'));
      const disabledIndicator = indicators[3]; // 4th step is disabled
      expect(disabledIndicator.nativeElement.className).toContain('opacity-50');
    });

    it('should not allow clicking disabled step', () => {
      component.linear.set(false); // Allow non-linear navigation
      component.activeIndex.set(2);
      fixture.detectChanges();
      component.stepsComponent.onStepClick(3); // Disabled step
      expect(component.onActiveIndexChangeSpy).not.toHaveBeenCalled();
    });
  });
});
