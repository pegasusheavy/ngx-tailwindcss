import{a as z,b as A}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{fa as D,ga as E,h as R}from"./chunk-5LPP6ASA.js";import{Ba as t,Jb as C,Lb as f,Pb as S,Qb as _,Ra as v,Rb as T,aa as d,ba as h,eb as w,fb as g,gb as u,hb as p,ib as a,jb as n,kb as r,pb as y,tb as m,ub as b}from"./chunk-2G56FVSW.js";function M(c,o){if(c&1){let i=y();a(0,"tw-chip",32),m("onRemove",function(){let s=d(i).$implicit,l=b();return h(l.onRemove(s))}),n()}if(c&2){let i=o.$implicit;p("label",i)("removable",!0)}}var I=class c{tags=["Angular","TypeScript","Tailwind","CSS"];inputTags=["React","Vue","Svelte"];onRemove(o){this.tags=this.tags.filter(i=>i!==o)}onTagAdded(o){console.log("Tag added:",o)}onTagRemoved(o){console.log("Tag removed:",o.value)}basicCode=`<tw-chip label="Default"></tw-chip>
<tw-chip label="Removable" [removable]="true" (onRemove)="handleRemove()"></tw-chip>`;variantsCode=`<tw-chip variant="primary" label="Primary"></tw-chip>
<tw-chip variant="secondary" label="Secondary"></tw-chip>
<tw-chip variant="success" label="Success"></tw-chip>
<tw-chip variant="warning" label="Warning"></tw-chip>
<tw-chip variant="danger" label="Danger"></tw-chip>
<tw-chip variant="info" label="Info"></tw-chip>`;stylesCode=`<tw-chip chipStyle="solid" label="Solid"></tw-chip>
<tw-chip chipStyle="soft" label="Soft"></tw-chip>
<tw-chip chipStyle="outline" label="Outline"></tw-chip>`;sizesCode=`<tw-chip size="sm" label="Small"></tw-chip>
<tw-chip size="md" label="Medium"></tw-chip>
<tw-chip size="lg" label="Large"></tw-chip>`;removableCode=`@for (tag of tags; track tag) {
  <tw-chip
    [label]="tag"
    variant="primary"
    chipStyle="outline"
    [removable]="true"
    (onRemove)="onRemove(tag)">
  </tw-chip>
}`;chipsInputCode=`<!-- Chips input with two-way binding -->
<tw-chips
  [(values)]="tags"
  variant="primary"
  chipStyle="soft"
  placeholder="Type and press Enter..."
  (onAdd)="onTagAdded($event)"
  (onRemove)="onTagRemoved($event)">
</tw-chips>`;static \u0275fac=function(i){return new(i||c)};static \u0275cmp=v({type:c,selectors:[["app-chip-demo"]],decls:38,vars:9,consts:[["title","Chip","description","Chip component for tags, filters, and compact selections."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[1,"flex","flex-wrap","gap-2"],["label","Default"],["label","Removable",3,"removable"],["title","Variants",3,"code"],["variant","primary","label","Primary"],["variant","secondary","label","Secondary"],["variant","success","label","Success"],["variant","warning","label","Warning"],["variant","danger","label","Danger"],["variant","info","label","Info"],["title","Styles",3,"code"],[1,"flex","flex-wrap","gap-4"],["chipStyle","solid","variant","primary","label","Solid"],["chipStyle","solid","variant","success","label","Solid"],["chipStyle","solid","variant","danger","label","Solid"],["chipStyle","outline","variant","primary","label","Outlined"],["chipStyle","outline","variant","success","label","Outlined"],["chipStyle","outline","variant","danger","label","Outlined"],["title","Sizes",3,"code"],[1,"flex","items-center","gap-2"],["size","sm","label","Small"],["size","md","label","Medium"],["size","lg","label","Large"],["title","Removable Tags",3,"code"],["variant","primary","chipStyle","outline",3,"label","removable"],["title","Chips Input","description","A form input for adding multiple chips/tags.",3,"code"],[1,"max-w-md"],["variant","primary","chipStyle","soft","placeholder","Type and press Enter...",3,"valuesChange","onAdd","onRemove","values"],[1,"mt-2","text-sm","text-slate-500"],["variant","primary","chipStyle","outline",3,"onRemove","label","removable"]],template:function(i,e){i&1&&(r(0,"app-page-header",0),a(1,"div",1)(2,"app-demo-section",2)(3,"div",3),r(4,"tw-chip",4)(5,"tw-chip",5),n()(),a(6,"app-demo-section",6)(7,"div",3),r(8,"tw-chip",7)(9,"tw-chip",8)(10,"tw-chip",9)(11,"tw-chip",10)(12,"tw-chip",11)(13,"tw-chip",12),n()(),a(14,"app-demo-section",13)(15,"div",14)(16,"div",3),r(17,"tw-chip",15)(18,"tw-chip",16)(19,"tw-chip",17),n(),a(20,"div",3),r(21,"tw-chip",18)(22,"tw-chip",19)(23,"tw-chip",20),n()()(),a(24,"app-demo-section",21)(25,"div",22),r(26,"tw-chip",23)(27,"tw-chip",24)(28,"tw-chip",25),n()(),a(29,"app-demo-section",26)(30,"div",3),g(31,M,1,2,"tw-chip",27,w),n()(),a(33,"app-demo-section",28)(34,"div",29)(35,"tw-chips",30),T("valuesChange",function(l){return _(e.inputTags,l)||(e.inputTags=l),l}),m("onAdd",function(l){return e.onTagAdded(l)})("onRemove",function(l){return e.onTagRemoved(l)}),n(),a(36,"p",31),C(37),n()()()()),i&2&&(t(2),p("code",e.basicCode),t(3),p("removable",!0),t(),p("code",e.variantsCode),t(8),p("code",e.stylesCode),t(10),p("code",e.sizesCode),t(5),p("code",e.removableCode),t(2),u(e.tags),t(2),p("code",e.chipsInputCode),t(2),S("values",e.inputTags),t(2),f("Current tags: ",e.inputTags.join(", ")||"None"))},dependencies:[R,D,E,z,A],encapsulation:2})};export{I as ChipDemoComponent};
