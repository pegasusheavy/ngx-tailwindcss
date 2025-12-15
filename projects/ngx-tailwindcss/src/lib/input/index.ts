export * from './input.component';

import {
  TwErrorDirective,
  TwHintDirective,
  TwInputAffixDirective,
  TwInputComponent,
  TwLabelDirective,
  TwTextareaComponent,
} from './input.component';

export const TW_INPUT_COMPONENTS = [
  TwInputComponent,
  TwTextareaComponent,
  TwLabelDirective,
  TwHintDirective,
  TwErrorDirective,
  TwInputAffixDirective,
] as const;
