import {
  Directive,
  ElementRef,
  inject,
  input,
  output,
  HostBinding,
  HostListener,
  signal,
} from '@angular/core';
import { DragData, DropEvent } from './native.types';

/**
 * Directive to define drop target areas
 *
 * @example
 * ```html
 * <div twDropZone [acceptTypes]="['file', 'folder']" (dropped)="onDrop($event)">
 *   Drop files here
 * </div>
 * ```
 */
@Directive({
  selector: '[twDropZone]',
  standalone: true,
})
export class TwDropZoneDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Inputs
  public readonly twDropZone = input<boolean | ''>(true);
  public readonly acceptTypes = input<string[]>([]);
  public readonly dropEffect = input<DataTransfer['dropEffect']>('move');

  // Outputs
  public readonly dragEntered = output<DragEvent>();
  public readonly dragLeft = output<DragEvent>();
  public readonly dragOver = output<DragEvent>();
  public readonly dropped = output<DropEvent>();

  // State
  protected readonly isDragOver = signal(false);
  private dragEnterCount = 0;

  @HostBinding('class.tw-drop-zone')
  protected readonly baseClass = true;

  @HostBinding('class.tw-drop-zone-active')
  protected get activeClass(): boolean {
    return this.isDragOver();
  }

  protected get isEnabled(): boolean {
    const value = this.twDropZone();
    return value === '' || value === true;
  }

  @HostListener('dragenter', ['$event'])
  protected onDragEnter(event: DragEvent): void {
    if (!this.isEnabled) return;

    event.preventDefault();
    this.dragEnterCount++;

    if (this.dragEnterCount === 1) {
      const isValid = this.validateDrag(event);

      if (isValid) {
        this.isDragOver.set(true);
        this.elementRef.nativeElement.classList.add('tw-drop-zone-hover');
        this.dragEntered.emit(event);
      }
    }
  }

  @HostListener('dragleave', ['$event'])
  protected onDragLeave(event: DragEvent): void {
    if (!this.isEnabled) return;

    this.dragEnterCount--;

    if (this.dragEnterCount === 0) {
      this.isDragOver.set(false);
      this.elementRef.nativeElement.classList.remove('tw-drop-zone-hover');
      this.dragLeft.emit(event);
    }
  }

  @HostListener('dragover', ['$event'])
  protected onDragOver(event: DragEvent): void {
    if (!this.isEnabled) return;

    event.preventDefault();

    if (event.dataTransfer) {
      const isValid = this.validateDrag(event);
      event.dataTransfer.dropEffect = isValid ? this.dropEffect() : 'none';
    }

    this.dragOver.emit(event);
  }

  @HostListener('drop', ['$event'])
  protected onDrop(event: DragEvent): void {
    if (!this.isEnabled) return;

    event.preventDefault();
    this.dragEnterCount = 0;
    this.isDragOver.set(false);
    this.elementRef.nativeElement.classList.remove('tw-drop-zone-hover');

    if (!event.dataTransfer) return;

    // Try to parse drag data
    let data: DragData;
    try {
      const jsonData = event.dataTransfer.getData('application/json');
      data = jsonData ? JSON.parse(jsonData) : { type: 'unknown', data: null };
    } catch {
      data = { type: 'text', data: event.dataTransfer.getData('text/plain') };
    }

    // Check if files were dropped
    if (event.dataTransfer.files.length > 0) {
      data = {
        type: 'files',
        data: Array.from(event.dataTransfer.files),
      };
    }

    // Validate type
    if (!this.validateType(data.type)) {
      return;
    }

    const dropEvent: DropEvent = {
      data,
      position: { x: event.clientX, y: event.clientY },
      target: this.elementRef.nativeElement,
    };

    this.dropped.emit(dropEvent);
  }

  private validateDrag(event: DragEvent): boolean {
    if (!event.dataTransfer) return false;

    const types = this.acceptTypes();
    if (types.length === 0) return true;

    // Check if we're accepting files
    if (types.includes('files') && event.dataTransfer.types.includes('Files')) {
      return true;
    }

    // Check if we're accepting text
    if (types.includes('text') && event.dataTransfer.types.includes('text/plain')) {
      return true;
    }

    // Try to check application/json data type
    if (event.dataTransfer.types.includes('application/json')) {
      return true; // We'll validate the specific type on drop
    }

    return false;
  }

  private validateType(type: string): boolean {
    const acceptTypes = this.acceptTypes();
    if (acceptTypes.length === 0) return true;
    return acceptTypes.includes(type);
  }
}

