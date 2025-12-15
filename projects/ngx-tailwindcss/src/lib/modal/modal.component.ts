import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';
import { TwFocusTrapDirective } from '../directives/focus-trap.directive';
import { animate, style, transition, trigger } from '@angular/animations';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const MODAL_SIZES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

/**
 * Modal/Dialog component with accessibility features
 *
 * @example
 * ```html
 * <tw-modal [(open)]="isOpen" [size]="'md'" (closed)="onClose()">
 *   <tw-modal-header>
 *     <tw-modal-title>Modal Title</tw-modal-title>
 *   </tw-modal-header>
 *   <tw-modal-body>
 *     Modal content goes here
 *   </tw-modal-body>
 *   <tw-modal-footer>
 *     <tw-button variant="ghost" (click)="isOpen = false">Cancel</tw-button>
 *     <tw-button variant="primary" (click)="save()">Save</tw-button>
 *   </tw-modal-footer>
 * </tw-modal>
 * ```
 */
@Component({
  selector: 'tw-modal',
  standalone: true,
  imports: [CommonModule, TwFocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('panelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class TwModalComponent implements OnDestroy {
  private readonly twClass = inject(TwClassService);
  private readonly document = inject(DOCUMENT);

  @ViewChild('modalPanel') modalPanel!: ElementRef;

  // Internal signals for reactive state
  protected readonly _open = signal(false);
  protected readonly _size = signal<ModalSize>('md');
  protected readonly _closeOnBackdropClick = signal(true);
  protected readonly _closeOnEscape = signal(true);
  protected readonly _showCloseButton = signal(true);
  protected readonly _autoFocus = signal(true);
  protected readonly _restoreFocus = signal(true);
  protected readonly _centered = signal(true);
  protected readonly _ariaLabelledBy = signal('');
  protected readonly _ariaDescribedBy = signal('');
  protected readonly _backdropClass = signal('');
  protected readonly _panelClass = signal('');

  // Input setters
  @Input() set open(value: boolean) {
    this._open.set(value);
  }
  get open(): boolean {
    return this._open();
  }

  @Input() set size(value: ModalSize) {
    this._size.set(value);
  }
  @Input({ transform: booleanAttribute }) set closeOnBackdropClick(value: boolean) {
    this._closeOnBackdropClick.set(value);
  }
  @Input({ transform: booleanAttribute }) set closeOnEscape(value: boolean) {
    this._closeOnEscape.set(value);
  }
  @Input({ transform: booleanAttribute }) set showCloseButton(value: boolean) {
    this._showCloseButton.set(value);
  }
  @Input({ transform: booleanAttribute }) set autoFocus(value: boolean) {
    this._autoFocus.set(value);
  }
  @Input({ transform: booleanAttribute }) set restoreFocus(value: boolean) {
    this._restoreFocus.set(value);
  }
  @Input({ transform: booleanAttribute }) set centered(value: boolean) {
    this._centered.set(value);
  }
  @Input() set ariaLabelledBy(value: string) {
    this._ariaLabelledBy.set(value);
  }
  @Input() set ariaDescribedBy(value: string) {
    this._ariaDescribedBy.set(value);
  }
  @Input() set backdropClass(value: string) {
    this._backdropClass.set(value);
  }
  @Input() set panelClass(value: string) {
    this._panelClass.set(value);
  }

  // Outputs
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() openChange = new EventEmitter<boolean>();

  private previousOverflow = '';

  // Effect to manage scroll lock
  constructor() {
    effect(() => {
      if (this._open()) {
        this.lockScroll();
        this.opened.emit();
      } else {
        this.unlockScroll();
      }
    });
  }

  ngOnDestroy(): void {
    this.unlockScroll();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this._open() && this._closeOnEscape()) {
      event.preventDefault();
      this.closeModal();
    }
  }

  protected readonly backdropClasses = computed(() => {
    return this.twClass.merge(
      'absolute inset-0 bg-slate-900/50 backdrop-blur-sm',
      this._backdropClass()
    );
  });

  protected readonly containerClasses = computed(() => {
    return this.twClass.merge(
      'flex min-h-full p-4',
      this._centered() ? 'items-center justify-center' : 'items-start justify-center pt-16'
    );
  });

  protected readonly panelClasses = computed(() => {
    return this.twClass.merge(
      'relative w-full bg-white rounded-xl shadow-2xl',
      MODAL_SIZES[this._size()],
      this._panelClass()
    );
  });

  protected onBackdropClick(): void {
    if (this._closeOnBackdropClick()) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this._open.set(false);
    this.openChange.emit(false);
    this.closed.emit();
  }

  openModal(): void {
    this._open.set(true);
    this.openChange.emit(true);
  }

  private lockScroll(): void {
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    this.document.body.style.overflow = this.previousOverflow;
  }
}

/**
 * Modal header component
 */
@Component({
  selector: 'tw-modal-header',
  standalone: true,
  host: {
    class: 'block px-6 py-4 border-b border-slate-100',
  },
  template: `<ng-content></ng-content>`,
})
export class TwModalHeaderComponent {}

/**
 * Modal title component
 */
@Component({
  selector: 'tw-modal-title',
  standalone: true,
  host: {
    class: 'block text-lg font-semibold text-slate-900',
  },
  template: `<ng-content></ng-content>`,
})
export class TwModalTitleComponent {}

/**
 * Modal body component
 */
@Component({
  selector: 'tw-modal-body',
  standalone: true,
  host: {
    class: 'block p-6',
  },
  template: `<ng-content></ng-content>`,
})
export class TwModalBodyComponent {}

/**
 * Modal footer component
 */
@Component({
  selector: 'tw-modal-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClasses()',
  },
  template: `<ng-content></ng-content>`,
})
export class TwModalFooterComponent {
  private readonly twClass = inject(TwClassService);

  protected readonly _align = signal<'start' | 'center' | 'end' | 'between'>('end');
  protected readonly _classOverride = signal('');

  @Input() set align(value: 'start' | 'center' | 'end' | 'between') {
    this._align.set(value);
  }
  @Input() set classOverride(value: string) {
    this._classOverride.set(value);
  }

  protected readonly computedClasses = computed(() => {
    const alignClasses: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return this.twClass.merge(
      'flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl',
      alignClasses[this._align()],
      this._classOverride()
    );
  });
}

/**
 * Confirmation dialog helper component
 */
@Component({
  selector: 'tw-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TwModalComponent,
    TwModalHeaderComponent,
    TwModalTitleComponent,
    TwModalBodyComponent,
    TwModalFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
})
export class TwConfirmDialogComponent {
  private readonly twClass = inject(TwClassService);

  protected readonly _open = signal(false);
  protected readonly _title = signal('Confirm');
  protected readonly _message = signal('Are you sure you want to continue?');
  protected readonly _confirmText = signal('Confirm');
  protected readonly _cancelText = signal('Cancel');
  protected readonly _variant = signal<'primary' | 'danger'>('primary');
  protected readonly _loading = signal(false);

  @Input() set open(value: boolean) {
    this._open.set(value);
  }
  get open(): boolean {
    return this._open();
  }

  @Input() set title(value: string) {
    this._title.set(value);
  }
  @Input() set message(value: string) {
    this._message.set(value);
  }
  @Input() set confirmText(value: string) {
    this._confirmText.set(value);
  }
  @Input() set cancelText(value: string) {
    this._cancelText.set(value);
  }
  @Input() set variant(value: 'primary' | 'danger') {
    this._variant.set(value);
  }
  @Input({ transform: booleanAttribute }) set loading(value: boolean) {
    this._loading.set(value);
  }

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly confirmButtonClasses = computed(() => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
      danger: 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500',
    };

    return this.twClass.merge(
      'inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus-visible:ring-2 disabled:opacity-50',
      variants[this._variant()]
    );
  });

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this._open.set(false);
    this.openChange.emit(false);
    this.cancel.emit();
  }
}
