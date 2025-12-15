import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTreeComponent, TreeNode } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwTreeComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './tree-demo.component.html',
})
export class TreeDemoComponent {
  treeData: TreeNode[] = [
    {
      label: 'Documents',
      expanded: true,
      children: [
        {
          label: 'Work',
          children: [
            { label: 'report.pdf' },
            { label: 'presentation.pptx' },
          ],
        },
        {
          label: 'Personal',
          children: [
            { label: 'resume.docx' },
          ],
        },
      ],
    },
    {
      label: 'Pictures',
      children: [
        { label: 'vacation.jpg' },
        { label: 'family.png' },
      ],
    },
    {
      label: 'Music',
      children: [
        { label: 'playlist.m3u' },
      ],
    },
  ];

  simpleTree: TreeNode[] = [
    {
      label: 'Getting Started',
      children: [
        { label: 'Installation' },
        { label: 'Configuration' },
        { label: 'First Steps' },
      ],
    },
    {
      label: 'Components',
      children: [
        { label: 'Button' },
        { label: 'Input' },
        { label: 'Modal' },
      ],
    },
    {
      label: 'API Reference',
      children: [
        { label: 'Services' },
        { label: 'Directives' },
      ],
    },
  ];

  basicCode = `<tw-tree [nodes]="treeData"></tw-tree>

// Component
treeData: TreeNode[] = [
  {
    label: 'Documents',
    expanded: true,
    children: [
      { label: 'Work', children: [...] },
      { label: 'Personal', children: [...] },
    ],
  },
  // ...
];`;

  selectableCode = `<tw-tree [nodes]="treeData" selectionMode="single"></tw-tree>`;

  checkboxCode = `<tw-tree [nodes]="treeData" selectionMode="checkbox"></tw-tree>`;
}
