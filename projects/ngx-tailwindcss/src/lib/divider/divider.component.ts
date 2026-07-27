import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerLabelPosition = 'left' | 'center' | 'right';

const DIVIDER_VARIANT_CLASSES: Record<DividerVariant, string> = {
  solid: 'divider-solid',
  dashed: 'divider-dashed',
  dotted: 'divider-dotted',
};

const DIVIDER_SPACING_Y_CLASSES: Record<string, string> = {
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-8',
};

const DIVIDER_SPACING_X_CLASSES: Record<string, string> = {
  sm: 'mx-2',
  md: 'mx-4',
  lg: 'mx-8',
};

@Component({
  selector: 'tw-divider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './divider.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host(.vertical) {
        display: inline-flex;
        align-self: stretch;
        height: auto;
      }
      .divider-solid {
        border-style: solid !important;
      }
      .divider-dashed {
        border-style: dashed !important;
      }
      .divider-dotted {
        border-style: dotted !important;
      }
      .vertical-line {
        width: 0;
        align-self: stretch;
        min-height: 1em;
      }
    `,
  ],
})
export class TwDividerComponent {
  @Input() set orientation(value: DividerOrientation) {
    this._orientation.set(value);
  }
  @Input() set variant(value: DividerVariant) {
    this._variant.set(value);
  }
  // Alias for variant
  @Input() set dividerStyle(value: DividerVariant) {
    this._variant.set(value);
  }
  @Input() set labelPosition(value: DividerLabelPosition) {
    this._labelPosition.set(value);
  }
  @Input() set color(value: string) {
    this._color.set(value);
  }
  @Input() set spacing(value: 'sm' | 'md' | 'lg') {
    this._spacing.set(value);
  }
  @Input() set label(value: string) {
    this._label.set(value);
  }

  protected _orientation = signal<DividerOrientation>('horizontal');
  protected _variant = signal<DividerVariant>('solid');
  protected _labelPosition = signal<DividerLabelPosition>('center');
  protected _color = signal('');
  protected _spacing = signal<'sm' | 'md' | 'lg'>('md');
  protected _label = signal('');

  @HostBinding('class.vertical')
  get isVertical(): boolean {
    return this._orientation() === 'vertical';
  }

  protected orientationValue = computed(() => this._orientation());
  protected labelValue = computed(() => this._label());

  protected hrClasses = computed(() => {
    const variant = this._variant();
    const color = this._color() || 'border-slate-300';
    const spacing = this._spacing();

    return [
      'border-t-2 border-0',
      DIVIDER_VARIANT_CLASSES[variant],
      color,
      DIVIDER_SPACING_Y_CLASSES[spacing],
    ].join(' ');
  });

  protected containerClasses = computed(() => {
    const spacing = this._spacing();

    return ['flex items-center w-full', DIVIDER_SPACING_Y_CLASSES[spacing]].join(' ');
  });

  protected lineClasses = computed(() => {
    const variant = this._variant();
    const color = this._color() || 'border-slate-300';

    return ['border-t-2 border-0', DIVIDER_VARIANT_CLASSES[variant], color].join(' ');
  });

  protected firstLineClasses = computed(() => {
    const labelPosition = this._labelPosition();
    const baseClasses = this.lineClasses();

    if (labelPosition === 'left') {
      return `${baseClasses} w-8 shrink-0`;
    }
    return `${baseClasses} flex-1`;
  });

  protected lastLineClasses = computed(() => {
    const labelPosition = this._labelPosition();
    const baseClasses = this.lineClasses();

    if (labelPosition === 'right') {
      return `${baseClasses} w-8 shrink-0`;
    }
    return `${baseClasses} flex-1`;
  });

  protected labelClasses = computed(
    () => 'px-4 text-sm text-slate-500 whitespace-nowrap select-none'
  );

  protected verticalClasses = computed(() => {
    const variant = this._variant();
    const color = this._color() || 'border-slate-300';
    const spacing = this._spacing();

    return [
      'vertical-line border-l-2 border-0',
      DIVIDER_VARIANT_CLASSES[variant],
      color,
      DIVIDER_SPACING_X_CLASSES[spacing],
    ].join(' ');
  });
}
