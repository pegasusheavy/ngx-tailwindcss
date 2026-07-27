import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type SplitterDirection = 'horizontal' | 'vertical';
export type SplitterGutterSize = 'sm' | 'md' | 'lg';

/** Gutter thickness in pixels, kept in sync with GUTTER_CLASSES (w-1/w-2/w-3 = 4/8/12px). */
const GUTTER_SIZES: Record<SplitterGutterSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

/** Static Tailwind classes per gutter size/orientation (no runtime-generated class names). */
const GUTTER_CLASSES: Record<SplitterGutterSize, { horizontal: string; vertical: string }> = {
  sm: { horizontal: 'w-1 h-full cursor-col-resize', vertical: 'h-1 w-full cursor-row-resize' },
  md: { horizontal: 'w-2 h-full cursor-col-resize', vertical: 'h-2 w-full cursor-row-resize' },
  lg: { horizontal: 'w-3 h-full cursor-col-resize', vertical: 'h-3 w-full cursor-row-resize' },
};

/** Percentage step used when resizing with the keyboard. */
const KEYBOARD_RESIZE_STEP = 2;

/**
 * Splitter component for creating resizable split pane layouts.
 *
 * Mark the two panes with the `twSplitterPaneStart` and `twSplitterPaneEnd`
 * attributes. Content marked with the plain `twSplitterPane` attribute (or a
 * `tw-splitter-pane` element) is projected into the first pane.
 *
 * @example
 * ```html
 * <!-- Horizontal split -->
 * <tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
 *   <div twSplitterPaneStart>Left Panel</div>
 *   <div twSplitterPaneEnd>Right Panel</div>
 * </tw-splitter>
 *
 * <!-- Vertical split with min sizes -->
 * <tw-splitter direction="vertical" [minSizes]="[100, 200]">
 *   <div twSplitterPaneStart>Top Panel</div>
 *   <div twSplitterPaneEnd>Bottom Panel</div>
 * </tw-splitter>
 * ```
 */
@Component({
  selector: 'tw-splitter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './splitter.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class TwSplitterComponent implements AfterViewInit, OnDestroy {
  private readonly twClass = inject(TwClassService);

  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('gutter') gutterRef!: ElementRef<HTMLElement>;

  /** Direction of the split */
  readonly direction = input<SplitterDirection>('horizontal');

  /** Initial sizes as percentages (should sum to 100) */
  readonly initialSizes = input<[number, number]>([50, 50]);

  /** Minimum sizes in pixels for each pane */
  readonly minSizes = input<[number, number]>([50, 50]);

  /** Size of the gutter */
  readonly gutterSize = input<SplitterGutterSize>('md');

  /** Whether the splitter is disabled */
  readonly disabled = input(false);

  /** Whether to show visual gutter */
  readonly showGutter = input(true);

  /** Additional CSS classes */
  readonly class = input('');

  /** Emits when sizes change */
  @Output() sizesChange = new EventEmitter<[number, number]>();

  /** Emits when dragging starts */
  @Output() dragStart = new EventEmitter<void>();

  /** Emits when dragging ends */
  @Output() dragEnd = new EventEmitter<void>();

  protected sizes = signal<[number, number]>([50, 50]);
  protected isDragging = signal(false);

  private startPos = 0;
  private startSizes: [number, number] = [50, 50];
  private containerSize = 0;

  private readonly mouseMoveHandler = this.onMouseMove.bind(this);
  private readonly mouseUpHandler = this.onMouseUp.bind(this);
  private readonly touchMoveHandler = this.onTouchMove.bind(this);
  private readonly touchEndHandler = this.onTouchEnd.bind(this);

  ngAfterViewInit(): void {
    this.sizes.set([...this.initialSizes()] as [number, number]);
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  protected readonly containerClasses = computed(() => {
    return this.twClass.merge(
      'flex h-full w-full overflow-hidden',
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class()
    );
  });

  protected readonly paneClasses = computed(() => {
    return this.twClass.merge(
      'overflow-auto',
      this.direction() === 'horizontal' ? 'h-full' : 'w-full'
    );
  });

  protected readonly gutterClasses = computed(() => {
    const orientationClasses =
      GUTTER_CLASSES[this.gutterSize()][
        this.direction() === 'horizontal' ? 'horizontal' : 'vertical'
      ];

    return this.twClass.merge(
      'flex items-center justify-center flex-shrink-0 transition-colors',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
      orientationClasses,
      this.showGutter() ? 'bg-slate-200 hover:bg-slate-300' : 'bg-transparent hover:bg-slate-200',
      this.isDragging() ? 'bg-blue-400' : '',
      this.disabled() ? 'cursor-default pointer-events-none opacity-50' : ''
    );
  });

  protected readonly gutterHandleClasses = computed(() => {
    return this.twClass.merge(
      'rounded-full bg-slate-400 transition-all',
      this.direction() === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8',
      this.isDragging() ? 'bg-blue-600 scale-125' : ''
    );
  });

  protected readonly gutterAriaValueNow = computed(() => Math.round(this.sizes()[0]));

  protected onGutterMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.startDrag(this.direction() === 'horizontal' ? event.clientX : event.clientY);
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  protected onGutterTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.startDrag(this.direction() === 'horizontal' ? touch.clientX : touch.clientY);
    document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    document.addEventListener('touchend', this.touchEndHandler);
  }

  protected onGutterKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const isHorizontal = this.direction() === 'horizontal';
    const decreaseKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const increaseKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    let delta: number;
    if (event.key === decreaseKey) {
      delta = -KEYBOARD_RESIZE_STEP;
    } else if (event.key === increaseKey) {
      delta = KEYBOARD_RESIZE_STEP;
    } else {
      return;
    }

    event.preventDefault();
    this.resizeByPercent(delta);
  }

  private resizeByPercent(deltaPercent: number): void {
    const [size0, size1] = this.sizes();
    let newSize0 = size0 + deltaPercent;
    let newSize1 = size1 - deltaPercent;

    const containerEl = this.containerRef?.nativeElement;
    const containerSize = containerEl
      ? this.direction() === 'horizontal'
        ? containerEl.offsetWidth
        : containerEl.offsetHeight
      : 0;
    const availableSize = containerSize - GUTTER_SIZES[this.gutterSize()];

    if (availableSize > 0) {
      const minPercent0 = (this.minSizes()[0] / availableSize) * 100;
      const minPercent1 = (this.minSizes()[1] / availableSize) * 100;

      if (newSize0 < minPercent0) {
        newSize0 = minPercent0;
        newSize1 = 100 - minPercent0;
      }
      if (newSize1 < minPercent1) {
        newSize1 = minPercent1;
        newSize0 = 100 - minPercent1;
      }
    } else {
      newSize0 = Math.min(Math.max(newSize0, 0), 100);
      newSize1 = 100 - newSize0;
    }

    this.sizes.set([newSize0, newSize1]);
    this.sizesChange.emit([newSize0, newSize1]);
  }

  private startDrag(pos: number): void {
    this.isDragging.set(true);
    this.startPos = pos;
    this.startSizes = [...this.sizes()] as [number, number];
    this.containerSize =
      this.direction() === 'horizontal'
        ? this.containerRef.nativeElement.offsetWidth
        : this.containerRef.nativeElement.offsetHeight;
    this.dragStart.emit();
  }

  private onMouseMove(event: MouseEvent): void {
    const pos = this.direction() === 'horizontal' ? event.clientX : event.clientY;
    this.updateSizes(pos);
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const pos = this.direction() === 'horizontal' ? touch.clientX : touch.clientY;
    this.updateSizes(pos);
  }

  private updateSizes(currentPos: number): void {
    const gutterSize = GUTTER_SIZES[this.gutterSize()];
    const availableSize = this.containerSize - gutterSize;
    const delta = currentPos - this.startPos;
    const deltaPercent = (delta / availableSize) * 100;

    let newSize0 = this.startSizes[0] + deltaPercent;
    let newSize1 = this.startSizes[1] - deltaPercent;

    // Apply minimum sizes
    const minPercent0 = (this.minSizes()[0] / availableSize) * 100;
    const minPercent1 = (this.minSizes()[1] / availableSize) * 100;

    if (newSize0 < minPercent0) {
      newSize0 = minPercent0;
      newSize1 = 100 - minPercent0;
    }
    if (newSize1 < minPercent1) {
      newSize1 = minPercent1;
      newSize0 = 100 - minPercent1;
    }

    this.sizes.set([newSize0, newSize1]);
    this.sizesChange.emit([newSize0, newSize1]);
  }

  private onMouseUp(): void {
    this.endDrag();
    this.removeListeners();
  }

  private onTouchEnd(): void {
    this.endDrag();
    this.removeListeners();
  }

  private endDrag(): void {
    this.isDragging.set(false);
    this.dragEnd.emit();
  }

  private removeListeners(): void {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
    document.removeEventListener('touchmove', this.touchMoveHandler);
    document.removeEventListener('touchend', this.touchEndHandler);
  }

  /** Programmatically set sizes */
  setSizes(sizes: [number, number]): void {
    this.sizes.set(sizes);
    this.sizesChange.emit(sizes);
  }

  /** Reset to initial sizes */
  reset(): void {
    this.sizes.set([...this.initialSizes()] as [number, number]);
    this.sizesChange.emit(this.sizes());
  }
}

/**
 * Directive to mark elements as splitter panes
 */
@Component({
  selector: 'tw-splitter-pane, [twSplitterPane], [twSplitterPaneStart], [twSplitterPaneEnd]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './splitter-pane.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class TwSplitterPaneComponent {}
