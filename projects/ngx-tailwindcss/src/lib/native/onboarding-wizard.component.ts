import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  image?: string;
  icon?: string;
}

@Component({
  selector: 'tw-onboarding-wizard',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div
          class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <!-- Progress -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
            <div
              class="h-full bg-blue-600 transition-all duration-300"
              [style.width.%]="progressPercent()"
            ></div>
          </div>

          <!-- Skip Button -->
          @if (allowSkip()) {
            <button
              (click)="skip()"
              class="absolute top-4 right-4 px-3 py-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Skip
            </button>
          }

          <!-- Content -->
          <div class="pt-12 px-8 pb-8">
            @if (currentStep()) {
              <div class="text-center">
                @if (currentStep()?.image) {
                  <img
                    [src]="currentStep()?.image"
                    [alt]="currentStep()?.title"
                    class="mx-auto max-h-48 mb-6"
                  />
                } @else {
                  <div
                    class="mx-auto w-24 h-24 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                  >
                    <svg
                      class="w-12 h-12 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                }

                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {{ currentStep()?.title }}
                </h2>
                @if (currentStep()?.description) {
                  <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    {{ currentStep()?.description }}
                  </p>
                }
              </div>

              <!-- Step Content Slot -->
              <div class="mt-6">
                <ng-content></ng-content>
              </div>
            }
          </div>

          <!-- Step Indicators -->
          <div class="flex justify-center gap-2 pb-4">
            @for (step of steps(); track step.id; let i = $index) {
              <button
                (click)="goToStep(i)"
                [class.bg-blue-600]="currentIndex() === i"
                [class.bg-slate-300]="currentIndex() !== i"
                [class.dark:bg-slate-600]="currentIndex() !== i"
                class="w-2 h-2 rounded-full transition-colors"
              ></button>
            }
          </div>

          <!-- Navigation -->
          <div
            class="flex justify-between px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700"
          >
            <button
              (click)="previous()"
              [disabled]="currentIndex() === 0"
              class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            @if (isLastStep()) {
              <button
                (click)="complete()"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {{ completeText() }}
              </button>
            } @else {
              <button
                (click)="next()"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Next
              </button>
            }
          </div>

          <!-- Don't Show Again -->
          @if (showDontShowAgain()) {
            <div class="px-8 pb-4 bg-slate-50 dark:bg-slate-900/50">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  [checked]="dontShowAgain()"
                  (change)="dontShowAgain.set($any($event.target).checked)"
                  class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-slate-600 dark:text-slate-400"
                  >Don't show this again</span
                >
              </label>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class TwOnboardingWizardComponent {
  public readonly steps = input<OnboardingStep[]>([]);
  public readonly allowSkip = input(true);
  public readonly showDontShowAgain = input(true);
  public readonly completeText = input('Get Started');

  public readonly stepChanged = output<{ step: OnboardingStep; index: number }>();
  public readonly completed = output<{ dontShowAgain: boolean }>();
  public readonly skipped = output<void>();
  public readonly closed = output<void>();

  public readonly isOpen = signal(false);
  public readonly currentIndex = signal(0);
  public readonly dontShowAgain = signal(false);

  public readonly currentStep = computed(() => this.steps()[this.currentIndex()]);
  public readonly isLastStep = computed(() => this.currentIndex() === this.steps().length - 1);
  public readonly progressPercent = computed(() => {
    const total = this.steps().length;
    return total > 0 ? ((this.currentIndex() + 1) / total) * 100 : 0;
  });

  public open(startIndex = 0): void {
    this.currentIndex.set(startIndex);
    this.dontShowAgain.set(false);
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  public next(): void {
    if (this.currentIndex() < this.steps().length - 1) {
      this.currentIndex.update(i => i + 1);
      const step = this.currentStep();
      if (step) {
        this.stepChanged.emit({ step, index: this.currentIndex() });
      }
    }
  }

  public previous(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      const step = this.currentStep();
      if (step) {
        this.stepChanged.emit({ step, index: this.currentIndex() });
      }
    }
  }

  public goToStep(index: number): void {
    if (index >= 0 && index < this.steps().length) {
      this.currentIndex.set(index);
      const step = this.currentStep();
      if (step) {
        this.stepChanged.emit({ step, index });
      }
    }
  }

  public skip(): void {
    this.skipped.emit();
    this.close();
  }

  public complete(): void {
    this.completed.emit({ dontShowAgain: this.dontShowAgain() });
    this.close();
  }
}
