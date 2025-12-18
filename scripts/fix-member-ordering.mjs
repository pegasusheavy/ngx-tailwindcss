#!/usr/bin/env node

/**
 * Script to fix TypeScript class member ordering issues
 * This addresses common lint errors
 */

import fs from 'fs';
import { execSync } from 'child_process';

// Get all component TypeScript files
const getAllComponentFiles = () => {
  try {
    const output = execSync(
      'find projects/ngx-tailwindcss/src/lib -name "*.component.ts" -not -name "*.spec.ts"',
      { encoding: 'utf-8' }
    );
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding files:', error);
    return [];
  }
};

// Fix common patterns in a file
const fixFile = (filePath) => {
  const originalContent = fs.readFileSync(filePath, 'utf-8');
  let content = originalContent;

  // Fix 1: Rename @Output properties that conflict with DOM events
  const outputPatterns = [
    [/@Output\(\)\s+change\s*=/g, '@Output() valueChange ='],
    [/this\.change\.emit/g, 'this.valueChange.emit'],
    [/@Output\(\)\s+toggle\s*=/g, '@Output() toggleChange ='],
    [/this\.toggle\.emit/g, 'this.toggleChange.emit'],
    [/@Output\(\)\s+open\s*=/g, '@Output() openChange ='],
    [/this\.open\.emit/g, 'this.openChange.emit'],
    [/@Output\(\)\s+close\s*=/g, '@Output() closeChange ='],
    [/this\.close\.emit/g, 'this.closeChange.emit'],
    [/@Output\(\)\s+select\s*=/g, '@Output() selectChange ='],
    [/this\.select\.emit/g, 'this.selectChange.emit'],
    [/@Output\(\)\s+focus\s*=/g, '@Output() focusChange ='],
    [/this\.focus\.emit/g, 'this.focusChange.emit'],
    [/@Output\(\)\s+blur\s*=/g, '@Output() blurChange ='],
    [/this\.blur\.emit/g, 'this.blurChange.emit'],
  ];

  for (const [pattern, replacement] of outputPatterns) {
    content = content.replace(pattern, replacement);
  }

  // Fix 2: Replace 'any' with 'unknown' in common patterns
  content = content.replace(/signal<any>/g, 'signal<unknown>');
  content = content.replace(/: any\)/g, ': unknown)');
  content = content.replace(/value: any(?!thing)/g, 'value: unknown');

  // Fix 3: Add 'u' flag to regex literals
  content = content.replace(/= \/([^/]+)\/([gimsy]*);/g, (match, pattern, flags) => {
    if (!flags.includes('u')) {
      return `= /${pattern}/${flags}u;`;
    }
    return match;
  });

  // Fix 4: Replace || with ?? for nullish coalescing in return statements
  content = content.replace(/return (.+?) \|\| null;/g, 'return $1 ?? null;');
  content = content.replace(/return (.+?) \|\| undefined;/g, 'return $1 ?? undefined;');

  // Fix 5: Replace short variable names in arrow functions
  content = content.replace(/\.update\(v\s*=>/g, '.update(value =>');
  content = content.replace(/\.forEach\(n\s*=>/g, '.forEach(node =>');
  content = content.replace(/\.map\(n\s*=>/g, '.map(node =>');
  content = content.replace(/\.filter\(n\s*=>/g, '.filter(node =>');
  content = content.replace(/\.find\(n\s*=>/g, '.find(node =>');
  content = content.replace(/\.some\(n\s*=>/g, '.some(node =>');
  content = content.replace(/\.every\(n\s*=>/g, '.every(node =>');

  // Fix 6: Add return types to protected methods that are missing them
  // Match: protected methodName(params) {
  // Add: : ReturnType
  content = content.replace(
    /(\n\s*protected\s+\w+\([^)]*\))\s*\{/g,
    '$1: void {'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
};

// Main execution
const main = () => {
  console.log('Finding component files...');
  const files = getAllComponentFiles();
  console.log(`Found ${files.length} component files\n`);

  let fixedCount = 0;
  for (const file of files) {
    if (fixFile(file)) {
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} files`);
  console.log('\nRun "pnpm run lint" to check remaining issues.');
};

main();
