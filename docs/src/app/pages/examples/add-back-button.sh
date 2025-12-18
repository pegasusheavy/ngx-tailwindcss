#!/bin/bash

# For each example HTML file, add a back button to the navigation if it doesn't exist
for file in *.component.html; do
  # Check if the file has a "back to docs" button already
  if ! grep -q "Back to Docs\|Back to Documentation" "$file"; then
    echo "Adding back button to $file"
    
    # Different approach for each file based on structure
    case "$file" in
      "saas-landing.component.html")
        # Add after the logo div, before nav links
        sed -i '/<div class="hidden md:flex items-center gap-8">/i\        <a href="/" class="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
      "forum.component.html")
        # Add after the logo, before search
        sed -i '/<div class="flex-1 max-w-md mx-4">/i\        <a href="/" class="hidden md:flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors border-l border-slate-200 ml-4 pl-4">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
      "social-network.component.html")
        # Add after search, before actions
        sed -i '/<div class="flex items-center gap-2">/i\        <a href="/" class="hidden md:flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
      "admin-dashboard.component.html")
        # Add after logo
        sed -i '/<div class="flex items-center gap-3">/i\        <a href="/" class="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors border-r border-slate-200 mr-4 pr-4">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
      "ecommerce.component.html")
        # Add after logo
        sed -i '/<div class="flex-1 max-w-md mx-8">/i\        <a href="/" class="hidden md:flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors border-r border-slate-200 mr-4 pr-4">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
      "portfolio.component.html")
        # Add after logo
        sed -i '/<div class="flex items-center gap-8">/i\        <a href="/" class="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors border-r border-slate-200 mr-4 pr-4">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n          </svg>\n          <span>Back to Docs</span>\n        </a>\n' "$file"
        ;;
    esac
  fi
done

echo "Back buttons added to all example pages!"
