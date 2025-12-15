export * from './card.component';

import {
  TwCardComponent,
  TwCardHorizontalComponent,
  TwCardHeaderDirective,
  TwCardTitleDirective,
  TwCardSubtitleDirective,
  TwCardBodyDirective,
  TwCardFooterDirective,
  TwCardMediaDirective,
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

