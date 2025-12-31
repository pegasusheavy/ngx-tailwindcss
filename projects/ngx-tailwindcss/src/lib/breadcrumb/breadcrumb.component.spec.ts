import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwBreadcrumbComponent, BreadcrumbItem, BreadcrumbSeparator } from './breadcrumb.component';

@Component({
  template: `
    <tw-breadcrumb
      [items]="items()"
      [separator]="separator()"
      [size]="size()"
    ></tw-breadcrumb>
  `,
  standalone: true,
  imports: [TwBreadcrumbComponent],
})
class TestHostComponent {
  @ViewChild(TwBreadcrumbComponent) breadcrumb!: TwBreadcrumbComponent;
  items = signal<BreadcrumbItem[]>([
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' },
  ]);
  separator = signal<BreadcrumbSeparator>('chevron');
  size = signal<'sm' | 'md' | 'lg'>('md');
}

describe('TwBreadcrumbComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let breadcrumbEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    breadcrumbEl = fixture.debugElement.query(By.directive(TwBreadcrumbComponent)).nativeElement;
  });

  it('should create the breadcrumb', () => {
    expect(breadcrumbEl).toBeTruthy();
    expect(component.breadcrumb).toBeTruthy();
  });

  it('should render nav element', () => {
    const nav = breadcrumbEl.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should have aria-label for accessibility', () => {
    const nav = breadcrumbEl.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  describe('items', () => {
    it('should render all items', () => {
      expect(breadcrumbEl.textContent).toContain('Home');
      expect(breadcrumbEl.textContent).toContain('Products');
      expect(breadcrumbEl.textContent).toContain('Current Page');
    });

    it('should render links for items with href', () => {
      const links = breadcrumbEl.querySelectorAll('a');
      expect(links.length).toBe(2);
      expect(links[0].href).toContain('/');
      expect(links[1].href).toContain('/products');
    });

    it('should render span for last item without href', () => {
      const items = breadcrumbEl.querySelectorAll('li');
      const lastItem = items[items.length - 1];
      // The last item contains a span with aria-current="page"
      const span = lastItem.querySelector('span[aria-current="page"]');
      expect(span).toBeTruthy();
      expect(span?.textContent).toContain('Current Page');
    });

    it('should mark last item as current', () => {
      const items = breadcrumbEl.querySelectorAll('li');
      const lastItem = items[items.length - 1];
      // aria-current is on the span inside the li, not the li itself
      const currentSpan = lastItem.querySelector('[aria-current="page"]');
      expect(currentSpan).toBeTruthy();
      expect(currentSpan?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('separators', () => {
    it('should render chevron separator by default', () => {
      const separators = breadcrumbEl.querySelectorAll('li > span:not([aria-current])');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('should render correct number of separators', () => {
      // Should have items.length - 1 separators
      const seps = breadcrumbEl.querySelectorAll('[class*="mx-2"]');
      expect(seps.length).toBe(2);
    });
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const nav = breadcrumbEl.querySelector('nav');
      expect(nav?.className).toContain('text-xs');
    });

    it('should apply md size by default', () => {
      const nav = breadcrumbEl.querySelector('nav');
      expect(nav?.className).toContain('text-sm');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const nav = breadcrumbEl.querySelector('nav');
      expect(nav?.className).toContain('text-base');
    });
  });

  describe('empty items', () => {
    it('should handle empty items array', () => {
      component.items.set([]);
      fixture.detectChanges();
      const items = breadcrumbEl.querySelectorAll('li');
      expect(items.length).toBe(0);
    });
  });

  describe('single item', () => {
    it('should handle single item', () => {
      component.items.set([{ label: 'Home' }]);
      fixture.detectChanges();
      const items = breadcrumbEl.querySelectorAll('li');
      expect(items.length).toBe(1);
      // No separators for single item
      const seps = breadcrumbEl.querySelectorAll('[class*="mx-2"]');
      expect(seps.length).toBe(0);
    });
  });

  describe('link styling', () => {
    it('should apply link classes to clickable items', () => {
      const links = breadcrumbEl.querySelectorAll('a');
      expect(links[0].className).toContain('text-slate-500');
    });

    it('should apply current classes to last item', () => {
      const items = breadcrumbEl.querySelectorAll('li');
      const lastItem = items[items.length - 1];
      const current = lastItem.querySelector('span[aria-current="page"]');
      expect(current?.className).toContain('font-medium');
    });
  });
});
