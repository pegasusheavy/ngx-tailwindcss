import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  booleanAttribute,
} from '@angular/core';

export interface CopyClipboardEvent {
  success: boolean;
  text: string;
  error?: Error;
}

/**
 * Directive to copy text to clipboard on click
 *
 * @example
 * ```html
 * <button twCopyClipboard="Text to copy" (copied)="onCopied($event)">Copy</button>
 * <button [twCopyClipboard]="dynamicText" (copied)="onCopied($event)">Copy Dynamic</button>
 * ```
 */
@Directive({
  selector: '[twCopyClipboard]',
  standalone: true,
})
export class TwCopyClipboardDirective {
  /** Text to copy to clipboard */
  @Input({ required: true })
  twCopyClipboard: string = '';

  /** Disable copying */
  @Input({ transform: booleanAttribute })
  copyDisabled: boolean = false;

  /** Emits when copy operation completes */
  @Output()
  copied = new EventEmitter<CopyClipboardEvent>();

  @HostListener('click')
  async onClick(): Promise<void> {
    if (this.copyDisabled || !this.twCopyClipboard) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.twCopyClipboard);
        this.copied.emit({ success: true, text: this.twCopyClipboard });
      } else {
        // Fallback for older browsers
        this.fallbackCopy(this.twCopyClipboard);
        this.copied.emit({ success: true, text: this.twCopyClipboard });
      }
    } catch (error) {
      this.copied.emit({
        success: false,
        text: this.twCopyClipboard,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private fallbackCopy(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

