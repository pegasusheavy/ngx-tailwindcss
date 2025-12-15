import{a as c,b as u}from"./chunk-3KJZNRY2.js";import{Fa as t,Ga as l,Ha as o,Ia as n,Ua as i,ha as a,ob as r,ta as d,vc as p}from"./chunk-7UE6IFUK.js";var b=class s{users=[{id:1,name:"John Doe",email:"john@example.com",role:"Admin"},{id:2,name:"Jane Smith",email:"jane@example.com",role:"Editor"},{id:3,name:"Bob Johnson",email:"bob@example.com",role:"Viewer"},{id:4,name:"Alice Brown",email:"alice@example.com",role:"Editor"}];columns=[{field:"name",header:"Name"},{field:"email",header:"Email"},{field:"role",header:"Role"}];basicCode=`<tw-table [data]="users" [columns]="columns"></tw-table>

// Component
users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  // ...
];

columns = [
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'role', header: 'Role' },
];`;variantsCode=`<tw-table [data]="users" [columns]="columns" variant="default"></tw-table>
<tw-table [data]="users" [columns]="columns" variant="striped"></tw-table>`;sizesCode=`<tw-table [data]="users" [columns]="columns" size="sm"></tw-table>
<tw-table [data]="users" [columns]="columns" size="md"></tw-table>
<tw-table [data]="users" [columns]="columns" size="lg"></tw-table>`;hoverCode='<tw-table [data]="users" [columns]="columns" [hoverable]="true"></tw-table>';static \u0275fac=function(m){return new(m||s)};static \u0275cmp=d({type:s,selectors:[["app-table-demo"]],decls:26,vars:17,consts:[["title","Table","description","Data table component with sorting, selection, and pagination support."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[3,"data","columns"],["title","Variants",3,"code"],[1,"space-y-6"],[1,"text-sm","text-slate-600","block","mb-2"],["variant","default",3,"data","columns"],["variant","striped",3,"data","columns"],["title","Sizes",3,"code"],["size","sm",3,"data","columns"],["size","md",3,"data","columns"],["title","Hoverable",3,"code"],[3,"data","columns","hoverable"]],template:function(m,e){m&1&&(n(0,"app-page-header",0),l(1,"div",1)(2,"app-demo-section",2),n(3,"tw-table",3),o(),l(4,"app-demo-section",4)(5,"div",5)(6,"div")(7,"span",6),i(8,"Default"),o(),n(9,"tw-table",7),o(),l(10,"div")(11,"span",6),i(12,"Striped"),o(),n(13,"tw-table",8),o()()(),l(14,"app-demo-section",9)(15,"div",5)(16,"div")(17,"span",6),i(18,"Small"),o(),n(19,"tw-table",10),o(),l(20,"div")(21,"span",6),i(22,"Medium"),o(),n(23,"tw-table",11),o()()(),l(24,"app-demo-section",12),n(25,"tw-table",13),o()()),m&2&&(a(2),t("code",e.basicCode),a(),t("data",e.users)("columns",e.columns),a(),t("code",e.variantsCode),a(5),t("data",e.users)("columns",e.columns),a(4),t("data",e.users)("columns",e.columns),a(),t("code",e.sizesCode),a(5),t("data",e.users)("columns",e.columns),a(4),t("data",e.users)("columns",e.columns),a(),t("code",e.hoverCode),a(),t("data",e.users)("columns",e.columns)("hoverable",!0))},dependencies:[r,p,c,u],encapsulation:2})};export{b as TableDemoComponent};
