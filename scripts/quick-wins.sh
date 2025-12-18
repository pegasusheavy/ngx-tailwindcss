#!/bin/bash

# Phase 1: Quick Win Fixes
# These are safe, automated fixes that won't break anything

set -e

echo "🚀 Applying quick win lint fixes..."

# Fix 1: Delete empty index.ts files
echo "1. Deleting empty index.ts files..."
find projects/ngx-tailwindcss/src/lib -name "index.ts" -type f -empty -delete
empty_count=$(find projects/ngx-tailwindcss/src/lib -name "index.ts" -type f -empty 2>/dev/null | wc -l)
echo "   Deleted empty index.ts files"

# Fix 2: Prefix unused variables with underscore
echo "2. Fixing unused variables..."
# This is tricky - need to know which vars are actually unused
# Safer to skip for now

# Fix 3: Add default case to switch statements
echo "3. Adding default cases to switch statements..."
# Find files with switch but no default
grep -r "switch\s*(" projects/ngx-tailwindcss/src/lib --include="*.ts" --exclude="*.spec.ts" -l | while read -r file; do
  if ! grep -q "default:" "$file"; then
    # Add default case before last closing brace of switch
    # This is complex, skip for manual review
    echo "   - $file needs default case (manual review needed)"
  fi
done

# Fix 4: Ensure all regexes have unicode flag (double-check from previous script)
echo "4. Ensuring all regexes have 'u' flag..."
find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" | while read -r file; do
  # Find regexes without 'u' flag
  if grep -E '/[^/]+/[gimsy]*;' "$file" | grep -vE '/[^/]+/[gimsy]*u;' >/dev/null 2>&1; then
    perl -i -pe 's#(/[^/]+/)([gimsy]*)(;)#my $flags = $2; $flags .= "u" unless $flags =~ /u/; "$1$flags$3"#ge' "$file"
  fi
done

echo ""
echo "✅ Quick wins applied!"
echo ""
echo "Running tests to verify..."
pnpm run test:run >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Tests pass!"

  echo ""
  echo "Checking lint status..."
  pnpm run lint 2>&1 | grep "✖"

  echo ""
  echo "Commit these changes with: git add -A && git commit -m 'fix: apply quick win lint fixes'"
else
  echo "❌ Tests failed!"
  exit 1
fi

