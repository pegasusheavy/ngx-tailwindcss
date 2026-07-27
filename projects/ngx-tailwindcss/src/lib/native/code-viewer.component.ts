import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CodeLanguage =
  'json' | 'javascript' | 'typescript' | 'html' | 'css' | 'xml' | 'markdown' | 'text';

@Component({
  selector: 'tw-code-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-viewer.component.html',
})
export class TwCodeViewerComponent {
  public readonly code = input('');
  public readonly language = input<CodeLanguage>('text');
  public readonly filename = input('');
  public readonly showLineNumbers = input(true);
  public readonly showSearch = input(true);
  public readonly showFooter = input(true);
  public readonly highlightLines = input<number[]>([]);

  public readonly copied = output();

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
    void navigator.clipboard.writeText(this.code());
    this.copied.emit();
  }
}
