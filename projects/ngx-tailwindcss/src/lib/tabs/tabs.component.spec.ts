import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TabsSize, TabsVariant, TwTabPanelComponent, TwTabsComponent } from './tabs.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-tabs
      [(value)]="activeTab"
      [variant]="variant"
      [size]="size"
      [fullWidth]="fullWidth"
      (valueChange)="onTabChange($event)"
      data-testid="test-tabs"
    >
      <tw-tab-panel value="tab1" label="Tab 1" data-testid="panel-1">
        Content for Tab 1
      </tw-tab-panel>
      <tw-tab-panel value="tab2" label="Tab 2" data-testid="panel-2">
        Content for Tab 2
      </tw-tab-panel>
      <tw-tab-panel value="tab3" label="Tab 3" [disabled]="tab3Disabled" data-testid="panel-3">
        Content for Tab 3
      </tw-tab-panel>
    </tw-tabs>
  `,
  standalone: true,
  imports: [TwTabsComponent, TwTabPanelComponent],
})
class TestHostComponent {
  @ViewChild(TwTabsComponent) tabs!: TwTabsComponent;
  activeTab = 'tab1';
  variant: TabsVariant = 'line';
  size: TabsSize = 'md';
  fullWidth = false;
  tab3Disabled = false;
  tabChangeCount = 0;
  lastSelectedTab = '';

  onTabChange(value: string): void {
    this.tabChangeCount++;
    this.lastSelectedTab = value;
  }
}

describe('TwTabsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let tabsEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tabsEl = fixture.debugElement.query(By.directive(TwTabsComponent)).nativeElement;
  });

  it('should create the tabs', () => {
    expect(tabsEl).toBeTruthy();
    expect(component.tabs).toBeTruthy();
  });

  it('should render tab buttons', () => {
    const tabButtons = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabButtons.length).toBe(3);
  });

  it('should render tab panels', () => {
    const panels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));
    expect(panels.length).toBe(3);
  });

  it('should show first tab content by default', () => {
    const panel1 = fixture.debugElement.query(By.css('[data-testid="panel-1"]'));
    expect(panel1.nativeElement.textContent).toContain('Content for Tab 1');
    expect(panel1.nativeElement.getAttribute('hidden')).toBeNull();

    const panel2 = fixture.debugElement.query(By.css('[data-testid="panel-2"]'));
    expect(panel2.nativeElement.getAttribute('hidden')).toBe('true');
  });

  describe('variants', () => {
    it('should have default line variant styles', () => {
      const tabList = fixture.debugElement.query(By.css('[role="tablist"]'));
      expect(tabList).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should apply default size', () => {
      const tabButton = fixture.debugElement.query(By.css('[role="tab"]'));
      expect(tabButton).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const tabList = fixture.debugElement.query(By.css('[role="tablist"]'));
      expect(tabList).toBeTruthy();
      expect(tabList.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should link tabs to panels', () => {
      const tab1Button = fixture.debugElement.queryAll(By.css('[role="tab"]'))[0];
      const panel1 = fixture.debugElement.query(By.css('[data-testid="panel-1"]'));

      const tabId = tab1Button.nativeElement.id;
      const panelLabelledBy = panel1.nativeElement.getAttribute('aria-labelledby');

      expect(panelLabelledBy).toBe(tabId);
    });

    it('should give each panel an id matching the tab aria-controls', () => {
      const tabButtons = fixture.debugElement.queryAll(By.css('[role="tab"]'));
      const panel1 = fixture.debugElement.query(By.css('[data-testid="panel-1"]'));

      expect(panel1.nativeElement.id).toBe('panel-tab1');
      expect(tabButtons[0].nativeElement.getAttribute('aria-controls')).toBe(
        panel1.nativeElement.id
      );
    });

    it('should set tabindex correctly', () => {
      const tabButtons = fixture.debugElement.queryAll(By.css('[role="tab"]'));

      expect(tabButtons[0].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(tabButtons[1].nativeElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('fullWidth', () => {
    it('should have flex layout by default', () => {
      const tabList = fixture.debugElement.query(By.css('[role="tablist"]'));
      expect(tabList.nativeElement.className).toContain('flex');
    });
  });
});

@Component({
  template: `
    <tw-tabs [animated]="false">
      <tw-tab-panel value="a" label="A" data-testid="panel-a">Content A</tw-tab-panel>
      <tw-tab-panel value="b" label="B" [lazy]="true" data-testid="panel-b">Lazy B</tw-tab-panel>
    </tw-tabs>
  `,
  standalone: true,
  imports: [TwTabsComponent, TwTabPanelComponent],
})
class LazyTabsHostComponent {
  @ViewChild(TwTabsComponent) tabs!: TwTabsComponent;
}

describe('TwTabsComponent lazy panels', () => {
  let fixture: ComponentFixture<LazyTabsHostComponent>;
  let component: LazyTabsHostComponent;

  const lazyPanel = () => fixture.debugElement.query(By.css('[data-testid="panel-b"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyTabsHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(LazyTabsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render lazy panel content before first activation', () => {
    expect(lazyPanel().nativeElement.textContent).not.toContain('Lazy B');
  });

  it('should render lazy panel content on activation', () => {
    component.tabs.select('b');
    fixture.detectChanges();
    expect(lazyPanel().nativeElement.textContent).toContain('Lazy B');
    expect(lazyPanel().nativeElement.getAttribute('hidden')).toBeNull();
  });

  it('should keep lazy panel content rendered after deactivation', () => {
    component.tabs.select('b');
    fixture.detectChanges();
    component.tabs.select('a');
    fixture.detectChanges();

    // Content is retained ("load once"), only hidden
    expect(lazyPanel().nativeElement.textContent).toContain('Lazy B');
    expect(lazyPanel().nativeElement.getAttribute('hidden')).toBe('true');
  });
});
