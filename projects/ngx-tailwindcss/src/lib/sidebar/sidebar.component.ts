import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
  booleanAttribute,
  inject,
  HostListener,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  private twClass = inject(TwClassService);

  /** Whether the sidebar is visible */
  @Input({ transform: booleanAttribute })
  set visibleInput(value: boolean) {
    this.visible.set(value);
  }

  /** Header text */
  @Input() header = '';

  /** Position of the sidebar */
  @Input() position: SidebarPosition = 'left';

  /** Size of the sidebar */
  @Input() size: SidebarSize = 'md';

  /** Whether to show backdrop */
  @Input({ transform: booleanAttribute }) showBackdrop = true;

  /** Whether clicking backdrop closes sidebar */
  @Input({ transform: booleanAttribute }) dismissible = true;

  /** Whether pressing Escape closes sidebar */
  @Input({ transform: booleanAttribute }) closeOnEscape = true;

  /** Whether to show close button */
  @Input({ transform: booleanAttribute }) showCloseButton = true;

  /** Whether the sidebar is modal (blocks interaction with page) */
  @Input({ transform: booleanAttribute }) modal = true;

  /** Additional classes */
  @Input() classOverride = '';

  /** Visibility change event */
  @Output() visibleChange = new EventEmitter<boolean>();

  /** Show event */
  @Output() onShow = new EventEmitter<void>();

  /** Hide event */
  @Output() onHide = new EventEmitter<void>();

  @ContentChild('twSidebarFooter') footerTemplate!: TemplateRef<any>;

  protected visible = signal(false);

  protected get hasFooter(): boolean {
    return !!this.footerTemplate;
  }

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
      'fixed z-50 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out',
      sizeClasses,
      positionClasses,
      transformClasses,
      this.classOverride
    );
  });

  protected headerClasses = computed(() => {
    return 'flex items-center justify-between px-6 py-4 border-b border-slate-200';
  });

  protected contentClasses = computed(() => {
    return 'flex-1 overflow-auto p-6';
  });

  protected footerClasses = computed(() => {
    return 'px-6 py-4 border-t border-slate-200';
  });

  private getSizeClasses(): string {
    return SIDEBAR_SIZES[this.position][this.size];
  }

  private getPositionClasses(): string {
    switch (this.position) {
      case 'left':
        return 'top-0 left-0 h-full';
      case 'right':
        return 'top-0 right-0 h-full';
      case 'top':
        return 'top-0 left-0 w-full';
      case 'bottom':
        return 'bottom-0 left-0 w-full';
    }
  }

  private getTransformClasses(): string {
    if (this.visible()) return 'translate-x-0 translate-y-0';

    switch (this.position) {
      case 'left':
        return '-translate-x-full';
      case 'right':
        return 'translate-x-full';
      case 'top':
        return '-translate-y-full';
      case 'bottom':
        return 'translate-y-full';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.closeOnEscape && this.visible()) {
      this.hide();
    }
  }

  onBackdropClick(): void {
    if (this.dismissible) {
      this.hide();
    }
  }

  /** Show the sidebar */
  show(): void {
    this.visible.set(true);
    this.visibleChange.emit(true);
    this.onShow.emit();

    if (this.modal) {
      document.body.style.overflow = 'hidden';
    }
  }

  /** Hide the sidebar */
  hide(): void {
    this.visible.set(false);
    this.visibleChange.emit(false);
    this.onHide.emit();

    if (this.modal) {
      document.body.style.overflow = '';
    }
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

