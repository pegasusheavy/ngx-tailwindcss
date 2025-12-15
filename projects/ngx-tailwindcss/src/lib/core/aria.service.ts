import { Injectable, inject, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Service for managing ARIA live regions and announcements for screen readers.
 * Provides utilities for making dynamic content accessible.
 */
@Injectable({ providedIn: 'root' })
export class TwAriaService {
  private document = inject(DOCUMENT);
  private liveRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  private announceQueue = signal<string[]>([]);
  private isProcessing = signal(false);

  /**
   * Announce a message to screen readers using a polite live region.
   * Messages are queued and announced sequentially.
   */
  announce(message: string, delay = 100): void {
    this.announceQueue.update(queue => [...queue, message]);
    this.processQueue(delay);
  }

  /**
   * Announce an urgent message to screen readers using an assertive live region.
   * This interrupts the current speech.
   */
  announceAssertive(message: string): void {
    this.ensureAssertiveRegion();
    if (this.assertiveRegion) {
      this.assertiveRegion.textContent = '';
      setTimeout(() => {
        if (this.assertiveRegion) {
          this.assertiveRegion.textContent = message;
        }
      }, 50);
    }
  }

  /**
   * Clear any pending announcements.
   */
  clearAnnouncements(): void {
    this.announceQueue.set([]);
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
    if (this.assertiveRegion) {
      this.assertiveRegion.textContent = '';
    }
  }

  private processQueue(delay: number): void {
    if (this.isProcessing()) return;

    this.isProcessing.set(true);
    this.ensureLiveRegion();

    const process = () => {
      const queue = this.announceQueue();
      if (queue.length === 0) {
        this.isProcessing.set(false);
        return;
      }

      const [message, ...rest] = queue;
      this.announceQueue.set(rest);

      if (this.liveRegion) {
        this.liveRegion.textContent = '';
        setTimeout(() => {
          if (this.liveRegion) {
            this.liveRegion.textContent = message;
          }
          setTimeout(process, delay + 500);
        }, 50);
      }
    };

    setTimeout(process, delay);
  }

  private ensureLiveRegion(): void {
    if (this.liveRegion) return;

    this.liveRegion = this.document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('role', 'status');
    this.applyScreenReaderOnlyStyles(this.liveRegion);
    this.document.body.appendChild(this.liveRegion);
  }

  private ensureAssertiveRegion(): void {
    if (this.assertiveRegion) return;

    this.assertiveRegion = this.document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.setAttribute('role', 'alert');
    this.applyScreenReaderOnlyStyles(this.assertiveRegion);
    this.document.body.appendChild(this.assertiveRegion);
  }

  private applyScreenReaderOnlyStyles(element: HTMLElement): void {
    Object.assign(element.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
  }
}

/**
 * Utility functions for generating ARIA attributes.
 */
export const AriaUtils = {
  /**
   * Generate a unique ID for ARIA relationships.
   */
  generateId(prefix = 'tw'): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  },

  /**
   * Create ARIA describedby value from multiple IDs.
   */
  describedBy(...ids: (string | null | undefined)[]): string | null {
    const validIds = ids.filter(Boolean);
    return validIds.length > 0 ? validIds.join(' ') : null;
  },

  /**
   * Create ARIA labelledby value from multiple IDs.
   */
  labelledBy(...ids: (string | null | undefined)[]): string | null {
    const validIds = ids.filter(Boolean);
    return validIds.length > 0 ? validIds.join(' ') : null;
  },

  /**
   * Get appropriate role for a component based on context.
   */
  getRole(component: string, context?: string): string {
    const roles: Record<string, Record<string, string>> = {
      button: { default: 'button', menu: 'menuitem', toolbar: 'button' },
      alert: { default: 'alert', status: 'status' },
      dialog: { default: 'dialog', alert: 'alertdialog' },
      tab: { default: 'tab' },
      tabpanel: { default: 'tabpanel' },
      tablist: { default: 'tablist' },
      menu: { default: 'menu', menubar: 'menubar' },
      menuitem: { default: 'menuitem', checkbox: 'menuitemcheckbox', radio: 'menuitemradio' },
      listbox: { default: 'listbox' },
      option: { default: 'option' },
      tree: { default: 'tree' },
      treeitem: { default: 'treeitem' },
      grid: { default: 'grid', treegrid: 'treegrid' },
      row: { default: 'row' },
      cell: { default: 'cell', gridcell: 'gridcell', columnheader: 'columnheader', rowheader: 'rowheader' },
      progressbar: { default: 'progressbar' },
      slider: { default: 'slider' },
      spinbutton: { default: 'spinbutton' },
      switch: { default: 'switch' },
      tooltip: { default: 'tooltip' },
      navigation: { default: 'navigation' },
      region: { default: 'region' },
      search: { default: 'search' },
      form: { default: 'form' },
      banner: { default: 'banner' },
      complementary: { default: 'complementary' },
      contentinfo: { default: 'contentinfo' },
      main: { default: 'main' },
    };

    const componentRoles = roles[component];
    if (!componentRoles) return component;

    return componentRoles[context || 'default'] || componentRoles['default'];
  },
};

