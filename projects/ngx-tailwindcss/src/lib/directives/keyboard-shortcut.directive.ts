import {
  booleanAttribute,
  Directive,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface KeyboardShortcutEvent {
  key: string;
  event: KeyboardEvent;
  shortcut: string;
}

/**
 * Directive to handle keyboard shortcuts
 *
 * @example
 * ```html
 * <div twKeyboardShortcut="ctrl+s" (shortcutPressed)="onSave($event)">Press Ctrl+S to save</div>
 * <div twKeyboardShortcut="ctrl+shift+p" (shortcutPressed)="openPalette()">Command Palette</div>
 * <div twKeyboardShortcut="escape" (shortcutPressed)="onEscape()">Press ESC</div>
 * ```
 *
 * Supported modifiers: ctrl, alt, shift, meta (cmd on Mac)
 * Key names: Any KeyboardEvent.key value (a-z, 0-9, enter, escape, space, etc.)
 */
@Directive({
  selector: '[twKeyboardShortcut]',
  standalone: true,
})
export class TwKeyboardShortcutDirective implements OnInit, OnDestroy {
  private readonly ngZone: NgZone;
  private readonly platformId: object;

  constructor() {
    this.ngZone = inject(NgZone);
    this.platformId = inject(PLATFORM_ID);
  }

  /** Keyboard shortcut string (e.g., "ctrl+s", "ctrl+shift+p", "escape") */
  @Input({ required: true })
  twKeyboardShortcut = '';

  /** Listen globally (document) instead of element-only */
  @Input({ transform: booleanAttribute })
  shortcutGlobal = true;

  /** Prevent default browser behavior */
  @Input({ transform: booleanAttribute })
  shortcutPreventDefault = true;

  /** Stop event propagation */
  @Input({ transform: booleanAttribute })
  shortcutStopPropagation = false;

  /** Disable the shortcut */
  @Input({ transform: booleanAttribute })
  shortcutDisabled = false;

  /** Emits when the shortcut is pressed */
  @Output()
  shortcutPressed = new EventEmitter<KeyboardShortcutEvent>();

  private readonly keydownHandler = (event: Event): void => {
    const keyEvent = event as KeyboardEvent;
    if (this.shortcutDisabled) return;

    const shortcut = this.twKeyboardShortcut.toLowerCase();
    const parts = shortcut.split('+').map(p => p.trim());

    const key = parts.at(-1);
    const modifiers = new Set(parts.slice(0, -1));

    const ctrlRequired = modifiers.has('ctrl') || modifiers.has('control');
    const altRequired = modifiers.has('alt');
    const shiftRequired = modifiers.has('shift');
    const metaRequired = modifiers.has('meta') || modifiers.has('cmd');

    const ctrlPressed = keyEvent.ctrlKey || keyEvent.metaKey; // Treat meta as ctrl for cross-platform
    const altPressed = keyEvent.altKey;
    const shiftPressed = keyEvent.shiftKey;
    const metaPressed = keyEvent.metaKey;

    const keyMatches = keyEvent.key.toLowerCase() === key || keyEvent.code.toLowerCase() === key;

    const modifiersMatch =
      ctrlRequired === ctrlPressed &&
      altRequired === altPressed &&
      shiftRequired === shiftPressed &&
      (metaRequired ? metaPressed : true);

    if (keyMatches && modifiersMatch) {
      if (this.shortcutPreventDefault) {
        keyEvent.preventDefault();
      }
      if (this.shortcutStopPropagation) {
        keyEvent.stopPropagation();
      }

      this.ngZone.run(() => {
        this.shortcutPressed.emit({
          key: keyEvent.key,
          event: keyEvent,
          shortcut: this.twKeyboardShortcut,
        });
      });
    }
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      const target = this.shortcutGlobal ? document : document.body;
      target.addEventListener('keydown', this.keydownHandler);
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const target = this.shortcutGlobal ? document : document.body;
    target.removeEventListener('keydown', this.keydownHandler);
  }
}
