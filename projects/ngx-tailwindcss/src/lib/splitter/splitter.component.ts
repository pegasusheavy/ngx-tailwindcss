import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export type SplitterDirection = 'horizontal' | 'vertical';
export type SplitterGutterSize = 'sm' | 'md' | 'lg';

const GUTTER_SIZES: Record<SplitterGutterSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

/**
 * Splitter component for creating resizable split pane layouts.
 *
 * @example
 * ```html
 * <!-- Horizontal split -->
 * <tw-splitter direction="horizontal" [initialSizes]="[30, 70]">
 *   <div twSplitterPane>Left Panel</div>
 *   <div twSplitterPane>Right Panel</div>
 * </tw-splitter>
 *
 * <!-- Vertical split with min sizes -->
 * <tw-splitter direction="vertical" [minSizes]="[100, 200]">
 *   <div twSplitterPane>Top Panel</div>
 *   <div twSplitterPane>Bottom Panel</div>
 * </tw-splitter>
 * ```
 */
@Component({
  selector: 'tw-splitter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container [class]="containerClasses()">
      <div
        [class]="paneClasses(0)"
        [style.flexBasis.%]="sizes()[0]"
        [style.minWidth.px]="direction === 'horizontal' ? minSizes[0] : undefined"
        [style.minHeight.px]="direction === 'vertical' ? minSizes[0] : undefined">
        <ng-content select="[twSplitterPane]:first-of-type, tw-splitter-pane:first-of-type"></ng-content>
      </div>

      <div
        #gutter
        [class]="gutterClasses()"
        (mousedown)="onGutterMouseDown($event)"
        (touchstart)="onGutterTouchStart($event)">
        <div [class]="gutterHandleClasses()"></div>
      </div>

      <div
        [class]="paneClasses(1)"
        [style.flexBasis.%]="sizes()[1]"
        [style.minWidth.px]="direction === 'horizontal' ? minSizes[1] : undefined"
        [style.minHeight.px]="direction === 'vertical' ? minSizes[1] : undefined">
        <ng-content select="[twSplitterPane]:last-of-type, tw-splitter-pane:last-of-type"></ng-content>
      </div>
    </div>
  `,
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
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('gutter') gutterRef!: ElementRef<HTMLElement>;

  /** Direction of the split */
  @Input() direction: SplitterDirection = 'horizontal';

  /** Initial sizes as percentages (should sum to 100) */
  @Input() initialSizes: [number, number] = [50, 50];

  /** Minimum sizes in pixels for each pane */
  @Input() minSizes: [number, number] = [50, 50];

  /** Size of the gutter */
  @Input() gutterSize: SplitterGutterSize = 'md';

  /** Whether the splitter is disabled */
  @Input() disabled = false;

  /** Whether to show visual gutter */
  @Input() showGutter = true;

  /** Additional CSS classes */
  @Input() class = '';

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

  constructor(private readonly twClass: TwClassService) {}

  ngAfterViewInit(): void {
    this.sizes.set([...this.initialSizes] as [number, number]);
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  protected containerClasses(): string {
    return this.twClass.merge(
      'flex h-full w-full overflow-hidden',
      this.direction === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class
    );
  }

  protected paneClasses(index: number): string {
    return this.twClass.merge(
      'overflow-auto',
      this.direction === 'horizontal' ? 'h-full' : 'w-full'
    );
  }

  protected gutterClasses(): string {
    const size = GUTTER_SIZES[this.gutterSize];
    const isHorizontal = this.direction === 'horizontal';

    return this.twClass.merge(
      'flex items-center justify-center flex-shrink-0 transition-colors',
      isHorizontal ? `w-[${size}px] h-full cursor-col-resize` : `h-[${size}px] w-full cursor-row-resize`,
      this.showGutter ? 'bg-slate-200 hover:bg-slate-300' : 'bg-transparent hover:bg-slate-200',
      this.isDragging() ? 'bg-blue-400' : '',
      this.disabled ? 'cursor-default pointer-events-none opacity-50' : ''
    );
  }

  protected gutterHandleClasses(): string {
    const isHorizontal = this.direction === 'horizontal';

    return this.twClass.merge(
      'rounded-full bg-slate-400 transition-all',
      isHorizontal ? 'w-1 h-8' : 'h-1 w-8',
      this.isDragging() ? 'bg-blue-600 scale-125' : ''
    );
  }

  protected onGutterMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    this.startDrag(this.direction === 'horizontal' ? event.clientX : event.clientY);
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  protected onGutterTouchStart(event: TouchEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.startDrag(this.direction === 'horizontal' ? touch.clientX : touch.clientY);
    document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
    document.addEventListener('touchend', this.touchEndHandler);
  }

  private startDrag(pos: number): void {
    this.isDragging.set(true);
    this.startPos = pos;
    this.startSizes = [...this.sizes()] as [number, number];
    this.containerSize = this.direction === 'horizontal'
      ? this.containerRef.nativeElement.offsetWidth
      : this.containerRef.nativeElement.offsetHeight;
    this.dragStart.emit();
  }

  private onMouseMove(event: MouseEvent): void {
    const pos = this.direction === 'horizontal' ? event.clientX : event.clientY;
    this.updateSizes(pos);
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const pos = this.direction === 'horizontal' ? touch.clientX : touch.clientY;
    this.updateSizes(pos);
  }

  private updateSizes(currentPos: number): void {
    const gutterSize = GUTTER_SIZES[this.gutterSize];
    const availableSize = this.containerSize - gutterSize;
    const delta = currentPos - this.startPos;
    const deltaPercent = (delta / availableSize) * 100;

    let newSize0 = this.startSizes[0] + deltaPercent;
    let newSize1 = this.startSizes[1] - deltaPercent;

    // Apply minimum sizes
    const minPercent0 = (this.minSizes[0] / availableSize) * 100;
    const minPercent1 = (this.minSizes[1] / availableSize) * 100;

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
    this.sizes.set([...this.initialSizes] as [number, number]);
    this.sizesChange.emit(this.sizes());
  }
}

/**
 * Directive to mark elements as splitter panes
 */
@Component({
  selector: 'tw-splitter-pane, [twSplitterPane]',
  standalone: true,
  template: '<ng-content></ng-content>',
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

