import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'components',
    children: [
      // Form Components
      {
        path: 'button',
        loadComponent: () => import('./pages/components/button/button-demo.component').then(m => m.ButtonDemoComponent),
      },
      {
        path: 'input',
        loadComponent: () => import('./pages/components/input/input-demo.component').then(m => m.InputDemoComponent),
      },
      {
        path: 'checkbox',
        loadComponent: () => import('./pages/components/checkbox/checkbox-demo.component').then(m => m.CheckboxDemoComponent),
      },
      {
        path: 'radio',
        loadComponent: () => import('./pages/components/radio/radio-demo.component').then(m => m.RadioDemoComponent),
      },
      {
        path: 'switch',
        loadComponent: () => import('./pages/components/switch/switch-demo.component').then(m => m.SwitchDemoComponent),
      },
      {
        path: 'select',
        loadComponent: () => import('./pages/components/select/select-demo.component').then(m => m.SelectDemoComponent),
      },
      {
        path: 'multiselect',
        loadComponent: () => import('./pages/components/multiselect/multiselect-demo.component').then(m => m.MultiselectDemoComponent),
      },
      {
        path: 'slider',
        loadComponent: () => import('./pages/components/slider/slider-demo.component').then(m => m.SliderDemoComponent),
      },
      {
        path: 'rating',
        loadComponent: () => import('./pages/components/rating/rating-demo.component').then(m => m.RatingDemoComponent),
      },

      // Data Display
      {
        path: 'badge',
        loadComponent: () => import('./pages/components/badge/badge-demo.component').then(m => m.BadgeDemoComponent),
      },
      {
        path: 'chip',
        loadComponent: () => import('./pages/components/chip/chip-demo.component').then(m => m.ChipDemoComponent),
      },
      {
        path: 'avatar',
        loadComponent: () => import('./pages/components/avatar/avatar-demo.component').then(m => m.AvatarDemoComponent),
      },
      {
        path: 'table',
        loadComponent: () => import('./pages/components/table/table-demo.component').then(m => m.TableDemoComponent),
      },
      {
        path: 'datatables',
        loadComponent: () => import('./pages/components/datatables/datatables-demo.component').then(m => m.DatatablesDemoComponent),
      },
      {
        path: 'tree',
        loadComponent: () => import('./pages/components/tree/tree-demo.component').then(m => m.TreeDemoComponent),
      },
      {
        path: 'timeline',
        loadComponent: () => import('./pages/components/timeline/timeline-demo.component').then(m => m.TimelineDemoComponent),
      },
      {
        path: 'image',
        loadComponent: () => import('./pages/components/image/image-demo.component').then(m => m.ImageDemoComponent),
      },

      // Music/Audio
      {
        path: 'music',
        loadComponent: () => import('./pages/components/music/music-demo.component').then(m => m.MusicDemoComponent),
      },

      // Feedback
      {
        path: 'alert',
        loadComponent: () => import('./pages/components/alert/alert-demo.component').then(m => m.AlertDemoComponent),
      },
      {
        path: 'toast',
        loadComponent: () => import('./pages/components/toast/toast-demo.component').then(m => m.ToastDemoComponent),
      },
      {
        path: 'progress',
        loadComponent: () => import('./pages/components/progress/progress-demo.component').then(m => m.ProgressDemoComponent),
      },
      {
        path: 'spinner',
        loadComponent: () => import('./pages/components/spinner/spinner-demo.component').then(m => m.SpinnerDemoComponent),
      },
      {
        path: 'skeleton',
        loadComponent: () => import('./pages/components/skeleton/skeleton-demo.component').then(m => m.SkeletonDemoComponent),
      },

      // Containers
      {
        path: 'card',
        loadComponent: () => import('./pages/components/card/card-demo.component').then(m => m.CardDemoComponent),
      },
      {
        path: 'modal',
        loadComponent: () => import('./pages/components/modal/modal-demo.component').then(m => m.ModalDemoComponent),
      },
      {
        path: 'sidebar',
        loadComponent: () => import('./pages/components/sidebar/sidebar-demo.component').then(m => m.SidebarDemoComponent),
      },
      {
        path: 'accordion',
        loadComponent: () => import('./pages/components/accordion/accordion-demo.component').then(m => m.AccordionDemoComponent),
      },
      {
        path: 'tabs',
        loadComponent: () => import('./pages/components/tabs/tabs-demo.component').then(m => m.TabsDemoComponent),
      },

      // Navigation
      {
        path: 'dropdown',
        loadComponent: () => import('./pages/components/dropdown/dropdown-demo.component').then(m => m.DropdownDemoComponent),
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/components/menu/menu-demo.component').then(m => m.MenuDemoComponent),
      },
      {
        path: 'breadcrumb',
        loadComponent: () => import('./pages/components/breadcrumb/breadcrumb-demo.component').then(m => m.BreadcrumbDemoComponent),
      },
      {
        path: 'pagination',
        loadComponent: () => import('./pages/components/pagination/pagination-demo.component').then(m => m.PaginationDemoComponent),
      },
      {
        path: 'steps',
        loadComponent: () => import('./pages/components/steps/steps-demo.component').then(m => m.StepsDemoComponent),
      },

      // Overlays
      {
        path: 'popover',
        loadComponent: () => import('./pages/components/popover/popover-demo.component').then(m => m.PopoverDemoComponent),
      },

      // Layout
      {
        path: 'divider',
        loadComponent: () => import('./pages/components/divider/divider-demo.component').then(m => m.DividerDemoComponent),
      },
      {
        path: 'container',
        loadComponent: () => import('./pages/components/container/container-demo.component').then(m => m.ContainerDemoComponent),
      },
      {
        path: 'stack',
        loadComponent: () => import('./pages/components/stack/stack-demo.component').then(m => m.StackDemoComponent),
      },
      {
        path: 'grid',
        loadComponent: () => import('./pages/components/grid/grid-demo.component').then(m => m.GridDemoComponent),
      },
      {
        path: 'aspect-ratio',
        loadComponent: () => import('./pages/components/aspect-ratio/aspect-ratio-demo.component').then(m => m.AspectRatioDemoComponent),
      },
      {
        path: 'center',
        loadComponent: () => import('./pages/components/center/center-demo.component').then(m => m.CenterDemoComponent),
      },
      {
        path: 'spacer',
        loadComponent: () => import('./pages/components/spacer/spacer-demo.component').then(m => m.SpacerDemoComponent),
      },
      {
        path: 'splitter',
        loadComponent: () => import('./pages/components/splitter/splitter-demo.component').then(m => m.SplitterDemoComponent),
      },
      {
        path: 'sticky',
        loadComponent: () => import('./pages/components/sticky/sticky-demo.component').then(m => m.StickyDemoComponent),
      },
      {
        path: 'scroll-area',
        loadComponent: () => import('./pages/components/scroll-area/scroll-area-demo.component').then(m => m.ScrollAreaDemoComponent),
      },
      {
        path: 'columns',
        loadComponent: () => import('./pages/components/columns/columns-demo.component').then(m => m.ColumnsDemoComponent),
      },
      {
        path: 'bleed',
        loadComponent: () => import('./pages/components/bleed/bleed-demo.component').then(m => m.BleedDemoComponent),
      },
      {
        path: 'overlay',
        loadComponent: () => import('./pages/components/overlay/overlay-demo.component').then(m => m.OverlayDemoComponent),
      },
    ],
  },
  {
    path: 'directives',
    loadComponent: () => import('./pages/directives/directives-demo.component').then(m => m.DirectivesDemoComponent),
  },
  {
    path: 'accessibility',
    loadComponent: () => import('./pages/accessibility/accessibility-demo.component').then(m => m.AccessibilityDemoComponent),
  },
  {
    path: 'i18n',
    loadComponent: () => import('./pages/i18n/i18n-demo.component').then(m => m.I18nDemoComponent),
  },
  {
    path: 'theming',
    loadComponent: () => import('./pages/theming/theming-demo.component').then(m => m.ThemingDemoComponent),
  },
  {
    path: 'examples',
    children: [
      {
        path: 'saas-landing',
        loadComponent: () => import('./pages/examples/saas-landing.component').then(m => m.SaasLandingComponent),
      },
      {
        path: 'forum',
        loadComponent: () => import('./pages/examples/forum.component').then(m => m.ForumComponent),
      },
      {
        path: 'social-network',
        loadComponent: () => import('./pages/examples/social-network.component').then(m => m.SocialNetworkComponent),
      },
      {
        path: 'admin-dashboard',
        loadComponent: () => import('./pages/examples/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'ecommerce',
        loadComponent: () => import('./pages/examples/ecommerce.component').then(m => m.EcommerceComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./pages/examples/portfolio.component').then(m => m.PortfolioComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
