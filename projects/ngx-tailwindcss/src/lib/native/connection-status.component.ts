import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'
  | 'syncing'
  | 'synced';

@Component({
  selector: 'tw-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClasses()"
      (click)="statusClicked.emit()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <!-- Status Indicator -->
      <div class="relative flex-shrink-0">
        <div [class]="dotClasses()"></div>
        @if (isPulsing()) {
          <div [class]="pulseClasses()"></div>
        }
      </div>

      <!-- Label -->
      @if (showLabel()) {
        <span [class]="labelClasses()">{{ statusLabel() }}</span>
      }

      <!-- Last Synced -->
      @if (showLastSynced() && lastSynced()) {
        <span class="text-xs text-slate-500">
          {{ formatLastSynced() }}
        </span>
      }

      <!-- Retry Button -->
      @if (showRetry() && (state() === 'error' || state() === 'disconnected')) {
        <button
          (click)="retry($event)"
          class="ml-2 px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition-colors"
        >
          Retry
        </button>
      }
    </div>
  `,
})
export class TwConnectionStatusComponent {
  public readonly state = input<ConnectionState>('disconnected');
  public readonly showLabel = input(true);
  public readonly showLastSynced = input(false);
  public readonly showRetry = input(true);
  public readonly lastSynced = input<Date | null>(null);
  public readonly compact = input(false);
  public readonly customLabels = input<Partial<Record<ConnectionState, string>>>({});

  public readonly statusClicked = output<void>();
  public readonly retryClicked = output<void>();

  private readonly defaultLabels: Record<ConnectionState, string> = {
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
    error: 'Connection Error',
    syncing: 'Syncing...',
    synced: 'Synced',
  };

  public readonly statusLabel = computed(() => {
    const labels = this.customLabels();
    const currentState = this.state();
    return labels[currentState] || this.defaultLabels[currentState];
  });

  public readonly ariaLabel = computed(() => {
    return `Connection status: ${this.statusLabel()}`;
  });

  public readonly containerClasses = computed(() => {
    const classes = ['inline-flex items-center gap-2'];
    if (!this.compact()) {
      classes.push('px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800');
    }
    return classes.join(' ');
  });

  public readonly dotClasses = computed(() => {
    const colorMap: Record<ConnectionState, string> = {
      connected: 'bg-green-500',
      connecting: 'bg-yellow-500',
      disconnected: 'bg-slate-400',
      error: 'bg-red-500',
      syncing: 'bg-blue-500',
      synced: 'bg-green-500',
    };
    return `w-2 h-2 rounded-full ${colorMap[this.state()]}`;
  });

  public readonly pulseClasses = computed(() => {
    const colorMap: Record<ConnectionState, string> = {
      connected: 'bg-green-500',
      connecting: 'bg-yellow-500',
      disconnected: 'bg-slate-400',
      error: 'bg-red-500',
      syncing: 'bg-blue-500',
      synced: 'bg-green-500',
    };
    return `absolute inset-0 w-2 h-2 rounded-full ${colorMap[this.state()]} animate-ping`;
  });

  public readonly isPulsing = computed(() => {
    const state = this.state();
    return state === 'connecting' || state === 'syncing';
  });

  public readonly labelClasses = computed(() => {
    const colorMap: Record<ConnectionState, string> = {
      connected: 'text-green-700 dark:text-green-400',
      connecting: 'text-yellow-700 dark:text-yellow-400',
      disconnected: 'text-slate-600 dark:text-slate-400',
      error: 'text-red-700 dark:text-red-400',
      syncing: 'text-blue-700 dark:text-blue-400',
      synced: 'text-green-700 dark:text-green-400',
    };
    return `text-sm font-medium ${colorMap[this.state()]}`;
  });

  public formatLastSynced(): string {
    const date = this.lastSynced();
    if (!date) return '';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }

  public retry(event: MouseEvent): void {
    event.stopPropagation();
    this.retryClicked.emit();
  }
}
