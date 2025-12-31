import{a as T,b as f}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{h as u,qa as v,ra as h}from"./chunk-5LPP6ASA.js";import{Ba as l,Jb as a,Pb as w,Qb as c,Ra as r,Rb as m,hb as i,ib as e,ja as s,jb as t,kb as p}from"./chunk-2G56FVSW.js";var y=class d{activeTab=s("tab1");basicCode=`// In your component
activeTab = signal('tab1');

// In your template
<tw-tabs [(value)]="activeTab" variant="line">
  <tw-tab-panel value="tab1" label="Overview">
    <p>This is the overview tab content.</p>
  </tw-tab-panel>
  <tw-tab-panel value="tab2" label="Features">
    <p>This is the features tab content.</p>
  </tw-tab-panel>
  <tw-tab-panel value="tab3" label="Pricing">
    <p>This is the pricing tab content.</p>
  </tw-tab-panel>
</tw-tabs>`;variantsCode=`<!-- Line Style -->
<tw-tabs variant="line">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Enclosed Style -->
<tw-tabs variant="enclosed">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Pills Style -->
<tw-tabs variant="pills">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Soft Rounded Style -->
<tw-tabs variant="soft-rounded">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>`;disabledCode=`<tw-tabs variant="line">
  <tw-tab-panel value="active1" label="Active Tab">
    This tab is active and clickable.
  </tw-tab-panel>
  <tw-tab-panel value="active2" label="Another Tab">
    This tab is also active.
  </tw-tab-panel>
  <tw-tab-panel value="disabled" label="Disabled" [disabled]="true">
    This content won't be shown.
  </tw-tab-panel>
</tw-tabs>`;fullWidthCode=`<tw-tabs variant="soft-rounded" [fullWidth]="true">
  <tw-tab-panel value="fw1" label="First">
    First tab content with full width tabs.
  </tw-tab-panel>
  <tw-tab-panel value="fw2" label="Second">
    Second tab content with full width tabs.
  </tw-tab-panel>
  <tw-tab-panel value="fw3" label="Third">
    Third tab content with full width tabs.
  </tw-tab-panel>
</tw-tabs>`;static \u0275fac=function(b){return new(b||d)};static \u0275cmp=r({type:d,selectors:[["app-tabs-demo"]],decls:77,vars:7,consts:[["title","Tabs","description","Organize content into switchable panels."],["title","Basic Tabs","description","Simple tab navigation with line style.",3,"code"],[1,"bg-slate-100/60","dark:bg-slate-900/70","border","border-slate-200","dark:border-slate-700","rounded-2xl","p-4","shadow-lg"],["variant","line",1,"bg-white","dark:bg-slate-900/80","rounded-2xl","border","border-slate-200","dark:border-slate-700","shadow-md",3,"valueChange","value"],["value","tab1","label","Overview"],[1,"text-slate-600","dark:text-slate-300"],["value","tab2","label","Features"],[1,"text-sm","text-slate-500","dark:text-slate-400","mt-2"],["value","tab3","label","Pricing"],["title","Tab Variants","description","Different visual styles for tabs.",3,"code"],[1,"space-y-8","bg-slate-100/60","dark:bg-slate-900/70","border","border-slate-200","dark:border-slate-700","rounded-2xl","p-4","shadow-lg"],[1,"text-sm","font-medium","text-slate-700","dark:text-slate-100","mb-3"],["variant","line",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","rounded-2xl","shadow-md"],["value","line1","label","Tab 1"],["value","line2","label","Tab 2"],["value","line3","label","Tab 3"],["variant","enclosed",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","rounded-2xl","shadow-md"],["value","enc1","label","Tab 1"],["value","enc2","label","Tab 2"],["value","enc3","label","Tab 3"],["variant","pills",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","rounded-2xl","shadow-md"],["value","pill1","label","Tab 1"],["value","pill2","label","Tab 2"],["value","pill3","label","Tab 3"],["variant","soft-rounded",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","rounded-2xl","shadow-md"],["value","soft1","label","Tab 1"],["value","soft2","label","Tab 2"],["value","soft3","label","Tab 3"],["title","Disabled Tab","description","Tabs can be individually disabled.",3,"code"],["value","active1","label","Active Tab"],["value","active2","label","Another Tab"],["value","disabled","label","Disabled",3,"disabled"],["title","Full Width Tabs","description","Tabs that span the full container width.",3,"code"],["variant","soft-rounded",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","rounded-2xl","shadow-md",3,"fullWidth"],["value","fw1","label","First"],["value","fw2","label","Second"],["value","fw3","label","Third"]],template:function(b,n){b&1&&(p(0,"app-page-header",0),e(1,"app-demo-section",1)(2,"div",2)(3,"tw-tabs",3),m("valueChange",function(o){return c(n.activeTab,o)||(n.activeTab=o),o}),e(4,"tw-tab-panel",4)(5,"p",5),a(6," This is the overview tab content. It provides a summary of the main information and key highlights that users need to know. "),t()(),e(7,"tw-tab-panel",6)(8,"p",5),a(9," This is the features tab content. Here you can list all the amazing capabilities, integrations, and differentiators that make your product stand out. "),t(),e(10,"p",7),a(11," Feature list: Responsive design, accessible markup, composable APIs. "),t()(),e(12,"tw-tab-panel",8)(13,"p",5),a(14," This is the pricing tab content. Display your plans, billing cycles, and what every tier unlocks so buyers can compare quickly. "),t(),e(15,"p",7),a(16," Pricing notes: Monthly and annual options, priority support for premium tier. "),t()()()()(),e(17,"app-demo-section",9)(18,"div",10)(19,"div")(20,"p",11),a(21,"Line Style"),t(),e(22,"tw-tabs",12)(23,"tw-tab-panel",13),a(24,"Line style content 1"),t(),e(25,"tw-tab-panel",14),a(26,"Line style content 2"),t(),e(27,"tw-tab-panel",15),a(28,"Line style content 3"),t()()(),e(29,"div")(30,"p",11),a(31,"Enclosed Style"),t(),e(32,"tw-tabs",16)(33,"tw-tab-panel",17),a(34,"Enclosed style content 1"),t(),e(35,"tw-tab-panel",18),a(36,"Enclosed style content 2"),t(),e(37,"tw-tab-panel",19),a(38,"Enclosed style content 3"),t()()(),e(39,"div")(40,"p",11),a(41,"Pills Style"),t(),e(42,"tw-tabs",20)(43,"tw-tab-panel",21),a(44,"Pills style content 1"),t(),e(45,"tw-tab-panel",22),a(46,"Pills style content 2"),t(),e(47,"tw-tab-panel",23),a(48,"Pills style content 3"),t()()(),e(49,"div")(50,"p",11),a(51,"Soft Rounded Style"),t(),e(52,"tw-tabs",24)(53,"tw-tab-panel",25),a(54,"Soft rounded content 1"),t(),e(55,"tw-tab-panel",26),a(56,"Soft rounded content 2"),t(),e(57,"tw-tab-panel",27),a(58,"Soft rounded content 3"),t()()()()(),e(59,"app-demo-section",28)(60,"div",2)(61,"tw-tabs",12)(62,"tw-tab-panel",29),a(63,"This tab is active and clickable."),t(),e(64,"tw-tab-panel",30),a(65,"This tab is also active."),t(),e(66,"tw-tab-panel",31),a(67,"This content won't be shown."),t()()()(),e(68,"app-demo-section",32)(69,"div",2)(70,"tw-tabs",33)(71,"tw-tab-panel",34),a(72,"First tab content with full width tabs."),t(),e(73,"tw-tab-panel",35),a(74,"Second tab content with full width tabs."),t(),e(75,"tw-tab-panel",36),a(76,"Third tab content with full width tabs."),t()()()()),b&2&&(l(),i("code",n.basicCode),l(2),w("value",n.activeTab),l(14),i("code",n.variantsCode),l(42),i("code",n.disabledCode),l(7),i("disabled",!0),l(2),i("code",n.fullWidthCode),l(2),i("fullWidth",!0))},dependencies:[u,h,v,T,f],encapsulation:2})};export{y as TabsDemoComponent};
