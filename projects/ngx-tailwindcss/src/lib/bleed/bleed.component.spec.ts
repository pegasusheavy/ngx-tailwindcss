import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { BleedAmount, BleedDirection, TwBleedComponent } from './bleed.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-bleed
      [direction]="direction()"
      [amount]="amount()"
      [customAmount]="customAmount()"
      [preservePadding]="preservePadding()"
      [class]="customClass()"
    >
      <p>Bleed content</p>
    </tw-bleed>
  `,
  standalone: true,
  imports: [TwBleedComponent],
})
class TestHostComponent {
  @ViewChild(TwBleedComponent) bleed!: TwBleedComponent;
  direction = signal<BleedDirection>('horizontal');
  amount = signal<BleedAmount>('md');
  customAmount = signal<string | undefined>(undefined);
  preservePadding = signal(false);
  customClass = signal('');
}

describe('TwBleedComponent', () => {
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
    hostEl = fixture.debugElement.query(By.directive(TwBleedComponent)).nativeElement;
  });

  it('should create the component', () => {
    expect(hostEl).toBeTruthy();
    expect(component.bleed).toBeTruthy();
    expect(hostEl.textContent).toContain('Bleed content');
  });

  describe('horizontal bleed', () => {
    it('should apply negative horizontal margins for preset amounts', () => {
      expect(getInner().style.marginLeft).toBe('-2rem');
      expect(getInner().style.marginRight).toBe('-2rem');
    });

    it('should update margins when amount changes', () => {
      component.amount.set('lg');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toBe('-4rem');
      expect(getInner().style.marginRight).toBe('-4rem');
    });

    it('should apply viewport-based margins and width for amount="full"', () => {
      component.amount.set('full');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toMatch(/calc\((-50vw \+ 50%|50% - 50vw)\)/);
      expect(getInner().style.marginRight).toMatch(/calc\((-50vw \+ 50%|50% - 50vw)\)/);
      expect(getInner().style.width).toBe('100vw');
    });
  });

  describe('directions', () => {
    it('should only bleed left for direction="left"', () => {
      component.direction.set('left');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toBe('-2rem');
      expect(getInner().style.marginRight || '').toBe('');
    });

    it('should only bleed right for direction="right"', () => {
      component.direction.set('right');
      fixture.detectChanges();

      expect(getInner().style.marginRight).toBe('-2rem');
      expect(getInner().style.marginLeft || '').toBe('');
    });

    it('should bleed vertically as well for direction="all"', () => {
      component.direction.set('all');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toBe('-2rem');
      expect(getInner().style.marginRight).toBe('-2rem');
      expect(getInner().style.marginTop).toBe('-2rem');
      expect(getInner().style.marginBottom).toBe('-2rem');
    });
  });

  describe('preservePadding', () => {
    it('should mirror the bleed with padding for preset amounts', () => {
      component.preservePadding.set(true);
      fixture.detectChanges();

      expect(getInner().style.paddingLeft).toBe('2rem');
      expect(getInner().style.paddingRight).toBe('2rem');
    });

    it('should preserve padding for amount="full"', () => {
      component.amount.set('full');
      component.preservePadding.set(true);
      fixture.detectChanges();

      expect(getInner().style.paddingLeft).toMatch(/calc\((50vw - 50%|-50% \+ 50vw)\)/);
      expect(getInner().style.paddingRight).toMatch(/calc\((50vw - 50%|-50% \+ 50vw)\)/);
    });
  });

  describe('customAmount', () => {
    it('should use the custom amount for margins', () => {
      component.customAmount.set('3rem');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toBe('-3rem');
      expect(getInner().style.marginRight).toBe('-3rem');
    });

    it('should take precedence over amount="full"', () => {
      component.amount.set('full');
      component.customAmount.set('3rem');
      fixture.detectChanges();

      expect(getInner().style.marginLeft).toBe('-3rem');
      expect(getInner().style.marginRight).toBe('-3rem');
      expect(getInner().style.width || '').toBe('');
    });
  });

  describe('class customization', () => {
    it('should merge custom classes with the base class', () => {
      component.customClass.set('custom-bleed-class');
      fixture.detectChanges();

      expect(getInner().className).toContain('relative');
      expect(getInner().className).toContain('custom-bleed-class');
    });
  });
});
