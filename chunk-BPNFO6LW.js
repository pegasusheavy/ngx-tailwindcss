import{a as M,b as E}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{ca as y,h as w,o as S,p as C,u as f}from"./chunk-5LPP6ASA.js";import{Ba as l,Jb as a,Lb as m,Mb as h,Pb as d,Qb as p,Ra as b,Rb as c,hb as i,ib as o,ja as r,jb as t,kb as s}from"./chunk-2G56FVSW.js";var _=class v{selectedFruits=r([]);selectedCountries=r([]);selectedTechnologies=r([]);selectedColors=r([]);fruits=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Orange",value:"orange"},{label:"Grape",value:"grape"},{label:"Mango",value:"mango"},{label:"Strawberry",value:"strawberry"}];countryGroups=[{label:"North America",options:[{label:"United States",value:"us"},{label:"Canada",value:"ca"},{label:"Mexico",value:"mx"}]},{label:"Europe",options:[{label:"United Kingdom",value:"uk"},{label:"Germany",value:"de"},{label:"France",value:"fr"},{label:"Spain",value:"es"}]},{label:"Asia",options:[{label:"Japan",value:"jp"},{label:"South Korea",value:"kr"},{label:"China",value:"cn"}]}];technologies=[{label:"Angular",value:"angular"},{label:"React",value:"react"},{label:"Vue",value:"vue"},{label:"Svelte",value:"svelte"},{label:"Next.js",value:"nextjs"},{label:"Nuxt",value:"nuxt"},{label:"TypeScript",value:"typescript"},{label:"JavaScript",value:"javascript"},{label:"Node.js",value:"nodejs"},{label:"Python",value:"python"}];colors=[{label:"Red",value:"red"},{label:"Blue",value:"blue"},{label:"Green",value:"green"},{label:"Yellow",value:"yellow"},{label:"Purple",value:"purple"},{label:"Orange",value:"orange"}];disabledOptions=[{label:"Available Option 1",value:"opt1"},{label:"Available Option 2",value:"opt2"},{label:"Unavailable Option",value:"opt3",disabled:!0},{label:"Available Option 3",value:"opt4"}];basicCode=`// Options array
fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
];

// In template
<tw-multiselect
  [options]="fruits"
  [(ngModel)]="selectedFruits"
  placeholder="Select fruits">
</tw-multiselect>`;groupedCode=`// Grouped options
countryGroups: MultiSelectGroup[] = [
  {
    label: 'North America',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Germany', value: 'de' },
    ],
  },
];

<tw-multiselect
  [groups]="countryGroups"
  [(ngModel)]="selectedCountries"
  placeholder="Select countries">
</tw-multiselect>`;filterCode=`<tw-multiselect
  [options]="technologies"
  [(ngModel)]="selectedTechnologies"
  [filter]="true"
  placeholder="Search technologies...">
</tw-multiselect>`;maxSelectionsCode=`<tw-multiselect
  [options]="colors"
  [(ngModel)]="selectedColors"
  [maxSelections]="3"
  placeholder="Select up to 3 colors">
</tw-multiselect>`;sizesCode=`<tw-multiselect size="sm" [options]="options"></tw-multiselect>
<tw-multiselect size="md" [options]="options"></tw-multiselect>
<tw-multiselect size="lg" [options]="options"></tw-multiselect>`;variantsCode=`<tw-multiselect variant="default" [options]="options"></tw-multiselect>
<tw-multiselect variant="filled" [options]="options"></tw-multiselect>`;statesCode=`// Disabled
<tw-multiselect [disabled]="true" [options]="options"></tw-multiselect>

// With disabled options
<tw-multiselect [options]="[
  { label: 'Available', value: 'a' },
  { label: 'Disabled', value: 'b', disabled: true },
]"></tw-multiselect>`;static \u0275fac=function(u){return new(u||v)};static \u0275cmp=b({type:v,selectors:[["app-multiselect-demo"]],decls:74,vars:38,consts:[["title","Multiselect","description","Multi-selection dropdown with search, grouping, and selection controls."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[1,"max-w-sm"],["placeholder","Select fruits",3,"ngModelChange","options","ngModel"],[1,"mt-2","text-sm","text-slate-600"],["title","Grouped Options",3,"code"],["placeholder","Select countries",3,"ngModelChange","groups","ngModel"],["title","With Filter/Search",3,"code"],["placeholder","Search technologies...",3,"ngModelChange","options","ngModel","filter"],["title","Max Selections",3,"code"],["placeholder","Select up to 3 colors",3,"ngModelChange","options","ngModel","maxSelections"],["title","Sizes",3,"code"],[1,"flex","flex-wrap","items-start","gap-4","max-w-3xl"],[1,"w-40"],[1,"block","text-sm","font-medium","text-slate-700","mb-1"],["size","sm","placeholder","Small",3,"options"],[1,"w-48"],["size","md","placeholder","Medium",3,"options"],[1,"w-56"],["size","lg","placeholder","Large",3,"options"],["title","Variants",3,"code"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4","max-w-2xl"],["variant","default","placeholder","Select fruits",3,"options"],["variant","filled","placeholder","Select fruits",3,"options"],["title","States",3,"code"],[1,"flex","flex-wrap","gap-4","max-w-2xl"],["placeholder","Disabled",3,"disabled","options"],["placeholder","Some options disabled",3,"options"],["title","Features",3,"code"],["placeholder","Select fruits",3,"options","showSelectAll"],["placeholder","Select fruits",3,"options","showCheckbox"],["label","Favorite Fruits","placeholder","Select fruits",3,"options"]],template:function(u,e){u&1&&(s(0,"app-page-header",0),o(1,"div",1)(2,"app-demo-section",2)(3,"div",3)(4,"tw-multiselect",4),c("ngModelChange",function(n){return p(e.selectedFruits,n)||(e.selectedFruits=n),n}),t(),o(5,"p",5),a(6),t()()(),o(7,"app-demo-section",6)(8,"div",3)(9,"tw-multiselect",7),c("ngModelChange",function(n){return p(e.selectedCountries,n)||(e.selectedCountries=n),n}),t(),o(10,"p",5),a(11),t()()(),o(12,"app-demo-section",8)(13,"div",3)(14,"tw-multiselect",9),c("ngModelChange",function(n){return p(e.selectedTechnologies,n)||(e.selectedTechnologies=n),n}),t(),o(15,"p",5),a(16),t()()(),o(17,"app-demo-section",10)(18,"div",3)(19,"tw-multiselect",11),c("ngModelChange",function(n){return p(e.selectedColors,n)||(e.selectedColors=n),n}),t(),o(20,"p",5),a(21),t()()(),o(22,"app-demo-section",12)(23,"div",13)(24,"div",14)(25,"label",15),a(26,"Small"),t(),s(27,"tw-multiselect",16),t(),o(28,"div",17)(29,"label",15),a(30,"Medium"),t(),s(31,"tw-multiselect",18),t(),o(32,"div",19)(33,"label",15),a(34,"Large"),t(),s(35,"tw-multiselect",20),t()()(),o(36,"app-demo-section",21)(37,"div",22)(38,"div")(39,"label",15),a(40,"Default"),t(),s(41,"tw-multiselect",23),t(),o(42,"div")(43,"label",15),a(44,"Filled"),t(),s(45,"tw-multiselect",24),t()()(),o(46,"app-demo-section",25)(47,"div",26)(48,"div",17)(49,"label",15),a(50,"Disabled"),t(),s(51,"tw-multiselect",27),t(),o(52,"div",19)(53,"label",15),a(54,"With Disabled Options"),t(),s(55,"tw-multiselect",28),t()()(),o(56,"app-demo-section",29)(57,"div",22)(58,"div")(59,"label",15),a(60,"With Select All"),t(),s(61,"tw-multiselect",30),t(),o(62,"div")(63,"label",15),a(64,"Without Checkboxes"),t(),s(65,"tw-multiselect",31),t(),o(66,"div")(67,"label",15),a(68,"Without Select All"),t(),s(69,"tw-multiselect",30),t(),o(70,"div")(71,"label",15),a(72,"With Label"),t(),s(73,"tw-multiselect",32),t()()()()),u&2&&(l(2),i("code",e.basicCode),l(2),i("options",e.fruits),d("ngModel",e.selectedFruits),l(2),m(" Selected: ",e.selectedFruits().length>0?e.selectedFruits().join(", "):"None"," "),l(),i("code",e.groupedCode),l(2),i("groups",e.countryGroups),d("ngModel",e.selectedCountries),l(2),m(" Selected: ",e.selectedCountries().length>0?e.selectedCountries().join(", "):"None"," "),l(),i("code",e.filterCode),l(2),i("options",e.technologies),d("ngModel",e.selectedTechnologies),i("filter",!0),l(2),m(" Selected: ",e.selectedTechnologies().length>0?e.selectedTechnologies().join(", "):"None"," "),l(),i("code",e.maxSelectionsCode),l(2),i("options",e.colors),d("ngModel",e.selectedColors),i("maxSelections",3),l(2),h(" Selected ",e.selectedColors().length,"/3: ",e.selectedColors().length>0?e.selectedColors().join(", "):"None"," "),l(),i("code",e.sizesCode),l(5),i("options",e.fruits),l(4),i("options",e.fruits),l(4),i("options",e.fruits),l(),i("code",e.variantsCode),l(5),i("options",e.fruits),l(4),i("options",e.fruits),l(),i("code",e.statesCode),l(5),i("disabled",!0)("options",e.fruits),l(4),i("options",e.disabledOptions),l(),i("code",""),l(5),i("options",e.fruits)("showSelectAll",!0),l(4),i("options",e.fruits)("showCheckbox",!1),l(4),i("options",e.fruits)("showSelectAll",!1),l(4),i("options",e.fruits))},dependencies:[w,f,S,C,y,M,E],encapsulation:2})};export{_ as MultiselectDemoComponent};
