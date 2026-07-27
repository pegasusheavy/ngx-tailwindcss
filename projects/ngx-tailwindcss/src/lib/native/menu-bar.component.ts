import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
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
  templateUrl: './menu-bar.component.html',
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
  public readonly menuClose = output();

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
