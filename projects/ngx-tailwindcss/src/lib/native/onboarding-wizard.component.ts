import { Component, computed, input, output, signal } from '@angular/core';
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
  templateUrl: './onboarding-wizard.component.html',
})
export class TwOnboardingWizardComponent {
  public readonly steps = input<OnboardingStep[]>([]);
  public readonly allowSkip = input(true);
  public readonly showDontShowAgain = input(true);
  public readonly completeText = input('Get Started');

  public readonly stepChanged = output<{ step: OnboardingStep; index: number }>();
  public readonly completed = output<{ dontShowAgain: boolean }>();
  public readonly skipped = output();
  public readonly closed = output();

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
