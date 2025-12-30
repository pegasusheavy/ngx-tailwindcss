# Native App UI Components TODO

A comprehensive roadmap for adding desktop/native app UI components to ngx-tailwindcss, optimized for Tauri, Electron, and native-feeling web apps.

---

## 🎯 Overview

This module focuses on UI components commonly needed in desktop applications built with Tauri, Electron, or as Progressive Web Apps (PWAs) that want a native feel.

**Target Platforms:**
- Tauri (Rust-based, lightweight)
- Electron (Node.js-based)
- Native-feeling web apps / PWAs
- Cross-platform consistency with platform-specific variants

---

## 🪟 Phase 1 - Window & Chrome

### Title Bar
- [ ] Custom draggable title bar (replaces native)
- [ ] App icon and title display
- [ ] Window control buttons (minimize, maximize, close)
- [ ] Platform variants (macOS traffic lights, Windows, Linux)
- [ ] Double-click to maximize
- [ ] Integration with native window APIs
- [ ] Transparent/blurred variants
- [ ] Tab integration for tabbed windows

### Window Controls
- [ ] macOS traffic light buttons (close, minimize, zoom)
- [ ] Windows-style buttons (minimize, maximize, close)
- [ ] Linux/GTK style buttons
- [ ] Hover states and animations
- [ ] Disabled states when appropriate
- [ ] Full-screen toggle button

### Menu Bar
- [ ] Native-style menu bar
- [ ] Dropdown menus with keyboard navigation
- [ ] Keyboard shortcuts display
- [ ] Menu item icons
- [ ] Checkbox and radio menu items
- [ ] Submenu support
- [ ] Platform-specific styling (macOS in title bar, Windows below)
- [ ] Hamburger menu fallback for mobile/web

### Context Menu
- [ ] Right-click context menus
- [ ] Keyboard activation (Menu key, Shift+F10)
- [ ] Nested submenus
- [ ] Separators and section headers
- [ ] Icons and keyboard shortcuts
- [ ] Disabled items
- [ ] Checkable items
- [ ] Dynamic menu building

---

## 📁 Phase 2 - Navigation & File Management

### Sidebar / Navigation Panel
- [ ] Collapsible sidebar with smooth animation
- [ ] Tree structure for hierarchical navigation
- [ ] Icons with labels
- [ ] Active/selected state indicators
- [ ] Drag-to-resize width
- [ ] Mini/collapsed mode (icons only)
- [ ] Section headers and dividers
- [ ] Badge indicators (counts, status)
- [ ] Favorites/pinned items section
- [ ] Recent items section

### File Tree / Explorer
- [ ] Hierarchical file/folder display
- [ ] Expand/collapse folders
- [ ] File type icons
- [ ] Single and multi-selection
- [ ] Drag and drop reordering
- [ ] Drag and drop to move files
- [ ] Rename inline
- [ ] Context menu integration
- [ ] Lazy loading for large directories
- [ ] Search/filter within tree
- [ ] File size and date columns (optional)

### Breadcrumb Navigation
- [ ] Path-based breadcrumb trail
- [ ] Click to navigate to parent
- [ ] Dropdown for sibling navigation
- [ ] Editable path mode
- [ ] Copy path action
- [ ] Home/root shortcut
- [ ] Overflow handling with dropdown

### Tab Bar
- [ ] Document/file tabs
- [ ] Closable tabs with confirm on unsaved
- [ ] Drag to reorder tabs
- [ ] Tab overflow handling (scroll or dropdown)
- [ ] Tab preview on hover
- [ ] Split tab groups
- [ ] Pin tabs
- [ ] Tab context menu (close others, close to right)
- [ ] Unsaved indicator (dot)
- [ ] Modified indicator

---

## 🔍 Phase 3 - Search & Commands

### Command Palette
- [ ] Spotlight/VS Code style command palette (Cmd+K / Ctrl+K)
- [ ] Fuzzy search for commands
- [ ] Recent commands section
- [ ] Command categories/groups
- [ ] Keyboard shortcut display
- [ ] File search mode
- [ ] Symbol search mode
- [ ] Settings search mode
- [ ] Plugin/extension commands
- [ ] Custom command registration API

### Search Bar
- [ ] Global search input
- [ ] Search suggestions/autocomplete
- [ ] Search history
- [ ] Search filters (type, date, etc.)
- [ ] Clear search button
- [ ] Loading state
- [ ] No results state
- [ ] Advanced search toggle

### Quick Switcher
- [ ] Quick file/tab switcher (Cmd+Tab style)
- [ ] Recent files list
- [ ] Fuzzy matching
- [ ] Preview pane
- [ ] Keyboard navigation

---

## ⚙️ Phase 4 - Settings & Preferences

### Settings Panel
- [ ] Categorized settings layout
- [ ] Sidebar navigation for categories
- [ ] Search within settings
- [ ] Toggle switches for boolean options
- [ ] Dropdown selects for enums
- [ ] Text inputs for strings
- [ ] Number inputs with validation
- [ ] Color pickers for theme colors
- [ ] File/folder path pickers
- [ ] Keyboard shortcut editor
- [ ] Reset to defaults
- [ ] Import/export settings

### Preferences Dialog
- [ ] macOS-style preferences window
- [ ] Icon-based category tabs
- [ ] Responsive layout
- [ ] Platform-appropriate styling

### Keyboard Shortcuts Editor
- [ ] Visual shortcut editor
- [ ] Conflict detection
- [ ] Default shortcuts reference
- [ ] Custom shortcut binding
- [ ] Reset individual shortcuts
- [ ] Export/import shortcuts
- [ ] Search shortcuts

### Theme Selector
- [ ] Light/Dark/System mode toggle
- [ ] Theme preview cards
- [ ] Custom accent color picker
- [ ] Font size adjustment
- [ ] High contrast option
- [ ] Reduced motion option

---

## 💬 Phase 5 - Dialogs & Notifications

### Alert Dialog
- [ ] Info, Warning, Error, Success variants
- [ ] Title and message
- [ ] Icon variants
- [ ] Single button (OK) and multi-button layouts
- [ ] Default and destructive button styling
- [ ] Keyboard focus management
- [ ] Don't show again checkbox

### Confirm Dialog
- [ ] Confirmation with Cancel/Confirm buttons
- [ ] Destructive action variant (red confirm)
- [ ] Custom button labels
- [ ] Optional "Don't ask again"
- [ ] Async confirmation support

### Prompt Dialog
- [ ] Text input prompt
- [ ] Validation support
- [ ] Default value
- [ ] Placeholder text
- [ ] Input type variants (text, password, number)

### About Dialog
- [ ] App icon and name
- [ ] Version number
- [ ] Copyright notice
- [ ] Credits/acknowledgments
- [ ] License information
- [ ] Links (website, GitHub, docs)
- [ ] Check for updates button
- [ ] System information

### Update Dialog
- [ ] Update available notification
- [ ] Version comparison (current vs new)
- [ ] Changelog/release notes display
- [ ] Download progress indicator
- [ ] Install now / Later options
- [ ] Auto-update toggle

### Toast Notifications
- [ ] Native-style toast messages
- [ ] Position variants (top-right, bottom-right, etc.)
- [ ] Auto-dismiss with configurable duration
- [ ] Manual dismiss button
- [ ] Action buttons
- [ ] Progress toasts (for long operations)
- [ ] Stacking/queuing multiple toasts
- [ ] Icon variants (info, success, warning, error)

### Onboarding / Welcome Wizard
- [ ] Step-by-step introduction
- [ ] Progress indicator
- [ ] Skip option
- [ ] Previous/Next navigation
- [ ] Feature highlights with images
- [ ] Quick setup options
- [ ] "Don't show again" option

---

## 📊 Phase 6 - Data Display

### Property Inspector / Details Panel
- [ ] Key-value property display
- [ ] Collapsible sections
- [ ] Editable values
- [ ] Type-specific editors (color, date, number)
- [ ] Array/object expansion
- [ ] Copy value action
- [ ] Refresh button

### Terminal / Console
- [ ] Terminal output display
- [ ] ANSI color support
- [ ] Scrollback buffer
- [ ] Copy selection
- [ ] Clear console
- [ ] Search in output
- [ ] Log level filtering (info, warn, error)
- [ ] Timestamp display
- [ ] Word wrap toggle

### Log Viewer
- [ ] Log entry list
- [ ] Severity level badges
- [ ] Timestamp column
- [ ] Source/category filtering
- [ ] Full-text search
- [ ] Expand entry for details
- [ ] Export logs
- [ ] Real-time tail mode
- [ ] Pause/resume auto-scroll

### Code / JSON Viewer
- [ ] Syntax highlighting
- [ ] Line numbers
- [ ] Collapsible blocks
- [ ] Copy to clipboard
- [ ] Word wrap toggle
- [ ] Search and highlight
- [ ] Diff view mode

### Data Table (Enhanced)
- [ ] Sortable columns
- [ ] Resizable columns
- [ ] Column reordering
- [ ] Row selection (single/multi)
- [ ] Row virtualization for performance
- [ ] Fixed header on scroll
- [ ] Fixed columns (left/right)
- [ ] Cell editing
- [ ] Row expansion/details
- [ ] Export (CSV, JSON)
- [ ] Column visibility toggle

---

## 🎨 Phase 7 - Status & Feedback

### Status Bar
- [ ] Bottom status bar layout
- [ ] Left/center/right sections
- [ ] Click-to-action items
- [ ] Icon + text items
- [ ] Progress indicator area
- [ ] Notification indicator
- [ ] Encoding/line ending display
- [ ] Cursor position display
- [ ] Git branch indicator
- [ ] Connection status

### Toolbar / Action Bar
- [ ] Icon buttons with tooltips
- [ ] Button groups
- [ ] Separators
- [ ] Dropdown buttons
- [ ] Search in toolbar
- [ ] Overflow menu for narrow widths
- [ ] Customizable button arrangement
- [ ] Toggle buttons (pressed state)

### Progress Indicators
- [ ] Determinate progress bar
- [ ] Indeterminate progress bar
- [ ] Circular progress spinner
- [ ] Progress with label
- [ ] Progress with percentage
- [ ] Cancel button integration
- [ ] Stacked progress (multiple operations)
- [ ] Mini progress in status bar

### Activity Indicator
- [ ] Loading spinner
- [ ] Pulsing dot
- [ ] Skeleton loading states
- [ ] Full-screen loading overlay
- [ ] Inline loading states

### Connection Status
- [ ] Online/Offline indicator
- [ ] Sync status (synced, syncing, error)
- [ ] Last synced timestamp
- [ ] Retry action
- [ ] Server connection indicator

---

## 🖱️ Phase 8 - Interaction & Input

### Drag and Drop Zone
- [ ] Visual drop target area
- [ ] Drag-over highlight state
- [ ] File type validation
- [ ] Multiple file support
- [ ] Drop preview
- [ ] Reject invalid drops
- [ ] Upload progress integration

### Resizable Panels / Splitter
- [ ] Horizontal and vertical split
- [ ] Drag-to-resize handles
- [ ] Minimum/maximum sizes
- [ ] Collapse to hide panels
- [ ] Double-click to reset
- [ ] Save/restore panel sizes
- [ ] Multiple panels support

### Keyboard Shortcut Display
- [ ] Keyboard key visual representation
- [ ] Modifier key combinations
- [ ] Platform-specific keys (Cmd vs Ctrl)
- [ ] Single key display
- [ ] Key sequence display
- [ ] Inline and block variants

### Tooltip (Enhanced)
- [ ] Rich content tooltips
- [ ] Keyboard shortcut in tooltip
- [ ] Delay configuration
- [ ] Position variants
- [ ] Arrow pointer
- [ ] Interactive tooltips (clickable content)

---

## 🌐 Phase 9 - Platform Integration

### Native File Picker Integration
- [ ] Open file dialog wrapper
- [ ] Save file dialog wrapper
- [ ] Directory picker
- [ ] File type filters
- [ ] Default path/filename
- [ ] Multi-select support
- [ ] Recent locations

### System Tray
- [ ] Tray icon display
- [ ] Tray menu
- [ ] Click actions
- [ ] Badge/notification dot
- [ ] Tooltip on hover
- [ ] Platform-specific behavior

### Native Notifications
- [ ] System notification integration
- [ ] Click-to-open action
- [ ] Custom actions
- [ ] Badge count
- [ ] Sound options
- [ ] Scheduled notifications

### Dock / Taskbar
- [ ] Progress indicator on dock icon
- [ ] Badge count
- [ ] Bounce/flash for attention
- [ ] Custom dock menu (macOS)
- [ ] Jump list (Windows)

---

## 🎨 Theming & Platform Variants

### Platform Detection
- [ ] Auto-detect macOS/Windows/Linux
- [ ] Manual platform override
- [ ] Apply platform-specific styles automatically

### Theme Variants
- [ ] macOS (Big Sur/Monterey/Ventura style)
- [ ] Windows 11 (Fluent Design)
- [ ] Windows 10 style
- [ ] Linux GTK/Adwaita style
- [ ] Linux KDE/Breeze style
- [ ] Custom/brand theme support

### Dark Mode
- [ ] System dark mode detection
- [ ] Manual toggle
- [ ] Per-component dark variants
- [ ] Smooth transition animation

### Accent Colors
- [ ] System accent color detection
- [ ] Custom accent color
- [ ] Accent color propagation

---

## 📱 Responsive & Accessibility

### Responsive Layouts
- [ ] Sidebar collapse on narrow width
- [ ] Toolbar overflow handling
- [ ] Mobile-friendly touch targets
- [ ] Adaptive component sizing

### Accessibility
- [ ] Full keyboard navigation
- [ ] Screen reader support
- [ ] Focus indicators
- [ ] High contrast mode
- [ ] Reduced motion support
- [ ] ARIA attributes
- [ ] Focus trap for modals

---

## 🔌 Services & Utilities

### Platform Service (Enhanced)
- [ ] Enhanced Tauri/Electron detection
- [ ] Window management (minimize, maximize, close, fullscreen)
- [ ] App info (version, name, build)
- [ ] System info (OS, arch, memory)
- [ ] Deep link handling
- [ ] Protocol registration
- [ ] Auto-start configuration

### Storage Service
- [ ] Local storage wrapper
- [ ] Secure storage (keychain/credential manager)
- [ ] File-based storage
- [ ] Encrypted storage
- [ ] Storage migration utilities

### IPC Service
- [ ] Tauri command invocation
- [ ] Electron IPC wrapper
- [ ] Event subscription
- [ ] Error handling

### Update Service
- [ ] Check for updates
- [ ] Download update
- [ ] Install update
- [ ] Update progress events
- [ ] Changelog fetching

### Analytics Service (Optional)
- [ ] Privacy-respecting analytics
- [ ] Opt-in/opt-out
- [ ] Event tracking
- [ ] Crash reporting integration

---

## Progress Summary

| Phase | Status | Components |
|-------|--------|------------|
| Phase 1 - Window & Chrome | 🔲 Pending | Title Bar, Window Controls, Menu Bar, Context Menu |
| Phase 2 - Navigation | 🔲 Pending | Sidebar, File Tree, Breadcrumbs, Tab Bar |
| Phase 3 - Search & Commands | 🔲 Pending | Command Palette, Search Bar, Quick Switcher |
| Phase 4 - Settings | 🔲 Pending | Settings Panel, Preferences, Shortcuts Editor, Theme Selector |
| Phase 5 - Dialogs | 🔲 Pending | Alert, Confirm, Prompt, About, Update, Toast, Onboarding |
| Phase 6 - Data Display | 🔲 Pending | Property Inspector, Terminal, Log Viewer, Code Viewer, Data Table |
| Phase 7 - Status & Feedback | 🔲 Pending | Status Bar, Toolbar, Progress, Activity, Connection Status |
| Phase 8 - Interaction | 🔲 Pending | Drag & Drop, Resizable Panels, Shortcut Display, Tooltip |
| Phase 9 - Platform Integration | 🔲 Pending | File Picker, System Tray, Notifications, Dock |

---

## Component Count Target

**Target: ~45 components + 5 services + 3 directives**

### Components by Phase
1. **Window & Chrome (4):** Title Bar, Window Controls, Menu Bar, Context Menu
2. **Navigation (4):** Sidebar, File Tree, Breadcrumbs, Tab Bar
3. **Search & Commands (3):** Command Palette, Search Bar, Quick Switcher
4. **Settings (4):** Settings Panel, Preferences Dialog, Shortcuts Editor, Theme Selector
5. **Dialogs (7):** Alert, Confirm, Prompt, About, Update, Toast, Onboarding Wizard
6. **Data Display (5):** Property Inspector, Terminal, Log Viewer, Code Viewer, Data Table
7. **Status & Feedback (5):** Status Bar, Toolbar, Progress Indicators, Activity Indicator, Connection Status
8. **Interaction (4):** Drag & Drop Zone, Resizable Panels, Shortcut Display, Enhanced Tooltip
9. **Platform Integration (4):** File Picker, System Tray, Native Notifications, Dock Integration

### Services (5)
1. `NativePlatformService` - Window management, system info (extend existing)
2. `StorageService` - Local, secure, and file storage
3. `IpcService` - Tauri/Electron IPC communication
4. `UpdateService` - App update management
5. `ThemeService` - Platform theming and dark mode (extend existing)

### Directives (3)
1. `twDraggable` - Make elements draggable
2. `twDropZone` - Define drop target areas
3. `twShortcut` - Keyboard shortcut binding

---

## Priority Order (Recommended)

### High Priority (Core Desktop Experience)
1. Title Bar + Window Controls
2. Sidebar Navigation
3. Tab Bar
4. Context Menu
5. Command Palette
6. Status Bar
7. Toast Notifications
8. Alert/Confirm Dialogs

### Medium Priority (Enhanced Functionality)
9. File Tree
10. Settings Panel
11. Terminal/Console
12. Progress Indicators
13. Toolbar
14. Breadcrumbs
15. Search Bar
16. About Dialog

### Lower Priority (Polish & Platform-Specific)
17. Resizable Panels
18. Update Dialog
19. System Tray
20. Dock Integration
21. Onboarding Wizard
22. Log Viewer
23. Property Inspector
24. Keyboard Shortcuts Editor

---

## Notes

### Design Principles
- **Native Feel:** Components should feel at home on each platform
- **Consistency:** Maintain consistent API patterns across components
- **Performance:** Optimize for Tauri's lightweight runtime
- **Accessibility:** Full keyboard navigation and screen reader support
- **Theming:** Support system themes and custom theming

### Existing Assets to Leverage
- `NativePlatformService` - Already has Tauri/Electron detection and file operations
- `TwClassService` - Tailwind class merging
- Core modal/dialog patterns from existing components
- Toast service already exists

### Platform-Specific Notes
- **Tauri:** Use `@tauri-apps/api` for window, dialog, fs, etc.
- **Electron:** Use `@electron/remote` or IPC for native features
- **Web:** Graceful fallbacks to standard web APIs
