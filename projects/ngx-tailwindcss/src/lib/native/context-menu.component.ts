import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { NativeContextMenuEvent, NativeContextMenuPosition, NativeMenuItem } from './native.types';

/**
 * Context menu component (right-click menu)
 *
 * @example
 * ```html
 * <tw-context-menu [items]="menuItems" [trigger]="targetElement" (itemSelect)="onSelect($event)"></tw-context-menu>
 * ```
 */
@Component({
  selector: 'tw-native-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-native-context-menu',
  },
})
export class TwNativeContextMenuComponent implements OnDestroy {
  private readonly platformService = inject(NativeAppPlatformService);

  // Inputs
  public readonly items = input<NativeMenuItem[]>([]);
  public readonly trigger = input<HTMLElement | null>(null);

  // Outputs
  public readonly itemSelect = output<NativeContextMenuEvent>();
  public readonly opened = output<NativeContextMenuPosition>();
  public readonly closed = output();

  // State
  protected readonly isOpen = signal(false);
  protected readonly position = signal<NativeContextMenuPosition>({ x: 0, y: 0 });
  protected readonly hoveredItemId = signal<string | null>(null);

  // View
  private readonly menuRef = viewChild<ElementRef<HTMLElement>>('menu');

  private readonly contextMenuHandler = (e: Event) => {
    this.onContextMenu(e as MouseEvent);
  };
  /** The exact node the contextmenu listener is currently attached to */
  private listenerTarget: HTMLElement | Document | null = null;

  constructor() {
    // Attach to the trigger element (or document), re-binding whenever it changes
    effect(() => {
      const triggerEl = this.trigger();
      this.detachContextMenuListener();
      const target = triggerEl ?? document;
      target.addEventListener('contextmenu', this.contextMenuHandler);
      this.listenerTarget = target;
    });
  }

  public ngOnDestroy(): void {
    this.detachContextMenuListener();
  }

  private detachContextMenuListener(): void {
    if (this.listenerTarget) {
      this.listenerTarget.removeEventListener('contextmenu', this.contextMenuHandler);
      this.listenerTarget = null;
    }
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  @HostListener('document:scroll')
  protected onScroll(): void {
    this.close();
  }

  private onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;

    // We'll adjust after render if needed
    this.position.set({ x, y });
    this.isOpen.set(true);
    this.opened.emit({ x, y });
    this.clampToViewport(x, y);
  }

  /** Adjust position after a tick (once the menu is rendered) so it stays within the viewport */
  private clampToViewport(x: number, y: number): void {
    setTimeout(() => {
      const menuEl = this.menuRef()?.nativeElement;
      if (menuEl) {
        const rect = menuEl.getBoundingClientRect();

        let clampedX = x;
        let clampedY = y;
        if (clampedX + rect.width > window.innerWidth) {
          clampedX = window.innerWidth - rect.width - 8;
        }
        if (clampedY + rect.height > window.innerHeight) {
          clampedY = window.innerHeight - rect.height - 8;
        }

        this.position.set({ x: Math.max(8, clampedX), y: Math.max(8, clampedY) });
      }
    }, 0);
  }

  protected selectItem(item: NativeMenuItem, event: MouseEvent): void {
    if (item.disabled) return;

    // Handle checkbox toggle
    if (item.type === 'checkbox') {
      item.checked = !item.checked;
    }

    // Execute action
    if (item.action) {
      item.action();
    }

    this.itemSelect.emit({ item, originalEvent: event });
    this.close();
  }

  protected formatShortcut(shortcut: string): string {
    return this.platformService.formatShortcut(shortcut);
  }

  // Public methods
  public open(x: number, y: number): void {
    this.position.set({ x, y });
    this.isOpen.set(true);
    this.opened.emit({ x, y });
    this.clampToViewport(x, y);
  }

  public close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.hoveredItemId.set(null);
      this.closed.emit();
    }
  }
}
