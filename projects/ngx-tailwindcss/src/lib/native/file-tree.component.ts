import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTreeNode, FileTreeEvent } from './native.types';

/**
 * File tree / explorer component
 * Displays hierarchical file/folder structure with expand/collapse
 *
 * @example
 * ```html
 * <tw-file-tree [nodes]="files" (nodeSelect)="onFileSelect($event)"></tw-file-tree>
 * ```
 */
@Component({
  selector: 'tw-file-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-sm select-none" role="tree" [attr.aria-label]="'File tree'">
      @for (node of nodes(); track node.id) {
        <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node, depth: 0 }"></ng-container>
      }
    </div>

    <ng-template #nodeTemplate let-node let-depth="depth">
      <div>
        <div
          class="flex items-center gap-1 py-0.5 pr-2 rounded cursor-pointer transition-colors"
          [style.padding-left.px]="8 + depth * 16"
          [class.bg-blue-100]="node.selected"
          [class.dark:bg-blue-900/30]="node.selected"
          [class.hover:bg-gray-100]="!node.selected"
          [class.dark:hover:bg-gray-700/50]="!node.selected"
          role="treeitem"
          [attr.aria-selected]="node.selected"
          [attr.aria-expanded]="node.type === 'folder' ? node.expanded : undefined"
          (click)="onNodeClick(node)"
          (dblclick)="onNodeDoubleClick(node)"
        >
          <!-- Expand/collapse chevron for folders -->
          @if (node.type === 'folder') {
            <button
              type="button"
              class="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              (click)="toggleExpand(node, $event)"
            >
              <svg
                class="w-3 h-3 transition-transform"
                [class.rotate-90]="node.expanded"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"/>
              </svg>
            </button>
          } @else {
            <span class="w-4"></span>
          }

          <!-- Icon -->
          <span class="flex-shrink-0">
            @if (node.icon) {
              <span>{{ node.icon }}</span>
            } @else if (node.type === 'folder') {
              @if (node.expanded) {
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd"/>
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"/>
                </svg>
              } @else {
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
              }
            } @else {
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
              </svg>
            }
          </span>

          <!-- Name -->
          <span
            class="flex-1 truncate"
            [class.text-gray-900]="!node.selected"
            [class.dark:text-gray-100]="!node.selected"
            [class.text-blue-700]="node.selected"
            [class.dark:text-blue-300]="node.selected"
          >
            {{ node.name }}
          </span>

          <!-- File info (optional) -->
          @if (showSize() && node.type === 'file' && node.size !== undefined) {
            <span class="text-xs text-gray-400">{{ formatSize(node.size) }}</span>
          }
        </div>

        <!-- Children -->
        @if (node.type === 'folder' && node.expanded && node.children?.length) {
          <div role="group">
            @for (child of node.children; track child.id) {
              <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: child, depth: depth + 1 }"></ng-container>
            }
          </div>
        }
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-file-tree block',
  },
})
export class TwFileTreeComponent {
  // Inputs
  public readonly nodes = input<FileTreeNode[]>([]);
  public readonly showSize = input(false);
  public readonly showDate = input(false);
  public readonly multiSelect = input(false);

  // Outputs
  public readonly nodeSelect = output<FileTreeEvent>();
  public readonly nodeExpand = output<FileTreeEvent>();
  public readonly nodeCollapse = output<FileTreeEvent>();
  public readonly nodeDoubleClick = output<FileTreeEvent>();

  // State
  protected readonly selectedNodes = signal<Set<string>>(new Set());

  protected onNodeClick(node: FileTreeNode): void {
    // Clear previous selection if not multi-select
    if (!this.multiSelect()) {
      this.clearSelection(this.nodes());
    }

    node.selected = true;
    this.nodeSelect.emit({ node, action: 'select' });
  }

  protected onNodeDoubleClick(node: FileTreeNode): void {
    if (node.type === 'folder') {
      this.toggleExpand(node);
    } else {
      this.nodeDoubleClick.emit({ node, action: 'select' });
    }
  }

  protected toggleExpand(node: FileTreeNode, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    if (node.type !== 'folder') return;

    node.expanded = !node.expanded;

    if (node.expanded) {
      this.nodeExpand.emit({ node, action: 'expand' });
    } else {
      this.nodeCollapse.emit({ node, action: 'collapse' });
    }
  }

  private clearSelection(nodes: FileTreeNode[]): void {
    for (const node of nodes) {
      node.selected = false;
      if (node.children?.length) {
        this.clearSelection(node.children);
      }
    }
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}

