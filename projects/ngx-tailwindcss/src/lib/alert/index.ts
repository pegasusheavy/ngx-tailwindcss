export * from './alert.component';

import { TwAlertComponent, TwAlertTitleComponent, TwAlertDescriptionComponent } from './alert.component';

export const TW_ALERT_COMPONENTS = [
  TwAlertComponent,
  TwAlertTitleComponent,
  TwAlertDescriptionComponent,
] as const;

