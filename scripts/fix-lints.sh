#!/bin/bash

# Script to fix common lint patterns across the codebase
# Run with: bash fix-lints.sh

echo "Fixing common lint patterns..."

# Get list of all TypeScript files in lib
files=$(find projects/ngx-tailwindcss/src/lib -name "*.ts" -not -name "*.spec.ts")

for file in $files; do
  echo "Processing: $file"

  # Fix @Output names with 'on' prefix - Common patterns
  # onChange -> change
  sed -i 's/@Output() onChange =/@Output() change =/g' "$file"
  sed -i 's/this\.onChange\.emit/this.change.emit/g' "$file"

  # onToggle -> toggle
  sed -i 's/@Output() onToggle =/@Output() toggle =/g' "$file"
  sed -i 's/this\.onToggle\.emit/this.toggle.emit/g' "$file"

  # onSelect -> select (but not onSelected)
  sed -i 's/@Output() onSelect =/@Output() select =/g' "$file"
  sed -i 's/this\.onSelect\.emit/this.select.emit/g' "$file"

  # onClose -> close
  sed -i 's/@Output() onClose =/@Output() close =/g' "$file"
  sed -i 's/this\.onClose\.emit/this.close.emit/g' "$file"

  # onOpen -> open
  sed -i 's/@Output() onOpen =/@Output() open =/g' "$file"
  sed -i 's/this\.onOpen\.emit/this.open.emit/g' "$file"

  # onRemove -> remove
  sed -i 's/@Output() onRemove =/@Output() remove =/g' "$file"
  sed -i 's/this\.onRemove\.emit/this.remove.emit/g' "$file"

  # onFilter -> filter
  sed -i 's/@Output() onFilter =/@Output() filter =/g' "$file"
  sed -i 's/this\.onFilter\.emit/this.filter.emit/g' "$file"

  # Fix new Array() -> Array.from()
  # This is tricky, need to handle: new Array(n) -> Array.from({length: n})
  # For now, let's handle simple cases
  perl -i -pe 's/new Array\(([^)]+)\)\.fill\([^)]*\)/Array.from({length: $1})/g' "$file"

done

echo "Done! Now run: pnpm run lint to see remaining issues"

