import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarPosition, TwSidebarComponent } from './sidebar.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-sidebar
      [(visible)]="visible"
      [header]="header()"
      [position]="position()"
      [dismissible]="dismissible()"
      (onShow)="onShowSpy()"
      (onHide)="onHideSpy()"
    >
      <p>Sidebar body</p>
    </tw-sidebar>
  `,
  standalone: true,
  imports: [TwSidebarComponent],
})
class TestHostComponent {
  @ViewChild(TwSidebarComponent) sidebar!: TwSidebarComponent;
  visible = signal(false);
  header = signal('Menu');
  position = signal<SidebarPosition>('left');
  dismissible = signal(true);

  onShowSpy = vi.fn();
  onHideSpy = vi.fn();
}

@Component({
  template: `
    <tw-sidebar [(visible)]="visible">
      <p>Content</p>
      <ng-template #twSidebarFooter>
        <button type="button" class="footer-action">Save</button>
      </ng-template>
    </tw-sidebar>
  `,
  standalone: true,
  imports: [TwSidebarComponent],
})
class TemplateFooterHostComponent {
  visible = signal(true);
}

@Component({
  template: `
    <tw-sidebar [(visible)]="visible">
      <p>Content</p>
      <div twSidebarFooter class="attr-footer">Attribute footer</div>
    </tw-sidebar>
  `,
  standalone: true,
  imports: [TwSidebarComponent],
})
class AttributeFooterHostComponent {
  visible = signal(true);
}

describe('TwSidebarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let sidebarEl: DebugElement;

  const panelEl = () => sidebarEl.query(By.css('[role="dialog"]')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sidebarEl = fixture.debugElement.query(By.directive(TwSidebarComponent));
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create the sidebar', () => {
    expect(sidebarEl).toBeTruthy();
    expect(component.sidebar).toBeTruthy();
  });

  it('should start hidden with the panel off-screen and inert', () => {
    expect(panelEl().className).toContain('-translate-x-full');
    expect(panelEl().hasAttribute('inert')).toBe(true);
    expect(panelEl().getAttribute('aria-hidden')).toBe('true');
  });

  describe('visible model', () => {
    it('should slide in when the bound value becomes true', () => {
      component.visible.set(true);
      fixture.detectChanges();
      expect(panelEl().className).toContain('translate-x-0');
      expect(panelEl().hasAttribute('inert')).toBe(false);
    });

    it('should propagate hide() back to the bound value', () => {
      component.visible.set(true);
      fixture.detectChanges();
      component.sidebar.hide();
      fixture.detectChanges();
      expect(component.visible()).toBe(false);
      expect(panelEl().className).toContain('-translate-x-full');
    });

    it('should propagate show() back to the bound value', () => {
      component.sidebar.show();
      fixture.detectChanges();
      expect(component.visible()).toBe(true);
    });
  });

  describe('show/hide events', () => {
    it('should emit onShow when shown', () => {
      component.visible.set(true);
      fixture.detectChanges();
      expect(component.onShowSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit onHide when hidden', () => {
      component.visible.set(true);
      fixture.detectChanges();
      component.visible.set(false);
      fixture.detectChanges();
      expect(component.onHideSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit onHide on initial render', () => {
      expect(component.onHideSpy).not.toHaveBeenCalled();
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll while visible and restore the previous value', () => {
      document.body.style.overflow = 'scroll';
      component.visible.set(true);
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('hidden');

      component.visible.set(false);
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('scroll');
    });
  });

  describe('dismissal', () => {
    it('should hide on backdrop click when dismissible', () => {
      component.visible.set(true);
      fixture.detectChanges();
      const backdrop = sidebarEl.query(By.css('[aria-hidden="true"].fixed.inset-0'));
      backdrop.nativeElement.click();
      fixture.detectChanges();
      expect(component.visible()).toBe(false);
    });

    it('should hide on Escape', () => {
      component.visible.set(true);
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      expect(component.visible()).toBe(false);
    });

    it('should hide via the close button', () => {
      component.visible.set(true);
      fixture.detectChanges();
      const closeButton = sidebarEl.query(By.css('button[aria-label="Close sidebar"]'));
      closeButton.nativeElement.click();
      fixture.detectChanges();
      expect(component.visible()).toBe(false);
      expect(component.onHideSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should render the header text', () => {
    expect(panelEl().textContent).toContain('Menu');
  });
});

describe('TwSidebarComponent footer projection', () => {
  it('should render an ng-template footer via ngTemplateOutlet', async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateFooterHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    const fixture = TestBed.createComponent(TemplateFooterHostComponent);
    fixture.detectChanges();

    const footerAction = fixture.debugElement.query(By.css('.footer-action'));
    expect(footerAction).toBeTruthy();
    expect(footerAction.nativeElement.textContent).toContain('Save');
    document.body.style.overflow = '';
  });

  it('should render an attribute-marked footer via the content slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeFooterHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    const fixture = TestBed.createComponent(AttributeFooterHostComponent);
    fixture.detectChanges();

    const attrFooter = fixture.debugElement.query(By.css('.attr-footer'));
    expect(attrFooter).toBeTruthy();
    expect(attrFooter.nativeElement.textContent).toContain('Attribute footer');
    document.body.style.overflow = '';
  });
});
