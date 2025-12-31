import{a as p,b}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ra as c,h as m}from"./chunk-5LPP6ASA.js";import{Ba as t,Jb as l,Ra as r,hb as a,ib as s,jb as i,kb as d}from"./chunk-2G56FVSW.js";var u=class n{users=[{id:1,name:"Nora Delgado",email:"nora@stellar.team",role:"Admin",status:"Active",created:"2025-11-12"},{id:2,name:"Marcus Finch",email:"marcus@stellar.team",role:"Designer",status:"Active",created:"2025-10-28"},{id:3,name:"Priya Shah",email:"priya@stellar.team",role:"Engineer",status:"Pending",created:"2025-10-02"},{id:4,name:"Leo Park",email:"leo@stellar.team",role:"Product",status:"Active",created:"2025-09-15"},{id:5,name:"Ivy Morales",email:"ivy@stellar.team",role:"Research",status:"Idle",created:"2025-08-29"},{id:6,name:"Cassidy Brandt",email:"cassidy@stellar.team",role:"Support",status:"Active",created:"2025-07-10"}];columns=[{field:"name",header:"Name"},{field:"email",header:"Email"},{field:"role",header:"Role"},{field:"status",header:"Status"},{field:"created",header:"Joined"}];basicCode=`<tw-datatables
  [data]="users"
  [columns]="columns"
  title="Customer Directory"
  subtitle="Live CRM data"
  description="Sort, search, select, and paginate without additional wiring."
  [paginator]="true"
  [rows]="5"
  [selectable]="true"
  [showGlobalFilter]="true"
  tableVariant="striped"
  tableSize="md"
>
  <button
    twDatatablesActions
    class="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
  >
    Export CSV
  </button>
</tw-datatables>`;compactCode=`<tw-datatables
  [data]="users"
  [columns]="columns"
  title="Compact View"
  description="Perfect for dashboards that need a tighter density."
  [paginator]="false"
  [rows]="users.length"
  tableVariant="bordered"
  tableSize="sm"
  [showGlobalFilter]="false"
>
  <button twDatatablesActions class="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white">
    Bulk Actions
  </button>
</tw-datatables>`;static \u0275fac=function(o){return new(o||n)};static \u0275cmp=r({type:n,selectors:[["app-datatables-demo"]],decls:12,vars:13,consts:[["title","DataTables","description","An opinionated wrapper around the table component that wires up filtering, pagination, selection, and toolbar actions so you can drop a full datatable into dashboards with minimal configuration."],[1,"space-y-8"],["title","Feature-rich dashboard table","description","Includes built-in toolbar actions, filtering, selection, and responsive pagination.",3,"code"],["title","Customer Directory","subtitle","Live CRM data","description","Sort, search, select, and paginate without additional wiring.","tableVariant","striped","tableSize","md","containerClass","max-w-4xl",3,"data","columns","paginator","rows","selectable","showGlobalFilter"],["twDatatablesActions","",1,"px-3","py-2","rounded-lg","text-sm","font-semibold","text-slate-600","dark:text-slate-100","bg-slate-100","dark:bg-slate-800","hover:bg-slate-200","dark:hover:bg-slate-700","transition"],["twDatatablesActions","",1,"px-3","py-2","rounded-lg","text-sm","font-semibold","text-white","bg-blue-600","hover:bg-blue-700","transition"],["title","Compact dashboard layout","description","Dense layout that keeps more rows on screen while still providing striped and bordered styling.",3,"code"],["title","Compact View","description","Ideal for analytics or admin pages where density matters.","tableVariant","bordered","tableSize","sm","containerClass","max-w-2xl",3,"data","columns","paginator","rows","showGlobalFilter"],["twDatatablesActions","",1,"px-3","py-1.5","rounded-lg","text-sm","font-semibold","bg-blue-600","text-white"]],template:function(o,e){o&1&&(d(0,"app-page-header",0),s(1,"div",1)(2,"app-demo-section",2)(3,"tw-datatables",3)(4,"button",4),l(5," Export CSV "),i(),s(6,"button",5),l(7," New invite "),i()()(),s(8,"app-demo-section",6)(9,"tw-datatables",7)(10,"button",8),l(11," Bulk actions "),i()()()()),o&2&&(t(2),a("code",e.basicCode),t(),a("data",e.users)("columns",e.columns)("paginator",!0)("rows",5)("selectable",!0)("showGlobalFilter",!0),t(5),a("code",e.compactCode),t(),a("data",e.users)("columns",e.columns)("paginator",!1)("rows",e.users.length)("showGlobalFilter",!1))},dependencies:[m,c,p,b],encapsulation:2})};export{u as DatatablesDemoComponent};
