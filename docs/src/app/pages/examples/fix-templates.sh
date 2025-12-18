#!/bin/bash

# Fix variant="default" to variant="primary" for badges
find . -name "*.html" -type f -exec sed -i 's/variant="default"/variant="primary"/g' {} \;

# Fix [expanded]="true" to [open]="true" for accordion items
find . -name "*.html" -type f -exec sed -i 's/\[expanded\]=/[open]=/g' {} \;

# Fix title= to itemTitle= for accordion items
find . -name "*.html" -type f -exec sed -i 's/<tw-accordion-item title=/<tw-accordion-item itemTitle=/g' {} \;

# Fix rating [value]= to [(ngModel)]= 
find . -name "*.html" -type f -exec sed -i 's/\[value\]="product\.rating"/[(ngModel)]="product.rating"/g' {} \;
find . -name "*.html" -type f -exec sed -i 's/\[value\]="selectedProduct()!\.rating"/[(ngModel)]="selectedProduct()!.rating"/g' {} \;
find . -name "*.html" -type f -exec sed -i 's/\[value\]="review\.rating"/[(ngModel)]="review.rating"/g' {} \;
find . -name "*.html" -type f -exec sed -i 's/\[value\]="testimonial\.rating"/[(ngModel)]="testimonial.rating"/g' {} \;

# Fix sidebar [(visible)]= to [(open)]=
find . -name "*.html" -type f -exec sed -i 's/\[\(visible\)\]=/[(open)]=/g' {} \;

# Fix avatar variant="primary" to remove variant
find . -name "*.html" -type f -exec sed -i 's/ variant="primary"//g' {} \;

# Fix tw-tab-panel [active]= to remove it (tabs manage their own active state)
find . -name "*.html" -type f -exec sed -i 's/ \[active\]="true"//g' {} \;

echo "Fixed all template errors!"
