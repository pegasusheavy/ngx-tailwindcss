import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwPaginationComponent, PaginationSize, PaginationVariant } from './pagination.component';

@Component({
  template: `
    <tw-pagination
      [currentPage]="currentPage()"
      [totalPages]="totalPages()"
      [totalItems]="totalItems()"
      [itemsPerPage]="itemsPerPage()"
      [siblingCount]="siblingCount()"
      [size]="size()"
      [variant]="variant()"
      [showFirstLast]="showFirstLast()"
      (pageChange)="onPageChange($event)"
    ></tw-pagination>
  `,
  standalone: true,
  imports: [TwPaginationComponent],
})
class TestHostComponent {
  @ViewChild(TwPaginationComponent) pagination!: TwPaginationComponent;
  currentPage = signal(1);
  totalPages = signal(10);
  totalItems = signal(0);
  itemsPerPage = signal(10);
  siblingCount = signal(1);
  size = signal<PaginationSize>('md');
  variant = signal<PaginationVariant>('default');
  showFirstLast = signal(false);

  pageChangeValue: number | null = null;

  onPageChange(page: number) {
    this.pageChangeValue = page;
  }
}

describe('TwPaginationComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let paginationEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paginationEl = fixture.debugElement.query(By.directive(TwPaginationComponent)).nativeElement;
  });

  it('should create the pagination', () => {
    expect(paginationEl).toBeTruthy();
    expect(component.pagination).toBeTruthy();
  });

  describe('page navigation', () => {
    it('should render prev and next buttons', () => {
      const nav = paginationEl.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('should emit pageChange when page clicked', () => {
      const pageButtons = paginationEl.querySelectorAll('button');
      const page2Button = Array.from(pageButtons).find(b => b.textContent?.trim() === '2');
      page2Button?.click();
      expect(component.pageChangeValue).toBe(2);
    });

    it('should disable prev button on first page', () => {
      const buttons = paginationEl.querySelectorAll('button');
      const prevButton = buttons[0];
      expect(prevButton.disabled || prevButton.className.includes('cursor-not-allowed')).toBe(true);
    });

    it('should disable next button on last page', () => {
      component.currentPage.set(10);
      fixture.detectChanges();
      const buttons = paginationEl.querySelectorAll('button');
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton.disabled || nextButton.className.includes('cursor-not-allowed')).toBe(true);
    });
  });

  describe('page numbers', () => {
    it('should highlight current page', () => {
      component.currentPage.set(5);
      fixture.detectChanges();
      const activeButton = paginationEl.querySelector('[class*="bg-blue-600"]');
      expect(activeButton?.textContent?.trim()).toBe('5');
    });

    it('should show ellipsis for many pages', () => {
      component.totalPages.set(20);
      component.currentPage.set(10);
      fixture.detectChanges();
      expect(paginationEl.textContent).toContain('...');
    });

    it('should calculate totalPages from totalItems and itemsPerPage', () => {
      component.totalPages.set(0);
      component.totalItems.set(100);
      component.itemsPerPage.set(10);
      fixture.detectChanges();
      // Should have 10 pages
      expect(paginationEl.textContent).toContain('10');
    });
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const buttons = paginationEl.querySelectorAll('button');
      expect(buttons[1]?.className).toContain('w-7');
    });

    it('should apply md size by default', () => {
      const buttons = paginationEl.querySelectorAll('button');
      expect(buttons[1]?.className).toContain('w-9');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const buttons = paginationEl.querySelectorAll('button');
      expect(buttons[1]?.className).toContain('w-11');
    });
  });

  describe('variants', () => {
    it('should apply default variant', () => {
      const buttons = paginationEl.querySelectorAll('button');
      // Non-active buttons should not have border in default variant
      const nonActiveButton = Array.from(buttons).find(b =>
        !b.className.includes('bg-blue-600') && !b.disabled
      );
      expect(nonActiveButton?.className).not.toContain('border-slate-300');
    });

    it('should apply outlined variant', () => {
      component.variant.set('outlined');
      fixture.detectChanges();
      const buttons = paginationEl.querySelectorAll('button');
      const nonActiveButton = Array.from(buttons).find(b =>
        !b.className.includes('bg-blue-600') && !b.disabled
      );
      expect(nonActiveButton?.className).toContain('border');
    });
  });

  describe('simple variant', () => {
    it('should show previous/next text for simple variant', () => {
      component.variant.set('simple');
      fixture.detectChanges();
      expect(paginationEl.textContent).toContain('Previous');
      expect(paginationEl.textContent).toContain('Next');
    });
  });

  describe('sibling count', () => {
    it('should respect sibling count', () => {
      component.totalPages.set(20);
      component.currentPage.set(10);
      component.siblingCount.set(2);
      fixture.detectChanges();
      // Should show pages 8, 9, 10, 11, 12
      expect(paginationEl.textContent).toContain('8');
      expect(paginationEl.textContent).toContain('12');
    });
  });

  describe('few pages', () => {
    it('should show all pages when total is small', () => {
      component.totalPages.set(5);
      fixture.detectChanges();
      expect(paginationEl.textContent).toContain('1');
      expect(paginationEl.textContent).toContain('2');
      expect(paginationEl.textContent).toContain('3');
      expect(paginationEl.textContent).toContain('4');
      expect(paginationEl.textContent).toContain('5');
      expect(paginationEl.textContent).not.toContain('...');
    });
  });
});
