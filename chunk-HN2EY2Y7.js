import{Na as F,O as D,R as I,a as T,aa as O,b as _,o as M,oa as P}from"./chunk-T3HYHWG2.js";import{W as C,Ya as k,h as b,na as E,w as f}from"./chunk-5LPP6ASA.js";import{Ba as r,Fb as x,Jb as e,Kb as d,Lb as h,Mb as w,Ra as y,X as g,fb as c,gb as p,hb as a,ib as t,jb as i,kb as s,tb as v}from"./chunk-2G56FVSW.js";var u=(l,m)=>m.name;function U(l,m){if(l&1&&(t(0,"div",22),s(1,"div",34),t(2,"div")(3,"code",35),e(4),i(),t(5,"p",36),e(6),i()()()),l&2){let o=m.$implicit;r(),x("background","var("+o.var+")"),r(3),d(o.var),r(2),d(o.description)}}function z(l,m){if(l&1&&(t(0,"div",22),s(1,"div",34),t(2,"div")(3,"code",35),e(4),i(),t(5,"p",36),e(6),i()()()),l&2){let o=m.$implicit;r(),x("background","var("+o.var+")"),r(3),d(o.var),r(2),d(o.description)}}function A(l,m){if(l&1&&(t(0,"div",22),s(1,"div",37),t(2,"div")(3,"code",35),e(4),i(),t(5,"p",36),e(6),i()()()),l&2){let o=m.$implicit;r(),x("background","var("+o.var+")"),r(3),d(o.var),r(2),d(o.description)}}var R=class l{themeService=g(f);icons={palette:M,moon:P,sun:D,code:I,copy:F,check:O};brandColors=[{name:"primary",var:"--tw-color-primary",description:"Main brand color"},{name:"primary-hover",var:"--tw-color-primary-hover",description:"Primary hover state"},{name:"secondary",var:"--tw-color-secondary",description:"Secondary brand color"},{name:"secondary-hover",var:"--tw-color-secondary-hover",description:"Secondary hover state"}];semanticColors=[{name:"success",var:"--tw-color-success",description:"Success/positive state"},{name:"warning",var:"--tw-color-warning",description:"Warning/caution state"},{name:"danger",var:"--tw-color-danger",description:"Error/danger state"},{name:"info",var:"--tw-color-info",description:"Informational state"}];surfaceColors=[{name:"background",var:"--tw-color-background",description:"Page background"},{name:"surface",var:"--tw-color-surface",description:"Card/modal background"},{name:"surface-alt",var:"--tw-color-surface-alt",description:"Alternate surface"},{name:"border",var:"--tw-color-border",description:"Default border color"}];providerCode=`// app.config.ts
import { provideTwTheme, createTheme } from '@pegasusheavy/ngx-tailwindcss';

const customTheme = createTheme({
  colors: {
    primary: { light: '#6366f1', dark: '#818cf8' },
    secondary: { light: '#ec4899', dark: '#f472b6' },
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideTwTheme(customTheme),
  ],
};`;cssOverrideCode=`:root {
  --tw-color-primary: #6366f1;
  --tw-color-primary-hover: #4f46e5;
  --tw-color-secondary: #ec4899;
}

.dark {
  --tw-color-primary: #818cf8;
  --tw-color-primary-hover: #a5b4fc;
  --tw-color-secondary: #f472b6;
}`;colorModeCode=`import { TwThemeService } from '@pegasusheavy/ngx-tailwindcss';

export class MyComponent {
  private themeService = inject(TwThemeService);

  toggleDarkMode() {
    // Set to specific mode
    this.themeService.setColorMode('dark');

    // Or cycle through modes
    this.themeService.cycleColorMode();

    // Read current state
    console.log(this.themeService.colorMode());      // 'light' | 'dark' | 'system'
    console.log(this.themeService.resolvedColorMode()); // 'light' | 'dark'
    console.log(this.themeService.isDark());         // boolean
  }
}`;tailwindCode=`<!-- Use CSS variables in Tailwind's arbitrary value syntax -->
<div class="bg-[var(--tw-color-primary)]">
  Primary background
</div>

<div class="text-[var(--tw-color-danger)]">
  Danger colored text
</div>

<div class="border-[var(--tw-color-border)]">
  Themed border
</div>`;overrideCode=`<!-- Add classes to existing component styles -->
<tw-button
  variant="primary"
  classOverride="shadow-xl hover:scale-105">
  Enhanced Button
</tw-button>

<!-- Completely replace component styles -->
<tw-button
  classReplace="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full">
  Custom Button
</tw-button>`;static \u0275fac=function(o){return new(o||l)};static \u0275cmp=y({type:l,selectors:[["app-theming-demo"]],decls:196,vars:25,consts:[[1,"space-y-12"],[1,"flex","items-center","gap-3","mb-4"],[1,"w-12","h-12","rounded-xl","bg-gradient-to-br","from-violet-500","to-purple-600","flex","items-center","justify-center"],[1,"text-white","text-xl",3,"icon"],[1,"text-3xl","font-bold","text-slate-900","dark:text-white"],[1,"text-slate-600","dark:text-slate-300"],[1,"text-lg","text-slate-600","dark:text-slate-300","max-w-3xl"],[1,"text-2xl","font-bold","text-slate-900","dark:text-white","mb-4"],[1,"mb-6",3,"padded"],[1,"font-semibold","text-slate-900","dark:text-white","mb-3"],[1,"text-slate-600","dark:text-slate-300","mb-4"],[1,"relative"],[1,"bg-slate-900","text-slate-100","rounded-lg","p-4","text-sm","overflow-x-auto"],[1,"text-violet-600","dark:text-violet-400"],[3,"padded"],[1,"text-slate-600","dark:text-slate-300","mb-6"],[1,"flex","flex-wrap","items-center","gap-4","mb-6"],[3,"click","variant"],[3,"icon"],[1,"text-sm","text-slate-600","dark:text-slate-300"],[1,"font-semibold","text-slate-900","dark:text-white","mb-4"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4"],[1,"flex","items-center","gap-3","p-3","bg-slate-50","dark:bg-slate-800","rounded-lg"],[1,"space-y-4"],[1,"p-4","rounded-lg","bg-[var(--tw-color-primary)]","text-white"],[1,"p-4","rounded-lg","border-2","border-[var(--tw-color-success)]","text-[var(--tw-color-success)]"],[1,"p-4","rounded-lg",2,"background","var(--tw-color-danger-bg)","color","var(--tw-color-danger-text)"],[1,"text-sm","font-medium","text-slate-700","dark:text-slate-300","mb-2"],["variant","primary"],["variant","primary","classOverride","bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"],["classReplace","px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors"],["variant","info","alertStyle","soft"],[1,"mt-6","space-y-4"],[1,"list-decimal","list-inside","space-y-2","text-slate-600","dark:text-slate-300"],[1,"w-10","h-10","rounded-lg","shadow-inner"],[1,"text-sm","font-mono","text-violet-600","dark:text-violet-400"],[1,"text-xs","text-slate-500","dark:text-slate-300"],[1,"w-10","h-10","rounded-lg","shadow-inner","border","border-slate-200","dark:border-slate-600"]],template:function(o,n){o&1&&(t(0,"div",0)(1,"div")(2,"div",1)(3,"div",2),s(4,"fa-icon",3),i(),t(5,"div")(6,"h1",4),e(7,"Theming"),i(),t(8,"p",5),e(9,"Customize colors using CSS variables"),i()()(),t(10,"p",6),e(11," ngx-tailwindcss provides a flexible theming system using CSS custom properties. You can customize the entire color palette by overriding CSS variables, or use Tailwind's utility classes directly. "),i()(),t(12,"section")(13,"h2",7),e(14,"Quick Start"),i(),t(15,"tw-card",8)(16,"h3",9),e(17,"1. Import the theme CSS"),i(),t(18,"p",10),e(19," Add the theme CSS to your global styles file to get default CSS variables: "),i(),t(20,"div",11)(21,"pre",12)(22,"code"),e(23,`/* In your styles.scss or styles.css */
@import '@pegasus-heavy/ngx-tailwindcss/styles/theme.css';`),i()()()(),t(24,"tw-card",8)(25,"h3",9),e(26,"2. Initialize the theme service (optional)"),i(),t(27,"p",10),e(28," Use "),t(29,"code",13),e(30,"provideTwTheme()"),i(),e(31," in your app config for runtime theming: "),i(),t(32,"div",11)(33,"pre",12)(34,"code"),e(35),i()()()(),t(36,"tw-card",14)(37,"h3",9),e(38,"3. Override CSS variables"),i(),t(39,"p",10),e(40," Customize colors by overriding CSS variables in your stylesheet: "),i(),t(41,"div",11)(42,"pre",12)(43,"code"),e(44),i()()()()(),t(45,"section")(46,"h2",7),e(47,"Color Mode"),i(),t(48,"p",15),e(49," The library supports light, dark, and system color modes. Use the "),t(50,"code",13),e(51,"TwThemeService"),i(),e(52," to control the mode: "),i(),t(53,"tw-card",8)(54,"div",16)(55,"tw-button",17),v("click",function(){return n.themeService.setColorMode("light")}),s(56,"fa-icon",18),e(57," Light "),i(),t(58,"tw-button",17),v("click",function(){return n.themeService.setColorMode("dark")}),s(59,"fa-icon",18),e(60," Dark "),i(),t(61,"tw-button",17),v("click",function(){return n.themeService.setColorMode("system")}),e(62," System "),i()(),t(63,"div",19)(64,"p")(65,"strong"),e(66,"Current mode:"),i(),e(67),i(),t(68,"p")(69,"strong"),e(70,"Resolved to:"),i(),e(71),i(),t(72,"p")(73,"strong"),e(74,"Dark mode active:"),i(),e(75),i()()(),t(76,"div",11)(77,"pre",12)(78,"code"),e(79),i()()()(),t(80,"section")(81,"h2",7),e(82,"CSS Variables Reference"),i(),t(83,"p",15),e(84," Here are all the CSS variables you can customize. Each variable has light and dark mode values: "),i(),t(85,"tw-card",8)(86,"h3",20),e(87,"Brand Colors"),i(),t(88,"div",21),c(89,U,7,4,"div",22,u),i()(),t(91,"tw-card",8)(92,"h3",20),e(93,"Semantic Colors"),i(),t(94,"div",21),c(95,z,7,4,"div",22,u),i()(),t(97,"tw-card",8)(98,"h3",20),e(99,"Surface & Background"),i(),t(100,"div",21),c(101,A,7,4,"div",22,u),i()()(),t(103,"section")(104,"h2",7),e(105,"Using with Tailwind Classes"),i(),t(106,"p",15),e(107," You can use CSS variables directly in Tailwind's arbitrary value syntax: "),i(),t(108,"tw-card",8)(109,"div",23)(110,"div",24),e(111," Using: "),t(112,"code"),e(113,"bg-[var(--tw-color-primary)]"),i()(),t(114,"div",25),e(115," Using: "),t(116,"code"),e(117,"border-[var(--tw-color-success)]"),i(),e(118," and "),t(119,"code"),e(120,"text-[var(--tw-color-success)]"),i()(),t(121,"div",26),e(122," Using inline styles with CSS variables "),i()()(),t(123,"div",11)(124,"pre",12)(125,"code"),e(126),i()()()(),t(127,"section")(128,"h2",7),e(129,"Component-Level Customization"),i(),t(130,"p",15),e(131," Most components support "),t(132,"code",13),e(133,"classOverride"),i(),e(134," and "),t(135,"code",13),e(136,"classReplace"),i(),e(137," props for fine-grained control: "),i(),t(138,"tw-card",8)(139,"div",23)(140,"div")(141,"p",27),e(142,"Default button:"),i(),t(143,"tw-button",28),e(144,"Default Primary"),i()(),t(145,"div")(146,"p",27),e(147,"With classOverride:"),i(),t(148,"tw-button",29),e(149," Gradient Override "),i()(),t(150,"div")(151,"p",27),e(152,"With classReplace:"),i(),t(153,"tw-button",30),e(154," Fully Custom "),i()()()(),t(155,"div",11)(156,"pre",12)(157,"code"),e(158),i()()()(),t(159,"section")(160,"h2",7),e(161,"Dark Mode"),i(),t(162,"tw-alert",31)(163,"p"),e(164," The library uses Tailwind's "),t(165,"code"),e(166,"dark:"),i(),e(167," variant by default, which relies on the "),t(168,"code"),e(169,".dark"),i(),e(170," class on the "),t(171,"code"),e(172,"<html>"),i(),e(173," element. The CSS variables automatically update based on whether dark mode is active. "),i()(),t(174,"div",32)(175,"p",5)(176,"strong"),e(177,"Two approaches to dark mode:"),i()(),t(178,"ol",33)(179,"li")(180,"strong"),e(181,"CSS Variables (recommended):"),i(),e(182," Override "),t(183,"code"),e(184,"--tw-color-*"),i(),e(185," variables in "),t(186,"code"),e(187),i(),e(188," blocks "),i(),t(189,"li")(190,"strong"),e(191,"Tailwind dark: prefix:"),i(),e(192," Components use "),t(193,"code"),e(194,"dark:"),i(),e(195," variants which work automatically "),i()()()()()),o&2&&(r(4),a("icon",n.icons.palette),r(11),a("padded",!0),r(9),a("padded",!0),r(11),d(n.providerCode),r(),a("padded",!0),r(8),d(n.cssOverrideCode),r(9),a("padded",!0),r(2),a("variant",n.themeService.colorMode()==="light"?"primary":"ghost"),r(),a("icon",n.icons.sun),r(2),a("variant",n.themeService.colorMode()==="dark"?"primary":"ghost"),r(),a("icon",n.icons.moon),r(2),a("variant",n.themeService.colorMode()==="system"?"primary":"ghost"),r(6),h(" ",n.themeService.colorMode()),r(4),h(" ",n.themeService.resolvedColorMode()),r(4),h(" ",n.themeService.isDark()),r(4),d(n.colorModeCode),r(6),a("padded",!0),r(4),p(n.brandColors),r(2),a("padded",!0),r(4),p(n.semanticColors),r(2),a("padded",!0),r(4),p(n.surfaceColors),r(7),a("padded",!0),r(18),d(n.tailwindCode),r(12),a("padded",!0),r(20),d(n.overrideCode),r(29),w(".dark ","{"," ","}"))},dependencies:[b,_,T,C,E,k],encapsulation:2})};export{R as ThemingDemoComponent};
