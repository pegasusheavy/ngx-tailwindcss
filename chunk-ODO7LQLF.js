import{a as w,b as c}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ma as b,Na as v,h as p}from"./chunk-5LPP6ASA.js";import{Ba as i,Jb as a,Ra as g,hb as n,ib as e,jb as t,kb as s,tb as l}from"./chunk-2G56FVSW.js";var S=class o{onRemove(){console.log("Badge removed")}variantsCode=`<tw-badge variant="primary">Primary</tw-badge>
<tw-badge variant="secondary">Secondary</tw-badge>
<tw-badge variant="success">Success</tw-badge>
<tw-badge variant="warning">Warning</tw-badge>
<tw-badge variant="danger">Danger</tw-badge>
<tw-badge variant="info">Info</tw-badge>
<tw-badge variant="neutral">Neutral</tw-badge>`;stylesCode=`<!-- Solid style -->
<tw-badge variant="primary" badgeStyle="solid">Solid</tw-badge>

<!-- Soft style -->
<tw-badge variant="primary" badgeStyle="soft">Soft</tw-badge>

<!-- Outline style -->
<tw-badge variant="primary" badgeStyle="outline">Outline</tw-badge>

<!-- Dot style (with status indicator) -->
<tw-badge variant="success" badgeStyle="dot">Online</tw-badge>`;sizesCode=`<tw-badge variant="primary" size="sm">Small</tw-badge>
<tw-badge variant="primary" size="md">Medium</tw-badge>
<tw-badge variant="primary" size="lg">Large</tw-badge>`;pillCode=`<tw-badge variant="primary" [pill]="true">Pill Badge</tw-badge>
<tw-badge variant="success" [pill]="true">Active</tw-badge>
<tw-badge variant="info" [pill]="true">99+</tw-badge>`;removableCode=`<tw-badge
  variant="primary"
  [removable]="true"
  (remove)="onRemove()">
  Removable
</tw-badge>

<tw-badge
  variant="success"
  badgeStyle="soft"
  [removable]="true"
  (remove)="onRemove()">
  Tag
</tw-badge>`;groupCode=`<tw-badge-group gap="sm">
  <tw-badge variant="primary" badgeStyle="soft">Angular</tw-badge>
  <tw-badge variant="info" badgeStyle="soft">TypeScript</tw-badge>
  <tw-badge variant="success" badgeStyle="soft">Tailwind</tw-badge>
  <tw-badge variant="warning" badgeStyle="soft">CSS</tw-badge>
</tw-badge-group>`;static \u0275fac=function(r){return new(r||o)};static \u0275cmp=g({type:o,selectors:[["app-badge-demo"]],decls:93,vars:12,consts:[["title","Badge","description","Small status indicators for labels, counts, and tags."],["title","Variants","description","Color variants for different semantic meanings.",3,"code"],[1,"flex","flex-wrap","gap-3"],["variant","primary"],["variant","secondary"],["variant","success"],["variant","warning"],["variant","danger"],["variant","info"],["variant","neutral"],["title","Badge Styles","description","Different visual styles for badges.",3,"code"],[1,"space-y-4"],[1,"text-sm","font-medium","text-slate-700","mb-2"],[1,"flex","flex-wrap","gap-2"],["variant","primary","badgeStyle","solid"],["variant","success","badgeStyle","solid"],["variant","danger","badgeStyle","solid"],["variant","primary","badgeStyle","soft"],["variant","success","badgeStyle","soft"],["variant","danger","badgeStyle","soft"],["variant","primary","badgeStyle","outline"],["variant","success","badgeStyle","outline"],["variant","danger","badgeStyle","outline"],["variant","primary","badgeStyle","dot"],["variant","success","badgeStyle","dot"],["variant","danger","badgeStyle","dot"],["title","Sizes","description","Available in multiple sizes.",3,"code"],[1,"flex","flex-wrap","items-center","gap-3"],["variant","primary","size","sm"],["variant","primary","size","md"],["variant","primary","size","lg"],["title","Pill Shape","description","Fully rounded badge style.",3,"code"],["variant","primary",3,"pill"],["variant","success",3,"pill"],["variant","info",3,"pill"],["title","Removable Badges","description","Badges that can be dismissed.",3,"code"],["variant","primary",3,"remove","removable"],["variant","success","badgeStyle","soft",3,"remove","removable"],["variant","info","badgeStyle","soft",3,"remove","removable"],["title","Badge Group","description","Group multiple badges together.",3,"code"],["gap","sm"],["variant","info","badgeStyle","soft"],["variant","warning","badgeStyle","soft"]],template:function(r,d){r&1&&(s(0,"app-page-header",0),e(1,"app-demo-section",1)(2,"div",2)(3,"tw-badge",3),a(4,"Primary"),t(),e(5,"tw-badge",4),a(6,"Secondary"),t(),e(7,"tw-badge",5),a(8,"Success"),t(),e(9,"tw-badge",6),a(10,"Warning"),t(),e(11,"tw-badge",7),a(12,"Danger"),t(),e(13,"tw-badge",8),a(14,"Info"),t(),e(15,"tw-badge",9),a(16,"Neutral"),t()()(),e(17,"app-demo-section",10)(18,"div",11)(19,"div")(20,"p",12),a(21,"Solid"),t(),e(22,"div",13)(23,"tw-badge",14),a(24,"Solid"),t(),e(25,"tw-badge",15),a(26,"Solid"),t(),e(27,"tw-badge",16),a(28,"Solid"),t()()(),e(29,"div")(30,"p",12),a(31,"Soft"),t(),e(32,"div",13)(33,"tw-badge",17),a(34,"Soft"),t(),e(35,"tw-badge",18),a(36,"Soft"),t(),e(37,"tw-badge",19),a(38,"Soft"),t()()(),e(39,"div")(40,"p",12),a(41,"Outline"),t(),e(42,"div",13)(43,"tw-badge",20),a(44,"Outline"),t(),e(45,"tw-badge",21),a(46,"Outline"),t(),e(47,"tw-badge",22),a(48,"Outline"),t()()(),e(49,"div")(50,"p",12),a(51,"Dot"),t(),e(52,"div",13)(53,"tw-badge",23),a(54,"Online"),t(),e(55,"tw-badge",24),a(56,"Active"),t(),e(57,"tw-badge",25),a(58,"Offline"),t()()()()(),e(59,"app-demo-section",26)(60,"div",27)(61,"tw-badge",28),a(62,"Small"),t(),e(63,"tw-badge",29),a(64,"Medium"),t(),e(65,"tw-badge",30),a(66,"Large"),t()()(),e(67,"app-demo-section",31)(68,"div",2)(69,"tw-badge",32),a(70,"Pill Badge"),t(),e(71,"tw-badge",33),a(72,"Active"),t(),e(73,"tw-badge",34),a(74,"99+"),t()()(),e(75,"app-demo-section",35)(76,"div",2)(77,"tw-badge",36),l("remove",function(){return d.onRemove()}),a(78,"Removable"),t(),e(79,"tw-badge",37),l("remove",function(){return d.onRemove()}),a(80,"Tag 1"),t(),e(81,"tw-badge",38),l("remove",function(){return d.onRemove()}),a(82,"Tag 2"),t()()(),e(83,"app-demo-section",39)(84,"tw-badge-group",40)(85,"tw-badge",17),a(86,"Angular"),t(),e(87,"tw-badge",41),a(88,"TypeScript"),t(),e(89,"tw-badge",18),a(90,"Tailwind"),t(),e(91,"tw-badge",42),a(92,"CSS"),t()()()),r&2&&(i(),n("code",d.variantsCode),i(16),n("code",d.stylesCode),i(42),n("code",d.sizesCode),i(8),n("code",d.pillCode),i(2),n("pill",!0),i(2),n("pill",!0),i(2),n("pill",!0),i(2),n("code",d.removableCode),i(2),n("removable",!0),i(2),n("removable",!0),i(2),n("removable",!0),i(2),n("code",d.groupCode))},dependencies:[p,b,v,w,c],encapsulation:2})};export{S as BadgeDemoComponent};
