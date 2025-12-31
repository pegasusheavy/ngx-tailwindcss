import {
  Directive,
  ElementRef,
  inject,
  input,
  output,
  OnInit,
  OnDestroy,
  HostBinding,
  HostListener,
} from '@angular/core';
import { DragData } from './native.types';

/**
 * Directive to make elements draggable
 *
 * @example
 * ```html
 * <div twDraggable [dragData]="{ type: 'file', data: file }">Drag me</div>
 * ```
 */
@Directive({
  selector: '[twDraggable]',
  standalone: true,
})
export class TwDraggableDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Inputs
  public readonly twDraggable = input<boolean | ''>(true);
  public readonly dragData = input<DragData>({ type: 'unknown', data: null });
  public readonly dragImage = input<HTMLElement | null>(null);
  public readonly dragImageOffsetX = input(0);
  public readonly dragImageOffsetY = input(0);
  public readonly dragEffectAllowed = input<DataTransfer['effectAllowed']>('all');

  // Outputs
  public readonly dragStarted = output<DragEvent>();
  public readonly dragEnded = output<DragEvent>();

  @HostBinding('attr.draggable')
  protected get isDraggable(): boolean {
    const value = this.twDraggable();
    return value === '' || value === true;
  }

  @HostBinding('class.tw-draggable')
  protected readonly baseClass = true;

  @HostBinding('class.cursor-grab')
  protected get cursorClass(): boolean {
    return this.isDraggable;
  }

  public ngOnInit(): void {
    const el = this.elementRef.nativeElement;
    el.style.touchAction = 'none';
  }

  public ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('dragstart', ['$event'])
  protected onDragStart(event: DragEvent): void {
    if (!this.isDraggable) {
      event.preventDefault();
      return;
    }

    const data = this.dragData();

    // Set drag data
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = this.dragEffectAllowed();
      event.dataTransfer.setData('application/json', JSON.stringify(data));
      event.dataTransfer.setData('text/plain', String(data.data));

      // Set custom drag image
      const dragImg = this.dragImage();
      if (dragImg) {
        event.dataTransfer.setDragImage(dragImg, this.dragImageOffsetX(), this.dragImageOffsetY());
      }
    }

    // Add dragging class
    this.elementRef.nativeElement.classList.add('tw-dragging');

    this.dragStarted.emit(event);
  }

  @HostListener('dragend', ['$event'])
  protected onDragEnd(event: DragEvent): void {
    this.elementRef.nativeElement.classList.remove('tw-dragging');
    this.dragEnded.emit(event);
  }
}
