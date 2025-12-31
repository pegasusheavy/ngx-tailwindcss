import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageBorderRadius, ImageFit, TwImageComponent } from './image.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-image
      [src]="src()"
      [alt]="alt()"
      [width]="width()"
      [height]="height()"
      [fit]="fit()"
      [borderRadius]="borderRadius()"
      [preview]="preview()"
      [zoomable]="zoomable()"
      [rotatable]="rotatable()"
      (onShow)="onShowSpy()"
      (onHide)="onHideSpy()"
      (onLoad)="onLoadSpy()"
      (onError)="onErrorSpy()"
      data-testid="test-image"
    ></tw-image>
  `,
  standalone: true,
  imports: [TwImageComponent],
})
class TestHostComponent {
  @ViewChild(TwImageComponent) image!: TwImageComponent;
  src = signal('https://example.com/image.jpg');
  alt = signal('Test image');
  width = signal('');
  height = signal('');
  fit = signal<ImageFit>('cover');
  borderRadius = signal<ImageBorderRadius>('none');
  preview = signal(false);
  zoomable = signal(true);
  rotatable = signal(true);

  onShowSpy = vi.fn();
  onHideSpy = vi.fn();
  onLoadSpy = vi.fn();
  onErrorSpy = vi.fn();
}

describe('TwImageComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let imageEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    imageEl = fixture.debugElement.query(By.directive(TwImageComponent));
  });

  it('should create the image component', () => {
    expect(imageEl).toBeTruthy();
    expect(component.image).toBeTruthy();
  });

  it('should render image with correct src', () => {
    const img = imageEl.query(By.css('img'));
    expect(img.nativeElement.src).toBe('https://example.com/image.jpg');
  });

  it('should render image with correct alt', () => {
    const img = imageEl.query(By.css('img'));
    expect(img.nativeElement.alt).toBe('Test image');
  });

  describe('dimensions', () => {
    it('should apply width style', () => {
      component.width.set('200');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.style.width).toBe('200px');
    });

    it('should apply height style', () => {
      component.height.set('150');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.style.height).toBe('150px');
    });

    it('should apply width with px suffix', () => {
      component.width.set('200px');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.style.width).toBe('200px');
    });

    it('should apply width with percentage', () => {
      component.width.set('50%');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.style.width).toBe('50%');
    });
  });

  describe('object fit', () => {
    it('should apply cover fit by default', () => {
      const img = imageEl.query(By.css('img'));
      expect(img.nativeElement.className).toContain('object-cover');
    });

    it('should apply contain fit', () => {
      component.fit.set('contain');
      fixture.detectChanges();
      const img = imageEl.query(By.css('img'));
      expect(img.nativeElement.className).toContain('object-contain');
    });

    it('should apply fill fit', () => {
      component.fit.set('fill');
      fixture.detectChanges();
      const img = imageEl.query(By.css('img'));
      expect(img.nativeElement.className).toContain('object-fill');
    });

    it('should apply none fit', () => {
      component.fit.set('none');
      fixture.detectChanges();
      const img = imageEl.query(By.css('img'));
      expect(img.nativeElement.className).toContain('object-none');
    });

    it('should apply scale-down fit', () => {
      component.fit.set('scale-down');
      fixture.detectChanges();
      const img = imageEl.query(By.css('img'));
      expect(img.nativeElement.className).toContain('object-scale-down');
    });
  });

  describe('border radius', () => {
    it('should apply none radius by default', () => {
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('rounded-none');
    });

    it('should apply sm radius', () => {
      component.borderRadius.set('sm');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('rounded-sm');
    });

    it('should apply lg radius', () => {
      component.borderRadius.set('lg');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('rounded-lg');
    });

    it('should apply full radius', () => {
      component.borderRadius.set('full');
      fixture.detectChanges();
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('rounded-full');
    });
  });

  describe('events', () => {
    it('should emit onLoad when image loads', () => {
      const img = imageEl.query(By.css('img'));
      img.nativeElement.dispatchEvent(new Event('load'));
      expect(component.onLoadSpy).toHaveBeenCalled();
    });

    it('should emit onError when image fails to load', () => {
      const img = imageEl.query(By.css('img'));
      img.nativeElement.dispatchEvent(new Event('error'));
      expect(component.onErrorSpy).toHaveBeenCalled();
    });
  });

  describe('preview', () => {
    beforeEach(() => {
      component.preview.set(true);
      fixture.detectChanges();
    });

    it('should have cursor-zoom-in when preview enabled', () => {
      const container = imageEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('cursor-zoom-in');
    });

    it('should open preview on image click', () => {
      const img = imageEl.query(By.css('img'));
      img.nativeElement.click();
      fixture.detectChanges();
      expect(component.onShowSpy).toHaveBeenCalled();
    });

    it('should close preview via closePreview method', () => {
      component.image.openPreview();
      fixture.detectChanges();
      component.image.closePreview();
      fixture.detectChanges();
      expect(component.onHideSpy).toHaveBeenCalled();
    });

    it('should close preview on escape key', () => {
      component.image.openPreview();
      fixture.detectChanges();
      component.image.onEscapePress();
      fixture.detectChanges();
      expect(component.onHideSpy).toHaveBeenCalled();
    });
  });

  describe('zoom', () => {
    beforeEach(() => {
      component.preview.set(true);
      fixture.detectChanges();
      component.image.openPreview();
      fixture.detectChanges();
    });

    it('should zoom in', () => {
      const initialZoom = component.image['zoomLevel']();
      component.image.zoomIn();
      expect(component.image['zoomLevel']()).toBeGreaterThan(initialZoom);
    });

    it('should zoom out', () => {
      component.image.zoomIn();
      const afterZoomIn = component.image['zoomLevel']();
      component.image.zoomOut();
      expect(component.image['zoomLevel']()).toBeLessThan(afterZoomIn);
    });

    it('should not zoom in beyond max', () => {
      // Zoom in multiple times
      for (let i = 0; i < 20; i++) {
        component.image.zoomIn();
      }
      expect(component.image['zoomLevel']()).toBeLessThanOrEqual(3);
    });

    it('should not zoom out beyond min', () => {
      // Zoom out multiple times
      for (let i = 0; i < 20; i++) {
        component.image.zoomOut();
      }
      expect(component.image['zoomLevel']()).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe('rotation', () => {
    beforeEach(() => {
      component.preview.set(true);
      fixture.detectChanges();
      component.image.openPreview();
      fixture.detectChanges();
    });

    it('should rotate left', () => {
      component.image.rotateLeft();
      expect(component.image['rotation']()).toBe(-90);
    });

    it('should rotate right', () => {
      component.image.rotateRight();
      expect(component.image['rotation']()).toBe(90);
    });

    it('should accumulate rotation', () => {
      component.image.rotateRight();
      component.image.rotateRight();
      expect(component.image['rotation']()).toBe(180);
    });
  });
});
