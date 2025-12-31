import{a as S,b as k}from"./chunk-QJALDVBT.js";import"./chunk-4ZZRKSRB.js";import{W as b,X as M,gb as C,h as g,hb as y,ib as h,jb as D,kb as v,lb as T}from"./chunk-5LPP6ASA.js";import{Ba as r,Jb as n,Pb as s,Qb as c,Ra as _,Rb as p,hb as d,ib as t,ja as m,jb as o,kb as w,tb as l}from"./chunk-2G56FVSW.js";var E=class f{basicModal=m(!1);formModal=m(!1);confirmDialog=m(!1);largeModal=m(!1);basicCode=`// In your component
isOpen = signal(false);

// In your template
<tw-button variant="primary" (click)="isOpen.set(true)">Open Modal</tw-button>

<tw-modal [(open)]="isOpen" size="md">
  <tw-modal-header>
    <tw-modal-title>Modal Title</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <p>This is the modal content.</p>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="isOpen.set(false)">Cancel</tw-button>
    <tw-button variant="primary" (click)="isOpen.set(false)">Save</tw-button>
  </tw-modal-footer>
</tw-modal>`;formCode=`<tw-modal [(open)]="formModal" size="md">
  <tw-modal-header>
    <tw-modal-title>Edit Profile</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <div class="space-y-4">
      <tw-input label="Full Name" placeholder="Enter your name"></tw-input>
      <tw-input label="Email" type="email" placeholder="you@example.com"></tw-input>
      <tw-input label="Username" placeholder="@username"></tw-input>
    </div>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="formModal.set(false)">Cancel</tw-button>
    <tw-button variant="primary" (click)="formModal.set(false)">Save</tw-button>
  </tw-modal-footer>
</tw-modal>`;confirmCode=`<tw-confirm-dialog
  [(open)]="confirmDialog"
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  (confirm)="onConfirm()"
  (cancel)="onCancel()">
</tw-confirm-dialog>`;largeCode=`<tw-modal [(open)]="largeModal" size="xl">
  <tw-modal-header>
    <tw-modal-title>Terms and Conditions</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    <div class="prose prose-slate max-w-none">
      <p>Lorem ipsum dolor sit amet...</p>
    </div>
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="largeModal.set(false)">Decline</tw-button>
    <tw-button variant="primary" (click)="largeModal.set(false)">Accept</tw-button>
  </tw-modal-footer>
</tw-modal>

<!-- Available sizes: sm, md, lg, xl, full -->`;static \u0275fac=function(u){return new(u||f)};static \u0275cmp=_({type:f,selectors:[["app-modal-demo"]],decls:57,vars:8,consts:[["title","Modal","description","Dialog overlays for important content that requires user attention."],["title","Basic Modal","description","Simple modal with header, body, and footer.",3,"code"],["variant","primary",3,"click"],["size","md",3,"openChange","open"],[1,"text-slate-600"],["variant","ghost",3,"click"],["title","Modal with Form","description","Modal containing a form for user input.",3,"code"],[1,"space-y-4"],["label","Full Name","placeholder","Enter your name"],["label","Email","type","email","placeholder","you@example.com"],["label","Username","placeholder","@username"],["title","Confirmation Dialog","description","Pre-built confirmation dialog for common actions.",3,"code"],["variant","danger",3,"click"],["title","Delete Item","message","Are you sure you want to delete this item? This action cannot be undone.","confirmText","Delete","cancelText","Cancel","variant","danger",3,"openChange","confirm","cancel","open"],["title","Large Modal","description","Modal with larger size for more content.",3,"code"],["size","xl",3,"openChange","open"],[1,"prose","prose-slate","max-w-none"],[1,"text-slate-600","mt-4"]],template:function(u,e){u&1&&(w(0,"app-page-header",0),t(1,"app-demo-section",1)(2,"tw-button",2),l("click",function(){return e.basicModal.set(!0)}),n(3,"Open Modal"),o(),t(4,"tw-modal",3),p("openChange",function(i){return c(e.basicModal,i)||(e.basicModal=i),i}),t(5,"tw-modal-header")(6,"tw-modal-title"),n(7,"Modal Title"),o()(),t(8,"tw-modal-body")(9,"p",4),n(10," This is the modal content. You can put any content here, including text, images, forms, or other components. "),o()(),t(11,"tw-modal-footer")(12,"tw-button",5),l("click",function(){return e.basicModal.set(!1)}),n(13,"Cancel"),o(),t(14,"tw-button",2),l("click",function(){return e.basicModal.set(!1)}),n(15,"Save Changes"),o()()()(),t(16,"app-demo-section",6)(17,"tw-button",2),l("click",function(){return e.formModal.set(!0)}),n(18,"Edit Profile"),o(),t(19,"tw-modal",3),p("openChange",function(i){return c(e.formModal,i)||(e.formModal=i),i}),t(20,"tw-modal-header")(21,"tw-modal-title"),n(22,"Edit Profile"),o()(),t(23,"tw-modal-body")(24,"div",7),w(25,"tw-input",8)(26,"tw-input",9)(27,"tw-input",10),o()(),t(28,"tw-modal-footer")(29,"tw-button",5),l("click",function(){return e.formModal.set(!1)}),n(30,"Cancel"),o(),t(31,"tw-button",2),l("click",function(){return e.formModal.set(!1)}),n(32,"Save Profile"),o()()()(),t(33,"app-demo-section",11)(34,"tw-button",12),l("click",function(){return e.confirmDialog.set(!0)}),n(35,"Delete Item"),o(),t(36,"tw-confirm-dialog",13),p("openChange",function(i){return c(e.confirmDialog,i)||(e.confirmDialog=i),i}),l("confirm",function(){return e.confirmDialog.set(!1)})("cancel",function(){return e.confirmDialog.set(!1)}),o()(),t(37,"app-demo-section",14)(38,"tw-button",2),l("click",function(){return e.largeModal.set(!0)}),n(39,"Open Large Modal"),o(),t(40,"tw-modal",15),p("openChange",function(i){return c(e.largeModal,i)||(e.largeModal=i),i}),t(41,"tw-modal-header")(42,"tw-modal-title"),n(43,"Terms and Conditions"),o()(),t(44,"tw-modal-body")(45,"div",16)(46,"p",4),n(47," Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. "),o(),t(48,"p",17),n(49," Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "),o(),t(50,"p",17),n(51," Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. "),o()()(),t(52,"tw-modal-footer")(53,"tw-button",5),l("click",function(){return e.largeModal.set(!1)}),n(54,"Decline"),o(),t(55,"tw-button",2),l("click",function(){return e.largeModal.set(!1)}),n(56,"Accept"),o()()()()),u&2&&(r(),d("code",e.basicCode),r(3),s("open",e.basicModal),r(12),d("code",e.formCode),r(3),s("open",e.formModal),r(14),d("code",e.confirmCode),r(3),s("open",e.confirmDialog),r(),d("code",e.largeCode),r(3),s("open",e.largeModal))},dependencies:[g,C,y,h,D,v,T,b,M,S,k],encapsulation:2})};export{E as ModalDemoComponent};
