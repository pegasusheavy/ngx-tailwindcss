import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  booleanAttribute,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type AlertStyle = 'solid' | 'soft' | 'outlined' | 'accent';

const ALERT_BASE_CLASSES = `
  relative flex gap-3
  p-4 rounded-lg
  text-sm
`;

const ALERT_SOLID_VARIANTS: Record<AlertVariant, string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  danger: 'bg-rose-600 text-white',
  neutral: 'bg-slate-700 text-white',
};

const ALERT_SOFT_VARIANTS: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border border-rose-200',
  neutral: 'bg-slate-50 text-slate-800 border border-slate-200',
};

const ALERT_OUTLINED_VARIANTS: Record<AlertVariant, string> = {
  info: 'bg-transparent text-blue-700 border-2 border-blue-500',
  success: 'bg-transparent text-emerald-700 border-2 border-emerald-500',
  warning: 'bg-transparent text-amber-700 border-2 border-amber-500',
  danger: 'bg-transparent text-rose-700 border-2 border-rose-500',
  neutral: 'bg-transparent text-slate-700 border-2 border-slate-400',
};

const ALERT_ACCENT_VARIANTS: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-800 border-l-4 border-blue-500 rounded-l-none',
  success: 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 rounded-l-none',
  warning: 'bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-l-none',
  danger: 'bg-rose-50 text-rose-800 border-l-4 border-rose-500 rounded-l-none',
  neutral: 'bg-slate-50 text-slate-800 border-l-4 border-slate-500 rounded-l-none',
};

const ICON_COLORS: Record<AlertVariant, Record<AlertStyle, string>> = {
  info: {
    solid: 'text-white',
    soft: 'text-blue-600',
    outlined: 'text-blue-600',
    accent: 'text-blue-600',
  },
  success: {
    solid: 'text-white',
    soft: 'text-emerald-600',
    outlined: 'text-emerald-600',
    accent: 'text-emerald-600',
  },
  warning: {
    solid: 'text-white',
    soft: 'text-amber-600',
    outlined: 'text-amber-600',
    accent: 'text-amber-600',
  },
  danger: {
    solid: 'text-white',
    soft: 'text-rose-600',
    outlined: 'text-rose-600',
    accent: 'text-rose-600',
  },
  neutral: {
    solid: 'text-white',
    soft: 'text-slate-600',
    outlined: 'text-slate-600',
    accent: 'text-slate-600',
  },
};

/**
 * Alert component for displaying important messages
 *
 * @example
 * ```html
 * <tw-alert variant="info">
 *   This is an informational message.
 * </tw-alert>
 *
 * <tw-alert variant="success" alertStyle="soft" [dismissible]="true" (dismiss)="onDismiss()">
 *   <tw-alert-title>Success!</tw-alert-title>
 *   Your changes have been saved successfully.
 * </tw-alert>
 *
 * <tw-alert variant="danger" alertStyle="accent" [icon]="customIcon">
 *   An error occurred while processing your request.
 * </tw-alert>
 * ```
 */
@Component({
  selector: 'tw-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  host: {
    '[class]': 'computedClasses()',
    'role': 'alert',
    '[attr.aria-live]': 'ariaLive',
  },
})
export class TwAlertComponent {
  private twClass = inject(TwClassService);

  /** Color variant */
  @Input() variant: AlertVariant = 'info';

  /** Style variant */
  @Input() alertStyle: AlertStyle = 'soft';

  /** Whether the alert can be dismissed */
  @Input({ transform: booleanAttribute }) dismissible = false;

  /** Whether to show the icon */
  @Input({ transform: booleanAttribute }) showIcon = true;

  /** Whether a custom icon is provided */
  @Input({ transform: booleanAttribute }) hasCustomIcon = false;

  /** ARIA live region setting */
  @Input() ariaLive: 'polite' | 'assertive' | 'off' = 'polite';

  /** Additional classes */
  @Input() classOverride = '';

  /** Dismiss event */
  @Output() dismiss = new EventEmitter<void>();

  protected dismissed = signal(false);

  protected computedClasses = computed(() => {
    if (this.dismissed()) return 'hidden';

    const styleVariants: Record<AlertStyle, Record<AlertVariant, string>> = {
      solid: ALERT_SOLID_VARIANTS,
      soft: ALERT_SOFT_VARIANTS,
      outlined: ALERT_OUTLINED_VARIANTS,
      accent: ALERT_ACCENT_VARIANTS,
    };

    return this.twClass.merge(
      ALERT_BASE_CLASSES,
      styleVariants[this.alertStyle][this.variant],
      this.classOverride
    );
  });

  protected iconClasses = computed(() => {
    return this.twClass.merge(
      'flex-shrink-0',
      ICON_COLORS[this.variant][this.alertStyle]
    );
  });

  protected dismissButtonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md p-1 -m-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const hoverClasses: Record<AlertStyle, string> = {
      solid: 'hover:bg-white/20 focus-visible:ring-white',
      soft: 'hover:bg-black/5 focus-visible:ring-current',
      outlined: 'hover:bg-black/5 focus-visible:ring-current',
      accent: 'hover:bg-black/5 focus-visible:ring-current',
    };

    return this.twClass.merge(baseClasses, hoverClasses[this.alertStyle]);
  });

  protected onDismiss(): void {
    this.dismissed.set(true);
    this.dismiss.emit();
  }

  /** Programmatically dismiss the alert */
  dismissAlert(): void {
    this.onDismiss();
  }

  /** Programmatically show the alert again */
  show(): void {
    this.dismissed.set(false);
  }
}

/**
 * Alert title component
 */
@Component({
  selector: 'tw-alert-title',
  standalone: true,
  host: {
    'class': 'block font-semibold mb-1',
  },
  template: `<ng-content></ng-content>`,
})
export class TwAlertTitleComponent {}

/**
 * Alert description component
 */
@Component({
  selector: 'tw-alert-description',
  standalone: true,
  host: {
    'class': 'block text-sm opacity-90',
  },
  template: `<ng-content></ng-content>`,
})
export class TwAlertDescriptionComponent {}

