import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyClipboardEvent, TwCopyClipboardDirective } from './copy-clipboard.directive';

@Component({
  template: `
    <button twCopyClipboard="Copy me" (copied)="onCopied($event)" data-testid="copy-button">
      Copy
    </button>
  `,
  standalone: true,
  imports: [TwCopyClipboardDirective],
})
class TestHostComponent {
  lastEvent: CopyClipboardEvent | null = null;
  copiedCount = 0;

  onCopied(event: CopyClipboardEvent): void {
    this.lastEvent = event;
    this.copiedCount++;
  }
}

function setClipboard(value: unknown): void {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value,
  });
}

describe('TwCopyClipboardDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let buttonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('[data-testid="copy-button"]')).nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    setClipboard(undefined);
    vi.restoreAllMocks();
  });

  it('should create the directive', () => {
    expect(buttonEl).toBeTruthy();
  });

  it('should emit success via the Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    buttonEl.click();
    await new Promise<void>(resolve => {
      setTimeout(resolve, 0);
    });

    expect(writeText).toHaveBeenCalledWith('Copy me');
    expect(component.lastEvent).toEqual({ success: true, text: 'Copy me' });
  });

  it('should emit success when the execCommand fallback succeeds', () => {
    setClipboard(undefined);
    const execCommandSpy = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandSpy;

    buttonEl.click();

    expect(execCommandSpy).toHaveBeenCalledWith('copy');
    expect(component.lastEvent?.success).toBe(true);
    expect(component.lastEvent?.text).toBe('Copy me');
    expect(component.lastEvent?.error).toBeUndefined();
  });

  it('should emit failure when the execCommand fallback fails', () => {
    setClipboard(undefined);
    const execCommandSpy = vi.fn().mockReturnValue(false);
    document.execCommand = execCommandSpy;

    buttonEl.click();

    expect(component.lastEvent?.success).toBe(false);
    expect(component.lastEvent?.text).toBe('Copy me');
    expect(component.lastEvent?.error).toBeInstanceOf(Error);
    expect(component.lastEvent?.error?.message).toBe('execCommand copy failed');
  });

  it('should emit failure when the Clipboard API rejects', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });

    buttonEl.click();
    await new Promise<void>(resolve => {
      setTimeout(resolve, 0);
    });

    expect(component.lastEvent?.success).toBe(false);
    expect(component.lastEvent?.error?.message).toBe('denied');
  });
});
