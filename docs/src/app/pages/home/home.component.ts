import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faPalette,
  faWater,
  faUniversalAccess,
  faBoxOpen,
  faWrench,
  faBolt,
  faSquare,
  faIdCard,
  faKeyboard,
  faTag,
  faBell,
  faWindowMaximize,
  faCaretSquareDown,
  faFolderOpen,
  faRocket,
  faArrowRight,
  faTerminal,
  faCheckSquare,
  faDotCircle,
  faToggleOn,
  faListAlt,
  faSliders,
  faStar,
  faCircle,
  faTable,
  faStream,
  faImage,
  faSpinner,
  faBars,
  faEllipsisH,
  faChevronRight,
  faStepForward,
  faCommentDots,
  faClone,
  faMinus,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  TwButtonComponent,
  TwCardComponent,
  TwCardBodyDirective,
  TwBadgeComponent,
} from '@pegasusheavy/ngx-tailwindcss';

interface Feature {
  icon: IconDefinition;
  iconColor: string;
  title: string;
  description: string;
}

interface ComponentItem {
  name: string;
  icon: IconDefinition;
  iconColor: string;
  path: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule,
    TwButtonComponent,
    TwCardComponent,
    TwCardBodyDirective,
    TwBadgeComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  // Icons
  protected icons = {
    github: faGithub,
    rocket: faRocket,
    arrow: faArrowRight,
    terminal: faTerminal,
  };

  features: Feature[] = [
    {
      icon: faPalette,
      iconColor: 'text-pink-500',
      title: 'Fully Customizable',
      description: 'Override any styling through class props or global configuration. Your design system, your way.',
    },
    {
      icon: faWater,
      iconColor: 'text-cyan-500',
      title: 'Tailwind CSS 4+ Ready',
      description: 'Built for the latest Tailwind with CSS-first configuration and modern features.',
    },
    {
      icon: faUniversalAccess,
      iconColor: 'text-blue-500',
      title: 'Accessible',
      description: 'WCAG compliant with proper ARIA attributes, keyboard navigation, and focus management.',
    },
    {
      icon: faBoxOpen,
      iconColor: 'text-amber-500',
      title: 'Tree-Shakeable',
      description: 'Import only what you need. Unused components are automatically removed from your bundle.',
    },
    {
      icon: faWrench,
      iconColor: 'text-slate-500',
      title: 'No Bundled CSS',
      description: "Components use your Tailwind config. No CSS conflicts, no specificity wars.",
    },
    {
      icon: faBolt,
      iconColor: 'text-yellow-500',
      title: 'Standalone Components',
      description: 'No NgModule required. Works seamlessly with Angular 19+ and zoneless change detection.',
    },
  ];

  components: ComponentItem[] = [
    { name: 'Accordion', icon: faLayerGroup, iconColor: 'text-amber-600', path: '/components/accordion' },
    { name: 'Alert', icon: faBell, iconColor: 'text-amber-500', path: '/components/alert' },
    { name: 'Avatar', icon: faCircle, iconColor: 'text-indigo-500', path: '/components/avatar' },
    { name: 'Badge', icon: faTag, iconColor: 'text-rose-500', path: '/components/badge' },
    { name: 'Breadcrumb', icon: faChevronRight, iconColor: 'text-slate-500', path: '/components/breadcrumb' },
    { name: 'Button', icon: faSquare, iconColor: 'text-blue-500', path: '/components/button' },
    { name: 'Card', icon: faIdCard, iconColor: 'text-purple-500', path: '/components/card' },
    { name: 'Checkbox', icon: faCheckSquare, iconColor: 'text-emerald-500', path: '/components/checkbox' },
    { name: 'Chip', icon: faCircle, iconColor: 'text-pink-500', path: '/components/chip' },
    { name: 'Divider', icon: faMinus, iconColor: 'text-gray-400', path: '/components/divider' },
    { name: 'Dropdown', icon: faCaretSquareDown, iconColor: 'text-cyan-500', path: '/components/dropdown' },
    { name: 'Image', icon: faImage, iconColor: 'text-cyan-500', path: '/components/image' },
    { name: 'Input', icon: faKeyboard, iconColor: 'text-green-500', path: '/components/input' },
    { name: 'Menu', icon: faEllipsisH, iconColor: 'text-gray-600', path: '/components/menu' },
    { name: 'Modal', icon: faWindowMaximize, iconColor: 'text-indigo-500', path: '/components/modal' },
    { name: 'Pagination', icon: faEllipsisH, iconColor: 'text-blue-600', path: '/components/pagination' },
    { name: 'Popover', icon: faCommentDots, iconColor: 'text-violet-500', path: '/components/popover' },
    { name: 'Progress', icon: faBars, iconColor: 'text-blue-500', path: '/components/progress' },
    { name: 'Radio', icon: faDotCircle, iconColor: 'text-violet-500', path: '/components/radio' },
    { name: 'Rating', icon: faStar, iconColor: 'text-yellow-500', path: '/components/rating' },
    { name: 'Select', icon: faListAlt, iconColor: 'text-sky-500', path: '/components/select' },
    { name: 'Sidebar', icon: faLayerGroup, iconColor: 'text-slate-600', path: '/components/sidebar' },
    { name: 'Skeleton', icon: faClone, iconColor: 'text-slate-400', path: '/components/skeleton' },
    { name: 'Slider', icon: faSliders, iconColor: 'text-orange-500', path: '/components/slider' },
    { name: 'Spinner', icon: faSpinner, iconColor: 'text-gray-500', path: '/components/spinner' },
    { name: 'Steps', icon: faStepForward, iconColor: 'text-emerald-600', path: '/components/steps' },
    { name: 'Switch', icon: faToggleOn, iconColor: 'text-teal-500', path: '/components/switch' },
    { name: 'Table', icon: faTable, iconColor: 'text-slate-500', path: '/components/table' },
    { name: 'Tabs', icon: faFolderOpen, iconColor: 'text-teal-500', path: '/components/tabs' },
    { name: 'Timeline', icon: faStream, iconColor: 'text-purple-500', path: '/components/timeline' },
    { name: 'Toast', icon: faCommentDots, iconColor: 'text-green-500', path: '/components/toast' },
    { name: 'Tree', icon: faStream, iconColor: 'text-lime-500', path: '/components/tree' },
  ];

  installCode = `# Install the library
pnpm add @pegasusheavy/ngx-tailwindcss

# Configure Tailwind to scan the library
# In your styles.css or styles.scss:
@import "tailwindcss";
@source "../node_modules/@pegasusheavy/ngx-tailwindcss/**/*.mjs";`;
}
