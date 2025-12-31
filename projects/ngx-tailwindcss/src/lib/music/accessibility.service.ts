import { Injectable, signal, computed, OnDestroy } from '@angular/core';

/**
 * Screen reader announcement priority levels
 */
export type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Announcement queue item
 */
interface QueuedAnnouncement {
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderEnabled: boolean;
  largeText: boolean;
}

/**
 * Service for managing accessibility features in music components
 *
 * @example
 * ```typescript
 * constructor(private a11y: MusicAccessibilityService) {
 *   // Announce value changes
 *   this.a11y.announce('Volume set to 75%');
 *
 *   // Check motion preference
 *   if (this.a11y.prefersReducedMotion()) {
 *     // Use instant transitions
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MusicAccessibilityService implements OnDestroy {
  // Live region elements
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  private announcementQueue: QueuedAnnouncement[] = [];
  private isProcessingQueue = false;
  private cleanupTimer: ReturnType<typeof setTimeout> | null = null;

  // Media query listeners
  private reducedMotionQuery: MediaQueryList | null = null;
  private highContrastQuery: MediaQueryList | null = null;
  private reducedMotionHandler: ((e: MediaQueryListEvent) => void) | null = null;
  private highContrastHandler: ((e: MediaQueryListEvent) => void) | null = null;

  // Reactive preferences
  private readonly _reducedMotion = signal(false);
  private readonly _highContrast = signal(false);
  private readonly _screenReaderHints = signal(true);

  /** Whether the user prefers reduced motion */
  readonly prefersReducedMotion = this._reducedMotion.asReadonly();

  /** Whether the user prefers high contrast */
  readonly prefersHighContrast = this._highContrast.asReadonly();

  /** Whether to show screen reader hints */
  readonly screenReaderHints = this._screenReaderHints.asReadonly();

  /** Combined preferences object */
  readonly preferences = computed(
    (): AccessibilityPreferences => ({
      reducedMotion: this._reducedMotion(),
      highContrast: this._highContrast(),
      screenReaderEnabled: this._screenReaderHints(),
      largeText: this.checkLargeText(),
    })
  );

  constructor() {
    if (typeof window !== 'undefined') {
      this.initLiveRegions();
      this.initMediaQueryListeners();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // =========================================================================
  // SCREEN READER ANNOUNCEMENTS
  // =========================================================================

  /**
   * Announce a message to screen readers
   * @param message The message to announce
   * @param priority Priority level ('polite' or 'assertive')
   */
  announce(message: string, priority: AnnouncementPriority = 'polite'): void {
    if (!message.trim()) return;

    this.announcementQueue.push({
      message,
      priority,
      timestamp: Date.now(),
    });

    if (!this.isProcessingQueue) {
      this.processAnnouncementQueue();
    }
  }

  /**
   * Announce a value change (debounced for rapid changes)
   */
  announceValueChange(label: string, value: string | number, unit?: string): void {
    const message = unit ? `${label}: ${value} ${unit}` : `${label}: ${value}`;
    this.announce(message, 'polite');
  }

  /**
   * Announce an important state change
   */
  announceStateChange(message: string): void {
    this.announce(message, 'assertive');
  }

  /**
   * Announce playback status
   */
  announcePlaybackStatus(status: 'playing' | 'paused' | 'stopped' | 'buffering'): void {
    const messages: Record<string, string> = {
      playing: 'Playback started',
      paused: 'Playback paused',
      stopped: 'Playback stopped',
      buffering: 'Buffering...',
    };
    this.announce(messages[status], 'polite');
  }

  /**
   * Announce transport position
   */
  announcePosition(current: number, total: number): void {
    const currentFormatted = this.formatTime(current);
    const totalFormatted = this.formatTime(total);
    this.announce(`Position: ${currentFormatted} of ${totalFormatted}`, 'polite');
  }

  /**
   * Announce an error
   */
  announceError(message: string): void {
    this.announce(`Error: ${message}`, 'assertive');
  }

  /**
   * Clear the announcement queue
   */
  clearAnnouncements(): void {
    this.announcementQueue = [];
    if (this.politeRegion) this.politeRegion.textContent = '';
    if (this.assertiveRegion) this.assertiveRegion.textContent = '';
  }

  private processAnnouncementQueue(): void {
    if (this.announcementQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const announcement = this.announcementQueue.shift()!;

    const region = announcement.priority === 'assertive' ? this.assertiveRegion : this.politeRegion;

    if (region) {
      // Clear first to ensure re-announcement of same message
      region.textContent = '';

      // Use requestAnimationFrame for proper timing
      requestAnimationFrame(() => {
        region.textContent = announcement.message;

        // Process next announcement after delay
        setTimeout(
          () => {
            this.processAnnouncementQueue();
          },
          announcement.priority === 'assertive' ? 500 : 1000
        );
      });
    }
  }

  private initLiveRegions(): void {
    // Create polite live region
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('role', 'status');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.applyScreenReaderOnlyStyles(this.politeRegion);
    this.politeRegion.id = 'tw-music-live-polite';
    document.body.appendChild(this.politeRegion);

    // Create assertive live region
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('role', 'alert');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.applyScreenReaderOnlyStyles(this.assertiveRegion);
    this.assertiveRegion.id = 'tw-music-live-assertive';
    document.body.appendChild(this.assertiveRegion);
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

  // =========================================================================
  // REDUCED MOTION
  // =========================================================================

  /**
   * Check if reduced motion is preferred (one-time check)
   */
  checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Enable or disable screen reader hints
   */
  setScreenReaderHints(enabled: boolean): void {
    this._screenReaderHints.set(enabled);
  }

  /**
   * Get animation duration based on reduced motion preference
   * @param normalDuration Duration in ms when motion is allowed
   * @param reducedDuration Duration in ms when reduced motion is preferred (default: 0)
   */
  getAnimationDuration(normalDuration: number, reducedDuration: number = 0): number {
    return this._reducedMotion() ? reducedDuration : normalDuration;
  }

  /**
   * Get transition class based on reduced motion preference
   */
  getTransitionClass(normalClass: string, reducedClass: string = ''): string {
    return this._reducedMotion() ? reducedClass : normalClass;
  }

  // =========================================================================
  // HIGH CONTRAST
  // =========================================================================

  /**
   * Check if high contrast is preferred (one-time check)
   */
  checkHighContrast(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for forced-colors (Windows High Contrast)
    if (window.matchMedia('(forced-colors: active)').matches) {
      return true;
    }

    // Check for prefers-contrast
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      return true;
    }

    return false;
  }

  /**
   * Get variant based on high contrast preference
   * @param normalVariant The normal variant
   * @param highContrastVariant The high contrast variant (default: 'highContrast')
   */
  getVariant<T extends string>(normalVariant: T, highContrastVariant: T = 'highContrast' as T): T {
    return this._highContrast() ? highContrastVariant : normalVariant;
  }

  // =========================================================================
  // OTHER ACCESSIBILITY FEATURES
  // =========================================================================

  /**
   * Check if large text is preferred
   */
  checkLargeText(): boolean {
    if (typeof window === 'undefined') return false;

    // Check root font size (16px is default)
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rootFontSize > 16;
  }

  /**
   * Check if a screen reader is likely active
   * Note: This is a heuristic, not a guarantee
   */
  isScreenReaderLikely(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for common screen reader indicators
    return (
      // Check for ARIA live region activity
      document.querySelector('[aria-live]') !== null ||
      // Check for role="application" (often added by screen readers)
      document.querySelector('[role="application"]') !== null
    );
  }

  /**
   * Generate a unique ID for ARIA relationships
   */
  generateId(prefix: string = 'tw-music'): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Format time for screen reader announcement
   */
  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0 seconds';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }
    if (secs > 0 || parts.length === 0) {
      parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
    }

    return parts.join(', ');
  }

  /**
   * Format percentage for screen reader
   */
  formatPercentage(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)} percent`;
  }

  /**
   * Format frequency for screen reader
   */
  formatFrequency(hz: number): string {
    if (hz >= 1000) {
      return `${(hz / 1000).toFixed(1)} kilohertz`;
    }
    return `${hz} hertz`;
  }

  /**
   * Format decibels for screen reader
   */
  formatDecibels(db: number): string {
    if (db === -Infinity) return 'negative infinity decibels';
    return `${db.toFixed(1)} decibels`;
  }

  // =========================================================================
  // MEDIA QUERY LISTENERS
  // =========================================================================

  private initMediaQueryListeners(): void {
    // Reduced motion
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._reducedMotion.set(this.reducedMotionQuery.matches);

    this.reducedMotionHandler = (e: MediaQueryListEvent) => {
      this._reducedMotion.set(e.matches);
    };
    this.reducedMotionQuery.addEventListener('change', this.reducedMotionHandler);

    // High contrast
    this.highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    this._highContrast.set(this.highContrastQuery.matches || this.checkHighContrast());

    this.highContrastHandler = (e: MediaQueryListEvent) => {
      this._highContrast.set(e.matches);
    };
    this.highContrastQuery.addEventListener('change', this.highContrastHandler);
  }

  private cleanup(): void {
    // Remove live regions
    if (this.politeRegion?.parentNode) {
      this.politeRegion.parentNode.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion?.parentNode) {
      this.assertiveRegion.parentNode.removeChild(this.assertiveRegion);
    }

    // Remove media query listeners
    if (this.reducedMotionQuery && this.reducedMotionHandler) {
      this.reducedMotionQuery.removeEventListener('change', this.reducedMotionHandler);
    }
    if (this.highContrastQuery && this.highContrastHandler) {
      this.highContrastQuery.removeEventListener('change', this.highContrastHandler);
    }

    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
  }
}
