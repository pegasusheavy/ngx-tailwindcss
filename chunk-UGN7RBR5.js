import{a as w,b as S}from"./chunk-3KJZNRY2.js";import{Fa as r,Fc as f,Ga as t,Ha as o,Ia as d,Ma as n,Q as m,Ua as e,Vb as v,ha as a,ob as u,ta as p}from"./chunk-7UE6IFUK.js";var h=class l{toastService=m(f);showSuccess(){this.toastService.success("Operation completed successfully!")}showError(){this.toastService.error("An error occurred. Please try again.")}showWarning(){this.toastService.warning("Please review your input.")}showInfo(){this.toastService.info("New updates are available.")}basicCode=`// Inject the service
private toastService = inject(TwToastService);

// Show toasts
this.toastService.success('Operation completed!');
this.toastService.error('An error occurred.');
this.toastService.warning('Please review.');
this.toastService.info('New updates available.');`;positionCode=`this.toastService.show({
  message: 'Toast message',
  variant: 'success',
  position: 'top-right', // 'top-left', 'top-center', 'bottom-right', etc.
});`;optionsCode=`this.toastService.show({
  message: 'Custom toast',
  variant: 'info',
  duration: 5000, // 5 seconds
  dismissible: true,
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked'),
  },
});`;static \u0275fac=function(s){return new(s||l)};static \u0275cmp=p({type:l,selectors:[["app-toast-demo"]],decls:35,vars:3,consts:[["title","Toast","description","Toast notification component for displaying brief messages."],[1,"space-y-8"],["title","Basic Usage",3,"code"],[1,"flex","flex-wrap","gap-3"],["variant","success",3,"click"],["variant","danger",3,"click"],["variant","warning",3,"click"],["variant","info",3,"click"],["title","Positions",3,"code"],[1,"text-slate-600","mb-4"],[1,"text-sm","bg-slate-100","px-2","py-1","rounded"],["title","Options",3,"code"],[1,"text-slate-600"]],template:function(s,i){s&1&&(d(0,"app-page-header",0),t(1,"div",1)(2,"app-demo-section",2)(3,"div",3)(4,"tw-button",4),n("click",function(){return i.showSuccess()}),e(5,"Show Success"),o(),t(6,"tw-button",5),n("click",function(){return i.showError()}),e(7,"Show Error"),o(),t(8,"tw-button",6),n("click",function(){return i.showWarning()}),e(9,"Show Warning"),o(),t(10,"tw-button",7),n("click",function(){return i.showInfo()}),e(11,"Show Info"),o()()(),t(12,"app-demo-section",8)(13,"p",9),e(14," Toasts can be positioned in different corners of the screen: "),t(15,"code",10),e(16,"top-left"),o(),e(17,", "),t(18,"code",10),e(19,"top-center"),o(),e(20,", "),t(21,"code",10),e(22,"top-right"),o(),e(23,", "),t(24,"code",10),e(25,"bottom-left"),o(),e(26,", "),t(27,"code",10),e(28,"bottom-center"),o(),e(29,", "),t(30,"code",10),e(31,"bottom-right"),o()()(),t(32,"app-demo-section",11)(33,"p",12),e(34," Toasts support various options including custom duration, dismissible toggle, and action buttons. "),o()()()),s&2&&(a(2),r("code",i.basicCode),a(10),r("code",i.positionCode),a(20),r("code",i.optionsCode))},dependencies:[u,v,w,S],encapsulation:2})};export{h as ToastDemoComponent};
