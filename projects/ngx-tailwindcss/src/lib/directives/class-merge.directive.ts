import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Renderer2,
  inject,
} from '@angular/core';
import { TwClassService } from '../core/tw-class.service';

/**
 * Applies Tailwind classes with intelligent conflict resolution
 * Merges multiple class inputs, with later classes overriding conflicting earlier ones
 *
 * @example
 * ```html
 * <!-- Base classes with override -->
 * <div [twClass]="'px-4 py-2'" [twClassMerge]="'px-8'">
 *   Will have px-8 py-2
 * </div>
 *
 * <!-- Conditional classes -->
 * <button
 *   [twClass]="'bg-blue-500 text-white'"
 *   [twClassIf]="{ 'bg-red-500': hasError, 'opacity-50 cursor-not-allowed': isDisabled }">
 *   Button
 * </button>
 * ```
 */
@Directive({
  selector: '[twClass]',
  standalone: true,
})
export class TwClassDirective implements OnChanges {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private twClass = inject(TwClassService);

  /** Base classes to apply */
  @Input('twClass') baseClasses = '';

  /** Additional classes to merge (will override conflicting base classes) */
  @Input() twClassMerge = '';

  /** Conditional classes (object with class strings as keys and booleans as values) */
  @Input() twClassIf: Record<string, boolean | undefined> = {};

  private appliedClasses: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseClasses'] || changes['twClassMerge'] || changes['twClassIf']) {
      this.updateClasses();
    }
  }

  private updateClasses(): void {
    // Remove previously applied classes
    this.appliedClasses.forEach(cls => {
      this.renderer.removeClass(this.el.nativeElement, cls);
    });

    // Get conditional classes
    const conditionalClasses = Object.entries(this.twClassIf)
      .filter(([, condition]) => condition)
      .map(([classes]) => classes)
      .join(' ');

    // Merge all classes
    const mergedClasses = this.twClass.merge(
      this.baseClasses,
      this.twClassMerge,
      conditionalClasses
    );

    // Apply new classes
    this.appliedClasses = mergedClasses.split(' ').filter(Boolean);
    this.appliedClasses.forEach(cls => {
      this.renderer.addClass(this.el.nativeElement, cls);
    });
  }
}

/**
 * Simple variant class directive for quick variant switching
 *
 * @example
 * ```html
 * <button [twVariant]="buttonVariant">Click me</button>
 * ```
 */
@Directive({
  selector: '[twVariant]',
  standalone: true,
})
export class TwVariantDirective implements OnChanges {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private twClassService = inject(TwClassService);

  /** The variant name (primary, secondary, success, warning, danger, info, neutral) */
  @Input('twVariant') variant = '';

  private appliedClasses: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variant']) {
      this.updateVariant();
    }
  }

  private updateVariant(): void {
    // Remove previously applied classes
    this.appliedClasses.forEach(cls => {
      this.renderer.removeClass(this.el.nativeElement, cls);
    });

    // Get variant classes
    const variantClasses = this.twClassService.getVariantClasses(this.variant);

    // Apply new classes
    this.appliedClasses = variantClasses.split(' ').filter(Boolean);
    this.appliedClasses.forEach(cls => {
      this.renderer.addClass(this.el.nativeElement, cls);
    });
  }
}

