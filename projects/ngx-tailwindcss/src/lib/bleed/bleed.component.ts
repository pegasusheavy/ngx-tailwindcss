import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type BleedDirection = 'horizontal' | 'left' | 'right' | 'all';
export type BleedAmount = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const AMOUNT_MAP: Record<BleedAmount, string> = {
  sm: '1rem',
  md: '2rem',
  lg: '4rem',
  xl: '6rem',
  full: '50vw',
};

/**
 * Bleed component for breaking out of container constraints.
 * Useful for full-width images or backgrounds within constrained layouts.
 *
 * @example
 * ```html
 * <tw-container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content within container...</p>
 *
 *   <!-- Full-width image that bleeds out of container -->
 *   <tw-bleed direction="horizontal" amount="full">
 *     <img src="hero.jpg" class="w-full" />
 *   </tw-bleed>
 *
 *   <p>More content within container...</p>
 * </tw-container>
 *
 * <!-- Bleed with custom amount -->
 * <tw-bleed direction="horizontal" amount="lg">
 *   <div class="bg-slate-100 p-8">
 *     Full-width background section
 *   </div>
 * </tw-bleed>
 * ```
 */
@Component({
  selector: 'tw-bleed',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bleed.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwBleedComponent {
  private readonly twClass = inject(TwClassService);

  /** Direction of the bleed */
  readonly direction = input<BleedDirection>('horizontal');

  /** Amount of bleed */
  readonly amount = input<BleedAmount>('md');

  /** Custom bleed amount (e.g., '2rem', '32px'); takes precedence over `amount` */
  readonly customAmount = input<string | undefined>(undefined);

  /** Whether to preserve the same visual spacing inside */
  readonly preservePadding = input(false, { transform: booleanAttribute });

  /** Additional CSS classes */
  readonly class = input('');

  protected readonly bleedClasses = computed(() => {
    return this.twClass.merge('relative', this.class());
  });

  protected readonly bleedStyles = computed<Record<string, string>>(() => {
    const direction = this.direction();
    const customAmount = this.customAmount();
    const preservePadding = this.preservePadding();

    // A custom amount takes precedence, even over amount="full"
    const isFull = this.amount() === 'full' && !customAmount;
    const bleedValue = customAmount || AMOUNT_MAP[this.amount()];
    const fullMargin = 'calc(-50vw + 50%)';
    const fullPadding = 'calc(50vw - 50%)';

    const styles: Record<string, string> = {};

    if (direction === 'horizontal' || direction === 'all') {
      if (isFull) {
        styles['marginLeft'] = fullMargin;
        styles['marginRight'] = fullMargin;
        styles['width'] = '100vw';

        if (preservePadding) {
          styles['paddingLeft'] = fullPadding;
          styles['paddingRight'] = fullPadding;
        }
      } else {
        styles['marginLeft'] = `-${bleedValue}`;
        styles['marginRight'] = `-${bleedValue}`;

        if (preservePadding) {
          styles['paddingLeft'] = bleedValue;
          styles['paddingRight'] = bleedValue;
        }
      }
    }

    if (direction === 'left') {
      if (isFull) {
        styles['marginLeft'] = fullMargin;

        if (preservePadding) {
          styles['paddingLeft'] = fullPadding;
        }
      } else {
        styles['marginLeft'] = `-${bleedValue}`;

        if (preservePadding) {
          styles['paddingLeft'] = bleedValue;
        }
      }
    }

    if (direction === 'right') {
      if (isFull) {
        styles['marginRight'] = fullMargin;

        if (preservePadding) {
          styles['paddingRight'] = fullPadding;
        }
      } else {
        styles['marginRight'] = `-${bleedValue}`;

        if (preservePadding) {
          styles['paddingRight'] = bleedValue;
        }
      }
    }

    if (direction === 'all' && !isFull) {
      styles['marginTop'] = `-${bleedValue}`;
      styles['marginBottom'] = `-${bleedValue}`;

      if (preservePadding) {
        styles['paddingTop'] = bleedValue;
        styles['paddingBottom'] = bleedValue;
      }
    }

    return styles;
  });
}
