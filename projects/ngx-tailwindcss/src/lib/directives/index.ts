// Core directives
export * from './ripple.directive';
export * from './tooltip.directive';
export * from './click-outside.directive';
export * from './focus-trap.directive';
export * from './class-merge.directive';

// DX enhancement directives
export * from './auto-focus.directive';
export * from './in-view.directive';
export * from './long-press.directive';
export * from './debounce-click.directive';
export * from './copy-clipboard.directive';
export * from './keyboard-shortcut.directive';
export * from './swipe.directive';
export * from './resize-observer.directive';
export * from './lazy-image.directive';
export * from './scroll-anchor.directive';
export * from './hover-class.directive';
export * from './trap-scroll.directive';

// Convenience export of all directives
import { TwRippleDirective } from './ripple.directive';
import { TwTooltipDirective } from './tooltip.directive';
import { TwClickOutsideDirective } from './click-outside.directive';
import { TwFocusTrapDirective } from './focus-trap.directive';
import { TwClassDirective, TwVariantDirective } from './class-merge.directive';
import { TwAutoFocusDirective } from './auto-focus.directive';
import { TwInViewDirective } from './in-view.directive';
import { TwLongPressDirective } from './long-press.directive';
import { TwDebounceClickDirective } from './debounce-click.directive';
import { TwCopyClipboardDirective } from './copy-clipboard.directive';
import { TwKeyboardShortcutDirective } from './keyboard-shortcut.directive';
import { TwSwipeDirective } from './swipe.directive';
import { TwResizeObserverDirective } from './resize-observer.directive';
import { TwLazyImageDirective } from './lazy-image.directive';
import { TwScrollToDirective, TwScrollSectionDirective } from './scroll-anchor.directive';
import { TwHoverClassDirective } from './hover-class.directive';
import { TwTrapScrollDirective } from './trap-scroll.directive';

/** All core directives */
export const TW_CORE_DIRECTIVES = [
  TwRippleDirective,
  TwTooltipDirective,
  TwClickOutsideDirective,
  TwFocusTrapDirective,
  TwClassDirective,
  TwVariantDirective,
] as const;

/** All DX enhancement directives */
export const TW_DX_DIRECTIVES = [
  TwAutoFocusDirective,
  TwInViewDirective,
  TwLongPressDirective,
  TwDebounceClickDirective,
  TwCopyClipboardDirective,
  TwKeyboardShortcutDirective,
  TwSwipeDirective,
  TwResizeObserverDirective,
  TwLazyImageDirective,
  TwScrollToDirective,
  TwScrollSectionDirective,
  TwHoverClassDirective,
  TwTrapScrollDirective,
] as const;

/** All directives combined */
export const TW_DIRECTIVES = [
  ...TW_CORE_DIRECTIVES,
  ...TW_DX_DIRECTIVES,
] as const;
