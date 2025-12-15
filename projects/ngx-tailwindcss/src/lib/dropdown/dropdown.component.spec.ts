import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DropdownPosition,
  TwDropdownComponent,
  TwDropdownDividerComponent,
  TwDropdownHeaderComponent,
  TwDropdownItemDirective,
} from './dropdown.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-dropdown
      [position]="position()"
      [disabled]="disabled()"
      [closeOnSelect]="closeOnSelect()"
      (opened)="onOpened()"
      (closed)="onClosed()"
      data-testid="test-dropdown"
    >
      <button twDropdownTrigger data-testid="trigger">Open Menu</button>
      <div class="tw-dropdown-menu">
        <button twDropdownItem data-testid="item-1">Item 1</button>
        <button twDropdownItem data-testid="item-2">Item 2</button>
      </div>
    </tw-dropdown>
  `,
  standalone: true,
  imports: [TwDropdownComponent, TwDropdownItemDirective],
})
class TestHostComponent {
  @ViewChild(TwDropdownComponent) dropdown!: TwDropdownComponent;
  position = signal<DropdownPosition>('bottom-start');
  disabled = signal(false);
  closeOnSelect = signal(true);
  openedCount = 0;
  closedCount = 0;

  onOpened(): void {
    this.openedCount++;
  }

  onClosed(): void {
    this.closedCount++;
  }
}

describe('TwDropdownComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let trigger: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trigger = fixture.debugElement.query(By.css('[data-testid="trigger"]')).nativeElement;
  });

  afterEach(() => {
    // Ensure dropdown is closed and cleanup
    component.dropdown?.close();
    fixture.detectChanges();
  });

  it('should create the dropdown', () => {
    expect(component.dropdown).toBeTruthy();
  });

  it('should not be open initially', () => {
    // Test internal state since portal is created dynamically
    expect(component.dropdown.isOpen()).toBe(false);
  });

  it('should open when trigger is clicked', () => {
    trigger.click();
    fixture.detectChanges();

    expect(component.dropdown.isOpen()).toBe(true);
    expect(component.openedCount).toBe(1);
  });

  it('should close when clicked again (toggle)', () => {
    trigger.click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    expect(component.dropdown.isOpen()).toBe(false);
    expect(component.closedCount).toBe(1);
  });

  it('should not open when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    expect(component.dropdown.isOpen()).toBe(false);
  });

  describe('positions', () => {
    const positions: DropdownPosition[] = [
      'bottom-start',
      'bottom-end',
      'top-start',
      'top-end',
      'left',
      'right',
    ];

    positions.forEach(position => {
      it(`should accept ${position} position`, () => {
        component.position.set(position);
        fixture.detectChanges();

        expect(component.dropdown.position).toBe(position);

        trigger.click();
        fixture.detectChanges();

        expect(component.dropdown.isOpen()).toBe(true);
      });
    });
  });

  describe('public methods', () => {
    it('should open via open()', () => {
      component.dropdown.open();
      fixture.detectChanges();

      expect(component.dropdown.isOpen()).toBe(true);
    });

    it('should close via close()', () => {
      component.dropdown.open();
      fixture.detectChanges();

      component.dropdown.close();
      fixture.detectChanges();

      expect(component.dropdown.isOpen()).toBe(false);
    });

    it('should toggle via toggle()', () => {
      component.dropdown.toggle();
      fixture.detectChanges();

      expect(component.dropdown.isOpen()).toBe(true);

      component.dropdown.toggle();
      fixture.detectChanges();

      expect(component.dropdown.isOpen()).toBe(false);
    });
  });
});

@Component({
  template: ` <tw-dropdown-divider></tw-dropdown-divider> `,
  standalone: true,
  imports: [TwDropdownDividerComponent],
})
class DividerTestComponent {}

describe('TwDropdownDividerComponent', () => {
  let fixture: ComponentFixture<DividerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerTestComponent);
    fixture.detectChanges();
  });

  it('should have role separator', () => {
    const divider = fixture.debugElement.query(By.directive(TwDropdownDividerComponent));
    expect(divider.nativeElement.getAttribute('role')).toBe('separator');
  });
});

@Component({
  template: ` <tw-dropdown-header>Actions</tw-dropdown-header> `,
  standalone: true,
  imports: [TwDropdownHeaderComponent],
})
class HeaderTestComponent {}

describe('TwDropdownHeaderComponent', () => {
  let fixture: ComponentFixture<HeaderTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderTestComponent);
    fixture.detectChanges();
  });

  it('should render header content', () => {
    const header = fixture.debugElement.query(By.directive(TwDropdownHeaderComponent));
    expect(header.nativeElement.textContent).toContain('Actions');
  });
});
