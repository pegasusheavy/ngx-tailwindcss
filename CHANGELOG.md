# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.4] - 2025-12-31

### 🐛 Bug Fixes

- **Volume Dial**: Refactored to use Angular's `model()` input for proper two-way binding support, fixing `NG0303` warning about `value` not being a known property
- **Pagination**: Fixed `NG0955` duplicate keys warning by using unique identifiers for left/right ellipsis in page number arrays
- **Native Components**: Fixed bundler resolution errors for Tauri/Electron imports in web-only applications by implementing dynamic import utilities that prevent static analysis

### 🧹 Code Quality

- Removed redundant `valueChange` output from volume dial (now handled automatically by `model()`)
- Cleaned up unused imports in volume dial component
- Added `dynamic-import.ts` utility for runtime-only imports of optional dependencies (Electron, Tauri)
- Updated native services to use dynamic import utilities: FilePickerService, SystemTrayService, DockService, NativeNotificationsService, UpdateService

## [0.3.3] - 2025-12-31

### 🎨 Dark Mode & UI Improvements

- Added dark mode variants to ghost and outline button variants
- Fixed ghost button icon visibility in dark mode
- Fixed avatar ring shapes (add rounded-full to prevent square rings)
- Fixed notification badge clipping (move outside button overflow)
- Removed redundant rounded corners from terminal and log-viewer
- Increased terminal and log-viewer demo heights to prevent cutoff
- Fixed DAW mixer fader styling (rectangular instead of rounded)

### 📦 Dependencies

- Updated `@angular/router` to 21.0.6 to match other Angular packages

## [0.3.2] - 2025-12-30

### 🛠 CI/CD Fixes

- Fixed GitHub Pages deployment for documentation
- Removed CNAME configuration for github.io deployment
- Deployed docs from main branch instead of release tags
- Allow docs deployment even if npm publish fails

## [0.3.1] - 2025-12-29

### 🧪 Testing

- Added comprehensive unit test coverage (1006 tests)
- All components now have spec files with thorough testing
- Fixed test utilities and improved test infrastructure

## [0.3.0] - 2025-12-28

### ✨ Native App UI Components

Complete suite of UI components for building desktop-like applications with Tauri, Electron, or PWAs:

#### Window & Chrome Components
- **Title Bar** - Custom draggable title bar with platform-specific controls
- **Window Controls** - macOS traffic lights, Windows, and Linux style buttons
- **Menu Bar** - Native-style menu bar with keyboard navigation
- **Context Menu** - Right-click context menus with submenus

#### Navigation Components
- **Sidebar** - Collapsible sidebar with tree navigation
- **File Tree** - Hierarchical file/folder explorer
- **Breadcrumb Navigation** - Path-based breadcrumbs
- **Tab Bar** - Document tabs with close/reorder

#### Search & Commands
- **Command Palette** - VS Code-style command palette (Cmd+K)
- **Search Bar** - Global search with suggestions
- **Quick Switcher** - Quick file/tab switcher

#### Settings & Preferences
- **Settings Panel** - Categorized settings layout
- **Preferences Dialog** - macOS-style preferences
- **Keyboard Shortcuts Editor** - Visual shortcut editor
- **Theme Selector** - Light/Dark/System mode toggle

#### Dialogs & Notifications
- **Alert Dialog** - Info, Warning, Error, Success variants
- **Confirm Dialog** - Confirmation with custom buttons
- **Prompt Dialog** - Text input prompts
- **About Dialog** - App info with version, credits
- **Update Dialog** - Update available notifications
- **Onboarding Wizard** - Step-by-step introductions

#### Data Display
- **Property Inspector** - Key-value property display
- **Terminal/Console** - Terminal output with ANSI colors
- **Log Viewer** - Log entries with filtering
- **Code/JSON Viewer** - Syntax highlighted code display

#### Status & Feedback
- **Status Bar** - Bottom status bar with sections
- **Toolbar** - Icon buttons with overflow menu
- **Activity Indicator** - Loading states
- **Connection Status** - Online/offline indicators

#### Interaction & Input
- **Resizable Panels** - Drag-to-resize split panels
- **Keyboard Shortcut Display** - Visual key combinations
- **Drag & Drop Directives** - twDraggable, twDropZone
- **Shortcut Directive** - twShortcut for keyboard bindings

### 🔧 Services

- `NativeAppPlatformService` - Window management, system info
- `StorageService` - Local, secure, and file storage
- `IpcService` - Tauri/Electron IPC communication
- `UpdateService` - App update management
- `FilePickerService` - Native file/folder dialogs
- `SystemTrayService` - System tray icon and menu
- `NativeNotificationsService` - System notifications
- `DockService` - Dock/taskbar integration

## [0.2.0] - 2025-12-26

### ✨ Music/Audio Components

Professional DAW-style audio components for music applications:

- **Piano Keyboard** - Interactive piano with MIDI support
- **Volume Dial** - Rotary volume/parameter control
- **Mixer Faders** - Multi-channel mixing interface
- **Waveform Display** - Audio waveform visualization
- **Spectrum Analyzer** - Real-time frequency display
- **VU Meter** - Level metering with peak hold
- **Transport Controls** - Play/pause/stop/record buttons
- **Timeline Ruler** - Time/beat markers

### 🔧 Audio Services

- `AudioContextService` - Web Audio API management
- `MidiService` - MIDI device integration
- `MobileSupportService` - Touch device optimization
- `AccessibilityService` - Screen reader support for audio controls

## [0.1.2] - 2025-12-21

### 🛠 Packaging & Reliability

- Copied `README.md` into the published `/dist/ngx-tailwindcss` output so npmjs can render the project documentation even when the tarball is built from the compiled library.
- Added a `publish:dist` script that runs the production build and publishes directly from `dist/ngx-tailwindcss` with `--access public`, keeping the published artifact aligned with the compiled bundle.
- Raised the Vitest hook and test timeouts to 60 s so the longer-running directive specs no longer abort the Husky pre-push step.

## [0.1.1] - 2025-12-19

### 🛠 Packaging & Reliability

- Ensured the npm release is produced from the compiled `/dist/ngx-tailwindcss` output so the published tarball includes the FESM bundle, typings, and theme CSS instead of just docs/config files.
- Replaced the deprecated `husky install` step with a runtime `node -e "import('husky')..."` bootstrap and added dedicated pre-commit/pre-push/commit-msg scripts so lint/test/commitlint hooks run reliably without invoking the removed shim.

## [0.1.0] - 2025-12-19

### ✨ Features

- Introduced a configurable theming system based on CSS custom properties, the `TwThemeService`, and `provideTwTheme()` so apps can swap palettes, override individual components, and keep `dark:` styles optional.
- Added a default `theme.css` bundle with semantic light/dark values and exposed the CSS variables through `ng-packagr` assets, letting downstream consumers tweak every shade without touching the library source.
- Delivered `TwDatatablesComponent`, a ready-to-go dashboard table with headers, toolbar slots, filters, pagination, and selection wired to the existing `tw-table` data layer.

### 📝 Content & polish

- Documented how to configure themes and added the DataTables docs page, ensuring the sidebar, nav, and theming routes all reach the new experiences.
- Rebalanced the docs palette so dark mode text, containers, stack/grid/spacer demos, sticky/scroll-area/columns/bleed examples, and tabs are legible, spacing works, and the navbar no longer looks cramped.
- Fixed the horizontal spacer sample to honor `size="auto"` by giving it `flex-1` and updated copy snippets throughout the docs to reflect the new UX.

### 🛠 Tooling & quality

- Added comprehensive `.npmignore`, removed single-use scripts, and wired Husky with linting pre-commit, test pre-push, and commitlint hooks.
- Documented the new changelog entry, ensured dark-mode demos showcase `dark:text-slate-300`, and kept existing Tailwind `dark:` utilities as safe defaults while giving users CSS variable overrides for Tw components.

## [0.1.0-beta.1] - 2025-12-15

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

[0.3.4]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.3.4
[0.3.3]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.3.3
[0.3.2]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.3.2
[0.3.1]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.3.1
[0.3.0]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.3.0
[0.2.0]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.2.0
[0.1.2]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.1.2
[0.1.1]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.1.1
[0.1.0]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.1.0
[0.1.0-beta.1]: https://github.com/pegasusheavy/ngx-tailwindcss/releases/tag/v0.1.0-beta.1

