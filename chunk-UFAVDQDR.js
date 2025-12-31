import{a as V,b as B}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{La as I,W as T,h as E,na as M}from"./chunk-5LPP6ASA.js";import{Ba as o,Ib as g,Jb as n,Kb as S,Lb as b,Ra as x,aa as p,ba as u,bb as k,cb as D,fb as _,gb as y,hb as m,ib as t,ja as v,jb as i,kb as O,pb as w,tb as c,ub as d,ya as C}from"./chunk-2G56FVSW.js";var h=(r,s)=>s.value,N=(r,s)=>s.id;function z(r,s){if(r&1){let l=w();t(0,"tw-button",39),c("click",function(){let a=p(l).$implicit,f=d();return u(f.openOverlay(a.value))}),n(1),i()}if(r&2){let l=s.$implicit;o(),b(" ",l.label," ")}}function L(r,s){if(r&1){let l=w();t(0,"tw-overlay",40),c("close",function(){p(l);let a=d();return u(a.currentOpacity.set(null))}),t(1,"tw-card",4)(2,"h3",5),n(3),i(),t(4,"p",6),n(5),i(),t(6,"tw-button",2),c("click",function(){p(l);let a=d();return u(a.currentOpacity.set(null))}),n(7,"Close"),i()()()}if(r&2){let l=s.$implicit,e=d();m("visible",e.currentOpacity()===l.value)("opacity",l.value),o(),g(e.overlayCardClass),m("padded",!0),o(2),b("",l.label," Opacity"),o(2),b("Opacity: ",l.value)}}function $(r,s){if(r&1){let l=w();t(0,"tw-button",39),c("click",function(){let a=p(l).$implicit,f=d();return u(f.openBlur(a.value))}),n(1),i()}if(r&2){let l=s.$implicit;o(),b(" ",l.label," ")}}function j(r,s){if(r&1){let l=w();t(0,"tw-overlay",41),c("close",function(){p(l);let a=d();return u(a.currentBlur.set(null))}),t(1,"tw-card",4)(2,"h3",5),n(3),i(),t(4,"p",6),n(5),i(),t(6,"tw-button",2),c("click",function(){p(l);let a=d();return u(a.currentBlur.set(null))}),n(7,"Close"),i()()()}if(r&2){let l=s.$implicit,e=d();m("visible",e.currentBlur()===l.value)("blur",l.value),o(),g(e.overlayCardClass),m("padded",!0),o(2),b("",l.label," Blur"),o(2),b("Background blur effect: ",l.value)}}function U(r,s){if(r&1){let l=w();t(0,"img",42),c("click",function(){let a=p(l).$implicit,f=d();return u(f.openLightbox(a))}),i()}if(r&2){let l=s.$implicit;m("src",l.thumb,C)("alt",l.alt)}}function A(r,s){if(r&1&&(t(0,"div",38),O(1,"img",43),t(2,"p",44),n(3),i()()),r&2){let l=d();o(),m("src",l.lightboxImage().full,C)("alt",l.lightboxImage().alt),o(2),S(l.lightboxImage().alt)}}var F=class r{basicOpen=v(!1);nonDismissibleOpen=v(!1);modalOpen=v(!1);drawerOpen=v(!1);lightboxImage=v(null);currentOpacity=v(null);currentBlur=v(null);opacities=[{label:"Light",value:"light"},{label:"Medium",value:"medium"},{label:"Dark",value:"dark"},{label:"Solid",value:"solid"}];blurs=[{label:"None",value:"none"},{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"}];images=[{id:1,thumb:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",full:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",alt:"Mountain landscape"},{id:2,thumb:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop",full:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",alt:"Nature scene"},{id:3,thumb:"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200&h=200&fit=crop",full:"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200",alt:"Forest path"}];openOverlay(s){this.currentOpacity.set(s)}openBlur(s){this.currentBlur.set(s)}openLightbox(s){this.lightboxImage.set(s)}basicCode=`<tw-button (click)="isOpen = true">Open</tw-button>

<tw-overlay [visible]="isOpen" (close)="isOpen = false">
  <tw-card [padded]="true">
    <h3>Overlay Content</h3>
    <tw-button (click)="isOpen = false">Close</tw-button>
  </tw-card>
</tw-overlay>`;opacityCode=`<!-- Light (25% black) -->
<tw-overlay opacity="light">...</tw-overlay>

<!-- Medium (50% black) - default -->
<tw-overlay opacity="medium">...</tw-overlay>

<!-- Dark (75% black) -->
<tw-overlay opacity="dark">...</tw-overlay>

<!-- Solid (100% black) -->
<tw-overlay opacity="solid">...</tw-overlay>`;blurCode=`<!-- No blur -->
<tw-overlay blur="none">...</tw-overlay>

<!-- Small blur -->
<tw-overlay blur="sm" opacity="light">...</tw-overlay>

<!-- Medium blur -->
<tw-overlay blur="md" opacity="light">...</tw-overlay>

<!-- Large blur -->
<tw-overlay blur="lg" opacity="light">...</tw-overlay>`;nonDismissibleCode=`<tw-overlay
  [visible]="isOpen"
  [closeOnClick]="false"
  [closeOnEscape]="false"
  (close)="isOpen = false">
  <tw-card>
    <p>Must click button to close</p>
    <tw-button (click)="isOpen = false">Close</tw-button>
  </tw-card>
</tw-overlay>`;modalCode=`<tw-overlay [visible]="isOpen" blur="sm" (close)="isOpen = false">
  <tw-card class="max-w-lg">
    <div class="p-6 border-b">
      <h3>Modal Title</h3>
    </div>
    <div class="p-6">
      Modal content...
    </div>
    <div class="p-6 bg-slate-50 flex justify-end gap-3">
      <tw-button variant="ghost">Cancel</tw-button>
      <tw-button>Confirm</tw-button>
    </div>
  </tw-card>
</tw-overlay>`;drawerCode=`<tw-overlay [visible]="isOpen" [centered]="false" (close)="isOpen = false">
  <aside class="fixed right-0 top-0 h-full w-80 bg-white">
    <!-- Drawer content -->
  </aside>
</tw-overlay>`;lightboxCode=`<tw-overlay [visible]="!!image" opacity="dark" (close)="image = null">
  @if (image) {
    <img [src]="image.full" class="max-h-[80vh]" />
  }
</tw-overlay>`;overlayCardClass="max-w-md bg-white dark:bg-slate-800 dark:shadow-slate-900/50 duration-200 hover:shadow-xl p-6 rounded-xl shadow-lg transition-all";modalCardClass="max-w-lg w-full mx-4 bg-white dark:bg-slate-900/80 rounded-2xl shadow-2xl overflow-hidden";static \u0275fac=function(l){return new(l||r)};static \u0275cmp=x({type:r,selectors:[["app-overlay-demo"]],decls:88,vars:24,consts:[["title","Overlay","description","Backdrop overlay component for modals, drawers, and lightboxes."],["title","Basic Usage",3,"code"],[3,"click"],[1,"z-50",3,"close","visible"],[3,"padded"],[1,"text-lg","font-semibold","mb-2"],[1,"text-slate-600","dark:text-slate-300","mb-4"],["title","Opacity Levels",3,"code"],[1,"flex","flex-wrap","gap-3"],["variant","outline"],[1,"z-50",3,"visible","opacity"],["title","Blur Effect",3,"code"],["opacity","light",1,"z-50",3,"visible","blur"],["title","Non-dismissible Overlay",3,"code"],[1,"z-50",3,"close","visible","closeOnClick","closeOnEscape"],["title","Modal Dialog Example",3,"code"],["blur","sm","opacity","medium",1,"z-50",3,"close","visible"],[1,"p-6","border-b"],[1,"text-xl","font-semibold","text-slate-900","dark:text-white"],[1,"p-6"],[1,"text-slate-600","dark:text-slate-300"],[1,"p-6","bg-slate-50","dark:bg-slate-900/60","flex","justify-end","gap-3","rounded-b-lg"],["variant","ghost",3,"click"],["variant","danger",3,"click"],["title","Side Drawer Example",3,"code"],["blur","sm","opacity","medium",1,"z-50",3,"close","visible","centered"],[1,"fixed","right-0","top-0","h-full","w-80","bg-white","dark:bg-slate-900","shadow-xl"],[1,"p-4","border-b","flex","justify-between","items-center"],[1,"font-semibold"],["variant","ghost","size","sm",3,"click"],[1,"p-4","space-y-4"],[1,"space-y-2"],[1,"text-sm","font-medium"],[1,"w-full","p-2","border","rounded"],["title","Image Lightbox Example",3,"code"],[1,"flex","gap-4"],[1,"w-24","h-24","object-cover","rounded","cursor-pointer","hover:opacity-80","transition-opacity",3,"src","alt"],["opacity","dark",3,"close","visible"],[1,"max-w-4xl","mx-4"],["variant","outline",3,"click"],[1,"z-50",3,"close","visible","opacity"],["opacity","light",1,"z-50",3,"close","visible","blur"],[1,"w-24","h-24","object-cover","rounded","cursor-pointer","hover:opacity-80","transition-opacity",3,"click","src","alt"],[1,"max-h-[80vh]","rounded-lg",3,"src","alt"],[1,"text-white","text-center","mt-4"]],template:function(l,e){l&1&&(O(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"tw-button",2),c("click",function(){return e.basicOpen.set(!0)}),n(3,"Open Basic Overlay"),i(),t(4,"tw-overlay",3),c("close",function(){return e.basicOpen.set(!1)}),t(5,"tw-card",4)(6,"h3",5),n(7,"Basic Overlay"),i(),t(8,"p",6),n(9,"Click outside or press Escape to close."),i(),t(10,"tw-button",2),c("click",function(){return e.basicOpen.set(!1)}),n(11,"Close"),i()()()(),t(12,"app-demo-section",7)(13,"div",8),_(14,z,2,1,"tw-button",9,h),i(),_(16,L,8,7,"tw-overlay",10,h),i(),t(18,"app-demo-section",11)(19,"div",8),_(20,$,2,1,"tw-button",9,h),i(),_(22,j,8,7,"tw-overlay",12,h),i(),t(24,"app-demo-section",13)(25,"tw-button",2),c("click",function(){return e.nonDismissibleOpen.set(!0)}),n(26,"Open Non-dismissible"),i(),t(27,"tw-overlay",14),c("close",function(){return e.nonDismissibleOpen.set(!1)}),t(28,"tw-card",4)(29,"h3",5),n(30,"Important Action Required"),i(),t(31,"p",6),n(32," This overlay cannot be dismissed by clicking outside or pressing Escape. You must click the button to close it. "),i(),t(33,"tw-button",2),c("click",function(){return e.nonDismissibleOpen.set(!1)}),n(34,"I Understand"),i()()()(),t(35,"app-demo-section",15)(36,"tw-button",2),c("click",function(){return e.modalOpen.set(!0)}),n(37,"Open Modal"),i(),t(38,"tw-overlay",16),c("close",function(){return e.modalOpen.set(!1)}),t(39,"tw-card")(40,"div",17)(41,"h3",18),n(42,"Delete Confirmation"),i()(),t(43,"div",19)(44,"p",20),n(45," Are you sure you want to delete this item? This action cannot be undone. "),i()(),t(46,"div",21)(47,"tw-button",22),c("click",function(){return e.modalOpen.set(!1)}),n(48,"Cancel"),i(),t(49,"tw-button",23),c("click",function(){return e.modalOpen.set(!1)}),n(50,"Delete"),i()()()()(),t(51,"app-demo-section",24)(52,"tw-button",2),c("click",function(){return e.drawerOpen.set(!0)}),n(53,"Open Drawer"),i(),t(54,"tw-overlay",25),c("close",function(){return e.drawerOpen.set(!1)}),t(55,"aside",26)(56,"div",27)(57,"h3",28),n(58,"Settings"),i(),t(59,"tw-button",29),c("click",function(){return e.drawerOpen.set(!1)}),n(60,"\u2715"),i()(),t(61,"div",30)(62,"div",31)(63,"label",32),n(64,"Theme"),i(),t(65,"select",33)(66,"option"),n(67,"Light"),i(),t(68,"option"),n(69,"Dark"),i(),t(70,"option"),n(71,"System"),i()()(),t(72,"div",31)(73,"label",32),n(74,"Language"),i(),t(75,"select",33)(76,"option"),n(77,"English"),i(),t(78,"option"),n(79,"Spanish"),i(),t(80,"option"),n(81,"French"),i()()()()()()(),t(82,"app-demo-section",34)(83,"div",35),_(84,U,1,2,"img",36,N),i(),t(86,"tw-overlay",37),c("close",function(){return e.lightboxImage.set(null)}),k(87,A,4,3,"div",38),i()()),l&2&&(o(),m("code",e.basicCode),o(3),m("visible",e.basicOpen()),o(),g(e.overlayCardClass),m("padded",!0),o(7),m("code",e.opacityCode),o(2),y(e.opacities),o(2),y(e.opacities),o(2),m("code",e.blurCode),o(2),y(e.blurs),o(2),y(e.blurs),o(2),m("code",e.nonDismissibleCode),o(3),m("visible",e.nonDismissibleOpen())("closeOnClick",!1)("closeOnEscape",!1),o(),g(e.overlayCardClass),m("padded",!0),o(7),m("code",e.modalCode),o(3),m("visible",e.modalOpen()),o(),g(e.modalCardClass),o(12),m("code",e.drawerCode),o(3),m("visible",e.drawerOpen())("centered",!1),o(28),m("code",e.lightboxCode),o(2),y(e.images),o(2),m("visible",!!e.lightboxImage()),o(),D(e.lightboxImage()?87:-1))},dependencies:[E,I,M,T,V,B],encapsulation:2})};export{F as OverlayDemoComponent};
