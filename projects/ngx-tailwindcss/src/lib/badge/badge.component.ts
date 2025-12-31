import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeStyle = 'solid' | 'soft' | 'outline' | 'dot';

const BADGE_BASE_CLASSES = `
  inline-flex items-center justify-center
  font-medium
  whitespace-nowrap
`;

const BADGE_SOLID_VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-slate-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  danger: 'bg-rose-600 text-white',
  info: 'bg-cyan-600 text-white',
  neutral: 'bg-slate-200 text-slate-800',
};

const BADGE_SOFT_VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300',
  warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
  danger: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300',
  info: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300',
  neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
};

const BADGE_OUTLINE_VARIANTS: Record<BadgeVariant, string> = {
  primary:
    'bg-transparent border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400',
  secondary:
    'bg-transparent border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400',
  success:
    'bg-transparent border border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400',
  warning:
    'bg-transparent border border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400',
  danger:
    'bg-transparent border border-rose-600 dark:border-rose-400 text-rose-600 dark:text-rose-400',
  info: 'bg-transparent border border-cyan-600 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400',
  neutral:
    'bg-transparent border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400',
};

const BADGE_DOT_COLORS: Record<BadgeVariant, string> = {
  primary: 'bg-blue-600',
  secondary: 'bg-slate-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-rose-600',
  info: 'bg-cyan-600',
  neutral: 'bg-slate-400',
};

const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: 'text-xs px-2.5 py-1 gap-1.5',
  md: 'text-xs px-3 py-1.5 gap-2',
  lg: 'text-sm px-4 py-2 gap-2',
};

const BADGE_ROUNDED: Record<string, string> = {
  default: 'rounded-md',
  pill: 'rounded-full',
};

/**
 * Badge component for status indicators, labels, and counts
 *
 * @example
 * ```html
 * <tw-badge>Default</tw-badge>
 * <tw-badge variant="success">Active</tw-badge>
 * <tw-badge variant="danger" badgeStyle="soft">Error</tw-badge>
 * <tw-badge variant="info" badgeStyle="outline" [pill]="true">New</tw-badge>
 * <tw-badge variant="primary" badgeStyle="dot">With dot</tw-badge>
 * <tw-badge [removable]="true" (remove)="onRemove()">Removable</tw-badge>
 * ```
 */
@Component({
  selector: 'tw-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  host: {
    '[class]': 'computedClasses()',
  },
})
export class TwBadgeComponent {
  private readonly twClass = inject(TwClassService);

  // Internal signals
  protected readonly _variant = signal<BadgeVariant>('neutral');
  protected readonly _badgeStyle = signal<BadgeStyle>('solid');
  protected readonly _size = signal<BadgeSize>('md');
  protected readonly _pill = signal(false);
  protected readonly _removable = signal(false);
  protected readonly _classOverride = signal('');

  // Input setters
  @Input() set variant(value: BadgeVariant) {
    this._variant.set(value);
  }
  @Input() set badgeStyle(value: BadgeStyle) {
    this._badgeStyle.set(value);
  }
  @Input() set size(value: BadgeSize) {
    this._size.set(value);
  }
  @Input({ transform: booleanAttribute }) set pill(value: boolean) {
    this._pill.set(value);
  }
  @Input({ transform: booleanAttribute }) set removable(value: boolean) {
    this._removable.set(value);
  }
  @Input() set classOverride(value: string) {
    this._classOverride.set(value);
  }

  // Output
  @Output() remove = new EventEmitter<void>();

  protected readonly computedClasses = computed(() => {
    const styleVariants: Record<BadgeStyle, Record<BadgeVariant, string>> = {
      solid: BADGE_SOLID_VARIANTS,
      soft: BADGE_SOFT_VARIANTS,
      outline: BADGE_OUTLINE_VARIANTS,
      dot: BADGE_SOFT_VARIANTS, // Dot style uses soft background
    };

    return this.twClass.merge(
      BADGE_BASE_CLASSES,
      styleVariants[this._badgeStyle()][this._variant()],
      BADGE_SIZES[this._size()],
      this._pill() ? BADGE_ROUNDED['pill'] : BADGE_ROUNDED['default'],
      this._classOverride()
    );
  });

  protected readonly dotClasses = computed(() => {
    const dotSizes: Record<BadgeSize, string> = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    };

    return this.twClass.merge(
      'rounded-full',
      dotSizes[this._size()],
      BADGE_DOT_COLORS[this._variant()]
    );
  });

  protected onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}

/**
 * Badge group for displaying multiple badges
 */
@Component({
  selector: 'tw-badge-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge-group.component.html',
})
export class TwBadgeGroupComponent {
  private readonly twClass = inject(TwClassService);

  // Internal signals
  protected readonly _gap = signal<'sm' | 'md' | 'lg'>('sm');
  protected readonly _direction = signal<'row' | 'column'>('row');
  protected readonly _wrap = signal(true);
  protected readonly _classOverride = signal('');

  // Input setters
  @Input() set gap(value: 'sm' | 'md' | 'lg') {
    this._gap.set(value);
  }
  @Input() set direction(value: 'row' | 'column') {
    this._direction.set(value);
  }
  @Input({ transform: booleanAttribute }) set wrap(value: boolean) {
    this._wrap.set(value);
  }
  @Input() set classOverride(value: string) {
    this._classOverride.set(value);
  }

  protected readonly computedClasses = computed(() => {
    const gaps: Record<string, string> = {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    };

    return this.twClass.merge(
      'inline-flex',
      this._direction() === 'column' ? 'flex-col' : 'flex-row',
      this._wrap() ? 'flex-wrap' : '',
      gaps[this._gap()],
      this._classOverride()
    );
  });
}
