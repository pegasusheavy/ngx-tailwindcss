import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnDestroy,
  inject,
  booleanAttribute,
  NgZone,
} from '@angular/core';

/**
 * Directive to dynamically add/remove classes on hover
 * Useful for complex hover states that can't be achieved with CSS alone
 *
 * @example
 * ```html
 * <div twHoverClass="scale-105 shadow-lg">Hover me</div>
 * <div twHoverClass="bg-blue-500 text-white" [hoverClassBase]="'bg-white text-black'">Toggle colors</div>
 * <div twHoverClass="ring-2 ring-blue-500" [hoverDelay]="200">Delayed hover effect</div>
 * ```
 */
@Directive({
  selector: '[twHoverClass]',
  standalone: true,
})
export class TwHoverClassDirective implements OnInit, OnDestroy {
  private el: ElementRef<HTMLElement>;
  private renderer: Renderer2;
  private ngZone: NgZone;

  constructor() {
    this.el = inject(ElementRef);
    this.renderer = inject(Renderer2);
    this.ngZone = inject(NgZone);
  }

  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  private isHovered = false;

  /** Classes to add on hover */
  @Input({ required: true })
  twHoverClass: string = '';

  /** Base classes to remove on hover (and restore on leave) */
  @Input()
  hoverClassBase: string = '';

  /** Delay before applying hover classes (ms) */
  @Input()
  hoverDelay: number = 0;

  /** Delay before removing hover classes (ms) */
  @Input()
  hoverLeaveDelay: number = 0;

  /** Disable hover effects */
  @Input({ transform: booleanAttribute })
  hoverDisabled: boolean = false;

  private onMouseEnter = (): void => {
    if (this.hoverDisabled) return;

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    const apply = () => {
      this.isHovered = true;
      this.applyHoverClasses();
    };

    if (this.hoverDelay > 0) {
      this.hoverTimeout = setTimeout(apply, this.hoverDelay);
    } else {
      apply();
    }
  };

  private onMouseLeave = (): void => {
    if (this.hoverDisabled) return;

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    const remove = () => {
      this.isHovered = false;
      this.removeHoverClasses();
    };

    if (this.hoverLeaveDelay > 0) {
      this.hoverTimeout = setTimeout(remove, this.hoverLeaveDelay);
    } else {
      remove();
    }
  };

  private applyHoverClasses(): void {
    const element = this.el.nativeElement;

    // Remove base classes
    if (this.hoverClassBase) {
      this.hoverClassBase.split(' ').forEach((cls) => {
        if (cls) this.renderer.removeClass(element, cls);
      });
    }

    // Add hover classes
    if (this.twHoverClass) {
      this.twHoverClass.split(' ').forEach((cls) => {
        if (cls) this.renderer.addClass(element, cls);
      });
    }
  }

  private removeHoverClasses(): void {
    const element = this.el.nativeElement;

    // Remove hover classes
    if (this.twHoverClass) {
      this.twHoverClass.split(' ').forEach((cls) => {
        if (cls) this.renderer.removeClass(element, cls);
      });
    }

    // Restore base classes
    if (this.hoverClassBase) {
      this.hoverClassBase.split(' ').forEach((cls) => {
        if (cls) this.renderer.addClass(element, cls);
      });
    }
  }

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      element.addEventListener('mouseenter', this.onMouseEnter);
      element.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  ngOnDestroy(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    const element = this.el.nativeElement;
    element.removeEventListener('mouseenter', this.onMouseEnter);
    element.removeEventListener('mouseleave', this.onMouseLeave);
  }
}

