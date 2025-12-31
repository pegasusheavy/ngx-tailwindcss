import{a as j,b as G}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{A as z,B as O,C as I,D as R,E as F,F as L,G as V,H,I as B,J as M,K as A,L as N,M as W,N as K,O as $,P as U,h as E,z as P}from"./chunk-5LPP6ASA.js";import{Ba as i,Ib as _,Jb as o,Kb as h,Lb as c,Ra as x,Xb as k,aa as C,ba as f,bb as w,cb as g,eb as y,fb as S,gb as D,hb as r,ib as e,ja as m,jb as t,kb as u,pb as T,tb as p,ub as v}from"./chunk-2G56FVSW.js";var X=()=>[1,2,3,4,5,6,7,8];function J(s,l){if(s&1){let d=T();e(0,"div",90),p("twClickOutside",function(){C(d);let a=v();return f(a.onClickOutside())}),e(1,"div",91),o(2," This dropdown will close when you click outside of it. "),t(),e(3,"div",92)(4,"button",93),o(5," Option 1 "),t(),e(6,"button",93),o(7," Option 2 "),t()()()}if(s&2){let d=v();r("clickOutsideEnabled",d.dropdownOpen())}}function Q(s,l){if(s&1&&(e(0,"div",23)(1,"p",94),o(2," Tab key will cycle only within these buttons. Press the button above to exit. "),t(),e(3,"div",95)(4,"button",96),o(5," Button 1 "),t(),e(6,"button",96),o(7," Button 2 "),t(),e(8,"button",96),o(9," Button 3 "),t()()()),s&2){let d=v();r("twFocusTrap",d.focusTrapActive())}}function Y(s,l){if(s&1&&(e(0,"span",97),o(1),t()),s&2){let d=v();_(d.copyStatus()==="Copied!"?"text-emerald-600":"text-red-600"),i(),c(" ",d.copyStatus()," ")}}function Z(s,l){if(s&1&&(e(0,"p",40),o(1),t()),s&2){let d=v();i(),c("Pressed: ",d.keyPressed())}}function ee(s,l){if(s&1&&(e(0,"p",44),o(1),t()),s&2){let d=v();i(),h(d.swipeDirection())}}function te(s,l){s&1&&(e(0,"p",45),o(1,"\u{1F446} Try swiping!"),t())}function oe(s,l){if(s&1&&(e(0,"p",64),o(1),t()),s&2){let d=l.$implicit;i(),c("Scrollable content item ",d)}}var q=class s{dropdownOpen=m(!1);clickCount=m(0);debounceCount=m(0);longPressCount=m(0);copyStatus=m("");keyPressed=m("");swipeDirection=m("");elementSize=m({width:0,height:0});inViewStatus=m("Not in view");focusTrapActive=m(!1);onClickOutside(){this.dropdownOpen.set(!1)}toggleDropdown(){this.dropdownOpen.update(l=>!l)}incrementClick(){this.clickCount.update(l=>l+1)}onDebounceClick(){this.debounceCount.update(l=>l+1)}onLongPress(){this.longPressCount.update(l=>l+1)}onCopied(l){this.copyStatus.set(l.success?"Copied!":"Failed to copy"),setTimeout(()=>this.copyStatus.set(""),2e3)}onKeyboardShortcut(l){this.keyPressed.set(l.shortcut.toUpperCase()),setTimeout(()=>this.keyPressed.set(""),1500)}onSwipe(l){this.swipeDirection.set(l),setTimeout(()=>this.swipeDirection.set(""),1500)}onResize(l){this.elementSize.set({width:Math.round(l.width),height:Math.round(l.height)})}onInView(l){this.inViewStatus.set(l.isIntersecting?"In view! \u{1F440}":"Not in view")}toggleFocusTrap(){this.focusTrapActive.update(l=>!l)}rippleCode=`<!-- Basic ripple -->
<button twRipple class="px-6 py-3 bg-blue-600 text-white rounded-lg">
  Click for Ripple
</button>

<!-- Custom ripple color -->
<button twRipple [rippleColor]="'rgba(0,0,0,0.2)'" class="px-6 py-3 bg-white">
  Dark Ripple
</button>

<!-- Centered ripple (always originates from center) -->
<button twRipple [rippleCentered]="true" class="px-6 py-3 bg-emerald-600">
  Centered Ripple
</button>`;tooltipCode=`<!-- Basic tooltip (top position is default) -->
<button twTooltip="This is a tooltip!">Hover me</button>

<!-- Different positions -->
<button twTooltip="Tooltip on bottom" tooltipPosition="bottom">Bottom</button>
<button twTooltip="Tooltip on left" tooltipPosition="left">Left</button>
<button twTooltip="Tooltip on right" tooltipPosition="right">Right</button>`;tooltipDelayCode=`<!-- Custom show delay (ms) -->
<button twTooltip="Shows after 500ms" [tooltipShowDelay]="500">
  Delayed show
</button>

<!-- Instant tooltip -->
<button twTooltip="Instant show" [tooltipShowDelay]="0">
  No delay
</button>`;clickOutsideCode=`dropdownOpen = signal(false);

onClickOutside(): void {
  this.dropdownOpen.set(false);
}

// Template
<div (twClickOutside)="onClickOutside()" [clickOutsideEnabled]="dropdownOpen()">
  Dropdown content...
</div>`;autoFocusCode=`<!-- Element receives focus when rendered -->
<input twAutoFocus type="text" placeholder="I'm focused!">

<!-- With delay -->
<input twAutoFocus [autoFocusDelay]="500" type="text">

<!-- Conditional focus -->
<input twAutoFocus [autoFocusEnabled]="shouldFocus" type="text">`;longPressCode=`<!-- Basic long press (default 500ms) -->
<button twLongPress (longPress)="onLongPress()">
  Long press me
</button>

<!-- Custom duration -->
<button twLongPress (longPress)="onLongPress()" [longPressDuration]="1000">
  1 second hold
</button>

<!-- With press start/end events -->
<button
  twLongPress
  (longPress)="onLongPress()"
  (pressStart)="onStart()"
  (pressEnd)="onEnd()">
  Hold to activate
</button>`;debounceClickCode=`<!-- Debounced click (default 300ms) -->
<button twDebounceClick (debounceClick)="onSave()">
  Save (debounced)
</button>

<!-- Custom delay -->
<button twDebounceClick (debounceClick)="onSubmit()" [debounceTime]="500">
  Submit (500ms debounce)
</button>`;copyClipboardCode=`<!-- Copy text to clipboard -->
<button twCopyClipboard="Text to copy" (copied)="onCopied($event)">
  Copy to Clipboard
</button>

<!-- Copy from variable -->
<button [twCopyClipboard]="myText" (copied)="onCopied($event)">
  Copy Dynamic Text
</button>

// Handler
onCopied(event: { success: boolean; text: string }) {
  console.log(event.success ? 'Copied!' : 'Failed');
}`;keyboardShortcutCode=`<!-- Single key shortcut -->
<div twKeyboardShortcut="ctrl+s" (shortcutPressed)="onShortcut($event)">
  Press Ctrl+S
</div>

<!-- Multiple modifiers -->
<div twKeyboardShortcut="ctrl+shift+k" (shortcutPressed)="onShortcut($event)">
  Press Ctrl+Shift+K
</div>

<!-- Escape key -->
<div twKeyboardShortcut="escape" (shortcutPressed)="onCancel()">
  Press Escape to cancel
</div>`;swipeCode=`<!-- Detect swipe gestures -->
<div
  twSwipe
  (swipeLeft)="onSwipe('left')"
  (swipeRight)="onSwipe('right')"
  (swipeUp)="onSwipe('up')"
  (swipeDown)="onSwipe('down')">
  Swipe in any direction
</div>

<!-- With custom threshold -->
<div twSwipe (swipeLeft)="onSwipe('left')" [swipeThreshold]="100">
  Requires 100px swipe
</div>

<!-- Generic swipe event -->
<div twSwipe (swipe)="onSwipe($event)">
  Fires on any swipe direction
</div>`;resizeObserverCode=`<!-- Observe element size changes -->
<div twResizeObserver (resize)="onResize($event)">
  Resize me!
  Width: {{ size.width }}px, Height: {{ size.height }}px
</div>

<!-- With debounce -->
<div twResizeObserver (resize)="onResize($event)" [resizeDebounce]="100">
  Debounced resize events
</div>

// Handler
onResize(event: { width: number; height: number; entry: ResizeObserverEntry }) {
  console.log(event.width, event.height);
}`;inViewCode=`<!-- Detect when element enters/leaves viewport -->
<div twInView (inView)="onVisibilityChange($event)">
  {{ isVisible ? 'In view!' : 'Out of view' }}
</div>

<!-- With threshold (50% visible) -->
<div twInView (inView)="onVisibilityChange($event)" [inViewThreshold]="0.5">
  50% visibility threshold
</div>

<!-- Separate enter/leave events -->
<div twInView (enterView)="onEnter()" (leaveView)="onLeave()" [inViewOnce]="true">
  Fires once on enter
</div>

// Handler
onVisibilityChange(event: { isIntersecting: boolean; intersectionRatio: number }) {
  console.log(event.isIntersecting);
}`;lazyImageCode=`<!-- Lazy load image when near viewport -->
<img twLazyImage="/path/to/image.jpg" alt="Lazy loaded image">

<!-- With placeholder -->
<img
  twLazyImage="/path/to/image.jpg"
  lazyPlaceholder="/path/to/placeholder.jpg"
  alt="With placeholder">

<!-- With root margin (preload 200px before visible) -->
<img
  twLazyImage="/path/to/image.jpg"
  lazyRootMargin="200px"
  alt="Preloaded">`;hoverClassCode=`<!-- Add class on hover -->
<div twHoverClass="bg-blue-100 scale-105">
  Hover to see effect
</div>

<!-- Multiple classes -->
<div twHoverClass="shadow-lg -translate-y-1 bg-white">
  Card with hover effect
</div>`;focusTrapCode=`<!-- Trap focus within element (for modals/dialogs) -->
<div [twFocusTrap]="modalOpen">
  <button>First focusable</button>
  <input type="text">
  <button>Last focusable</button>
  <!-- Tab will cycle within these elements -->
</div>

<!-- With auto-focus and restore focus -->
<div twFocusTrap [focusTrapAutoFocus]="true" [focusTrapRestoreFocus]="true">
  <input type="text">
  <button>Close</button>
</div>`;trapScrollCode=`<!-- Prevent scroll from propagating to parent -->
<div twTrapScroll class="max-h-40 overflow-auto">
  <p>Scrollable content...</p>
  <p>More content...</p>
  <p>Even more content...</p>
  <!-- Scrolling here won't scroll the page -->
</div>`;scrollAnchorCode=`<!-- Scroll to specific section -->
<button twScrollTo="section1">Go to Section 1</button>
<button twScrollTo="section2" [scrollBehavior]="'smooth'" [scrollOffset]="100">
  Go to Section 2
</button>

<!-- Mark scroll targets -->
<div twScrollSection="section1">Section 1 content</div>
<div twScrollSection="section2">Section 2 content</div>`;combinedCode=`<!-- Multiple directives on one element -->
<button
  twRipple
  twTooltip="Click me!"
  twHoverClass="scale-105"
  twDebounceClick
  (debounceClick)="onSave()">
  Ripple + Tooltip + Hover + Debounce
</button>`;static \u0275fac=function(d){return new(d||s)};static \u0275cmp=x({type:s,selectors:[["app-directives-demo"]],decls:176,vars:47,consts:[["title","Directives","description","Utility directives to enhance your components with common behaviors and interactions."],[1,"space-y-12"],[1,"text-2xl","font-bold","text-slate-900","mb-6","pb-2","border-b","border-slate-200"],["title","Ripple Effect","description","Add material-design style ripple effects to clickable elements.",3,"code"],[1,"flex","flex-wrap","gap-4"],["twRipple","",1,"px-6","py-3","bg-blue-600","text-white","font-medium","rounded-lg","hover:bg-blue-700","transition-colors"],["twRipple","",1,"px-6","py-3","bg-white","text-slate-900","font-medium","rounded-lg","border","border-slate-300","hover:bg-slate-50","transition-colors",3,"rippleColor"],["twRipple","",1,"px-6","py-3","bg-emerald-600","text-white","font-medium","rounded-lg","hover:bg-emerald-700","transition-colors",3,"rippleCentered"],["twRipple","",1,"px-6","py-3","bg-gradient-to-r","from-purple-600","to-pink-600","text-white","font-medium","rounded-lg"],["title","Tooltip","description","Display helpful information on hover or focus.",3,"code"],["twTooltip","This is a tooltip!",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors"],["twTooltip","Tooltip on bottom","tooltipPosition","bottom",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors"],["twTooltip","Tooltip on left","tooltipPosition","left",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors"],["twTooltip","Tooltip on right","tooltipPosition","right",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors"],["title","Tooltip with Delay","description","Configure show and hide delays for tooltips.",3,"code"],["twTooltip","Shows after 500ms",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors",3,"tooltipShowDelay"],["twTooltip","Instant show",1,"px-4","py-2","bg-slate-100","text-slate-700","rounded-lg","hover:bg-slate-200","transition-colors",3,"tooltipShowDelay"],["title","Click Outside","description","Detect clicks outside an element to close dropdowns or menus.",3,"code"],[1,"relative","inline-block"],[1,"px-4","py-2","bg-blue-600","text-white","rounded-lg","hover:bg-blue-700","transition-colors",3,"click"],[1,"absolute","top-full","left-0","mt-2","w-48","bg-white","rounded-lg","shadow-lg","border","border-slate-200","py-2","z-10",3,"clickOutsideEnabled"],["title","Focus Trap","description","Trap keyboard focus within an element, essential for modal dialogs and accessible UI.",3,"code"],[1,"px-4","py-2","bg-blue-600","text-white","rounded-lg","hover:bg-blue-700","transition-colors","mb-4",3,"click"],[1,"p-6","bg-slate-100","rounded-lg","border-2","border-blue-500",3,"twFocusTrap"],["title","Auto Focus","description","Automatically focus an element when it's rendered.",3,"code"],[1,"space-y-4"],[1,"text-sm","text-slate-600"],["twAutoFocus","","type","text","placeholder","I'm auto-focused!",1,"px-4","py-2","border","border-slate-300","rounded-lg","focus:outline-none","focus:ring-2","focus:ring-blue-500"],["title","Long Press","description","Detect long press/hold gestures with progress feedback.",3,"code"],[1,"flex","flex-wrap","gap-4","items-center"],["twLongPress","",1,"px-6","py-3","bg-amber-600","text-white","font-medium","rounded-lg","hover:bg-amber-700","transition-colors",3,"longPress","longPressDuration"],["title","Debounce Click","description","Prevent rapid repeated clicks with debouncing.",3,"code"],["twDebounceClick","",1,"px-6","py-3","bg-teal-600","text-white","font-medium","rounded-lg","hover:bg-teal-700","transition-colors",3,"debounceClick","debounceTime"],["title","Copy to Clipboard","description","Copy text to the clipboard with a single directive.",3,"code"],["twCopyClipboard","Hello from ngx-tailwindcss! \u{1F389}",1,"px-4","py-2","bg-slate-800","text-white","font-medium","rounded-lg","hover:bg-slate-900","transition-colors",3,"copied"],[1,"text-sm","font-medium",3,"class"],["title","Keyboard Shortcut","description","Listen for keyboard shortcuts and combinations.",3,"code"],["twKeyboardShortcut","ctrl+k",1,"p-6","bg-slate-100","rounded-lg","border-2","border-dashed","border-slate-300","text-center",3,"shortcutPressed"],[1,"text-slate-600","mb-2"],[1,"px-2","py-1","bg-white","rounded","border","border-slate-300","text-sm","font-mono"],[1,"text-lg","font-bold","text-blue-600"],["title","Swipe Gestures","description","Detect swipe gestures in any direction.",3,"code"],["twSwipe","",1,"p-12","bg-gradient-to-br","from-indigo-100","to-purple-100","rounded-xl","border-2","border-dashed","border-indigo-300","text-center","cursor-grab","active:cursor-grabbing","select-none",3,"swipeLeft","swipeRight","swipeUp","swipeDown"],[1,"text-indigo-700","font-medium","mb-2"],[1,"text-2xl","font-bold","text-indigo-600"],[1,"text-slate-500"],["title","Resize Observer","description","Observe and react to element size changes.",3,"code"],["twResizeObserver","",1,"p-6","bg-cyan-50","rounded-lg","border-2","border-cyan-200","resize","overflow-auto","min-w-[200px]","min-h-[100px]","max-w-full",3,"resize"],[1,"text-cyan-700","font-medium"],[1,"text-cyan-600","text-sm","mt-2"],["title","In View Detection","description","Detect when an element enters or leaves the viewport.",3,"code"],[1,"h-32","overflow-y-auto","border","border-slate-200","rounded-lg","p-4"],[1,"h-24"],["twInView","",1,"p-6","bg-rose-100","rounded-lg","text-center",3,"inView","inViewThreshold"],[1,"text-rose-700","font-bold","text-lg"],[1,"text-rose-600","text-sm"],["title","Hover Class","description","Dynamically add classes on hover without CSS.",3,"code"],["twHoverClass","bg-blue-100 scale-105 shadow-lg",1,"p-6","bg-white","rounded-lg","border","border-slate-200","transition-all","duration-200","cursor-pointer"],[1,"font-medium","text-slate-900"],[1,"text-sm","text-slate-500"],["twHoverClass","border-emerald-500 -translate-y-1",1,"p-6","bg-white","rounded-lg","border-2","border-slate-200","transition-all","duration-200","cursor-pointer"],["twHoverClass","rotate-3 ring-4 ring-purple-300",1,"p-6","bg-white","rounded-lg","border","border-slate-200","transition-all","duration-200","cursor-pointer"],["title","Trap Scroll","description","Prevent scroll events from propagating to parent containers.",3,"code"],["twTrapScroll","",1,"h-40","overflow-auto","bg-slate-100","rounded-lg","p-4","border","border-slate-200"],[1,"text-slate-600"],["title","Scroll Anchor","description","Smooth scroll navigation to specific sections.",3,"code"],[1,"flex","flex-wrap","gap-2"],["twScrollTo","demo-section-1",1,"px-3","py-1.5","bg-slate-200","text-slate-700","rounded","hover:bg-slate-300","transition-colors","text-sm",3,"scrollBehavior","scrollOffset"],["twScrollTo","demo-section-2",1,"px-3","py-1.5","bg-slate-200","text-slate-700","rounded","hover:bg-slate-300","transition-colors","text-sm",3,"scrollBehavior","scrollOffset"],["twScrollTo","demo-section-3",1,"px-3","py-1.5","bg-slate-200","text-slate-700","rounded","hover:bg-slate-300","transition-colors","text-sm",3,"scrollBehavior","scrollOffset"],[1,"h-48","overflow-y-auto","border","border-slate-200","rounded-lg"],["twScrollSection","demo-section-1",1,"p-4","bg-blue-50","min-h-[150px]"],[1,"font-bold","text-blue-900"],[1,"text-blue-700","text-sm"],["twScrollSection","demo-section-2",1,"p-4","bg-emerald-50","min-h-[150px]"],[1,"font-bold","text-emerald-900"],[1,"text-emerald-700","text-sm"],["twScrollSection","demo-section-3",1,"p-4","bg-amber-50","min-h-[150px]"],[1,"font-bold","text-amber-900"],[1,"text-amber-700","text-sm"],["title","Lazy Image","description","Lazy load images when they approach the viewport.",3,"code"],[1,"h-48","overflow-y-auto","border","border-slate-200","rounded-lg","p-4","space-y-4"],[1,"h-32","flex","items-center","justify-center","text-slate-400"],[1,"w-full","h-48","rounded-lg","overflow-hidden","bg-slate-200"],["twLazyImage","https://picsum.photos/400/200?random=1","alt","Lazy loaded image 1",1,"w-full","h-full","object-cover"],["twLazyImage","https://picsum.photos/400/200?random=2","alt","Lazy loaded image 2",1,"w-full","h-full","object-cover"],["twLazyImage","https://picsum.photos/400/200?random=3","alt","Lazy loaded image 3",1,"w-full","h-full","object-cover"],["title","Multiple Directives","description","Using multiple directives together on a single element.",3,"code"],["twRipple","","twTooltip","Click me for a ripple effect!","twHoverClass","scale-105 shadow-xl",1,"px-6","py-3","bg-gradient-to-r","from-purple-600","to-pink-600","text-white","font-medium","rounded-lg","transition-all","duration-200",3,"click"],["twRipple","","twTooltip","Debounced click - try clicking rapidly!","twDebounceClick","",1,"px-6","py-3","bg-gradient-to-r","from-emerald-600","to-teal-600","text-white","font-medium","rounded-lg",3,"debounceClick","debounceTime"],[1,"absolute","top-full","left-0","mt-2","w-48","bg-white","rounded-lg","shadow-lg","border","border-slate-200","py-2","z-10",3,"twClickOutside","clickOutsideEnabled"],[1,"px-4","py-2","text-sm","text-slate-600"],[1,"border-t","border-slate-100","mt-2","pt-2"],[1,"w-full","px-4","py-2","text-left","text-sm","text-slate-700","hover:bg-slate-50"],[1,"text-sm","text-slate-600","mb-4"],[1,"flex","gap-2"],[1,"px-3","py-1.5","bg-white","border","border-slate-300","rounded","text-sm","hover:bg-slate-50"],[1,"text-sm","font-medium"]],template:function(d,n){d&1&&(u(0,"app-page-header",0),e(1,"div",1)(2,"div")(3,"h2",2),o(4,"Core Directives"),t(),e(5,"app-demo-section",3)(6,"div",4)(7,"button",5),o(8," Click for Ripple "),t(),e(9,"button",6),o(10," Dark Ripple "),t(),e(11,"button",7),o(12," Centered Ripple "),t(),e(13,"button",8),o(14," Gradient Button "),t()()(),e(15,"app-demo-section",9)(16,"div",4)(17,"button",10),o(18," Hover me (top) "),t(),e(19,"button",11),o(20," Bottom tooltip "),t(),e(21,"button",12),o(22," Left tooltip "),t(),e(23,"button",13),o(24," Right tooltip "),t()()(),e(25,"app-demo-section",14)(26,"div",4)(27,"button",15),o(28," Delayed show (500ms) "),t(),e(29,"button",16),o(30," No delay "),t()()(),e(31,"app-demo-section",17)(32,"div",18)(33,"button",19),p("click",function(){return n.toggleDropdown()}),o(34),t(),w(35,J,8,1,"div",20),t()(),e(36,"app-demo-section",21)(37,"div")(38,"button",22),p("click",function(){return n.toggleFocusTrap()}),o(39),t(),w(40,Q,10,1,"div",23),t()()(),e(41,"div")(42,"h2",2),o(43,"DX Enhancement Directives"),t(),e(44,"app-demo-section",24)(45,"div",25)(46,"p",26),o(47,"The input below receives focus automatically:"),t(),u(48,"input",27),t()(),e(49,"app-demo-section",28)(50,"div",29)(51,"button",30),p("longPress",function(){return n.onLongPress()}),o(52),t(),e(53,"span",26),o(54,"Hold the button for 800ms to trigger"),t()()(),e(55,"app-demo-section",31)(56,"div",29)(57,"button",32),p("debounceClick",function(){return n.onDebounceClick()}),o(58," Click rapidly (debounced 500ms) "),t(),e(59,"span",26),o(60),t()()(),e(61,"app-demo-section",33)(62,"div",29)(63,"button",34),p("copied",function(b){return n.onCopied(b)}),o(64,' \u{1F4CB} Copy "Hello from ngx-tailwindcss!" '),t(),w(65,Y,2,3,"span",35),t()(),e(66,"app-demo-section",36)(67,"div",25)(68,"div",37),p("shortcutPressed",function(b){return n.onKeyboardShortcut(b)}),e(69,"p",38),o(70,"Press "),e(71,"kbd",39),o(72,"Ctrl+K"),t(),o(73," anywhere on this page"),t(),w(74,Z,2,1,"p",40),t()()(),e(75,"app-demo-section",41)(76,"div",42),p("swipeLeft",function(){return n.onSwipe("\u2B05\uFE0F Left")})("swipeRight",function(){return n.onSwipe("\u27A1\uFE0F Right")})("swipeUp",function(){return n.onSwipe("\u2B06\uFE0F Up")})("swipeDown",function(){return n.onSwipe("\u2B07\uFE0F Down")}),e(77,"p",43),o(78,"Swipe in any direction"),t(),w(79,ee,2,1,"p",44)(80,te,2,0,"p",45),t()(),e(81,"app-demo-section",46)(82,"div",47),p("resize",function(b){return n.onResize(b)}),e(83,"p",48),o(84,"Drag the corner to resize this box"),t(),e(85,"p",49),o(86," Width: "),e(87,"strong"),o(88),t(),o(89," \xD7 Height: "),e(90,"strong"),o(91),t()()()(),e(92,"app-demo-section",50)(93,"div",25)(94,"p",26),o(95,"Scroll down to see the element enter the viewport:"),t(),e(96,"div",51),u(97,"div",52),e(98,"div",53),p("inView",function(b){return n.onInView(b)}),e(99,"p",54),o(100),t(),e(101,"p",55),o(102,"50% visibility threshold"),t()(),u(103,"div",52),t()()(),e(104,"app-demo-section",56)(105,"div",4)(106,"div",57)(107,"p",58),o(108,"Hover me!"),t(),e(109,"p",59),o(110,"Scale + Shadow + Background"),t()(),e(111,"div",60)(112,"p",58),o(113,"Hover me!"),t(),e(114,"p",59),o(115,"Border color + Translate"),t()(),e(116,"div",61)(117,"p",58),o(118,"Hover me!"),t(),e(119,"p",59),o(120,"Rotate + Ring"),t()()()(),e(121,"app-demo-section",62)(122,"div",25)(123,"p",26),o(124,"Scroll inside the box - the page won't scroll when you reach the end:"),t(),e(125,"div",63)(126,"div",25),S(127,oe,2,1,"p",64,y),t()()()(),e(129,"app-demo-section",65)(130,"div",25)(131,"div",66)(132,"button",67),o(133," Go to Section 1 "),t(),e(134,"button",68),o(135," Go to Section 2 "),t(),e(136,"button",69),o(137," Go to Section 3 "),t()(),e(138,"div",70)(139,"div",71)(140,"h4",72),o(141,"Section 1"),t(),e(142,"p",73),o(143,"This is the first section content."),t()(),e(144,"div",74)(145,"h4",75),o(146,"Section 2"),t(),e(147,"p",76),o(148,"This is the second section content."),t()(),e(149,"div",77)(150,"h4",78),o(151,"Section 3"),t(),e(152,"p",79),o(153,"This is the third section content."),t()()()()(),e(154,"app-demo-section",80)(155,"div",25)(156,"p",26),o(157,"Images below are lazy loaded when scrolled into view:"),t(),e(158,"div",81)(159,"div",82),o(160," \u2193 Scroll down to load images \u2193 "),t(),e(161,"div",83),u(162,"img",84),t(),e(163,"div",83),u(164,"img",85),t(),e(165,"div",83),u(166,"img",86),t()()()()(),e(167,"div")(168,"h2",2),o(169,"Combined Examples"),t(),e(170,"app-demo-section",87)(171,"div",4)(172,"button",88),p("click",function(){return n.incrementClick()}),o(173),t(),e(174,"button",89),p("debounceClick",function(){return n.onDebounceClick()}),o(175),t()()()()()),d&2&&(i(5),r("code",n.rippleCode),i(4),r("rippleColor","rgba(0,0,0,0.2)"),i(2),r("rippleCentered",!0),i(4),r("code",n.tooltipCode),i(10),r("code",n.tooltipDelayCode),i(2),r("tooltipShowDelay",500),i(2),r("tooltipShowDelay",0),i(2),r("code",n.clickOutsideCode),i(3),c(" ",n.dropdownOpen()?"Click outside to close":"Open dropdown"," "),i(),g(n.dropdownOpen()?35:-1),i(),r("code",n.focusTrapCode),i(3),c(" ",n.focusTrapActive()?"Deactivate Focus Trap":"Activate Focus Trap"," "),i(),g(n.focusTrapActive()?40:-1),i(4),r("code",n.autoFocusCode),i(5),r("code",n.longPressCode),i(2),r("longPressDuration",800),i(),c(" Hold for 800ms (Count: ",n.longPressCount(),") "),i(3),r("code",n.debounceClickCode),i(2),r("debounceTime",500),i(3),c("Actual clicks registered: ",n.debounceCount()),i(),r("code",n.copyClipboardCode),i(4),g(n.copyStatus()?65:-1),i(),r("code",n.keyboardShortcutCode),i(8),g(n.keyPressed()?74:-1),i(),r("code",n.swipeCode),i(4),g(n.swipeDirection()?79:80),i(2),r("code",n.resizeObserverCode),i(7),c("",n.elementSize().width,"px"),i(3),c("",n.elementSize().height,"px"),i(),r("code",n.inViewCode),i(6),r("inViewThreshold",.5),i(2),h(n.inViewStatus()),i(4),r("code",n.hoverClassCode),i(17),r("code",n.trapScrollCode),i(6),D(k(46,X)),i(2),r("code",n.scrollAnchorCode),i(3),r("scrollBehavior","smooth")("scrollOffset",80),i(2),r("scrollBehavior","smooth")("scrollOffset",80),i(2),r("scrollBehavior","smooth")("scrollOffset",80),i(18),r("code",n.lazyImageCode),i(16),r("code",n.combinedCode),i(3),c(" Ripple + Tooltip + Hover (Clicked: ",n.clickCount(),") "),i(),r("debounceTime",300),i(),c(" Ripple + Tooltip + Debounce (",n.debounceCount(),") "))},dependencies:[E,P,z,O,I,R,F,L,V,H,B,M,A,N,W,K,$,U,j,G],encapsulation:2})};export{q as DirectivesDemoComponent};
