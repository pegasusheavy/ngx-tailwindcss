import {
  Component,
  input,
  output,
  signal,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PromptInputType = 'text' | 'password' | 'number' | 'email' | 'url';

@Component({
  selector: 'tw-prompt-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="cancel()"
        ></div>

        <!-- Dialog -->
        <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="px-6 pt-6 pb-2">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {{ title() }}
            </h2>
            @if (message()) {
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {{ message() }}
              </p>
            }
          </div>

          <!-- Input -->
          <div class="px-6 py-4">
            <input
              #inputElement
              [type]="inputType()"
              [ngModel]="inputValue()"
              (ngModelChange)="inputValue.set($event)"
              [placeholder]="placeholder()"
              (keydown.enter)="confirm()"
              (keydown.escape)="cancel()"
              class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              [class.border-red-500]="validationError()"
              [class.focus:ring-red-500]="validationError()"
            />
            @if (validationError()) {
              <p class="mt-2 text-sm text-red-500">{{ validationError() }}</p>
            }
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
            <button
              (click)="cancel()"
              class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {{ cancelText() }}
            </button>
            <button
              (click)="confirm()"
              [disabled]="!isValid()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class TwPromptDialogComponent {
  public readonly title = input('Enter a value');
  public readonly message = input('');
  public readonly defaultValue = input('');
  public readonly placeholder = input('');
  public readonly inputType = input<PromptInputType>('text');
  public readonly confirmText = input('OK');
  public readonly cancelText = input('Cancel');
  public readonly required = input(false);
  public readonly minLength = input<number | null>(null);
  public readonly maxLength = input<number | null>(null);
  public readonly pattern = input<string | null>(null);
  public readonly customValidator = input<((value: string) => string | null) | null>(null);

  public readonly confirmed = output<string>();
  public readonly cancelled = output<void>();

  public readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  public readonly isOpen = signal(false);
  public readonly inputValue = signal('');
  public readonly validationError = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.inputValue.set(this.defaultValue());
        setTimeout(() => {
          this.inputElement()?.nativeElement.focus();
          this.inputElement()?.nativeElement.select();
        }, 50);
      }
    });

    // Validate on input change
    effect(() => {
      const value = this.inputValue();
      this.validate(value);
    });
  }

  public open(defaultValue?: string): void {
    if (defaultValue !== undefined) {
      this.inputValue.set(defaultValue);
    } else {
      this.inputValue.set(this.defaultValue());
    }
    this.validationError.set(null);
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public confirm(): void {
    const value = this.inputValue();
    const error = this.validate(value);

    if (error) {
      this.validationError.set(error);
      return;
    }

    this.confirmed.emit(value);
    this.close();
  }

  public cancel(): void {
    this.cancelled.emit();
    this.close();
  }

  public isValid(): boolean {
    return !this.validationError() && (!this.required() || this.inputValue().length > 0);
  }

  private validate(value: string): string | null {
    // Required check
    if (this.required() && !value) {
      return 'This field is required';
    }

    // Min length
    const minLen = this.minLength();
    if (minLen !== null && value.length < minLen) {
      return `Minimum ${minLen} characters required`;
    }

    // Max length
    const maxLen = this.maxLength();
    if (maxLen !== null && value.length > maxLen) {
      return `Maximum ${maxLen} characters allowed`;
    }

    // Pattern
    const pattern = this.pattern();
    if (pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return 'Invalid format';
      }
    }

    // Custom validator
    const customValidator = this.customValidator();
    if (customValidator) {
      const customError = customValidator(value);
      if (customError) {
        return customError;
      }
    }

    this.validationError.set(null);
    return null;
  }
}

