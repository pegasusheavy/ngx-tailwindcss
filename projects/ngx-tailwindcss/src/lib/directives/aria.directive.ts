import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { AriaUtils, TwAriaService } from '../core/aria.service';

/**
 * Directive to add screen reader only text to elements.
 * Content is visually hidden but accessible to screen readers.
 */
@Directive({
  selector: '[twSrOnly]',
  standalone: true,
  host: {
    '[class]': 'srOnlyClasses()',
  },
})
export class TwSrOnlyDirective {
  @Input({ transform: booleanAttribute }) set twSrOnly(value: boolean) {
    this._enabled.set(value);
  }

  @Input({ transform: booleanAttribute }) focusable = false;

  private readonly _enabled = signal(true);

  protected srOnlyClasses = computed(() => {
    if (!this._enabled()) return '';

    if (this.focusable) {
      return 'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-slate-900 focus:border focus:border-slate-300 focus:rounded';
    }
    return 'sr-only';
  });
}

/**
 * Directive to announce content changes to screen readers.
 */
@Directive({
  selector: '[twAnnounce]',
  standalone: true,
})
export class TwAnnounceDirective implements OnDestroy {
  private readonly ariaService = inject(TwAriaService);
  private previousMessage = '';

  @Input() set twAnnounce(message: string) {
    if (message && message !== this.previousMessage) {
      this.ariaService.announce(message);
      this.previousMessage = message;
    }
  }

  @Input({ transform: booleanAttribute }) announceAssertive = false;

  ngOnDestroy(): void {
    this.ariaService.clearAnnouncements();
  }
}

/**
 * Directive for managing ARIA expanded state.
 */
@Directive({
  selector: '[twAriaExpanded]',
  standalone: true,
})
export class TwAriaExpandedDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaExpanded(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', String(value));
  }

  @Input() set ariaControls(id: string | null) {
    if (id) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-controls', id);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-controls');
    }
  }
}

/**
 * Directive for managing ARIA selected state.
 */
@Directive({
  selector: '[twAriaSelected]',
  standalone: true,
})
export class TwAriaSelectedDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaSelected(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-selected', String(value));
  }
}

/**
 * Directive for managing ARIA checked state.
 */
@Directive({
  selector: '[twAriaChecked]',
  standalone: true,
})
export class TwAriaCheckedDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaChecked(value: boolean | 'mixed') {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-checked', String(value));
  }
}

/**
 * Directive for managing ARIA pressed state (toggle buttons).
 */
@Directive({
  selector: '[twAriaPressed]',
  standalone: true,
})
export class TwAriaPressedDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaPressed(value: boolean | 'mixed') {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-pressed', String(value));
  }
}

/**
 * Directive for managing ARIA disabled state.
 */
@Directive({
  selector: '[twAriaDisabled]',
  standalone: true,
})
export class TwAriaDisabledDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaDisabled(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-disabled', String(value));
    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'tabindex', '-1');
    }
  }
}

/**
 * Directive for managing ARIA hidden state.
 */
@Directive({
  selector: '[twAriaHidden]',
  standalone: true,
})
export class TwAriaHiddenDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaHidden(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', String(value));
  }
}

/**
 * Directive for managing ARIA live regions.
 */
@Directive({
  selector: '[twAriaLive]',
  standalone: true,
})
export class TwAriaLiveDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaLive(value: 'off' | 'polite' | 'assertive') {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-live', value);
  }

  @Input({ transform: booleanAttribute }) set ariaAtomic(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-atomic', String(value));
  }

  @Input() set ariaRelevant(value: 'additions' | 'removals' | 'text' | 'all' | string) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-relevant', value);
  }
}

/**
 * Directive for managing ARIA current state (navigation).
 */
@Directive({
  selector: '[twAriaCurrent]',
  standalone: true,
})
export class TwAriaCurrentDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaCurrent(
    value: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
  ) {
    const strValue = typeof value === 'boolean' ? String(value) : value;
    if (value && strValue !== 'false') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-current', strValue);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-current');
    }
  }
}

/**
 * Directive for managing ARIA busy state.
 */
@Directive({
  selector: '[twAriaBusy]',
  standalone: true,
})
export class TwAriaBusyDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaBusy(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-busy', String(value));
  }
}

/**
 * Directive for managing ARIA describedby.
 */
@Directive({
  selector: '[twAriaDescribedby]',
  standalone: true,
})
export class TwAriaDescribedbyDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaDescribedby(value: string | string[] | null) {
    if (!value) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
      return;
    }
    const ids = Array.isArray(value) ? value.join(' ') : value;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', ids);
  }
}

/**
 * Directive for managing ARIA labelledby.
 */
@Directive({
  selector: '[twAriaLabelledby]',
  standalone: true,
})
export class TwAriaLabelledbyDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaLabelledby(value: string | string[] | null) {
    if (!value) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-labelledby');
      return;
    }
    const ids = Array.isArray(value) ? value.join(' ') : value;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-labelledby', ids);
  }
}

/**
 * Directive for managing ARIA label.
 */
@Directive({
  selector: '[twAriaLabel]',
  standalone: true,
})
export class TwAriaLabelDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaLabel(value: string | null) {
    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-label', value);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-label');
    }
  }
}

/**
 * Directive for managing ARIA valuenow/valuemin/valuemax (progress, sliders).
 */
@Directive({
  selector: '[twAriaValue]',
  standalone: true,
})
export class TwAriaValueDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: numberAttribute }) set twAriaValue(value: number) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-valuenow', String(value));
  }

  @Input({ transform: numberAttribute }) set ariaValueMin(value: number) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-valuemin', String(value));
  }

  @Input({ transform: numberAttribute }) set ariaValueMax(value: number) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-valuemax', String(value));
  }

  @Input() set ariaValueText(value: string | null) {
    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-valuetext', value);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-valuetext');
    }
  }
}

/**
 * Directive for managing ARIA role.
 */
@Directive({
  selector: '[twRole]',
  standalone: true,
})
export class TwRoleDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twRole(value: string | null) {
    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'role', value);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'role');
    }
  }
}

/**
 * Directive for managing ARIA modal.
 */
@Directive({
  selector: '[twAriaModal]',
  standalone: true,
})
export class TwAriaModalDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input({ transform: booleanAttribute }) set twAriaModal(value: boolean) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-modal', String(value));
  }
}

/**
 * Directive for managing ARIA haspopup.
 */
@Directive({
  selector: '[twAriaHaspopup]',
  standalone: true,
})
export class TwAriaHaspopupDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaHaspopup(
    value: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true' | 'false' | boolean
  ) {
    const strValue = typeof value === 'boolean' ? String(value) : value;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-haspopup', strValue);
  }
}

/**
 * Directive for managing ARIA owns.
 */
@Directive({
  selector: '[twAriaOwns]',
  standalone: true,
})
export class TwAriaOwnsDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaOwns(value: string | string[] | null) {
    if (!value) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-owns');
      return;
    }
    const ids = Array.isArray(value) ? value.join(' ') : value;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-owns', ids);
  }
}

/**
 * Directive for managing ARIA activedescendant.
 */
@Directive({
  selector: '[twAriaActivedescendant]',
  standalone: true,
})
export class TwAriaActivedescendantDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input() set twAriaActivedescendant(value: string | null) {
    if (value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-activedescendant', value);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-activedescendant');
    }
  }
}

/**
 * Collection of all ARIA directives.
 */
export const TW_ARIA_DIRECTIVES = [
  TwSrOnlyDirective,
  TwAnnounceDirective,
  TwAriaExpandedDirective,
  TwAriaSelectedDirective,
  TwAriaCheckedDirective,
  TwAriaPressedDirective,
  TwAriaDisabledDirective,
  TwAriaHiddenDirective,
  TwAriaLiveDirective,
  TwAriaCurrentDirective,
  TwAriaBusyDirective,
  TwAriaDescribedbyDirective,
  TwAriaLabelledbyDirective,
  TwAriaLabelDirective,
  TwAriaValueDirective,
  TwRoleDirective,
  TwAriaModalDirective,
  TwAriaHaspopupDirective,
  TwAriaOwnsDirective,
  TwAriaActivedescendantDirective,
] as const;
