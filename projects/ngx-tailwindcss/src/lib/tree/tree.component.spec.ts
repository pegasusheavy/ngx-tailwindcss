import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TreeNode, TreeSelectionMode, TwTreeComponent } from './tree.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-tree
      [nodes]="nodes()"
      [selectionMode]="selectionMode()"
      [indentSize]="indentSize()"
      [propagateSelectionDown]="propagateSelectionDown()"
      [propagateSelectionUp]="propagateSelectionUp()"
      (onNodeSelect)="onNodeSelectSpy($event)"
      (onNodeUnselect)="onNodeUnselectSpy($event)"
      (onNodeExpand)="onNodeExpandSpy($event)"
      (onNodeCollapse)="onNodeCollapseSpy($event)"
      (selectionChange)="onSelectionChangeSpy($event)"
      data-testid="test-tree"
    ></tw-tree>
  `,
  standalone: true,
  imports: [TwTreeComponent],
})
class TestHostComponent {
  @ViewChild(TwTreeComponent) tree!: TwTreeComponent;
  nodes = signal<TreeNode[]>([
    {
      key: '1',
      label: 'Documents',
      expanded: false,
      children: [
        { key: '1-1', label: 'Work' },
        { key: '1-2', label: 'Personal' },
      ],
    },
    {
      key: '2',
      label: 'Pictures',
      children: [
        { key: '2-1', label: 'Vacation' },
        { key: '2-2', label: 'Family' },
      ],
    },
    { key: '3', label: 'Downloads' },
    { key: '4', label: 'Disabled Node', disabled: true },
  ]);
  selectionMode = signal<TreeSelectionMode>('none');
  indentSize = signal(24);
  propagateSelectionDown = signal(true);
  propagateSelectionUp = signal(true);

  onNodeSelectSpy = vi.fn();
  onNodeUnselectSpy = vi.fn();
  onNodeExpandSpy = vi.fn();
  onNodeCollapseSpy = vi.fn();
  onSelectionChangeSpy = vi.fn();
}

describe('TwTreeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let treeEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    treeEl = fixture.debugElement.query(By.directive(TwTreeComponent));
  });

  it('should create the tree component', () => {
    expect(treeEl).toBeTruthy();
    expect(component.tree).toBeTruthy();
  });

  it('should render tree nodes', () => {
    expect(treeEl.nativeElement.textContent).toContain('Documents');
    expect(treeEl.nativeElement.textContent).toContain('Pictures');
    expect(treeEl.nativeElement.textContent).toContain('Downloads');
  });

  describe('expand/collapse', () => {
    it('should expand node on click', () => {
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      // Click on Documents node
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.onNodeExpandSpy).toHaveBeenCalled();
    });

    it('should collapse node when already expanded', () => {
      // First expand
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      // Then collapse
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.onNodeCollapseSpy).toHaveBeenCalled();
    });

    it('should expand all nodes via expandAll method', () => {
      component.tree.expandAll();
      fixture.detectChanges();
      const nodes = component.nodes();
      expect(nodes[0].expanded).toBe(true);
      expect(nodes[1].expanded).toBe(true);
    });

    it('should collapse all nodes via collapseAll method', () => {
      component.tree.expandAll();
      fixture.detectChanges();
      component.tree.collapseAll();
      fixture.detectChanges();
      const nodes = component.nodes();
      expect(nodes[0].expanded).toBe(false);
      expect(nodes[1].expanded).toBe(false);
    });
  });

  describe('single selection mode', () => {
    beforeEach(() => {
      component.selectionMode.set('single');
      fixture.detectChanges();
    });

    it('should select node on click', () => {
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click(); // Downloads (leaf node)
      fixture.detectChanges();
      expect(component.onNodeSelectSpy).toHaveBeenCalled();
      expect(component.onSelectionChangeSpy).toHaveBeenCalled();
    });

    it('should replace selection when clicking another node', () => {
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click();
      fixture.detectChanges();
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      const selection = component.tree.getSelection();
      expect(selection.length).toBe(1);
    });
  });

  describe('multiple selection mode', () => {
    beforeEach(() => {
      component.selectionMode.set('multiple');
      fixture.detectChanges();
    });

    it('should add to selection on click', () => {
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click();
      fixture.detectChanges();
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      const selection = component.tree.getSelection();
      expect(selection.length).toBe(2);
    });

    it('should remove from selection when clicking selected node', () => {
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click();
      fixture.detectChanges();
      nodeElements[2].nativeElement.click();
      fixture.detectChanges();
      expect(component.onNodeUnselectSpy).toHaveBeenCalled();
    });
  });

  describe('checkbox selection mode', () => {
    beforeEach(() => {
      component.selectionMode.set('checkbox');
      fixture.detectChanges();
    });

    it('should render checkboxes', () => {
      const checkboxes = treeEl.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should select node via checkbox', () => {
      const checkboxes = treeEl.queryAll(By.css('input[type="checkbox"]'));
      checkboxes[2].nativeElement.checked = true;
      checkboxes[2].nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.onNodeSelectSpy).toHaveBeenCalled();
    });

    it('should unselect node via checkbox', () => {
      const checkboxes = treeEl.queryAll(By.css('input[type="checkbox"]'));
      // First select
      checkboxes[2].nativeElement.checked = true;
      checkboxes[2].nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      // Then unselect
      checkboxes[2].nativeElement.checked = false;
      checkboxes[2].nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.onNodeUnselectSpy).toHaveBeenCalled();
    });
  });

  describe('disabled nodes', () => {
    it('should apply disabled classes', () => {
      const disabledNode = treeEl.queryAll(By.css('.opacity-50'));
      expect(disabledNode.length).toBeGreaterThan(0);
    });

    it('should not respond to click on disabled node', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      // Find disabled node
      const disabledNode = nodeElements.find(el =>
        el.nativeElement.textContent.includes('Disabled Node')
      );
      if (disabledNode) {
        disabledNode.nativeElement.click();
        fixture.detectChanges();
        expect(component.onNodeSelectSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('clearSelection', () => {
    it('should clear all selections', () => {
      component.selectionMode.set('multiple');
      fixture.detectChanges();
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click();
      nodeElements[0].nativeElement.click();
      fixture.detectChanges();
      component.tree.clearSelection();
      const selection = component.tree.getSelection();
      expect(selection.length).toBe(0);
    });
  });

  describe('selection styling', () => {
    it('should apply the selected background class to a clicked node', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      const nodeElements = treeEl.queryAll(By.css('.cursor-pointer'));
      nodeElements[2].nativeElement.click(); // Downloads (leaf node)
      fixture.detectChanges();

      const updated = treeEl.queryAll(By.css('.cursor-pointer'));
      expect(updated[2].nativeElement.className).toContain('bg-blue-50');
      expect(updated[0].nativeElement.className).not.toContain('bg-blue-50');
    });
  });

  describe('checkbox gating', () => {
    it('should not render checkboxes in single or multiple modes', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      expect(treeEl.queryAll(By.css('input[type="checkbox"]')).length).toBe(0);

      component.selectionMode.set('multiple');
      fixture.detectChanges();
      expect(treeEl.queryAll(By.css('input[type="checkbox"]')).length).toBe(0);
    });
  });

  describe('selection propagation', () => {
    const checkboxes = () => treeEl.queryAll(By.css('input[type="checkbox"]'));
    const setCheckbox = (index: number, checked: boolean) => {
      const checkbox = checkboxes()[index].nativeElement as HTMLInputElement;
      checkbox.checked = checked;
      checkbox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const selectedKeys = () => component.tree.getSelection().map(n => n.key);

    beforeEach(() => {
      component.selectionMode.set('checkbox');
      fixture.detectChanges();
    });

    it('should propagate selection down to children', () => {
      setCheckbox(0, true); // Documents
      expect(selectedKeys()).toEqual(expect.arrayContaining(['1', '1-1', '1-2']));
    });

    it('should select the parent when all children become selected', () => {
      // Expand Documents so child checkboxes render
      treeEl.queryAll(By.css('.cursor-pointer'))[0].nativeElement.click();
      fixture.detectChanges();

      // Documents(0), Work(1), Personal(2), Pictures(3), Downloads(4), Disabled(5)
      setCheckbox(1, true);
      expect(selectedKeys()).not.toContain('1');
      setCheckbox(2, true);
      expect(selectedKeys()).toEqual(expect.arrayContaining(['1', '1-1', '1-2']));
    });

    it('should deselect the parent when a child is unselected', () => {
      // Expand Documents, then select it (propagates down)
      treeEl.queryAll(By.css('.cursor-pointer'))[0].nativeElement.click();
      fixture.detectChanges();
      setCheckbox(0, true);
      expect(selectedKeys()).toEqual(expect.arrayContaining(['1', '1-1', '1-2']));

      // Uncheck Work
      setCheckbox(1, false);
      expect(selectedKeys()).not.toContain('1');
      expect(selectedKeys()).not.toContain('1-1');
      expect(selectedKeys()).toContain('1-2');
    });

    it('should not propagate up when propagateSelectionUp is false', () => {
      component.propagateSelectionUp.set(false);
      fixture.detectChanges();
      treeEl.queryAll(By.css('.cursor-pointer'))[0].nativeElement.click();
      fixture.detectChanges();

      setCheckbox(1, true);
      setCheckbox(2, true);
      expect(selectedKeys()).toEqual(expect.arrayContaining(['1-1', '1-2']));
      expect(selectedKeys()).not.toContain('1');
    });

    it('should mark a partially selected parent as indeterminate', () => {
      treeEl.queryAll(By.css('.cursor-pointer'))[0].nativeElement.click();
      fixture.detectChanges();

      setCheckbox(1, true);
      const documents = component.nodes()[0];
      expect(component.tree.isIndeterminate(documents)).toBe(true);

      setCheckbox(2, true);
      expect(component.tree.isIndeterminate(documents)).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    const rows = () => treeEl.queryAll(By.css('.cursor-pointer'));
    const pressKey = (row: DebugElement, key: string) => {
      row.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    it('should give only the first node a tabindex of 0 initially', () => {
      const nodeRows = rows();
      expect(nodeRows[0].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(nodeRows[1].nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should move focus down and up with arrow keys', () => {
      const nodeRows = rows();
      pressKey(nodeRows[0], 'ArrowDown');
      expect(document.activeElement).toBe(nodeRows[1].nativeElement);
      expect(nodeRows[1].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(nodeRows[0].nativeElement.getAttribute('tabindex')).toBe('-1');

      pressKey(nodeRows[1], 'ArrowUp');
      expect(document.activeElement).toBe(nodeRows[0].nativeElement);
    });

    it('should expand with ArrowRight and collapse with ArrowLeft', () => {
      const nodeRows = rows();
      pressKey(nodeRows[0], 'ArrowRight');
      expect(component.onNodeExpandSpy).toHaveBeenCalled();
      expect(component.nodes()[0].expanded).toBe(true);

      pressKey(nodeRows[0], 'ArrowLeft');
      expect(component.onNodeCollapseSpy).toHaveBeenCalled();
      expect(component.nodes()[0].expanded).toBe(false);
    });

    it('should select with Enter', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      pressKey(rows()[2], 'Enter'); // Downloads
      expect(component.onNodeSelectSpy).toHaveBeenCalled();
    });

    it('should select with Space', () => {
      component.selectionMode.set('single');
      fixture.detectChanges();
      pressKey(rows()[2], ' ');
      expect(component.onNodeSelectSpy).toHaveBeenCalled();
    });
  });

  describe('tree ARIA semantics', () => {
    it('should set aria-expanded only on nodes with children', () => {
      const items = treeEl.queryAll(By.css('[role="treeitem"]'));
      expect(items[0].nativeElement.getAttribute('aria-expanded')).toBe('false'); // Documents
      expect(items[2].nativeElement.getAttribute('aria-expanded')).toBeNull(); // Downloads
    });

    it('should wrap children in a role="group" container when expanded', () => {
      expect(treeEl.query(By.css('[role="group"]'))).toBeNull();

      treeEl.queryAll(By.css('.cursor-pointer'))[0].nativeElement.click();
      fixture.detectChanges();

      const group = treeEl.query(By.css('[role="group"]'));
      expect(group).toBeTruthy();
      expect(group.nativeElement.textContent).toContain('Work');
    });
  });
});
