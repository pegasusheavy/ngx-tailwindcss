#!/bin/bash

# Fix remaining common lint errors

echo "Fixing remaining lint errors..."

# Fix 1: Add 'u' flag to all regex literals that don't have it
find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts" -exec sed -i -E 's|= /([^/]+)/([gimsy]*);|= /\1/\2u;|g' {} \;

# Fix 2: Add getters for setters (accessor-pairs)
# This is complex - need to do manually for each case

# Fix 3: Delete empty index.ts files (unicorn/no-empty-file)
find projects/ngx-tailwindcss/src/lib -name "index.ts" -type f -empty -delete

# Fix 4: Add default case to switch statements
for file in $(find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts"); do
  # Check if file has switch without default
  if grep -q "switch\s*(" "$file" && ! grep -q "default:" "$file"; then
    echo "File needs default case: $file"
  fi
done

# Fix 5: Replace no-plusplus violations
find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts" -exec sed -i 's/index++/index += 1/g' {} \;
find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts" -exec sed -i 's/count++/count += 1/g' {} \;
find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts" -exec sed -i 's/i++/i += 1/g' {} \;

# Fix 6: Fix unused variables by prefixing with _
# This needs case-by-case analysis

echo "Done! Run 'pnpm run lint' to check remaining issues."

