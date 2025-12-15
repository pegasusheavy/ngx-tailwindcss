# @pegasus-heavy/ngx-tailwindcss

A highly customizable Angular component library designed for **Tailwind CSS 4+**. This library provides beautiful, accessible UI components that leverage Tailwind's utility-first approach while giving you complete control over styling.

## Features

- 🎨 **Fully Customizable** - Override any styling through class props or global configuration
- 🌊 **Tailwind CSS 4+ Ready** - Built for the latest Tailwind with CSS-first configuration
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes and keyboard navigation
- 📦 **Tree-Shakeable** - Import only what you need with secondary entry points
- 🔧 **No Bundled CSS** - Your Tailwind config, your rules
- ⚡ **Standalone Components** - No NgModule required, works with Angular 19+

## Installation

```bash
pnpm add @pegasus-heavy/ngx-tailwindcss
# or
npm install @pegasus-heavy/ngx-tailwindcss
```

### Peer Dependencies

```bash
pnpm add @angular/cdk
```

## Tailwind CSS Configuration

This library **does not** import Tailwind CSS directly. You must configure Tailwind in your application.

### 1. Configure Content Paths

Add the library's component templates to your Tailwind content configuration so the PostCSS parser can detect the utility classes used:

**For Tailwind CSS 4+ (CSS-based config):**

```css
/* app.css or styles.css */
@import "tailwindcss";

@source "../node_modules/@pegasus-heavy/ngx-tailwindcss/**/*.{js,mjs}";
```

**For Tailwind CSS 3.x (tailwind.config.js):**

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@pegasus-heavy/ngx-tailwindcss/**/*.{js,mjs}",
  ],
  // ... rest of your config
};
```

### 2. Import Components

Import components directly in your Angular components:

```typescript
import { Component } from '@angular/core';
import {
  TwButtonComponent,
  TwCardComponent,
  TwCardBodyDirective
} from '@pegasus-heavy/ngx-tailwindcss';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TwButtonComponent, TwCardComponent, TwCardBodyDirective],
  template: `
    <tw-card>
      <tw-card-body>
        <tw-button variant="primary">Click me!</tw-button>
      </tw-card-body>
    </tw-card>
  `,
})
export class ExampleComponent {}
```

Or import everything at once:

```typescript
import { TW_ALL } from '@pegasus-heavy/ngx-tailwindcss';

@Component({
  imports: [...TW_ALL],
})
export class ExampleComponent {}
```

## Global Configuration

Customize default styles and behavior globally:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTwConfig } from '@pegasus-heavy/ngx-tailwindcss';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTwConfig({
      theme: {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
        // ... customize other variants
      },
      animationDuration: 300,
    }),
  ],
};
```

## Components

### Button

```html
<tw-button>Default</tw-button>
<tw-button variant="primary">Primary</tw-button>
<tw-button variant="danger" size="lg">Large Danger</tw-button>
<tw-button variant="outline" [loading]="isLoading">Submit</tw-button>
<tw-button variant="ghost" [iconOnly]="true">
  <svg twButtonIcon>...</svg>
</tw-button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'outline' | 'link'`
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `disabled`, `loading`, `fullWidth`, `iconOnly`: `boolean`
- `classOverride`: Additional classes to merge
- `classReplace`: Complete class replacement

### Card

```html
<tw-card variant="elevated">
  <tw-card-header>
    <tw-card-title>Card Title</tw-card-title>
    <tw-card-subtitle>Subtitle</tw-card-subtitle>
  </tw-card-header>
  <tw-card-body>
    Content goes here
  </tw-card-body>
  <tw-card-footer>
    <tw-button variant="primary">Action</tw-button>
  </tw-card-footer>
</tw-card>
```

### Input

```html
<tw-input
  [(ngModel)]="email"
  type="email"
  label="Email"
  placeholder="you@example.com"
  hint="We'll never share your email"
  [error]="emailError"
  [clearable]="true">
</tw-input>

<tw-textarea
  [(ngModel)]="bio"
  label="Bio"
  [rows]="4"
  [maxlength]="500"
  [showCount]="true"
  [autoResize]="true">
</tw-textarea>
```

### Badge

```html
<tw-badge variant="success">Active</tw-badge>
<tw-badge variant="warning" badgeStyle="soft">Pending</tw-badge>
<tw-badge variant="danger" badgeStyle="dot">Offline</tw-badge>
<tw-badge variant="info" [pill]="true" [removable]="true" [remove]="onRemove">
  Tag
</tw-badge>
```

### Alert

```html
<tw-alert variant="success" alertStyle="soft" [dismissible]="true">
  <tw-alert-title>Success!</tw-alert-title>
  <tw-alert-description>Your changes have been saved.</tw-alert-description>
</tw-alert>

<tw-alert variant="danger" alertStyle="accent">
  An error occurred while processing your request.
</tw-alert>
```

### Modal

```html
<tw-button (click)="isOpen = true">Open Modal</tw-button>

<tw-modal [(open)]="isOpen" size="md">
  <tw-modal-header>
    <tw-modal-title>Confirm Action</tw-modal-title>
  </tw-modal-header>
  <tw-modal-body>
    Are you sure you want to continue?
  </tw-modal-body>
  <tw-modal-footer>
    <tw-button variant="ghost" (click)="isOpen = false">Cancel</tw-button>
    <tw-button variant="primary" (click)="confirm()">Confirm</tw-button>
  </tw-modal-footer>
</tw-modal>
```

### Dropdown

```html
<tw-dropdown>
  <button twDropdownTrigger class="px-4 py-2 bg-white border rounded-lg">
    Options
  </button>
  <tw-dropdown-menu>
    <tw-dropdown-header>Actions</tw-dropdown-header>
    <button twDropdownItem (click)="edit()">Edit</button>
    <button twDropdownItem (click)="duplicate()">Duplicate</button>
    <tw-dropdown-divider></tw-dropdown-divider>
    <button twDropdownItem class="text-rose-600">Delete</button>
  </tw-dropdown-menu>
</tw-dropdown>
```

### Tabs

```html
<tw-tabs [(value)]="activeTab" variant="line">
  <tw-tab-panel value="overview" label="Overview">
    Overview content
  </tw-tab-panel>
  <tw-tab-panel value="settings" label="Settings">
    Settings content
  </tw-tab-panel>
  <tw-tab-panel value="billing" label="Billing" [disabled]="!isPremium">
    Billing content
  </tw-tab-panel>
</tw-tabs>
```

## Directives

### Ripple Effect

```html
<button twRipple class="px-4 py-2 bg-blue-600 text-white rounded">
  Click me
</button>
```

### Tooltip

```html
<button twTooltip="Save changes" tooltipPosition="top">
  Save
</button>
```

### Click Outside

```html
<div (twClickOutside)="closeMenu()" [clickOutsideEnabled]="isMenuOpen">
  Menu content
</div>
```

### Focus Trap

```html
<div twFocusTrap [focusTrapAutoFocus]="true">
  <input type="text">
  <button>Submit</button>
</div>
```

### Class Merge

```html
<!-- Intelligently merges Tailwind classes, resolving conflicts -->
<div [twClass]="'px-4 py-2 bg-blue-500'" [twClassMerge]="'px-8 bg-red-500'">
  Will have px-8 py-2 bg-red-500
</div>
```

## Customization Examples

### Per-Component Override

```html
<tw-button
  variant="primary"
  classOverride="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
  Gradient Button
</tw-button>
```

### Complete Class Replacement

```html
<tw-button classReplace="your-completely-custom-classes">
  Custom Styled
</tw-button>
```

### Using the Class Service

```typescript
import { TwClassService } from '@pegasus-heavy/ngx-tailwindcss';

@Component({...})
export class MyComponent {
  private twClass = inject(TwClassService);

  get buttonClasses() {
    return this.twClass.merge(
      'px-4 py-2 rounded',
      this.isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-100',
      this.isDisabled && 'opacity-50 cursor-not-allowed'
    );
  }
}
```

## License

MIT © Pegasus Heavy Industries LLC

