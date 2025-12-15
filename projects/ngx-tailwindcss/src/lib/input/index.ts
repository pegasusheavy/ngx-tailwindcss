export * from './input.component';

import {
  TwInputComponent,
  TwTextareaComponent,
  TwLabelDirective,
  TwHintDirective,
  TwErrorDirective,
  TwInputAffixDirective,
} from './input.component';

export const TW_INPUT_COMPONENTS = [
  TwInputComponent,
  TwTextareaComponent,
  TwLabelDirective,
  TwHintDirective,
  TwErrorDirective,
  TwInputAffixDirective,
] as const;

