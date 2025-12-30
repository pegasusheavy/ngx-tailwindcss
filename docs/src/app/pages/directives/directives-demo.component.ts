import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TwRippleDirective,
  TwTooltipDirective,
  TwClickOutsideDirective,
  TwFocusTrapDirective,
  TwAutoFocusDirective,
  TwInViewDirective,
  TwLongPressDirective,
  TwDebounceClickDirective,
  TwCopyClipboardDirective,
  TwKeyboardShortcutDirective,
  TwSwipeDirective,
  TwResizeObserverDirective,
  TwLazyImageDirective,
  TwScrollToDirective,
  TwScrollSectionDirective,
  TwHoverClassDirective,
  TwTrapScrollDirective,
} from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../shared/demo-section.component';

@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwRippleDirective,
    TwTooltipDirective,
    TwClickOutsideDirective,
    TwFocusTrapDirective,
    TwAutoFocusDirective,
    TwInViewDirective,
    TwLongPressDirective,
    TwDebounceClickDirective,
    TwCopyClipboardDirective,
    TwKeyboardShortcutDirective,
    TwSwipeDirective,
    TwResizeObserverDirective,
    TwLazyImageDirective,
    TwScrollToDirective,
    TwScrollSectionDirective,
    TwHoverClassDirective,
    TwTrapScrollDirective,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './directives-demo.component.html',
})
export class DirectivesDemoComponent {
  // State signals
  dropdownOpen = signal(false);
  clickCount = signal(0);
  debounceCount = signal(0);
  longPressCount = signal(0);
  copyStatus = signal('');
  keyPressed = signal('');
  swipeDirection = signal('');
  elementSize = signal({ width: 0, height: 0 });
  inViewStatus = signal('Not in view');
  focusTrapActive = signal(false);

  // Methods
  onClickOutside(): void {
    this.dropdownOpen.set(false);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  incrementClick(): void {
    this.clickCount.update(v => v + 1);
  }

  onDebounceClick(): void {
    this.debounceCount.update(v => v + 1);
  }

  onLongPress(): void {
    this.longPressCount.update(v => v + 1);
  }

  onCopied(event: { success: boolean }): void {
    this.copyStatus.set(event.success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => this.copyStatus.set(''), 2000);
  }

  onKeyboardShortcut(event: { shortcut: string; key: string }): void {
    this.keyPressed.set(event.shortcut.toUpperCase());
    setTimeout(() => this.keyPressed.set(''), 1500);
  }

  onSwipe(direction: string): void {
    this.swipeDirection.set(direction);
    setTimeout(() => this.swipeDirection.set(''), 1500);
  }

  onResize(event: { width: number; height: number }): void {
    this.elementSize.set({
      width: Math.round(event.width),
      height: Math.round(event.height),
    });
  }

  onInView(event: { isIntersecting: boolean }): void {
    this.inViewStatus.set(event.isIntersecting ? 'In view! 👀' : 'Not in view');
  }

  toggleFocusTrap(): void {
    this.focusTrapActive.update(v => !v);
  }

  // Code examples
  rippleCode = `<!-- Basic ripple -->
<button twRipple class="px-6 py-3 bg-blue-600 text-white rounded-lg">
  Click for Ripple
</button>

<!-- Custom ripple color -->
<button twRipple [rippleColor]="'rgba(0,0,0,0.2)'" class="px-6 py-3 bg-white">
  Dark Ripple
</button>

<!-- Centered ripple (always originates from center) -->
<button twRipple [rippleCentered]="true" class="px-6 py-3 bg-emerald-600">
  Centered Ripple
</button>`;

  tooltipCode = `<!-- Basic tooltip (top position is default) -->
<button twTooltip="This is a tooltip!">Hover me</button>

<!-- Different positions -->
<button twTooltip="Tooltip on bottom" tooltipPosition="bottom">Bottom</button>
<button twTooltip="Tooltip on left" tooltipPosition="left">Left</button>
<button twTooltip="Tooltip on right" tooltipPosition="right">Right</button>`;

  tooltipDelayCode = `<!-- Custom show delay (ms) -->
<button twTooltip="Shows after 500ms" [tooltipShowDelay]="500">
  Delayed show
</button>

<!-- Instant tooltip -->
<button twTooltip="Instant show" [tooltipShowDelay]="0">
  No delay
</button>`;

  clickOutsideCode = `dropdownOpen = signal(false);

onClickOutside(): void {
  this.dropdownOpen.set(false);
}

// Template
<div (twClickOutside)="onClickOutside()" [clickOutsideEnabled]="dropdownOpen()">
  Dropdown content...
</div>`;

  autoFocusCode = `<!-- Element receives focus when rendered -->
<input twAutoFocus type="text" placeholder="I'm focused!">

<!-- With delay -->
<input twAutoFocus [autoFocusDelay]="500" type="text">

<!-- Conditional focus -->
<input twAutoFocus [autoFocusEnabled]="shouldFocus" type="text">`;

  longPressCode = `<!-- Basic long press (default 500ms) -->
<button twLongPress (longPress)="onLongPress()">
  Long press me
</button>

<!-- Custom duration -->
<button twLongPress (longPress)="onLongPress()" [longPressDuration]="1000">
  1 second hold
</button>

<!-- With press start/end events -->
<button
  twLongPress
  (longPress)="onLongPress()"
  (pressStart)="onStart()"
  (pressEnd)="onEnd()">
  Hold to activate
</button>`;

  debounceClickCode = `<!-- Debounced click (default 300ms) -->
<button twDebounceClick (debounceClick)="onSave()">
  Save (debounced)
</button>

<!-- Custom delay -->
<button twDebounceClick (debounceClick)="onSubmit()" [debounceTime]="500">
  Submit (500ms debounce)
</button>`;

  copyClipboardCode = `<!-- Copy text to clipboard -->
<button twCopyClipboard="Text to copy" (copied)="onCopied($event)">
  Copy to Clipboard
</button>

<!-- Copy from variable -->
<button [twCopyClipboard]="myText" (copied)="onCopied($event)">
  Copy Dynamic Text
</button>

// Handler
onCopied(event: { success: boolean; text: string }) {
  console.log(event.success ? 'Copied!' : 'Failed');
}`;

  keyboardShortcutCode = `<!-- Single key shortcut -->
<div twKeyboardShortcut="ctrl+s" (shortcutPressed)="onShortcut($event)">
  Press Ctrl+S
</div>

<!-- Multiple modifiers -->
<div twKeyboardShortcut="ctrl+shift+k" (shortcutPressed)="onShortcut($event)">
  Press Ctrl+Shift+K
</div>

<!-- Escape key -->
<div twKeyboardShortcut="escape" (shortcutPressed)="onCancel()">
  Press Escape to cancel
</div>`;

  swipeCode = `<!-- Detect swipe gestures -->
<div
  twSwipe
  (swipeLeft)="onSwipe('left')"
  (swipeRight)="onSwipe('right')"
  (swipeUp)="onSwipe('up')"
  (swipeDown)="onSwipe('down')">
  Swipe in any direction
</div>

<!-- With custom threshold -->
<div twSwipe (swipeLeft)="onSwipe('left')" [swipeThreshold]="100">
  Requires 100px swipe
</div>

<!-- Generic swipe event -->
<div twSwipe (swipe)="onSwipe($event)">
  Fires on any swipe direction
</div>`;

  resizeObserverCode = `<!-- Observe element size changes -->
<div twResizeObserver (resize)="onResize($event)">
  Resize me!
  Width: {{ size.width }}px, Height: {{ size.height }}px
</div>

<!-- With debounce -->
<div twResizeObserver (resize)="onResize($event)" [resizeDebounce]="100">
  Debounced resize events
</div>

// Handler
onResize(event: { width: number; height: number; entry: ResizeObserverEntry }) {
  console.log(event.width, event.height);
}`;

  inViewCode = `<!-- Detect when element enters/leaves viewport -->
<div twInView (inView)="onVisibilityChange($event)">
  {{ isVisible ? 'In view!' : 'Out of view' }}
</div>

<!-- With threshold (50% visible) -->
<div twInView (inView)="onVisibilityChange($event)" [inViewThreshold]="0.5">
  50% visibility threshold
</div>

<!-- Separate enter/leave events -->
<div twInView (enterView)="onEnter()" (leaveView)="onLeave()" [inViewOnce]="true">
  Fires once on enter
</div>

// Handler
onVisibilityChange(event: { isIntersecting: boolean; intersectionRatio: number }) {
  console.log(event.isIntersecting);
}`;

  lazyImageCode = `<!-- Lazy load image when near viewport -->
<img twLazyImage="/path/to/image.jpg" alt="Lazy loaded image">

<!-- With placeholder -->
<img
  twLazyImage="/path/to/image.jpg"
  lazyPlaceholder="/path/to/placeholder.jpg"
  alt="With placeholder">

<!-- With root margin (preload 200px before visible) -->
<img
  twLazyImage="/path/to/image.jpg"
  lazyRootMargin="200px"
  alt="Preloaded">`;

  hoverClassCode = `<!-- Add class on hover -->
<div twHoverClass="bg-blue-100 scale-105">
  Hover to see effect
</div>

<!-- Multiple classes -->
<div twHoverClass="shadow-lg -translate-y-1 bg-white">
  Card with hover effect
</div>`;

  focusTrapCode = `<!-- Trap focus within element (for modals/dialogs) -->
<div [twFocusTrap]="modalOpen">
  <button>First focusable</button>
  <input type="text">
  <button>Last focusable</button>
  <!-- Tab will cycle within these elements -->
</div>

<!-- With auto-focus and restore focus -->
<div twFocusTrap [focusTrapAutoFocus]="true" [focusTrapRestoreFocus]="true">
  <input type="text">
  <button>Close</button>
</div>`;

  trapScrollCode = `<!-- Prevent scroll from propagating to parent -->
<div twTrapScroll class="max-h-40 overflow-auto">
  <p>Scrollable content...</p>
  <p>More content...</p>
  <p>Even more content...</p>
  <!-- Scrolling here won't scroll the page -->
</div>`;

  scrollAnchorCode = `<!-- Scroll to specific section -->
<button twScrollTo="section1">Go to Section 1</button>
<button twScrollTo="section2" [scrollBehavior]="'smooth'" [scrollOffset]="100">
  Go to Section 2
</button>

<!-- Mark scroll targets -->
<div twScrollSection="section1">Section 1 content</div>
<div twScrollSection="section2">Section 2 content</div>`;

  combinedCode = `<!-- Multiple directives on one element -->
<button
  twRipple
  twTooltip="Click me!"
  twHoverClass="scale-105"
  twDebounceClick
  (debounceClick)="onSave()">
  Ripple + Tooltip + Hover + Debounce
</button>`;
}
