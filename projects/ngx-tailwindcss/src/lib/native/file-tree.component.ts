import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTreeEvent, FileTreeNode } from './native.types';

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
  templateUrl: './file-tree.component.html',
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
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}
