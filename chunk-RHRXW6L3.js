import{a as h,b as f}from"./chunk-3KJZNRY2.js";import{$ as d,Fa as i,Ga as t,Ha as e,Ia as r,Ua as a,Xa as c,Ya as w,Za as m,ha as n,ob as v,oc as u,pc as T,ta as p}from"./chunk-7UE6IFUK.js";var S=class s{activeTab=d("tab1");basicCode=`// In your component
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
</tw-tabs>`;static \u0275fac=function(b){return new(b||s)};static \u0275cmp=p({type:s,selectors:[["app-tabs-demo"]],decls:70,vars:7,consts:[["title","Tabs","description","Organize content into switchable panels."],["title","Basic Tabs","description","Simple tab navigation with line style.",3,"code"],["variant","line",3,"valueChange","value"],["value","tab1","label","Overview"],[1,"text-slate-600"],["value","tab2","label","Features"],["value","tab3","label","Pricing"],["title","Tab Variants","description","Different visual styles for tabs.",3,"code"],[1,"space-y-8"],[1,"text-sm","font-medium","text-slate-700","mb-3"],["variant","line"],["value","line1","label","Tab 1"],["value","line2","label","Tab 2"],["value","line3","label","Tab 3"],["variant","enclosed"],["value","enc1","label","Tab 1"],["value","enc2","label","Tab 2"],["value","enc3","label","Tab 3"],["variant","pills"],["value","pill1","label","Tab 1"],["value","pill2","label","Tab 2"],["value","pill3","label","Tab 3"],["variant","soft-rounded"],["value","soft1","label","Tab 1"],["value","soft2","label","Tab 2"],["value","soft3","label","Tab 3"],["title","Disabled Tab","description","Tabs can be individually disabled.",3,"code"],["value","active1","label","Active Tab"],["value","active2","label","Another Tab"],["value","disabled","label","Disabled",3,"disabled"],["title","Full Width Tabs","description","Tabs that span the full container width.",3,"code"],["variant","soft-rounded",3,"fullWidth"],["value","fw1","label","First"],["value","fw2","label","Second"],["value","fw3","label","Third"]],template:function(b,l){b&1&&(r(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"tw-tabs",2),m("valueChange",function(o){return w(l.activeTab,o)||(l.activeTab=o),o}),t(3,"tw-tab-panel",3)(4,"p",4),a(5," This is the overview tab content. It provides a summary of the main information and key highlights that users need to know. "),e()(),t(6,"tw-tab-panel",5)(7,"p",4),a(8," This is the features tab content. Here you can list all the amazing features and capabilities of your product or service. "),e()(),t(9,"tw-tab-panel",6)(10,"p",4),a(11," This is the pricing tab content. Display your pricing plans, tiers, and what's included in each option. "),e()()()(),t(12,"app-demo-section",7)(13,"div",8)(14,"div")(15,"p",9),a(16,"Line Style"),e(),t(17,"tw-tabs",10)(18,"tw-tab-panel",11),a(19,"Line style content 1"),e(),t(20,"tw-tab-panel",12),a(21,"Line style content 2"),e(),t(22,"tw-tab-panel",13),a(23,"Line style content 3"),e()()(),t(24,"div")(25,"p",9),a(26,"Enclosed Style"),e(),t(27,"tw-tabs",14)(28,"tw-tab-panel",15),a(29,"Enclosed style content 1"),e(),t(30,"tw-tab-panel",16),a(31,"Enclosed style content 2"),e(),t(32,"tw-tab-panel",17),a(33,"Enclosed style content 3"),e()()(),t(34,"div")(35,"p",9),a(36,"Pills Style"),e(),t(37,"tw-tabs",18)(38,"tw-tab-panel",19),a(39,"Pills style content 1"),e(),t(40,"tw-tab-panel",20),a(41,"Pills style content 2"),e(),t(42,"tw-tab-panel",21),a(43,"Pills style content 3"),e()()(),t(44,"div")(45,"p",9),a(46,"Soft Rounded Style"),e(),t(47,"tw-tabs",22)(48,"tw-tab-panel",23),a(49,"Soft rounded content 1"),e(),t(50,"tw-tab-panel",24),a(51,"Soft rounded content 2"),e(),t(52,"tw-tab-panel",25),a(53,"Soft rounded content 3"),e()()()()(),t(54,"app-demo-section",26)(55,"tw-tabs",10)(56,"tw-tab-panel",27),a(57,"This tab is active and clickable."),e(),t(58,"tw-tab-panel",28),a(59,"This tab is also active."),e(),t(60,"tw-tab-panel",29),a(61,"This content won't be shown."),e()()(),t(62,"app-demo-section",30)(63,"tw-tabs",31)(64,"tw-tab-panel",32),a(65,"First tab content with full width tabs."),e(),t(66,"tw-tab-panel",33),a(67,"Second tab content with full width tabs."),e(),t(68,"tw-tab-panel",34),a(69,"Third tab content with full width tabs."),e()()()),b&2&&(n(),i("code",l.basicCode),n(),c("value",l.activeTab),n(10),i("code",l.variantsCode),n(42),i("code",l.disabledCode),n(6),i("disabled",!0),n(2),i("code",l.fullWidthCode),n(),i("fullWidth",!0))},dependencies:[v,T,u,h,f],encapsulation:2})};export{S as TabsDemoComponent};
