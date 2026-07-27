import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  HostListener,
  inject,
  Input,
  input,
  model,
  output,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom';
export type SidebarSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIDEBAR_SIZES: Record<SidebarPosition, Record<SidebarSize, string>> = {
  left: { sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[480px]', full: 'w-full' },
  right: { sm: 'w-64', md: 'w-80', lg: 'w-96', xl: 'w-[480px]', full: 'w-full' },
  top: { sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full' },
  bottom: { sm: 'h-48', md: 'h-64', lg: 'h-80', xl: 'h-96', full: 'h-full' },
};

/**
 * Sidebar/Drawer component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-sidebar [(visible)]="showSidebar" header="Menu">
 *   <p>Sidebar content here</p>
 * </tw-sidebar>
 * ```
 */
@Component({
  selector: 'tw-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  host: {
    '[class]': '"contents"',
  },
})
export class TwSidebarComponent {
  private readonly twClass = inject(TwClassService);
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether the sidebar is visible. Supports two-way binding via `[(visible)]`. */
  readonly visible = model(false);

  /**
   * Whether the sidebar is visible
   *
   * @deprecated Use `[(visible)]` instead.
   */
  @Input({ transform: booleanAttribute })
  set visibleInput(value: boolean) {
    this.visible.set(value);
  }

  /** Header text */
  readonly header = input('');

  /** Position of the sidebar */
  readonly position = input<SidebarPosition>('left');

  /** Size of the sidebar */
  readonly size = input<SidebarSize>('md');

  /** Whether to show backdrop */
  readonly showBackdrop = input(true, { transform: booleanAttribute });

  /** Whether clicking backdrop closes sidebar */
  readonly dismissible = input(true, { transform: booleanAttribute });

  /** Whether pressing Escape closes sidebar */
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  /** Whether to show close button */
  readonly showCloseButton = input(true, { transform: booleanAttribute });

  /** Whether the sidebar is modal (blocks interaction with page) */
  readonly modal = input(true, { transform: booleanAttribute });

  /** Additional classes */
  readonly classOverride = input('');

  /** Show event */
  readonly onShow = output();

  /** Hide event */
  readonly onHide = output();

  @ContentChild('twSidebarFooter', { read: TemplateRef }) footerTemplate?: TemplateRef<unknown>;

  /** Previous body overflow value, restored on hide so underlying scroll locks survive */
  private previousBodyOverflow: string | null = null;

  protected backdropClasses = computed(() => {
    return this.twClass.merge(
      'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
      this.visible() ? 'opacity-100' : 'opacity-0 pointer-events-none'
    );
  });

  protected panelClasses = computed(() => {
    const sizeClasses = this.getSizeClasses();
    const positionClasses = this.getPositionClasses();
    const transformClasses = this.getTransformClasses();

    return this.twClass.merge(
      'fixed z-50 bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/50 flex flex-col transition-transform duration-300 ease-out',
      sizeClasses,
      positionClasses,
      transformClasses,
      this.classOverride()
    );
  });

  protected headerClasses = computed(() => {
    return 'flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100';
  });

  protected contentClasses = computed(() => {
    return 'flex-1 overflow-auto p-6 text-slate-700 dark:text-slate-300';
  });

  protected footerClasses = computed(() => {
    return 'px-6 py-4 border-t border-slate-200 dark:border-slate-700';
  });

  constructor() {
    // Routes every visibility change (model writes, show()/hide(), [(visible)]
    // bindings) through the show/hide side effects.
    let first = true;
    effect(() => {
      const visible = this.visible();
      if (first) {
        first = false;
        if (!visible) return;
      }

      if (visible) {
        this.applyShowEffects();
      } else {
        this.applyHideEffects();
      }
    });
  }

  private getSizeClasses(): string {
    return SIDEBAR_SIZES[this.position()][this.size()];
  }

  private getPositionClasses(): string {
    switch (this.position()) {
      case 'left': {
        return 'top-0 left-0 h-full';
      }
      case 'right': {
        return 'top-0 right-0 h-full';
      }
      case 'top': {
        return 'top-0 left-0 w-full';
      }
      case 'bottom': {
        return 'bottom-0 left-0 w-full';
      }
    }
  }

  private getTransformClasses(): string {
    if (this.visible()) return 'translate-x-0 translate-y-0';

    switch (this.position()) {
      case 'left': {
        return '-translate-x-full';
      }
      case 'right': {
        return 'translate-x-full';
      }
      case 'top': {
        return '-translate-y-full';
      }
      case 'bottom': {
        return 'translate-y-full';
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.closeOnEscape() && this.visible()) {
      this.hide();
    }
  }

  onBackdropClick(): void {
    if (this.dismissible()) {
      this.hide();
    }
  }

  private applyShowEffects(): void {
    this.onShow.emit();

    if (this.modal() && isPlatformBrowser(this.platformId)) {
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  private applyHideEffects(): void {
    this.onHide.emit();

    if (this.modal() && isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.previousBodyOverflow ?? '';
      this.previousBodyOverflow = null;
    }
  }

  /** Show the sidebar */
  show(): void {
    this.visible.set(true);
  }

  /** Hide the sidebar */
  hide(): void {
    this.visible.set(false);
  }

  /** Toggle the sidebar visibility */
  toggle(): void {
    if (this.visible()) {
      this.hide();
    } else {
      this.show();
    }
  }
}
