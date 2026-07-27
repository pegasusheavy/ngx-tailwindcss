import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
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
  outlined:
    'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
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
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardHeaderDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  protected readonly hostClass = computed(() =>
    this.twClass.merge(
      'block px-6 py-4 border-b border-slate-100 dark:border-slate-700',
      this.class()
    )
  );
}

/**
 * Card title directive
 */
@Directive({
  selector: 'tw-card-title, [twCardTitle]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardTitleDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  protected readonly hostClass = computed(() =>
    this.twClass.merge('block text-lg font-semibold text-slate-900 dark:text-white', this.class())
  );
}

/**
 * Card subtitle directive
 */
@Directive({
  selector: 'tw-card-subtitle, [twCardSubtitle]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardSubtitleDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  protected readonly hostClass = computed(() =>
    this.twClass.merge('block text-sm text-slate-500 dark:text-slate-400 mt-1', this.class())
  );
}

/**
 * Card body/content directive
 */
@Directive({
  selector: 'tw-card-body, [twCardBody]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardBodyDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  protected readonly hostClass = computed(() => this.twClass.merge('block p-6', this.class()));
}

/**
 * Card footer directive
 */
@Directive({
  selector: 'tw-card-footer, [twCardFooter]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardFooterDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  protected readonly hostClass = computed(() =>
    this.twClass.merge(
      'block px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 rounded-b-xl',
      this.class()
    )
  );
}

const CARD_MEDIA_POSITIONS: Record<string, string> = {
  top: 'block -mx-0 -mt-0 mb-0 rounded-t-xl overflow-hidden',
  bottom: 'block -mx-0 -mb-0 mt-0 rounded-b-xl overflow-hidden',
  full: 'block absolute inset-0 rounded-xl overflow-hidden',
};

/**
 * Card media/image container directive
 */
@Directive({
  selector: 'tw-card-media, [twCardMedia]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
  },
})
export class TwCardMediaDirective {
  private readonly twClass = inject(TwClassService);

  readonly class = input('');

  /** Position of the media (top for header image, full for background) */
  readonly position = input<'top' | 'bottom' | 'full'>('top');

  protected readonly hostClass = computed(() =>
    this.twClass.merge(
      CARD_MEDIA_POSITIONS[this.position()],
      '[&>img]:w-full [&>img]:h-full [&>img]:object-cover',
      this.class()
    )
  );
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
    '[attr.tabindex]': 'clickable() ? 0 : null',
    '[attr.role]': 'clickable() ? "button" : "article"',
    '(keydown)': 'onKeydown($event)',
  },
  templateUrl: './card.component.html',
})
export class TwCardComponent {
  private readonly twClass = inject(TwClassService);
  private readonly elementRef = inject(ElementRef);

  /** Visual variant of the card */
  readonly variant = input<CardVariant>('elevated');

  /** Whether the card should have hover effects */
  readonly hoverable = input(false, { transform: booleanAttribute });

  /** Whether the card is clickable (adds cursor and focus styles) */
  readonly clickable = input(false, { transform: booleanAttribute });

  /** Whether to add padding to the card (use false when using card-body) */
  readonly padded = input(false, { transform: booleanAttribute });

  /** Additional classes to merge with base styles */
  readonly classOverride = input('');

  /** Complete class override (replaces all default classes) */
  readonly classReplace = input('');

  protected computedClasses = computed(() => {
    if (this.classReplace()) {
      return this.classReplace();
    }

    const baseClasses = CARD_BASE_CLASSES;
    const variantClasses = CARD_VARIANTS[this.variant()];

    const conditionalClasses: string[] = [];

    if (this.hoverable()) {
      conditionalClasses.push('hover:-translate-y-0.5');
    }

    if (this.clickable()) {
      conditionalClasses.push(
        'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'
      );
    }

    if (this.padded()) {
      conditionalClasses.push('p-6');
    }

    return this.twClass.merge(
      baseClasses,
      variantClasses,
      conditionalClasses.join(' '),
      this.classOverride()
    );
  });

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    (this.elementRef.nativeElement as HTMLElement).click();
  }
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

  readonly variant = input<CardVariant>('elevated');
  readonly classOverride = input('');

  protected computedClasses = computed(() => {
    return this.twClass.merge(
      'flex rounded-xl overflow-hidden',
      CARD_VARIANTS[this.variant()],
      this.classOverride()
    );
  });
}
