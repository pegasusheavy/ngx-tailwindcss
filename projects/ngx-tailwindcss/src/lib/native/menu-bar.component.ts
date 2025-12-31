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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeAppPlatformService } from './platform.service';
import { NativeMenuBarItem, NativeMenuItem } from './native.types';

/**
 * Application menu bar component
 * Provides a native-style menu bar with dropdown menus
 *
 * @example
 * ```html
 * <tw-menu-bar [items]="menuItems" (itemSelect)="onMenuSelect($event)"></tw-menu-bar>
 * ```
 */
@Component({
  selector: 'tw-menu-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="flex items-center h-7 text-sm select-none"
      role="menubar"
      [attr.aria-label]="'Application menu'"
    >
      @for (menu of items(); track menu.id) {
        <div class="relative">
          <!-- Menu trigger -->
          <button
            type="button"
            class="px-2.5 py-1 rounded-sm transition-colors"
            [class.bg-gray-200]="openMenuId() === menu.id"
            [class.dark:bg-gray-700]="openMenuId() === menu.id"
            [class.hover:bg-gray-100]="openMenuId() !== menu.id"
            [class.dark:hover:bg-gray-700/50]="openMenuId() !== menu.id"
            role="menuitem"
            [attr.aria-haspopup]="true"
            [attr.aria-expanded]="openMenuId() === menu.id"
            (click)="toggleMenu(menu.id)"
            (mouseenter)="onMenuHover(menu.id)"
          >
            <span class="text-gray-700 dark:text-gray-300">{{ menu.label }}</span>
          </button>

          <!-- Dropdown menu -->
          @if (openMenuId() === menu.id) {
            <div
              class="absolute top-full left-0 mt-0.5 min-w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              role="menu"
              [attr.aria-label]="menu.label + ' menu'"
            >
              @for (item of menu.items; track item.id) {
                @if (item.type === 'separator') {
                  <div class="h-px my-1 bg-gray-200 dark:bg-gray-700"></div>
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
                    (click)="selectItem(item)"
                    (mouseenter)="hoveredItemId.set(item.id)"
                    (mouseleave)="hoveredItemId.set(null)"
                  >
                    <!-- Icon -->
                    @if (item.icon) {
                      <span class="w-4 text-center opacity-70">{{ item.icon }}</span>
                    } @else {
                      <span class="w-4"></span>
                    }

                    <!-- Checkbox/Radio indicator -->
                    @if (item.type === 'checkbox' || item.type === 'radio') {
                      <span class="w-4 text-center">
                        @if (item.checked) {
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                          </svg>
                        }
                      </span>
                    }

                    <!-- Label -->
                    <span class="flex-1">{{ item.label }}</span>

                    <!-- Shortcut -->
                    @if (item.shortcut) {
                      <span class="ml-4 text-xs opacity-60">
                        {{ formatShortcut(item.shortcut) }}
                      </span>
                    }

                    <!-- Submenu arrow -->
                    @if (item.type === 'submenu' && item.submenu) {
                      <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"/>
                      </svg>
                    }
                  </button>
                }
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw-menu-bar block',
  },
})
export class TwMenuBarComponent {
  private readonly platformService = inject(NativeAppPlatformService);
  private readonly elementRef = inject(ElementRef);

  // Inputs
  public readonly items = input<NativeMenuBarItem[]>([]);

  // Outputs
  public readonly itemSelect = output<NativeMenuItem>();
  public readonly menuOpen = output<string>();
  public readonly menuClose = output<void>();

  // State
  protected readonly openMenuId = signal<string | null>(null);
  protected readonly hoveredItemId = signal<string | null>(null);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  protected toggleMenu(menuId: string): void {
    if (this.openMenuId() === menuId) {
      this.closeMenu();
    } else {
      this.openMenuId.set(menuId);
      this.menuOpen.emit(menuId);
    }
  }

  protected onMenuHover(menuId: string): void {
    // Only switch menus on hover if a menu is already open
    if (this.openMenuId() !== null && this.openMenuId() !== menuId) {
      this.openMenuId.set(menuId);
      this.menuOpen.emit(menuId);
    }
  }

  protected closeMenu(): void {
    if (this.openMenuId() !== null) {
      this.openMenuId.set(null);
      this.menuClose.emit();
    }
  }

  protected selectItem(item: NativeMenuItem): void {
    if (item.disabled) return;

    // Handle checkbox toggle
    if (item.type === 'checkbox') {
      item.checked = !item.checked;
    }

    // Execute action
    if (item.action) {
      item.action();
    }

    this.itemSelect.emit(item);
    this.closeMenu();
  }

  protected formatShortcut(shortcut: string): string {
    return this.platformService.formatShortcut(shortcut);
  }
}

