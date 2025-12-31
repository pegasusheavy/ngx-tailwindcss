import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'prose';

const CONTAINER_SIZES: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
  prose: 'max-w-prose',
};

/**
 * Container component for creating centered, max-width layouts.
 *
 * @example
 * ```html
 * <tw-container size="lg" [centered]="true">
 *   <h1>Page Content</h1>
 * </tw-container>
 * ```
 */
@Component({
  selector: 'tw-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class TwContainerComponent {
  /** Maximum width of the container */
  @Input() size: ContainerSize = 'xl';

  /** Whether to center the container horizontally */
  @Input() centered = true;

  /** Horizontal padding */
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';

  /** Additional CSS classes */
  @Input() class = '';

  constructor(private readonly twClass: TwClassService) {}

  protected containerClasses(): string {
    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
    };

    return this.twClass.merge(
      'w-full',
      CONTAINER_SIZES[this.size],
      this.centered ? 'mx-auto' : '',
      paddingClasses[this.padding],
      this.class
    );
  }
}
