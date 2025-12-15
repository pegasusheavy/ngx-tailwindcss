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
    path: '**',
    redirectTo: '',
  },
];
