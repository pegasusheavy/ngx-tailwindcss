import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwClassService } from '../core/tw-class.service';

export interface StepItem {
  id?: string | number;
  label: string;
  description?: string;
  icon?: TemplateRef<any>;
  disabled?: boolean;
}

export type StepsOrientation = 'horizontal' | 'vertical';
export type StepsSize = 'sm' | 'md' | 'lg';

const STEPS_SIZES: Record<
  StepsSize,
  { indicator: string; indicatorSize: number; label: string; desc: string }
> = {
  sm: { indicator: 'w-8 h-8 text-sm', indicatorSize: 32, label: 'text-sm', desc: 'text-xs' },
  md: { indicator: 'w-10 h-10 text-base', indicatorSize: 40, label: 'text-base', desc: 'text-sm' },
  lg: { indicator: 'w-12 h-12 text-lg', indicatorSize: 48, label: 'text-lg', desc: 'text-base' },
};

/**
 * Steps/Stepper component with Tailwind CSS styling
 *
 * @example
 * ```html
 * <tw-steps [steps]="steps" [(activeIndex)]="currentStep"></tw-steps>
 * <tw-steps [steps]="steps" [activeIndex]="2" [readonly]="true"></tw-steps>
 * ```
 */
@Component({
  selector: 'tw-steps',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './steps.component.html',
})
export class TwStepsComponent {
  private readonly twClass = inject(TwClassService);

  /** Step definitions */
  readonly steps = input<StepItem[]>([]);

  /** Current active step index (two-way bindable) */
  readonly activeIndex = model(0);

  /** Orientation */
  readonly orientation = input<StepsOrientation>('horizontal');

  /** Size variant */
  readonly size = input<StepsSize>('md');

  /** Whether to show labels */
  readonly showLabels = input(true, { transform: booleanAttribute });

  /** Whether steps are readonly (non-clickable) */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- public API alias kept for backward compatibility
  readonly readonlyMode = input(false, { transform: booleanAttribute, alias: 'readonly' });

  /** Whether navigation is linear (future steps are not clickable) */
  readonly linear = input(true, { transform: booleanAttribute });

  /** Additional classes */
  readonly classOverride = input('');

  /** Step click event */
  readonly onStepClick$ = output<{ step: StepItem; index: number }>();

  protected containerClasses = computed(() => {
    return this.twClass.merge('w-full', this.classOverride());
  });

  protected listClasses = computed(() => {
    return this.twClass.merge(
      this.orientation() === 'horizontal' ? 'flex items-start' : 'flex flex-col'
    );
  });

  protected itemClasses(isLast: boolean) {
    if (this.orientation() === 'horizontal') {
      // Use items-start so connector aligns at the top with the indicator
      return this.twClass.merge('relative flex items-start', isLast ? '' : 'flex-1');
    }
    return '';
  }

  protected connectorClasses(index: number) {
    const isComplete = index < this.activeIndex();
    return this.twClass.merge(
      'flex-1 h-0.5 mx-2',
      isComplete ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
    );
  }

  protected getHorizontalConnectorStyle(): Record<string, string> {
    const { indicatorSize } = STEPS_SIZES[this.size()];
    // Position connector at vertical center of indicator
    return {
      marginTop: `${indicatorSize / 2 - 1}px`,
    };
  }

  protected verticalConnectorClasses(index: number) {
    const isComplete = index < this.activeIndex();
    const { indicatorSize } = STEPS_SIZES[this.size()];

    return this.twClass.merge(
      'w-0.5 h-8',
      isComplete ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
    );
  }

  protected getVerticalConnectorStyle(): Record<string, string> {
    const { indicatorSize } = STEPS_SIZES[this.size()];
    return {
      marginLeft: `${indicatorSize / 2 - 1}px`,
    };
  }

  /** Whether the step at the given index can be activated by the user */
  protected isStepClickable(index: number): boolean {
    const step = this.steps()[index];
    return (
      !this.readonlyMode() && !step.disabled && (!this.linear() || index <= this.activeIndex())
    );
  }

  protected stepContentClasses(index: number) {
    const isClickable = this.isStepClickable(index);

    return this.twClass.merge(
      'flex items-center gap-3',
      this.orientation() === 'horizontal' ? 'flex-col' : '',
      isClickable ? 'cursor-pointer group' : ''
    );
  }

  protected indicatorClasses(index: number) {
    const status = this.getStepStatus(index);
    const sizeClasses = STEPS_SIZES[this.size()].indicator;
    const step = this.steps()[index];
    const isClickable = this.isStepClickable(index);

    const statusClasses = {
      complete: 'bg-blue-600 text-white',
      current:
        'bg-white dark:bg-slate-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400',
      upcoming:
        'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400',
    };

    return this.twClass.merge(
      'flex-shrink-0 flex items-center justify-center rounded-full font-semibold transition-all',
      sizeClasses,
      statusClasses[status],
      isClickable ? 'group-hover:shadow-md' : '',
      step.disabled ? 'opacity-50' : ''
    );
  }

  protected labelContainerClasses() {
    return this.twClass.merge(this.orientation() === 'horizontal' ? 'text-center mt-2' : '');
  }

  protected labelClasses(index: number) {
    const status = this.getStepStatus(index);
    const sizeClasses = STEPS_SIZES[this.size()].label;

    return this.twClass.merge(
      'font-medium block',
      sizeClasses,
      status === 'upcoming' ? 'text-slate-500' : 'text-slate-900'
    );
  }

  protected descriptionClasses() {
    const sizeClasses = STEPS_SIZES[this.size()].desc;
    return this.twClass.merge('text-slate-500 block', sizeClasses);
  }

  getStepStatus(index: number): 'complete' | 'current' | 'upcoming' {
    if (index < this.activeIndex()) return 'complete';
    if (index === this.activeIndex()) return 'current';
    return 'upcoming';
  }

  onStepClick(index: number): void {
    const step = this.steps()[index];

    if (this.readonlyMode() || step.disabled) return;
    if (this.linear() && index > this.activeIndex()) return;

    this.activeIndex.set(index);
    this.onStepClick$.emit({ step, index });
  }

  /** Go to next step */
  next(): void {
    if (this.activeIndex() < this.steps().length - 1) {
      this.activeIndex.set(this.activeIndex() + 1);
    }
  }

  /** Go to previous step */
  prev(): void {
    if (this.activeIndex() > 0) {
      this.activeIndex.set(this.activeIndex() - 1);
    }
  }

  /** Go to specific step */
  goTo(index: number): void {
    if (index >= 0 && index < this.steps().length) {
      this.activeIndex.set(index);
    }
  }
}
