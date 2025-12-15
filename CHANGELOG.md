# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-15

### 🎉 Initial Release

First public release of `@pegasus-heavy/ngx-tailwindcss` - A highly customizable Angular component library for Tailwind CSS 4+.

### ✨ Features

#### Core
- **TwClassService** - Intelligent Tailwind class merging with conflict resolution
- **Global Configuration** - `provideTwConfig()` for app-wide default styling
- **Class Override System** - `classOverride` and `classReplace` inputs on all components

#### Form Components
- **Button** - Multiple variants (primary, secondary, outline, ghost, link, danger), sizes, icons, loading states
- **Input** - Text, password, email, number inputs with validation, prefixes, suffixes
- **Checkbox** - Single and group checkboxes with indeterminate state
- **Radio** - Radio buttons with group support
- **Switch** - Toggle switches with labels
- **Select** - Dropdown select with search, multi-select, custom templates
- **Slider** - Range sliders with single/dual handles, steps, marks
- **Rating** - Star rating with half-star support

#### Layout Components
- **Card** - Flexible card layouts with header, body, footer directives
- **Accordion** - Collapsible panels with single/multiple open modes
- **Tabs** - Tab navigation with lazy loading support
- **Divider** - Horizontal/vertical dividers with labels

#### Data Display Components
- **Badge** - Status indicators with variants and sizes
- **Avatar** - User avatars with images, initials, status indicators, groups
- **Chip** - Removable chips/tags
- **Table** - Data tables with sorting, pagination, row selection
- **Tree** - Hierarchical tree view with expand/collapse
- **Timeline** - Vertical timeline for events

#### Navigation Components
- **Breadcrumb** - Navigation breadcrumbs with custom separators
- **Pagination** - Page navigation with customizable display
- **Steps** - Step indicators for multi-step processes
- **Menu** - Context menus and menu bars

#### Feedback Components
- **Alert** - Dismissible alerts with variants (info, success, warning, error)
- **Toast** - Toast notifications with positioning and auto-dismiss
- **Progress** - Linear and circular progress bars
- **Spinner** - Loading spinners (border, dots, pulse, bars)
- **Skeleton** - Loading placeholders (text, cards, tables)

#### Overlay Components
- **Modal** - Dialog modals with sizes and animations
- **Dropdown** - Dropdown menus with portal rendering
- **Sidebar** - Slide-out sidebar panels
- **Popover** - Floating popovers with positioning

#### Media Components
- **Image** - Responsive images with lazy loading, preview mode

#### Utility Components
- **ScrollTop** - Scroll-to-top button

### 🎯 Directives

#### Core Directives
- **TwRippleDirective** - Material-style ripple effects
- **TwTooltipDirective** - Tooltip on hover
- **TwClickOutsideDirective** - Detect clicks outside element
- **TwFocusTrapDirective** - Trap focus within modals

#### DX Enhancement Directives
- **TwAutoFocusDirective** - Auto-focus elements on render
- **TwInViewDirective** - Intersection Observer for visibility
- **TwLongPressDirective** - Detect long press gestures
- **TwDebounceClickDirective** - Debounce rapid clicks
- **TwCopyClipboardDirective** - Copy text to clipboard
- **TwKeyboardShortcutDirective** - Handle keyboard shortcuts
- **TwSwipeDirective** - Detect swipe gestures
- **TwResizeObserverDirective** - Observe element resize
- **TwLazyImageDirective** - Lazy load images
- **TwScrollToDirective** - Smooth scroll navigation
- **TwHoverClassDirective** - Dynamic hover classes
- **TwTrapScrollDirective** - Prevent scroll propagation

#### ARIA Accessibility Directives
- **TwSrOnlyDirective** - Screen reader only content
- **TwAnnounceDirective** - Screen reader announcements
- **TwAriaExpandedDirective** - Manage expanded state
- **TwAriaSelectedDirective** - Manage selected state
- **TwAriaCheckedDirective** - Manage checked state
- **TwAriaPressedDirective** - Manage pressed state
- **TwAriaDisabledDirective** - Manage disabled state
- **TwAriaHiddenDirective** - Hide from assistive tech
- **TwAriaLiveDirective** - Live region management
- **TwAriaCurrentDirective** - Current navigation item
- **TwAriaBusyDirective** - Busy/loading state
- **TwAriaDescribedbyDirective** - Description relationships
- **TwAriaLabelledbyDirective** - Label relationships
- **TwAriaLabelDirective** - Accessible labels
- **TwAriaValueDirective** - Range widget values
- **TwRoleDirective** - ARIA roles
- **TwAriaModalDirective** - Modal dialogs
- **TwAriaHaspopupDirective** - Popup indicators

### ♿ Accessibility
- **TwAriaService** - Screen reader announcements (polite/assertive)
- **AriaUtils** - Helper functions for ARIA IDs and attributes
- All components built with WCAG 2.1 guidelines
- Keyboard navigation support
- Focus management

### 🌐 Internationalization
- **TwI18nService** - Translation and locale management
- **provideTwTranslations()** - Custom translation provider
- **provideTwLocale()** - Locale configuration
- Default English translations for all components
- RTL language support (Arabic, Hebrew, Persian, Urdu, etc.)
- String interpolation for dynamic content

### 📚 Documentation
- Comprehensive docs website with live examples
- Interactive component demos
- Code snippets with copy functionality
- SEO optimized with Open Graph and Twitter Cards
- AI-friendly documentation (llms.txt, structured data)

### 🛠️ Developer Experience
- Angular 19, 20, and 21 support
- Standalone components (no NgModule required)
- Full TypeScript support with strict types
- Tree-shakeable exports
- Zero bundled CSS - works with your Tailwind config
- Signals-based reactive state management

[0.1.0]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.1.0

