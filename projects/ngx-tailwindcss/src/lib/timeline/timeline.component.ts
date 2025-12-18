import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface TimelineEvent {
  id?: string | number;
  title?: string;
  description?: string;
  date?: string;
  icon?: TemplateRef<any>;
  content?: TemplateRef<any>;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export type TimelineLayout = 'vertical' | 'horizontal';
export type TimelineAlign = 'left' | 'right' | 'alternate';

const TIMELINE_COLORS: Record<string, { bg: string; border: string }> = {
  primary: { bg: 'bg-blue-600', border: 'border-blue-600' },
  secondary: { bg: 'bg-slate-600', border: 'border-slate-600' },
  success: { bg: 'bg-emerald-600', border: 'border-emerald-600' },
  warning: { bg: 'bg-amber-500', border: 'border-amber-500' },
  danger: { bg: 'bg-rose-600', border: 'border-rose-600' },
  info: { bg: 'bg-cyan-600', border: 'border-cyan-600' },
};

/**
 * Timeline component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-timeline [events]="timelineEvents"></tw-timeline>
 * <tw-timeline [events]="events" align="alternate"></tw-timeline>
 * ```
 */
@Component({
  selector: 'tw-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
})
export class TwTimelineComponent {
  private readonly twClass = inject(TwClassService);

  /** Events to display */
  @Input() events: TimelineEvent[] = [];

  /** Layout direction */
  @Input() layout: TimelineLayout = 'vertical';

  /** Content alignment */
  @Input() align: TimelineAlign = 'left';

  /** Marker size */
  @Input() markerSize: 'sm' | 'md' | 'lg' = 'md';

  /** Track by function for ngFor */
  @Input() trackByFn: (event: TimelineEvent) => any = event => event.id ?? event;

  /** Additional classes */
  @Input() classOverride = '';

  private readonly MARKER_SIZES = {
    sm: { dot: 'w-3 h-3', icon: 'w-8 h-8 text-sm' },
    md: { dot: 'w-4 h-4', icon: 'w-10 h-10 text-base' },
    lg: { dot: 'w-5 h-5', icon: 'w-12 h-12 text-lg' },
  };

  protected containerClasses = computed(() => {
    return this.twClass.merge(
      this.layout === 'horizontal' ? 'flex' : 'flex flex-col',
      this.classOverride
    );
  });

  protected itemClasses(isFirst: boolean, isLast: boolean) {
    return this.twClass.merge(
      'relative flex gap-4',
      this.layout === 'horizontal' ? 'flex-col flex-1' : '',
      this.align === 'right' ? 'flex-row-reverse' : '',
      isLast ? '' : 'pb-8'
    );
  }

  protected connectorClasses() {
    if (this.layout === 'horizontal') {
      return this.twClass.merge(
        'absolute top-4 left-full w-full h-0.5 bg-slate-300',
        '-translate-x-1/2'
      );
    }

    // Line runs through the CENTER of the marker (not starting at the bottom)
    // This creates a continuous visual connection through all markers
    // The markers have z-10, so they appear ON TOP of the line

    // Position line at the vertical center of the marker
    // sm (w-3 = 12px): center at 6px
    // md (w-4 = 16px): center at 8px
    // lg (w-5 = 20px): center at 10px
    const topPosition = {
      sm: 'top-[6px]',
      md: 'top-[8px]',
      lg: 'top-[10px]',
    };

    // Calculate the left position to center the 2px line (w-0.5) with the marker dot
    // sm (w-3 = 12px): center at 6px, line at 6px - 1px = 5px
    // md (w-4 = 16px): center at 8px, line at 8px - 1px = 7px
    // lg (w-5 = 20px): center at 10px, line at 10px - 1px = 9px
    const leftPosition = {
      sm: 'left-[5px]',
      md: 'left-[7px]',
      lg: 'left-[9px]',
    };

    const rightPosition = {
      sm: 'right-[5px]',
      md: 'right-[7px]',
      lg: 'right-[9px]',
    };

    return this.twClass.merge(
      'absolute w-0.5 bg-slate-300 bottom-0',
      topPosition[this.markerSize],
      this.align === 'right' ? rightPosition[this.markerSize] : leftPosition[this.markerSize]
    );
  }

  protected markerContainerClasses() {
    return 'relative z-10 flex-shrink-0';
  }

  protected dotMarkerClasses(event: TimelineEvent) {
    const size = this.MARKER_SIZES[this.markerSize].dot;
    const color = event.color || 'primary';
    const colorClasses = TIMELINE_COLORS[color];

    return this.twClass.merge('rounded-full ring-4 ring-white', size, colorClasses.bg);
  }

  protected iconMarkerClasses(event: TimelineEvent) {
    const size = this.MARKER_SIZES[this.markerSize].icon;
    const color = event.color || 'primary';
    const colorClasses = TIMELINE_COLORS[color];

    return this.twClass.merge(
      'rounded-full flex items-center justify-center text-white ring-4 ring-white',
      size,
      colorClasses.bg
    );
  }

  protected contentClasses() {
    return this.twClass.merge('flex-1 min-w-0', this.align === 'right' ? 'text-right' : '');
  }

  protected dateClasses() {
    return 'text-xs text-slate-500 font-medium uppercase tracking-wide';
  }

  protected titleClasses() {
    return 'text-base font-semibold text-slate-900 mt-1';
  }

  protected descriptionClasses() {
    return 'text-sm text-slate-600 mt-1';
  }
}
