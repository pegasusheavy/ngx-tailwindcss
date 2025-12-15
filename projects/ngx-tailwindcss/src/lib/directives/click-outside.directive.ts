import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  booleanAttribute,
  NgZone,
} from '@angular/core';

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
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);

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
    this.setupListener();
  }

  private setupListener(): void {
    if (this.clickOutsideDelay > 0) {
      this.delayTimeout = setTimeout(() => {
        this.attachListener();
      }, this.clickOutsideDelay);
    } else {
      // Use a microtask delay to prevent immediate triggering
      Promise.resolve().then(() => this.attachListener());
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
    for (const selector of this.clickOutsideExclude) {
      // Check if the target matches the selector or is a descendant
      const excludedElements = document.querySelectorAll(selector);
      for (const excluded of Array.from(excludedElements)) {
        if (excluded.contains(target)) {
          return true;
        }
      }
    }
    return false;
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

