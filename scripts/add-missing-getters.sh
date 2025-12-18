#!/bin/bash

# Add getters for setters that are missing them

set -e

echo "Adding missing getters for accessor-pairs..."

# Function to add getter before setter
add_getter() {
  local file="$1"
  local prop_name="$2"
  local prop_type="$3"
  local signal_name="$4"
  local decorator="$5"

  # Create getter text
  local getter="  ${decorator} get ${prop_name}(): ${prop_type} {
    return this.${signal_name}();
  }"

  # Find the setter line and insert getter before it
  awk -v getter="$getter" -v prop="$prop_name" '
    BEGIN { found=0 }
    /set '"$prop_name"'\(/ && !found {
      print getter
      found=1
    }
    { print }
  ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
}

# Fix image.component.ts
if grep -q "set src(" projects/ngx-tailwindcss/src/lib/image/image.component.ts && ! grep -q "get src()" projects/ngx-tailwindcss/src/lib/image/image.component.ts; then
  echo "Fixing image.component.ts..."
  # This file has complex transforms, skip for now
fi

# Fix progress.component.ts
file="projects/ngx-tailwindcss/src/lib/progress/progress.component.ts"
if [ -f "$file" ]; then
  if grep -q "@Input() set wrap(" "$file" && ! grep -q "get wrap()" "$file"; then
    echo "Fixing progress.component.ts..."
    sed -i '/@Input() set wrap(/i\  @Input() get wrap(): boolean {\n    return this._wrap();\n  }' "$file"
  fi
fi

# Fix sidebar.component.ts
file="projects/ngx-tailwindcss/src/lib/sidebar/sidebar.component.ts"
if [ -f "$file" ]; then
  echo "Checking sidebar.component.ts..."
  # Check which setters need getters
  for prop in position collapsible collapsed width mobileBreakpoint closeOnOutsideClick; do
    if grep -q "set $prop(" "$file" && ! grep -q "get $prop()" "$file"; then
      echo "  Need getter for: $prop"
    fi
  done
fi

# Fix spinner.component.ts
file="projects/ngx-tailwindcss/src/lib/spinner/spinner.component.ts"
if [ -f "$file" ]; then
  echo "Checking spinner.component.ts..."
  for prop in size thickness color label; do
    if grep -q "set $prop(" "$file" && ! grep -q "get $prop()" "$file"; then
      echo "  Need getter for: $prop"
    fi
  done
fi

# Fix modal.component.ts
file="projects/ngx-tailwindcss/src/lib/modal/modal.component.ts"
if [ -f "$file" ]; then
  echo "Checking modal.component.ts..."
  for prop in closeOnBackdropClick closeOnEscape showCloseButton autoFocus restoreFocus centered ariaLabelledBy ariaDescribedBy backdropClass panelClass; do
    if grep -q "set $prop(" "$file" && ! grep -q "get $prop()" "$file"; then
      echo "  Need getter for: $prop"
    fi
  done
fi

echo ""
echo "✅ Manual review needed for complex cases"
echo "Run tests to verify: pnpm run test:run"

