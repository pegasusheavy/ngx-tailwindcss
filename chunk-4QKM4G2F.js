import{a as s,b as m}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Sa as p,h as c}from"./chunk-5LPP6ASA.js";import{Ba as e,Ra as d,hb as t,ib as a,jb as l,kb as n}from"./chunk-2G56FVSW.js";var b=class r{treeData=[{label:"Documents",expanded:!0,children:[{label:"Work",children:[{label:"report.pdf"},{label:"presentation.pptx"}]},{label:"Personal",children:[{label:"resume.docx"}]}]},{label:"Pictures",children:[{label:"vacation.jpg"},{label:"family.png"}]},{label:"Music",children:[{label:"playlist.m3u"}]}];simpleTree=[{label:"Getting Started",children:[{label:"Installation"},{label:"Configuration"},{label:"First Steps"}]},{label:"Components",children:[{label:"Button"},{label:"Input"},{label:"Modal"}]},{label:"API Reference",children:[{label:"Services"},{label:"Directives"}]}];basicCode=`<tw-tree [nodes]="treeData"></tw-tree>

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
];`;selectableCode='<tw-tree [nodes]="treeData" selectionMode="single"></tw-tree>';checkboxCode='<tw-tree [nodes]="treeData" selectionMode="checkbox"></tw-tree>';static \u0275fac=function(i){return new(i||r)};static \u0275cmp=d({type:r,selectors:[["app-tree-demo"]],decls:14,vars:8,consts:[["title","Tree","description","Hierarchical tree view component for displaying nested data structures."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[1,"max-w-md"],[3,"nodes"],["title","Single Selection",3,"code"],["selectionMode","single",3,"nodes"],["title","Checkbox Selection",3,"code"],["selectionMode","checkbox",3,"nodes"],["title","Navigation Tree",3,"code"]],template:function(i,o){i&1&&(n(0,"app-page-header",0),a(1,"div",1)(2,"app-demo-section",2)(3,"div",3),n(4,"tw-tree",4),l()(),a(5,"app-demo-section",5)(6,"div",3),n(7,"tw-tree",6),l()(),a(8,"app-demo-section",7)(9,"div",3),n(10,"tw-tree",8),l()(),a(11,"app-demo-section",9)(12,"div",3),n(13,"tw-tree",4),l()()()),i&2&&(e(2),t("code",o.basicCode),e(2),t("nodes",o.treeData),e(),t("code",o.selectableCode),e(2),t("nodes",o.treeData),e(),t("code",o.checkboxCode),e(2),t("nodes",o.treeData),e(),t("code",o.basicCode),e(2),t("nodes",o.simpleTree))},dependencies:[c,p,s,m],encapsulation:2})};export{b as TreeDemoComponent};
