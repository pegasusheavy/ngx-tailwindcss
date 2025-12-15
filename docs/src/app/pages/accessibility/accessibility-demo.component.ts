import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwAriaService,
  TwSrOnlyDirective,
  TwAriaExpandedDirective,
  TwAriaLabelDirective,
  TwAriaLiveDirective,
  TwAriaBusyDirective,
  TwAriaCurrentDirective,
  TwButtonComponent,
  TwCardComponent,
  TwCardHeaderDirective,
  TwCardTitleDirective,
  TwCardBodyDirective,
} from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../shared/demo-section.component';

@Component({
  selector: 'app-accessibility-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwSrOnlyDirective,
    TwAriaExpandedDirective,
    TwAriaLabelDirective,
    TwAriaLiveDirective,
    TwAriaBusyDirective,
    TwAriaCurrentDirective,
    TwButtonComponent,
    TwCardComponent,
    TwCardHeaderDirective,
    TwCardTitleDirective,
    TwCardBodyDirective,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './accessibility-demo.component.html',
})
export class AccessibilityDemoComponent {
  private ariaService = inject(TwAriaService);

  // Demo state
  isExpanded = signal(false);
  isLoading = signal(false);
  announcementCount = signal(0);

  toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }

  simulateLoading(): void {
    this.isLoading.set(true);
    this.ariaService.announce('Loading started');

    setTimeout(() => {
      this.isLoading.set(false);
      this.ariaService.announce('Loading complete');
    }, 2000);
  }

  announcePolite(): void {
    this.announcementCount.update(c => c + 1);
    this.ariaService.announce(`Polite announcement #${this.announcementCount()}`);
  }

  announceAssertive(): void {
    this.ariaService.announceAssertive('Urgent: This is an important message!');
  }

  // Code examples
  ariaServiceCode = `import { TwAriaService } from '@pegasus-heavy/ngx-tailwindcss';

@Component({...})
export class MyComponent {
  private ariaService = inject(TwAriaService);

  onDataLoaded(): void {
    // Polite announcement - doesn't interrupt
    this.ariaService.announce('Data loaded successfully');
  }

  onError(): void {
    // Assertive announcement - interrupts current speech
    this.ariaService.announceAssertive('Error: Failed to save changes');
  }

  clearAnnouncements(): void {
    this.ariaService.clearAnnouncements();
  }
}`;

  srOnlyCode = `<!-- Screen reader only text -->
<button class="p-2">
  <svg>...</svg>
  <span twSrOnly>Close dialog</span>
</button>

<!-- Focusable skip link (visible on focus) -->
<a href="#main" twSrOnly [focusable]="true">
  Skip to main content
</a>`;

  ariaExpandedCode = `<!-- Expandable section -->
<button
  [twAriaExpanded]="isExpanded()"
  [ariaControls]="'content-panel'"
  (click)="toggleExpanded()">
  {{ isExpanded() ? 'Collapse' : 'Expand' }}
</button>

<div id="content-panel" [hidden]="!isExpanded()">
  Expandable content here
</div>`;

  ariaLiveCode = `<!-- Live region for dynamic updates -->
<div twAriaLive="polite" [ariaAtomic]="true">
  {{ statusMessage }}
</div>

<!-- Assertive live region for urgent updates -->
<div twAriaLive="assertive" [ariaAtomic]="true">
  {{ errorMessage }}
</div>`;

  ariaBusyCode = `<!-- Busy state indicator -->
<div [twAriaBusy]="isLoading()" role="region">
  @if (isLoading()) {
    <tw-spinner></tw-spinner>
    <span>Loading data...</span>
  } @else {
    <div>Content loaded!</div>
  }
</div>`;

  ariaCurrentCode = `<!-- Navigation with current page -->
<nav aria-label="Main navigation">
  <a href="/" [twAriaCurrent]="currentPage === 'home' ? 'page' : false">Home</a>
  <a href="/about" [twAriaCurrent]="currentPage === 'about' ? 'page' : false">About</a>
  <a href="/contact" [twAriaCurrent]="currentPage === 'contact' ? 'page' : false">Contact</a>
</nav>

<!-- Steps with current step -->
<ol>
  <li [twAriaCurrent]="currentStep === 1 ? 'step' : false">Step 1</li>
  <li [twAriaCurrent]="currentStep === 2 ? 'step' : false">Step 2</li>
  <li [twAriaCurrent]="currentStep === 3 ? 'step' : false">Step 3</li>
</ol>`;

  ariaLabelCode = `<!-- Accessible labels -->
<button [twAriaLabel]="'Close ' + dialogTitle">
  <svg>...</svg>
</button>

<!-- Search input with label -->
<input
  type="search"
  twAriaLabel="Search products"
  placeholder="Search...">`;

  directivesListCode = `// All available ARIA directives
import {
  // Screen reader utilities
  TwSrOnlyDirective,        // Screen reader only content
  TwAnnounceDirective,      // Announce content changes

  // State directives
  TwAriaExpandedDirective,  // Expandable regions
  TwAriaSelectedDirective,  // Selected state
  TwAriaCheckedDirective,   // Checkbox/radio state
  TwAriaPressedDirective,   // Toggle button state
  TwAriaDisabledDirective,  // Disabled state
  TwAriaHiddenDirective,    // Hide from AT
  TwAriaBusyDirective,      // Loading state
  TwAriaCurrentDirective,   // Current navigation item

  // Relationship directives
  TwAriaDescribedbyDirective,
  TwAriaLabelledbyDirective,
  TwAriaLabelDirective,
  TwAriaOwnsDirective,
  TwAriaActivedescendantDirective,

  // Widget directives
  TwAriaValueDirective,     // Progress/slider values
  TwRoleDirective,          // ARIA roles
  TwAriaModalDirective,     // Modal dialogs
  TwAriaHaspopupDirective,  // Popup menus
  TwAriaLiveDirective,      // Live regions
} from '@pegasus-heavy/ngx-tailwindcss';`;

  ariaUtilsCode = `import { AriaUtils } from '@pegasus-heavy/ngx-tailwindcss';

// Generate unique IDs for ARIA relationships
const descriptionId = AriaUtils.generateId('desc'); // 'desc-a1b2c3d'
const labelId = AriaUtils.generateId('label');      // 'label-x7y8z9'

// Build describedby from multiple IDs
const describedBy = AriaUtils.describedBy(
  errorId,
  hintId,
  helpId
); // 'error-123 hint-456 help-789'

// Build labelledby from multiple IDs
const labelledBy = AriaUtils.labelledBy(
  titleId,
  subtitleId
); // 'title-abc subtitle-def'

// Get appropriate role for context
AriaUtils.getRole('button', 'menu');     // 'menuitem'
AriaUtils.getRole('dialog', 'alert');    // 'alertdialog'
AriaUtils.getRole('cell', 'columnheader'); // 'columnheader'`;
}

