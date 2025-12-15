import{a as f,b as M}from"./chunk-3KJZNRY2.js";import{$a as m,Bc as D,Fa as u,Ga as s,Ha as a,Ia as b,Ua as l,Vb as y,_a as e,ab as F,bb as g,cb as C,db as _,eb as v,ha as c,ob as w,ta as d}from"./chunk-7UE6IFUK.js";var A=()=>({label:"New File",shortcut:"\u2318N"}),N=()=>({label:"New Window",shortcut:"\u2318\u21E7N"}),r=()=>({separator:!0}),P=()=>({label:"Open...",shortcut:"\u2318O"}),x=()=>({label:"Save",shortcut:"\u2318S"}),O=()=>({label:"Save As...",shortcut:"\u2318\u21E7S"}),T=()=>({label:"Print",shortcut:"\u2318P"}),B=(t,o,n,i,p,I,S,E)=>[t,o,n,i,p,I,S,E],G=()=>({label:"Profile"}),H=()=>({label:"Settings"}),U=()=>({label:"Billing"}),V=(t,o,n)=>[t,o,n],W=t=>({label:"Account",items:t}),X=()=>({label:"Members"}),Z=()=>({label:"Invite"}),j=(t,o)=>[t,o],k=t=>({label:"Team",items:t}),q=()=>({label:"Sign Out",styleClass:"text-rose-600"}),z=(t,o,n,i)=>[t,o,n,i],J=()=>({label:"Cut",shortcut:"\u2318X"}),K=()=>({label:"Copy",shortcut:"\u2318C"}),L=()=>({label:"Paste",shortcut:"\u2318V",disabled:!0}),Q=()=>({label:"Select All",shortcut:"\u2318A"}),R=(t,o,n,i,p)=>[t,o,n,i,p],h=class t{menuItems=[{label:"Edit",command:()=>console.log("Edit")},{label:"Duplicate",command:()=>console.log("Duplicate")},{separator:!0},{label:"Archive",command:()=>console.log("Archive")},{label:"Delete",command:()=>console.log("Delete"),styleClass:"text-rose-600"}];basicCode=`<tw-menu [items]="menuItems">
  <tw-button trigger>Open Menu</tw-button>
</tw-menu>

// Component
menuItems: MenuItem[] = [
  { label: 'Edit', command: () => {} },
  { label: 'Duplicate', command: () => {} },
  { separator: true },
  { label: 'Delete', styleClass: 'text-rose-600' },
];`;groupsCode=`menuItems = [
  { label: 'Actions', items: [
    { label: 'Edit' },
    { label: 'Duplicate' },
  ]},
  { label: 'Danger Zone', items: [
    { label: 'Delete', styleClass: 'text-rose-600' },
  ]},
];`;static \u0275fac=function(n){return new(n||t)};static \u0275cmp=d({type:t,selectors:[["app-menu-demo"]],decls:18,vars:59,consts:[["title","Menu","description","Dropdown menu component for actions and navigation options."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[3,"items"],["trigger","","variant","outline"],["title","Menu Items",3,"code"],["trigger",""],["title","Grouped Menu",3,"code"],["title","Disabled Items",3,"code"],["trigger","","variant","secondary"]],template:function(n,i){n&1&&(b(0,"app-page-header",0),s(1,"div",1)(2,"app-demo-section",2)(3,"tw-menu",3)(4,"tw-button",4),l(5,"Actions"),a()()(),s(6,"app-demo-section",5)(7,"tw-menu",3)(8,"tw-button",6),l(9,"File Menu"),a()()(),s(10,"app-demo-section",7)(11,"tw-menu",3)(12,"tw-button",4),l(13,"Account"),a()()(),s(14,"app-demo-section",8)(15,"tw-menu",3)(16,"tw-button",9),l(17,"Edit"),a()()()()),n&2&&(c(2),u("code",i.basicCode),c(),u("items",i.menuItems),c(3),u("code",i.basicCode),c(),u("items",v(16,B,e(8,A),e(9,N),e(10,r),e(11,P),e(12,x),e(13,O),e(14,r),e(15,T))),c(3),u("code",i.groupsCode),c(),u("items",C(43,z,m(32,W,g(28,V,e(25,G),e(26,H),e(27,U))),m(39,k,F(36,j,e(34,X),e(35,Z))),e(41,r),e(42,q))),c(3),u("code",i.basicCode),c(),u("items",_(53,R,e(48,J),e(49,K),e(50,L),e(51,r),e(52,Q))))},dependencies:[w,D,y,f,M],encapsulation:2})};export{h as MenuDemoComponent};
