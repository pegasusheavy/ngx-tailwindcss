import{a as w,b as h}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{X as m,Y as c,h as s,u}from"./chunk-5LPP6ASA.js";import{Ba as e,Ra as p,hb as t,ib as l,ja as r,jb as i,kb as a}from"./chunk-2G56FVSW.js";var b=class d{name=r("");email=r("");bio=r("");password=r("");basicCode=`<tw-input
  label="Full Name"
  placeholder="Enter your name">
</tw-input>

<tw-input
  label="Email Address"
  type="email"
  placeholder="you@example.com">
</tw-input>`;variantsCode=`<tw-input variant="default" label="Default" placeholder="Default variant"></tw-input>
<tw-input variant="filled" label="Filled" placeholder="Filled variant"></tw-input>
<tw-input variant="outlined" label="Outlined" placeholder="Outlined variant"></tw-input>
<tw-input variant="underlined" label="Underlined" placeholder="Underlined variant"></tw-input>`;sizesCode=`<tw-input size="sm" label="Small" placeholder="Small input"></tw-input>
<tw-input size="md" label="Medium" placeholder="Medium input"></tw-input>
<tw-input size="lg" label="Large" placeholder="Large input"></tw-input>`;hintErrorCode=`<!-- With hint text -->
<tw-input
  label="Username"
  placeholder="Choose a username"
  hint="Must be at least 3 characters long">
</tw-input>

<!-- With error message -->
<tw-input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Please enter a valid email address">
</tw-input>`;statesCode=`<!-- Required field -->
<tw-input
  label="Required Field"
  placeholder="This field is required"
  [required]="true">
</tw-input>

<!-- Disabled field -->
<tw-input
  label="Disabled Field"
  placeholder="This field is disabled"
  [disabled]="true">
</tw-input>

<!-- Readonly field -->
<tw-input
  label="Readonly Field"
  [readonly]="true"
  value="Read-only value">
</tw-input>`;clearableCode=`<tw-input
  label="Search"
  placeholder="Type to search..."
  [clearable]="true">
</tw-input>`;textareaCode=`<!-- Basic textarea -->
<tw-textarea
  label="Bio"
  placeholder="Tell us about yourself..."
  [rows]="4">
</tw-textarea>

<!-- With character count -->
<tw-textarea
  label="With Character Count"
  placeholder="Limited to 200 characters..."
  [rows]="3"
  [maxlength]="200"
  [showCount]="true">
</tw-textarea>

<!-- Auto-resize -->
<tw-textarea
  label="Auto-resize"
  placeholder="This textarea will grow as you type..."
  [rows]="2"
  [autoResize]="true">
</tw-textarea>`;static \u0275fac=function(o){return new(o||d)};static \u0275cmp=p({type:d,selectors:[["app-input-demo"]],decls:33,vars:17,consts:[["title","Input","description","Form input components with validation states, labels, and various styles."],["title","Basic Input","description","Simple text input with label and placeholder.",3,"code"],[1,"max-w-md","space-y-4"],["label","Full Name","placeholder","Enter your name"],["label","Email Address","type","email","placeholder","you@example.com"],["title","Input Variants","description","Different visual styles for inputs.",3,"code"],["variant","default","label","Default","placeholder","Default variant"],["variant","filled","label","Filled","placeholder","Filled variant"],["variant","outlined","label","Outlined","placeholder","Outlined variant"],["variant","underlined","label","Underlined","placeholder","Underlined variant"],["title","Input Sizes","description","Available in multiple sizes.",3,"code"],["size","sm","label","Small","placeholder","Small input"],["size","md","label","Medium","placeholder","Medium input"],["size","lg","label","Large","placeholder","Large input"],["title","With Hint and Error","description","Display helper text and validation errors.",3,"code"],["label","Username","placeholder","Choose a username","hint","Must be at least 3 characters long"],["label","Email","type","email","placeholder","Enter email","error","Please enter a valid email address"],["title","Required and Disabled","description","Handle required fields and disabled states.",3,"code"],["label","Required Field","placeholder","This field is required",3,"required"],["label","Disabled Field","placeholder","This field is disabled",3,"disabled"],["label","Readonly Field","placeholder","This field is readonly","value","Read-only value",3,"readonly"],["title","Clearable Input","description","Input with a clear button.",3,"code"],[1,"max-w-md"],["label","Search","placeholder","Type to search...",3,"clearable"],["title","Textarea","description","Multi-line text input.",3,"code"],["label","Bio","placeholder","Tell us about yourself...",3,"rows"],["label","With Character Count","placeholder","Limited to 200 characters...",3,"rows","maxlength","showCount"],["label","Auto-resize","placeholder","This textarea will grow as you type...",3,"rows","autoResize"]],template:function(o,n){o&1&&(a(0,"app-page-header",0),l(1,"app-demo-section",1)(2,"div",2),a(3,"tw-input",3)(4,"tw-input",4),i()(),l(5,"app-demo-section",5)(6,"div",2),a(7,"tw-input",6)(8,"tw-input",7)(9,"tw-input",8)(10,"tw-input",9),i()(),l(11,"app-demo-section",10)(12,"div",2),a(13,"tw-input",11)(14,"tw-input",12)(15,"tw-input",13),i()(),l(16,"app-demo-section",14)(17,"div",2),a(18,"tw-input",15)(19,"tw-input",16),i()(),l(20,"app-demo-section",17)(21,"div",2),a(22,"tw-input",18)(23,"tw-input",19)(24,"tw-input",20),i()(),l(25,"app-demo-section",21)(26,"div",22),a(27,"tw-input",23),i()(),l(28,"app-demo-section",24)(29,"div",2),a(30,"tw-textarea",25)(31,"tw-textarea",26)(32,"tw-textarea",27),i()()),o&2&&(e(),t("code",n.basicCode),e(4),t("code",n.variantsCode),e(6),t("code",n.sizesCode),e(5),t("code",n.hintErrorCode),e(4),t("code",n.statesCode),e(2),t("required",!0),e(),t("disabled",!0),e(),t("readonly",!0),e(),t("code",n.clearableCode),e(2),t("clearable",!0),e(),t("code",n.textareaCode),e(2),t("rows",4),e(),t("rows",3)("maxlength",200)("showCount",!0),e(),t("rows",2)("autoResize",!0))},dependencies:[s,u,m,c,w,h],encapsulation:2})};export{b as InputDemoComponent};
