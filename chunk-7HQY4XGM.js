import{a as c,b as g}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{h as p,ta as m}from"./chunk-5LPP6ASA.js";import{Ba as r,Jb as t,Ra as l,hb as a,ib as n,jb as e,kb as s}from"./chunk-2G56FVSW.js";var b=class o{basicCode=`<tw-container size="lg" [centered]="true">
  <div class="bg-slate-100 p-4 rounded">
    Content inside a large centered container
  </div>
</tw-container>`;sizesCode=`<!-- Small container (640px max) -->
<tw-container size="sm">...</tw-container>

<!-- Medium container (768px max) -->
<tw-container size="md">...</tw-container>

<!-- Large container (1024px max) -->
<tw-container size="lg">...</tw-container>

<!-- Extra large container (1280px max) -->
<tw-container size="xl">...</tw-container>

<!-- 2XL container (1536px max) -->
<tw-container size="2xl">...</tw-container>

<!-- Prose container (65ch max - ideal for reading) -->
<tw-container size="prose">...</tw-container>`;paddingCode=`<!-- No padding -->
<tw-container padding="none">...</tw-container>

<!-- Small padding -->
<tw-container padding="sm">...</tw-container>

<!-- Medium padding (default) -->
<tw-container padding="md">...</tw-container>

<!-- Large padding -->
<tw-container padding="lg">...</tw-container>`;alignmentCode=`<!-- Centered (default) -->
<tw-container [centered]="true">...</tw-container>

<!-- Left aligned -->
<tw-container [centered]="false">...</tw-container>`;static \u0275fac=function(d){return new(d||o)};static \u0275cmp=l({type:o,selectors:[["app-container-demo"]],decls:66,vars:6,consts:[["title","Container","description","A component for creating centered, max-width layouts. Perfect for page content areas."],["title","Basic Usage",3,"code"],[1,"bg-slate-200/60","dark:bg-slate-900","p-2","rounded-xl"],["size","lg"],[1,"bg-white","dark:bg-slate-800","text-slate-900","dark:text-slate-100","p-6","rounded","shadow-sm","border","border-slate-200","dark:border-slate-700"],[1,"text-lg","font-semibold","mb-2"],[1,"text-slate-600","dark:text-slate-300"],["title","Container Sizes",3,"code"],[1,"space-y-4","bg-slate-200/60","dark:bg-slate-900/50","p-2","rounded-2xl"],["size","sm"],[1,"bg-blue-100","dark:bg-blue-900/40","border","border-blue-200","dark:border-blue-800","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],[1,"font-medium"],["size","md"],[1,"bg-green-100","dark:bg-emerald-900/60","border","border-emerald-200","dark:border-emerald-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],[1,"bg-yellow-100","dark:bg-amber-900/50","border","border-amber-200","dark:border-amber-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],["size","xl"],[1,"bg-orange-100","dark:bg-orange-900/60","border","border-orange-200","dark:border-orange-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],["size","prose"],[1,"bg-purple-100","dark:bg-purple-900/60","border","border-purple-200","dark:border-purple-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],["title","Padding Options",3,"code"],[1,"space-y-4","bg-slate-200/60","dark:bg-slate-900/80","p-2","rounded-xl"],["size","lg","padding","none"],[1,"bg-rose-100","dark:bg-rose-900/60","border","border-rose-200","dark:border-rose-700","p-4","text-slate-800","dark:text-slate-100"],["size","lg","padding","sm"],[1,"bg-cyan-100","dark:bg-cyan-900/60","border","border-cyan-200","dark:border-cyan-700","p-4","text-slate-800","dark:text-slate-100"],["size","lg","padding","md"],[1,"bg-lime-100","dark:bg-lime-900/50","border","border-lime-200","dark:border-lime-700","p-4","text-slate-800","dark:text-slate-100"],["size","lg","padding","lg"],[1,"bg-amber-100","dark:bg-amber-900/70","border","border-amber-200","dark:border-amber-700","p-4","text-slate-800","dark:text-slate-100"],["title","Alignment",3,"code"],[1,"space-y-4","bg-slate-200/60","dark:bg-slate-900/70","p-2","rounded-xl"],["size","md",3,"centered"],[1,"bg-indigo-100","dark:bg-indigo-900/40","border","border-indigo-200","dark:border-indigo-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"],[1,"bg-pink-100","dark:bg-pink-900/50","border","border-pink-200","dark:border-pink-700","p-4","rounded","text-center","text-slate-800","dark:text-slate-100"]],template:function(d,i){d&1&&(s(0,"app-page-header",0),n(1,"app-demo-section",1)(2,"div",2)(3,"tw-container",3)(4,"div",4)(5,"h3",5),t(6,"Centered Content"),e(),n(7,"p",6),t(8,"This content is inside a large centered container. Try resizing your browser to see how it behaves."),e()()()()(),n(9,"app-demo-section",7)(10,"div",8)(11,"tw-container",9)(12,"div",10)(13,"span",11),t(14,"sm"),e(),t(15," - max-w-screen-sm (640px) "),e()(),n(16,"tw-container",12)(17,"div",13)(18,"span",11),t(19,"md"),e(),t(20," - max-w-screen-md (768px) "),e()(),n(21,"tw-container",3)(22,"div",14)(23,"span",11),t(24,"lg"),e(),t(25," - max-w-screen-lg (1024px) "),e()(),n(26,"tw-container",15)(27,"div",16)(28,"span",11),t(29,"xl"),e(),t(30," - max-w-screen-xl (1280px) "),e()(),n(31,"tw-container",17)(32,"div",18)(33,"span",11),t(34,"prose"),e(),t(35," - max-w-prose (65ch) - ideal for reading "),e()()()(),n(36,"app-demo-section",19)(37,"div",20)(38,"tw-container",21)(39,"div",22)(40,"span",11),t(41,'padding="none"'),e(),t(42," - No horizontal padding "),e()(),n(43,"tw-container",23)(44,"div",24)(45,"span",11),t(46,'padding="sm"'),e(),t(47," - Small padding (px-2 sm:px-4) "),e()(),n(48,"tw-container",25)(49,"div",26)(50,"span",11),t(51,'padding="md"'),e(),t(52," - Medium padding (default) "),e()(),n(53,"tw-container",27)(54,"div",28)(55,"span",11),t(56,'padding="lg"'),e(),t(57," - Large padding "),e()()()(),n(58,"app-demo-section",29)(59,"div",30)(60,"tw-container",31)(61,"div",32),t(62," Centered container (default) "),e()(),n(63,"tw-container",31)(64,"div",33),t(65," Left-aligned container "),e()()()()),d&2&&(r(),a("code",i.basicCode),r(8),a("code",i.sizesCode),r(27),a("code",i.paddingCode),r(22),a("code",i.alignmentCode),r(2),a("centered",!0),r(3),a("centered",!1))},dependencies:[p,m,c,g],encapsulation:2})};export{b as ContainerDemoComponent};
