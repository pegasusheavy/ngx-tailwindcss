import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
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
  templateUrl: './log-viewer.component.html',
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
  public readonly clearLogs = output();
  public readonly exportClick = output<LogEntry[]>();

  // State
  protected readonly searchQuery = signal('');
  protected readonly activeLevels = signal<Set<LogEntry['level']>>(
    new Set(['debug', 'info', 'warn', 'error', 'fatal'])
  );
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
