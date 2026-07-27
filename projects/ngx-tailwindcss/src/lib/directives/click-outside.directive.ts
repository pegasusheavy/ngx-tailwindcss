import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Emits an event when a click occurs outside the host element
 * Useful for closing dropdowns, modals, and other overlays
 *
 * @example
 * ```html
 * <div (twClickOutside)="closeDropdown()">
 *   Dropdown content
 * </div>
 *
 * <div
 *   (twClickOutside)="closeMenu()"
 *   [clickOutsideEnabled]="isMenuOpen"
 *   [clickOutsideExclude]="['.menu-trigger']">
 *   Menu content
 * </div>
 * ```
 */
@Directive({
  selector: '[twClickOutside]',
  standalone: true,
})
export class TwClickOutsideDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  /** Event emitted when a click occurs outside the element */
  @Output('twClickOutside') clickOutside = new EventEmitter<MouseEvent>();

  /** Whether the click outside detection is enabled */
  @Input({ transform: booleanAttribute }) clickOutsideEnabled = true;

  /** Array of selectors to exclude from triggering the click outside event */
  @Input() clickOutsideExclude: string[] = [];

  /** Delay before starting to listen for clicks (prevents immediate triggering) */
  @Input() clickOutsideDelay = 0;

  private clickHandler: ((event: MouseEvent) => void) | null = null;
  private isListening = false;
  private delayTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setupListener();
  }

  private setupListener(): void {
    if (this.clickOutsideDelay > 0) {
      this.delayTimeout = setTimeout(() => {
        this.attachListener();
      }, this.clickOutsideDelay);
    } else {
      // Use a microtask delay to prevent immediate triggering
      void Promise.resolve().then(() => {
        this.attachListener();
      });
    }
  }

  private attachListener(): void {
    if (this.isListening) return;

    this.clickHandler = (event: MouseEvent) => {
      if (!this.clickOutsideEnabled) return;

      const target = event.target as HTMLElement;

      // Check if click was inside the host element
      if (this.el.nativeElement.contains(target)) return;

      // Check if click was on an excluded element
      if (this.isExcluded(target)) return;

      // Run inside Angular zone to trigger change detection
      this.ngZone.run(() => {
        this.clickOutside.emit(event);
      });
    };

    // Run outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.clickHandler!, true);
      document.addEventListener('touchstart', this.clickHandler as EventListener, true);
    });

    this.isListening = true;
  }

  private isExcluded(target: HTMLElement): boolean {
    // Check if the target matches an excluded selector or is a descendant of one
    return this.clickOutsideExclude.some(selector => target.closest(selector) !== null);
  }

  private detachListener(): void {
    if (!this.isListening || !this.clickHandler) return;

    document.removeEventListener('click', this.clickHandler, true);
    document.removeEventListener('touchstart', this.clickHandler as EventListener, true);
    this.clickHandler = null;
    this.isListening = false;
  }

  ngOnDestroy(): void {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
    this.detachListener();
  }
}
