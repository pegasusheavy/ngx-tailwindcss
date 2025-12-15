export * from './alert.component';

import {
  TwAlertComponent,
  TwAlertDescriptionComponent,
  TwAlertTitleComponent,
} from './alert.component';

export const TW_ALERT_COMPONENTS = [
  TwAlertComponent,
  TwAlertTitleComponent,
  TwAlertDescriptionComponent,
] as const;
