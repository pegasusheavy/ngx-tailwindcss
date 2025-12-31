import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogEntry, LogFilter } from './native.types';

/**
 * Log viewer component
 * Displays log entries with filtering and search
 *
 * @example
 * ```html
 * <tw-log-viewer [entries]="logs" (entrySelect)="onLogSelect($event)"></tw-log-viewer>
 * ```
 */
@Component({
  selector: 'tw-log-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            class="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            placeholder="Search logs..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
          />
        </div>

        <!-- Level filter -->
        <div class="flex items-center gap-1">
          @for (level of logLevels; track level.value) {
            <button
              type="button"
              class="px-2 py-1 text-xs font-medium rounded transition-colors"
              [class]="getLevelFilterClasses(level.value)"
              (click)="toggleLevelFilter(level.value)"
            >
              {{ level.label }}
            </button>
          }
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            [class.text-blue-500]="autoScroll()"
            [attr.aria-label]="autoScroll() ? 'Disable auto-scroll' : 'Enable auto-scroll'"
            (click)="autoScroll.set(!autoScroll())"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
          <button
            type="button"
            class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            [attr.aria-label]="'Export logs'"
            (click)="exportLogs()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button
            type="button"
            class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            [attr.aria-label]="'Clear logs'"
            (click)="clearLogs.emit()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Log entries -->
      <div class="flex-1 overflow-y-auto">
        @if (filteredEntries().length === 0) {
          <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            @if (entries().length === 0) {
              <p>No log entries</p>
            } @else {
              <p>No entries match the current filter</p>
            }
          </div>
        } @else {
          <table class="w-full text-sm">
            <tbody>
              @for (entry of filteredEntries(); track entry.id) {
                <tr
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  [class.bg-red-50]="entry.level === 'error' || entry.level === 'fatal'"
                  [class.dark:bg-red-900/20]="entry.level === 'error' || entry.level === 'fatal'"
                  (click)="selectEntry(entry)"
                >
                  <!-- Timestamp -->
                  <td class="px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                    {{ formatTimestamp(entry.timestamp) }}
                  </td>

                  <!-- Level badge -->
                  <td class="px-2 py-2">
                    <span [class]="getLevelBadgeClasses(entry.level)">
                      {{ entry.level.toUpperCase() }}
                    </span>
                  </td>

                  <!-- Source -->
                  @if (showSource()) {
                    <td class="px-2 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {{ entry.source || '-' }}
                    </td>
                  }

                  <!-- Message -->
                  <td class="px-3 py-2 text-gray-900 dark:text-gray-100 truncate max-w-md">
                    {{ entry.message }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <!-- Status bar -->
      <div class="flex items-center justify-between px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <span>{{ filteredEntries().length }} / {{ entries().length }} entries</span>
        <span>
          @if (autoScroll()) {
            Auto-scrolling
          } @else {
            Scroll paused
          }
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-log-viewer block',
  },
})
export class TwLogViewerComponent {
  // Inputs
  public readonly entries = input<LogEntry[]>([]);
  public readonly showSource = input(true);

  // Outputs
  public readonly entrySelect = output<LogEntry>();
  public readonly clearLogs = output<void>();
  public readonly exportClick = output<LogEntry[]>();

  // State
  protected readonly searchQuery = signal('');
  protected readonly activeLevels = signal<Set<LogEntry['level']>>(new Set(['debug', 'info', 'warn', 'error', 'fatal']));
  protected readonly autoScroll = signal(true);
  protected readonly selectedEntry = signal<LogEntry | null>(null);

  protected readonly logLevels = [
    { value: 'debug' as const, label: 'DEBUG' },
    { value: 'info' as const, label: 'INFO' },
    { value: 'warn' as const, label: 'WARN' },
    { value: 'error' as const, label: 'ERROR' },
    { value: 'fatal' as const, label: 'FATAL' },
  ];

  // Computed
  protected readonly filteredEntries = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const levels = this.activeLevels();

    return this.entries().filter(entry => {
      // Level filter
      if (!levels.has(entry.level)) return false;

      // Search filter
      if (query) {
        const searchText = [entry.message, entry.source || ''].join(' ').toLowerCase();
        if (!searchText.includes(query)) return false;
      }

      return true;
    });
  });

  protected toggleLevelFilter(level: LogEntry['level']): void {
    this.activeLevels.update(levels => {
      const newLevels = new Set(levels);
      if (newLevels.has(level)) {
        newLevels.delete(level);
      } else {
        newLevels.add(level);
      }
      return newLevels;
    });
  }

  protected onFilterChange(): void {
    // Filter change triggers computed update automatically
  }

  protected selectEntry(entry: LogEntry): void {
    this.selectedEntry.set(entry);
    this.entrySelect.emit(entry);
  }

  protected formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }

  protected getLevelFilterClasses(level: LogEntry['level']): string {
    const isActive = this.activeLevels().has(level);
    const base = 'transition-colors';

    if (!isActive) {
      return `${base} bg-gray-100 dark:bg-gray-700 text-gray-400`;
    }

    const levelClasses: Record<LogEntry['level'], string> = {
      debug: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200',
      info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      warn: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
      error: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
      fatal: 'bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200',
    };

    return `${base} ${levelClasses[level]}`;
  }

  protected getLevelBadgeClasses(level: LogEntry['level']): string {
    const base = 'px-1.5 py-0.5 text-xs font-medium rounded';

    const levelClasses: Record<LogEntry['level'], string> = {
      debug: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      warn: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
      error: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
      fatal: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100',
    };

    return `${base} ${levelClasses[level]}`;
  }

  protected exportLogs(): void {
    this.exportClick.emit(this.filteredEntries());
  }
}

