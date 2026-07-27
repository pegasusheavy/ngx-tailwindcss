import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { AspectRatioPreset, TwAspectRatioComponent } from './aspect-ratio.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-aspect-ratio [ratio]="ratio()" [customRatio]="customRatio()" [class]="customClass()">
      <img src="test.jpg" alt="Test" />
    </tw-aspect-ratio>
  `,
  standalone: true,
  imports: [TwAspectRatioComponent],
})
class TestHostComponent {
  @ViewChild(TwAspectRatioComponent) aspectRatio!: TwAspectRatioComponent;
  ratio = signal<AspectRatioPreset>('video');
  customRatio = signal<number | undefined>(undefined);
  customClass = signal('');
}

describe('TwAspectRatioComponent', () => {
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
    hostEl = fixture.debugElement.query(By.directive(TwAspectRatioComponent)).nativeElement;
  });

  it('should create the component', () => {
    expect(hostEl).toBeTruthy();
    expect(component.aspectRatio).toBeTruthy();
  });

  it('should render projected content', () => {
    expect(hostEl.querySelector('img')).toBeTruthy();
  });

  describe('presets', () => {
    it('should apply the video preset by default', () => {
      expect(getInner().className).toContain('aspect-video');
    });

    it('should update classes when the preset changes', () => {
      component.ratio.set('square');
      fixture.detectChanges();
      expect(getInner().className).toContain('aspect-square');

      component.ratio.set('portrait');
      fixture.detectChanges();
      expect(getInner().className).toContain('aspect-[3/4]');

      component.ratio.set('ultrawide');
      fixture.detectChanges();
      expect(getInner().className).toContain('aspect-[21/9]');
    });

    it('should always apply the base positioning classes', () => {
      expect(getInner().className).toContain('relative');
      expect(getInner().className).toContain('overflow-hidden');
    });
  });

  describe('custom ratio', () => {
    it('should apply the custom ratio as an inline style', () => {
      component.ratio.set('custom');
      component.customRatio.set(1.5);
      fixture.detectChanges();

      expect(getInner().style.aspectRatio).toMatch(/^1\.5(\s*\/\s*1)?$/);
      expect(getInner().className).not.toContain('aspect-video');
    });

    it('should support a customRatio of 0', () => {
      component.ratio.set('custom');
      component.customRatio.set(0);
      fixture.detectChanges();

      expect(getInner().style.aspectRatio).toMatch(/^0(\s*\/\s*1)?$/);
    });

    it('should fall back to the video preset when customRatio is missing', () => {
      component.ratio.set('custom');
      fixture.detectChanges();

      expect(getInner().className).toContain('aspect-video');
    });

    it('should not set an inline ratio for presets', () => {
      expect(getInner().style.aspectRatio || '').toBe('');
    });
  });

  describe('class customization', () => {
    it('should merge custom classes', () => {
      component.customClass.set('custom-ratio-class');
      fixture.detectChanges();

      expect(getInner().className).toContain('custom-ratio-class');
    });
  });
});
