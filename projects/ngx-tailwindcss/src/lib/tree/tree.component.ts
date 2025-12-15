import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
  numberAttribute,
  inject,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface TreeNode {
  key?: string | number;
  label: string;
  icon?: TemplateRef<any>;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  visible?: boolean;
  children?: TreeNode[];
  data?: any;
  badge?: string;
  styleClass?: string;
}

export type TreeSelectionMode = 'none' | 'single' | 'multiple' | 'checkbox';

/**
 * Tree component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-tree [nodes]="treeNodes" selectionMode="checkbox"></tw-tree>
 * <tw-tree [nodes]="nodes" (onNodeSelect)="handleSelect($event)"></tw-tree>
 * ```
 */
@Component({
  selector: 'tw-tree',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree.component.html',
})
export class TwTreeComponent {
  private twClass = inject(TwClassService);

  /** Tree nodes */
  @Input() nodes: TreeNode[] = [];

  /** Selection mode */
  @Input() selectionMode: TreeSelectionMode = 'none';

  /** Indent size in pixels */
  @Input({ transform: numberAttribute }) indentSize = 24;

  /** Whether to propagate selection to children */
  @Input() propagateSelectionDown = true;

  /** Whether to propagate selection to parent */
  @Input() propagateSelectionUp = true;

  /** Additional classes */
  @Input() classOverride = '';

  /** Node select event */
  @Output() onNodeSelect = new EventEmitter<TreeNode>();

  /** Node unselect event */
  @Output() onNodeUnselect = new EventEmitter<TreeNode>();

  /** Node expand event */
  @Output() onNodeExpand = new EventEmitter<TreeNode>();

  /** Node collapse event */
  @Output() onNodeCollapse = new EventEmitter<TreeNode>();

  /** Selection change event */
  @Output() selectionChange = new EventEmitter<TreeNode[]>();

  protected selection = signal<TreeNode[]>([]);

  protected containerClasses = computed(() => {
    return this.twClass.merge(
      'py-2',
      this.classOverride
    );
  });

  protected nodeClasses(node: TreeNode, level: number) {
    return this.twClass.merge(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
      'hover:bg-slate-100',
      node.selected ? 'bg-blue-50' : '',
      node.disabled ? 'opacity-50 cursor-not-allowed' : '',
      node.styleClass || ''
    );
  }

  protected labelClasses(node: TreeNode) {
    return this.twClass.merge(
      'text-sm select-none',
      node.disabled ? 'text-slate-400' : 'text-slate-700'
    );
  }

  isSelected(node: TreeNode): boolean {
    return this.selection().includes(node);
  }

  isIndeterminate(node: TreeNode): boolean {
    if (!node.children || node.children.length === 0) return false;

    const selectedChildren = this.getSelectedDescendants(node);
    const allChildren = this.getAllDescendants(node);

    return selectedChildren.length > 0 && selectedChildren.length < allChildren.length;
  }

  onNodeClick(node: TreeNode): void {
    if (node.disabled) return;

    // Toggle expand/collapse if node has children
    if (node.children && node.children.length > 0) {
      this.toggleNode(node);
    }

    // Handle selection
    if (this.selectionMode === 'single') {
      this.selection.set([node]);
      this.onNodeSelect.emit(node);
      this.selectionChange.emit(this.selection());
    } else if (this.selectionMode === 'multiple') {
      const current = this.selection();
      if (current.includes(node)) {
        this.selection.set(current.filter(n => n !== node));
        this.onNodeUnselect.emit(node);
      } else {
        this.selection.set([...current, node]);
        this.onNodeSelect.emit(node);
      }
      this.selectionChange.emit(this.selection());
    }
  }

  onCheckboxChange(node: TreeNode, event: Event): void {
    if (node.disabled) return;

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectNode(node);
    } else {
      this.unselectNode(node);
    }

    this.selectionChange.emit(this.selection());
  }

  toggleNode(node: TreeNode): void {
    node.expanded = !node.expanded;

    if (node.expanded) {
      this.onNodeExpand.emit(node);
    } else {
      this.onNodeCollapse.emit(node);
    }
  }

  private selectNode(node: TreeNode): void {
    const current = this.selection();
    if (!current.includes(node)) {
      this.selection.set([...current, node]);
      this.onNodeSelect.emit(node);
    }

    if (this.propagateSelectionDown && node.children) {
      node.children.forEach(child => this.selectNode(child));
    }
  }

  private unselectNode(node: TreeNode): void {
    this.selection.set(this.selection().filter(n => n !== node));
    this.onNodeUnselect.emit(node);

    if (this.propagateSelectionDown && node.children) {
      node.children.forEach(child => this.unselectNode(child));
    }
  }

  private getSelectedDescendants(node: TreeNode): TreeNode[] {
    const selected: TreeNode[] = [];

    const traverse = (n: TreeNode) => {
      if (this.selection().includes(n)) {
        selected.push(n);
      }
      if (n.children) {
        n.children.forEach(traverse);
      }
    };

    if (node.children) {
      node.children.forEach(traverse);
    }

    return selected;
  }

  private getAllDescendants(node: TreeNode): TreeNode[] {
    const descendants: TreeNode[] = [];

    const traverse = (n: TreeNode) => {
      descendants.push(n);
      if (n.children) {
        n.children.forEach(traverse);
      }
    };

    if (node.children) {
      node.children.forEach(traverse);
    }

    return descendants;
  }

  /** Expand all nodes */
  expandAll(): void {
    const expandNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          node.expanded = true;
          expandNodes(node.children);
        }
      });
    };
    expandNodes(this.nodes);
  }

  /** Collapse all nodes */
  collapseAll(): void {
    const collapseNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        node.expanded = false;
        if (node.children) {
          collapseNodes(node.children);
        }
      });
    };
    collapseNodes(this.nodes);
  }

  /** Get selected nodes */
  getSelection(): TreeNode[] {
    return this.selection();
  }

  /** Clear selection */
  clearSelection(): void {
    this.selection.set([]);
    this.selectionChange.emit([]);
  }
}

