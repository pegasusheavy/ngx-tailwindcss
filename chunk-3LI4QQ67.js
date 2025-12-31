import{a as f,b as h}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{ba as b,h as v,o as C,p as w,u as S}from"./chunk-5LPP6ASA.js";import{Ba as l,Jb as a,Lb as d,Pb as p,Qb as c,Ra as y,Rb as m,hb as o,ib as i,jb as t,kb as r}from"./chunk-2G56FVSW.js";var M=class u{selectedCountry="";selectedSize="md";selectedGroupedCountry="";selectedFilterCountry="";countries=[{label:"United States",value:"us"},{label:"Canada",value:"ca"},{label:"United Kingdom",value:"uk"},{label:"Germany",value:"de"},{label:"France",value:"fr"},{label:"Japan",value:"jp"}];countryGroups=[{label:"North America",options:[{label:"United States",value:"us"},{label:"Canada",value:"ca"},{label:"Mexico",value:"mx"}]},{label:"Europe",options:[{label:"United Kingdom",value:"uk"},{label:"Germany",value:"de"},{label:"France",value:"fr"},{label:"Spain",value:"es"},{label:"Italy",value:"it"}]},{label:"Asia",options:[{label:"Japan",value:"jp"},{label:"South Korea",value:"kr"},{label:"China",value:"cn"},{label:"India",value:"in"}]}];sizes=[{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"},{label:"Extra Large",value:"xl"}];basicCode=`<tw-select
  [options]="countries"
  [(ngModel)]="selectedCountry"
  placeholder="Select a country">
</tw-select>`;groupedCode=`// Define grouped options
countryGroups: SelectGroup[] = [
  {
    label: 'North America',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'Mexico', value: 'mx' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
    ],
  },
];

// In template - use [groups] instead of [options]
<tw-select
  [groups]="countryGroups"
  [(ngModel)]="selectedCountry"
  placeholder="Select a country">
</tw-select>`;filterCode=`<tw-select
  [groups]="countryGroups"
  [(ngModel)]="selectedCountry"
  [filter]="true"
  filterPlaceholder="Search countries..."
  placeholder="Select a country">
</tw-select>`;variantsCode=`<tw-select variant="default" [options]="options"></tw-select>
<tw-select variant="filled" [options]="options"></tw-select>`;sizesCode=`<tw-select size="sm" [options]="options"></tw-select>
<tw-select size="md" [options]="options"></tw-select>
<tw-select size="lg" [options]="options"></tw-select>`;statesCode=`<tw-select [disabled]="true" [options]="options" placeholder="Disabled"></tw-select>
<tw-select error="Required" [options]="options" placeholder="With Error"></tw-select>`;static \u0275fac=function(s){return new(s||u)};static \u0275cmp=y({type:u,selectors:[["app-select-demo"]],decls:51,vars:24,consts:[["title","Select","description","Dropdown select component with search, filtering, grouped options, and selection support."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[1,"max-w-sm"],["placeholder","Select a country",3,"ngModelChange","options","ngModel"],[1,"mt-2","text-sm","text-slate-600"],["title","Grouped Options",3,"code"],["placeholder","Select a country",3,"ngModelChange","groups","ngModel"],["title","With Filter/Search",3,"code"],["filterPlaceholder","Search countries...","placeholder","Select a country",3,"ngModelChange","groups","ngModel","filter"],["title","Variants",3,"code"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4","max-w-2xl"],[1,"block","text-sm","font-medium","text-slate-700","mb-1"],["variant","default","placeholder","Select size",3,"options"],["variant","filled","placeholder","Select size",3,"options"],["title","Sizes",3,"code"],[1,"flex","flex-wrap","items-start","gap-4","max-w-3xl"],[1,"w-40"],["size","sm","placeholder","Small",3,"options"],[1,"w-48"],["size","md","placeholder","Medium",3,"options"],[1,"w-56"],["size","lg","placeholder","Large",3,"options"],["title","States",3,"code"],[1,"flex","flex-wrap","gap-4","max-w-2xl"],["placeholder","Disabled",3,"disabled","options"],["error","This field is required","placeholder","Required",3,"options"]],template:function(s,e){s&1&&(r(0,"app-page-header",0),i(1,"div",1)(2,"app-demo-section",2)(3,"div",3)(4,"tw-select",4),m("ngModelChange",function(n){return c(e.selectedCountry,n)||(e.selectedCountry=n),n}),t(),i(5,"p",5),a(6),t()()(),i(7,"app-demo-section",6)(8,"div",3)(9,"tw-select",7),m("ngModelChange",function(n){return c(e.selectedGroupedCountry,n)||(e.selectedGroupedCountry=n),n}),t(),i(10,"p",5),a(11),t()()(),i(12,"app-demo-section",8)(13,"div",3)(14,"tw-select",9),m("ngModelChange",function(n){return c(e.selectedFilterCountry,n)||(e.selectedFilterCountry=n),n}),t(),i(15,"p",5),a(16),t()()(),i(17,"app-demo-section",10)(18,"div",11)(19,"div")(20,"label",12),a(21,"Default"),t(),r(22,"tw-select",13),t(),i(23,"div")(24,"label",12),a(25,"Filled"),t(),r(26,"tw-select",14),t()()(),i(27,"app-demo-section",15)(28,"div",16)(29,"div",17)(30,"label",12),a(31,"Small"),t(),r(32,"tw-select",18),t(),i(33,"div",19)(34,"label",12),a(35,"Medium"),t(),r(36,"tw-select",20),t(),i(37,"div",21)(38,"label",12),a(39,"Large"),t(),r(40,"tw-select",22),t()()(),i(41,"app-demo-section",23)(42,"div",24)(43,"div",19)(44,"label",12),a(45,"Disabled"),t(),r(46,"tw-select",25),t(),i(47,"div",19)(48,"label",12),a(49,"With Error"),t(),r(50,"tw-select",26),t()()()()),s&2&&(l(2),o("code",e.basicCode),l(2),o("options",e.countries),p("ngModel",e.selectedCountry),l(2),d("Selected: ",e.selectedCountry||"None"),l(),o("code",e.groupedCode),l(2),o("groups",e.countryGroups),p("ngModel",e.selectedGroupedCountry),l(2),d("Selected: ",e.selectedGroupedCountry||"None"),l(),o("code",e.filterCode),l(2),o("groups",e.countryGroups),p("ngModel",e.selectedFilterCountry),o("filter",!0),l(2),d("Selected: ",e.selectedFilterCountry||"None"),l(),o("code",e.variantsCode),l(5),o("options",e.sizes),l(4),o("options",e.sizes),l(),o("code",e.sizesCode),l(5),o("options",e.sizes),l(4),o("options",e.sizes),l(4),o("options",e.sizes),l(),o("code",e.statesCode),l(5),o("disabled",!0)("options",e.sizes),l(4),o("options",e.sizes))},dependencies:[v,S,C,w,b,f,h],encapsulation:2})};export{M as SelectDemoComponent};
