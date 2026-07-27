import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwFocusTrapDirective } from '../directives';

export type PromptInputType = 'text' | 'password' | 'number' | 'email' | 'url';

@Component({
  selector: 'tw-prompt-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TwFocusTrapDirective],
  templateUrl: './prompt-dialog.component.html',
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
  public readonly cancelled = output();

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
    if (defaultValue === undefined) {
      this.inputValue.set(this.defaultValue());
    } else {
      this.inputValue.set(defaultValue);
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
