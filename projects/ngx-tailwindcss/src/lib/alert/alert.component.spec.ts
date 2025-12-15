import { Component, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  TwAlertComponent,
  TwAlertTitleComponent,
  TwAlertDescriptionComponent,
  AlertVariant,
  AlertStyle,
} from './alert.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-alert
      [variant]="variant()"
      [alertStyle]="alertStyle()"
      [dismissible]="dismissible()"
      [showIcon]="showIcon()"
      [hasCustomIcon]="hasCustomIcon()"
      [ariaLive]="ariaLive()"
      [classOverride]="classOverride()"
      (dismiss)="onDismiss()"
      data-testid="test-alert">
      {{ alertText() }}
    </tw-alert>
  `,
  standalone: true,
  imports: [TwAlertComponent],
})
class TestHostComponent {
  @ViewChild(TwAlertComponent) alert!: TwAlertComponent;
  variant = signal<AlertVariant>('info');
  alertStyle = signal<AlertStyle>('soft');
  dismissible = signal(false);
  showIcon = signal(true);
  hasCustomIcon = signal(false);
  ariaLive = signal<'polite' | 'assertive' | 'off'>('polite');
  classOverride = signal('');
  alertText = signal('Alert message');
  dismissCount = 0;

  onDismiss(): void {
    this.dismissCount++;
  }
}

describe('TwAlertComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let alertEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alertEl = fixture.debugElement.query(By.directive(TwAlertComponent)).nativeElement;
  });

  it('should create the alert', () => {
    expect(alertEl).toBeTruthy();
    expect(component.alert).toBeTruthy();
  });

  it('should have role="alert"', () => {
    expect(alertEl.getAttribute('role')).toBe('alert');
  });

  it('should render alert text', () => {
    expect(alertEl.textContent).toContain('Alert message');
  });

  describe('variants', () => {
    it('should have default info variant', () => {
      expect(component.variant()).toBe('info');
    });

    it('should apply info variant classes', () => {
      const classes = alertEl.className;
      expect(classes).toContain('bg-blue-50');
    });
  });

  describe('styles', () => {
    it('should have default soft style', () => {
      expect(component.alertStyle()).toBe('soft');
    });

    it('should apply soft style classes', () => {
      expect(alertEl.className).toContain('bg-blue-50');
      expect(alertEl.className).toContain('text-blue-800');
    });
  });

  describe('icon', () => {
    it('should show icon by default', () => {
      const icon = alertEl.querySelector('svg');
      expect(icon).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      component.showIcon.set(false);
      fixture.detectChanges();

      const iconWrapper = alertEl.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeNull();
    });
  });

  describe('dismissible', () => {
    it('should not show dismiss button by default', () => {
      const dismissBtn = alertEl.querySelector('button[aria-label="Dismiss"]');
      expect(dismissBtn).toBeNull();
    });

    it('should show dismiss button when dismissible', () => {
      component.dismissible.set(true);
      fixture.detectChanges();

      const dismissBtn = alertEl.querySelector('button[aria-label="Dismiss"]');
      expect(dismissBtn).toBeTruthy();
    });

    it('should emit dismiss event when clicked', () => {
      component.dismissible.set(true);
      fixture.detectChanges();

      const dismissBtn = alertEl.querySelector('button[aria-label="Dismiss"]') as HTMLButtonElement;
      dismissBtn.click();
      fixture.detectChanges();

      expect(component.dismissCount).toBe(1);
    });

    it('should hide alert when dismissed', () => {
      component.dismissible.set(true);
      fixture.detectChanges();

      const dismissBtn = alertEl.querySelector('button[aria-label="Dismiss"]') as HTMLButtonElement;
      dismissBtn.click();
      fixture.detectChanges();

      expect(alertEl.className).toContain('hidden');
    });
  });

  describe('aria-live', () => {
    it('should have polite aria-live by default', () => {
      expect(alertEl.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('public methods', () => {
    it('should dismiss alert programmatically', () => {
      component.alert.dismissAlert();
      fixture.detectChanges();

      expect(alertEl.className).toContain('hidden');
      expect(component.dismissCount).toBe(1);
    });

    it('should show alert again after dismissal', () => {
      component.alert.dismissAlert();
      fixture.detectChanges();

      expect(alertEl.className).toContain('hidden');

      component.alert.show();
      fixture.detectChanges();

      expect(alertEl.className).not.toContain('hidden');
    });
  });

  describe('class customization', () => {
    it('should have empty classOverride by default', () => {
      expect(component.classOverride()).toBe('');
    });
  });
});

@Component({
  template: `
    <tw-alert variant="info">
      <tw-alert-title>Title</tw-alert-title>
      <tw-alert-description>Description text</tw-alert-description>
    </tw-alert>
  `,
  standalone: true,
  imports: [TwAlertComponent, TwAlertTitleComponent, TwAlertDescriptionComponent],
})
class AlertWithTitleDescriptionComponent {}

describe('Alert sub-components', () => {
  let fixture: ComponentFixture<AlertWithTitleDescriptionComponent>;
  let alertEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertWithTitleDescriptionComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertWithTitleDescriptionComponent);
    fixture.detectChanges();
    alertEl = fixture.debugElement.query(By.directive(TwAlertComponent)).nativeElement;
  });

  it('should render title component', () => {
    const title = fixture.debugElement.query(By.directive(TwAlertTitleComponent));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Title');
  });

  it('should render description component', () => {
    const desc = fixture.debugElement.query(By.directive(TwAlertDescriptionComponent));
    expect(desc).toBeTruthy();
    expect(desc.nativeElement.textContent).toContain('Description text');
  });

  it('should apply title classes', () => {
    const title = fixture.debugElement.query(By.directive(TwAlertTitleComponent)).nativeElement;
    expect(title.className).toContain('font-semibold');
  });

  it('should apply description classes', () => {
    const desc = fixture.debugElement.query(By.directive(TwAlertDescriptionComponent)).nativeElement;
    expect(desc.className).toContain('text-sm');
  });
});
