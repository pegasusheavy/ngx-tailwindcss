#!/bin/bash

# For admin-dashboard: Remove TwMultiSelectComponent from imports array but keep the type
sed -i '/^  TwMultiSelectComponent,$/d' admin-dashboard.component.ts

# For ecommerce: It probably has the type defined but component not used
# Check if component is in imports array
sed -i '/^    TwMultiSelectComponent,$/d' ecommerce.component.ts

echo "Fixed imports!"
