import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ShortcutDisplayVariant = 'default' | 'compact' | 'inline';
export type ShortcutDisplayPlatform = 'mac' | 'windows' | 'linux' | 'auto';

@Component({
  selector: 'tw-shortcut-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="containerClasses()">
      @for (key of formattedKeys(); track $index; let last = $last) {
        <kbd [class]="keyClasses()">{{ key }}</kbd>
        @if (!last && showSeparator()) {
          <span [class]="separatorClasses()">{{ separator() }}</span>
        }
      }
    </span>
  `,
})
export class TwShortcutDisplayComponent {
  public readonly keys = input<string[]>([]);
  public readonly shortcut = input('');
  public readonly variant = input<ShortcutDisplayVariant>('default');
  public readonly platform = input<ShortcutDisplayPlatform>('auto');
  public readonly separator = input('+');
  public readonly showSeparator = input(true);

  private readonly keySymbols: Record<string, Record<string, string>> = {
    mac: {
      Meta: '⌘',
      Command: '⌘',
      Cmd: '⌘',
      Ctrl: '⌃',
      Control: '⌃',
      Alt: '⌥',
      Option: '⌥',
      Shift: '⇧',
      Enter: '↵',
      Return: '↵',
      Backspace: '⌫',
      Delete: '⌦',
      Escape: '⎋',
      Esc: '⎋',
      Tab: '⇥',
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Space: '␣',
    },
    windows: {
      Meta: 'Win',
      Command: 'Win',
      Cmd: 'Win',
      Ctrl: 'Ctrl',
      Control: 'Ctrl',
      Alt: 'Alt',
      Option: 'Alt',
      Shift: 'Shift',
      Enter: 'Enter',
      Return: 'Enter',
      Backspace: 'Backspace',
      Delete: 'Del',
      Escape: 'Esc',
      Esc: 'Esc',
      Tab: 'Tab',
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Space: 'Space',
    },
  };

  private readonly detectedPlatform = computed((): 'mac' | 'windows' => {
    if (this.platform() !== 'auto') {
      return this.platform() as 'mac' | 'windows';
    }
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('mac')) return 'mac';
    }
    return 'windows';
  });

  public readonly formattedKeys = computed(() => {
    let keysArray = this.keys();
    if (keysArray.length === 0 && this.shortcut()) {
      keysArray = this.shortcut()
        .split('+')
        .map(k => k.trim());
    }

    const platform = this.detectedPlatform();
    const symbols = this.keySymbols[platform];

    return keysArray.map(key => {
      const normalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      return symbols[normalizedKey] || symbols[key] || key.toUpperCase();
    });
  });

  public readonly containerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'inline-flex items-center';

    switch (variant) {
      case 'compact':
        return `${baseClasses} gap-0.5`;
      case 'inline':
        return `${baseClasses} gap-0`;
      default:
        return `${baseClasses} gap-1`;
    }
  });

  public readonly keyClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'inline-flex items-center justify-center font-mono';

    switch (variant) {
      case 'compact':
        return `${baseClasses} px-1 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 rounded`;
      case 'inline':
        return `${baseClasses} px-1 text-xs text-slate-500`;
      default:
        return `${baseClasses} px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-sm`;
    }
  });

  public readonly separatorClasses = computed(() => {
    const variant = this.variant();
    if (variant === 'inline') {
      return 'text-slate-400 text-xs';
    }
    return 'text-slate-400 text-xs mx-0.5';
  });
}
