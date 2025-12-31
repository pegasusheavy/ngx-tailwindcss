import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  TwButtonComponent,
  TwCardComponent,
  TwCardBodyDirective,
  TwBadgeComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { IconComponent, IconName } from '../../shared/icon.component';

interface Feature {
  icon: IconName;
  iconColor: string;
  title: string;
  description: string;
}

interface ComponentItem {
  name: string;
  icon: IconName;
  iconColor: string;
  path: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    TwButtonComponent,
    TwCardComponent,
    TwCardBodyDirective,
    TwBadgeComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  features: Feature[] = [
    {
      icon: 'palette',
      iconColor: 'text-pink-500',
      title: 'Fully Customizable',
      description: 'Override any styling through class props or global configuration. Your design system, your way.',
    },
    {
      icon: 'globe',
      iconColor: 'text-cyan-500',
      title: 'Tailwind CSS 4+ Ready',
      description: 'Built for the latest Tailwind with CSS-first configuration and modern features.',
    },
    {
      icon: 'accessibility',
      iconColor: 'text-blue-500',
      title: 'Accessible',
      description: 'WCAG compliant with proper ARIA attributes, keyboard navigation, and focus management.',
    },
    {
      icon: 'cubes',
      iconColor: 'text-amber-500',
      title: 'Tree-Shakeable',
      description: 'Import only what you need. Unused components are automatically removed from your bundle.',
    },
    {
      icon: 'gear',
      iconColor: 'text-slate-500',
      title: 'No Bundled CSS',
      description: "Components use your Tailwind config. No CSS conflicts, no specificity wars.",
    },
    {
      icon: 'rocket',
      iconColor: 'text-yellow-500',
      title: 'Standalone Components',
      description: 'No NgModule required. Works seamlessly with Angular 19+ and zoneless change detection.',
    },
  ];

  components: ComponentItem[] = [
    { name: 'Accordion', icon: 'layer', iconColor: 'text-amber-600', path: '/components/accordion' },
    { name: 'Alert', icon: 'bell', iconColor: 'text-amber-500', path: '/components/alert' },
    { name: 'Avatar', icon: 'user', iconColor: 'text-indigo-500', path: '/components/avatar' },
    { name: 'Badge', icon: 'tag', iconColor: 'text-rose-500', path: '/components/badge' },
    { name: 'Breadcrumb', icon: 'chevron-right', iconColor: 'text-slate-500', path: '/components/breadcrumb' },
    { name: 'Button', icon: 'square', iconColor: 'text-blue-500', path: '/components/button' },
    { name: 'Card', icon: 'card', iconColor: 'text-purple-500', path: '/components/card' },
    { name: 'Checkbox', icon: 'check-square', iconColor: 'text-emerald-500', path: '/components/checkbox' },
    { name: 'Chip', icon: 'tag', iconColor: 'text-pink-500', path: '/components/chip' },
    { name: 'Divider', icon: 'minus', iconColor: 'text-gray-400', path: '/components/divider' },
    { name: 'Dropdown', icon: 'caret-down', iconColor: 'text-cyan-500', path: '/components/dropdown' },
    { name: 'Image', icon: 'image', iconColor: 'text-cyan-500', path: '/components/image' },
    { name: 'Input', icon: 'keyboard', iconColor: 'text-green-500', path: '/components/input' },
    { name: 'Menu', icon: 'more', iconColor: 'text-gray-600', path: '/components/menu' },
    { name: 'Modal', icon: 'window', iconColor: 'text-indigo-500', path: '/components/modal' },
    { name: 'Pagination', icon: 'more', iconColor: 'text-blue-600', path: '/components/pagination' },
    { name: 'Popover', icon: 'comment', iconColor: 'text-violet-500', path: '/components/popover' },
    { name: 'Progress', icon: 'chart', iconColor: 'text-blue-500', path: '/components/progress' },
    { name: 'Radio', icon: 'radio', iconColor: 'text-violet-500', path: '/components/radio' },
    { name: 'Rating', icon: 'star', iconColor: 'text-yellow-500', path: '/components/rating' },
    { name: 'Select', icon: 'list', iconColor: 'text-sky-500', path: '/components/select' },
    { name: 'Sidebar', icon: 'layer', iconColor: 'text-slate-600', path: '/components/sidebar' },
    { name: 'Skeleton', icon: 'square', iconColor: 'text-slate-400', path: '/components/skeleton' },
    { name: 'Slider', icon: 'slider', iconColor: 'text-orange-500', path: '/components/slider' },
    { name: 'Spinner', icon: 'spinner', iconColor: 'text-gray-500', path: '/components/spinner' },
    { name: 'Steps', icon: 'arrow-right', iconColor: 'text-emerald-600', path: '/components/steps' },
    { name: 'Switch', icon: 'toggle', iconColor: 'text-teal-500', path: '/components/switch' },
    { name: 'Table', icon: 'table', iconColor: 'text-slate-500', path: '/components/table' },
    { name: 'Tabs', icon: 'folder', iconColor: 'text-teal-500', path: '/components/tabs' },
    { name: 'Timeline', icon: 'history', iconColor: 'text-purple-500', path: '/components/timeline' },
    { name: 'Toast', icon: 'comment', iconColor: 'text-green-500', path: '/components/toast' },
    { name: 'Tree', icon: 'code-branch', iconColor: 'text-lime-500', path: '/components/tree' },
  ];

  installCode = `# Install the library
pnpm add @pegasusheavy/ngx-tailwindcss

# Configure Tailwind to scan the library
# In your styles.css or styles.scss:
@import "tailwindcss";
@source "../node_modules/@pegasusheavy/ngx-tailwindcss/**/*.mjs";`;
}
