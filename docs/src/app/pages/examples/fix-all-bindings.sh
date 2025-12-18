#!/bin/bash

# Fix sidebar bindings
sed -i 's/\[\(open\)\]="cartOpen"/[visibleInput]="cartOpen" (visibleChange)="cartOpen = $event"/g' ecommerce.component.html

# Fix rating bindings - the rating component uses [(ngModel)] not [value] or [rating]
# Since we already changed [value] to [(ngModel)], we need to make sure [readonly] is just readonly attribute
sed -i 's/\[readonly\]="true"/readonly/g' *.html

# Fix getStatusVariant return type - change "default" to "primary" in the return
# We'll do this by updating the function in the TypeScript file

echo "Fixed bindings!"
