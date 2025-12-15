import { Component, Injectable, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastOptions {
  variant?: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
}

interface Toast extends ToastOptions {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class TwToastService {
  private _toasts = signal<Toast[]>([]);
  private _position = signal<ToastPosition>('top-right');

  readonly toasts = this._toasts.asReadonly();
  readonly position = this._position.asReadonly();

  setPosition(position: ToastPosition): void {
    this._position.set(position);
  }

  show(options: ToastOptions): string {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      variant: options.variant || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? 5000,
      dismissible: options.dismissible ?? true,
      action: options.action,
    };

    this._toasts.update(toasts => [...toasts, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(message: string, title?: string): string {
    return this.show({ variant: 'success', message, title });
  }

  error(message: string, title?: string): string {
    return this.show({ variant: 'danger', message, title });
  }

  warning(message: string, title?: string): string {
    return this.show({ variant: 'warning', message, title });
  }

  info(message: string, title?: string): string {
    return this.show({ variant: 'info', message, title });
  }

  dismiss(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this._toasts.set([]);
  }
}

@Component({
  selector: 'tw-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class TwToastComponent {
  @Input() set variant(value: ToastVariant) { this._variant.set(value); }
  @Input() set title(value: string) { this._title.set(value); }
  @Input() set message(value: string) { this._message.set(value); }
  @Input() set dismissible(value: boolean) { this._dismissible.set(value); }
  @Input() set action(value: { label: string; onClick: () => void } | undefined) { this._action.set(value); }
  @Input() dismiss: () => void = () => {};

  protected _variant = signal<ToastVariant>('info');
  protected _title = signal('');
  protected _message = signal('');
  protected _dismissible = signal(true);
  protected _action = signal<{ label: string; onClick: () => void } | undefined>(undefined);

  protected variantValue = computed(() => this._variant());
  protected titleValue = computed(() => this._title());
  protected messageValue = computed(() => this._message());
  protected dismissibleValue = computed(() => this._dismissible());
  protected actionValue = computed(() => this._action());

  protected toastClasses = computed(() => {
    return [
      'w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-4',
      'animate-[toast-in_0.3s_ease-out]',
    ].join(' ');
  });

  protected iconClasses = computed(() => {
    const variant = this._variant();

    const variantClasses: Record<ToastVariant, string> = {
      info: 'text-blue-500',
      success: 'text-emerald-500',
      warning: 'text-amber-500',
      danger: 'text-rose-500',
      neutral: 'text-slate-500',
    };

    return ['flex-shrink-0', variantClasses[variant]].join(' ');
  });

  protected onDismiss(): void {
    this.dismiss();
  }
}

@Component({
  selector: 'tw-toast-container',
  standalone: true,
  imports: [CommonModule, TwToastComponent],
  templateUrl: './toast-container.component.html',
  styles: [`
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class TwToastContainerComponent {
  private toastService: TwToastService;
  protected toasts;
  protected position;

  constructor(toastService: TwToastService) {
    this.toastService = toastService;
    this.toasts = this.toastService.toasts;
    this.position = this.toastService.position;
  }

  protected containerClasses = computed(() => {
    const position = this.position();

    const positionClasses: Record<ToastPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    return [
      'fixed z-50 flex flex-col gap-3 max-h-screen overflow-hidden pointer-events-none',
      '[&>*]:pointer-events-auto',
      positionClasses[position],
    ].join(' ');
  });

  getDismissFunction(id: string): () => void {
    return () => this.toastService.dismiss(id);
  }
}
