import { Component, signal, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  TwToastContainerComponent,
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
} from '@pegasus-heavy/ngx-tailwindcss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { filter } from 'rxjs/operators';
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
  faChartLine,
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
  faShoppingCart,
  faCamera,
  faUsers,
  faExpand,
  faGripHorizontal,
  faGripVertical,
  faBorderAll,
  faSquarePlus,
  faCropSimple,
  faAlignCenter,
  faArrowsAlt,
  faSun,
  faMoon,
  faCircleHalfStroke,
  faMusic,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ThemeService } from './services/theme.service';

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
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FontAwesomeModule,
    TwToastContainerComponent,
    TwDropdownComponent,
    TwDropdownMenuComponent,
    TwDropdownItemDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private readonly SIDEBAR_SCROLL_KEY = 'ngx-tailwindcss-sidebar-scroll';
  private readonly platformId = inject(PLATFORM_ID);
  private scrollListener: (() => void) | null = null;

  protected mobileMenuOpen = signal(false);
  protected isExamplePage = signal(false);
  protected themeService = inject(ThemeService);

  @ViewChild('sidebarNav') sidebarNav!: ElementRef<HTMLElement>;

  constructor(private router: Router) {
    // Check initial URL on page load
    this.isExamplePage.set(this.router.url.startsWith('/examples/'));

    // Track if we're on an example page during navigation
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isExamplePage.set(event.urlAfterRedirects.startsWith('/examples/'));
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Restore sidebar scroll position
    this.restoreSidebarScroll();

    // Save sidebar scroll position on scroll
    if (this.sidebarNav?.nativeElement) {
      this.scrollListener = this.onSidebarScroll.bind(this);
      this.sidebarNav.nativeElement.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    // Clean up scroll listener
    if (this.scrollListener && this.sidebarNav?.nativeElement) {
      this.sidebarNav.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  private onSidebarScroll(): void {
    if (this.sidebarNav?.nativeElement && isPlatformBrowser(this.platformId)) {
      const scrollTop = this.sidebarNav.nativeElement.scrollTop;
      localStorage.setItem(this.SIDEBAR_SCROLL_KEY, scrollTop.toString());
    }
  }

  private restoreSidebarScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedScroll = localStorage.getItem(this.SIDEBAR_SCROLL_KEY);
    if (savedScroll && this.sidebarNav?.nativeElement) {
      // Use requestAnimationFrame to ensure the DOM is ready
      requestAnimationFrame(() => {
        this.sidebarNav.nativeElement.scrollTop = parseInt(savedScroll, 10);
      });
    }
  }

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
    chart: faChartLine,
    cart: faShoppingCart,
    camera: faCamera,
    users: faUsers,
    sun: faSun,
    moon: faMoon,
    system: faCircleHalfStroke,
    tableRows: faTable,
  };

  protected mainNavItems: NavItem[] = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Components', path: '/components/button', icon: faCubes },
    { label: 'Theming', path: '/theming', icon: faPalette },
    { label: 'Directives', path: '/directives', icon: faWandMagicSparkles },
    { label: 'Accessibility', path: '/accessibility', icon: faUniversalAccess },
    { label: 'i18n', path: '/i18n', icon: faGlobe },
  ];

  // Example pages for dropdown
  protected exampleItems: NavItem[] = [
    { label: 'Admin Dashboard', path: '/examples/admin-dashboard', icon: faChartLine },
    { label: 'E-commerce', path: '/examples/ecommerce', icon: faShoppingCart },
    { label: 'SaaS Landing', path: '/examples/saas-landing', icon: faRocket },
    { label: 'Portfolio', path: '/examples/portfolio', icon: faCamera },
    { label: 'Forum', path: '/examples/forum', icon: faComments },
    { label: 'Social Network', path: '/examples/social-network', icon: faUsers },
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
        { label: 'Multiselect', path: '/components/multiselect', icon: faListAlt },
        { label: 'Slider', path: '/components/slider', icon: faSlidersH },
        { label: 'Rating', path: '/components/rating', icon: faStar },
      ],
    },
    {
      label: 'Layout',
      icon: faLayerGroup,
      items: [
        { label: 'Container', path: '/components/container', icon: faExpand },
        { label: 'Stack', path: '/components/stack', icon: faGripVertical },
        { label: 'Grid', path: '/components/grid', icon: faBorderAll },
        { label: 'Center', path: '/components/center', icon: faAlignCenter },
        { label: 'Spacer', path: '/components/spacer', icon: faArrowsAlt },
        { label: 'Splitter', path: '/components/splitter', icon: faGripHorizontal },
        { label: 'Sticky', path: '/components/sticky', icon: faSquarePlus },
        { label: 'Scroll Area', path: '/components/scroll-area', icon: faWindowMaximize },
        { label: 'Columns', path: '/components/columns', icon: faBorderAll },
        { label: 'Bleed', path: '/components/bleed', icon: faExpand },
        { label: 'Overlay', path: '/components/overlay', icon: faWindowRestore },
        { label: 'Aspect Ratio', path: '/components/aspect-ratio', icon: faCropSimple },
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
        { label: 'DataTables', path: '/components/datatables', icon: faTable },
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
    {
      label: 'Music/Audio',
      icon: faMusic,
      items: [
        { label: 'Music Components', path: '/components/music', icon: faVolumeHigh },
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

  protected getThemeIcon(): IconDefinition {
    const theme = this.themeService.theme();
    if (theme === 'light') return faSun;
    if (theme === 'dark') return faMoon;
    return faCircleHalfStroke;
  }

  protected getThemeLabel(): string {
    const theme = this.themeService.theme();
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  }

  // Explicit methods for theme switching (needed for dropdown portal compatibility)
  protected setLightTheme(): void {
    console.log('Setting light theme');
    this.themeService.setTheme('light');
  }

  protected setDarkTheme(): void {
    console.log('Setting dark theme');
    this.themeService.setTheme('dark');
  }

  protected setSystemTheme(): void {
    console.log('Setting system theme');
    this.themeService.setTheme('system');
  }
}
