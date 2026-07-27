import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  input,
  numberAttribute,
  Output,
  QueryList,
  signal,
  TemplateRef,
  ViewChildren,
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

interface TreeNodeViewState {
  selected: boolean;
  indeterminate: boolean;
  nodeClass: string;
  labelClass: string;
}

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
  private readonly twClass = inject(TwClassService);

  @ViewChildren('treeNodeRow') private readonly nodeRows!: QueryList<ElementRef<HTMLElement>>;

  /** Tree nodes */
  readonly nodes = input<TreeNode[]>([]);

  /** Selection mode */
  readonly selectionMode = input<TreeSelectionMode>('none');

  /** Indent size in pixels */
  readonly indentSize = input(24, { transform: numberAttribute });

  /** Whether to propagate selection to children */
  readonly propagateSelectionDown = input(true);

  /** Whether to propagate selection to parent */
  readonly propagateSelectionUp = input(true);

  /** Additional classes */
  readonly classOverride = input('');

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

  /** Selection is held as a Set internally for O(1) lookups; emitted as an array. */
  protected selection = signal<ReadonlySet<TreeNode>>(new Set());

  /** Node currently owning the roving tabindex. */
  protected readonly focusedNode = signal<TreeNode | null>(null);

  protected containerClasses = computed(() => {
    return this.twClass.merge('py-2', this.classOverride());
  });

  /**
   * Per-node view state (selected/indeterminate flags and classes), computed in a
   * single pass over the tree whenever the nodes input or the selection changes.
   */
  private readonly nodeViewState = computed(() => {
    const selection = this.selection();
    const states = new Map<TreeNode, TreeNodeViewState>();

    const visit = (node: TreeNode): { total: number; selectedCount: number } => {
      let total = 0;
      let selectedCount = 0;
      for (const child of node.children ?? []) {
        const childResult = visit(child);
        total += childResult.total + 1;
        selectedCount += childResult.selectedCount + (selection.has(child) ? 1 : 0);
      }

      const selected = selection.has(node);
      states.set(node, {
        selected,
        indeterminate: total > 0 && selectedCount > 0 && selectedCount < total,
        nodeClass: this.twClass.merge(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
          'hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          selected ? 'bg-blue-50' : '',
          node.disabled ? 'opacity-50 cursor-not-allowed' : '',
          node.styleClass || ''
        ),
        labelClass: this.twClass.merge(
          'text-sm select-none',
          node.disabled ? 'text-slate-400' : 'text-slate-700'
        ),
      });
      return { total, selectedCount };
    };

    this.nodes().forEach(visit);
    return states;
  });

  /** Child-to-parent lookup used for upward selection propagation. */
  private readonly parentMap = computed(() => {
    const map = new Map<TreeNode, TreeNode | null>();
    const visit = (node: TreeNode, parent: TreeNode | null) => {
      map.set(node, parent);
      node.children?.forEach(child => {
        visit(child, node);
      });
    };
    this.nodes().forEach(node => {
      visit(node, null);
    });
    return map;
  });

  protected nodeClasses(node: TreeNode, level: number): string {
    return this.nodeViewState().get(node)?.nodeClass ?? '';
  }

  protected labelClasses(node: TreeNode): string {
    return this.nodeViewState().get(node)?.labelClass ?? '';
  }

  isSelected(node: TreeNode): boolean {
    return this.selection().has(node);
  }

  isIndeterminate(node: TreeNode): boolean {
    return this.nodeViewState().get(node)?.indeterminate ?? false;
  }

  onNodeClick(node: TreeNode): void {
    if (node.disabled) return;

    // Toggle expand/collapse if node has children
    if (node.children && node.children.length > 0) {
      this.toggleNode(node);
    }

    // Handle selection
    if (this.selectionMode() === 'single') {
      this.selection.set(new Set([node]));
      this.onNodeSelect.emit(node);
      this.selectionChange.emit(this.getSelection());
    } else if (this.selectionMode() === 'multiple') {
      const next = new Set(this.selection());
      if (next.has(node)) {
        next.delete(node);
        this.onNodeUnselect.emit(node);
      } else {
        next.add(node);
        this.onNodeSelect.emit(node);
      }
      this.selection.set(next);
      this.selectionChange.emit([...next]);
    }
  }

  onCheckboxChange(node: TreeNode, event: Event): void {
    if (node.disabled) return;

    const { checked } = event.target as HTMLInputElement;
    const next = new Set(this.selection());

    if (checked) {
      this.selectNodeInto(next, node);
    } else {
      this.unselectNodeFrom(next, node);
    }

    if (this.propagateSelectionUp()) {
      this.updateAncestors(next, node);
    }

    this.selection.set(next);
    this.selectionChange.emit([...next]);
  }

  toggleNode(node: TreeNode): void {
    node.expanded = !node.expanded;

    if (node.expanded) {
      this.onNodeExpand.emit(node);
    } else {
      this.onNodeCollapse.emit(node);
    }
  }

  protected nodeTabIndex(node: TreeNode): number {
    const focused = this.focusedNode();
    if (focused) {
      return node === focused ? 0 : -1;
    }
    const firstRoot = this.nodes().find(n => n.visible !== false);
    return node === firstRoot ? 0 : -1;
  }

  protected onNodeKeydown(event: KeyboardEvent, node: TreeNode): void {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const visible = this.getVisibleNodes();
        this.focusNodeAt(visible, Math.min(visible.indexOf(node) + 1, visible.length - 1));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const visible = this.getVisibleNodes();
        this.focusNodeAt(visible, Math.max(visible.indexOf(node) - 1, 0));
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        if (node.children?.length && !node.expanded) {
          this.toggleNode(node);
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        if (node.children?.length && node.expanded) {
          this.toggleNode(node);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.onNodeClick(node);
        break;
      }
    }
  }

  private focusNodeAt(visible: TreeNode[], index: number): void {
    const target = visible[index];
    if (!target) return;
    this.focusedNode.set(target);
    this.nodeRows?.get(index)?.nativeElement.focus();
  }

  /** Nodes currently rendered, in DOM order (visible and all ancestors expanded). */
  private getVisibleNodes(): TreeNode[] {
    const visible: TreeNode[] = [];
    const visit = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.visible === false) continue;
        visible.push(node);
        if (node.children && node.children.length > 0 && node.expanded) {
          visit(node.children);
        }
      }
    };
    visit(this.nodes());
    return visible;
  }

  private selectNodeInto(selection: Set<TreeNode>, node: TreeNode): void {
    if (!selection.has(node)) {
      selection.add(node);
      this.onNodeSelect.emit(node);
    }

    if (this.propagateSelectionDown() && node.children) {
      node.children.forEach(child => {
        this.selectNodeInto(selection, child);
      });
    }
  }

  private unselectNodeFrom(selection: Set<TreeNode>, node: TreeNode): void {
    if (selection.has(node)) {
      selection.delete(node);
      this.onNodeUnselect.emit(node);
    }

    if (this.propagateSelectionDown() && node.children) {
      node.children.forEach(child => {
        this.unselectNodeFrom(selection, child);
      });
    }
  }

  /**
   * Walks up from the given node: a parent becomes selected when all of its
   * direct children are selected, and is deselected otherwise.
   */
  private updateAncestors(selection: Set<TreeNode>, node: TreeNode): void {
    const parents = this.parentMap();
    let parent = parents.get(node) ?? null;

    while (parent) {
      const children = parent.children ?? [];
      const allSelected = children.length > 0 && children.every(child => selection.has(child));

      if (allSelected) {
        if (!selection.has(parent)) {
          selection.add(parent);
          this.onNodeSelect.emit(parent);
        }
      } else if (selection.has(parent)) {
        selection.delete(parent);
        this.onNodeUnselect.emit(parent);
      }

      parent = parents.get(parent) ?? null;
    }
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
    expandNodes(this.nodes());
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
    collapseNodes(this.nodes());
  }

  /** Get selected nodes */
  getSelection(): TreeNode[] {
    return [...this.selection()];
  }

  /** Clear selection */
  clearSelection(): void {
    this.selection.set(new Set());
    this.selectionChange.emit([]);
  }
}
