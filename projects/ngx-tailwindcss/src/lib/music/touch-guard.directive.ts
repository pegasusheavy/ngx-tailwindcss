import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MobileSupportService, TouchGuardConfig } from './mobile-support.service';

/**
 * Directive for preventing accidental touch interactions
 *
 * @example
 * ```html
 * <!-- Require 200ms hold before action -->
 * <tw-fader twTouchGuard [minDuration]="200"></tw-fader>
 *
 * <!-- Add cooldown between actions -->
 * <button twTouchGuard [cooldownMs]="500" (guardedClick)="onAction()">
 *   Action
 * </button>
 *
 * <!-- Lock to vertical axis only -->
 * <tw-dial twTouchGuard axisLock="y"></tw-dial>
 * ```
 */
@Directive({
  selector: '[twTouchGuard]',
  standalone: true,
})
export class TwTouchGuardDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly mobileSupport = inject(MobileSupportService);

  /** Minimum touch duration (ms) before action is triggered */
  readonly minDuration = input(0);

  /** Minimum drag distance (px) before drag is recognized */
  readonly minDragDistance = input(10);

  /** Cooldown period (ms) between actions */
  readonly cooldownMs = input(100);

  /** Lock to single axis movement */
  readonly axisLock = input<'x' | 'y' | 'none'>('none');

  /** Require long press to activate */
  readonly requireLongPress = input(false);

  /** Long press duration (ms) */
  readonly longPressDuration = input(500);

  /** Enable visual feedback on touch */
  readonly showTouchFeedback = input(true);

  /** Disable touch guard (pass through all events) */
  readonly guardDisabled = input(false);

  /** Emitted when a guarded click/tap passes validation */
  readonly guardedClick = output<MouseEvent | TouchEvent>();

  /** Emitted when a long press is detected */
  readonly longPress = output<TouchEvent>();

  /** Emitted when drag starts and passes validation */
  readonly guardedDragStart = output<TouchEvent | MouseEvent>();

  /** Emitted on drag move (with delta values) */
  readonly guardedDrag = output<{ dx: number; dy: number; event: TouchEvent | MouseEvent }>();

  /** Emitted when drag ends */
  readonly guardedDragEnd = output<TouchEvent | MouseEvent>();

  private isDragging = false;
  private isLongPressTriggered = false;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartHandler!: (e: TouchEvent) => void;
  private touchMoveHandler!: (e: TouchEvent) => void;
  private touchEndHandler!: (e: TouchEvent) => void;
  private mouseDownHandler!: (e: MouseEvent) => void;
  private mouseMoveHandler!: (e: MouseEvent) => void;
  private mouseUpHandler!: (e: MouseEvent) => void;

  ngOnInit(): void {
    this.setupEventHandlers();
    this.attachListeners();
  }

  ngOnDestroy(): void {
    this.detachListeners();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }

  private setupEventHandlers(): void {
    // Touch handlers
    this.touchStartHandler = (e: TouchEvent) => {
      if (this.guardDisabled()) return;

      this.mobileSupport.startTouchTracking(e);
      this.isDragging = false;
      this.isLongPressTriggered = false;

      if (this.showTouchFeedback()) {
        this.el.nativeElement.classList.add('tw-touch-active');
      }

      // Start long press timer
      if (this.requireLongPress()) {
        this.longPressTimer = setTimeout(() => {
          this.isLongPressTriggered = true;
          this.mobileSupport.triggerHaptic('medium');
          this.longPress.emit(e);
        }, this.longPressDuration());
      }
    };

    this.touchMoveHandler = (e: TouchEvent) => {
      if (this.guardDisabled()) return;

      // Cancel long press if moving
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }

      // Check if drag threshold is met
      if (!this.isDragging && this.mobileSupport.validateDragDistance(e, this.minDragDistance())) {
        this.isDragging = true;

        if (
          this.getConfig().cooldownMs &&
          !this.mobileSupport.shouldAllowAction(this.getConfig())
        ) {
          return;
        }

        this.guardedDragStart.emit(e);
      }

      if (this.isDragging) {
        const delta = this.mobileSupport.getDragDelta(e, this.axisLock());
        this.guardedDrag.emit({ ...delta, event: e });
      }
    };

    this.touchEndHandler = (e: TouchEvent) => {
      if (this.guardDisabled()) return;

      // Clean up
      if (this.showTouchFeedback()) {
        this.el.nativeElement.classList.remove('tw-touch-active');
      }

      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }

      if (this.isDragging) {
        this.guardedDragEnd.emit(e);
        this.isDragging = false;
        return;
      }

      // Check for valid tap
      if (!this.isLongPressTriggered || !this.requireLongPress()) {
        if (this.mobileSupport.validateTouchDuration(this.minDuration())) {
          if (this.mobileSupport.shouldAllowAction(this.getConfig())) {
            this.mobileSupport.triggerHaptic('selection');
            this.guardedClick.emit(e);
          }
        }
      }
    };

    // Mouse handlers (for non-touch devices)
    this.mouseDownHandler = (e: MouseEvent) => {
      if (this.guardDisabled()) return;

      this.mobileSupport.startTouchTracking(e);
      this.isDragging = false;

      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.mouseUpHandler);
    };

    this.mouseMoveHandler = (e: MouseEvent) => {
      if (this.guardDisabled()) return;

      if (!this.isDragging && this.mobileSupport.validateDragDistance(e, this.minDragDistance())) {
        this.isDragging = true;
        this.guardedDragStart.emit(e);
      }

      if (this.isDragging) {
        const delta = this.mobileSupport.getDragDelta(e, this.axisLock());
        this.guardedDrag.emit({ ...delta, event: e });
      }
    };

    this.mouseUpHandler = (e: MouseEvent) => {
      if (this.guardDisabled()) return;

      document.removeEventListener('mousemove', this.mouseMoveHandler);
      document.removeEventListener('mouseup', this.mouseUpHandler);

      if (this.isDragging) {
        this.guardedDragEnd.emit(e);
        this.isDragging = false;
        return;
      }

      // Check for valid click
      if (this.mobileSupport.validateTouchDuration(this.minDuration())) {
        if (this.mobileSupport.shouldAllowAction(this.getConfig())) {
          this.guardedClick.emit(e);
        }
      }
    };
  }

  private attachListeners(): void {
    const el = this.el.nativeElement;

    el.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    el.addEventListener('touchmove', this.touchMoveHandler, { passive: true });
    el.addEventListener('touchend', this.touchEndHandler, { passive: true });
    el.addEventListener('mousedown', this.mouseDownHandler);
  }

  private detachListeners(): void {
    const el = this.el.nativeElement;

    el.removeEventListener('touchstart', this.touchStartHandler);
    el.removeEventListener('touchmove', this.touchMoveHandler);
    el.removeEventListener('touchend', this.touchEndHandler);
    el.removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  private getConfig(): TouchGuardConfig {
    return {
      minDuration: this.minDuration(),
      minDragDistance: this.minDragDistance(),
      cooldownMs: this.cooldownMs(),
      axisLock: this.axisLock(),
    };
  }
}
