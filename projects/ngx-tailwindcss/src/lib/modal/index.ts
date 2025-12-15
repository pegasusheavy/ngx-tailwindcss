export * from './modal.component';

import {
  TwConfirmDialogComponent,
  TwModalBodyComponent,
  TwModalComponent,
  TwModalFooterComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
} from './modal.component';

export const TW_MODAL_COMPONENTS = [
  TwModalComponent,
  TwModalHeaderComponent,
  TwModalTitleComponent,
  TwModalBodyComponent,
  TwModalFooterComponent,
  TwConfirmDialogComponent,
] as const;
