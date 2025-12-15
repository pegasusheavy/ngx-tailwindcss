export * from './dropdown.component';

import {
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
  TwDropdownDividerComponent,
  TwDropdownHeaderComponent,
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

