#!/bin/bash

# Fix 1: Change [(ngModel)]="rating" to just show static rating
sed -i 's/\[(ngModel)\]="rating"/[ngModel]="rating"/g' ecommerce.component.html

# Fix 2: Fix sidebar binding
sed -i 's/\[\(open\)\]="cartOpen"/[visibleInput]="cartOpen" (visibleChange)="cartOpen = $event"/g' ecommerce.component.html

# Fix 3: Fix the ternary expression to not return "default"
sed -i 's/selectedCategory() === cat\.value ? .primary. : .default./selectedCategory() === cat.value ? "primary" : "success"/g' portfolio.component.html

echo "Applied final fixes!"
