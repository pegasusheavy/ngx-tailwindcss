#!/bin/bash

# Admin Dashboard - remove unused imports
sed -i '/TwMultiSelectComponent,/d' admin-dashboard.component.ts
sed -i '/TwSidebarComponent,/d' admin-dashboard.component.ts
sed -i '/TwTabsComponent,/d' admin-dashboard.component.ts
sed -i '/TwTabPanelComponent,/d' admin-dashboard.component.ts
sed -i '/TwProgressComponent,/d' admin-dashboard.component.ts
sed -i '/TwSwitchComponent,/d' admin-dashboard.component.ts
sed -i '/TwDropdownComponent,/d' admin-dashboard.component.ts

# E-commerce - remove unused imports
sed -i '/TwProgressComponent,/d' ecommerce.component.ts
sed -i '/TwDropdownComponent,/d' ecommerce.component.ts
sed -i '/TwTabsComponent,/d' ecommerce.component.ts
sed -i '/TwTabPanelComponent,/d' ecommerce.component.ts
sed -i '/TwSpinnerComponent,/d' ecommerce.component.ts
sed -i '/TwImageComponent,/d' ecommerce.component.ts

# Forum - remove unused imports
sed -i '/TwTabsComponent,/d' forum.component.ts
sed -i '/TwTabPanelComponent,/d' forum.component.ts
sed -i '/TwAccordionComponent,/d' forum.component.ts
sed -i '/TwAccordionItemComponent,/d' forum.component.ts
sed -i '/TwChipComponent,/d' forum.component.ts
sed -i '/TwChipsComponent,/d' forum.component.ts

# Portfolio - remove unused imports
sed -i '/TwImageComponent,/d' portfolio.component.ts
sed -i '/TwProgressComponent,/d' portfolio.component.ts

# SaaS Landing - remove unused imports
sed -i '/TwTabsComponent,/d' saas-landing.component.ts
sed -i '/TwTabPanelComponent,/d' saas-landing.component.ts

# Social Network - remove unused imports
sed -i '/TwTabsComponent,/d' social-network.component.ts
sed -i '/TwTabPanelComponent,/d' social-network.component.ts
sed -i '/TwChipsComponent,/d' social-network.component.ts
sed -i '/TwProgressComponent,/d' social-network.component.ts

# Also remove from import statements at the top
for file in *.component.ts; do
  # Remove MultiSelectGroup if not used
  if ! grep -q "MultiSelectGroup" "$file" | grep -v "import"; then
    sed -i '/MultiSelectGroup,/d' "$file"
  fi
done

echo "Removed all unused imports!"
