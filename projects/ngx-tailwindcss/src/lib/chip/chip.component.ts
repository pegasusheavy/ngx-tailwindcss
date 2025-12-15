import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  booleanAttribute,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ChipVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ChipStyle = 'solid' | 'soft' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';

const CHIP_VARIANTS: Record<ChipVariant, Record<ChipStyle, string>> = {
  primary: {
    solid: 'bg-blue-600 text-white',
    soft: 'bg-blue-100 text-blue-700',
    outline: 'border border-blue-600 text-blue-600',
  },
  secondary: {
    solid: 'bg-slate-600 text-white',
    soft: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-600 text-slate-600',
  },
  success: {
    solid: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-100 text-emerald-700',
    outline: 'border border-emerald-600 text-emerald-600',
  },
  warning: {
    solid: 'bg-amber-500 text-white',
    soft: 'bg-amber-100 text-amber-700',
    outline: 'border border-amber-500 text-amber-600',
  },
  danger: {
    solid: 'bg-rose-600 text-white',
    soft: 'bg-rose-100 text-rose-700',
    outline: 'border border-rose-600 text-rose-600',
  },
  info: {
    solid: 'bg-cyan-600 text-white',
    soft: 'bg-cyan-100 text-cyan-700',
    outline: 'border border-cyan-600 text-cyan-600',
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
  private twClass = inject(TwClassService);

  /** Chip label text */
  @Input() label = '';

  /** Visual variant */
  @Input() variant: ChipVariant = 'primary';

  /** Style variant */
  @Input() chipStyle: ChipStyle = 'soft';

  /** Size */
  @Input() size: ChipSize = 'md';

  /** Image URL for avatar chip */
  @Input() image = '';

  /** Image alt text */
  @Input() imageAlt = '';

  /** Whether the chip can be removed */
  @Input({ transform: booleanAttribute }) removable = false;

  /** Whether the chip is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Additional classes */
  @Input() classOverride = '';

  /** Remove event */
  @Output() onRemove = new EventEmitter<void>();

  protected chipClasses = computed(() => {
    const variantClasses = CHIP_VARIANTS[this.variant][this.chipStyle];
    const sizeClasses = CHIP_SIZES[this.size].chip;

    return this.twClass.merge(
      'inline-flex items-center rounded-full font-medium transition-colors',
      variantClasses,
      sizeClasses,
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      this.classOverride
    );
  });

  protected imageClasses = computed(() => {
    const sizeClasses = CHIP_SIZES[this.size].image;
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
    if (!this.disabled) {
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
      @for (value of values; track $index) {
        <tw-chip
          [label]="getDisplayValue(value)"
          [variant]="variant"
          [chipStyle]="chipStyle"
          [size]="size"
          [removable]="!disabled"
          (onRemove)="removeValue($index)">
        </tw-chip>
      }
      @if (allowAdd && !disabled) {
        <input
          type="text"
          [class]="inputClasses()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          (keydown.enter)="onAddChip($event)"
          (keydown.backspace)="onBackspace($event)"
          #inputRef />
      }
    </div>
  `,
})
export class TwChipsComponent {
  private twClass = inject(TwClassService);

  @Input() values: any[] = [];
  @Input() variant: ChipVariant = 'primary';
  @Input() chipStyle: ChipStyle = 'soft';
  @Input() size: ChipSize = 'md';
  @Input() placeholder = 'Add...';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) allowAdd = true;
  @Input() field = '';
  @Input() classOverride = '';

  @Output() valuesChange = new EventEmitter<any[]>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<{ value: any; index: number }>();

  protected containerClasses = computed(() => {
    return this.twClass.merge(
      'flex flex-wrap items-center gap-2 p-2 min-h-10',
      'border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
      this.disabled ? 'bg-slate-50 opacity-50' : 'bg-white',
      this.classOverride
    );
  });

  protected inputClasses = computed(() => {
    return 'flex-1 min-w-20 px-2 py-1 text-sm outline-none bg-transparent';
  });

  getDisplayValue(value: any): string {
    if (typeof value === 'object' && this.field) {
      return value[this.field];
    }
    return String(value);
  }

  removeValue(index: number): void {
    const removed = this.values[index];
    const newValues = [...this.values];
    newValues.splice(index, 1);
    this.values = newValues;
    this.valuesChange.emit(this.values);
    this.onRemove.emit({ value: removed, index });
  }

  onAddChip(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      this.values = [...this.values, value];
      this.valuesChange.emit(this.values);
      this.onAdd.emit(value);
      input.value = '';
    }
  }

  onBackspace(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '' && this.values.length > 0) {
      this.removeValue(this.values.length - 1);
    }
  }
}

