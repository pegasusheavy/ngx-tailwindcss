import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadgeSize,
  BadgeStyle,
  BadgeVariant,
  TwBadgeComponent,
  TwBadgeGroupComponent,
} from './badge.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-badge
      [variant]="variant()"
      [badgeStyle]="badgeStyle()"
      [size]="size()"
      [pill]="pill()"
      [removable]="removable()"
      (remove)="onRemove()"
      [classOverride]="classOverride()"
      data-testid="test-badge"
    >
      {{ badgeText() }}
    </tw-badge>
  `,
  standalone: true,
  imports: [TwBadgeComponent],
})
class TestHostComponent {
  @ViewChild(TwBadgeComponent) badge!: TwBadgeComponent;
  variant = signal<BadgeVariant>('neutral');
  badgeStyle = signal<BadgeStyle>('solid');
  size = signal<BadgeSize>('md');
  pill = signal(false);
  removable = signal(false);
  classOverride = signal('');
  badgeText = signal('Badge');
  removeCount = 0;

  onRemove(): void {
    this.removeCount++;
  }
}

describe('TwBadgeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let badgeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    badgeEl = fixture.debugElement.query(By.directive(TwBadgeComponent)).nativeElement;
  });

  it('should create the badge', () => {
    expect(badgeEl).toBeTruthy();
    expect(component.badge).toBeTruthy();
  });

  it('should render badge text', () => {
    expect(badgeEl.textContent).toContain('Badge');
  });

  describe('variants', () => {
    it('should have default neutral variant', () => {
      expect(component.variant()).toBe('neutral');
    });

    it('should apply default neutral variant classes', () => {
      const classes = badgeEl.className;
      expect(classes).toContain('bg-slate-200');
    });
  });

  describe('styles', () => {
    it('should have default solid style', () => {
      expect(component.badgeStyle()).toBe('solid');
    });
  });

  describe('sizes', () => {
    it('should have default md size', () => {
      expect(component.size()).toBe('md');
    });

    it('should apply md size classes', () => {
      const classes = badgeEl.className;
      expect(classes).toContain('text-xs');
    });
  });

  describe('pill shape', () => {
    it('should have pill false by default', () => {
      expect(component.pill()).toBe(false);
    });

    it('should apply rounded-md by default', () => {
      expect(badgeEl.className).toContain('rounded-md');
    });
  });

  describe('removable', () => {
    it('should have removable false by default', () => {
      expect(component.removable()).toBe(false);
    });

    it('should not show remove button by default', () => {
      const removeBtn = badgeEl.querySelector('button');
      expect(removeBtn).toBeNull();
    });

    it('should show remove button when removable', () => {
      component.removable.set(true);
      fixture.detectChanges();

      const removeBtn = badgeEl.querySelector('button');
      expect(removeBtn).toBeTruthy();
    });

    it('should call remove callback when clicked', () => {
      component.removable.set(true);
      fixture.detectChanges();

      const removeBtn = badgeEl.querySelector('button')!;
      removeBtn.click();
      fixture.detectChanges();

      expect(component.removeCount).toBe(1);
    });

    it('should stop event propagation on remove click', () => {
      component.removable.set(true);
      fixture.detectChanges();

      const removeBtn = badgeEl.querySelector('button')!;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      removeBtn.dispatchEvent(clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('class customization', () => {
    it('should have empty classOverride by default', () => {
      expect(component.classOverride()).toBe('');
    });
  });
});

@Component({
  template: `
    <tw-badge-group
      [gap]="gap()"
      [direction]="direction()"
      [wrap]="wrap()"
      [classOverride]="classOverride()"
      data-testid="badge-group"
    >
      <tw-badge>Badge 1</tw-badge>
      <tw-badge>Badge 2</tw-badge>
      <tw-badge>Badge 3</tw-badge>
    </tw-badge-group>
  `,
  standalone: true,
  imports: [TwBadgeGroupComponent, TwBadgeComponent],
})
class BadgeGroupHostComponent {
  gap = signal<'sm' | 'md' | 'lg'>('sm');
  direction = signal<'row' | 'column'>('row');
  wrap = signal(true);
  classOverride = signal('');
}

describe('TwBadgeGroupComponent', () => {
  let fixture: ComponentFixture<BadgeGroupHostComponent>;
  let component: BadgeGroupHostComponent;
  let groupEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeGroupHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeGroupHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    groupEl = fixture.debugElement.query(By.css('[data-testid="badge-group"] > div')).nativeElement;
  });

  it('should create the badge group', () => {
    expect(groupEl).toBeTruthy();
  });

  it('should have inline-flex class', () => {
    expect(groupEl.className).toContain('inline-flex');
  });

  describe('gap', () => {
    it('should have default sm gap', () => {
      expect(component.gap()).toBe('sm');
    });

    it('should apply small gap', () => {
      expect(groupEl.className).toContain('gap-2');
    });
  });

  describe('direction', () => {
    it('should have default row direction', () => {
      expect(component.direction()).toBe('row');
    });

    it('should apply inline-flex', () => {
      expect(groupEl.className).toContain('inline-flex');
    });
  });

  describe('wrap', () => {
    it('should have wrap true by default', () => {
      expect(component.wrap()).toBe(true);
    });

    it('should apply flex-wrap', () => {
      expect(groupEl.className).toContain('flex-wrap');
    });
  });
});
