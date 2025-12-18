#!/usr/bin/env node

/**
 * Comprehensive member ordering fixer for TypeScript classes
 * Reorders class members according to @typescript-eslint/member-ordering rules
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const MEMBER_ORDER = {
  // Static fields
  'public-static-field': 0,
  'protected-static-field': 1,
  'private-static-field': 2,

  // Decorated fields (@Input, @Output, @ViewChild, etc.)
  'public-decorated-field': 3,
  'protected-decorated-field': 4,
  'private-decorated-field': 5,

  // Instance fields
  'public-instance-field': 6,
  'protected-instance-field': 7,
  'private-instance-field': 8,

  // Constructor
  'constructor': 9,

  // Lifecycle methods
  'lifecycle-method': 10,

  // Static methods
  'public-static-method': 11,
  'protected-static-method': 12,
  'private-static-method': 13,

  // Decorated methods
  'public-decorated-method': 14,
  'protected-decorated-method': 15,
  'private-decorated-method': 16,

  // Instance methods
  'public-instance-method': 17,
  'protected-instance-method': 18,
  'private-instance-method': 19,
};

const LIFECYCLE_METHODS = [
  'ngOnChanges', 'ngOnInit', 'ngDoCheck', 'ngAfterContentInit',
  'ngAfterContentChecked', 'ngAfterViewInit', 'ngAfterViewChecked',
  'ngOnDestroy'
];

function classifyMember(memberText) {
  const trimmed = memberText.trim();

  // Check for decorators
  const hasDecorator = /@(Input|Output|ViewChild|ViewChildren|ContentChild|ContentChildren|HostBinding|HostListener)/.test(trimmed);

  // Check for static
  const isStatic = /^\s*(public|protected|private)?\s*static\s/.test(trimmed);

  // Check for constructor
  if (/constructor\s*\(/.test(trimmed)) {
    return 'constructor';
  }

  // Check for lifecycle methods
  for (const lifecycle of LIFECYCLE_METHODS) {
    if (new RegExp(`\\b${lifecycle}\\s*\\(`).test(trimmed)) {
      return 'lifecycle-method';
    }
  }

  // Determine visibility
  let visibility = 'public';
  if (/^\s*private\s/.test(trimmed)) {
    visibility = 'private';
  } else if (/^\s*protected\s/.test(trimmed)) {
    visibility = 'protected';
  }

  // Check if method or field
  const isMethod = /\(.*\)\s*(\{|:)/.test(trimmed) && !trimmed.includes('=');

  if (hasDecorator) {
    return isMethod ? `${visibility}-decorated-method` : `${visibility}-decorated-field`;
  }

  if (isStatic) {
    return isMethod ? `${visibility}-static-method` : `${visibility}-static-field`;
  }

  return isMethod ? `${visibility}-instance-method` : `${visibility}-instance-field`;
}

function extractClassMembers(content, className) {
  // Find the class
  const classRegex = new RegExp(`export class ${className}[^{]*\\{`, 'g');
  const match = classRegex.exec(content);

  if (!match) {
    return null;
  }

  const classStart = match.index + match[0].length;

  // Find matching closing brace
  let braceCount = 1;
  let pos = classStart;
  while (braceCount > 0 && pos < content.length) {
    if (content[pos] === '{') braceCount++;
    if (content[pos] === '}') braceCount--;
    pos++;
  }

  const classEnd = pos - 1;
  const classBody = content.substring(classStart, classEnd);

  // Split into members
  const members = [];
  let currentMember = '';
  let braceDepth = 0;
  let parenDepth = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;

  for (let i = 0; i < classBody.length; i++) {
    const char = classBody[i];
    const nextChar = classBody[i + 1];

    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && !inComment) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar && classBody[i - 1] !== '\\') {
        inString = false;
      }
    }

    // Handle comments
    if (!inString) {
      if (char === '/' && nextChar === '/') {
        inComment = true;
      }
      if (char === '\n' && inComment) {
        inComment = false;
      }
    }

    if (!inString && !inComment) {
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
      if (char === '(') parenDepth++;
      if (char === ')') parenDepth--;
    }

    currentMember += char;

    // End of member
    if (braceDepth === 0 && parenDepth === 0 && !inString && !inComment) {
      if ((char === ';' || char === '}') && currentMember.trim()) {
        const trimmed = currentMember.trim();
        if (trimmed && !trimmed.match(/^\/\//)) {
          members.push(currentMember);
          currentMember = '';
        }
      } else if (char === '\n' && currentMember.trim() === '') {
        currentMember = '';
      }
    }
  }

  // Add any remaining member
  if (currentMember.trim()) {
    members.push(currentMember);
  }

  return {
    beforeClass: content.substring(0, classStart),
    members: members.filter(m => m.trim()),
    afterClass: content.substring(classEnd),
    classStart,
    classEnd
  };
}

function reorderMembers(members) {
  const classified = members.map(member => ({
    text: member,
    type: classifyMember(member),
    order: MEMBER_ORDER[classifyMember(member)] ?? 999,
    propertyName: extractPropertyName(member)
  }));

  // Group getter/setter pairs
  const grouped = [];
  const processed = new Set();

  for (let i = 0; i < classified.length; i++) {
    if (processed.has(i)) continue;

    const member = classified[i];
    grouped.push(member);
    processed.add(i);

    // If this is a getter or setter, find its pair
    if (member.propertyName && (member.text.includes(' get ') || member.text.includes(' set '))) {
      for (let j = i + 1; j < classified.length; j++) {
        if (processed.has(j)) continue;

        const other = classified[j];
        if (other.propertyName === member.propertyName &&
            other.order === member.order &&
            ((member.text.includes(' get ') && other.text.includes(' set ')) ||
             (member.text.includes(' set ') && other.text.includes(' get ')))) {
          grouped.push(other);
          processed.add(j);
          break;
        }
      }
    }
  }

  // Sort by order, keeping pairs together
  grouped.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    // Keep original relative order for same type
    return 0;
  });

  return grouped;
}

function extractPropertyName(memberText) {
  const getMatch = memberText.match(/get\s+(\w+)\s*\(/);
  if (getMatch) return getMatch[1];

  const setMatch = memberText.match(/set\s+(\w+)\s*\(/);
  if (setMatch) return setMatch[1];

  return null;
}

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  // Find all exported classes
  const classMatches = content.matchAll(/export class (\w+)/g);
  const classes = [...classMatches].map(m => m[1]);

  if (classes.length === 0) {
    return false;
  }

  let newContent = content;
  let modified = false;

  // Process each class
  for (const className of classes) {
    const extracted = extractClassMembers(newContent, className);

    if (!extracted || extracted.members.length === 0) {
      continue;
    }

    const reordered = reorderMembers(extracted.members);

    // Check if order changed
    let orderChanged = false;
    for (let i = 0; i < extracted.members.length; i++) {
      if (extracted.members[i].trim() !== reordered[i].text.trim()) {
        orderChanged = true;
        break;
      }
    }

    if (orderChanged) {
      const newClassBody = reordered.map(m => m.text).join('\n');
      newContent = extracted.beforeClass + '\n' + newClassBody + '\n' + extracted.afterClass;
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, newContent);
    return true;
  }

  return false;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach(file => {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.ts') && !file.includes('.spec.') && !file.endsWith('.d.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

async function main() {
  console.log('🔧 Fixing member ordering in all TypeScript files...\n');

  const files = getAllFiles('projects/ngx-tailwindcss/src/lib');

  console.log(`Found ${files.length} files to process\n`);

  let fixedCount = 0;

  for (const file of files) {
    try {
      if (processFile(file)) {
        console.log(`✓ Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  }

  console.log(`\n✅ Fixed member ordering in ${fixedCount} files`);
}

main().catch(console.error);

