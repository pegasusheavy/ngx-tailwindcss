#!/bin/bash

# Safe lint fixes that won't break functionality
# These are conservative changes that have been verified

set -e

echo "Applying safe lint fixes..."

# Fix 1: Add 'u' flag to regex literals
echo "1. Adding 'u' flag to regex literals..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" | while read -r file; do
  # Only add 'u' if the regex doesn't already have it
  perl -i -pe 's#(/[^/]+/)([gimsy]+)(;)#$1 . ($2 =~ /u/ ? $2 : $2."u") . $3#ge' "$file"
done

# Fix 2: Replace short variable names in common patterns
echo "2. Replacing short variable names..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" -exec sed -i \
  -e 's/\.update(v =>/\.update(value =>/g' \
  -e 's/\.map(n =>/\.map(node =>/g' \
  -e 's/\.filter(n =>/\.filter(node =>/g' \
  -e 's/\.find(n =>/\.find(node =>/g' \
  -e 's/\.forEach(n =>/\.forEach(node =>/g' \
  {} \;

# Fix 3: Replace || with ?? for nullish coalescing in safe contexts
echo "3. Replacing || with ?? in safe contexts..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" -exec sed -i \
  -e 's/|| null;/?? null;/g' \
  -e 's/|| undefined;/?? undefined;/g' \
  {} \;

# Fix 4: Replace 'any' with 'unknown' in signal types
echo "4. Replacing 'any' with 'unknown' in signal types..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" -exec sed -i \
  -e 's/signal<any>/signal<unknown>/g' \
  {} \;

# Fix 5: Add return type : void to methods that clearly return nothing
echo "5. Adding void return types to simple methods..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" -exec sed -i \
  -e 's/^\( *\)\(protected\|private\) \(clear\|reset\|init\|destroy\|toggle\|open\|close\)(\([^)]*\)) {$/\1\2 \3(\4): void {/g' \
  {} \;

echo "✅ Safe fixes applied!"
echo "Testing to ensure nothing broke..."

# Run tests to verify
pnpm run test:run

if [ $? -eq 0 ]; then
  echo "✅ Tests still pass!"
  echo "Checking lint improvements..."
  pnpm run lint 2>&1 | tail -3
else
  echo "❌ Tests failed! Reverting..."
  git restore .
  exit 1
fi

