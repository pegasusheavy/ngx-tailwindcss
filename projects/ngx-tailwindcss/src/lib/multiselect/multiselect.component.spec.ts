import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { MultiSelectOption, TwMultiSelectComponent } from './multiselect.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-multiselect
      [options]="options()"
      [maxSelections]="maxSelections()"
      [showSelectAll]="showSelectAll()"
      [disabled]="disabled()"
      (selectionChange)="onSelectionChange($event)"
      data-testid="test-multiselect"
    >
    </tw-multiselect>
  `,
  standalone: true,
  imports: [TwMultiSelectComponent],
})
class TestHostComponent {
  @ViewChild(TwMultiSelectComponent) multiselect!: TwMultiSelectComponent;
  options = signal<MultiSelectOption[]>([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]);
  maxSelections = signal(0);
  showSelectAll = signal(true);
  disabled = signal(false);
  lastSelection: unknown[] | null = null;

  onSelectionChange(values: unknown[]): void {
    this.lastSelection = values;
  }
}

@Component({
  template: ` <tw-multiselect [options]="options" [formControl]="control"></tw-multiselect> `,
  standalone: true,
  imports: [TwMultiSelectComponent, ReactiveFormsModule],
})
class ReactiveHostComponent {
  options: MultiSelectOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];
  control = new FormControl<unknown[]>([]);
}

describe('TwMultiSelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let trigger: HTMLButtonElement;

  const openDropdown = (): void => {
    trigger.click();
    fixture.detectChanges();
  };

  const optionEls = (): HTMLElement[] =>
    fixture.debugElement
      .queryAll(By.css('[role="option"]:not(.border-b)'))
      .map(de => de.nativeElement)
      .filter(el => !el.textContent?.includes('Select All'));

  const selectAllEl = (): HTMLElement | null => {
    const rows = fixture.debugElement.queryAll(By.css('[role="option"]'));
    const row = rows.find(de => de.nativeElement.textContent?.includes('Select All'));
    return row ? row.nativeElement : null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    trigger = fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement;
  });

  it('should create the multiselect', () => {
    expect(component.multiselect).toBeTruthy();
  });

  it('should render options when opened', () => {
    openDropdown();

    const labels = optionEls().map(el => el.textContent?.trim());
    expect(labels).toContain('Apple');
    expect(labels).toContain('Banana');
    expect(labels).toContain('Cherry');
  });

  it('should render options replaced after init', () => {
    openDropdown();

    component.options.set([
      { label: 'Delta', value: 'delta' },
      { label: 'Echo', value: 'echo' },
    ]);
    fixture.detectChanges();

    const labels = optionEls().map(el => el.textContent?.trim());
    expect(labels).toContain('Delta');
    expect(labels).toContain('Echo');
    expect(labels).not.toContain('Apple');
  });

  it('should toggle an option on click and emit selectionChange', () => {
    openDropdown();

    optionEls()[0].click();
    fixture.detectChanges();

    expect(component.lastSelection).toEqual(['apple']);
    expect(optionEls()[0].getAttribute('aria-selected')).toBe('true');
  });

  describe('select all', () => {
    it('should select all enabled options', () => {
      openDropdown();

      selectAllEl()!.click();
      fixture.detectChanges();

      expect(component.lastSelection).toEqual(['apple', 'banana', 'cherry']);
      expect(selectAllEl()!.getAttribute('aria-selected')).toBe('true');
    });

    it('should deselect all when all are selected', () => {
      openDropdown();

      selectAllEl()!.click();
      fixture.detectChanges();
      selectAllEl()!.click();
      fixture.detectChanges();

      expect(component.lastSelection).toEqual([]);
    });

    it('should skip disabled options', () => {
      component.options.set([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
        { label: 'Cherry', value: 'cherry' },
      ]);
      fixture.detectChanges();
      openDropdown();

      selectAllEl()!.click();
      fixture.detectChanges();

      expect(component.lastSelection).toEqual(['apple', 'cherry']);
      expect(selectAllEl()!.getAttribute('aria-selected')).toBe('true');
    });

    it('should hide select all when maxSelections is below the option count', () => {
      component.maxSelections.set(2);
      fixture.detectChanges();
      openDropdown();

      expect(selectAllEl()).toBeNull();
    });

    it('should show select all when maxSelections covers all options', () => {
      component.maxSelections.set(3);
      fixture.detectChanges();
      openDropdown();

      expect(selectAllEl()).toBeTruthy();

      selectAllEl()!.click();
      fixture.detectChanges();

      expect(component.lastSelection).toEqual(['apple', 'banana', 'cherry']);
      // Deselect branch must be reachable
      selectAllEl()!.click();
      fixture.detectChanges();
      expect(component.lastSelection).toEqual([]);
    });
  });

  describe('maxSelections', () => {
    it('should prevent selections beyond the limit', () => {
      component.maxSelections.set(1);
      fixture.detectChanges();
      openDropdown();

      optionEls()[0].click();
      fixture.detectChanges();
      optionEls()[1].click();
      fixture.detectChanges();

      expect(component.lastSelection).toEqual(['apple']);
    });
  });

  describe('keyboard navigation', () => {
    const keydown = (key: string): void => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    it('should open the dropdown on ArrowDown', () => {
      keydown('ArrowDown');
      expect(fixture.debugElement.query(By.css('[role="listbox"]'))).toBeTruthy();
    });

    it('should move the active option with arrows and expose aria-activedescendant', () => {
      keydown('ArrowDown');
      keydown('ArrowDown');

      const activeId = trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      expect(optionEls()[0].id).toBe(activeId);

      keydown('ArrowDown');
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionEls()[1].id);
    });

    it('should jump to last enabled option with End', () => {
      keydown('ArrowDown');
      keydown('End');

      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    });

    it('should toggle the active option with Enter', () => {
      keydown('ArrowDown');
      keydown('ArrowDown');
      keydown('Enter');

      expect(component.lastSelection).toEqual(['apple']);
    });

    it('should close on Escape', () => {
      keydown('ArrowDown');
      expect(fixture.debugElement.query(By.css('[role="listbox"]'))).toBeTruthy();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[role="listbox"]'))).toBeNull();
    });
  });

  describe('reactive forms', () => {
    it('should reflect programmatic setValue and disable in the DOM', async () => {
      const reactiveFixture = TestBed.createComponent(ReactiveHostComponent);
      const host = reactiveFixture.componentInstance;
      reactiveFixture.detectChanges();
      await Promise.resolve();

      host.control.setValue(['apple']);
      reactiveFixture.detectChanges();

      const triggerEl: HTMLButtonElement = reactiveFixture.debugElement.query(
        By.css('button[aria-haspopup]')
      ).nativeElement;
      expect(triggerEl.textContent).toContain('Apple');

      host.control.disable();
      reactiveFixture.detectChanges();

      expect(triggerEl.disabled).toBe(true);
      expect(triggerEl.className).toContain('cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('should render the panel as a multiselectable listbox', () => {
      openDropdown();

      const listbox = fixture.debugElement.query(By.css('[role="listbox"]'));
      expect(listbox).toBeTruthy();
      expect(listbox.nativeElement.getAttribute('aria-multiselectable')).toBe('true');
      expect(trigger.getAttribute('aria-controls')).toBe(listbox.nativeElement.id);
    });

    it('should mark disabled options with aria-disabled', () => {
      component.options.set([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
      ]);
      fixture.detectChanges();
      openDropdown();

      expect(optionEls()[1].getAttribute('aria-disabled')).toBe('true');
    });
  });
});
