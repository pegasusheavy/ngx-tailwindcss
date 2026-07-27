# Examples

This directory contains real-world example implementations using the ngx-tailwindcss component library.

## Available Examples

### 1. [SaaS Landing Page](./saas-landing.component.ts)
**Route:** `/examples/saas-landing`

A complete Silicon Valley-style SaaS startup landing page with modern design and conversion-focused features.

**Features:** Hero section, feature showcase, pricing tiers, testimonials, team profiles, FAQ, CTAs

**Components:** 10+ components including modals, accordions, cards, badges, avatars

**Best For:** SaaS products, B2B platforms, tech startups, product launches

---

### 2. [Forum/Community](./forum.component.ts)
**Route:** `/examples/forum`

A complete community discussion forum with categories, threads, posts, and user interactions.

**Features:** Category browsing, threaded discussions, pagination, search, replies, likes, moderation badges

**Components:** 12+ components including cards, avatars, badges, pagination, accordions, modals

**Best For:** Community platforms, discussion boards, Q&A sites, support forums

---

### 3. [Social Network](./social-network.component.ts)
**Route:** `/examples/social-network`

A full-featured social media platform with feed, stories, posts, comments, and notifications.

**Features:** News feed, stories, post creation, likes/comments, notifications, trending topics, user suggestions

**Components:** 12+ components including cards, avatars, badges, modals, tabs, progress

**Best For:** Social networks, community platforms, activity feeds, content sharing sites

---

### 4. [Admin Dashboard](./admin-dashboard.component.ts)
**Route:** `/examples/admin-dashboard`

A comprehensive admin panel for SaaS applications, CRMs, and analytics platforms.

**Features:** User management, data tables, filtering, pagination, stats dashboard, bulk operations

**Components:** 15+ components including sidebar, tables, modals, multi-select with groups

**Best For:** Business applications, data management, analytics dashboards

---

### 5. [E-Commerce Store](./ecommerce.component.ts)
**Route:** `/examples/ecommerce`

A fully-featured online store with shopping cart, product catalog, and checkout flow.

**Features:** Product filtering, search, cart management, product details, wishlist, reviews

**Components:** 20+ components including cart sidebar, price slider, ratings, image gallery

**Best For:** Online retail, product catalogs, B2B marketplaces, digital stores

---

### 6. [Photographer Portfolio](./portfolio.component.ts)
**Route:** `/examples/portfolio`

A stunning professional photographer portfolio with gallery, services, and contact form.

**Features:** Photo gallery, category filtering, EXIF data, testimonials, pricing, contact modal

**Components:** 15+ components including modals, accordions, tabs, ratings, image grids

**Best For:** Photographers, visual artists, creative portfolios, freelance professionals

---

### 7. [File Explorer](./desktop-app.component.ts)
**Route:** `/examples/desktop-app`

A desktop-style file manager window with a simulated OS chrome, sidebar navigation, and file grid/list views.

**Features:** Window controls, breadcrumb navigation, grid/list toggle, context dropdowns, new-folder and properties modals

**Note:** This is a hand-styled showcase — most of the UI is bespoke Tailwind markup, with only a few library components (dropdown, modal) in use. It demonstrates visual polish more than library coverage.

**Best For:** Desktop-style web apps, file managers, admin utilities

---

### 8. [DAW Studio](./daw.component.ts)
**Route:** `/examples/daw`

A digital audio workstation mock-up with a transport bar, track lanes, mixer channels, and a piano-roll style layout.

**Note:** This is a hand-styled showcase built entirely from bespoke Tailwind markup — it uses no `tw-*` library components. It demonstrates visual polish more than library coverage.

**Best For:** Audio/media tooling UIs, dense professional interfaces

---

## Comparison Matrix

| Feature | SaaS Landing | Forum | Social Network | Admin Dashboard | E-Commerce | Portfolio |
|---------|-------------|-------|----------------|----------------|------------|-----------|
| **Primary Use** | Marketing | Community | Social Media | Business/SaaS | Retail/Sales | Creative/Visual |
| **Components** | 10+ | 12+ | 12+ | 15+ | 20+ | 15+ |
| **Key Feature** | Conversion | Discussions | Social Feed | Data tables | Shopping cart | Photo gallery |
| **Interactions** | CTAs, forms | Replies, votes | Likes, comments | Bulk operations | Product filtering | Category filtering |
| **Forms** | Contact, signup | New threads | Post creation | User management | Checkout | Contact inquiry |
| **Data Display** | Features, pricing | Thread cards | Post cards | Tables, charts | Product cards | Photo cards |
| **Complexity** | Medium | High | High | High | High | Medium |
| **Best For** | Product launch | Forums, Q&A | Social apps | Dashboards, CRM | Online stores | Portfolios, artists |

## Unique Component Demonstrations

### SaaS Landing Page
- Hero section with CTAs
- Feature showcase grids
- Pricing tier cards
- Testimonial carousels
- FAQ accordions
- Team member profiles

### Forum/Community
- Category browsing
- Thread pagination
- Reply system
- User reputation badges
- Moderation indicators
- Tag-based filtering

### Social Network
- Story viewer
- News feed with posts
- Likes and comments
- Notifications dropdown
- Trending topics
- User suggestions
- Bookmark system

### Admin Dashboard
- Multi-select with grouped options
- Data tables with sorting/filtering
- Bulk action patterns
- Status indicators
- User role management

### E-Commerce
- Shopping cart state management
- Price range slider
- Product variants (color, size)
- Discount badges
- Review system

### Portfolio
- Photo gallery with aspect ratios
- EXIF metadata display
- Category filtering
- Testimonials with ratings
- Service pricing cards

### File Explorer (hand-styled showcase)
- Simulated OS window chrome
- Grid/list view toggle
- Context dropdown menus
- Uses only a handful of library components

### DAW Studio (hand-styled showcase)
- Transport bar and track lanes
- Mixer channel strips
- Built entirely from bespoke Tailwind markup (no `tw-*` components)

---

## Admin Dashboard

A comprehensive admin dashboard template demonstrating:

### Features Showcased

#### Layout & Navigation
- **Collapsible Sidebar** - Full-height navigation with header and footer sections
- **Top Navigation Bar** - Action buttons and user dropdown
- **Responsive Design** - Mobile-friendly layout that adapts to screen sizes

#### Data Display
- **Stats Cards** - Dashboard metrics with trend indicators
- **Data Tables** - Sortable, filterable user management table
- **Pagination** - Navigate through large datasets
- **Progress Bars** - Visual analytics and metrics display

#### Form Components
- **Search Input** - Real-time filtering with icon prefix
- **Select Dropdown** - Single selection for status filtering
- **Multi-Select with Groups** - Department filtering with visual organization
- **Modal Forms** - Add/edit user dialogs

#### Interactive Elements
- **Tabs** - Switch between Users, Orders, and Analytics views
- **Dropdown Menus** - Context actions for table rows
- **Checkboxes** - Multi-select functionality for batch operations
- **Badges** - Status indicators with color variants

#### User Experience
- **Toast Notifications** - Success/error feedback
- **Loading States** - Spinners for async operations
- **Alerts** - Contextual information (bulk actions)
- **Empty States** - Graceful handling of no data

### Components Used

```typescript
// Layout
- TwSidebarComponent
- TwCardComponent
- TwTabsComponent
- TwModalComponent

// Form Inputs
- TwInputComponent (with search icon)
- TwSelectComponent (with grouped options)
- TwMultiSelectComponent (with grouped options)
- TwButtonComponent (various variants)

// Data Display
- TwTableComponent
- TwBadgeComponent
- TwAvatarComponent
- TwProgressComponent
- TwPaginationComponent

// Feedback
- TwToastService
- TwSpinnerComponent
- TwAlertComponent

// Navigation
- TwDropdownComponent
```

### Key Patterns Demonstrated

#### 1. Grouped Select Options
```typescript
departmentGroups: MultiSelectGroup[] = [
  {
    label: 'Engineering',
    options: [
      { label: 'Frontend', value: 'frontend' },
      { label: 'Backend', value: 'backend' }
    ]
  },
  {
    label: 'Product',
    options: [
      { label: 'Design', value: 'design' },
      { label: 'Product Management', value: 'pm' }
    ]
  }
];
```

#### 2. Reactive Filtering & Pagination
```typescript
protected filteredUsers = computed(() => {
  let filtered = this.users;

  // Status filter
  const filter = this.selectedFilter();
  if (filter !== 'all') {
    filtered = filtered.filter(u => u.status === filter);
  }

  // Search query
  const query = this.searchQuery().toLowerCase();
  if (query) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  }

  return filtered;
});
```

#### 3. Multi-Selection State Management
```typescript
protected onUserSelect(userId: number): void {
  this.selectedUsers.update(users => {
    const index = users.indexOf(userId);
    if (index > -1) {
      return users.filter(id => id !== userId);
    } else {
      return [...users, userId];
    }
  });
}
```

#### 4. Dynamic Badge Variants
```typescript
protected getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'inactive': return 'danger';
    default: return 'info';
  }
}
```

### Customization

The dashboard demonstrates extensive customization options:

- **Custom Card Headers/Footers** - Using content projection
- **Custom Table Cells** - Avatar + text combinations
- **Custom Styling** - Gradient backgrounds, shadows, borders
- **Theme Colors** - Consistent use of color variants
- **Icon Integration** - SVG icons throughout the UI

### Running the Example

1. Navigate to the examples route: `/examples/admin-dashboard`
2. Interact with the various controls:
   - Toggle the sidebar
   - Filter users by status and search
   - Select multiple departments
   - Click on table rows and dropdowns
   - Add a new user via the modal
   - Export and refresh data
   - Switch between tabs

### Use Cases

This template is perfect for:

- **SaaS Admin Panels** - User and subscription management
- **CRM Dashboards** - Customer and sales tracking
- **Analytics Platforms** - Data visualization and reporting
- **E-commerce Admin** - Order and inventory management
- **Team Management Tools** - User roles and permissions

### Code Organization

```
admin-dashboard.component.ts
├── Component State (signals)
│   ├── UI State (sidebar, modals, loading)
│   ├── Data State (users, orders, stats)
│   └── Filter State (search, status, departments)
├── Computed Properties
│   ├── filteredUsers
│   ├── paginatedUsers
│   └── totalPages
├── Event Handlers
│   ├── User Actions (select, delete, add)
│   ├── Data Operations (export, refresh)
│   └── UI Interactions (sidebar, modal)
└── Helper Methods
    ├── Badge Variant Mapping
    └── Page Change Handler
```

### Best Practices Shown

1. **Signals & Computed** - Using Angular's new reactivity system
2. **Type Safety** - Interfaces for all data structures
3. **Separation of Concerns** - Logic in component, presentation in template
4. **Accessibility** - Proper ARIA attributes and semantic HTML
5. **User Feedback** - Toast notifications for all actions
6. **Loading States** - Spinners for async operations
7. **Defensive Programming** - Null checks and default values

### Next Steps

Use this example as a starting point for your own admin interface. Common modifications:

- Connect to a real backend API
- Add authentication and route guards
- Implement actual CRUD operations
- Add charts and visualizations
- Integrate with state management (NgRx, Signals Store)
- Add more advanced filtering and sorting
- Implement bulk operations
- Add export to CSV/PDF functionality

