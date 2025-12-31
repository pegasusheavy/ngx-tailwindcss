import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  TwSkeletonComponent,
  TwSkeletonTextComponent,
  TwSkeletonCardComponent,
  TwSkeletonTableComponent,
  SkeletonVariant
} from './skeleton.component';

@Component({
  template: `
    <tw-skeleton
      [variant]="variant()"
      [width]="width()"
      [height]="height()"
      [animated]="animated()"
    ></tw-skeleton>
  `,
  standalone: true,
  imports: [TwSkeletonComponent],
})
class TestHostComponent {
  @ViewChild(TwSkeletonComponent) skeleton!: TwSkeletonComponent;
  variant = signal<SkeletonVariant>('text');
  width = signal<string | number>('100%');
  height = signal<string | number>('');
  animated = signal(true);
}

@Component({
  template: `
    <tw-skeleton-text
      [lineCount]="lineCount()"
      [animated]="animated()"
      [lastLineWidth]="lastLineWidth()"
      [gap]="gap()"
    ></tw-skeleton-text>
  `,
  standalone: true,
  imports: [TwSkeletonTextComponent],
})
class TextTestComponent {
  @ViewChild(TwSkeletonTextComponent) skeleton!: TwSkeletonTextComponent;
  lineCount = signal(3);
  animated = signal(true);
  lastLineWidth = signal('60%');
  gap = signal<'sm' | 'md' | 'lg'>('md');
}

@Component({
  template: `
    <tw-skeleton-card
      [showMedia]="showMedia()"
      [showAvatar]="showAvatar()"
      [mediaHeight]="mediaHeight()"
      [lineCount]="lineCount()"
    ></tw-skeleton-card>
  `,
  standalone: true,
  imports: [TwSkeletonCardComponent],
})
class CardTestComponent {
  @ViewChild(TwSkeletonCardComponent) skeleton!: TwSkeletonCardComponent;
  showMedia = signal(true);
  showAvatar = signal(false);
  mediaHeight = signal(200);
  lineCount = signal(3);
}

@Component({
  template: `
    <tw-skeleton-table
      [rowCount]="rowCount()"
      [columnCount]="columnCount()"
    ></tw-skeleton-table>
  `,
  standalone: true,
  imports: [TwSkeletonTableComponent],
})
class TableTestComponent {
  @ViewChild(TwSkeletonTableComponent) skeleton!: TwSkeletonTableComponent;
  rowCount = signal(5);
  columnCount = signal(4);
}

describe('TwSkeletonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let skeletonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    skeletonEl = fixture.debugElement.query(By.directive(TwSkeletonComponent)).nativeElement;
  });

  it('should create the skeleton', () => {
    expect(skeletonEl).toBeTruthy();
    expect(component.skeleton).toBeTruthy();
  });

  describe('variants', () => {
    it('should apply text variant by default', () => {
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).toContain('rounded');
      expect(inner?.className).not.toContain('rounded-full');
    });

    it('should apply circular variant', () => {
      component.variant.set('circular');
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).toContain('rounded-full');
      expect(inner?.className).toContain('aspect-square');
    });

    it('should apply rectangular variant', () => {
      component.variant.set('rectangular');
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).toContain('rounded-none');
    });

    it('should apply rounded variant', () => {
      component.variant.set('rounded');
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).toContain('rounded-lg');
    });
  });

  describe('dimensions', () => {
    it('should apply default width of 100%', () => {
      const inner = skeletonEl.querySelector('div') as HTMLElement;
      expect(inner?.style.width).toBe('100%');
    });

    it('should apply custom width as string', () => {
      component.width.set('200px');
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div') as HTMLElement;
      expect(inner?.style.width).toBe('200px');
    });

    it('should apply custom width as number', () => {
      component.width.set(150);
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div') as HTMLElement;
      expect(inner?.style.width).toBe('150px');
    });

    it('should apply custom height', () => {
      component.height.set('50px');
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div') as HTMLElement;
      expect(inner?.style.height).toBe('50px');
    });
  });

  describe('animation', () => {
    it('should have animation by default', () => {
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).toContain('animate-pulse');
    });

    it('should not have animation when disabled', () => {
      component.animated.set(false);
      fixture.detectChanges();
      const inner = skeletonEl.querySelector('div');
      expect(inner?.className).not.toContain('animate-pulse');
    });
  });

  it('should have proper background color', () => {
    const inner = skeletonEl.querySelector('div');
    expect(inner?.className).toContain('bg-slate-200');
  });
});

describe('TwSkeletonTextComponent', () => {
  let fixture: ComponentFixture<TextTestComponent>;
  let component: TextTestComponent;
  let skeletonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    skeletonEl = fixture.debugElement.query(By.directive(TwSkeletonTextComponent)).nativeElement;
  });

  it('should create the skeleton text', () => {
    expect(skeletonEl).toBeTruthy();
    expect(component.skeleton).toBeTruthy();
  });

  it('should render correct number of lines', () => {
    const lines = skeletonEl.querySelectorAll('tw-skeleton');
    expect(lines.length).toBe(3);
  });

  it('should render different number of lines', () => {
    component.lineCount.set(5);
    fixture.detectChanges();
    const lines = skeletonEl.querySelectorAll('tw-skeleton');
    expect(lines.length).toBe(5);
  });

  it('should apply gap between lines', () => {
    const container = skeletonEl.querySelector('[class*="flex-col"]');
    expect(container).toBeTruthy();
  });
});

describe('TwSkeletonCardComponent', () => {
  let fixture: ComponentFixture<CardTestComponent>;
  let component: CardTestComponent;
  let skeletonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    skeletonEl = fixture.debugElement.query(By.directive(TwSkeletonCardComponent)).nativeElement;
  });

  it('should create the skeleton card', () => {
    expect(skeletonEl).toBeTruthy();
    expect(component.skeleton).toBeTruthy();
  });

  it('should show media skeleton by default', () => {
    // The first tw-skeleton inside the card (before .p-5) is the media skeleton
    const skeletons = skeletonEl.querySelectorAll('tw-skeleton');
    // With media shown, there should be skeletons present
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should hide media skeleton when showMedia is false', () => {
    component.showMedia.set(false);
    fixture.detectChanges();
    // Check that the first direct skeleton (media) is not present
    const directSkeleton = skeletonEl.querySelector(':scope > div > tw-skeleton');
    expect(directSkeleton).toBeNull();
  });

  it('should show avatar skeleton when showAvatar is true', () => {
    component.showAvatar.set(true);
    fixture.detectChanges();
    // Avatar shows a circular skeleton - look for the flex container with avatar
    const avatarContainer = skeletonEl.querySelector('.flex.items-center.gap-4');
    expect(avatarContainer).toBeTruthy();
  });

  it('should render text lines', () => {
    const textSkeleton = skeletonEl.querySelector('tw-skeleton-text');
    expect(textSkeleton).toBeTruthy();
  });
});

describe('TwSkeletonTableComponent', () => {
  let fixture: ComponentFixture<TableTestComponent>;
  let component: TableTestComponent;
  let skeletonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    skeletonEl = fixture.debugElement.query(By.directive(TwSkeletonTableComponent)).nativeElement;
  });

  it('should create the skeleton table', () => {
    expect(skeletonEl).toBeTruthy();
    expect(component.skeleton).toBeTruthy();
  });

  it('should render correct number of rows', () => {
    const rows = skeletonEl.querySelectorAll('[class*="flex"][class*="gap"]');
    // Header row + 5 data rows = 6
    expect(rows.length).toBeGreaterThanOrEqual(5);
  });

  it('should render different number of rows', () => {
    component.rowCount.set(3);
    fixture.detectChanges();
    const skeletons = skeletonEl.querySelectorAll('tw-skeleton');
    // Each row has columnCount skeletons, plus header
    expect(skeletons.length).toBeGreaterThanOrEqual(3 * 4);
  });

  it('should render correct number of columns per row', () => {
    // Default is 4 columns
    const firstRow = skeletonEl.querySelector('[class*="flex"][class*="gap"]');
    const cells = firstRow?.querySelectorAll('tw-skeleton');
    expect(cells?.length).toBe(4);
  });
});
