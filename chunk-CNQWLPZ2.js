import{H as T,Na as A,a as C,b as E,pa as I,q as y,r as S,t as _,wa as k}from"./chunk-T3HYHWG2.js";import{a as x,b as O}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{W as u,h as s,mb as D,nb as b,ob as f,pb as v,qb as g,rb as h}from"./chunk-5LPP6ASA.js";import{Ba as i,Jb as e,Ra as l,hb as r,ib as t,jb as o,kb as d,tb as p}from"./chunk-2G56FVSW.js";var B=class m{icons={chevronDown:k,pen:I,copy:A,trash:S,ellipsis:_,share:T,eye:y};onAction(c){console.log("Action:",c)}basicCode=`<tw-dropdown>
  <tw-button twDropdownTrigger variant="outline">
    Options
    <fa-icon [icon]="faChevronDown" class="ml-2"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem (click)="onAction('edit')">Edit</button>
    <button twDropdownItem (click)="onAction('duplicate')">Duplicate</button>
    <button twDropdownItem (click)="onAction('archive')">Archive</button>
  </tw-dropdown-menu>
</tw-dropdown>`;headersCode=`<tw-dropdown>
  <tw-button twDropdownTrigger variant="primary">
    Actions
    <fa-icon [icon]="faChevronDown" class="ml-2"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <tw-dropdown-header>Manage</tw-dropdown-header>
    <button twDropdownItem (click)="onAction('edit')">
      <fa-icon [icon]="faPen" class="mr-2"></fa-icon>
      Edit
    </button>
    <button twDropdownItem (click)="onAction('duplicate')">
      <fa-icon [icon]="faCopy" class="mr-2"></fa-icon>
      Duplicate
    </button>
    <tw-dropdown-divider></tw-dropdown-divider>
    <tw-dropdown-header>Danger Zone</tw-dropdown-header>
    <button twDropdownItem class="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
      <fa-icon [icon]="faTrash" class="mr-2"></fa-icon>
      Delete
    </button>
  </tw-dropdown-menu>
</tw-dropdown>`;positionsCode=`<!-- Bottom Start (default) -->
<tw-dropdown position="bottom-start">
  <tw-button twDropdownTrigger>Bottom Start</tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>Option 1</button>
    <button twDropdownItem>Option 2</button>
  </tw-dropdown-menu>
</tw-dropdown>

<!-- Bottom End -->
<tw-dropdown position="bottom-end">
  <tw-button twDropdownTrigger>Bottom End</tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>Option 1</button>
    <button twDropdownItem>Option 2</button>
  </tw-dropdown-menu>
</tw-dropdown>

<!-- Available: bottom-start, bottom-end, top-start, top-end -->`;iconCode=`<tw-dropdown>
  <tw-button twDropdownTrigger variant="ghost" [iconOnly]="true">
    <fa-icon twButtonIcon [icon]="faEllipsisVertical"></fa-icon>
  </tw-button>
  <tw-dropdown-menu>
    <button twDropdownItem>View Details</button>
    <button twDropdownItem>Edit</button>
    <button twDropdownItem>Share</button>
    <tw-dropdown-divider></tw-dropdown-divider>
    <button twDropdownItem class="text-rose-600">Delete</button>
  </tw-dropdown-menu>
</tw-dropdown>`;static \u0275fac=function(w){return new(w||m)};static \u0275cmp=l({type:m,selectors:[["app-dropdown-demo"]],decls:73,vars:15,consts:[["title","Dropdown","description","Contextual menus for actions and navigation options."],["title","Basic Dropdown","description","Simple dropdown menu with items.",3,"code"],["twDropdownTrigger","","variant","outline"],[1,"ml-2","text-sm",3,"icon"],["twDropdownItem","",3,"click"],["title","With Headers and Dividers","description","Organized dropdown with sections.",3,"code"],["twDropdownTrigger","","variant","primary"],[1,"w-4","mr-2","text-slate-400",3,"icon"],["twDropdownItem","",1,"text-rose-600","hover:text-rose-700","hover:bg-rose-50",3,"click"],[1,"w-4","mr-2",3,"icon"],["title","Dropdown Positions","description","Different placement options for the menu.",3,"code"],[1,"flex","flex-wrap","gap-4"],["position","bottom-start"],["twDropdownItem",""],["position","bottom-end"],["title","Icon Button Dropdown","description","Dropdown triggered by an icon button.",3,"code"],["twDropdownTrigger","","variant","ghost",3,"iconOnly"],["twButtonIcon","",1,"text-lg",3,"icon"],["twDropdownItem","",1,"text-rose-600"]],template:function(w,n){w&1&&(d(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"tw-dropdown")(3,"tw-button",2),e(4," Options "),d(5,"fa-icon",3),o(),t(6,"tw-dropdown-menu")(7,"button",4),p("click",function(){return n.onAction("edit")}),e(8,"Edit"),o(),t(9,"button",4),p("click",function(){return n.onAction("duplicate")}),e(10,"Duplicate"),o(),t(11,"button",4),p("click",function(){return n.onAction("archive")}),e(12,"Archive"),o()()()(),t(13,"app-demo-section",5)(14,"tw-dropdown")(15,"tw-button",6),e(16," Actions "),d(17,"fa-icon",3),o(),t(18,"tw-dropdown-menu")(19,"tw-dropdown-header"),e(20,"Manage"),o(),t(21,"button",4),p("click",function(){return n.onAction("edit")}),d(22,"fa-icon",7),e(23," Edit "),o(),t(24,"button",4),p("click",function(){return n.onAction("duplicate")}),d(25,"fa-icon",7),e(26," Duplicate "),o(),d(27,"tw-dropdown-divider"),t(28,"tw-dropdown-header"),e(29,"Danger Zone"),o(),t(30,"button",8),p("click",function(){return n.onAction("delete")}),d(31,"fa-icon",9),e(32," Delete "),o()()()(),t(33,"app-demo-section",10)(34,"div",11)(35,"tw-dropdown",12)(36,"tw-button",2),e(37,"Bottom Start"),o(),t(38,"tw-dropdown-menu")(39,"button",13),e(40,"Option 1"),o(),t(41,"button",13),e(42,"Option 2"),o(),t(43,"button",13),e(44,"Option 3"),o()()(),t(45,"tw-dropdown",14)(46,"tw-button",2),e(47,"Bottom End"),o(),t(48,"tw-dropdown-menu")(49,"button",13),e(50,"Option 1"),o(),t(51,"button",13),e(52,"Option 2"),o(),t(53,"button",13),e(54,"Option 3"),o()()()()(),t(55,"app-demo-section",15)(56,"tw-dropdown")(57,"tw-button",16),d(58,"fa-icon",17),o(),t(59,"tw-dropdown-menu")(60,"button",13),d(61,"fa-icon",7),e(62," View Details "),o(),t(63,"button",13),d(64,"fa-icon",7),e(65," Edit "),o(),t(66,"button",13),d(67,"fa-icon",7),e(68," Share "),o(),d(69,"tw-dropdown-divider"),t(70,"button",18),d(71,"fa-icon",9),e(72," Delete "),o()()()()),w&2&&(i(),r("code",n.basicCode),i(4),r("icon",n.icons.chevronDown),i(8),r("code",n.headersCode),i(4),r("icon",n.icons.chevronDown),i(5),r("icon",n.icons.pen),i(3),r("icon",n.icons.copy),i(6),r("icon",n.icons.trash),i(2),r("code",n.positionsCode),i(22),r("code",n.iconCode),i(2),r("iconOnly",!0),i(),r("icon",n.icons.ellipsis),i(3),r("icon",n.icons.eye),i(3),r("icon",n.icons.pen),i(3),r("icon",n.icons.share),i(4),r("icon",n.icons.trash))},dependencies:[s,E,C,v,g,D,b,f,h,u,x,O],encapsulation:2})};export{B as DropdownDemoComponent};
