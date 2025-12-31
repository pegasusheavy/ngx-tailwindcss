import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  TwAvatarComponent,
  TwAvatarGroupComponent,
  AvatarSize,
  AvatarVariant,
  AvatarStatus,
} from './avatar.component';

@Component({
  template: `
    <tw-avatar
      [src]="src()"
      [alt]="alt()"
      [initials]="initials()"
      [size]="size()"
      [variant]="variant()"
      [status]="status()"
      [badge]="badge()"
      [color]="color()"
    ></tw-avatar>
  `,
  standalone: true,
  imports: [TwAvatarComponent],
})
class TestHostComponent {
  @ViewChild(TwAvatarComponent) avatar!: TwAvatarComponent;
  src = signal('https://example.com/avatar.jpg');
  alt = signal('User Avatar');
  initials = signal('');
  size = signal<AvatarSize>('md');
  variant = signal<AvatarVariant>('circle');
  status = signal<AvatarStatus>('none');
  badge = signal<string | number>('');
  color = signal('');
}

@Component({
  template: `
    <tw-avatar-group [max]="max()" [total]="total()" [size]="size()" [spacing]="spacing()">
      <tw-avatar initials="JD"></tw-avatar>
      <tw-avatar initials="AB"></tw-avatar>
      <tw-avatar initials="XY"></tw-avatar>
    </tw-avatar-group>
  `,
  standalone: true,
  imports: [TwAvatarGroupComponent, TwAvatarComponent],
})
class GroupTestComponent {
  @ViewChild(TwAvatarGroupComponent) group!: TwAvatarGroupComponent;
  max = signal(0);
  total = signal(0);
  size = signal<AvatarSize>('md');
  spacing = signal<'tight' | 'normal' | 'loose'>('normal');
}

describe('TwAvatarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let avatarEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    avatarEl = fixture.debugElement.query(By.directive(TwAvatarComponent)).nativeElement;
  });

  it('should create the avatar', () => {
    expect(avatarEl).toBeTruthy();
    expect(component.avatar).toBeTruthy();
  });

  describe('image rendering', () => {
    it('should render image when src is provided', () => {
      const img = avatarEl.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.src).toContain('example.com/avatar.jpg');
    });

    it('should have alt attribute', () => {
      const img = avatarEl.querySelector('img');
      expect(img?.alt).toBe('User Avatar');
    });
  });

  describe('initials', () => {
    it('should render initials when no image src', () => {
      component.src.set('');
      component.initials.set('JD');
      fixture.detectChanges();

      expect(avatarEl.textContent).toContain('JD');
    });

    it('should show initials when image fails to load', () => {
      component.initials.set('JD');
      fixture.detectChanges();

      const img = avatarEl.querySelector('img');
      img?.dispatchEvent(new Event('error'));
      fixture.detectChanges();

      expect(avatarEl.textContent).toContain('JD');
    });
  });

  describe('sizes', () => {
    it('should apply xs size', () => {
      component.size.set('xs');
      fixture.detectChanges();
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-6');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-6');
    });

    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-8');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-8');
    });

    it('should apply md size', () => {
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-10');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-10');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-12');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-12');
    });

    it('should apply xl size', () => {
      component.size.set('xl');
      fixture.detectChanges();
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-16');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-16');
    });

    it('should apply 2xl size', () => {
      component.size.set('2xl');
      fixture.detectChanges();
      expect(avatarEl.querySelector('.relative')?.className).toContain('w-20');
      expect(avatarEl.querySelector('.relative')?.className).toContain('h-20');
    });
  });

  describe('variants', () => {
    it('should apply circle variant', () => {
      const inner = avatarEl.querySelector('.overflow-hidden');
      expect(inner?.className).toContain('rounded-full');
    });

    it('should apply rounded variant', () => {
      component.variant.set('rounded');
      fixture.detectChanges();
      const inner = avatarEl.querySelector('.overflow-hidden');
      expect(inner?.className).toContain('rounded-lg');
    });

    it('should apply square variant', () => {
      component.variant.set('square');
      fixture.detectChanges();
      const inner = avatarEl.querySelector('.overflow-hidden');
      expect(inner?.className).toContain('rounded-none');
    });
  });

  describe('status', () => {
    it('should not show status indicator by default', () => {
      const status = avatarEl.querySelector(
        '.bg-emerald-500, .bg-rose-500, .bg-amber-500, .bg-slate-400'
      );
      expect(status).toBeNull();
    });

    it('should show online status', () => {
      component.status.set('online');
      fixture.detectChanges();
      const status = avatarEl.querySelector('.bg-emerald-500');
      expect(status).toBeTruthy();
    });

    it('should show offline status', () => {
      component.status.set('offline');
      fixture.detectChanges();
      const status = avatarEl.querySelector('.bg-slate-400');
      expect(status).toBeTruthy();
    });

    it('should show busy status', () => {
      component.status.set('busy');
      fixture.detectChanges();
      const status = avatarEl.querySelector('.bg-rose-500');
      expect(status).toBeTruthy();
    });

    it('should show away status', () => {
      component.status.set('away');
      fixture.detectChanges();
      const status = avatarEl.querySelector('.bg-amber-500');
      expect(status).toBeTruthy();
    });
  });

  describe('badge', () => {
    it('should not show badge by default', () => {
      const badge = avatarEl.querySelector('.bg-rose-500.text-white');
      expect(badge).toBeNull();
    });

    it('should show string badge', () => {
      component.badge.set('5');
      fixture.detectChanges();
      expect(avatarEl.textContent).toContain('5');
    });

    it('should show number badge', () => {
      component.badge.set(99);
      fixture.detectChanges();
      expect(avatarEl.textContent).toContain('99');
    });
  });

  describe('custom color', () => {
    it('should apply custom color class', () => {
      component.color.set('bg-purple-500 text-white');
      component.src.set('');
      component.initials.set('AB');
      fixture.detectChanges();

      const inner = avatarEl.querySelector('.overflow-hidden');
      expect(inner?.className).toContain('bg-purple-500');
    });
  });
});

describe('TwAvatarGroupComponent', () => {
  let fixture: ComponentFixture<GroupTestComponent>;
  let component: GroupTestComponent;
  let groupEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    groupEl = fixture.debugElement.query(By.directive(TwAvatarGroupComponent)).nativeElement;
  });

  it('should create the avatar group', () => {
    expect(groupEl).toBeTruthy();
    expect(component.group).toBeTruthy();
  });

  it('should render all avatars', () => {
    const avatars = fixture.debugElement.queryAll(By.directive(TwAvatarComponent));
    expect(avatars.length).toBe(3);
  });

  describe('spacing', () => {
    it('should apply normal spacing by default', () => {
      const innerDiv = groupEl.querySelector('div');
      expect(innerDiv?.className).toContain('-space-x-2');
    });

    it('should apply tight spacing', () => {
      component.spacing.set('tight');
      fixture.detectChanges();
      const innerDiv = groupEl.querySelector('div');
      expect(innerDiv?.className).toContain('-space-x-3');
    });

    it('should apply loose spacing', () => {
      component.spacing.set('loose');
      fixture.detectChanges();
      const innerDiv = groupEl.querySelector('div');
      expect(innerDiv?.className).toContain('-space-x-1');
    });
  });

  describe('overflow indicator', () => {
    it('should show overflow indicator when max and total are set', () => {
      component.max.set(2);
      component.total.set(5);
      fixture.detectChanges();

      // Should show +3
      expect(groupEl.textContent).toContain('+3');
    });

    it('should not show overflow when total is less than max', () => {
      component.max.set(10);
      component.total.set(3);
      fixture.detectChanges();

      const overflow = groupEl.querySelector('[class*="bg-slate-100"]');
      expect(overflow).toBeNull();
    });
  });
});
