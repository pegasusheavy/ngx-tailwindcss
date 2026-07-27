import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type TabsVariant = 'line' | 'enclosed' | 'pills' | 'soft-rounded';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

const TABS_VARIANTS: Record<TabsVariant, { list: string; tab: string; activeTab: string }> = {
  line: {
    list: 'border-b border-slate-200 dark:border-slate-700 gap-2',
    tab: 'border-b-2 border-transparent -mb-px text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600',
    activeTab: 'border-blue-500 text-blue-600 dark:text-blue-400',
  },
  enclosed: {
    list: 'border-b border-slate-200 dark:border-slate-700 gap-1',
    tab: 'border border-transparent rounded-t-lg -mb-px text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800',
    activeTab:
      'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-b-white dark:border-b-slate-800 text-slate-900 dark:text-slate-100',
  },
  pills: {
    list: 'gap-2',
    tab: 'rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
    activeTab: 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white',
  },
  'soft-rounded': {
    list: 'bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg gap-2',
    tab: 'rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
    activeTab: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm',
  },
};

const TABS_SIZES: Record<TabsSize, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-6 py-3',
};

/**
 * Tab panel component for tab content
 */
@Component({
  selector: 'tw-tab-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-panel.component.html',
  host: {
    '[class]': 'computedClasses()',
    role: 'tabpanel',
    '[attr.id]': '"panel-" + value()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.tabindex]': '0',
    '[attr.hidden]': '!active() ? true : null',
  },
  styles: [
    `
      @keyframes tw-tab-panel-fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      :host(.tw-tab-panel-animated) {
        animation: tw-tab-panel-fade 150ms ease-in;
      }
    `,
  ],
})
export class TwTabPanelComponent {
  private readonly twClass = inject(TwClassService);

  /** Unique identifier for this tab */
  readonly value = input('');

  /** Label for the tab (if not using template) */
  readonly label = input('');

  /** Whether the tab is disabled */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Icon to show before the label */
  readonly icon = input('');

  /** Whether to lazy load the content (rendered on first activation, then kept) */
  readonly lazy = input(false, { transform: booleanAttribute });

  /** Additional panel classes */
  readonly panelClass = input('');

  /** Whether this panel is active (managed by the parent tabs component) */
  readonly active = signal(false);

  /** ID of the tab that labels this panel (managed by the parent tabs component) */
  readonly labelledBy = signal('');

  /** Whether activation should animate (synced from the parent tabs component) */
  readonly animated = signal(true);

  /** Once a lazy panel has been activated its content stays rendered (hidden via [hidden]) */
  protected readonly hasBeenActive = signal(false);

  private readonly trackActivation = effect(() => {
    if (this.active()) {
      this.hasBeenActive.set(true);
    }
  });

  protected computedClasses = computed(() => {
    return this.twClass.merge(
      'focus:outline-none',
      this.active() ? 'block' : 'hidden',
      this.active() && this.animated() ? 'tw-tab-panel-animated' : '',
      this.panelClass()
    );
  });
}

/**
 * Tabs component for organizing content into switchable panels
 *
 * @example
 * ```html
 * <tw-tabs [(value)]="activeTab" variant="line">
 *   <tw-tab-panel value="tab1" label="Tab 1">
 *     Content for tab 1
 *   </tw-tab-panel>
 *   <tw-tab-panel value="tab2" label="Tab 2">
 *     Content for tab 2
 *   </tw-tab-panel>
 *   <tw-tab-panel value="tab3" label="Tab 3" [disabled]="true">
 *     Content for tab 3
 *   </tw-tab-panel>
 * </tw-tabs>
 * ```
 */
@Component({
  selector: 'tw-tabs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  host: {
    class: 'block',
  },
})
export class TwTabsComponent implements AfterContentInit {
  private readonly twClass = inject(TwClassService);

  @ContentChildren(TwTabPanelComponent) tabPanels!: QueryList<TwTabPanelComponent>;

  @ViewChildren('tabButton', { read: ElementRef })
  private readonly tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  /** Currently active tab value */
  @Input() value = '';

  /** Visual variant */
  readonly variant = input<TabsVariant>('line');

  /** Size of the tabs */
  readonly size = input<TabsSize>('md');

  /** Orientation of the tabs */
  readonly orientation = input<TabsOrientation>('horizontal');

  /** Whether the tab list should be full width */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  /** Whether to animate panel transitions */
  readonly animated = input(true, { transform: booleanAttribute });

  /** Additional tab list classes */
  readonly tabListClass = input('');

  /** Additional panels container classes */
  readonly panelsClass = input('');

  /** Value change event */
  @Output() valueChange = new EventEmitter<string>();

  /** Tab change event with previous and current values */
  @Output() tabChange = new EventEmitter<{ previous: string; current: string }>();

  protected panels: TwTabPanelComponent[] = [];

  ngAfterContentInit(): void {
    this.panels = this.tabPanels.toArray();

    // Set initial active tab
    if (this.value) {
      this.selectTab(this.value, false);
    } else if (this.panels.length > 0) {
      // Select first non-disabled tab
      const firstEnabled = this.panels.find(p => !p.disabled());
      if (firstEnabled) {
        this.selectTab(firstEnabled.value(), false);
      }
    }

    // Update panels list when content changes
    this.tabPanels.changes.subscribe(() => {
      this.panels = this.tabPanels.toArray();
    });
  }

  protected containerClasses = computed(() => {
    return this.twClass.merge(this.orientation() === 'vertical' ? 'flex gap-4' : 'block');
  });

  protected tabListClasses = computed(() => {
    const variantClasses = TABS_VARIANTS[this.variant()].list;

    return this.twClass.merge(
      'flex',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row',
      this.fullWidth() ? '[&>button]:flex-1' : '',
      variantClasses,
      this.tabListClass()
    );
  });

  protected panelsContainerClasses = computed(() => {
    return this.twClass.merge(
      'mt-4',
      this.orientation() === 'vertical' ? 'flex-1 mt-0' : '',
      this.panelsClass()
    );
  });

  protected getTabClasses(panel: TwTabPanelComponent): string {
    const variantConfig = TABS_VARIANTS[this.variant()];

    return this.twClass.merge(
      'font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      TABS_SIZES[this.size()],
      variantConfig.tab,
      panel.active() ? variantConfig.activeTab : ''
    );
  }

  selectTab(value: string, emit = true): void {
    const previousValue = this.value;

    this.panels.forEach(panel => {
      panel.active.set(panel.value() === value);
      panel.labelledBy.set(`tab-${panel.value()}`);
      panel.animated.set(this.animated());
    });

    this.value = value;

    if (emit) {
      this.valueChange.emit(value);
      this.tabChange.emit({ previous: previousValue, current: value });
    }
  }

  protected onKeydown(event: KeyboardEvent, currentValue: string): void {
    const enabledPanels = this.panels.filter(p => !p.disabled());
    const currentIndex = enabledPanels.findIndex(p => p.value() === currentValue);

    let newIndex = currentIndex;

    if (this.orientation() === 'horizontal') {
      if (event.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % enabledPanels.length;
      } else if (event.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + enabledPanels.length) % enabledPanels.length;
      }
    } else if (event.key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % enabledPanels.length;
    } else if (event.key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + enabledPanels.length) % enabledPanels.length;
    }

    if (event.key === 'Home') {
      newIndex = 0;
    } else if (event.key === 'End') {
      newIndex = enabledPanels.length - 1;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      const newTab = enabledPanels[newIndex];
      this.selectTab(newTab.value());

      // Focus the new tab via the view query (avoids document-wide lookups and
      // handles values that are not valid CSS identifiers)
      const panelIndex = this.panels.indexOf(newTab);
      this.tabButtons?.get(panelIndex)?.nativeElement.focus();
    }
  }

  /** Programmatically select a tab */
  select(value: string): void {
    this.selectTab(value);
  }

  /** Get the currently active panel */
  getActivePanel(): TwTabPanelComponent | undefined {
    return this.panels.find(p => p.active());
  }
}
