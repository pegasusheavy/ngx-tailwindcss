import{a as C,b as h}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Fa as g,Ga as z,h as w}from"./chunk-5LPP6ASA.js";import{Ba as n,Jb as e,Lb as d,Mb as x,Ra as m,Xb as l,eb as c,fb as S,gb as v,hb as r,ib as i,jb as t,kb as u}from"./chunk-2G56FVSW.js";var b=()=>[30,70],f=()=>[40,60],P=()=>[50,50],y=()=>[150,200],D=()=>[20,80],T=()=>[150,300],_=()=>[70,30];function F(p,s){if(p&1&&(i(0,"div",17)(1,"tw-splitter",34)(2,"div",4)(3,"span",35),e(4),t()(),i(5,"div",7),e(6," Content "),t()()()),p&2){let a=s.$implicit;n(),r("gutterSize",a),n(3),d("",a," gutter")}}var E=class p{gutterSizes=["sm","md","lg"];basicCode=`<tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
  <div twSplitterPane class="p-4 bg-slate-50">
    Left Panel
  </div>
  <div twSplitterPane class="p-4">
    Right Panel
  </div>
</tw-splitter>`;verticalCode=`<tw-splitter direction="vertical" [initialSizes]="[40, 60]">
  <div twSplitterPane class="p-4 bg-blue-50">
    Top Panel
  </div>
  <div twSplitterPane class="p-4 bg-slate-50">
    Bottom Panel
  </div>
</tw-splitter>`;minSizesCode=`<tw-splitter
  direction="horizontal"
  [initialSizes]="[50, 50]"
  [minSizes]="[150, 200]">
  <div twSplitterPane>
    Min 150px panel
  </div>
  <div twSplitterPane>
    Min 200px panel
  </div>
</tw-splitter>`;gutterCode=`<!-- Small gutter -->
<tw-splitter gutterSize="sm">...</tw-splitter>

<!-- Medium gutter (default) -->
<tw-splitter gutterSize="md">...</tw-splitter>

<!-- Large gutter -->
<tw-splitter gutterSize="lg">...</tw-splitter>`;ideCode=`<tw-splitter direction="horizontal" [initialSizes]="[20, 80]">
  <div twSplitterPane>
    <!-- File explorer -->
  </div>
  <div twSplitterPane>
    <tw-splitter direction="vertical" [initialSizes]="[70, 30]">
      <div twSplitterPane>
        <!-- Code editor -->
      </div>
      <div twSplitterPane>
        <!-- Terminal -->
      </div>
    </tw-splitter>
  </div>
</tw-splitter>`;static \u0275fac=function(a){return new(a||p)};static \u0275cmp=m({type:p,selectors:[["app-splitter-demo"]],decls:88,vars:23,consts:[["title","Splitter","description","Resizable split pane component for creating adjustable layouts."],["title","Basic Usage",3,"code"],[1,"h-[300px]","border","rounded-lg","overflow-hidden"],["direction","horizontal",3,"initialSizes"],["twSplitterPane","",1,"p-4","bg-slate-50"],[1,"font-semibold","mb-2"],[1,"text-sm","text-slate-600"],["twSplitterPane","",1,"p-4"],["title","Vertical Split",3,"code"],[1,"h-[400px]","border","rounded-lg","overflow-hidden"],["direction","vertical",3,"initialSizes"],["twSplitterPane","",1,"p-4","bg-blue-50"],["title","Minimum Sizes",3,"code"],["direction","horizontal",3,"initialSizes","minSizes"],["twSplitterPane","",1,"p-4","bg-green-50"],["title","Gutter Sizes",3,"code"],[1,"space-y-4"],[1,"h-[150px]","border","rounded-lg","overflow-hidden"],["title","IDE-like Layout",3,"code"],[1,"h-[500px]","border","rounded-lg","overflow-hidden","bg-slate-900"],["twSplitterPane","",1,"bg-slate-800","p-2"],[1,"text-slate-400","text-xs","uppercase","mb-2"],[1,"space-y-1"],[1,"text-slate-300","text-sm","px-2","py-1","hover:bg-slate-700","rounded","cursor-pointer"],[1,"text-slate-300","text-sm","px-2","py-1","hover:bg-slate-700","rounded","cursor-pointer","ml-2"],["twSplitterPane",""],["twSplitterPane","",1,"bg-slate-900","p-4"],[1,"font-mono","text-sm","text-slate-300"],[1,"text-purple-400"],[1,"text-green-400"],[1,"mt-2"],["twSplitterPane","",1,"bg-slate-950","p-2"],[1,"text-slate-400","text-xs","uppercase","mb-1"],[1,"font-mono","text-sm","text-green-400"],["direction","horizontal",3,"gutterSize"],[1,"font-semibold"]],template:function(a,o){a&1&&(u(0,"app-page-header",0),i(1,"app-demo-section",1)(2,"div",2)(3,"tw-splitter",3)(4,"div",4)(5,"h3",5),e(6,"Left Panel"),t(),i(7,"p",6),e(8,"Drag the divider to resize."),t()(),i(9,"div",7)(10,"h3",5),e(11,"Right Panel"),t(),i(12,"p",6),e(13,"This panel takes up the remaining space."),t()()()()(),i(14,"app-demo-section",8)(15,"div",9)(16,"tw-splitter",10)(17,"div",11)(18,"h3",5),e(19,"Top Panel"),t(),i(20,"p",6),e(21,"Code editor area"),t()(),i(22,"div",4)(23,"h3",5),e(24,"Bottom Panel"),t(),i(25,"p",6),e(26,"Console output area"),t()()()()(),i(27,"app-demo-section",12)(28,"div",2)(29,"tw-splitter",13)(30,"div",14)(31,"h3",5),e(32,"Min 150px"),t(),i(33,"p",6),e(34,"This panel won't shrink below 150px."),t()(),i(35,"div",7)(36,"h3",5),e(37,"Min 200px"),t(),i(38,"p",6),e(39,"This panel won't shrink below 200px."),t()()()()(),i(40,"app-demo-section",15)(41,"div",16),S(42,F,7,2,"div",17,c),t()(),i(44,"app-demo-section",18)(45,"div",19)(46,"tw-splitter",13)(47,"div",20)(48,"div",21),e(49,"Explorer"),t(),i(50,"div",22)(51,"div",23),e(52,"\u{1F4C1} src"),t(),i(53,"div",24),e(54,"\u{1F4C4} app.ts"),t(),i(55,"div",24),e(56,"\u{1F4C4} main.ts"),t(),i(57,"div",23),e(58,"\u{1F4C1} assets"),t()()(),i(59,"div",25)(60,"tw-splitter",10)(61,"div",26)(62,"div",27)(63,"div")(64,"span",28),e(65,"import"),t(),e(66),i(67,"span",28),e(68,"from"),t(),i(69,"span",29),e(70,"'@angular/core'"),t(),e(71,";"),t(),i(72,"div",30)(73,"span",28),e(74,"@Component"),t(),e(75),t(),i(76,"div"),e(77," selector: "),i(78,"span",29),e(79,"'app-root'"),t(),e(80,","),t(),i(81,"div"),e(82),t()()(),i(83,"div",31)(84,"div",32),e(85,"Terminal"),t(),i(86,"div",33),e(87,"$ ng serve"),t()()()()()()()),a&2&&(n(),r("code",o.basicCode),n(2),r("initialSizes",l(16,b)),n(11),r("code",o.verticalCode),n(2),r("initialSizes",l(17,f)),n(11),r("code",o.minSizesCode),n(2),r("initialSizes",l(18,P))("minSizes",l(19,y)),n(11),r("code",o.gutterCode),n(2),v(o.gutterSizes),n(2),r("code",o.ideCode),n(2),r("initialSizes",l(20,D))("minSizes",l(21,T)),n(14),r("initialSizes",l(22,_)),n(6),x(" ","{"," Component ","}"," "),n(9),d("(","{"),n(7),d("","}",")"))},dependencies:[w,g,z,C,h],encapsulation:2})};export{E as SplitterDemoComponent};
