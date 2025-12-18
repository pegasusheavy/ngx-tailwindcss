#!/bin/bash

# Add getters for all setters in TypeScript files
# This script uses a more comprehensive approach

set -e

echo "Adding getters for all @Input setters..."

find projects/ngx-tailwindcss/src/lib -name "*.component.ts" -not -name "*.spec.ts" | while read -r file; do
  echo "Processing: $file"

  # Use Python to handle this properly
  python3 << 'EOF' "$file"
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Find all @Input() set patterns
pattern = r'(@Input\(\))\s+set\s+(\w+)\((\w+):\s*([^)]+)\)\s*\{\s*this\.(_\w+)\.set\(\3\);?\s*\}'

matches = list(re.finditer(pattern, content, re.MULTILINE))

if not matches:
    sys.exit(0)

# Process in reverse to maintain positions
for match in reversed(matches):
    decorator = match.group(1)
    prop_name = match.group(2)
    param_name = match.group(3)
    prop_type = match.group(4).strip()
    signal_name = match.group(5)
    setter_start = match.start()

    # Check if getter already exists
    getter_pattern = f'get {prop_name}\\(\\)'
    if re.search(getter_pattern, content[:setter_start]):
        continue

    # Create getter
    getter = f'''{decorator} get {prop_name}(): {prop_type} {{
    return this.{signal_name}();
  }}
  '''

    # Insert getter before setter
    content = content[:setter_start] + getter + content[setter_start:]

with open(file_path, 'w') as f:
    f.write(content)

print(f"  ✓ Processed {file_path}")
EOF

done

echo ""
echo "✅ Added getters!"
echo ""
echo "Running tests..."
pnpm run test:run >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Tests pass!"
  pnpm run lint 2>&1 | grep "✖"
else
  echo "❌ Tests failed!"
  exit 1
fi

