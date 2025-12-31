import{a as f,b as v}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{Ya as p,Za as w,_a as u,h as m}from"./chunk-5LPP6ASA.js";import{Ba as a,Jb as i,Ra as c,hb as r,ib as e,jb as t,kb as d,tb as s}from"./chunk-2G56FVSW.js";var y=class o{onDismiss(){console.log("Alert dismissed")}variantsCode=`<tw-alert variant="info">Informational message.</tw-alert>
<tw-alert variant="success">Your changes have been saved!</tw-alert>
<tw-alert variant="warning">Please review your input.</tw-alert>
<tw-alert variant="danger">An error occurred.</tw-alert>
<tw-alert variant="neutral">Neutral notification.</tw-alert>`;stylesCode=`<tw-alert variant="info" alertStyle="solid">Solid style alert</tw-alert>
<tw-alert variant="info" alertStyle="soft">Soft style alert</tw-alert>
<tw-alert variant="info" alertStyle="outlined">Outlined style alert</tw-alert>
<tw-alert variant="info" alertStyle="accent">Accent style alert</tw-alert>`;titleDescCode=`<tw-alert variant="success" alertStyle="soft">
  <tw-alert-title>Success!</tw-alert-title>
  <tw-alert-description>
    Your payment has been processed successfully.
    You will receive a confirmation email shortly.
  </tw-alert-description>
</tw-alert>

<tw-alert variant="danger" alertStyle="accent">
  <tw-alert-title>Error</tw-alert-title>
  <tw-alert-description>
    Unable to connect to the server.
    Please check your internet connection.
  </tw-alert-description>
</tw-alert>`;dismissibleCode=`<tw-alert
  variant="info"
  alertStyle="soft"
  [dismissible]="true"
  (dismiss)="onDismiss()">
  Click the X button to dismiss this alert.
</tw-alert>

<tw-alert
  variant="warning"
  alertStyle="soft"
  [dismissible]="true"
  (dismiss)="onDismiss()">
  <tw-alert-title>Heads up!</tw-alert-title>
  <tw-alert-description>
    This alert can be dismissed.
  </tw-alert-description>
</tw-alert>`;noIconCode=`<tw-alert variant="info" alertStyle="soft" [showIcon]="false">
  This alert doesn't show an icon.
</tw-alert>

<tw-alert variant="success" alertStyle="accent" [showIcon]="false">
  <tw-alert-title>Note</tw-alert-title>
  <tw-alert-description>
    You can hide the icon for a cleaner look.
  </tw-alert-description>
</tw-alert>`;static \u0275fac=function(l){return new(l||o)};static \u0275cmp=c({type:o,selectors:[["app-alert-demo"]],decls:53,vars:9,consts:[["title","Alert","description","Display important messages and notifications to users."],["title","Variants","description","Different alert types for various message contexts.",3,"code"],[1,"space-y-4"],["variant","info"],["variant","success"],["variant","warning"],["variant","danger"],["variant","neutral"],["title","Alert Styles","description","Different visual styles for alerts.",3,"code"],["variant","info","alertStyle","solid"],["variant","info","alertStyle","soft"],["variant","info","alertStyle","outlined"],["variant","info","alertStyle","accent"],["title","With Title and Description","description","Structured alerts with title and description.",3,"code"],["variant","success","alertStyle","soft"],["variant","danger","alertStyle","accent"],["title","Dismissible Alerts","description","Alerts that can be closed by the user.",3,"code"],["variant","info","alertStyle","soft",3,"dismiss","dismissible"],["variant","warning","alertStyle","soft",3,"dismiss","dismissible"],["title","Without Icon","description","Alerts without the default icon.",3,"code"],["variant","info","alertStyle","soft",3,"showIcon"],["variant","success","alertStyle","accent",3,"showIcon"]],template:function(l,n){l&1&&(d(0,"app-page-header",0),e(1,"app-demo-section",1)(2,"div",2)(3,"tw-alert",3),i(4,"This is an informational message."),t(),e(5,"tw-alert",4),i(6,"Your changes have been saved successfully!"),t(),e(7,"tw-alert",5),i(8,"Please review your input before continuing."),t(),e(9,"tw-alert",6),i(10,"An error occurred. Please try again."),t(),e(11,"tw-alert",7),i(12,"This is a neutral notification."),t()()(),e(13,"app-demo-section",8)(14,"div",2)(15,"tw-alert",9),i(16,"Solid style alert"),t(),e(17,"tw-alert",10),i(18,"Soft style alert"),t(),e(19,"tw-alert",11),i(20,"Outlined style alert"),t(),e(21,"tw-alert",12),i(22,"Accent style alert"),t()()(),e(23,"app-demo-section",13)(24,"div",2)(25,"tw-alert",14)(26,"tw-alert-title"),i(27,"Success!"),t(),e(28,"tw-alert-description"),i(29,"Your payment has been processed successfully. You will receive a confirmation email shortly."),t()(),e(30,"tw-alert",15)(31,"tw-alert-title"),i(32,"Error"),t(),e(33,"tw-alert-description"),i(34,"Unable to connect to the server. Please check your internet connection and try again."),t()()()(),e(35,"app-demo-section",16)(36,"div",2)(37,"tw-alert",17),s("dismiss",function(){return n.onDismiss()}),i(38," Click the X button to dismiss this alert. "),t(),e(39,"tw-alert",18),s("dismiss",function(){return n.onDismiss()}),e(40,"tw-alert-title"),i(41,"Heads up!"),t(),e(42,"tw-alert-description"),i(43,"This alert can be dismissed. It will be removed from the page when closed."),t()()()(),e(44,"app-demo-section",19)(45,"div",2)(46,"tw-alert",20),i(47," This alert doesn't show an icon. "),t(),e(48,"tw-alert",21)(49,"tw-alert-title"),i(50,"Note"),t(),e(51,"tw-alert-description"),i(52,"You can hide the icon for a cleaner look when needed."),t()()()()),l&2&&(a(),r("code",n.variantsCode),a(12),r("code",n.stylesCode),a(10),r("code",n.titleDescCode),a(12),r("code",n.dismissibleCode),a(2),r("dismissible",!0),a(2),r("dismissible",!0),a(5),r("code",n.noIconCode),a(2),r("showIcon",!1),a(2),r("showIcon",!1))},dependencies:[m,p,w,u,f,v],encapsulation:2})};export{y as AlertDemoComponent};
