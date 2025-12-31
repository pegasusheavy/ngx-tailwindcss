import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TwPopoverComponent, PopoverPosition, PopoverTrigger } from './popover.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-popover
      [position]="position()"
      [trigger]="trigger()"
      [header]="header()"
      [showArrow]="showArrow()"
      [dismissible]="dismissible()"
      [closeOnEscape]="closeOnEscape()"
      [hoverDelay]="hoverDelay()"
      [classOverride]="classOverride()"
      (onShow)="onShow()"
      (onHide)="onHide()"
    >
      <button twPopoverTrigger>Click me</button>
      <div class="popover-content">Popover content here</div>
    </tw-popover>
  `,
  standalone: true,
  imports: [TwPopoverComponent],
})
class TestHostComponent {
  @ViewChild(TwPopoverComponent) popover!: TwPopoverComponent;
  position = signal<PopoverPosition>('bottom');
  trigger = signal<PopoverTrigger>('click');
  header = signal('');
  showArrow = signal(true);
  dismissible = signal(true);
  closeOnEscape = signal(true);
  hoverDelay = signal(200);
  classOverride = signal('');

  showCount = 0;
  hideCount = 0;

  onShow() {
    this.showCount++;
  }
  onHide() {
    this.hideCount++;
  }
}

describe('TwPopoverComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let popoverEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    popoverEl = fixture.debugElement.query(By.directive(TwPopoverComponent)).nativeElement;
  });

  afterEach(() => {
    // Clean up any portals
    document.querySelectorAll('[style*="position: fixed"]').forEach(el => el.remove());
  });

  it('should create the popover', () => {
    expect(popoverEl).toBeTruthy();
    expect(component.popover).toBeTruthy();
  });

  it('should render trigger element', () => {
    const trigger = popoverEl.querySelector('button');
    expect(trigger).toBeTruthy();
    expect(trigger?.textContent).toContain('Click me');
  });

  describe('click trigger', () => {
    it('should show popover on trigger click', () => {
      const triggerContainer = popoverEl.querySelector('div') as HTMLElement;
      triggerContainer.click();
      fixture.detectChanges();

      expect(component.popover['visible']()).toBe(true);
      expect(component.showCount).toBe(1);
    });

    it('should hide popover on second click', () => {
      const triggerContainer = popoverEl.querySelector('div') as HTMLElement;
      triggerContainer.click();
      fixture.detectChanges();
      triggerContainer.click();
      fixture.detectChanges();

      expect(component.popover['visible']()).toBe(false);
      expect(component.hideCount).toBe(1);
    });
  });

  describe('programmatic control', () => {
    it('should show popover via show()', () => {
      component.popover.show();
      fixture.detectChanges();
      expect(component.popover['visible']()).toBe(true);
    });

    it('should hide popover via hide()', () => {
      component.popover.show();
      fixture.detectChanges();
      component.popover.hide();
      fixture.detectChanges();
      expect(component.popover['visible']()).toBe(false);
    });

    it('should toggle popover via toggle()', () => {
      component.popover.toggle();
      expect(component.popover['visible']()).toBe(true);
      component.popover.toggle();
      expect(component.popover['visible']()).toBe(false);
    });
  });

  describe('events', () => {
    it('should emit onShow when opened', () => {
      component.popover.show();
      expect(component.showCount).toBe(1);
    });

    it('should emit onHide when closed', () => {
      component.popover.show();
      component.popover.hide();
      expect(component.hideCount).toBe(1);
    });
  });

  describe('escape key', () => {
    it('should close on escape key when closeOnEscape is true', () => {
      component.popover.show();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.popover['visible']()).toBe(false);
    });
  });

  describe('hover trigger', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      component.trigger.set('hover');
      component.hoverDelay.set(0);
      fixture.detectChanges();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show on mouseenter', () => {
      const triggerContainer = popoverEl.querySelector('div') as HTMLElement;
      triggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(component.popover['visible']()).toBe(true);
    });

    it('should hide on mouseleave', () => {
      const triggerContainer = popoverEl.querySelector('div') as HTMLElement;
      triggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      triggerContainer.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(component.popover['visible']()).toBe(false);
    });
  });

  describe('position', () => {
    it('should accept bottom position', () => {
      expect(component.popover['position']).toBe('bottom');
    });

    it('should accept top position', () => {
      component.position.set('top');
      fixture.detectChanges();
      expect(component.popover['position']).toBe('top');
    });

    it('should accept left position', () => {
      component.position.set('left');
      fixture.detectChanges();
      expect(component.popover['position']).toBe('left');
    });

    it('should accept right position', () => {
      component.position.set('right');
      fixture.detectChanges();
      expect(component.popover['position']).toBe('right');
    });
  });

  describe('header', () => {
    it('should not show header by default', () => {
      component.popover.show();
      fixture.detectChanges();

      const portal = document.querySelector('[role="tooltip"]');
      expect(portal?.textContent).not.toContain('Settings');
    });

    it('should show header when provided', () => {
      component.header.set('Settings');
      fixture.detectChanges();
      component.popover.show();
      fixture.detectChanges();

      const portal = document.querySelector('[role="tooltip"]');
      expect(portal?.textContent).toContain('Settings');
    });
  });

  describe('class customization', () => {
    it('should apply classOverride', () => {
      component.classOverride.set('custom-popover-class');
      fixture.detectChanges();
      component.popover.show();
      fixture.detectChanges();

      const portal = document.querySelector('[role="tooltip"]');
      expect(portal?.className).toContain('custom-popover-class');
    });
  });

  describe('cleanup', () => {
    it('should remove portal on destroy', () => {
      component.popover.show();
      fixture.detectChanges();

      const portalsBefore = document.querySelectorAll('[role="tooltip"]').length;
      expect(portalsBefore).toBe(1);

      fixture.destroy();

      const portalsAfter = document.querySelectorAll('[role="tooltip"]').length;
      expect(portalsAfter).toBe(0);
    });
  });
});
