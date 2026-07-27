import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ButtonSize,
  ButtonVariant,
  TwButtonComponent,
  TwButtonLinkComponent,
} from './button.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-button
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [loading]="loading()"
      [fullWidth]="fullWidth()"
      [iconOnly]="iconOnly()"
      [ripple]="ripple()"
      [classOverride]="classOverride()"
      [classReplace]="classReplace()"
      (click)="onClick()"
      data-testid="test-button"
    >
      {{ buttonText() }}
    </tw-button>
  `,
  standalone: true,
  imports: [TwButtonComponent],
})
class TestHostComponent {
  @ViewChild(TwButtonComponent) button!: TwButtonComponent;
  variant = signal<ButtonVariant>('primary');
  size = signal<ButtonSize>('md');
  disabled = signal(false);
  loading = signal(false);
  fullWidth = signal(false);
  iconOnly = signal(false);
  ripple = signal(true);
  classOverride = signal('');
  classReplace = signal('');
  buttonText = signal('Click me');
  clickCount = 0;

  onClick(): void {
    this.clickCount++;
  }
}

describe('TwButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let buttonEl: DebugElement;
  let buttonNative: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.directive(TwButtonComponent));
    buttonNative = buttonEl.nativeElement;
  });

  it('should create the button', () => {
    expect(buttonEl).toBeTruthy();
    expect(component.button).toBeTruthy();
  });

  it('should render button text', () => {
    expect(buttonNative.textContent).toContain('Click me');
  });

  it('should have role="button"', () => {
    expect(buttonNative.getAttribute('role')).toBe('button');
  });

  describe('variants', () => {
    it('should apply default primary variant classes', () => {
      const classes = buttonNative.className;
      expect(classes).toBeTruthy();
      expect(classes).toContain('bg-blue-600');
    });

    it('should update classes when variant changes', () => {
      component.variant.set('danger');
      fixture.detectChanges();

      expect(buttonNative.className).toContain('bg-rose-600');
      expect(buttonNative.className).not.toContain('bg-blue-600');
    });
  });

  describe('sizes', () => {
    it('should apply default md size classes', () => {
      const classes = buttonNative.className;
      expect(classes).toContain('text-base');
    });

    it('should update classes when size changes', () => {
      component.size.set('lg');
      fixture.detectChanges();

      expect(buttonNative.className).toContain('text-lg');
    });
  });

  describe('disabled state', () => {
    it('should set disabled attribute', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('disabled')).toBe('true');
    });

    it('should set aria-disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex to -1 when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('tabindex')).toBe('-1');
    });

    it('should apply disabled classes', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      expect(buttonNative.className).toContain('disabled:opacity-50');
    });

    it('should apply inert classes directly when disabled', () => {
      expect(buttonNative.classList.contains('pointer-events-none')).toBe(false);

      component.disabled.set(true);
      fixture.detectChanges();

      // classList checks are exact-token, so these cannot be satisfied
      // by the disabled:* variant classes
      expect(buttonNative.classList.contains('opacity-50')).toBe(true);
      expect(buttonNative.classList.contains('cursor-not-allowed')).toBe(true);
      expect(buttonNative.classList.contains('pointer-events-none')).toBe(true);
    });

    it('should not fire consumer click handlers when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      buttonNative.click();
      fixture.detectChanges();

      expect(component.clickCount).toBe(0);
    });

    it('should fire consumer click handlers when enabled', () => {
      buttonNative.click();
      fixture.detectChanges();

      expect(component.clickCount).toBe(1);
    });
  });

  describe('keyboard activation', () => {
    it('should fire click on Enter', () => {
      buttonNative.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(component.clickCount).toBe(1);
    });

    it('should fire click on Space', () => {
      buttonNative.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(component.clickCount).toBe(1);
    });

    it('should not fire click on Enter when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();

      buttonNative.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(component.clickCount).toBe(0);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner', () => {
      component.loading.set(true);
      fixture.detectChanges();

      const spinner = buttonNative.querySelector('svg.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('should set aria-busy when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('aria-busy')).toBe('true');
    });

    it('should set disabled attribute when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('disabled')).toBe('true');
    });

    it('should have aria-busy when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();

      expect(buttonNative.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('fullWidth', () => {
    it('should apply w-full when fullWidth', () => {
      expect(buttonNative.className).not.toContain('w-full');

      component.fullWidth.set(true);
      fixture.detectChanges();

      expect(buttonNative.className).toContain('w-full');
    });
  });

  describe('iconOnly', () => {
    it('should apply icon-only classes when iconOnly', () => {
      component.iconOnly.set(true);
      fixture.detectChanges();

      expect(buttonNative.className).toContain('gap-0');
      expect(buttonNative.className).toContain('p-3');
    });
  });

  describe('class customization', () => {
    it('should have base button classes', () => {
      const classes = buttonNative.className;
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
    });
  });

  describe('public methods', () => {
    it('should provide nativeElement accessor', () => {
      expect(component.button.nativeElement).toBe(buttonNative);
    });

    it('should provide focus method', () => {
      const focusSpy = vi.spyOn(buttonNative, 'focus');
      component.button.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should provide blur method', () => {
      const blurSpy = vi.spyOn(buttonNative, 'blur');
      component.button.blur();
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have tabindex 0 by default', () => {
      expect(buttonNative.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper ARIA attributes', () => {
      expect(buttonNative.getAttribute('role')).toBe('button');
      expect(buttonNative.getAttribute('aria-disabled')).toBe('false');
    });
  });
});

@Component({
  template: `
    <a tw-button [variant]="variant()" [disabled]="disabled()" href="#" data-testid="button-link">
      Link Button
    </a>
  `,
  standalone: true,
  imports: [TwButtonLinkComponent],
})
class TestLinkComponent {
  @ViewChild(TwButtonLinkComponent) buttonLink!: TwButtonLinkComponent;
  variant = signal<ButtonVariant>('primary');
  disabled = signal(false);
}

describe('TwButtonLinkComponent', () => {
  let fixture: ComponentFixture<TestLinkComponent>;
  let component: TestLinkComponent;
  let linkEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLinkComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    linkEl = fixture.debugElement.query(By.directive(TwButtonLinkComponent)).nativeElement;
  });

  it('should create the link button', () => {
    expect(linkEl).toBeTruthy();
    expect(component.buttonLink).toBeTruthy();
  });

  it('should render as anchor element', () => {
    expect(linkEl.tagName.toLowerCase()).toBe('a');
  });

  it('should have href attribute', () => {
    expect(linkEl.getAttribute('href')).toBe('#');
  });

  it('should apply pointer-events none when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    expect(linkEl.style.pointerEvents).toBe('none');
  });

  it('should set aria-disabled when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    expect(linkEl.getAttribute('aria-disabled')).toBe('true');
  });

  it('should not have pointer-events none when enabled', () => {
    component.disabled.set(false);
    fixture.detectChanges();

    expect(linkEl.style.pointerEvents).not.toBe('none');
  });
});

@Component({
  template: `
    <tw-button>
      <svg twButtonIcon class="icon">Icon</svg>
      Button with icon
      <svg twButtonIconEnd class="icon-end">End Icon</svg>
    </tw-button>
  `,
  standalone: true,
  imports: [TwButtonComponent],
})
class ButtonWithIconsComponent {}

describe('TwButtonComponent with icons', () => {
  let fixture: ComponentFixture<ButtonWithIconsComponent>;
  let buttonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWithIconsComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonWithIconsComponent);
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.directive(TwButtonComponent)).nativeElement;
  });

  it('should render leading icon', () => {
    const icon = buttonEl.querySelector('.icon');
    expect(icon).toBeTruthy();
  });

  it('should render trailing icon', () => {
    const iconEnd = buttonEl.querySelector('.icon-end');
    expect(iconEnd).toBeTruthy();
  });

  it('should render button text', () => {
    expect(buttonEl.textContent).toContain('Button with icon');
  });
});
