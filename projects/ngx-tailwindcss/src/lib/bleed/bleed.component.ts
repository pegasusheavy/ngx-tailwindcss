import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type BleedDirection = 'horizontal' | 'left' | 'right' | 'all';
export type BleedAmount = 'sm' | 'md' | 'lg' | 'xl' | 'full';

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
  template: `
    <div [class]="bleedClasses()" [style]="bleedStyles()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwBleedComponent {
  /** Direction of the bleed */
  @Input() direction: BleedDirection = 'horizontal';

  /** Amount of bleed */
  @Input() amount: BleedAmount = 'md';

  /** Custom bleed amount (e.g., '2rem', '32px') */
  @Input() customAmount?: string;

  /** Whether to preserve the same visual spacing inside */
  @Input() preservePadding = false;

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected bleedClasses(): string {
    return this.twClass.merge('relative', this.class);
  }

  protected bleedStyles(): Record<string, string> {
    const amountMap: Record<BleedAmount, string> = {
      sm: '1rem',
      md: '2rem',
      lg: '4rem',
      xl: '6rem',
      full: '50vw',
    };

    const bleedValue = this.customAmount || amountMap[this.amount];
    const isFull = this.amount === 'full';

    const styles: Record<string, string> = {};

    if (this.direction === 'horizontal' || this.direction === 'all') {
      if (isFull) {
        styles['marginLeft'] = 'calc(-50vw + 50%)';
        styles['marginRight'] = 'calc(-50vw + 50%)';
        styles['width'] = '100vw';
      } else {
        styles['marginLeft'] = `-${bleedValue}`;
        styles['marginRight'] = `-${bleedValue}`;
      }

      if (this.preservePadding && !isFull) {
        styles['paddingLeft'] = bleedValue;
        styles['paddingRight'] = bleedValue;
      }
    }

    if (this.direction === 'left') {
      if (isFull) {
        styles['marginLeft'] = 'calc(-50vw + 50%)';
      } else {
        styles['marginLeft'] = `-${bleedValue}`;
      }

      if (this.preservePadding && !isFull) {
        styles['paddingLeft'] = bleedValue;
      }
    }

    if (this.direction === 'right') {
      if (isFull) {
        styles['marginRight'] = 'calc(-50vw + 50%)';
      } else {
        styles['marginRight'] = `-${bleedValue}`;
      }

      if (this.preservePadding && !isFull) {
        styles['paddingRight'] = bleedValue;
      }
    }

    if (this.direction === 'all') {
      if (!isFull) {
        styles['marginTop'] = `-${bleedValue}`;
        styles['marginBottom'] = `-${bleedValue}`;
      }

      if (this.preservePadding && !isFull) {
        styles['paddingTop'] = bleedValue;
        styles['paddingBottom'] = bleedValue;
      }
    }

    return styles;
  }
}

