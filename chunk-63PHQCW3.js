import{a as x,b as w}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ka as h,h as g}from"./chunk-5LPP6ASA.js";import{Ba as n,Jb as i,Lb as u,Mb as b,Ra as s,fb as c,gb as p,hb as a,ib as e,jb as t,kb as m}from"./chunk-2G56FVSW.js";var f=(o,r)=>r.name;function y(o,r){if(o&1&&(e(0,"div",2)(1,"div",17)(2,"p",18),i(3),t(),e(4,"tw-bleed",48)(5,"div",49),i(6),t()()()()),o&2){let l=r.$implicit;n(3),b("",l.name," (",l.value,")"),n(),a("amount",l.value),n(2),u(" Bleeds ",l.name," ")}}var v=class o{amounts=[{name:"Small",value:"sm"},{name:"Medium",value:"md"},{name:"Large",value:"lg"},{name:"Extra Large",value:"xl"},{name:"Full",value:"full"}];basicCode=`<div class="max-w-md mx-auto">
  <p>Constrained content...</p>

  <tw-bleed direction="horizontal" amount="md">
    <div class="bg-blue-500 p-6">
      This bleeds outside the container
    </div>
  </tw-bleed>

  <p>Back to constrained...</p>
</div>`;fullWidthCode=`<tw-bleed direction="horizontal" amount="full">
  <img
    src="hero.jpg"
    class="w-full h-48 object-cover"
  />
</tw-bleed>`;amountsCode=`<!-- Small: 1rem -->
<tw-bleed amount="sm">...</tw-bleed>

<!-- Medium: 2rem -->
<tw-bleed amount="md">...</tw-bleed>

<!-- Large: 4rem -->
<tw-bleed amount="lg">...</tw-bleed>

<!-- Extra Large: 6rem -->
<tw-bleed amount="xl">...</tw-bleed>

<!-- Full viewport width -->
<tw-bleed amount="full">...</tw-bleed>`;directionalCode=`<!-- Bleed left only -->
<tw-bleed direction="left" amount="lg">...</tw-bleed>

<!-- Bleed right only -->
<tw-bleed direction="right" amount="lg">...</tw-bleed>

<!-- Bleed both sides (default) -->
<tw-bleed direction="horizontal" amount="lg">...</tw-bleed>

<!-- Bleed all directions -->
<tw-bleed direction="all" amount="lg">...</tw-bleed>`;preservePaddingCode=`<!-- Background bleeds, content stays aligned -->
<tw-bleed
  direction="horizontal"
  amount="md"
  [preservePadding]="true">
  <div class="bg-slate-100 py-6">
    Content stays in original position
  </div>
</tw-bleed>`;blogCode=`<article class="max-w-2xl mx-auto px-6">
  <h1>Article Title</h1>
  <p>Introduction paragraph...</p>

  <!-- Full-width hero image -->
  <tw-bleed direction="horizontal" amount="full">
    <img src="hero.jpg" class="w-full" />
  </tw-bleed>

  <p>More content...</p>

  <!-- Quote with extended background -->
  <tw-bleed amount="lg" [preservePadding]="true">
    <blockquote class="bg-blue-50 py-4">
      "A meaningful quote..."
    </blockquote>
  </tw-bleed>
</article>`;static \u0275fac=function(l){return new(l||o)};static \u0275cmp=s({type:o,selectors:[["app-bleed-demo"]],decls:88,vars:8,consts:[["title","Bleed","description","Break out of container constraints for full-width elements within constrained layouts."],["title","Basic Usage",3,"code"],[1,"border","border-slate-200","dark:border-slate-700","rounded-lg","overflow-hidden","bg-slate-100/60","dark:bg-slate-900/70"],[1,"max-w-md","mx-auto","bg-white","dark:bg-slate-900/80","p-6"],[1,"font-semibold","mb-2","text-slate-900","dark:text-white"],[1,"text-slate-600","dark:text-slate-300","dark:text-slate-300","text-sm","mb-4"],["direction","horizontal","amount","md"],[1,"bg-blue-500","text-white","p-6","text-center"],[1,"text-slate-600","dark:text-slate-300","dark:text-slate-300","text-sm","mt-4"],["title","Full Width Bleed",3,"code"],[1,"border","border-slate-200","dark:border-slate-700","rounded-lg","overflow-hidden","bg-slate-100/50","dark:bg-slate-900/80"],[1,"max-w-lg","mx-auto","bg-white","dark:bg-slate-900/90","p-6"],["direction","horizontal","amount","full"],["src","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop","alt","Mountain landscape",1,"w-full","h-48","object-cover"],["title","Bleed Amounts",3,"code"],[1,"space-y-6"],["title","Directional Bleed",3,"code"],[1,"max-w-sm","mx-auto","bg-white","dark:bg-slate-900/90","p-4"],[1,"text-xs","text-slate-500","dark:text-slate-300","mb-2"],["direction","left","amount","lg"],[1,"bg-green-500","text-white","p-3","text-sm"],["direction","right","amount","lg"],[1,"bg-orange-500","text-white","p-3","text-sm"],["direction","horizontal","amount","lg"],[1,"bg-blue-500","text-white","p-3","text-sm","text-center"],["title","Preserve Padding",3,"code"],[1,"max-w-md","mx-auto","bg-white","dark:bg-slate-900/90","p-6"],[1,"text-slate-600","dark:text-slate-300","text-sm","mb-4"],[1,"bg-slate-100","px-1","rounded"],["direction","horizontal","amount","md",3,"preservePadding"],[1,"bg-slate-100","py-6"],[1,"text-slate-700"],[1,"text-slate-600","dark:text-slate-300","text-sm","mt-4"],["title","Real World: Blog Post",3,"code"],[1,"border","border-slate-200","dark:border-slate-700","rounded-lg","overflow-hidden","bg-white","dark:bg-slate-900/80"],[1,"max-w-2xl","mx-auto","px-6","py-8"],[1,"mb-6"],[1,"text-2xl","font-bold","text-slate-900"],[1,"text-slate-500","dark:text-slate-300","mt-2"],[1,"text-slate-600","dark:text-slate-300","leading-relaxed","mb-6"],[1,"my-0"],["src","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=500&fit=crop","alt","Mountain vista",1,"w-full","h-64","object-cover"],[1,"text-center","text-sm","text-slate-500","dark:text-slate-300","py-2","bg-slate-50"],[1,"text-slate-600","dark:text-slate-300","leading-relaxed","mt-6"],["direction","horizontal","amount","lg",3,"preservePadding"],[1,"border-l-4","border-blue-500","bg-blue-50","py-4","my-6"],[1,"text-blue-900","italic"],[1,"text-slate-600","dark:text-slate-300","leading-relaxed"],["direction","horizontal",3,"amount"],[1,"bg-gradient-to-r","from-purple-500","to-pink-500","text-white","p-3","text-center","text-sm"]],template:function(l,d){l&1&&(m(0,"app-page-header",0),e(1,"app-demo-section",1)(2,"div",2)(3,"div",3)(4,"h3",4),i(5,"Constrained Content"),t(),e(6,"p",5),i(7,"This content is within a max-w-md container."),t(),e(8,"tw-bleed",6)(9,"div",7),i(10," This section bleeds outside the container "),t()(),e(11,"p",8),i(12,"Back to the constrained container."),t()()()(),e(13,"app-demo-section",9)(14,"div",10)(15,"div",11)(16,"h3",4),i(17,"Article Title"),t(),e(18,"p",5),i(19,"Introduction paragraph within the container bounds."),t(),e(20,"tw-bleed",12),m(21,"img",13),t(),e(22,"p",8),i(23,"The article continues after the full-width image."),t()()()(),e(24,"app-demo-section",14)(25,"div",15),c(26,y,7,4,"div",2,f),t()(),e(28,"app-demo-section",16)(29,"div",15)(30,"div",2)(31,"div",17)(32,"p",18),i(33,"Left only"),t(),e(34,"tw-bleed",19)(35,"div",20),i(36," Bleeds left "),t()()()(),e(37,"div",2)(38,"div",17)(39,"p",18),i(40,"Right only"),t(),e(41,"tw-bleed",21)(42,"div",22),i(43," Bleeds right "),t()()()(),e(44,"div",2)(45,"div",17)(46,"p",18),i(47,"Horizontal (both sides)"),t(),e(48,"tw-bleed",23)(49,"div",24),i(50," Bleeds both sides "),t()()()()()(),e(51,"app-demo-section",25)(52,"div",2)(53,"div",26)(54,"p",27),i(55,"With "),e(56,"code",28),i(57,"preservePadding"),t(),i(58,", the content stays aligned while the background extends:"),t(),e(59,"tw-bleed",29)(60,"div",30)(61,"p",31),i(62,"Content stays aligned with the container while the background bleeds out."),t()()(),e(63,"p",32),i(64,"Text continues in the container."),t()()()(),e(65,"app-demo-section",33)(66,"div",34)(67,"article",35)(68,"header",36)(69,"h1",37),i(70,"Exploring the Mountains"),t(),e(71,"p",38),i(72,"A journey through the wilderness"),t()(),e(73,"p",39),i(74," The morning sun cast golden rays across the valley as we began our ascent. The air was crisp and filled with the scent of pine trees. "),t(),e(75,"tw-bleed",12)(76,"figure",40),m(77,"img",41),e(78,"figcaption",42),i(79," The view from the summit at sunrise "),t()()(),e(80,"p",43),i(81," After hours of climbing, we finally reached the summit. The panoramic view stretched for miles in every direction, making every step of the journey worthwhile. "),t(),e(82,"tw-bleed",44)(83,"blockquote",45)(84,"p",46),i(85,' "The mountains are calling and I must go." \u2014 John Muir '),t()()(),e(86,"p",47),i(87," As we descended, the setting sun painted the sky in brilliant oranges and purples, a perfect end to an unforgettable day. "),t()()()()),l&2&&(n(),a("code",d.basicCode),n(12),a("code",d.fullWidthCode),n(11),a("code",d.amountsCode),n(2),p(d.amounts),n(2),a("code",d.directionalCode),n(23),a("code",d.preservePaddingCode),n(8),a("preservePadding",!0),n(6),a("code",d.blogCode),n(17),a("preservePadding",!0))},dependencies:[g,h,x,w],encapsulation:2})};export{v as BleedDemoComponent};
