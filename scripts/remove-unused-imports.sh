#!/bin/bash

# Remove obvious unused imports based on lint errors

set -e

echo "Removing unused imports..."

# Fix 1: Remove unused imports from specific files
# accordion.component.ts - remove HostBinding
sed -i 's/, HostBinding//g' projects/ngx-tailwindcss/src/lib/accordion/accordion.component.ts
sed -i 's/HostBinding, //g' projects/ngx-tailwindcss/src/lib/accordion/accordion.component.ts

# Fix 2: Remove unused AriaUtils
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sed -i 's/, AriaUtils//g' {} \;
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sed -i 's/AriaUtils, //g' {} \;
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sed -i '/^import.*AriaUtils.*$/d' {} \;

# Fix 3: Remove computed if unused
if grep -q "import.*computed" projects/ngx-tailwindcss/src/lib/divider/divider.component.ts; then
  if ! grep -q "computed(" projects/ngx-tailwindcss/src/lib/divider/divider.component.ts; then
    sed -i 's/, computed//g' projects/ngx-tailwindcss/src/lib/divider/divider.component.ts
    sed -i 's/computed, //g' projects/ngx-tailwindcss/src/lib/divider/divider.component.ts
  fi
fi

# Fix 4: Remove numberAttribute if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "numberAttribute" "$file" && ! grep -q "numberAttribute)" "$file"; then
    sed -i "s/, numberAttribute//g" "$file"
    sed -i "s/numberAttribute, //g" "$file"
  fi
' _ {} \;

# Fix 5: Remove OnInit if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "import.*OnInit" "$file"; then
    if ! grep -q "implements.*OnInit" "$file" && ! grep -q "OnInit {" "$file"; then
      sed -i "s/, OnInit//g" "$file"
      sed -i "s/OnInit, //g" "$file"
    fi
  fi
' _ {} \;

# Fix 6: Remove AfterContentInit if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "import.*AfterContentInit" "$file"; then
    if ! grep -q "implements.*AfterContentInit" "$file"; then
      sed -i "s/, AfterContentInit//g" "$file"
      sed -i "s/AfterContentInit, //g" "$file"
    fi
  fi
' _ {} \;

# Fix 7: Remove ContentChild if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "import.*ContentChild" "$file"; then
    if ! grep -q "@ContentChild" "$file"; then
      sed -i "s/, ContentChild//g" "$file"
      sed -i "s/ContentChild, //g" "$file"
    fi
  fi
' _ {} \;

# Fix 8: Remove signal if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "import.*signal" "$file"; then
    if ! grep -q "signal(" "$file" && ! grep -q "signal<" "$file"; then
      sed -i "s/, signal//g" "$file"
      sed -i "s/signal, //g" "$file"
    fi
  fi
' _ {} \;

# Fix 9: Remove ReactiveFormsModule if unused
find projects/ngx-tailwindcss/src/lib -name "*.ts" -exec sh -c '
  file="$1"
  if grep -q "import.*ReactiveFormsModule" "$file"; then
    if ! grep -q "ReactiveFormsModule" "$file" | grep -v "^import"; then
      sed -i "s/, ReactiveFormsModule//g" "$file"
      sed -i "s/ReactiveFormsModule, //g" "$file"
      sed -i "/^import.*ReactiveFormsModule.*$/d" "$file"
    fi
  fi
' _ {} \;

echo ""
echo "✅ Removed unused imports!"
echo ""
echo "Running tests..."
pnpm run test:run >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Tests pass!"
  echo ""
  echo "Checking lint improvements..."
  pnpm run lint 2>&1 | grep "✖"
else
  echo "❌ Tests failed!"
  exit 1
fi

