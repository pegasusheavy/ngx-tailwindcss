import { Injectable, signal } from '@angular/core';

/**
 * Haptic feedback types supported by devices
 */
export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | 'impact';

/**
 * Touch guard configuration for preventing accidental interactions
 */
export interface TouchGuardConfig {
  /** Minimum touch duration (ms) before action is triggered */
  minDuration?: number;
  /** Minimum drag distance (px) before drag is recognized */
  minDragDistance?: number;
  /** Cooldown period (ms) between actions */
  cooldownMs?: number;
  /** Lock to single axis movement */
  axisLock?: 'x' | 'y' | 'none';
  /** Require confirmation for destructive actions */
  requireConfirm?: boolean;
}

/**
 * Pinch gesture state
 */
export interface PinchGestureState {
  scale: number;
  centerX: number;
  centerY: number;
  initialDistance: number;
  currentDistance: number;
}

/**
 * Swipe gesture direction for music components
 */
export type MusicSwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Swipe gesture result
 */
export interface SwipeGestureResult {
  direction: MusicSwipeDirection;
  velocity: number;
  distance: number;
  duration: number;
}

/**
 * Service for mobile touch interactions and haptic feedback
 *
 * @example
 * ```typescript
 * constructor(private mobileSupport: MobileSupportService) {
 *   this.mobileSupport.triggerHaptic('selection');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MobileSupportService {
  private readonly _hapticEnabled = signal(true);
  private readonly _touchGuardEnabled = signal(true);
  private lastActionTime = 0;
  private touchStartTime = 0;
  private touchStartX = 0;
  private touchStartY = 0;

  /** Whether haptic feedback is enabled */
  readonly hapticEnabled = this._hapticEnabled.asReadonly();

  /** Whether touch guards are enabled */
  readonly touchGuardEnabled = this._touchGuardEnabled.asReadonly();

  /** Whether the device supports haptic feedback */
  readonly supportsHaptic = signal(this.checkHapticSupport());

  /** Whether the device has touch support */
  readonly isTouchDevice = signal(this.checkTouchSupport());

  /** Current device orientation */
  readonly orientation = signal<'portrait' | 'landscape'>(this.getOrientation());

  constructor() {
    // Listen for orientation changes
    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', () => {
        this.orientation.set(this.getOrientation());
      });

      window.addEventListener('resize', () => {
        this.orientation.set(this.getOrientation());
      });
    }
  }

  // =========================================================================
  // HAPTIC FEEDBACK
  // =========================================================================

  /**
   * Enable or disable haptic feedback globally
   */
  setHapticEnabled(enabled: boolean): void {
    this._hapticEnabled.set(enabled);
  }

  /**
   * Trigger haptic feedback
   * @param type The type of haptic feedback
   */
  triggerHaptic(type: HapticFeedbackType = 'light'): void {
    if (!this._hapticEnabled() || !this.supportsHaptic()) return;

    // Use Vibration API
    if ('vibrate' in navigator) {
      const patterns: Record<HapticFeedbackType, number[]> = {
        light: [10],
        medium: [20],
        heavy: [40],
        selection: [5],
        success: [10, 50, 10],
        warning: [20, 40, 20],
        error: [50, 50, 50],
        impact: [30],
      };

      navigator.vibrate(patterns[type]);
    }

    // iOS Taptic Engine (if available via webkit)
    this.triggerIOSHaptic(type);
  }

  /**
   * Trigger haptic feedback for value change (e.g., dial rotation)
   * @param intensity 0-1 intensity value
   */
  triggerValueChangeHaptic(intensity: number = 0.5): void {
    if (!this._hapticEnabled() || !this.supportsHaptic()) return;

    const duration = Math.round(5 + intensity * 15);
    if ('vibrate' in navigator) {
      navigator.vibrate([duration]);
    }
  }

  /**
   * Trigger haptic feedback for snap points (e.g., detent values)
   */
  triggerSnapHaptic(): void {
    this.triggerHaptic('medium');
  }

  /**
   * Trigger haptic feedback for boundary hit (e.g., max/min reached)
   */
  triggerBoundaryHaptic(): void {
    this.triggerHaptic('heavy');
  }

  private triggerIOSHaptic(type: HapticFeedbackType): void {
    // Check for iOS haptic engine via webkit
    const webkit = (window as unknown as Record<string, unknown>)['webkit'] as
      | Record<string, unknown>
      | undefined;
    if (webkit?.['messageHandlers']) {
      const handlers = webkit['messageHandlers'] as Record<string, unknown>;
      const haptic = handlers['haptic'] as { postMessage?: (msg: unknown) => void } | undefined;
      if (haptic?.postMessage) {
        const iosTypes: Record<HapticFeedbackType, string> = {
          light: 'light',
          medium: 'medium',
          heavy: 'heavy',
          selection: 'selection',
          success: 'notification-success',
          warning: 'notification-warning',
          error: 'notification-error',
          impact: 'impact-medium',
        };
        haptic.postMessage({ type: iosTypes[type] });
      }
    }
  }

  private checkHapticSupport(): boolean {
    if (typeof navigator === 'undefined') return false;
    return 'vibrate' in navigator;
  }

  // =========================================================================
  // TOUCH GUARDS
  // =========================================================================

  /**
   * Enable or disable touch guards globally
   */
  setTouchGuardEnabled(enabled: boolean): void {
    this._touchGuardEnabled.set(enabled);
  }

  /**
   * Check if an action should be allowed based on touch guard config
   */
  shouldAllowAction(config: TouchGuardConfig = {}): boolean {
    if (!this._touchGuardEnabled()) return true;

    const now = Date.now();
    const cooldown = config.cooldownMs ?? 100;

    // Check cooldown
    if (now - this.lastActionTime < cooldown) {
      return false;
    }

    this.lastActionTime = now;
    return true;
  }

  /**
   * Start tracking a touch for guard validation
   */
  startTouchTracking(event: TouchEvent | MouseEvent): void {
    this.touchStartTime = Date.now();

    if ('touches' in event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    } else {
      this.touchStartX = event.clientX;
      this.touchStartY = event.clientY;
    }
  }

  /**
   * Validate touch duration
   */
  validateTouchDuration(minDuration: number = 0): boolean {
    const duration = Date.now() - this.touchStartTime;
    return duration >= minDuration;
  }

  /**
   * Validate drag distance
   */
  validateDragDistance(event: TouchEvent | MouseEvent, minDistance: number = 10): boolean {
    let currentX: number, currentY: number;

    if ('touches' in event) {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    const dx = currentX - this.touchStartX;
    const dy = currentY - this.touchStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance >= minDistance;
  }

  /**
   * Get drag delta with optional axis lock
   */
  getDragDelta(
    event: TouchEvent | MouseEvent,
    axisLock: 'x' | 'y' | 'none' = 'none'
  ): { dx: number; dy: number } {
    let currentX: number, currentY: number;

    if ('touches' in event) {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    let dx = currentX - this.touchStartX;
    let dy = currentY - this.touchStartY;

    if (axisLock === 'x') {
      dy = 0;
    } else if (axisLock === 'y') {
      dx = 0;
    }

    return { dx, dy };
  }

  // =========================================================================
  // GESTURE RECOGNITION
  // =========================================================================

  /**
   * Calculate pinch gesture state from touch event
   */
  calculatePinchState(event: TouchEvent): PinchGestureState | null {
    if (event.touches.length < 2) return null;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    return {
      scale: 1,
      centerX: (touch1.clientX + touch2.clientX) / 2,
      centerY: (touch1.clientY + touch2.clientY) / 2,
      initialDistance: currentDistance,
      currentDistance,
    };
  }

  /**
   * Update pinch gesture state and calculate scale
   */
  updatePinchState(event: TouchEvent, initialState: PinchGestureState): PinchGestureState {
    if (event.touches.length < 2) return initialState;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    return {
      ...initialState,
      scale: currentDistance / initialState.initialDistance,
      centerX: (touch1.clientX + touch2.clientX) / 2,
      centerY: (touch1.clientY + touch2.clientY) / 2,
      currentDistance,
    };
  }

  /**
   * Detect swipe gesture
   */
  detectSwipe(
    event: TouchEvent | MouseEvent,
    minDistance: number = 50,
    maxDuration: number = 500
  ): SwipeGestureResult | null {
    const duration = Date.now() - this.touchStartTime;
    if (duration > maxDuration) return null;

    let endX: number, endY: number;
    if ('changedTouches' in event) {
      endX = event.changedTouches[0].clientX;
      endY = event.changedTouches[0].clientY;
    } else {
      endX = event.clientX;
      endY = event.clientY;
    }

    const dx = endX - this.touchStartX;
    const dy = endY - this.touchStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) return null;

    const velocity = distance / duration;
    let direction: MusicSwipeDirection;

    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }

    return { direction, velocity, distance, duration };
  }

  // =========================================================================
  // DEVICE DETECTION
  // =========================================================================

  private checkTouchSupport(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private getOrientation(): 'portrait' | 'landscape' {
    if (typeof window === 'undefined') return 'portrait';

    if (window.screen?.orientation?.type) {
      return window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape';
    }

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  /**
   * Check if device is likely a tablet
   */
  isTablet(): boolean {
    if (typeof window === 'undefined') return false;

    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const maxDimension = Math.max(window.innerWidth, window.innerHeight);

    // Tablet: larger than phone, smaller than desktop
    return minDimension >= 600 && maxDimension <= 1400 && this.isTouchDevice();
  }

  /**
   * Check if device is likely a phone
   */
  isPhone(): boolean {
    if (typeof window === 'undefined') return false;

    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    return minDimension < 600 && this.isTouchDevice();
  }

  /**
   * Get recommended control size based on device
   */
  getRecommendedControlSize(): 'sm' | 'md' | 'lg' {
    if (this.isPhone()) return 'lg'; // Larger for touch
    if (this.isTablet()) return 'md';
    return 'sm';
  }
}
