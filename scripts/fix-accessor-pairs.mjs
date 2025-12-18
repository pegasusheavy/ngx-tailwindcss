#!/usr/bin/env node

/**
 * Fix accessor pairs - ensure getters and setters are adjacent
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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

function fixAccessorPairs(content) {
  let modified = false;

  // Find all getters with their positions
  const getterRegex = /@Input\(\)\s+get\s+(\w+)\s*\([^)]*\)\s*:\s*[^{]+\{[^}]+\}/g;
  const getters = new Map();
  let match;

  while ((match = getterRegex.exec(content)) !== null) {
    const propName = match[1];
    getters.set(propName, {
      text: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }

  // Find all setters
  const setterRegex = /set\s+(\w+)\s*\([^)]+\)\s*\{[^}]+\}/g;
  const setters = new Map();

  while ((match = setterRegex.exec(content)) !== null) {
    const propName = match[1];
    setters.set(propName, {
      text: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }

  // For each getter, ensure its setter is immediately after
  const replacements = [];
  const processedSetters = new Set();

  for (const [propName, getter] of getters) {
    const setter = setters.get(propName);
    if (!setter || processedSetters.has(propName)) continue;

    // Check if setter is immediately after getter (allowing for whitespace/newlines)
    const textBetween = content.substring(getter.end, setter.start);
    const hasOnlyWhitespace = textBetween.trim() === '';

    // If setter is NOT immediately after getter, we need to move it
    if (!hasOnlyWhitespace && setter.start > getter.end) {
      // Mark this property as processed
      processedSetters.add(propName);

      // Find the newline before the setter to remove the whole line
      let setterLineStart = setter.start;
      while (setterLineStart > 0 && content[setterLineStart - 1] !== '\n') {
        setterLineStart--;
      }

      // Find the newline after the setter
      let setterLineEnd = setter.end;
      while (setterLineEnd < content.length && content[setterLineEnd] !== '\n') {
        setterLineEnd++;
      }
      if (setterLineEnd < content.length) setterLineEnd++; // Include the newline

      // Remove setter from its current location (including the line)
      replacements.push({
        start: setterLineStart,
        end: setterLineEnd,
        replacement: '',
        propName
      });

      // Add setter right after getter
      replacements.push({
        start: getter.end,
        end: getter.end,
        replacement: '\n  ' + setter.text.trim(),
        propName
      });

      modified = true;
    }
  }

  // Apply replacements in reverse order to maintain positions
  replacements.sort((a, b) => b.start - a.start);

  let result = content;
  for (const { start, end, replacement } of replacements) {
    result = result.substring(0, start) + replacement + result.substring(end);
  }

  return { modified, content: result };
}

function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { modified, content: newContent } = fixAccessorPairs(content);

    if (modified) {
      writeFileSync(filePath, newContent);
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }

  return false;
}

async function main() {
  console.log('🔧 Fixing accessor pairs (getter/setter adjacency)...\n');

  const files = getAllFiles('projects/ngx-tailwindcss/src/lib');

  console.log(`Found ${files.length} files to process\n`);

  let fixedCount = 0;

  for (const file of files) {
    if (processFile(file)) {
      console.log(`✓ Fixed: ${file}`);
      fixedCount++;
    }
  }

  console.log(`\n✅ Fixed accessor pairs in ${fixedCount} files`);
}

main().catch(console.error);

