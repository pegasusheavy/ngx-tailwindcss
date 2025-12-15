import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TwToastContainerComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faCubes,
  faWandMagicSparkles,
  faSquare,
  faIdCard,
  faKeyboard,
  faTag,
  faBell,
  faWindowMaximize,
  faCaretDown,
  faFolderOpen,
  faBars,
  faXmark,
  faArrowRight,
  faCode,
  faRocket,
  faPalette,
  faGear,
  faHeart,
  faCheckSquare,
  faToggleOn,
  faDotCircle,
  faListAlt,
  faSlidersH,
  faStar,
  faUserCircle,
  faChartBar,
  faSpinner,
  faSquareFull,
  faMapSigns,
  faFileAlt,
  faMinus,
  faClipboardList,
  faHistory,
  faCommentDots,
  faWindowRestore,
  faBarsStaggered,
  faTable,
  faCodeBranch,
  faImage,
  faLayerGroup,
  faEdit,
  faDatabase,
  faCompass,
  faComments,
  faPuzzlePiece,
  faUniversalAccess,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface NavItem {
  label: string;
  path: string;
  icon?: IconDefinition;
}

interface NavCategory {
  label: string;
  icon: IconDefinition;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FontAwesomeModule, TwToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected mobileMenuOpen = signal(false);

  // Icons for easy access in template
  protected icons = {
    home: faHome,
    cubes: faCubes,
    wand: faWandMagicSparkles,
    button: faSquare,
    card: faIdCard,
    input: faKeyboard,
    badge: faTag,
    alert: faBell,
    modal: faWindowMaximize,
    dropdown: faCaretDown,
    tabs: faFolderOpen,
    menu: faBars,
    close: faXmark,
    arrow: faArrowRight,
    code: faCode,
    rocket: faRocket,
    palette: faPalette,
    gear: faGear,
    github: faGithub,
    heart: faHeart,
    edit: faEdit,
    database: faDatabase,
    compass: faCompass,
    comments: faComments,
    puzzle: faPuzzlePiece,
    layer: faLayerGroup,
    accessibility: faUniversalAccess,
    globe: faGlobe,
  };

  protected mainNavItems: NavItem[] = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Components', path: '/components/button', icon: faCubes },
    { label: 'Directives', path: '/directives', icon: faWandMagicSparkles },
    { label: 'Accessibility', path: '/accessibility', icon: faUniversalAccess },
    { label: 'i18n', path: '/i18n', icon: faGlobe },
  ];

  // Organized component categories for sidebar
  protected componentCategories: NavCategory[] = [
    {
      label: 'Form',
      icon: faEdit,
      items: [
        { label: 'Button', path: '/components/button', icon: faSquare },
        { label: 'Input', path: '/components/input', icon: faKeyboard },
        { label: 'Checkbox', path: '/components/checkbox', icon: faCheckSquare },
        { label: 'Switch', path: '/components/switch', icon: faToggleOn },
        { label: 'Radio', path: '/components/radio', icon: faDotCircle },
        { label: 'Select', path: '/components/select', icon: faListAlt },
        { label: 'Slider', path: '/components/slider', icon: faSlidersH },
        { label: 'Rating', path: '/components/rating', icon: faStar },
      ],
    },
    {
      label: 'Layout',
      icon: faLayerGroup,
      items: [
        { label: 'Card', path: '/components/card', icon: faIdCard },
        { label: 'Accordion', path: '/components/accordion', icon: faBars },
        { label: 'Tabs', path: '/components/tabs', icon: faFolderOpen },
        { label: 'Divider', path: '/components/divider', icon: faMinus },
      ],
    },
    {
      label: 'Data Display',
      icon: faDatabase,
      items: [
        { label: 'Badge', path: '/components/badge', icon: faTag },
        { label: 'Avatar', path: '/components/avatar', icon: faUserCircle },
        { label: 'Chip', path: '/components/chip', icon: faTag },
        { label: 'Table', path: '/components/table', icon: faTable },
        { label: 'Tree', path: '/components/tree', icon: faCodeBranch },
        { label: 'Timeline', path: '/components/timeline', icon: faHistory },
      ],
    },
    {
      label: 'Navigation',
      icon: faCompass,
      items: [
        { label: 'Menu', path: '/components/menu', icon: faBars },
        { label: 'Breadcrumb', path: '/components/breadcrumb', icon: faMapSigns },
        { label: 'Pagination', path: '/components/pagination', icon: faFileAlt },
        { label: 'Steps', path: '/components/steps', icon: faClipboardList },
      ],
    },
    {
      label: 'Feedback',
      icon: faComments,
      items: [
        { label: 'Alert', path: '/components/alert', icon: faBell },
        { label: 'Toast', path: '/components/toast', icon: faCommentDots },
        { label: 'Progress', path: '/components/progress', icon: faChartBar },
        { label: 'Spinner', path: '/components/spinner', icon: faSpinner },
        { label: 'Skeleton', path: '/components/skeleton', icon: faSquareFull },
      ],
    },
    {
      label: 'Overlay',
      icon: faWindowMaximize,
      items: [
        { label: 'Modal', path: '/components/modal', icon: faWindowMaximize },
        { label: 'Dropdown', path: '/components/dropdown', icon: faCaretDown },
        { label: 'Popover', path: '/components/popover', icon: faWindowRestore },
        { label: 'Sidebar', path: '/components/sidebar', icon: faBarsStaggered },
      ],
    },
    {
      label: 'Media',
      icon: faImage,
      items: [
        { label: 'Image', path: '/components/image', icon: faImage },
      ],
    },
  ];

  // Flat list for mobile menu
  protected get allComponentNavItems(): NavItem[] {
    return this.componentCategories.flatMap(cat => cat.items);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
