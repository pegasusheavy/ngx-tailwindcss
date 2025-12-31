import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwAccordionComponent, TwAccordionItemComponent } from './accordion.component';

@Component({
  template: `
    <tw-accordion
      [allowMultiple]="allowMultiple()"
      [variant]="variant()"
      [defaultValue]="defaultValue()"
    >
      <tw-accordion-item
        value="item1"
        itemTitle="Item 1"
        [open]="item1Open()"
        (openChange)="onItem1Change($event)"
      >
        Content for item 1
      </tw-accordion-item>
      <tw-accordion-item
        value="item2"
        itemTitle="Item 2"
      >
        Content for item 2
      </tw-accordion-item>
      <tw-accordion-item
        value="item3"
        itemTitle="Item 3"
        [itemDisabled]="true"
      >
        Content for item 3
      </tw-accordion-item>
    </tw-accordion>
  `,
  standalone: true,
  imports: [TwAccordionComponent, TwAccordionItemComponent],
})
class TestHostComponent {
  @ViewChild(TwAccordionComponent) accordion!: TwAccordionComponent;
  allowMultiple = signal(false);
  variant = signal<'default' | 'bordered' | 'separated'>('default');
  defaultValue = signal<string | string[]>('');
  item1Open = signal(false);

  item1ChangeValue: boolean | null = null;

  onItem1Change(value: boolean) {
    this.item1ChangeValue = value;
  }
}

describe('TwAccordionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let accordionEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accordionEl = fixture.debugElement.query(By.directive(TwAccordionComponent)).nativeElement;
  });

  it('should create the accordion', () => {
    expect(accordionEl).toBeTruthy();
    expect(component.accordion).toBeTruthy();
  });

  it('should render all accordion items', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    expect(items.length).toBe(3);
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      const innerDiv = accordionEl.querySelector('div');
      expect(innerDiv?.className).toContain('border');
      expect(innerDiv?.className).toContain('rounded-lg');
    });

    it('should apply bordered variant classes', () => {
      component.variant.set('bordered');
      fixture.detectChanges();
      const innerDiv = accordionEl.querySelector('div');
      expect(innerDiv?.className).not.toContain('divide-y');
    });

    it('should apply separated variant classes', () => {
      component.variant.set('separated');
      fixture.detectChanges();
      const innerDiv = accordionEl.querySelector('div');
      expect(innerDiv?.className).not.toContain('divide-y');
    });
  });

  describe('single mode (allowMultiple=false)', () => {
    it('should open clicked item', () => {
      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
      const header = items[0].query(By.css('button'));
      header.nativeElement.click();
      fixture.detectChanges();

      const content = items[0].query(By.css('[class*="pb-4"]'));
      expect(content).toBeTruthy();
    });

    it('should close other items when opening one', () => {
      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));

      // Open first item
      items[0].query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      // Open second item
      items[1].query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      // First item should be closed (no content visible)
      const firstItemContent = items[0].nativeElement.querySelector('[class*="pb-4"]');
      expect(firstItemContent).toBeNull();
    });
  });

  describe('multiple mode (allowMultiple=true)', () => {
    beforeEach(() => {
      component.allowMultiple.set(true);
      fixture.detectChanges();
    });

    it('should allow multiple items to be open', () => {
      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));

      // Open first item
      items[0].query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      // Open second item
      items[1].query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      // Both items should have content visible
      const firstContent = items[0].query(By.css('[class*="pb-4"]'));
      const secondContent = items[1].query(By.css('[class*="pb-4"]'));
      expect(firstContent).toBeTruthy();
      expect(secondContent).toBeTruthy();
    });
  });

  describe('default value', () => {
    it('should open item with matching default value', () => {
      component.defaultValue.set('item2');
      fixture.detectChanges();

      // Need to re-init since ngAfterContentInit runs once
      fixture = TestBed.createComponent(TestHostComponent);
      fixture.componentInstance.defaultValue.set('item2');
      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
      const content = items[1].query(By.css('[class*="pb-4"]'));
      expect(content).toBeTruthy();
    });
  });

  describe('disabled items', () => {
    it('should not toggle disabled item', () => {
      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
      const disabledHeader = items[2].query(By.css('button'));

      disabledHeader.nativeElement.click();
      fixture.detectChanges();

      const content = items[2].query(By.css('[class*="pb-4"]'));
      expect(content).toBeNull();
    });

    it('should apply disabled styling', () => {
      const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
      const disabledHeader = items[2].query(By.css('button'));
      expect(disabledHeader.nativeElement.className).toContain('cursor-not-allowed');
    });
  });
});

describe('TwAccordionItemComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render item title', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    expect(items[0].nativeElement.textContent).toContain('Item 1');
  });

  it('should render content when open', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    items[0].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(items[0].nativeElement.textContent).toContain('Content for item 1');
  });

  it('should toggle on click', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    const header = items[0].query(By.css('button'));

    // Open
    header.nativeElement.click();
    fixture.detectChanges();
    expect(component.item1ChangeValue).toBe(true);

    // Close
    header.nativeElement.click();
    fixture.detectChanges();
    expect(component.item1ChangeValue).toBe(false);
  });

  it('should have chevron icon that rotates when open', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    const icon = items[0].query(By.css('svg'));

    // SVG elements use getAttribute('class') instead of className
    expect(icon.nativeElement.getAttribute('class')).not.toContain('rotate-180');

    items[0].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(icon.nativeElement.getAttribute('class')).toContain('rotate-180');
  });

  it('should emit openChange event', () => {
    const items = fixture.debugElement.queryAll(By.directive(TwAccordionItemComponent));
    items[0].query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(component.item1ChangeValue).toBe(true);
  });
});
