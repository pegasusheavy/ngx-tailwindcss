import{a as A,b as F}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{h as L,ha as D,ia as _,ka as k,na as M,u as P,y as R}from"./chunk-5LPP6ASA.js";import{Ba as i,Ib as w,Jb as e,Kb as s,Lb as m,Mb as v,Ob as C,Ra as b,X as h,Xb as I,aa as S,ba as f,eb as u,fb as c,gb as p,hb as d,ib as n,ja as x,jb as t,kb as E,pb as y,tb as T,ub as g}from"./chunk-2G56FVSW.js";var H=()=>["button","input","select","modal","alert","toast","upload","tree","accordion","tabs","slider","rating","stepper","avatar","chip","dropdown","popover","sidebar","progress","spinner","skeleton","breadcrumb","menu","timeline","image"],U=(r,o)=>o.value;function G(r,o){if(r&1){let l=y();n(0,"button",49),T("click",function(){let B=S(l).$implicit,N=g();return f(N.changeLocale(B.value))}),e(1),t()}if(r&2){let l=o.$implicit,a=g();w(a.selectedLocale()===l.value?"bg-blue-600 text-white":"bg-slate-100 text-slate-700 hover:bg-slate-200"),i(),m(" ",l.label," ")}}function K(r,o){if(r&1&&(n(0,"span",40),e(1),t()),r&2){let l=o.$implicit;i(),s(l)}}function $(r,o){if(r&1&&(n(0,"div",48)(1,"code",23),e(2),t(),n(3,"span",50),e(4,"\u2192"),t(),n(5,"span",16),e(6),t()()),r&2){let l=o.$implicit,a=g();i(2),s(l),i(4),s(a.getTranslation(l))}}var O=class r{i18nService=h(R);selectedLocale=x("en");translationKey=x("common.loading");locales=[{value:"en",label:"English"},{value:"es",label:"Espa\xF1ol"},{value:"fr",label:"Fran\xE7ais"},{value:"de",label:"Deutsch"},{value:"ar",label:"\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (RTL)"},{value:"he",label:"\u05E2\u05D1\u05E8\u05D9\u05EA (RTL)"}];commonKeys=["common.loading","common.close","common.cancel","common.confirm","common.save","common.delete","common.search","common.noResults","button.loading","input.clearInput","modal.closeModal","table.noData","pagination.nextPage"];changeLocale(o){this.selectedLocale.set(o),this.i18nService.setLocale(o)}getTranslation(o){return this.i18nService.translate(o)}getInterpolatedTranslation(){return this.i18nService.translate("table.pageOf",{page:3,total:10})}setupCode=`// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTwTranslations, provideTwLocale } from '@pegasusheavy/ngx-tailwindcss';

// Spanish translations
const spanishTranslations = {
  common: {
    loading: 'Cargando...',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    search: 'Buscar',
    noResults: 'No se encontraron resultados',
  },
  button: {
    loading: 'Cargando, por favor espere',
  },
  modal: {
    close: 'Cerrar',
    closeModal: 'Cerrar ventana modal',
  },
  // ... more translations
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide custom translations
    provideTwTranslations(spanishTranslations),

    // Optionally set default locale
    provideTwLocale('es-ES'),
  ],
};`;serviceCode=`import { TwI18nService } from '@pegasusheavy/ngx-tailwindcss';

@Component({...})
export class MyComponent {
  private i18n = inject(TwI18nService);

  // Get current locale
  get currentLocale() {
    return this.i18n.locale();
  }

  // Check text direction
  get isRtl() {
    return this.i18n.isRtl();
  }

  // Simple translation
  get loadingText() {
    return this.i18n.translate('common.loading');
    // or shorthand: this.i18n.t('common.loading')
  }

  // Translation with interpolation
  get pageInfo() {
    return this.i18n.translate('table.pageOf', {
      page: this.currentPage,
      total: this.totalPages
    });
    // "Page 3 of 10"
  }

  // Change locale at runtime
  switchLanguage(locale: string) {
    this.i18n.setLocale(locale);
  }

  // Get all translations for a component
  get tableTranslations() {
    return this.i18n.getComponentTranslations('table');
  }
}`;rtlCode=`// RTL is automatically detected for these languages:
// Arabic (ar), Hebrew (he), Persian/Farsi (fa), Urdu (ur),
// Pashto (ps), Sindhi (sd), Yiddish (yi), Divehi (dv)

// The service automatically sets dir="rtl" on <html>
// when an RTL locale is detected.

// Check RTL status in your component:
@Component({
  template: \`
    <div [class.rtl]="i18n.isRtl()">
      <p [style.text-align]="i18n.isRtl() ? 'right' : 'left'">
        {{ i18n.t('common.greeting') }}
      </p>
    </div>
  \`
})
export class MyComponent {
  i18n = inject(TwI18nService);
}`;translationInterfaceCode=`// The TwTranslations interface defines all translatable strings
interface TwTranslations {
  common: {
    loading: string;
    close: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    search: string;
    clear: string;
    select: string;
    selectAll: string;
    deselectAll: string;
    noResults: string;
    noData: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    // ... and more
  };

  button: { loading: string; };

  input: {
    placeholder: string;
    clearInput: string;
    showPassword: string;
    hidePassword: string;
    characterCount: string;  // "{count} characters"
    maxCharacters: string;   // "{count} of {max} characters"
  };

  select: {
    placeholder: string;
    noOptions: string;
    searchPlaceholder: string;
    clearSelection: string;
    selectOption: string;
    optionsAvailable: string; // "{count} options available"
  };

  modal: { close: string; closeModal: string; };
  alert: { dismiss: string; dismissAlert: string; };
  toast: { dismiss: string; dismissToast: string; };

  table: {
    noData: string;
    loading: string;
    sortAscending: string;
    sortDescending: string;
    rowsPerPage: string;
    pageOf: string;          // "Page {page} of {total}"
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
    selectedRows: string;    // "{count} row(s) selected"
  };

  pagination: {
    page: string;
    of: string;
    goToPage: string;        // "Go to page {page}"
    firstPage: string;
    lastPage: string;
    nextPage: string;
    previousPage: string;
  };

  datepicker: {
    selectDate: string;
    today: string;
    clear: string;
    months: string[];        // Full month names
    monthsShort: string[];   // Abbreviated month names
    weekdays: string[];      // Full weekday names
    weekdaysShort: string[]; // Abbreviated weekday names
    weekdaysMin: string[];   // Minimal weekday names (Su, Mo, etc.)
  };

  // ... plus translations for all 30+ components
}`;interpolationCode=`// Translation strings can include placeholders with {paramName} syntax

// In your translation file:
{
  "table": {
    "pageOf": "Page {page} of {total}",
    "selectedRows": "{count} row(s) selected"
  },
  "input": {
    "maxCharacters": "{count} of {max} characters"
  }
}

// In your component:
this.i18n.translate('table.pageOf', { page: 3, total: 10 });
// \u2192 "Page 3 of 10"

this.i18n.translate('table.selectedRows', { count: 5 });
// \u2192 "5 row(s) selected"

this.i18n.translate('input.maxCharacters', { count: 45, max: 100 });
// \u2192 "45 of 100 characters"`;static \u0275fac=function(l){return new(l||r)};static \u0275cmp=b({type:r,selectors:[["app-i18n-demo"]],decls:230,vars:22,consts:[["title","Internationalization (i18n)","description","Built-in internationalization support with translations for all components, RTL language support, and easy customization."],[1,"space-y-8"],["twCardHeader",""],["twCardTitle",""],["twCardBody","",1,"prose","prose-slate","max-w-none"],[1,"list-disc","list-inside","space-y-2","mt-4"],["title","Live Translation Demo","description","See translations in action. Switch locales and observe how text direction changes for RTL languages."],[1,"space-y-6"],[1,"flex","flex-wrap","items-center","gap-4"],[1,"font-medium","text-slate-700"],[1,"flex","flex-wrap","gap-2"],[1,"px-4","py-2","rounded-lg","transition-colors",3,"class"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4"],[1,"p-4","bg-slate-50","rounded-lg"],[1,"font-semibold","text-slate-900","mb-3"],[1,"space-y-2","text-sm"],[1,"text-slate-600"],[1,"bg-slate-200","px-1","rounded"],[1,"p-4","bg-blue-50","rounded-lg","border","border-blue-200"],[1,"font-semibold","text-blue-900","mb-2"],[1,"text-blue-800"],[1,"bg-blue-100","px-1","rounded"],["title","Setup - Custom Translations","description","Provide custom translations in your app configuration.",3,"code"],[1,"text-slate-700"],["title","TwI18nService","description","Use the i18n service to access translations and manage locales in your components.",3,"code"],[1,"space-y-4"],[1,"font-semibold","text-slate-900","mb-2"],[1,"text-sm","text-slate-600","space-y-1"],["title","RTL Language Support","description","Automatic right-to-left support for Arabic, Hebrew, and other RTL languages.",3,"code"],[1,"p-4","bg-amber-50","rounded-lg","border","border-amber-200"],[1,"font-semibold","text-amber-900","mb-2"],[1,"flex","flex-wrap","gap-2","mt-2"],[1,"px-2","py-1","bg-amber-100","rounded","text-sm","text-amber-800"],[1,"list-disc","list-inside","text-slate-600","space-y-1"],["title","Translation Interface","description","Complete structure of the TwTranslations interface.",3,"code"],[1,"grid","grid-cols-2","md:grid-cols-4","gap-3"],[1,"p-3","bg-slate-50","rounded-lg","text-center"],[1,"text-2xl","font-bold","text-blue-600"],[1,"text-xs","text-slate-500"],[1,"flex","flex-wrap","gap-2","mt-4"],[1,"px-2","py-1","bg-slate-100","rounded","text-xs","text-slate-600"],["title","String Interpolation","description","Use placeholders in translations for dynamic content.",3,"code"],[1,"p-4","bg-emerald-50","rounded-lg","border","border-emerald-200"],[1,"font-semibold","text-emerald-900","mb-2"],[1,"text-emerald-800"],[1,"bg-emerald-100","px-1","rounded"],[1,"text-sm","bg-slate-200","px-2","py-1","rounded","block"],["title","Common Translation Keys","description","Browse available translation keys you can use or override."],[1,"px-3","py-2","bg-slate-100","rounded-lg","text-sm"],[1,"px-4","py-2","rounded-lg","transition-colors",3,"click"],[1,"text-slate-400","mx-2"]],template:function(l,a){l&1&&(E(0,"app-page-header",0),n(1,"div",1)(2,"tw-card")(3,"div",2)(4,"h2",3),e(5,"Overview"),t()(),n(6,"div",4)(7,"p"),e(8," The ngx-tailwindcss library includes comprehensive i18n support: "),t(),n(9,"ul",5)(10,"li")(11,"strong"),e(12,"Default English translations"),t(),e(13," for all 30+ components"),t(),n(14,"li")(15,"strong"),e(16,"Easy customization"),t(),e(17," via provideTwTranslations()"),t(),n(18,"li")(19,"strong"),e(20,"RTL support"),t(),e(21," with automatic direction detection"),t(),n(22,"li")(23,"strong"),e(24,"Interpolation"),t(),e(25," for dynamic values in translations"),t(),n(26,"li")(27,"strong"),e(28,"Runtime locale switching"),t()()()()(),n(29,"app-demo-section",6)(30,"div",7)(31,"div",8)(32,"label",9),e(33,"Select Locale:"),t(),n(34,"div",10),c(35,G,2,3,"button",11,U),t()(),n(37,"div",12)(38,"div",13)(39,"h4",14),e(40,"Current State"),t(),n(41,"ul",15)(42,"li")(43,"span",16),e(44,"Locale:"),t(),n(45,"code",17),e(46),t()(),n(47,"li")(48,"span",16),e(49,"Direction:"),t(),n(50,"code",17),e(51),t()(),n(52,"li")(53,"span",16),e(54,"Is RTL:"),t(),n(55,"code",17),e(56),t()()()(),n(57,"div",13)(58,"h4",14),e(59,"Sample Translations"),t(),n(60,"ul",15)(61,"li")(62,"span",16),e(63,"Loading:"),t(),e(64),t(),n(65,"li")(66,"span",16),e(67,"Close:"),t(),e(68),t(),n(69,"li")(70,"span",16),e(71,"Search:"),t(),e(72),t(),n(73,"li")(74,"span",16),e(75,"No Results:"),t(),e(76),t()()()(),n(77,"div",18)(78,"h4",19),e(79,"Interpolation Example"),t(),n(80,"p",20)(81,"code",21),e(82,"table.pageOf"),t(),e(83),n(84,"strong"),e(85),t()()()()(),n(86,"app-demo-section",22)(87,"div",13)(88,"p",23),e(89," Use "),n(90,"code",17),e(91,"provideTwTranslations()"),t(),e(92," to provide custom translations. Your translations will be deeply merged with the defaults, so you only need to provide what you want to override. "),t()()(),n(93,"app-demo-section",24)(94,"div",25)(95,"div",12)(96,"div",13)(97,"h4",26),e(98,"Read-only Signals"),t(),n(99,"ul",27)(100,"li")(101,"code",17),e(102,"locale()"),t(),e(103," - Current locale"),t(),n(104,"li")(105,"code",17),e(106,"direction()"),t(),e(107," - 'ltr' or 'rtl'"),t(),n(108,"li")(109,"code",17),e(110,"isRtl()"),t(),e(111," - Boolean for RTL check"),t(),n(112,"li")(113,"code",17),e(114,"translations()"),t(),e(115," - All translations"),t()()(),n(116,"div",13)(117,"h4",26),e(118,"Methods"),t(),n(119,"ul",27)(120,"li")(121,"code",17),e(122,"setLocale(locale)"),t(),e(123," - Change locale"),t(),n(124,"li")(125,"code",17),e(126,"translate(key, params?)"),t(),e(127," - Get translation"),t(),n(128,"li")(129,"code",17),e(130,"t(key, params?)"),t(),e(131," - Shorthand for translate"),t(),n(132,"li")(133,"code",17),e(134,"getComponentTranslations(name)"),t(),e(135," - Get all for component"),t()()()()()(),n(136,"app-demo-section",28)(137,"div",25)(138,"div",29)(139,"h4",30),e(140,"Supported RTL Languages"),t(),n(141,"div",31)(142,"span",32),e(143,"Arabic (ar)"),t(),n(144,"span",32),e(145,"Hebrew (he)"),t(),n(146,"span",32),e(147,"Persian (fa)"),t(),n(148,"span",32),e(149,"Urdu (ur)"),t(),n(150,"span",32),e(151,"Pashto (ps)"),t(),n(152,"span",32),e(153,"Sindhi (sd)"),t(),n(154,"span",32),e(155,"Yiddish (yi)"),t(),n(156,"span",32),e(157,"Divehi (dv)"),t()()(),n(158,"p",23),e(159," When you set an RTL locale, the service automatically: "),t(),n(160,"ul",33)(161,"li"),e(162,"Sets "),n(163,"code",17),e(164,'dir="rtl"'),t(),e(165," on the document root"),t(),n(166,"li"),e(167,"Updates the "),n(168,"code",17),e(169,"direction()"),t(),e(170," signal to 'rtl'"),t(),n(171,"li"),e(172,"Sets "),n(173,"code",17),e(174,"isRtl()"),t(),e(175," to true"),t()()()(),n(176,"app-demo-section",34)(177,"div",25)(178,"p",23),e(179," The library provides translations for all components. Here are the main categories: "),t(),n(180,"div",35)(181,"div",36)(182,"div",37),e(183,"common"),t(),n(184,"div",38),e(185,"30+ strings"),t()(),n(186,"div",36)(187,"div",37),e(188,"table"),t(),n(189,"div",38),e(190,"12 strings"),t()(),n(191,"div",36)(192,"div",37),e(193,"datepicker"),t(),n(194,"div",38),e(195,"15+ strings"),t()(),n(196,"div",36)(197,"div",37),e(198,"pagination"),t(),n(199,"div",38),e(200,"7 strings"),t()()(),n(201,"div",39),c(202,K,2,1,"span",40,u),t()()(),n(204,"app-demo-section",41)(205,"div",25)(206,"div",42)(207,"h4",43),e(208,"Placeholder Syntax"),t(),n(209,"p",44),e(210," Use "),n(211,"code",45),e(212),t(),e(213," in your translation strings, then pass an object with matching keys to the translate method. "),t()(),n(214,"div",12)(215,"div",13)(216,"h4",26),e(217,"Translation String"),t(),n(218,"code",46),e(219),t()(),n(220,"div",13)(221,"h4",26),e(222,"Result"),t(),n(223,"code",46),e(224,' "Page 3 of 10" '),t()()()()(),n(225,"app-demo-section",47)(226,"div",25)(227,"div",10),c(228,$,7,2,"div",48,u),t()()()()),l&2&&(i(35),p(a.locales),i(11),s(a.i18nService.locale()),i(5),s(a.i18nService.direction()),i(5),s(a.i18nService.isRtl()),i(8),m(" ",a.getTranslation("common.loading")),i(4),m(" ",a.getTranslation("common.close")),i(4),m(" ",a.getTranslation("common.search")),i(4),m(" ",a.getTranslation("common.noResults")),i(7),v(" with ","{","page: 3, total: 10","}",": "),i(2),s(a.getInterpolatedTranslation()),i(),d("code",a.setupCode),i(7),d("code",a.serviceCode),i(43),d("code",a.rtlCode),i(40),d("code",a.translationInterfaceCode),i(26),p(I(21,H)),i(2),d("code",a.interpolationCode),i(8),v("","{","paramName","}"),i(7),C(' "Page ',"{","page","}"," of ","{","total","}",'" '),i(9),p(a.commonKeys))},dependencies:[L,P,M,D,_,k,A,F],encapsulation:2})};export{O as I18nDemoComponent};
