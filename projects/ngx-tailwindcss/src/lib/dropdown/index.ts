export * from './dropdown.component';

import {
  TwDropdownComponent,
  TwDropdownDividerComponent,
  TwDropdownHeaderComponent,
  TwDropdownItemDirective,
  TwDropdownMenuComponent,
  TwDropdownTriggerDirective,
} from './dropdown.component';

export const TW_DROPDOWN_COMPONENTS = [
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
  TwDropdownDividerComponent,
  TwDropdownHeaderComponent,
  TwDropdownTriggerDirective,
] as const;
