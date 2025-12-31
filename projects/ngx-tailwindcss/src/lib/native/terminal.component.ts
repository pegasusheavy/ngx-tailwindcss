import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalLine, TerminalVariant } from './native.types';

/**
 * Terminal / Console output component
 * Displays command output with ANSI color support
 *
 * @example
 * ```html
 * <tw-terminal [lines]="output" (command)="onCommand($event)"></tw-terminal>
 * ```
 */
@Component({
  selector: 'tw-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="containerClasses()">
      <!-- Header -->
      @if (showHeader()) {
        <div
          class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700"
        >
          <span class="text-sm text-gray-400">{{ title() }}</span>
          <div class="flex items-center gap-2">
            @if (showClearButton()) {
              <button
                type="button"
                class="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                [attr.aria-label]="'Clear terminal'"
                (click)="clear.emit()"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            }
            @if (showCopyButton()) {
              <button
                type="button"
                class="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                [attr.aria-label]="'Copy output'"
                (click)="copyOutput()"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            }
          </div>
        </div>
      }

      <!-- Output area -->
      <div class="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed" #outputArea>
        @for (line of lines(); track line.id) {
          <div class="whitespace-pre-wrap break-all" [class]="getLineClasses(line)">
            @if (showTimestamps() && line.timestamp) {
              <span class="text-gray-600 mr-2">[{{ formatTimestamp(line.timestamp) }}]</span>
            }
            @if (line.type === 'input') {
              <span class="text-green-400">{{ prompt() }}</span>
            }
            <span>{{ stripAnsi(line.content) }}</span>
          </div>
        }

        <!-- Cursor/loading indicator -->
        @if (showCursor()) {
          <div class="flex items-center">
            @if (isProcessing()) {
              <span class="text-yellow-400 animate-pulse">Processing...</span>
            } @else {
              <span class="text-green-400">{{ prompt() }}</span>
              <span class="w-2 h-4 bg-gray-300 animate-pulse ml-0.5"></span>
            }
          </div>
        }
      </div>

      <!-- Input area -->
      @if (showInput()) {
        <div
          class="flex items-center gap-2 px-4 py-2 border-t border-gray-700 bg-gray-800"
        >
          <span class="text-green-400 font-mono">{{ prompt() }}</span>
          <input
            type="text"
            class="flex-1 bg-transparent border-none outline-none font-mono text-sm text-gray-100 placeholder-gray-500"
            [placeholder]="inputPlaceholder()"
            [(ngModel)]="currentInput"
            (keydown.enter)="submitCommand()"
            (keydown.arrowup)="navigateHistory(-1)"
            (keydown.arrowdown)="navigateHistory(1)"
            [disabled]="isProcessing()"
            #commandInput
          />
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-terminal',
  },
})
export class TwTerminalComponent implements AfterViewChecked {
  @ViewChild('outputArea') private outputArea!: ElementRef<HTMLDivElement>;

  // Inputs
  public readonly lines = input<TerminalLine[]>([]);
  public readonly variant = input<TerminalVariant>('default');
  public readonly title = input('Terminal');
  public readonly prompt = input('$ ');
  public readonly inputPlaceholder = input('Enter command...');
  public readonly showHeader = input(true);
  public readonly showInput = input(true);
  public readonly showCursor = input(true);
  public readonly showTimestamps = input(false);
  public readonly showClearButton = input(true);
  public readonly showCopyButton = input(true);
  public readonly autoScroll = input(true);
  public readonly maxLines = input(1000);

  // Outputs
  public readonly command = output<string>();
  public readonly clear = output<void>();
  public readonly copy = output<string>();

  // State
  protected readonly currentInput = signal('');
  protected readonly isProcessing = signal(false);
  protected readonly commandHistory = signal<string[]>([]);
  protected readonly historyIndex = signal(-1);

  private shouldScroll = false;

  public ngAfterViewChecked(): void {
    if (this.shouldScroll && this.autoScroll() && this.outputArea?.nativeElement) {
      this.outputArea.nativeElement.scrollTop = this.outputArea.nativeElement.scrollHeight;
      this.shouldScroll = false;
    }
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const base = 'flex flex-col h-full overflow-hidden';

    const variantClasses: Record<TerminalVariant, string> = {
      default: 'bg-gray-900 text-gray-100',
      dark: 'bg-black text-gray-200',
      light: 'bg-white text-gray-900 border border-gray-200',
      retro: 'bg-black text-green-400',
    };

    return `${base} ${variantClasses[variant]}`;
  });

  protected getLineClasses(line: TerminalLine): string {
    const typeClasses: Record<TerminalLine['type'], string> = {
      input: 'text-gray-100',
      output: 'text-gray-300',
      error: 'text-red-400',
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
    };

    return typeClasses[line.type] || 'text-gray-300';
  }

  protected formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  protected stripAnsi(text: string): string {
    // Strip ANSI color codes from text
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  protected submitCommand(): void {
    const cmd = this.currentInput().trim();
    if (!cmd) return;

    // Add to history
    this.commandHistory.update(history => [...history, cmd]);
    this.historyIndex.set(-1);

    // Emit command
    this.command.emit(cmd);
    this.currentInput.set('');
    this.shouldScroll = true;
  }

  protected navigateHistory(direction: number): void {
    const history = this.commandHistory();
    if (history.length === 0) return;

    let newIndex = this.historyIndex() + direction;

    if (newIndex < -1) newIndex = -1;
    if (newIndex >= history.length) newIndex = history.length - 1;

    this.historyIndex.set(newIndex);

    if (newIndex === -1) {
      this.currentInput.set('');
    } else {
      this.currentInput.set(history[history.length - 1 - newIndex]);
    }
  }

  protected async copyOutput(): Promise<void> {
    const text = this.lines()
      .map(line => line.content)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      this.copy.emit(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  // Public methods
  public setProcessing(processing: boolean): void {
    this.isProcessing.set(processing);
  }

  public scrollToBottom(): void {
    this.shouldScroll = true;
  }
}
