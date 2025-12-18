#!/usr/bin/env python3
"""
Script to add getters for setters to fix accessor-pairs lint errors.
"""

import re
import sys
from pathlib import Path

def add_getters_to_file(file_path: Path) -> bool:
    """Add getters for all setters that don't have them."""
    content = file_path.read_text()
    original_content = content

    # Pattern to match @Input() set without a preceding getter
    # This regex looks for @Input() followed by set, captures the type and name
    pattern = r'(@Input\(\))\s+set\s+(\w+)\(value:\s*([^)]+)\)\s*\{'

    matches = list(re.finditer(pattern, content))

    if not matches:
        return False

    # Process matches in reverse order to maintain positions
    for match in reversed(matches):
        decorator = match.group(1)
        prop_name = match.group(2)
        prop_type = match.group(3).strip()
        setter_start = match.start()

        # Check if there's already a getter before this setter
        # Look backwards from setter_start
        lines_before = content[:setter_start].split('\n')

        # Check last few lines for a getter
        has_getter = False
        for i in range(min(5, len(lines_before))):
            line_idx = -(i + 1)
            if f'get {prop_name}()' in lines_before[line_idx]:
                has_getter = True
                break

        if has_getter:
            continue

        # Find the signal name by looking at the setter body
        setter_match = re.search(
            r'set\s+' + prop_name + r'\(value:[^)]+\)\s*\{\s*this\.(\w+)\.set\(value\);',
            content[setter_start:setter_start + 200]
        )

        if not setter_match:
            continue

        signal_name = setter_match.group(1)

        # Create the getter
        getter = f'''{decorator} get {prop_name}(): {prop_type} {{
    return this.{signal_name}();
  }}
  '''

        # Insert getter before setter
        content = content[:setter_start] + getter + content[setter_start:]

    if content != original_content:
        file_path.write_text(content)
        return True

    return False

def main():
    """Main entry point."""
    project_dir = Path('projects/ngx-tailwindcss/src/lib')

    if not project_dir.exists():
        print(f"Error: {project_dir} not found")
        sys.exit(1)

    files = list(project_dir.rglob('*.ts'))
    files = [f for f in files if '.spec.' not in str(f)]

    print(f"Scanning {len(files)} files...")

    fixed_count = 0
    for file_path in files:
        try:
            if add_getters_to_file(file_path):
                print(f"✓ Added getters: {file_path}")
                fixed_count += 1
        except Exception as e:
            print(f"✗ Error processing {file_path}: {e}")

    print(f"\n✅ Added getters in {fixed_count} files")
    print("\nRun 'pnpm run test:run' to verify changes")

if __name__ == '__main__':
    main()

