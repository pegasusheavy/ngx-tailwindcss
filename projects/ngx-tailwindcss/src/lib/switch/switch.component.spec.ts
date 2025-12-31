import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwSwitchComponent, SwitchVariant, SwitchSize } from './switch.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-switch
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [labelPosition]="labelPosition()"
      [classOverride]="classOverride()"
      (onChange)="onSwitchChange($event)"
    >
      {{ label() }}
    </tw-switch>
  `,
  standalone: true,
  imports: [TwSwitchComponent],
})
class TestHostComponent {
  @ViewChild(TwSwitchComponent) switch!: TwSwitchComponent;
  variant = signal<SwitchVariant>('primary');
  size = signal<SwitchSize>('md');
  disabled = signal(false);
  labelPosition = signal<'left' | 'right'>('right');
  classOverride = signal('');
  label = signal('Test Switch');

  changeValue: boolean | null = null;

  onSwitchChange(value: boolean) {
    this.changeValue = value;
  }
}

@Component({
  template: `<tw-switch [(ngModel)]="enabled">NgModel Switch</tw-switch>`,
  standalone: true,
  imports: [TwSwitchComponent, FormsModule],
})
class NgModelTestComponent {
  @ViewChild(TwSwitchComponent) switch!: TwSwitchComponent;
  enabled = false;
}

@Component({
  template: `<tw-switch [formControl]="control">FormControl Switch</tw-switch>`,
  standalone: true,
  imports: [TwSwitchComponent, ReactiveFormsModule],
})
class FormControlTestComponent {
  @ViewChild(TwSwitchComponent) switch!: TwSwitchComponent;
  control = new FormControl(false);
}

describe('TwSwitchComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let switchEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    switchEl = fixture.debugElement.query(By.directive(TwSwitchComponent)).nativeElement;
  });

  it('should create the switch', () => {
    expect(switchEl).toBeTruthy();
    expect(component.switch).toBeTruthy();
  });

  it('should render label text', () => {
    expect(switchEl.textContent).toContain('Test Switch');
  });

  describe('variants', () => {
    it('should apply primary variant colors when on', () => {
      component.switch.toggle();
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('bg-blue-600');
    });

    it('should apply success variant colors when on', () => {
      component.variant.set('success');
      component.switch.toggle();
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('bg-emerald-600');
    });

    it('should apply warning variant colors when on', () => {
      component.variant.set('warning');
      component.switch.toggle();
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('bg-amber-500');
    });

    it('should apply danger variant colors when on', () => {
      component.variant.set('danger');
      component.switch.toggle();
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('bg-rose-600');
    });

    it('should apply secondary variant colors when on', () => {
      component.variant.set('secondary');
      component.switch.toggle();
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('bg-slate-600');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('w-11');
      expect(track?.className).toContain('h-6');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('w-8');
      expect(track?.className).toContain('h-5');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const track = switchEl.querySelector('button');
      expect(track?.className).toContain('w-14');
      expect(track?.className).toContain('h-8');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled styling', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const label = switchEl.querySelector('label');
      expect(label?.className).toContain('opacity-50');
      expect(label?.className).toContain('cursor-not-allowed');
    });

    it('should not toggle when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      component.switch.toggle();
      expect(component.changeValue).toBeNull();
    });
  });

  describe('label position', () => {
    it('should have label on right by default', () => {
      const label = switchEl.querySelector('label');
      expect(label?.className).not.toContain('flex-row-reverse');
    });

    it('should have label on left when specified', () => {
      component.labelPosition.set('left');
      fixture.detectChanges();
      const label = switchEl.querySelector('label');
      expect(label?.className).toContain('flex-row-reverse');
    });
  });

  describe('switch interactions', () => {
    it('should toggle on click', () => {
      const button = switchEl.querySelector('button') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      expect(component.changeValue).toBe(true);
    });

    it('should toggle back to false', () => {
      component.switch.toggle();
      fixture.detectChanges();
      component.switch.toggle();
      fixture.detectChanges();
      expect(component.changeValue).toBe(false);
    });

    it('should translate thumb when toggled', () => {
      component.switch.toggle();
      fixture.detectChanges();
      const thumb = switchEl.querySelector('span');
      expect(thumb?.className).toContain('translate-x-5');
    });
  });

  describe('class customization', () => {
    it('should apply classOverride', () => {
      component.classOverride.set('custom-class');
      fixture.detectChanges();
      const label = switchEl.querySelector('label');
      expect(label?.className).toContain('custom-class');
    });
  });
});

describe('TwSwitchComponent with NgModel', () => {
  let fixture: ComponentFixture<NgModelTestComponent>;
  let component: NgModelTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgModelTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(NgModelTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should bind with ngModel', async () => {
    component.enabled = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const track = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(track.className).toContain('bg-blue-600');
  });

  it('should update ngModel on toggle', async () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.enabled).toBe(true);
  });
});

describe('TwSwitchComponent with FormControl', () => {
  let fixture: ComponentFixture<FormControlTestComponent>;
  let component: FormControlTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(FormControlTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should bind with FormControl', () => {
    component.control.setValue(true);
    fixture.detectChanges();

    const track = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(track.className).toContain('bg-blue-600');
  });

  it('should update FormControl on toggle', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(component.control.value).toBe(true);
  });

  it('should disable switch when FormControl is disabled', () => {
    component.control.disable();
    fixture.detectChanges();

    const switchEl = fixture.debugElement.query(By.directive(TwSwitchComponent)).nativeElement;
    const label = switchEl.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});
