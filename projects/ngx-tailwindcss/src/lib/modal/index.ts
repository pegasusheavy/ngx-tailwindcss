export * from './modal.component';

import {
  TwModalComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
  TwModalBodyComponent,
  TwModalFooterComponent,
  TwConfirmDialogComponent,
} from './modal.component';

export const TW_MODAL_COMPONENTS = [
  TwModalComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
  TwModalBodyComponent,
  TwModalFooterComponent,
  TwConfirmDialogComponent,
] as const;

