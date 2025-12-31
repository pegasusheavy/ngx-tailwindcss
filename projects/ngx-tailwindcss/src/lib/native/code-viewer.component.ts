import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CodeLanguage = 'json' | 'javascript' | 'typescript' | 'html' | 'css' | 'xml' | 'markdown' | 'text';

@Component({
  selector: 'tw-code-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-900 text-slate-100 font-mono text-sm">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div class="flex items-center gap-4">
          @if (filename()) {
            <span class="text-slate-400">{{ filename() }}</span>
          }
          @if (language()) {
            <span class="px-2 py-0.5 text-xs bg-slate-700 rounded">{{ language() }}</span>
          }
        </div>

        <div class="flex items-center gap-2">
          <!-- Search -->
          @if (showSearch()) {
            <div class="relative">
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                placeholder="Search..."
                class="w-48 px-3 py-1 text-sm bg-slate-700 border-none rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              @if (searchMatches().length > 0) {
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {{ currentMatchIndex() + 1 }}/{{ searchMatches().length }}
                </span>
              }
            </div>
            <button
              (click)="previousMatch()"
              class="p-1 text-slate-400 hover:text-slate-200"
              title="Previous match"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              (click)="nextMatch()"
              class="p-1 text-slate-400 hover:text-slate-200"
              title="Next match"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          }

          <!-- Word Wrap Toggle -->
          <button
            (click)="toggleWordWrap()"
            [class.text-blue-400]="wordWrap()"
            class="p-1 text-slate-400 hover:text-slate-200"
            title="Toggle word wrap"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <!-- Copy Button -->
          <button
            (click)="copyCode()"
            class="p-1 text-slate-400 hover:text-slate-200"
            title="Copy code"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Code Content -->
      <div class="flex-1 overflow-auto">
        <div class="flex min-h-full">
          <!-- Line Numbers -->
          @if (showLineNumbers()) {
            <div class="flex-shrink-0 px-3 py-4 text-right text-slate-500 bg-slate-800/50 select-none border-r border-slate-700">
              @for (line of lines(); track $index; let i = $index) {
                <div
                  [class.bg-blue-900/30]="highlightedLines().has(i + 1)"
                  class="leading-6"
                >
                  {{ i + 1 }}
                </div>
              }
            </div>
          }

          <!-- Code -->
          <pre
            class="flex-1 p-4 overflow-x-auto"
            [class.whitespace-pre-wrap]="wordWrap()"
            [class.whitespace-pre]="!wordWrap()"
          ><code>@for (line of lines(); track $index; let i = $index) {<div
              [class.bg-blue-900/30]="highlightedLines().has(i + 1)"
              [class.bg-yellow-900/30]="isMatchLine(i)"
              class="leading-6"
            >{{ line || ' ' }}</div>}</code></pre>
        </div>
      </div>

      <!-- Footer -->
      @if (showFooter()) {
        <div class="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-400">
          <span>{{ lines().length }} lines</span>
          <span>{{ byteSize() }}</span>
        </div>
      }
    </div>
  `,
})
export class TwCodeViewerComponent {
  public readonly code = input('');
  public readonly language = input<CodeLanguage>('text');
  public readonly filename = input('');
  public readonly showLineNumbers = input(true);
  public readonly showSearch = input(true);
  public readonly showFooter = input(true);
  public readonly highlightLines = input<number[]>([]);

  public readonly copied = output<void>();

  public readonly wordWrap = signal(false);
  public readonly searchQuery = signal('');
  public readonly currentMatchIndex = signal(0);

  public readonly lines = computed(() => this.code().split('\n'));
  public readonly highlightedLines = computed(() => new Set(this.highlightLines()));
  public readonly byteSize = computed(() => {
    const bytes = new Blob([this.code()]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  });

  public readonly searchMatches = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];

    const matches: number[] = [];
    this.lines().forEach((line, i) => {
      if (line.toLowerCase().includes(query)) {
        matches.push(i);
      }
    });
    return matches;
  });

  constructor() {
    effect(() => {
      // Reset match index when query changes
      this.searchQuery();
      this.currentMatchIndex.set(0);
    });
  }

  // Syntax highlighting removed to support zoneless mode (no DomSanitizer dependency)
  // For syntax highlighting, consider using a third-party library like Prism.js or highlight.js

  public isMatchLine(lineIndex: number): boolean {
    const matches = this.searchMatches();
    return matches.includes(lineIndex);
  }

  public nextMatch(): void {
    const matches = this.searchMatches();
    if (matches.length > 0) {
      this.currentMatchIndex.update(i => (i + 1) % matches.length);
    }
  }

  public previousMatch(): void {
    const matches = this.searchMatches();
    if (matches.length > 0) {
      this.currentMatchIndex.update(i => (i - 1 + matches.length) % matches.length);
    }
  }

  public toggleWordWrap(): void {
    this.wordWrap.update(v => !v);
  }

  public copyCode(): void {
    navigator.clipboard.writeText(this.code());
    this.copied.emit();
  }

}

