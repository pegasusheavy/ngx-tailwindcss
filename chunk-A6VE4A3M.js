import{a as M,b as U}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Q as E,R as C,S as f,T as D,U as T,V as L,W as I,h,ha as k,ia as _,ka as R,na as B,x as y}from"./chunk-5LPP6ASA.js";import{Ba as n,Gb as S,Jb as i,Lb as v,Ra as A,X as g,bb as w,ca as p,cb as x,da as m,hb as r,ib as t,ja as u,jb as e,kb as d,tb as s}from"./chunk-2G56FVSW.js";function H(l,o){l&1&&(t(0,"div",35),p(),t(1,"svg",52),d(2,"circle",53)(3,"path",54),e(),m(),t(4,"span"),i(5,"Loading data..."),e()())}function O(l,o){l&1&&(t(0,"p",23),i(1,"Data loaded successfully!"),e())}var P=class l{ariaService=g(y);isExpanded=u(!1);isLoading=u(!1);announcementCount=u(0);toggleExpanded(){this.isExpanded.update(o=>!o)}simulateLoading(){this.isLoading.set(!0),this.ariaService.announce("Loading started"),setTimeout(()=>{this.isLoading.set(!1),this.ariaService.announce("Loading complete")},2e3)}announcePolite(){this.announcementCount.update(o=>o+1),this.ariaService.announce(`Polite announcement #${this.announcementCount()}`)}announceAssertive(){this.ariaService.announceAssertive("Urgent: This is an important message!")}ariaServiceCode=`import { TwAriaService } from '@pegasusheavy/ngx-tailwindcss';

@Component({...})
export class MyComponent {
  private ariaService = inject(TwAriaService);

  onDataLoaded(): void {
    // Polite announcement - doesn't interrupt
    this.ariaService.announce('Data loaded successfully');
  }

  onError(): void {
    // Assertive announcement - interrupts current speech
    this.ariaService.announceAssertive('Error: Failed to save changes');
  }

  clearAnnouncements(): void {
    this.ariaService.clearAnnouncements();
  }
}`;srOnlyCode=`<!-- Screen reader only text -->
<button class="p-2">
  <svg>...</svg>
  <span twSrOnly>Close dialog</span>
</button>

<!-- Focusable skip link (visible on focus) -->
<a href="#main" twSrOnly [focusable]="true">
  Skip to main content
</a>`;ariaExpandedCode=`<!-- Expandable section -->
<button
  [twAriaExpanded]="isExpanded()"
  [ariaControls]="'content-panel'"
  (click)="toggleExpanded()">
  {{ isExpanded() ? 'Collapse' : 'Expand' }}
</button>

<div id="content-panel" [hidden]="!isExpanded()">
  Expandable content here
</div>`;ariaLiveCode=`<!-- Live region for dynamic updates -->
<div twAriaLive="polite" [ariaAtomic]="true">
  {{ statusMessage }}
</div>

<!-- Assertive live region for urgent updates -->
<div twAriaLive="assertive" [ariaAtomic]="true">
  {{ errorMessage }}
</div>`;ariaBusyCode=`<!-- Busy state indicator -->
<div [twAriaBusy]="isLoading()" role="region">
  @if (isLoading()) {
    <tw-spinner></tw-spinner>
    <span>Loading data...</span>
  } @else {
    <div>Content loaded!</div>
  }
</div>`;ariaCurrentCode=`<!-- Navigation with current page -->
<nav aria-label="Main navigation">
  <a href="/" [twAriaCurrent]="currentPage === 'home' ? 'page' : false">Home</a>
  <a href="/about" [twAriaCurrent]="currentPage === 'about' ? 'page' : false">About</a>
  <a href="/contact" [twAriaCurrent]="currentPage === 'contact' ? 'page' : false">Contact</a>
</nav>

<!-- Steps with current step -->
<ol>
  <li [twAriaCurrent]="currentStep === 1 ? 'step' : false">Step 1</li>
  <li [twAriaCurrent]="currentStep === 2 ? 'step' : false">Step 2</li>
  <li [twAriaCurrent]="currentStep === 3 ? 'step' : false">Step 3</li>
</ol>`;ariaLabelCode=`<!-- Accessible labels -->
<button [twAriaLabel]="'Close ' + dialogTitle">
  <svg>...</svg>
</button>

<!-- Search input with label -->
<input
  type="search"
  twAriaLabel="Search products"
  placeholder="Search...">`;directivesListCode=`// All available ARIA directives
import {
  // Screen reader utilities
  TwSrOnlyDirective,        // Screen reader only content
  TwAnnounceDirective,      // Announce content changes

  // State directives
  TwAriaExpandedDirective,  // Expandable regions
  TwAriaSelectedDirective,  // Selected state
  TwAriaCheckedDirective,   // Checkbox/radio state
  TwAriaPressedDirective,   // Toggle button state
  TwAriaDisabledDirective,  // Disabled state
  TwAriaHiddenDirective,    // Hide from AT
  TwAriaBusyDirective,      // Loading state
  TwAriaCurrentDirective,   // Current navigation item

  // Relationship directives
  TwAriaDescribedbyDirective,
  TwAriaLabelledbyDirective,
  TwAriaLabelDirective,
  TwAriaOwnsDirective,
  TwAriaActivedescendantDirective,

  // Widget directives
  TwAriaValueDirective,     // Progress/slider values
  TwRoleDirective,          // ARIA roles
  TwAriaModalDirective,     // Modal dialogs
  TwAriaHaspopupDirective,  // Popup menus
  TwAriaLiveDirective,      // Live regions
} from '@pegasusheavy/ngx-tailwindcss';`;ariaUtilsCode=`import { AriaUtils } from '@pegasusheavy/ngx-tailwindcss';

// Generate unique IDs for ARIA relationships
const descriptionId = AriaUtils.generateId('desc'); // 'desc-a1b2c3d'
const labelId = AriaUtils.generateId('label');      // 'label-x7y8z9'

// Build describedby from multiple IDs
const describedBy = AriaUtils.describedBy(
  errorId,
  hintId,
  helpId
); // 'error-123 hint-456 help-789'

// Build labelledby from multiple IDs
const labelledBy = AriaUtils.labelledBy(
  titleId,
  subtitleId
); // 'title-abc subtitle-def'

// Get appropriate role for context
AriaUtils.getRole('button', 'menu');     // 'menuitem'
AriaUtils.getRole('dialog', 'alert');    // 'alertdialog'
AriaUtils.getRole('cell', 'columnheader'); // 'columnheader'`;static \u0275fac=function(c){return new(c||l)};static \u0275cmp=A({type:l,selectors:[["app-accessibility-demo"]],decls:190,vars:25,consts:[["title","Accessibility (ARIA)","description","Comprehensive ARIA support for building accessible web applications. Includes services, directives, and utilities for screen readers and assistive technologies."],[1,"space-y-8"],["twCardHeader",""],["twCardTitle",""],["twCardBody","",1,"prose","prose-slate","max-w-none"],[1,"list-disc","list-inside","space-y-2","mt-4"],[1,"mt-4"],["title","TwAriaService - Screen Reader Announcements","description","Use the TwAriaService to announce dynamic content changes to screen readers.",3,"code"],[1,"space-y-4"],[1,"flex","flex-wrap","gap-4"],["variant","primary",3,"click"],["variant","warning",3,"click"],[1,"text-sm","text-slate-600"],["title","twSrOnly - Screen Reader Only Content","description","Hide content visually while keeping it accessible to screen readers.",3,"code"],[1,"flex","items-center","gap-4"],[1,"p-3","rounded-lg","bg-slate-100","hover:bg-slate-200","transition-colors"],["fill","none","stroke","currentColor","viewBox","0 0 24 24",1,"w-5","h-5"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M6 18L18 6M6 6l12 12"],["twSrOnly",""],["href","#main-content","twSrOnly","",1,"focus:not-sr-only","focus:absolute","focus:z-50","focus:p-3","focus:bg-blue-600","focus:text-white","focus:rounded-lg",3,"focusable"],["title","twAriaExpanded - Expandable Regions","description","Manage aria-expanded state for expandable content.",3,"code"],[1,"px-4","py-2","bg-blue-600","text-white","rounded-lg","hover:bg-blue-700","transition-colors",3,"click","twAriaExpanded","ariaControls"],["id","demo-panel",1,"p-4","bg-slate-50","rounded-lg","border","border-slate-200"],[1,"text-slate-700"],["title","twAriaLive - Live Regions","description","Create live regions that announce content changes to screen readers.",3,"code"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4"],[1,"p-4","bg-blue-50","rounded-lg","border","border-blue-200"],[1,"font-semibold","text-blue-900","mb-2"],["twAriaLive","polite",1,"text-blue-800",3,"ariaAtomic"],[1,"p-4","bg-amber-50","rounded-lg","border","border-amber-200"],[1,"font-semibold","text-amber-900","mb-2"],["twAriaLive","assertive",1,"text-amber-800",3,"ariaAtomic"],["title","twAriaBusy - Loading States","description","Indicate loading states to assistive technologies.",3,"code"],["variant","primary",3,"click","loading"],["role","region","aria-label","Data display",1,"p-4","bg-slate-50","rounded-lg","border","border-slate-200","min-h-[100px]","flex","items-center","justify-center",3,"twAriaBusy"],[1,"flex","items-center","gap-3","text-slate-600"],["title","twAriaCurrent - Navigation","description","Indicate the current item in navigation and step indicators.",3,"code"],[1,"space-y-6"],["aria-label","Demo navigation",1,"flex","gap-4"],["href","javascript:void(0)",1,"px-3","py-2","rounded-lg","bg-blue-600","text-white",3,"twAriaCurrent"],["href","javascript:void(0)",1,"px-3","py-2","rounded-lg","bg-slate-100","text-slate-700","hover:bg-slate-200",3,"twAriaCurrent"],["title","twAriaLabel - Accessible Labels","description","Add accessible labels to elements without visible text.",3,"code"],["twAriaLabel","Search products",1,"p-3","rounded-lg","bg-slate-100","hover:bg-slate-200","transition-colors"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],["title","Available ARIA Directives","description","Complete list of ARIA directives available in the library.",3,"code"],[1,"grid","grid-cols-1","md:grid-cols-2","lg:grid-cols-3","gap-4"],[1,"p-4","bg-slate-50","rounded-lg"],[1,"font-semibold","text-slate-900","mb-2"],[1,"text-sm","text-slate-600","space-y-1"],["title","AriaUtils - Utility Functions","description","Helper functions for generating ARIA IDs and attributes.",3,"code"],[1,"mt-4","space-y-2","text-sm","text-slate-600"],[1,"bg-slate-200","px-1","rounded"],["fill","none","viewBox","0 0 24 24",1,"animate-spin","h-5","w-5"],["cx","12","cy","12","r","10","stroke","currentColor","stroke-width","4",1,"opacity-25"],["fill","currentColor","d","M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",1,"opacity-75"]],template:function(c,a){c&1&&(d(0,"app-page-header",0),t(1,"div",1)(2,"tw-card")(3,"div",2)(4,"h2",3),i(5,"Overview"),e()(),t(6,"div",4)(7,"p"),i(8," The ngx-tailwindcss library provides comprehensive accessibility support through: "),e(),t(9,"ul",5)(10,"li")(11,"strong"),i(12,"TwAriaService"),e(),i(13," - Screen reader announcements and live regions"),e(),t(14,"li")(15,"strong"),i(16,"AriaUtils"),e(),i(17," - Utility functions for generating ARIA attributes"),e(),t(18,"li")(19,"strong"),i(20,"20+ ARIA Directives"),e(),i(21," - Declarative ARIA attribute management"),e()(),t(22,"p",6),i(23," All components in this library are built with accessibility in mind, following WCAG 2.1 guidelines and WAI-ARIA best practices. "),e()()(),t(24,"app-demo-section",7)(25,"div",8)(26,"div",9)(27,"tw-button",10),s("click",function(){return a.announcePolite()}),i(28," Announce (Polite) "),e(),t(29,"tw-button",11),s("click",function(){return a.announceAssertive()}),i(30," Announce (Assertive) "),e()(),t(31,"p",12),i(32),e()()(),t(33,"app-demo-section",13)(34,"div",8)(35,"div",14)(36,"button",15),p(),t(37,"svg",16),d(38,"path",17),e(),m(),t(39,"span",18),i(40,"Close dialog"),e()(),t(41,"span",12),i(42,"\u2190 Icon button with screen reader text"),e()(),t(43,"div",6)(44,"a",19),i(45," Skip to main content "),e(),t(46,"p",12),i(47," Press Tab to reveal the skip link (focusable screen reader content) "),e()()()(),t(48,"app-demo-section",20)(49,"div",8)(50,"button",21),s("click",function(){return a.toggleExpanded()}),i(51),e(),t(52,"div",22)(53,"p",23),i(54,` This content is now visible! The button's aria-expanded attribute is set to "true", and aria-controls references this panel's ID. `),e()()()(),t(55,"app-demo-section",24)(56,"div",8)(57,"div",25)(58,"div",26)(59,"h4",27),i(60,"Polite Region"),e(),t(61,"div",28),i(62," Updates here wait for the user to finish their current task. "),e()(),t(63,"div",29)(64,"h4",30),i(65,"Assertive Region"),e(),t(66,"div",31),i(67," Updates here interrupt the user immediately. "),e()()()()(),t(68,"app-demo-section",32)(69,"div",8)(70,"tw-button",33),s("click",function(){return a.simulateLoading()}),i(71),e(),t(72,"div",34),w(73,H,6,0,"div",35)(74,O,2,0,"p",23),e()()(),t(75,"app-demo-section",36)(76,"div",37)(77,"nav",38)(78,"a",39),i(79," Home (Current) "),e(),t(80,"a",40),i(81," About "),e(),t(82,"a",40),i(83," Contact "),e()()()(),t(84,"app-demo-section",41)(85,"div",14)(86,"button",42),p(),t(87,"svg",16),d(88,"path",43),e()(),m(),t(89,"span",12),i(90,'\u2190 Button with aria-label="Search products"'),e()()(),t(91,"app-demo-section",44)(92,"div",45)(93,"div",46)(94,"h4",47),i(95,"Screen Reader"),e(),t(96,"ul",48)(97,"li")(98,"code"),i(99,"twSrOnly"),e()(),t(100,"li")(101,"code"),i(102,"twAnnounce"),e()()()(),t(103,"div",46)(104,"h4",47),i(105,"State"),e(),t(106,"ul",48)(107,"li")(108,"code"),i(109,"twAriaExpanded"),e()(),t(110,"li")(111,"code"),i(112,"twAriaSelected"),e()(),t(113,"li")(114,"code"),i(115,"twAriaChecked"),e()(),t(116,"li")(117,"code"),i(118,"twAriaPressed"),e()(),t(119,"li")(120,"code"),i(121,"twAriaDisabled"),e()(),t(122,"li")(123,"code"),i(124,"twAriaHidden"),e()(),t(125,"li")(126,"code"),i(127,"twAriaBusy"),e()(),t(128,"li")(129,"code"),i(130,"twAriaCurrent"),e()()()(),t(131,"div",46)(132,"h4",47),i(133,"Relationships"),e(),t(134,"ul",48)(135,"li")(136,"code"),i(137,"twAriaDescribedby"),e()(),t(138,"li")(139,"code"),i(140,"twAriaLabelledby"),e()(),t(141,"li")(142,"code"),i(143,"twAriaLabel"),e()(),t(144,"li")(145,"code"),i(146,"twAriaOwns"),e()(),t(147,"li")(148,"code"),i(149,"twAriaActivedescendant"),e()()()(),t(150,"div",46)(151,"h4",47),i(152,"Widgets"),e(),t(153,"ul",48)(154,"li")(155,"code"),i(156,"twAriaValue"),e()(),t(157,"li")(158,"code"),i(159,"twRole"),e()(),t(160,"li")(161,"code"),i(162,"twAriaModal"),e()(),t(163,"li")(164,"code"),i(165,"twAriaHaspopup"),e()(),t(166,"li")(167,"code"),i(168,"twAriaLive"),e()()()()()(),t(169,"app-demo-section",49)(170,"div",46)(171,"p",23),i(172," AriaUtils provides static helper methods for common ARIA patterns: "),e(),t(173,"ul",50)(174,"li")(175,"code",51),i(176,"generateId(prefix)"),e(),i(177," - Generate unique IDs"),e(),t(178,"li")(179,"code",51),i(180,"describedBy(...ids)"),e(),i(181," - Build aria-describedby"),e(),t(182,"li")(183,"code",51),i(184,"labelledBy(...ids)"),e(),i(185," - Build aria-labelledby"),e(),t(186,"li")(187,"code",51),i(188,"getRole(component, context)"),e(),i(189," - Get appropriate role"),e()()()()()),c&2&&(n(24),r("code",a.ariaServiceCode),n(8),v(" Polite announcements: ",a.announcementCount()," | Open your screen reader to hear announcements. "),n(),r("code",a.srOnlyCode),n(11),r("focusable",!0),n(4),r("code",a.ariaExpandedCode),n(2),r("twAriaExpanded",a.isExpanded())("ariaControls","demo-panel"),n(),v(" ",a.isExpanded()?"Collapse Section":"Expand Section"," "),n(),S("hidden",!a.isExpanded()),n(3),r("code",a.ariaLiveCode),n(6),r("ariaAtomic",!0),n(5),r("ariaAtomic",!0),n(2),r("code",a.ariaBusyCode),n(2),r("loading",a.isLoading()),n(),v(" ",a.isLoading()?"Loading...":"Load Data"," "),n(),r("twAriaBusy",a.isLoading()),n(),x(a.isLoading()?73:74),n(2),r("code",a.ariaCurrentCode),n(3),r("twAriaCurrent","page"),n(2),r("twAriaCurrent",!1),n(2),r("twAriaCurrent",!1),n(2),r("code",a.ariaLabelCode),n(7),r("code",a.directivesListCode),n(78),r("code",a.ariaUtilsCode))},dependencies:[h,E,C,L,f,T,D,I,B,k,_,R,M,U],encapsulation:2})};export{P as AccessibilityDemoComponent};
