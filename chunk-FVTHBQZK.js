import{a as x,b as y}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ma as f,W as m,h as s,ha as w,ia as p,ja as b,ka as h,la as v,ma as u,na as g}from"./chunk-5LPP6ASA.js";import{Ba as r,Jb as a,Ra as c,hb as d,ib as e,jb as t,kb as i}from"./chunk-2G56FVSW.js";var C=class l{variantsCode=`<tw-card variant="elevated">
  <tw-card-body>Elevated card with shadow</tw-card-body>
</tw-card>

<tw-card variant="outlined">
  <tw-card-body>Outlined card with border</tw-card-body>
</tw-card>

<tw-card variant="filled">
  <tw-card-body>Filled card with background</tw-card-body>
</tw-card>

<tw-card variant="ghost">
  <tw-card-body>Ghost transparent card</tw-card-body>
</tw-card>`;headerFooterCode=`<tw-card variant="elevated">
  <tw-card-header>
    <tw-card-title>Card Title</tw-card-title>
    <tw-card-subtitle>Supporting text</tw-card-subtitle>
  </tw-card-header>
  <tw-card-body>
    <p>Main content area of the card.</p>
  </tw-card-body>
  <tw-card-footer>
    <tw-button variant="ghost" size="sm">Cancel</tw-button>
    <tw-button variant="primary" size="sm">Save</tw-button>
  </tw-card-footer>
</tw-card>`;mediaCode=`<tw-card variant="elevated">
  <tw-card-media position="top">
    <img src="image.jpg" alt="Description" class="w-full h-48 object-cover">
  </tw-card-media>
  <tw-card-body>
    <h3 class="font-semibold">Card Title</h3>
    <p class="text-sm text-slate-600">Card description text.</p>
  </tw-card-body>
</tw-card>`;interactiveCode=`<!-- Hoverable card -->
<tw-card variant="outlined" [hoverable]="true">
  <tw-card-body>Hover to see the lift effect</tw-card-body>
</tw-card>

<!-- Clickable card -->
<tw-card variant="outlined" [clickable]="true">
  <tw-card-body>Click to trigger an action</tw-card-body>
</tw-card>

<!-- Both hoverable and clickable -->
<tw-card variant="outlined" [hoverable]="true" [clickable]="true">
  <tw-card-body>Interactive card</tw-card-body>
</tw-card>`;complexCode=`<tw-card variant="elevated">
  <tw-card-media position="top">
    <img src="code.jpg" alt="Code" class="w-full h-40 object-cover">
  </tw-card-media>
  <tw-card-header>
    <div class="flex items-start justify-between">
      <div>
        <tw-card-title>ngx-tailwindcss</tw-card-title>
        <tw-card-subtitle>Angular + Tailwind</tw-card-subtitle>
      </div>
      <tw-badge variant="success" badgeStyle="soft">New</tw-badge>
    </div>
  </tw-card-header>
  <tw-card-body>
    <p>Beautiful Angular components for Tailwind CSS 4+.</p>
    <div class="flex flex-wrap gap-2 mt-4">
      <tw-badge variant="neutral" [pill]="true">Angular</tw-badge>
      <tw-badge variant="neutral" [pill]="true">Tailwind</tw-badge>
    </div>
  </tw-card-body>
  <tw-card-footer>
    <tw-button variant="primary" size="sm" [fullWidth]="true">Learn More</tw-button>
  </tw-card-footer>
</tw-card>`;static \u0275fac=function(n){return new(n||l)};static \u0275cmp=c({type:l,selectors:[["app-card-demo"]],decls:116,vars:13,consts:[["title","Card","description","Flexible card component for displaying content in a contained format."],["title","Variants","description","Different visual styles for various use cases.",3,"code"],[1,"grid","md:grid-cols-2","lg:grid-cols-4","gap-4"],["variant","elevated",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg"],[1,"font-semibold","text-slate-900","dark:text-white","mb-2"],[1,"text-sm","text-slate-600","dark:text-slate-300"],["variant","outlined",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg"],["variant","filled",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg"],["variant","ghost",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg"],["title","With Header and Footer","description","Structured card with header, body, and footer sections.",3,"code"],[1,"max-w-md"],[1,"dark:text-white"],[1,"dark:text-slate-300"],[1,"text-slate-600","dark:text-slate-300"],["variant","ghost","size","sm"],["variant","primary","size","sm"],["title","With Media","description","Cards with images or other media content.",3,"code"],[1,"grid","md:grid-cols-3","gap-6"],["position","top"],["src","https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop","alt","Ocean waves",1,"w-full","h-48","object-cover"],["src","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop","alt","Mountain landscape",1,"w-full","h-48","object-cover"],["src","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop","alt","Forest path",1,"w-full","h-48","object-cover"],["title","Interactive Cards","description","Cards with hover effects and click interactions.",3,"code"],[1,"grid","md:grid-cols-3","gap-4"],["variant","outlined",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg",3,"hoverable"],["variant","outlined",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg",3,"clickable"],["variant","outlined",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-lg",3,"hoverable","clickable"],["title","Complex Card","description","A more complex card example with multiple elements.",3,"code"],[1,"max-w-sm"],["variant","elevated",1,"bg-white","dark:bg-slate-900/80","border","border-slate-200","dark:border-slate-700","shadow-xl"],["src","https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop","alt","Code on screen",1,"w-full","h-40","object-cover"],[1,"flex","items-start","justify-between"],["variant","success","badgeStyle","soft"],[1,"text-slate-600","dark:text-slate-300","text-sm"],[1,"flex","flex-wrap","gap-2","mt-4"],["variant","neutral",3,"pill"],["variant","primary","size","sm",3,"fullWidth"]],template:function(n,o){n&1&&(i(0,"app-page-header",0),e(1,"app-demo-section",1)(2,"div",2)(3,"tw-card",3)(4,"tw-card-body")(5,"h3",4),a(6,"Elevated"),t(),e(7,"p",5),a(8,"Card with shadow"),t()()(),e(9,"tw-card",6)(10,"tw-card-body")(11,"h3",4),a(12,"Outlined"),t(),e(13,"p",5),a(14,"Card with border"),t()()(),e(15,"tw-card",7)(16,"tw-card-body")(17,"h3",4),a(18,"Filled"),t(),e(19,"p",5),a(20,"Card with background"),t()()(),e(21,"tw-card",8)(22,"tw-card-body")(23,"h3",4),a(24,"Ghost"),t(),e(25,"p",5),a(26,"Transparent card"),t()()()()(),e(27,"app-demo-section",9)(28,"div",10)(29,"tw-card",3)(30,"tw-card-header")(31,"tw-card-title",11),a(32,"Card Title"),t(),e(33,"tw-card-subtitle",12),a(34,"Supporting text below the title"),t()(),e(35,"tw-card-body")(36,"p",13),a(37," This is the main content area of the card. You can put any content here, including text, images, forms, or other components. "),t()(),e(38,"tw-card-footer")(39,"tw-button",14),a(40,"Cancel"),t(),e(41,"tw-button",15),a(42,"Save"),t()()()()(),e(43,"app-demo-section",16)(44,"div",17)(45,"tw-card",3)(46,"tw-card-media",18),i(47,"img",19),t(),e(48,"tw-card-body")(49,"h3",4),a(50,"Ocean View"),t(),e(51,"p",5),a(52,"A beautiful view of the ocean at sunset."),t()()(),e(53,"tw-card",3)(54,"tw-card-media",18),i(55,"img",20),t(),e(56,"tw-card-body")(57,"h3",4),a(58,"Mountain Peak"),t(),e(59,"p",5),a(60,"Majestic mountains reaching the clouds."),t()()(),e(61,"tw-card",3)(62,"tw-card-media",18),i(63,"img",21),t(),e(64,"tw-card-body")(65,"h3",4),a(66,"Forest Trail"),t(),e(67,"p",5),a(68,"A peaceful walk through the woods."),t()()()()(),e(69,"app-demo-section",22)(70,"div",23)(71,"tw-card",24)(72,"tw-card-body")(73,"h3",4),a(74,"Hoverable"),t(),e(75,"p",5),a(76,"Hover to see the lift effect."),t()()(),e(77,"tw-card",25)(78,"tw-card-body")(79,"h3",4),a(80,"Clickable"),t(),e(81,"p",5),a(82,"Click to trigger an action."),t()()(),e(83,"tw-card",26)(84,"tw-card-body")(85,"h3",4),a(86,"Both"),t(),e(87,"p",5),a(88,"Hoverable and clickable combined."),t()()()()(),e(89,"app-demo-section",27)(90,"div",28)(91,"tw-card",29)(92,"tw-card-media",18),i(93,"img",30),t(),e(94,"tw-card-header")(95,"div",31)(96,"div")(97,"tw-card-title"),a(98,"ngx-tailwindcss"),t(),e(99,"tw-card-subtitle"),a(100,"Angular + Tailwind"),t()(),e(101,"tw-badge",32),a(102,"New"),t()()(),e(103,"tw-card-body")(104,"p",33),a(105," Beautiful, accessible Angular components designed for Tailwind CSS 4+. "),t(),e(106,"div",34)(107,"tw-badge",35),a(108,"Angular"),t(),e(109,"tw-badge",35),a(110,"Tailwind"),t(),e(111,"tw-badge",35),a(112,"TypeScript"),t()()(),e(113,"tw-card-footer")(114,"tw-button",36),a(115,"Learn More"),t()()()()()),n&2&&(r(),d("code",o.variantsCode),r(26),d("code",o.headerFooterCode),r(16),d("code",o.mediaCode),r(26),d("code",o.interactiveCode),r(2),d("hoverable",!0),r(6),d("clickable",!0),r(6),d("hoverable",!0)("clickable",!0),r(6),d("code",o.complexCode),r(18),d("pill",!0),r(2),d("pill",!0),r(2),d("pill",!0),r(3),d("fullWidth",!0))},dependencies:[s,g,w,p,b,h,v,u,m,f,x,y],encapsulation:2})};export{C as CardDemoComponent};
