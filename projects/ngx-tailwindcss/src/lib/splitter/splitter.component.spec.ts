import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SplitterDirection,
  TwSplitterComponent,
  TwSplitterPaneComponent,
} from './splitter.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-splitter
      [direction]="direction()"
      [initialSizes]="initialSizes()"
      [disabled]="disabled()"
      (sizesChange)="onSizesChangeSpy($event)"
      data-testid="test-splitter"
    >
      <div twSplitterPaneStart data-testid="pane-start">Left Panel</div>
      <div twSplitterPaneEnd data-testid="pane-end">Right Panel</div>
    </tw-splitter>
  `,
  standalone: true,
  imports: [TwSplitterComponent, TwSplitterPaneComponent],
})
class TestHostComponent {
  @ViewChild(TwSplitterComponent) splitter!: TwSplitterComponent;
  direction = signal<SplitterDirection>('horizontal');
  initialSizes = signal<[number, number]>([30, 70]);
  disabled = signal(false);

  onSizesChangeSpy = vi.fn();
}

describe('TwSplitterComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let splitterEl: DebugElement;

  const gutter = () => splitterEl.query(By.css('[role="separator"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Flush the initialSizes applied in ngAfterViewInit
    fixture.detectChanges();
    splitterEl = fixture.debugElement.query(By.directive(TwSplitterComponent));
  });

  it('should create the splitter', () => {
    expect(splitterEl).toBeTruthy();
    expect(component.splitter).toBeTruthy();
  });

  describe('pane projection', () => {
    it('should project both panes into their slots', () => {
      const start = splitterEl.query(By.css('[data-testid="pane-start"]'));
      const end = splitterEl.query(By.css('[data-testid="pane-end"]'));
      expect(start.nativeElement.textContent).toContain('Left Panel');
      expect(end.nativeElement.textContent).toContain('Right Panel');
    });

    it('should project the start pane before and the end pane after the gutter', () => {
      const container = splitterEl.query(By.css('div')).nativeElement as HTMLElement;
      const [firstPane, , secondPane] = [...container.children] as HTMLElement[];
      expect(firstPane.textContent).toContain('Left Panel');
      expect(secondPane.textContent).toContain('Right Panel');
    });

    it('should apply initial sizes to the panes', () => {
      const container = splitterEl.query(By.css('div')).nativeElement as HTMLElement;
      const [firstPane, , secondPane] = [...container.children] as HTMLElement[];
      expect(firstPane.style.flexBasis).toBe('30%');
      expect(secondPane.style.flexBasis).toBe('70%');
    });
  });

  describe('setSizes and reset', () => {
    it('should set sizes programmatically and emit', () => {
      component.splitter.setSizes([40, 60]);
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).toHaveBeenCalledWith([40, 60]);

      const container = splitterEl.query(By.css('div')).nativeElement as HTMLElement;
      expect((container.children[0] as HTMLElement).style.flexBasis).toBe('40%');
    });

    it('should reset to initial sizes', () => {
      component.splitter.setSizes([10, 90]);
      component.splitter.reset();
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).toHaveBeenLastCalledWith([30, 70]);
    });
  });

  describe('gutter accessibility and keyboard resize', () => {
    it('should expose separator semantics', () => {
      const el = gutter().nativeElement as HTMLElement;
      expect(el.getAttribute('tabindex')).toBe('0');
      expect(el.getAttribute('aria-orientation')).toBe('vertical');
      expect(el.getAttribute('aria-valuenow')).toBe('30');
      expect(el.getAttribute('aria-valuemin')).toBe('0');
      expect(el.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should grow the first pane on ArrowRight', () => {
      gutter().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).toHaveBeenCalledWith([32, 68]);
      expect((gutter().nativeElement as HTMLElement).getAttribute('aria-valuenow')).toBe('32');
    });

    it('should shrink the first pane on ArrowLeft', () => {
      gutter().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      );
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).toHaveBeenCalledWith([28, 72]);
    });

    it('should use ArrowUp/ArrowDown in vertical direction', () => {
      component.direction.set('vertical');
      fixture.detectChanges();

      gutter().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).toHaveBeenCalledWith([32, 68]);
      expect((gutter().nativeElement as HTMLElement).getAttribute('aria-orientation')).toBe(
        'horizontal'
      );
    });

    it('should not resize when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      gutter().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
      fixture.detectChanges();
      expect(component.onSizesChangeSpy).not.toHaveBeenCalled();
      expect((gutter().nativeElement as HTMLElement).getAttribute('tabindex')).toBe('-1');
    });
  });
});
