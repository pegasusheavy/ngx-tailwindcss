import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { ColumnsCount, ColumnsGap, ColumnsRule, TwColumnsComponent } from './columns.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-columns
      [count]="count()"
      [countSm]="countSm()"
      [countMd]="countMd()"
      [countLg]="countLg()"
      [countXl]="countXl()"
      [gap]="gap()"
      [rule]="rule()"
      [ruleColor]="ruleColor()"
      [ruleWidth]="ruleWidth()"
      [avoidBreak]="avoidBreak()"
      [class]="customClass()"
    >
      <p>Column content</p>
    </tw-columns>
  `,
  standalone: true,
  imports: [TwColumnsComponent],
})
class TestHostComponent {
  @ViewChild(TwColumnsComponent) columns!: TwColumnsComponent;
  count = signal<ColumnsCount>(2);
  countSm = signal<ColumnsCount | undefined>(undefined);
  countMd = signal<ColumnsCount | undefined>(undefined);
  countLg = signal<ColumnsCount | undefined>(undefined);
  countXl = signal<ColumnsCount | undefined>(undefined);
  gap = signal<ColumnsGap>('md');
  rule = signal<ColumnsRule>('none');
  ruleColor = signal('slate-200');
  ruleWidth = signal(1);
  avoidBreak = signal(false);
  customClass = signal('');
}

describe('TwColumnsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let hostEl: HTMLElement;

  function getInner(): HTMLElement {
    return hostEl.querySelector('div') as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hostEl = fixture.debugElement.query(By.directive(TwColumnsComponent)).nativeElement;
  });

  it('should create the component', () => {
    expect(hostEl).toBeTruthy();
    expect(hostEl.textContent).toContain('Column content');
  });

  describe('column count', () => {
    it('should apply 2 columns and md gap by default', () => {
      expect(getInner().className).toContain('columns-2');
      expect(getInner().className).toContain('gap-6');
    });

    it('should update classes when count changes', () => {
      component.count.set(4);
      fixture.detectChanges();

      expect(getInner().className).toContain('columns-4');
    });

    it('should support auto columns', () => {
      component.count.set('auto');
      fixture.detectChanges();

      expect(getInner().className).toContain('columns-auto');
    });
  });

  describe('responsive counts', () => {
    it('should emit full static classes for each breakpoint', () => {
      component.count.set(1);
      component.countSm.set(2);
      component.countMd.set(3);
      component.countLg.set(4);
      component.countXl.set(6);
      fixture.detectChanges();

      const { className } = getInner();
      expect(className).toContain('columns-1');
      expect(className).toContain('sm:columns-2');
      expect(className).toContain('md:columns-3');
      expect(className).toContain('lg:columns-4');
      expect(className).toContain('xl:columns-6');
    });

    it('should omit breakpoint classes when not configured', () => {
      expect(getInner().className).not.toContain('md:columns');
    });
  });

  describe('gap', () => {
    it('should update gap classes', () => {
      component.gap.set('xl');
      fixture.detectChanges();

      expect(getInner().className).toContain('gap-12');
    });
  });

  describe('column rule', () => {
    it('should not apply a rule by default', () => {
      expect(getInner().style.columnRule || '').toBe('');
    });

    it('should resolve Tailwind color tokens through CSS variables', () => {
      component.rule.set('solid');
      component.ruleColor.set('slate-300');
      fixture.detectChanges();

      expect(getInner().style.columnRule).toContain('solid');
      expect(getInner().style.columnRule).toContain('var(--color-slate-300)');
    });

    it('should pass through raw CSS colors', () => {
      component.rule.set('dashed');
      component.ruleColor.set('#ff0000');
      fixture.detectChanges();

      expect(getInner().style.columnRule).toContain('dashed');
      expect(getInner().style.columnRule).toContain('#ff0000');
    });

    it('should honor ruleWidth', () => {
      component.rule.set('solid');
      component.ruleWidth.set(3);
      fixture.detectChanges();

      expect(getInner().style.columnRule).toContain('3px');
    });
  });

  describe('avoidBreak', () => {
    it('should apply break-inside-avoid to children when set', () => {
      component.avoidBreak.set(true);
      fixture.detectChanges();

      expect(getInner().className).toContain('[&>*]:break-inside-avoid');
    });
  });

  describe('class customization', () => {
    it('should merge custom classes', () => {
      component.customClass.set('custom-columns-class');
      fixture.detectChanges();

      expect(getInner().className).toContain('custom-columns-class');
    });
  });
});
