#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const componentFiles = process.argv.slice(2);

for (const filePath of componentFiles) {
  console.log(`Processing: ${filePath}`);
  
  let content = readFileSync(filePath, 'utf-8');
  const dir = dirname(filePath);
  const baseName = filePath.replace(/\.component\.ts$/, '');
  
  // Extract inline template
  const templateMatch = content.match(/template:\s*`([\s\S]*?)`,?\s*\n/);
  if (templateMatch) {
    const template = templateMatch[1];
    const htmlFile = `${baseName}.component.html`;
    
    if (!existsSync(htmlFile)) {
      console.log(`  Creating: ${htmlFile}`);
      writeFileSync(htmlFile, template, 'utf-8');
      
      // Replace inline template with templateUrl
      content = content.replace(
        /template:\s*`[\s\S]*?`,?\s*\n/,
        `templateUrl: './${baseName.split('/').pop()}.component.html',\n`
      );
    }
  }
  
  // Extract inline styles
  const stylesMatch = content.match(/styles:\s*\[([\s\S]*?)\],?\s*\n/);
  if (stylesMatch) {
    const stylesContent = stylesMatch[1].trim();
    
    // Only extract if there's actual content (not just whitespace or empty string)
    if (stylesContent && stylesContent !== `''` && stylesContent !== '""') {
      const scssFile = `${baseName}.component.scss`;
      
      if (!existsSync(scssFile)) {
        // Parse the styles array and combine
        const styleStrings = stylesContent.match(/`([\s\S]*?)`/g) || [];
        const styles = styleStrings.map(s => s.slice(1, -1)).join('\n\n');
        
        if (styles.trim()) {
          console.log(`  Creating: ${scssFile}`);
          writeFileSync(scssFile, styles, 'utf-8');
          
          // Replace inline styles with styleUrls (or styleUrl for Angular 17+)
          content = content.replace(
            /styles:\s*\[[\s\S]*?\],?\s*\n/,
            `styleUrl: './${baseName.split('/').pop()}.component.scss',\n`
          );
        }
      }
    } else {
      // Remove empty styles array
      content = content.replace(/styles:\s*\[\s*\],?\s*\n/g, '');
    }
  }
  
  // Write updated component file
  writeFileSync(filePath, content, 'utf-8');
}

console.log('Done!');
