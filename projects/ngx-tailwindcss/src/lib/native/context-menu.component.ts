import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { NativeMenuItem, NativeContextMenuPosition, NativeContextMenuEvent } from './native.types';

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
  template: `
    @if (isOpen()) {
      <div
        class="fixed z-50 min-w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
        [style.left.px]="position().x"
        [style.top.px]="position().y"
        role="menu"
        [attr.aria-label]="'Context menu'"
      >
        @for (item of items(); track item.id) {
          @if (item.type === 'separator') {
            <div class="h-px my-1 mx-2 bg-gray-200 dark:bg-gray-700"></div>
          } @else {
            <button
              type="button"
              class="w-full px-3 py-1.5 flex items-center gap-3 text-left text-sm transition-colors"
              [class.bg-blue-500]="hoveredItemId() === item.id && !item.disabled"
              [class.text-white]="hoveredItemId() === item.id && !item.disabled"
              [class.hover:bg-blue-500]="!item.disabled"
              [class.hover:text-white]="!item.disabled"
              [class.text-gray-700]="hoveredItemId() !== item.id"
              [class.dark:text-gray-300]="hoveredItemId() !== item.id"
              [class.opacity-50]="item.disabled"
              [class.cursor-not-allowed]="item.disabled"
              role="menuitem"
              [attr.aria-disabled]="item.disabled"
              [disabled]="item.disabled"
              (click)="selectItem(item, $event)"
              (mouseenter)="hoveredItemId.set(item.id)"
              (mouseleave)="hoveredItemId.set(null)"
            >
              <!-- Icon -->
              @if (item.icon) {
                <span class="w-4 text-center opacity-70">{{ item.icon }}</span>
              }

              <!-- Checkbox indicator -->
              @if (item.type === 'checkbox') {
                <span class="w-4 flex items-center justify-center">
                  @if (item.checked) {
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                    </svg>
                  }
                </span>
              }

              <!-- Label -->
              <span class="flex-1">{{ item.label }}</span>

              <!-- Shortcut -->
              @if (item.shortcut) {
                <span class="ml-6 text-xs opacity-60 font-mono">
                  {{ formatShortcut(item.shortcut) }}
                </span>
              }

              <!-- Submenu arrow -->
              @if (item.type === 'submenu' && item.submenu?.length) {
                <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"/>
                </svg>
              }
            </button>

            <!-- Submenu -->
            @if (item.type === 'submenu' && item.submenu?.length && hoveredItemId() === item.id) {
              <div
                class="absolute left-full top-0 ml-0.5 min-w-44 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                role="menu"
              >
                @for (subItem of item.submenu; track subItem.id) {
                  @if (subItem.type === 'separator') {
                    <div class="h-px my-1 mx-2 bg-gray-200 dark:bg-gray-700"></div>
                  } @else {
                    <button
                      type="button"
                      class="w-full px-3 py-1.5 flex items-center gap-3 text-left text-sm transition-colors hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300"
                      [class.opacity-50]="subItem.disabled"
                      role="menuitem"
                      [disabled]="subItem.disabled"
                      (click)="selectItem(subItem, $event)"
                    >
                      @if (subItem.icon) {
                        <span class="w-4 text-center opacity-70">{{ subItem.icon }}</span>
                      }
                      <span class="flex-1">{{ subItem.label }}</span>
                      @if (subItem.shortcut) {
                        <span class="ml-4 text-xs opacity-60">{{ formatShortcut(subItem.shortcut) }}</span>
                      }
                    </button>
                  }
                }
              </div>
            }
          }
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-native-context-menu',
  },
})
export class TwNativeContextMenuComponent implements OnInit, OnDestroy {
  private readonly platformService = inject(NativeAppPlatformService);

  // Inputs
  public readonly items = input<NativeMenuItem[]>([]);
  public readonly trigger = input<HTMLElement | null>(null);

  // Outputs
  public readonly itemSelect = output<NativeContextMenuEvent>();
  public readonly opened = output<NativeContextMenuPosition>();
  public readonly closed = output<void>();

  // State
  protected readonly isOpen = signal(false);
  protected readonly position = signal<NativeContextMenuPosition>({ x: 0, y: 0 });
  protected readonly hoveredItemId = signal<string | null>(null);

  private contextMenuHandler = (e: MouseEvent) => this.onContextMenu(e);

  public ngOnInit(): void {
    // Attach to trigger element
    const triggerEl = this.trigger();
    if (triggerEl) {
      triggerEl.addEventListener('contextmenu', this.contextMenuHandler);
    } else {
      // If no trigger, listen on document
      document.addEventListener('contextmenu', this.contextMenuHandler);
    }
  }

  public ngOnDestroy(): void {
    const triggerEl = this.trigger();
    if (triggerEl) {
      triggerEl.removeEventListener('contextmenu', this.contextMenuHandler);
    } else {
      document.removeEventListener('contextmenu', this.contextMenuHandler);
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

    // Calculate position, ensuring menu stays within viewport
    let x = event.clientX;
    let y = event.clientY;

    // We'll adjust after render if needed
    this.position.set({ x, y });
    this.isOpen.set(true);
    this.opened.emit({ x, y });

    // Adjust position after a tick to ensure menu is rendered
    setTimeout(() => {
      const menuEl = document.querySelector('.tw-context-menu > div') as HTMLElement;
      if (menuEl) {
        const rect = menuEl.getBoundingClientRect();

        if (x + rect.width > window.innerWidth) {
          x = window.innerWidth - rect.width - 8;
        }
        if (y + rect.height > window.innerHeight) {
          y = window.innerHeight - rect.height - 8;
        }

        this.position.set({ x: Math.max(8, x), y: Math.max(8, y) });
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
  }

  public close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.hoveredItemId.set(null);
      this.closed.emit();
    }
  }
}

