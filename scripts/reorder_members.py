#!/usr/bin/env python3
"""
Script to reorder TypeScript class members to fix @typescript-eslint/member-ordering errors.

Expected order:
1. Static fields
2. Decorated fields (@Input, @Output, @ViewChild, @ContentChild, etc.)
3. Public instance fields
4. Protected instance fields
5. Private instance fields
6. Constructor
7. Lifecycle methods (ngOnInit, ngOnDestroy, etc.)
8. Public methods
9. Protected methods
10. Private methods
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

LIFECYCLE_METHODS = [
    'ngOnChanges', 'ngOnInit', 'ngDoCheck', 'ngAfterContentInit',
    'ngAfterContentChecked', 'ngAfterViewInit', 'ngAfterViewChecked',
    'ngOnDestroy'
]

def extract_class_members(content: str) -> Tuple[str, List[Dict], str]:
    """Extract class members from TypeScript file."""
    # Find the class
    class_match = re.search(r'export class (\w+).*?\{', content, re.DOTALL)
    if not class_match:
        return content, [], ''

    class_start = class_match.end()

    # Find the closing brace of the class
    brace_count = 1
    pos = class_start
    while brace_count > 0 and pos < len(content):
        if content[pos] == '{':
            brace_count += 1
        elif content[pos] == '}':
            brace_count -= 1
        pos += 1

    class_body = content[class_start:pos-1]
    before_class = content[:class_start]
    after_class = content[pos-1:]

    return before_class, parse_members(class_body), after_class

def parse_members(class_body: str) -> List[Dict]:
    """Parse class body into individual members."""
    members = []
    lines = class_body.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip empty lines and comments at top level
        if not line or line.startswith('//'):
            i += 1
            continue

        # Detect member start
        member_lines = [lines[i]]
        i += 1

        # Collect full member (handle multi-line)
        brace_count = member_lines[0].count('{') - member_lines[0].count('}')
        paren_count = member_lines[0].count('(') - member_lines[0].count(')')

        while i < len(lines) and (brace_count > 0 or paren_count > 0 or
                                   not lines[i].strip() or
                                   (lines[i].strip() and not re.match(r'^\s*(private|protected|public|@|constructor|static)', lines[i]))):
            member_lines.append(lines[i])
            brace_count += lines[i].count('{') - lines[i].count('}')
            paren_count += lines[i].count('(') - lines[i].count(')')
            i += 1
            if brace_count <= 0 and paren_count <= 0:
                break

        member_text = '\n'.join(member_lines)
        member_type = classify_member(member_text)

        members.append({
            'text': member_text,
            'type': member_type,
            'order': get_order(member_type)
        })

    return members

def classify_member(text: str) -> str:
    """Classify a class member."""
    # Check for decorators
    if '@Input' in text or '@Output' in text or '@ViewChild' in text or '@ContentChild' in text or '@ContentChildren' in text or '@ViewChildren' in text or '@HostBinding' in text or '@HostListener' in text:
        return 'decorated'

    # Check for static
    if re.search(r'^\s*static\s', text, re.MULTILINE):
        return 'static'

    # Check for constructor
    if 'constructor(' in text:
        return 'constructor'

    # Check visibility
    is_private = re.search(r'^\s*private\s', text, re.MULTILINE)
    is_protected = re.search(r'^\s*protected\s', text, re.MULTILINE)
    is_public = not is_private and not is_protected

    # Check if it's a method or field
    is_method = '(' in text.split('=')[0] if '=' in text else '(' in text

    # Check if it's a lifecycle method
    for lifecycle in LIFECYCLE_METHODS:
        if f'{lifecycle}(' in text:
            return 'lifecycle'

    if is_method:
        if is_private:
            return 'private-method'
        elif is_protected:
            return 'protected-method'
        else:
            return 'public-method'
    else:
        if is_private:
            return 'private-field'
        elif is_protected:
            return 'protected-field'
        else:
            return 'public-field'

def get_order(member_type: str) -> int:
    """Get the sort order for a member type."""
    order_map = {
        'static': 0,
        'decorated': 1,
        'public-field': 2,
        'protected-field': 3,
        'private-field': 4,
        'constructor': 5,
        'lifecycle': 6,
        'public-method': 7,
        'protected-method': 8,
        'private-method': 9,
    }
    return order_map.get(member_type, 999)

def reorder_class(file_path: Path) -> bool:
    """Reorder class members in a TypeScript file."""
    content = file_path.read_text()

    before_class, members, after_class = extract_class_members(content)

    if not members:
        return False

    # Sort members
    members.sort(key=lambda m: m['order'])

    # Rebuild class
    new_body = '\n'.join(m['text'] for m in members)
    new_content = before_class + new_body + '\n' + after_class

    if new_content != content:
        file_path.write_text(new_content)
        return True

    return False

def main():
    """Main entry point."""
    # Find all component files
    project_dir = Path('projects/ngx-tailwindcss/src/lib')

    if not project_dir.exists():
        print(f"Error: {project_dir} not found")
        sys.exit(1)

    files = list(project_dir.rglob('*.component.ts'))
    files = [f for f in files if '.spec.' not in str(f)]

    print(f"Found {len(files)} component files")

    fixed_count = 0
    for file_path in files:
        try:
            if reorder_class(file_path):
                print(f"✓ Reordered: {file_path}")
                fixed_count += 1
        except Exception as e:
            print(f"✗ Error processing {file_path}: {e}")

    print(f"\n✅ Reordered {fixed_count} files")

if __name__ == '__main__':
    main()

