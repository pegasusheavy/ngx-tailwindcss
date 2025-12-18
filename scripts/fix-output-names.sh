#!/bin/bash

# Fix @Output names that start with "on"
# Angular style guide says outputs should not be prefixed with "on"

set -e

echo "Fixing @Output names with 'on' prefix..."

# Common patterns to fix:
# onChange -> change
# onClose -> close
# onOpen -> open
# onClick -> click
# onSelect -> select
# onInit -> init

find projects/ngx-tailwindcss/src/lib -name "*.ts" -type f -not -name "*.spec.ts" | while read -r file; do
  changed=false

  # Create temp file
  tmpfile=$(mktemp)
  cp "$file" "$tmpfile"

  # Fix common Output names
  if grep -q "@Output().*onChange" "$file"; then
    sed -i 's/@Output() onChange/@Output() change/g' "$tmpfile"
    sed -i 's/this\.onChange\.emit/this.change.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onClose" "$file"; then
    sed -i 's/@Output() onClose/@Output() close/g' "$tmpfile"
    sed -i 's/this\.onClose\.emit/this.close.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onOpen" "$file"; then
    sed -i 's/@Output() onOpen/@Output() open/g' "$tmpfile"
    sed -i 's/this\.onOpen\.emit/this.open.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onClick" "$file"; then
    sed -i 's/@Output() onClick/@Output() click/g' "$tmpfile"
    sed -i 's/this\.onClick\.emit/this.click.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onSelect" "$file"; then
    sed -i 's/@Output() onSelect/@Output() select/g' "$tmpfile"
    sed -i 's/this\.onSelect\.emit/this.select.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onInit" "$file"; then
    sed -i 's/@Output() onInit/@Output() init/g' "$tmpfile"
    sed -i 's/this\.onInit\.emit/this.init.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onHover" "$file"; then
    sed -i 's/@Output() onHover/@Output() hover/g' "$tmpfile"
    sed -i 's/this\.onHover\.emit/this.hover.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onFocus" "$file"; then
    sed -i 's/@Output() onFocus/@Output() focus/g' "$tmpfile"
    sed -i 's/this\.onFocus\.emit/this.focus.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onBlur" "$file"; then
    sed -i 's/@Output() onBlur/@Output() blur/g' "$tmpfile"
    sed -i 's/this\.onBlur\.emit/this.blur.emit/g' "$tmpfile"
    changed=true
  fi

  if grep -q "@Output().*onInput" "$file"; then
    sed -i 's/@Output() onInput/@Output() input/g' "$tmpfile"
    sed -i 's/this\.onInput\.emit/this.input.emit/g' "$tmpfile"
    changed=true
  fi

  if [ "$changed" = true ]; then
    mv "$tmpfile" "$file"
    echo "  ✓ Fixed: $file"
  else
    rm "$tmpfile"
  fi
done

# Now fix corresponding HTML templates
find projects/ngx-tailwindcss/src/lib -name "*.html" -type f -not -name "*.spec.html" | while read -r file; do
  changed=false
  tmpfile=$(mktemp)
  cp "$file" "$tmpfile"

  if grep -q "(onChange)" "$file"; then
    sed -i 's/(onChange)/(change)/g' "$tmpfile"
    changed=true
  fi

  if grep -q "(onClose)" "$file"; then
    sed -i 's/(onClose)/(close)/g' "$tmpfile"
    changed=true
  fi

  if grep -q "(onOpen)" "$file"; then
    sed -i 's/(onOpen)/(open)/g' "$tmpfile"
    changed=true
  fi

  if grep -q "(onClick)" "$file"; then
    sed -i 's/(onClick)/(click)/g' "$tmpfile"
    changed=true
  fi

  if grep -q "(onSelect)" "$file"; then
    sed -i 's/(onSelect)/(select)/g' "$tmpfile"
    changed=true
  fi

  if grep -q "(onHover)" "$file"; then
    sed -i 's/(onHover)/(hover)/g' "$tmpfile"
    changed=true
  fi

  if [ "$changed" = true ]; then
    mv "$tmpfile" "$file"
    echo "  ✓ Fixed template: $file"
  else
    rm "$tmpfile"
  fi
done

echo ""
echo "✅ Fixed @Output names!"
echo ""
echo "Running tests..."
pnpm run test:run >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Tests pass!"
  echo ""
  echo "Checking lint improvements..."
  pnpm run lint 2>&1 | grep "✖"
else
  echo "❌ Tests failed! Manual review needed."
  exit 1
fi

