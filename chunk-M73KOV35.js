import{a as S,b as E}from"./chunk-3KJZNRY2.js";import{$ as s,$c as b,Fa as o,Ga as t,Ha as e,Ia as r,Id as y,Ld as g,Ma as c,Ua as n,Vb as p,ad as w,ge as h,ha as i,ld as v,ob as m,sd as f,ta as u}from"./chunk-7UE6IFUK.js";var x=class d{isLoading=s(!1);icons={plus:h,check:g,trash:v,heart:f,gear:y};simulateLoading(){this.isLoading.set(!0),setTimeout(()=>this.isLoading.set(!1),2e3)}variantsCode=`<tw-button variant="primary">Primary</tw-button>
<tw-button variant="secondary">Secondary</tw-button>
<tw-button variant="success">Success</tw-button>
<tw-button variant="warning">Warning</tw-button>
<tw-button variant="danger">Danger</tw-button>
<tw-button variant="info">Info</tw-button>
<tw-button variant="ghost">Ghost</tw-button>
<tw-button variant="outline">Outline</tw-button>
<tw-button variant="link">Link</tw-button>`;sizesCode=`<tw-button variant="primary" size="xs">Extra Small</tw-button>
<tw-button variant="primary" size="sm">Small</tw-button>
<tw-button variant="primary" size="md">Medium</tw-button>
<tw-button variant="primary" size="lg">Large</tw-button>
<tw-button variant="primary" size="xl">Extra Large</tw-button>`;statesCode=`<tw-button variant="primary" [disabled]="true">Disabled</tw-button>
<tw-button variant="primary" [loading]="true">Loading</tw-button>
<tw-button variant="secondary" [loading]="isLoading()" (click)="simulateLoading()">
  Click to Load
</tw-button>`;iconsCode=`<!-- Icon before text -->
<tw-button variant="primary">
  <fa-icon [icon]="faPlus" twButtonIcon></fa-icon>
  Add Item
</tw-button>

<!-- Icon after text -->
<tw-button variant="danger">
  Delete
  <fa-icon [icon]="faTrash" twButtonIconEnd></fa-icon>
</tw-button>`;iconOnlyCode=`<tw-button variant="primary" [iconOnly]="true" size="sm">
  <fa-icon [icon]="faPlus" twButtonIcon></fa-icon>
</tw-button>
<tw-button variant="secondary" [iconOnly]="true">
  <fa-icon [icon]="faHeart" twButtonIcon></fa-icon>
</tw-button>
<tw-button variant="ghost" [iconOnly]="true" size="lg">
  <fa-icon [icon]="faGear" twButtonIcon></fa-icon>
</tw-button>`;fullWidthCode=`<tw-button variant="primary" [fullWidth]="true">Full Width Primary</tw-button>
<tw-button variant="outline" [fullWidth]="true">Full Width Outline</tw-button>`;customCode=`<!-- Override specific classes -->
<tw-button
  variant="primary"
  classOverride="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
  Gradient Button
</tw-button>

<!-- Replace all classes -->
<tw-button
  classReplace="px-6 py-2 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800">
  Custom Button
</tw-button>`;static \u0275fac=function(l){return new(l||d)};static \u0275cmp=u({type:d,selectors:[["app-button-demo"]],decls:74,vars:21,consts:[["title","Button","description","Versatile button component with multiple variants, sizes, and states."],["title","Variants","description","Choose from different visual styles for various contexts.",3,"code"],[1,"flex","flex-wrap","gap-3"],["variant","primary"],["variant","secondary"],["variant","success"],["variant","warning"],["variant","danger"],["variant","info"],["variant","ghost"],["variant","outline"],["variant","link"],["title","Sizes","description","Available in multiple sizes to fit different layouts.",3,"code"],[1,"flex","flex-wrap","items-center","gap-3"],["variant","primary","size","xs"],["variant","primary","size","sm"],["variant","primary","size","md"],["variant","primary","size","lg"],["variant","primary","size","xl"],["title","States","description","Handle disabled and loading states gracefully.",3,"code"],["variant","primary",3,"disabled"],["variant","primary",3,"loading"],["variant","secondary",3,"click","loading"],["title","With Icons","description","Add icons before or after the button text.",3,"code"],["twButtonIcon","",3,"icon"],["twButtonIconEnd","",3,"icon"],["title","Icon Only","description","Square buttons with just an icon.",3,"code"],["variant","primary","size","sm",3,"iconOnly"],["variant","secondary",3,"iconOnly"],["variant","ghost","size","lg",3,"iconOnly"],["title","Full Width","description","Buttons that span the full width of their container.",3,"code"],[1,"space-y-3","max-w-md"],["variant","primary",3,"fullWidth"],["variant","outline",3,"fullWidth"],["title","Custom Styling","description","Override or replace styles with classOverride or classReplace.",3,"code"],["variant","primary","classOverride","bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"],["variant","primary","classOverride","rounded-full"],["classReplace","px-6 py-2 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"]],template:function(l,a){l&1&&(r(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"div",2)(3,"tw-button",3),n(4,"Primary"),e(),t(5,"tw-button",4),n(6,"Secondary"),e(),t(7,"tw-button",5),n(8,"Success"),e(),t(9,"tw-button",6),n(10,"Warning"),e(),t(11,"tw-button",7),n(12,"Danger"),e(),t(13,"tw-button",8),n(14,"Info"),e(),t(15,"tw-button",9),n(16,"Ghost"),e(),t(17,"tw-button",10),n(18,"Outline"),e(),t(19,"tw-button",11),n(20,"Link"),e()()(),t(21,"app-demo-section",12)(22,"div",13)(23,"tw-button",14),n(24,"Extra Small"),e(),t(25,"tw-button",15),n(26,"Small"),e(),t(27,"tw-button",16),n(28,"Medium"),e(),t(29,"tw-button",17),n(30,"Large"),e(),t(31,"tw-button",18),n(32,"Extra Large"),e()()(),t(33,"app-demo-section",19)(34,"div",13)(35,"tw-button",20),n(36,"Disabled"),e(),t(37,"tw-button",21),n(38,"Loading"),e(),t(39,"tw-button",22),c("click",function(){return a.simulateLoading()}),n(40," Click to Load "),e()()(),t(41,"app-demo-section",23)(42,"div",13)(43,"tw-button",3),r(44,"fa-icon",24),n(45," Add Item "),e(),t(46,"tw-button",5),r(47,"fa-icon",24),n(48," Save "),e(),t(49,"tw-button",7),n(50," Delete "),r(51,"fa-icon",25),e()()(),t(52,"app-demo-section",26)(53,"div",13)(54,"tw-button",27),r(55,"fa-icon",24),e(),t(56,"tw-button",28),r(57,"fa-icon",24),e(),t(58,"tw-button",29),r(59,"fa-icon",24),e()()(),t(60,"app-demo-section",30)(61,"div",31)(62,"tw-button",32),n(63,"Full Width Primary"),e(),t(64,"tw-button",33),n(65,"Full Width Outline"),e()()(),t(66,"app-demo-section",34)(67,"div",13)(68,"tw-button",35),n(69," Gradient Button "),e(),t(70,"tw-button",36),n(71," Rounded Button "),e(),t(72,"tw-button",37),n(73," Custom Button "),e()()()),l&2&&(i(),o("code",a.variantsCode),i(20),o("code",a.sizesCode),i(12),o("code",a.statesCode),i(2),o("disabled",!0),i(2),o("loading",!0),i(2),o("loading",a.isLoading()),i(2),o("code",a.iconsCode),i(3),o("icon",a.icons.plus),i(3),o("icon",a.icons.check),i(4),o("icon",a.icons.trash),i(),o("code",a.iconOnlyCode),i(2),o("iconOnly",!0),i(),o("icon",a.icons.plus),i(),o("iconOnly",!0),i(),o("icon",a.icons.heart),i(),o("iconOnly",!0),i(),o("icon",a.icons.gear),i(),o("code",a.fullWidthCode),i(2),o("fullWidth",!0),i(2),o("fullWidth",!0),i(2),o("code",a.customCode))},dependencies:[m,w,b,p,S,E],encapsulation:2})};export{x as ButtonDemoComponent};
