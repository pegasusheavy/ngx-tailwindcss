#!/bin/bash

# This script moves private readonly inject() fields to after @Input/@Output decorators
# to fix member-ordering errors

for file in $(find projects/ngx-tailwindcss/src/lib -name "*.component.ts" -not -name "*.spec.ts"); do
  # Check if file has the pattern: private readonly ... = inject(
  if grep -q "private readonly.*= inject(" "$file"; then
    echo "Processing: $file"
    
    # Create a temp file
    tmpfile=$(mktemp)
    
    # This is a simple heuristic: extract inject lines, remove them, then add them back after @Output
    python3 << 'PYTHON' "$file" "$tmpfile"
import sys
import re

file_path = sys.argv[1]
tmp_path = sys.argv[2]

with open(file_path, 'r') as f:
    content = f.read()

# Find all private readonly inject lines
inject_pattern = r'  private readonly \w+ = inject\([^)]+\);\n'
inject_lines = re.findall(inject_pattern, content)

if not inject_lines:
    # No changes needed
    with open(tmp_path, 'w') as f:
        f.write(content)
    sys.exit(0)

# Remove inject lines from their current position
for line in inject_lines:
    content = content.replace(line, '', 1)

# Find the last @Output or @Input line
last_decorator_match = None
for match in re.finditer(r'  @(Input|Output|ViewChild|ContentChild|ContentChildren|ViewChildren)\([^)]*\)[^\n]+\n(?:  [^\n]+\n)*', content):
    last_decorator_match = match

if last_decorator_match:
    # Insert inject lines after the last decorator
    insert_pos = last_decorator_match.end()
    inject_block = '\n' + ''.join(inject_lines)
    content = content[:insert_pos] + inject_block + content[insert_pos:]

with open(tmp_path, 'w') as f:
    f.write(content)
PYTHON
    
    # Replace original if different
    if ! cmp -s "$file" "$tmpfile"; then
      mv "$tmpfile" "$file"
      echo "  ✓ Fixed"
    else
      rm "$tmpfile"
    fi
  fi
done

echo "Done!"
