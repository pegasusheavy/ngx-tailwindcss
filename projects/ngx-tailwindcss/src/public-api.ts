/*
 * Public API Surface of @pegasus-heavy/ngx-tailwindcss
 *
 * This library provides highly customizable Angular components designed
 * for Tailwind CSS 4+. Components use Tailwind utility classes and are
 * designed to work with your custom Tailwind configuration.
 *
 * IMPORTANT: This library does NOT import Tailwind CSS directly.
 * You must configure Tailwind in your application and ensure the
 * content paths include this library's templates.
 */

// Core - Configuration and Services
export * from './lib/core/index';

// Directives
export * from './lib/directives/index';

// Form Components
export * from './lib/button/index';
export * from './lib/input/index';
export * from './lib/checkbox/index';
export * from './lib/radio/index';
export * from './lib/switch/index';
export * from './lib/select/index';
export * from './lib/slider/index';
export * from './lib/rating/index';
export * from './lib/chip/index';

// Layout Components
export * from './lib/card/index';
export * from './lib/accordion/index';
export * from './lib/tabs/index';
export * from './lib/divider/index';

// Data Display Components
export * from './lib/badge/index';
export * from './lib/avatar/index';
export * from './lib/table/index';
export * from './lib/tree/index';
export * from './lib/timeline/index';

// Navigation Components
export * from './lib/breadcrumb/index';
export * from './lib/pagination/index';
export * from './lib/steps/index';
export * from './lib/menu/index';

// Feedback Components
export * from './lib/alert/index';
export * from './lib/toast/index';
export * from './lib/spinner/index';
export * from './lib/progress/index';
export * from './lib/skeleton/index';

// Overlay Components
export * from './lib/modal/index';
export * from './lib/dropdown/index';
export * from './lib/sidebar/index';
export * from './lib/popover/index';

// Media Components
export * from './lib/image/index';

// Misc Components
export * from './lib/scroll-top/index';

// Convenience re-exports for all components
import { TW_DIRECTIVES } from './lib/directives/index';

import { TW_BUTTON_COMPONENTS } from './lib/button/index';
import { TW_CARD_COMPONENTS } from './lib/card/index';
import { TW_INPUT_COMPONENTS } from './lib/input/index';
import { TW_BADGE_COMPONENTS } from './lib/badge/index';
import { TW_ALERT_COMPONENTS } from './lib/alert/index';
import { TW_MODAL_COMPONENTS } from './lib/modal/index';
import { TW_DROPDOWN_COMPONENTS } from './lib/dropdown/index';
import { TW_TABS_COMPONENTS } from './lib/tabs/index';
import { TwAvatarComponent, TwAvatarGroupComponent } from './lib/avatar/index';
import { TwLoadingOverlayComponent, TwSpinnerComponent } from './lib/spinner/index';
import { TwProgressCircularComponent, TwProgressComponent } from './lib/progress/index';
import {
  TwSkeletonCardComponent,
  TwSkeletonComponent,
  TwSkeletonTableComponent,
  TwSkeletonTextComponent,
} from './lib/skeleton/index';
import { TwToastComponent, TwToastContainerComponent } from './lib/toast/index';
import { TwBreadcrumbComponent } from './lib/breadcrumb/index';
import { TwPaginationComponent } from './lib/pagination/index';
import { TwAccordionComponent, TwAccordionItemComponent } from './lib/accordion/index';
import { TwDividerComponent } from './lib/divider/index';

// New form components
import { TwCheckboxComponent } from './lib/checkbox/index';
import { TwRadioButtonComponent, TwRadioGroupComponent } from './lib/radio/index';
import { TwSwitchComponent } from './lib/switch/index';
import { TwSelectComponent } from './lib/select/index';
import { TwSliderComponent } from './lib/slider/index';
import { TwRatingComponent } from './lib/rating/index';
import { TwChipComponent, TwChipsComponent } from './lib/chip/index';

// New data display components
import { TwTableComponent } from './lib/table/index';
import { TwTreeComponent } from './lib/tree/index';
import { TwTimelineComponent } from './lib/timeline/index';

// New navigation components
import { TwStepsComponent } from './lib/steps/index';
import { TwContextMenuComponent, TwMenuComponent } from './lib/menu/index';

// New overlay components
import { TwSidebarComponent } from './lib/sidebar/index';
import { TwPopoverComponent } from './lib/popover/index';

// New media components
import { TwImageComponent } from './lib/image/index';

// Misc components
import { TwScrollTopComponent } from './lib/scroll-top/index';

export const TW_AVATAR_COMPONENTS = [TwAvatarComponent, TwAvatarGroupComponent] as const;

export const TW_SPINNER_COMPONENTS = [TwSpinnerComponent, TwLoadingOverlayComponent] as const;

export const TW_PROGRESS_COMPONENTS = [TwProgressComponent, TwProgressCircularComponent] as const;

export const TW_SKELETON_COMPONENTS = [
  TwSkeletonComponent,
  TwSkeletonTextComponent,
  TwSkeletonCardComponent,
  TwSkeletonTableComponent,
] as const;

export const TW_TOAST_COMPONENTS = [TwToastComponent, TwToastContainerComponent] as const;

export const TW_BREADCRUMB_COMPONENTS = [TwBreadcrumbComponent] as const;

export const TW_PAGINATION_COMPONENTS = [TwPaginationComponent] as const;

export const TW_ACCORDION_COMPONENTS = [TwAccordionComponent, TwAccordionItemComponent] as const;

export const TW_DIVIDER_COMPONENTS = [TwDividerComponent] as const;

// New component groups
export const TW_CHECKBOX_COMPONENTS = [TwCheckboxComponent] as const;

export const TW_RADIO_COMPONENTS = [TwRadioButtonComponent, TwRadioGroupComponent] as const;

export const TW_SWITCH_COMPONENTS = [TwSwitchComponent] as const;

export const TW_SELECT_COMPONENTS = [TwSelectComponent] as const;

export const TW_SLIDER_COMPONENTS = [TwSliderComponent] as const;

export const TW_RATING_COMPONENTS = [TwRatingComponent] as const;

export const TW_CHIP_COMPONENTS = [TwChipComponent, TwChipsComponent] as const;

export const TW_TABLE_COMPONENTS = [TwTableComponent] as const;

export const TW_TREE_COMPONENTS = [TwTreeComponent] as const;

export const TW_TIMELINE_COMPONENTS = [TwTimelineComponent] as const;

export const TW_STEPS_COMPONENTS = [TwStepsComponent] as const;

export const TW_MENU_COMPONENTS = [TwMenuComponent, TwContextMenuComponent] as const;

export const TW_SIDEBAR_COMPONENTS = [TwSidebarComponent] as const;

export const TW_POPOVER_COMPONENTS = [TwPopoverComponent] as const;

export const TW_IMAGE_COMPONENTS = [TwImageComponent] as const;

export const TW_SCROLL_TOP_COMPONENTS = [TwScrollTopComponent] as const;

/**
 * All ngx-tailwindcss components and directives
 * Use this for convenience when you want to import everything
 *
 * @example
 * ```typescript
 * import { TW_ALL } from '@pegasus-heavy/ngx-tailwindcss';
 *
 * @Component({
 *   imports: [...TW_ALL],
 * })
 * export class MyComponent {}
 * ```
 */
export const TW_ALL = [
  ...TW_DIRECTIVES,
  // Form
  ...TW_BUTTON_COMPONENTS,
  ...TW_INPUT_COMPONENTS,
  ...TW_CHECKBOX_COMPONENTS,
  ...TW_RADIO_COMPONENTS,
  ...TW_SWITCH_COMPONENTS,
  ...TW_SELECT_COMPONENTS,
  ...TW_SLIDER_COMPONENTS,
  ...TW_RATING_COMPONENTS,
  ...TW_CHIP_COMPONENTS,
  // Layout
  ...TW_CARD_COMPONENTS,
  ...TW_ACCORDION_COMPONENTS,
  ...TW_TABS_COMPONENTS,
  ...TW_DIVIDER_COMPONENTS,
  // Data Display
  ...TW_BADGE_COMPONENTS,
  ...TW_AVATAR_COMPONENTS,
  ...TW_TABLE_COMPONENTS,
  ...TW_TREE_COMPONENTS,
  ...TW_TIMELINE_COMPONENTS,
  // Navigation
  ...TW_BREADCRUMB_COMPONENTS,
  ...TW_PAGINATION_COMPONENTS,
  ...TW_STEPS_COMPONENTS,
  ...TW_MENU_COMPONENTS,
  // Feedback
  ...TW_ALERT_COMPONENTS,
  ...TW_TOAST_COMPONENTS,
  ...TW_SPINNER_COMPONENTS,
  ...TW_PROGRESS_COMPONENTS,
  ...TW_SKELETON_COMPONENTS,
  // Overlay
  ...TW_MODAL_COMPONENTS,
  ...TW_DROPDOWN_COMPONENTS,
  ...TW_SIDEBAR_COMPONENTS,
  ...TW_POPOVER_COMPONENTS,
  // Media
  ...TW_IMAGE_COMPONENTS,
  // Misc
  ...TW_SCROLL_TOP_COMPONENTS,
] as const;

export { TW_CORE_DIRECTIVES, TW_DX_DIRECTIVES } from './lib/directives/index';
