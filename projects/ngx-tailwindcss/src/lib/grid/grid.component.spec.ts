import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwGridComponent, TwSimpleGridComponent, GridCols, GridGap } from './grid.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-grid
      [cols]="cols()"
      [colsSm]="colsSm()"
      [colsMd]="colsMd()"
      [colsLg]="colsLg()"
      [colsXl]="colsXl()"
      [gap]="gap()"
      [rowGap]="rowGap()"
      [colGap]="colGap()"
      [class]="customClass()"
    >
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </tw-grid>
  `,
  standalone: true,
  imports: [TwGridComponent],
})
class GridTestComponent {
  @ViewChild(TwGridComponent) grid!: TwGridComponent;
  cols = signal<GridCols>(1);
  colsSm = signal<GridCols | undefined>(undefined);
  colsMd = signal<GridCols | undefined>(undefined);
  colsLg = signal<GridCols | undefined>(undefined);
  colsXl = signal<GridCols | undefined>(undefined);
  gap = signal<GridGap>('md');
  rowGap = signal<GridGap | undefined>(undefined);
  colGap = signal<GridGap | undefined>(undefined);
  customClass = signal('');
}

@Component({
  template: `
    <tw-simple-grid [minChildWidth]="minChildWidth()" [gap]="gap()" [class]="customClass()">
      <div>Card 1</div>
      <div>Card 2</div>
      <div>Card 3</div>
    </tw-simple-grid>
  `,
  standalone: true,
  imports: [TwSimpleGridComponent],
})
class SimpleGridTestComponent {
  @ViewChild(TwSimpleGridComponent) grid!: TwSimpleGridComponent;
  minChildWidth = signal('200px');
  gap = signal<GridGap>('md');
  customClass = signal('');
}

describe('TwGridComponent', () => {
  let fixture: ComponentFixture<GridTestComponent>;
  let component: GridTestComponent;
  let gridEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(GridTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    gridEl = fixture.debugElement.query(By.directive(TwGridComponent)).nativeElement;
  });

  it('should create the grid', () => {
    expect(gridEl).toBeTruthy();
    expect(component.grid).toBeTruthy();
  });

  it('should render content', () => {
    expect(gridEl.textContent).toContain('Item 1');
    expect(gridEl.textContent).toContain('Item 2');
    expect(gridEl.textContent).toContain('Item 3');
  });

  it('should have grid class', () => {
    const inner = gridEl.querySelector('div');
    expect(inner?.className).toContain('grid');
  });

  describe('columns', () => {
    it('should apply 1 column by default', () => {
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-1');
    });

    it('should apply 2 columns', () => {
      component.cols.set(2);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-2');
    });

    it('should apply 3 columns', () => {
      component.cols.set(3);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-3');
    });

    it('should apply 4 columns', () => {
      component.cols.set(4);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-4');
    });

    it('should apply 12 columns', () => {
      component.cols.set(12);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-12');
    });

    it('should apply none columns', () => {
      component.cols.set('none');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('grid-cols-none');
    });
  });

  describe('responsive columns', () => {
    it('should apply sm breakpoint columns', () => {
      component.colsSm.set(2);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('sm:grid-cols-2');
    });

    it('should apply md breakpoint columns', () => {
      component.colsMd.set(3);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('md:grid-cols-3');
    });

    it('should apply lg breakpoint columns', () => {
      component.colsLg.set(4);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('lg:grid-cols-4');
    });

    it('should apply xl breakpoint columns', () => {
      component.colsXl.set(6);
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('xl:grid-cols-6');
    });
  });

  describe('gap', () => {
    it('should apply md gap by default', () => {
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-4');
    });

    it('should apply none gap', () => {
      component.gap.set('none');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-0');
    });

    it('should apply xs gap', () => {
      component.gap.set('xs');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-1');
    });

    it('should apply sm gap', () => {
      component.gap.set('sm');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-2');
    });

    it('should apply lg gap', () => {
      component.gap.set('lg');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-6');
    });

    it('should apply xl gap', () => {
      component.gap.set('xl');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-8');
    });

    it('should apply 2xl gap', () => {
      component.gap.set('2xl');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-12');
    });
  });

  describe('separate row and column gaps', () => {
    it('should apply separate row and column gaps', () => {
      component.rowGap.set('sm');
      component.colGap.set('lg');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      // Check that at least one of the axis-specific gap classes is applied
      const hasAxisGaps =
        inner?.className.includes('gap-y-') || inner?.className.includes('gap-x-');
      expect(hasAxisGaps).toBe(true);
    });
  });

  describe('custom class', () => {
    it('should apply custom class', () => {
      component.customClass.set('custom-grid');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('custom-grid');
    });
  });
});

describe('TwSimpleGridComponent', () => {
  let fixture: ComponentFixture<SimpleGridTestComponent>;
  let component: SimpleGridTestComponent;
  let gridEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleGridTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleGridTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    gridEl = fixture.debugElement.query(By.directive(TwSimpleGridComponent)).nativeElement;
  });

  it('should create the simple grid', () => {
    expect(gridEl).toBeTruthy();
    expect(component.grid).toBeTruthy();
  });

  it('should render content', () => {
    expect(gridEl.textContent).toContain('Card 1');
    expect(gridEl.textContent).toContain('Card 2');
    expect(gridEl.textContent).toContain('Card 3');
  });

  it('should have grid class', () => {
    const inner = gridEl.querySelector('div');
    expect(inner?.className).toContain('grid');
  });

  describe('minChildWidth', () => {
    it('should set grid-template-columns with default minChildWidth', () => {
      const inner = gridEl.querySelector('div') as HTMLElement;
      expect(inner?.style.gridTemplateColumns).toContain('200px');
    });

    it('should set grid-template-columns with custom minChildWidth', () => {
      component.minChildWidth.set('300px');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div') as HTMLElement;
      expect(inner?.style.gridTemplateColumns).toContain('300px');
    });

    it('should accept rem units', () => {
      component.minChildWidth.set('15rem');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div') as HTMLElement;
      expect(inner?.style.gridTemplateColumns).toContain('15rem');
    });
  });

  describe('gap', () => {
    it('should apply md gap by default', () => {
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-4');
    });

    it('should apply lg gap', () => {
      component.gap.set('lg');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('gap-6');
    });
  });

  describe('custom class', () => {
    it('should apply custom class', () => {
      component.customClass.set('custom-simple-grid');
      fixture.detectChanges();
      const inner = gridEl.querySelector('div');
      expect(inner?.className).toContain('custom-simple-grid');
    });
  });
});
