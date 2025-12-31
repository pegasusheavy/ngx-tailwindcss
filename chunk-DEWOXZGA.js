import{a as b,b as f}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ja as h,h as w,na as C}from"./chunk-5LPP6ASA.js";import{Ba as e,Jb as a,Kb as m,Lb as s,Ra as v,eb as g,fb as c,gb as p,hb as n,ib as t,jb as o,kb as u,ub as x}from"./chunk-2G56FVSW.js";var S=(l,d)=>d.title,k=(l,d)=>d.name;function T(l,d){if(l&1&&(t(0,"div")(1,"h4",13),a(2),o(),t(3,"tw-card",2)(4,"tw-columns",32)(5,"p",15),a(6),o()()()()),l&2){let r=d.$implicit,i=x();e(2),s("",r," Column(s)"),e(),n("padded",!0),e(),n("count",r),e(2),s(" ",i.shortText," ")}}function E(l,d){if(l&1&&(t(0,"div",20)(1,"h4",33),a(2),o(),t(3,"p",34),a(4),o()()),l&2){let r=d.$implicit;e(2),m(r.title),e(2),m(r.text)}}function I(l,d){if(l&1&&(t(0,"div")(1,"h4",13),a(2),o(),t(3,"tw-card",2)(4,"tw-columns",35)(5,"p",36),a(6),o()()()()),l&2){let r=d.$implicit,i=x();e(2),s("",r.name," gap"),e(),n("padded",!0),e(),n("count",3)("gap",r.value),e(2),m(i.shortText)}}var y=class l{columnCounts=[1,2,3,4];gaps=[{name:"Small",value:"sm"},{name:"Medium",value:"md"},{name:"Large",value:"lg"},{name:"Extra Large",value:"xl"}];cardItems=[{title:"Card One",text:"This is the first card with some content that demonstrates the avoid break feature."},{title:"Card Two",text:"The second card also has content and won't split across columns."},{title:"Card Three",text:"Third card in the list showing how columns handle discrete items."},{title:"Card Four",text:"Fourth and final card in this demo section."}];loremText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";shortText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";basicCode=`<tw-columns [count]="2" gap="lg">
  <p>First paragraph of text that will flow...</p>
  <p>Second paragraph continues in the columns...</p>
</tw-columns>`;countsCode=`<!-- 1 column -->
<tw-columns [count]="1">...</tw-columns>

<!-- 2 columns -->
<tw-columns [count]="2">...</tw-columns>

<!-- 3 columns -->
<tw-columns [count]="3">...</tw-columns>

<!-- Up to 6 columns supported -->
<tw-columns [count]="6">...</tw-columns>`;responsiveCode=`<!-- 1 col on mobile, 2 on md, 3 on lg -->
<tw-columns
  [count]="1"
  [countMd]="2"
  [countLg]="3"
  gap="lg">
  <p>Content flows into columns responsively...</p>
</tw-columns>`;rulesCode=`<!-- Solid divider line between columns -->
<tw-columns [count]="3" rule="solid" ruleColor="slate-300">
  ...
</tw-columns>

<!-- Dashed divider -->
<tw-columns [count]="3" rule="dashed" ruleColor="slate-300">
  ...
</tw-columns>

<!-- Dotted divider -->
<tw-columns [count]="3" rule="dotted" ruleColor="slate-400">
  ...
</tw-columns>`;avoidBreakCode=`<!-- Cards won't split across columns -->
<tw-columns [count]="2" [avoidBreak]="true">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</tw-columns>`;gapsCode=`<tw-columns gap="none">...</tw-columns>  <!-- 0 -->
<tw-columns gap="xs">...</tw-columns>    <!-- 0.5rem -->
<tw-columns gap="sm">...</tw-columns>    <!-- 1rem -->
<tw-columns gap="md">...</tw-columns>    <!-- 1.5rem -->
<tw-columns gap="lg">...</tw-columns>    <!-- 2rem -->
<tw-columns gap="xl">...</tw-columns>    <!-- 3rem -->`;magazineCode=`<article>
  <h2 class="text-2xl font-bold">Article Title</h2>
  <img src="hero.jpg" class="w-full rounded-lg mb-6" />

  <tw-columns
    [count]="1"
    [countMd]="2"
    gap="xl"
    rule="solid"
    ruleColor="slate-200">
    <p class="first-letter:text-4xl first-letter:font-bold">
      Lorem ipsum...
    </p>
  </tw-columns>
</article>`;static \u0275fac=function(r){return new(r||l)};static \u0275cmp=v({type:l,selectors:[["app-columns-demo"]],decls:73,vars:35,consts:[["title","Columns","description","Multi-column text layout component using CSS columns for newspaper-style content flow."],["title","Basic Usage",3,"code"],[1,"bg-white","dark:bg-slate-900","border","border-slate-200","dark:border-slate-700","shadow-sm",3,"padded"],["gap","lg",3,"count"],[1,"text-slate-700","dark:text-slate-200","leading-relaxed"],[1,"text-slate-700","dark:text-slate-200","leading-relaxed","mt-4"],["title","Column Counts",3,"code"],[1,"space-y-6","bg-slate-100/60","dark:bg-slate-900/70","p-4","rounded-2xl","border","border-slate-200","dark:border-slate-700"],["title","Responsive Columns",3,"code"],["gap","lg",3,"count","countMd","countLg"],[1,"text-sm","text-slate-500","dark:text-slate-300","mt-2"],["title","Column Rules (Dividers)",3,"code"],[1,"space-y-6"],[1,"text-sm","font-medium","mb-2","text-slate-900","dark:text-slate-100"],["gap","lg","rule","solid","ruleColor","slate-300",3,"count"],[1,"text-sm","text-slate-600","dark:text-slate-300"],["gap","lg","rule","dashed","ruleColor","slate-300",3,"count"],["gap","lg","rule","dotted","ruleColor","slate-400",3,"count"],["title","Avoid Break",3,"code"],["gap","lg",3,"count","avoidBreak"],[1,"p-4","bg-slate-50","dark:bg-slate-800","text-slate-900","dark:text-slate-100","rounded-lg","mb-4","border","border-transparent","dark:border-slate-700/50"],[1,"text-sm","text-slate-500","mt-2"],[1,"bg-slate-100","px-1","rounded"],["title","Gap Sizes",3,"code"],["title","Magazine Layout Example",3,"code"],[1,"bg-white","dark:bg-slate-900","border","border-slate-200","dark:border-slate-700","shadow-lg",3,"padded"],[1,"text-slate-900","dark:text-slate-100"],[1,"text-2xl","font-bold","mb-2"],[1,"text-slate-500","dark:text-slate-300","text-sm","mb-4"],[1,"w-full","h-48","bg-gradient-to-br","from-blue-400","to-purple-500","dark:from-slate-800","dark:to-slate-900","rounded-lg","mb-6","shadow-lg","ring-1","ring-slate-200","dark:ring-slate-700"],["gap","xl","rule","solid","ruleColor","slate-200",3,"count","countMd"],[1,"text-slate-700","dark:text-slate-200","leading-relaxed","first-letter:text-4xl","first-letter:font-bold","first-letter:float-left","first-letter:mr-2"],["gap","md",3,"count"],[1,"font-semibold","text-slate-900","dark:text-white"],[1,"text-sm","text-slate-600","dark:text-slate-300","mt-2"],[3,"count","gap"],[1,"text-xs","text-slate-600","dark:text-slate-300"]],template:function(r,i){r&1&&(u(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"tw-card",2)(3,"tw-columns",3)(4,"p",4),a(5),o(),t(6,"p",5),a(7),o()()()(),t(8,"app-demo-section",6)(9,"div",7),c(10,T,7,4,"div",null,g),o()(),t(12,"app-demo-section",8)(13,"tw-card",2)(14,"tw-columns",9)(15,"p",4),a(16),o(),t(17,"p",5),a(18),o()()(),t(19,"p",10),a(20," Resize your browser to see the columns change: 1 column on mobile, 2 on tablet, 3 on desktop. "),o()(),t(21,"app-demo-section",11)(22,"div",12)(23,"div")(24,"h4",13),a(25,"Solid Rule"),o(),t(26,"tw-card",2)(27,"tw-columns",14)(28,"p",15),a(29),o()()()(),t(30,"div")(31,"h4",13),a(32,"Dashed Rule"),o(),t(33,"tw-card",2)(34,"tw-columns",16)(35,"p",15),a(36),o()()()(),t(37,"div")(38,"h4",13),a(39,"Dotted Rule"),o(),t(40,"tw-card",2)(41,"tw-columns",17)(42,"p",15),a(43),o()()()()()(),t(44,"app-demo-section",18)(45,"tw-card",2)(46,"tw-columns",19),c(47,E,5,2,"div",20,S),o()(),t(49,"p",21),a(50," With "),t(51,"code",22),a(52,"avoidBreak"),o(),a(53,", cards won't split across columns. "),o()(),t(54,"app-demo-section",23)(55,"div",7),c(56,I,7,5,"div",null,k),o()(),t(58,"app-demo-section",24)(59,"tw-card",25)(60,"article",26)(61,"h2",27),a(62,"The Future of Web Development"),o(),t(63,"p",28),a(64,"By John Doe \u2022 December 17, 2025"),o(),u(65,"div",29),t(66,"tw-columns",30)(67,"p",31),a(68),o(),t(69,"p",5),a(70),o(),t(71,"p",5),a(72),o()()()()()),r&2&&(e(),n("code",i.basicCode),e(),n("padded",!0),e(),n("count",2),e(2),s(" ",i.loremText," "),e(2),s(" ",i.loremText," "),e(),n("code",i.countsCode),e(2),p(i.columnCounts),e(2),n("code",i.responsiveCode),e(),n("padded",!0),e(),n("count",1)("countMd",2)("countLg",3),e(2),s(" ",i.loremText," "),e(2),s(" ",i.loremText," "),e(3),n("code",i.rulesCode),e(5),n("padded",!0),e(),n("count",3),e(2),m(i.shortText),e(4),n("padded",!0),e(),n("count",3),e(2),m(i.shortText),e(4),n("padded",!0),e(),n("count",3),e(2),m(i.shortText),e(),n("code",i.avoidBreakCode),e(),n("padded",!0),e(),n("count",2)("avoidBreak",!0),e(),p(i.cardItems),e(7),n("code",i.gapsCode),e(2),p(i.gaps),e(2),n("code",i.magazineCode),e(),n("padded",!0),e(7),n("count",1)("countMd",2),e(2),s(" ",i.loremText," "),e(2),s(" ",i.loremText," "),e(2),s(" ",i.loremText," "))},dependencies:[w,h,C,b,f],encapsulation:2})};export{y as ColumnsDemoComponent};
