import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { StickyOffset, StickyPosition, TwStickyComponent } from './sticky.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-sticky
      [position]="position()"
      [offset]="offset()"
      [customOffset]="customOffset()"
      [zIndex]="zIndex()"
      [disabled]="disabled()"
      [class]="classInput()"
    >
      <header>Sticky content</header>
    </tw-sticky>
  `,
  standalone: true,
  imports: [TwStickyComponent],
})
class TestHostComponent {
  position = signal<StickyPosition>('top');
  offset = signal<StickyOffset>('none');
  customOffset = signal<string | undefined>(undefined);
  zIndex = signal(10);
  disabled = signal(false);
  classInput = signal('');
}

describe('TwStickyComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  const stickyDiv = (): HTMLElement =>
    fixture.debugElement.query(By.css('tw-sticky div')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(stickyDiv().textContent).toContain('Sticky content');
  });

  it('should apply the sticky class and top offset by default', () => {
    expect(stickyDiv().className).toContain('sticky');
    expect(stickyDiv().style.top).toBe('0px');
    expect(stickyDiv().style.zIndex).toBe('10');
  });

  it('should map offset sizes to values', () => {
    component.offset.set('md');
    fixture.detectChanges();
    expect(stickyDiv().style.top).toBe('1rem');

    component.offset.set('xl');
    fixture.detectChanges();
    expect(stickyDiv().style.top).toBe('2rem');
  });

  it('should stick to other edges', () => {
    component.position.set('bottom');
    component.offset.set('sm');
    fixture.detectChanges();
    expect(stickyDiv().style.bottom).toBe('0.5rem');
  });

  it('should prefer customOffset over the offset preset', () => {
    component.offset.set('md');
    component.customOffset.set('60px');
    fixture.detectChanges();
    expect(stickyDiv().style.top).toBe('60px');
  });

  it('should apply the configured zIndex', () => {
    component.zIndex.set(50);
    fixture.detectChanges();
    expect(stickyDiv().style.zIndex).toBe('50');
  });

  it('should fall back to relative positioning when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    expect(stickyDiv().className).toContain('relative');
    expect(stickyDiv().className).not.toContain('sticky');
    expect(stickyDiv().style.top).toBe('');
  });

  it('should append custom classes', () => {
    component.classInput.set('shadow-md');
    fixture.detectChanges();
    expect(stickyDiv().className).toContain('shadow-md');
  });
});
