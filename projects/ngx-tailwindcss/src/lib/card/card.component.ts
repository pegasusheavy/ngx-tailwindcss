import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

const CARD_BASE_CLASSES = `
  block
  rounded-xl
  transition-all duration-200
`;

/**
 * Card variant classes
 * IMPORTANT: Keep these as static strings for Tailwind JIT detection
 * The dark: prefix classes must be statically analyzable
 */
const CARD_VARIANTS: Record<CardVariant, string> = {
  // elevated: bg-white dark:bg-slate-800 shadow-md hover:shadow-lg dark:shadow-slate-900/50
  elevated: 'bg-white dark:bg-slate-800 shadow-md hover:shadow-lg dark:shadow-slate-900/50',
  // outlined: bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600
  outlined: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
  // filled: bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600
  filled: 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600',
  // ghost: bg-transparent
  ghost: 'bg-transparent',
};

/**
 * Card header directive for semantic structure
 */
@Directive({
  selector: 'tw-card-header, [twCardHeader]',
  standalone: true,
})
export class TwCardHeaderDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block px-6 py-4 border-b border-slate-100 dark:border-slate-700', this.class);
  }
}

/**
 * Card title directive
 */
@Directive({
  selector: 'tw-card-title, [twCardTitle]',
  standalone: true,
})
export class TwCardTitleDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block text-lg font-semibold text-slate-900 dark:text-white', this.class);
  }
}

/**
 * Card subtitle directive
 */
@Directive({
  selector: 'tw-card-subtitle, [twCardSubtitle]',
  standalone: true,
})
export class TwCardSubtitleDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block text-sm text-slate-500 dark:text-slate-400 mt-1', this.class);
  }
}

/**
 * Card body/content directive
 */
@Directive({
  selector: 'tw-card-body, [twCardBody]',
  standalone: true,
})
export class TwCardBodyDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge('block p-6', this.class);
  }
}

/**
 * Card footer directive
 */
@Directive({
  selector: 'tw-card-footer, [twCardFooter]',
  standalone: true,
})
export class TwCardFooterDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  @HostBinding('class')
  get hostClass(): string {
    return this.twClass.merge(
      'block px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 rounded-b-xl',
      this.class
    );
  }
}

/**
 * Card media/image container directive
 */
@Directive({
  selector: 'tw-card-media, [twCardMedia]',
  standalone: true,
})
export class TwCardMediaDirective {
  private readonly twClass = inject(TwClassService);

  @Input() class = '';

  /** Position of the media (top for header image, full for background) */
  @Input() position: 'top' | 'bottom' | 'full' = 'top';

  @HostBinding('class')
  get hostClass(): string {
    const positionClasses: Record<string, string> = {
      top: 'block -mx-0 -mt-0 mb-0 rounded-t-xl overflow-hidden',
      bottom: 'block -mx-0 -mb-0 mt-0 rounded-b-xl overflow-hidden',
      full: 'block absolute inset-0 rounded-xl overflow-hidden',
    };

    return this.twClass.merge(
      positionClasses[this.position],
      '[&>img]:w-full [&>img]:h-full [&>img]:object-cover',
      this.class
    );
  }
}

/**
 * Highly customizable card component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-card>
 *   <tw-card-header>
 *     <tw-card-title>Card Title</tw-card-title>
 *     <tw-card-subtitle>Subtitle text</tw-card-subtitle>
 *   </tw-card-header>
 *   <tw-card-body>
 *     Card content goes here
 *   </tw-card-body>
 *   <tw-card-footer>
 *     <button tw-button variant="primary">Action</button>
 *   </tw-card-footer>
 * </tw-card>
 *
 * <tw-card variant="outlined" [hoverable]="true" [clickable]="true" (click)="handleClick()">
 *   <tw-card-media position="top">
 *     <img src="image.jpg" alt="Card image">
 *   </tw-card-media>
 *   <tw-card-body>
 *     Content with image
 *   </tw-card-body>
 * </tw-card>
 * ```
 */
@Component({
  selector: 'tw-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClasses()',
    '[attr.tabindex]': 'clickable ? 0 : null',
    role: 'article',
  },
  template: `<ng-content></ng-content>`,
})
export class TwCardComponent {
  private readonly twClass = inject(TwClassService);

  /** Visual variant of the card */
  @Input() variant: CardVariant = 'elevated';

  /** Whether the card should have hover effects */
  @Input({ transform: booleanAttribute }) hoverable = false;

  /** Whether the card is clickable (adds cursor and focus styles) */
  @Input({ transform: booleanAttribute }) clickable = false;

  /** Whether to add padding to the card (use false when using card-body) */
  @Input({ transform: booleanAttribute }) padded = false;

  /** Additional classes to merge with base styles */
  @Input() classOverride = '';

  /** Complete class override (replaces all default classes) */
  @Input() classReplace = '';

  protected computedClasses = computed(() => {
    if (this.classReplace) {
      return this.classReplace;
    }

    const baseClasses = CARD_BASE_CLASSES;
    const variantClasses = CARD_VARIANTS[this.variant];

    const conditionalClasses: string[] = [];

    if (this.hoverable) {
      conditionalClasses.push('hover:-translate-y-0.5');
    }

    if (this.clickable) {
      conditionalClasses.push(
        'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'
      );
    }

    if (this.padded) {
      conditionalClasses.push('p-6');
    }

    return this.twClass.merge(
      baseClasses,
      variantClasses,
      conditionalClasses.join(' '),
      this.classOverride
    );
  });
}

/**
 * Horizontal card layout component
 */
@Component({
  selector: 'tw-card-horizontal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-horizontal.component.html',
  host: {
    '[class]': 'computedClasses()',
    role: 'article',
  },
})
export class TwCardHorizontalComponent {
  private readonly twClass = inject(TwClassService);

  @Input() variant: CardVariant = 'elevated';
  @Input() classOverride = '';

  protected computedClasses = computed(() => {
    return this.twClass.merge(
      'flex rounded-xl overflow-hidden',
      CARD_VARIANTS[this.variant],
      this.classOverride
    );
  });
}
