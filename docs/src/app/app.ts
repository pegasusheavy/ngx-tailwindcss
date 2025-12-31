import { Component, signal, computed, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  TwToastContainerComponent,
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
} from '@pegasusheavy/ngx-tailwindcss';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  faPenToSquare,
  faDatabase,
  faCompass,
  faComments,
  faPuzzlePiece,
  faLayerGroup,
  faUniversalAccess,
  faGlobe,
  faChartLine,
  faShoppingCart,
  faCamera,
  faUsers,
  faSun,
  faMoon,
  faDesktop,
  faTable,
  faSquareCheck,
  faToggleOn,
  faCircleDot,
  faList,
  faSliders,
  faStar,
  faUser,
  faSpinner,
  faSquareFull,
  faMapSigns,
  faFile,
  faMinus,
  faClipboardList,
  faHistory,
  faComment,
  faWindowRestore,
  faBarsStaggered,
  faCodeBranch,
  faImage,
  faExpand,
  faGripVertical,
  faGripHorizontal,
  faBorderAll,
  faPlus,
  faCropSimple,
  faAlignCenter,
  faArrowsUpDownLeftRight,
  faMusic,
  faVolumeHigh,
  faChevronDown,
  faChevronRight,
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
  private readonly router = inject(Router);
  private scrollListener: (() => void) | null = null;

  protected mobileMenuOpen = signal(false);
  protected currentUrl = signal('/');
  protected isExamplePage = computed(() => this.currentUrl().startsWith('/examples/'));
  protected themeService = inject(ThemeService);

  @ViewChild('sidebarNav') sidebarNav!: ElementRef<HTMLElement>;

  constructor() {
    // Initialize URL after render to avoid change detection issues in zoneless mode
    afterNextRender(() => {
      this.currentUrl.set(this.router.url);
    });

    // Track URL changes during navigation
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
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

  // FontAwesome icons
  protected icons = {
    home: faHome,
    cubes: faCubes,
    wand: faWandMagicSparkles,
    square: faSquare,
    card: faIdCard,
    keyboard: faKeyboard,
    tag: faTag,
    bell: faBell,
    window: faWindowMaximize,
    caretDown: faCaretDown,
    folder: faFolderOpen,
    bars: faBars,
    xmark: faXmark,
    arrowRight: faArrowRight,
    code: faCode,
    rocket: faRocket,
    palette: faPalette,
    gear: faGear,
    github: faGithub,
    heart: faHeart,
    edit: faPenToSquare,
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
    system: faDesktop,
    table: faTable,
    checkSquare: faSquareCheck,
    toggle: faToggleOn,
    radio: faCircleDot,
    list: faList,
    slider: faSliders,
    star: faStar,
    user: faUser,
    spinner: faSpinner,
    squareFull: faSquareFull,
    map: faMapSigns,
    file: faFile,
    minus: faMinus,
    clipboard: faClipboardList,
    history: faHistory,
    comment: faComment,
    windowRestore: faWindowRestore,
    barsStaggered: faBarsStaggered,
    codeBranch: faCodeBranch,
    image: faImage,
    expand: faExpand,
    gripV: faGripVertical,
    gripH: faGripHorizontal,
    border: faBorderAll,
    plus: faPlus,
    crop: faCropSimple,
    align: faAlignCenter,
    arrows: faArrowsUpDownLeftRight,
    music: faMusic,
    volume: faVolumeHigh,
    chevronDown: faChevronDown,
    chevronRight: faChevronRight,
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
      icon: faPenToSquare,
      items: [
        { label: 'Button', path: '/components/button', icon: faSquare },
        { label: 'Input', path: '/components/input', icon: faKeyboard },
        { label: 'Checkbox', path: '/components/checkbox', icon: faSquareCheck },
        { label: 'Switch', path: '/components/switch', icon: faToggleOn },
        { label: 'Radio', path: '/components/radio', icon: faCircleDot },
        { label: 'Select', path: '/components/select', icon: faList },
        { label: 'Multiselect', path: '/components/multiselect', icon: faList },
        { label: 'Slider', path: '/components/slider', icon: faSliders },
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
        { label: 'Spacer', path: '/components/spacer', icon: faArrowsUpDownLeftRight },
        { label: 'Splitter', path: '/components/splitter', icon: faGripHorizontal },
        { label: 'Sticky', path: '/components/sticky', icon: faPlus },
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
        { label: 'Avatar', path: '/components/avatar', icon: faUser },
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
        { label: 'Pagination', path: '/components/pagination', icon: faFile },
        { label: 'Steps', path: '/components/steps', icon: faClipboardList },
      ],
    },
    {
      label: 'Feedback',
      icon: faComments,
      items: [
        { label: 'Alert', path: '/components/alert', icon: faBell },
        { label: 'Toast', path: '/components/toast', icon: faComment },
        { label: 'Progress', path: '/components/progress', icon: faChartLine },
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
    {
      label: 'Native App',
      icon: faWindowMaximize,
      items: [
        { label: 'Native Components', path: '/components/native', icon: faWindowMaximize },
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
    return faDesktop;
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
