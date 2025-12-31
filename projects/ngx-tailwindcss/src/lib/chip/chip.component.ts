import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ChipVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ChipStyle = 'solid' | 'soft' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';

const CHIP_VARIANTS: Record<ChipVariant, Record<ChipStyle, string>> = {
  primary: {
    solid: 'bg-blue-600 text-white',
    soft: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    outline: 'border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400',
  },
  secondary: {
    solid: 'bg-slate-600 text-white',
    soft: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    outline: 'border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400',
  },
  success: {
    solid: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    outline:
      'border border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    solid: 'bg-amber-500 text-white',
    soft: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    outline: 'border border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400',
  },
  danger: {
    solid: 'bg-rose-600 text-white',
    soft: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    outline: 'border border-rose-600 dark:border-rose-400 text-rose-600 dark:text-rose-400',
  },
  info: {
    solid: 'bg-cyan-600 text-white',
    soft: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
    outline: 'border border-cyan-600 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400',
  },
};

const CHIP_SIZES: Record<ChipSize, { chip: string; image: string }> = {
  sm: { chip: 'px-2 py-0.5 text-xs gap-1', image: 'w-4 h-4' },
  md: { chip: 'px-3 py-1 text-sm gap-1.5', image: 'w-5 h-5' },
  lg: { chip: 'px-4 py-1.5 text-base gap-2', image: 'w-6 h-6' },
};

/**
 * Chip component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-chip label="Angular"></tw-chip>
 * <tw-chip variant="success" [removable]="true" (onRemove)="handleRemove()">Active</tw-chip>
 * <tw-chip [image]="avatarUrl" label="John Doe"></tw-chip>
 * ```
 */
@Component({
  selector: 'tw-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip.component.html',
})
export class TwChipComponent {
  private readonly twClass = inject(TwClassService);

  /** Chip label text */
  readonly label = input('');

  /** Visual variant */
  readonly variant = input<ChipVariant>('primary');

  /** Style variant */
  readonly chipStyle = input<ChipStyle>('soft');

  /** Size */
  readonly size = input<ChipSize>('md');

  /** Image URL for avatar chip */
  readonly image = input('');

  /** Image alt text */
  readonly imageAlt = input('');

  /** Whether the chip can be removed */
  readonly removable = input(false, { transform: booleanAttribute });

  /** Whether the chip is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Additional classes */
  readonly classOverride = input('');

  /** Remove event */
  readonly onRemove = output<void>();

  protected chipClasses = computed(() => {
    const variantClasses = CHIP_VARIANTS[this.variant()][this.chipStyle()];
    const sizeClasses = CHIP_SIZES[this.size()].chip;

    return this.twClass.merge(
      'inline-flex items-center rounded-full font-medium transition-colors',
      variantClasses,
      sizeClasses,
      this.disabled() ? 'opacity-50 cursor-not-allowed' : '',
      this.classOverride()
    );
  });

  protected imageClasses = computed(() => {
    const sizeClasses = CHIP_SIZES[this.size()].image;
    return this.twClass.merge('rounded-full object-cover -ml-1', sizeClasses);
  });

  protected removeButtonClasses = computed(() => {
    return this.twClass.merge(
      'ml-1 -mr-1 p-0.5 rounded-full transition-colors',
      'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1'
    );
  });

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.onRemove.emit();
    }
  }
}

/**
 * Chip input for creating/selecting multiple chips
 */
@Component({
  selector: 'tw-chips',
  standalone: true,
  imports: [CommonModule, TwChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      @for (value of values(); track $index) {
        <tw-chip
          [label]="getDisplayValue(value)"
          [variant]="variant()"
          [chipStyle]="chipStyle()"
          [size]="size()"
          [removable]="!disabled()"
          (onRemove)="removeValue($index)"
        >
        </tw-chip>
      }
      @if (allowAdd() && !disabled()) {
        <input
          type="text"
          [class]="inputClasses()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          (keydown.enter)="onAddChip($event)"
          (keydown.backspace)="onBackspace($event)"
          #inputRef
        />
      }
    </div>
  `,
})
export class TwChipsComponent {
  private readonly twClass = inject(TwClassService);

  readonly values = input<any[]>([]);
  readonly variant = input<ChipVariant>('primary');
  readonly chipStyle = input<ChipStyle>('soft');
  readonly size = input<ChipSize>('md');
  readonly placeholder = input('Add...');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly allowAdd = input(true, { transform: booleanAttribute });
  readonly field = input('');
  readonly classOverride = input('');

  readonly valuesChange = output<any[]>();
  readonly onAdd = output<any>();
  readonly onRemove = output<{ value: any; index: number }>();

  protected containerClasses = computed(() => {
    return this.twClass.merge(
      'flex flex-wrap items-center gap-2 p-2 min-h-10',
      'border border-slate-300 dark:border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
      this.disabled() ? 'bg-slate-50 dark:bg-slate-900 opacity-50' : 'bg-white dark:bg-slate-800',
      this.classOverride()
    );
  });

  protected inputClasses = computed(() => {
    return 'flex-1 min-w-20 px-2 py-1 text-sm outline-none bg-transparent';
  });

  getDisplayValue(value: any): string {
    if (typeof value === 'object' && this.field()) {
      return value[this.field()];
    }
    return String(value);
  }

  removeValue(index: number): void {
    const currentValues = this.values();
    const removed = currentValues[index];
    const newValues = [...currentValues];
    newValues.splice(index, 1);
    this.valuesChange.emit(newValues);
    this.onRemove.emit({ value: removed, index });
  }

  onAddChip(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      const newValues = [...this.values(), value];
      this.valuesChange.emit(newValues);
      this.onAdd.emit(value);
      input.value = '';
    }
  }

  onBackspace(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '' && this.values().length > 0) {
      this.removeValue(this.values().length - 1);
    }
  }
}
