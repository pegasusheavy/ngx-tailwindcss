import{a as u,b as g}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ha as y,h as k,na as x}from"./chunk-5LPP6ASA.js";import{Ba as o,Jb as n,Kb as f,Lb as c,Ra as b,eb as p,fb as l,gb as m,hb as s,ib as a,jb as i,kb as v}from"./chunk-2G56FVSW.js";var h=(e,r)=>r.name;function w(e,r){if(e&1&&(a(0,"div",7),n(1),i()),e&2){let t=r.$implicit;o(),c(" Content item ",t," ")}}function C(e,r){if(e&1&&(a(0,"div",7),n(1),i()),e&2){let t=r.$implicit;o(),c(" Content item ",t," ")}}function _(e,r){if(e&1&&(a(0,"div",17)(1,"h4",31),n(2),i(),a(3,"p",32),n(4," Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "),i()()),e&2){let t=r.$implicit;o(2),c("Article Section ",t)}}function I(e,r){if(e&1&&(a(0,"li",23),n(1),i()),e&2){let t=r.$implicit;o(),c("Section ",t)}}function E(e,r){if(e&1&&(a(0,"div",7),n(1),i()),e&2){let t=r.$implicit;o(),c(" Content item ",t," ")}}function T(e,r){if(e&1&&(a(0,"tw-card",30)(1,"div",33)(2,"div",34),n(3),i(),a(4,"div",35),n(5),i()()()),e&2){let t=r.$implicit;s("padded",!0),o(3),f(t.name),o(2),f(t.value)}}var S=class e{scrollItems=Array.from({length:10},(r,t)=>t+1);longScrollItems=Array.from({length:8},(r,t)=>t+1);offsets=[{name:"none",value:"0"},{name:"xs",value:"0.25rem"},{name:"sm",value:"0.5rem"},{name:"md",value:"1rem"},{name:"lg",value:"1.5rem"},{name:"xl",value:"2rem"}];basicCode=`<tw-sticky position="top" offset="none">
  <header class="bg-white shadow-sm p-4">
    Sticky Header
  </header>
</tw-sticky>`;offsetCode=`<tw-sticky position="top" offset="md">
  <div class="p-4 bg-blue-500 text-white">
    Sticky with 1rem offset
  </div>
</tw-sticky>`;sidebarCode=`<div class="flex">
  <main class="flex-1">
    <!-- Main scrolling content -->
  </main>
  <aside class="w-64">
    <tw-sticky position="top" offset="sm">
      <nav class="p-4">
        Table of Contents
      </nav>
    </tw-sticky>
  </aside>
</div>`;customOffsetCode=`<!-- When you need to account for a fixed header -->
<tw-sticky position="top" customOffset="60px" [zIndex]="5">
  <div class="p-4 bg-white">
    Sticky below the fixed header
  </div>
</tw-sticky>`;offsetsCode=`<!-- Available offset presets -->
offset="none"  // 0
offset="xs"    // 0.25rem
offset="sm"    // 0.5rem
offset="md"    // 1rem
offset="lg"    // 1.5rem
offset="xl"    // 2rem

<!-- Or use a custom value -->
customOffset="60px"`;static \u0275fac=function(t){return new(t||e)};static \u0275cmp=b({type:e,selectors:[["app-sticky-demo"]],decls:50,vars:6,consts:[["title","Sticky","description","Sticky positioning component for creating fixed headers, sidebars, and floating elements."],["title","Basic Usage",3,"code"],[1,"h-[300px]","overflow-auto","border","border-slate-200","dark:border-slate-700","rounded-lg","bg-slate-100/60","dark:bg-slate-900/70"],["position","top","offset","none",1,"bg-white","dark:bg-slate-800","text-slate-900","dark:text-white","shadow-sm"],[1,"p-4","border-b","border-slate-200","dark:border-slate-700"],[1,"font-semibold"],[1,"p-4","space-y-4"],[1,"p-4","bg-slate-50","dark:bg-slate-800","text-slate-900","dark:text-slate-100","rounded","border","border-transparent","dark:border-slate-700/50"],["title","With Offset",3,"code"],["position","top","offset","md",1,"bg-blue-500","text-white","shadow-md"],[1,"p-4"],[1,"p-4","space-y-4","pt-20"],["title","Sticky Sidebar",3,"code"],[1,"h-[400px]","overflow-auto","border","border-slate-200","dark:border-slate-700","rounded-lg","bg-slate-100/60","dark:bg-slate-900/70"],[1,"flex"],[1,"flex-1","p-4","space-y-4"],[1,"font-semibold","text-lg","text-slate-900","dark:text-white"],[1,"p-4","bg-slate-50","dark:bg-slate-800","text-slate-900","dark:text-slate-100","rounded","border","border-transparent","dark:border-slate-700/60"],[1,"w-64","border-l","border-slate-200","dark:border-slate-700"],["position","top","offset","sm"],[1,"p-4","bg-slate-50","dark:bg-slate-800","text-slate-900","dark:text-slate-100","border","border-slate-200","dark:border-slate-700","rounded-md"],[1,"font-semibold","mb-3"],[1,"space-y-2","text-sm"],[1,"text-blue-600","hover:underline","cursor-pointer","dark:text-blue-300"],["title","Custom Offset",3,"code"],[1,"h-12","bg-slate-800","text-white","flex","items-center","px-4","border-b","border-slate-700"],["position","top","customOffset","48px",1,"bg-white","dark:bg-slate-800","text-slate-900","dark:text-white",3,"zIndex"],[1,"p-3","border-b","border-slate-200","dark:border-slate-700","shadow-sm"],["title","Offset Sizes",3,"code"],[1,"grid","grid-cols-2","md:grid-cols-3","gap-4","bg-slate-100/60","dark:bg-slate-900/70","p-4","rounded-2xl","border","border-slate-200","dark:border-slate-700"],[1,"bg-white","dark:bg-slate-900","border","border-slate-200","dark:border-slate-700","shadow-sm",3,"padded"],[1,"font-medium"],[1,"text-sm","text-slate-600","dark:text-slate-300","mt-2"],[1,"text-center"],[1,"font-mono","text-lg","font-semibold","text-blue-600"],[1,"text-sm","text-slate-500","dark:text-slate-300"]],template:function(t,d){t&1&&(v(0,"app-page-header",0),a(1,"app-demo-section",1)(2,"div",2)(3,"tw-sticky",3)(4,"div",4)(5,"h3",5),n(6,"Sticky Header"),i()()(),a(7,"div",6),l(8,w,2,1,"div",7,p),i()()(),a(10,"app-demo-section",8)(11,"div",2)(12,"tw-sticky",9)(13,"div",10)(14,"h3",5),n(15,"Sticky with 1rem offset from top"),i()()(),a(16,"div",11),l(17,C,2,1,"div",7,p),i()()(),a(19,"app-demo-section",12)(20,"div",13)(21,"div",14)(22,"div",15)(23,"h3",16),n(24,"Main Content"),i(),l(25,_,5,1,"div",17,p),i(),a(27,"div",18)(28,"tw-sticky",19)(29,"div",20)(30,"h4",21),n(31,"Table of Contents"),i(),a(32,"ul",22),l(33,I,2,1,"li",23,p),i()()()()()()(),a(35,"app-demo-section",24)(36,"div",2)(37,"div",25),n(38," Fixed Top Bar "),i(),a(39,"tw-sticky",26)(40,"div",27)(41,"h3",5),n(42,"Sticky below the top bar (48px offset)"),i()()(),a(43,"div",6),l(44,E,2,1,"div",7,p),i()()(),a(46,"app-demo-section",28)(47,"div",29),l(48,T,6,3,"tw-card",30,h),i()()),t&2&&(o(),s("code",d.basicCode),o(7),m(d.scrollItems),o(2),s("code",d.offsetCode),o(7),m(d.scrollItems),o(2),s("code",d.sidebarCode),o(6),m(d.longScrollItems),o(8),m(d.longScrollItems),o(2),s("code",d.customOffsetCode),o(4),s("zIndex",5),o(5),m(d.scrollItems),o(2),s("code",d.offsetsCode),o(2),m(d.offsets))},dependencies:[k,y,x,u,g],encapsulation:2})};export{S as StickyDemoComponent};
