export * from './card.component';

import {
  TwCardBodyDirective,
  TwCardComponent,
  TwCardFooterDirective,
  TwCardHeaderDirective,
  TwCardHorizontalComponent,
  TwCardMediaDirective,
  TwCardSubtitleDirective,
  TwCardTitleDirective,
} from './card.component';

export const TW_CARD_COMPONENTS = [
  TwCardComponent,
  TwCardHorizontalComponent,
  TwCardHeaderDirective,
  TwCardTitleDirective,
  TwCardSubtitleDirective,
  TwCardBodyDirective,
  TwCardFooterDirective,
  TwCardMediaDirective,
] as const;
