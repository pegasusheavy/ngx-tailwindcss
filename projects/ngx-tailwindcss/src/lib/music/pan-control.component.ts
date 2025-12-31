import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TwClassService } from '../core/tw-class.service';

export type PanControlVariant = 'slider' | 'knob' | 'stereo-width';
export type PanControlSize = 'sm' | 'md' | 'lg';

/**
 * Pan Control component for stereo positioning
 *
 * @example
 * ```html
 * <tw-pan-control [(ngModel)]="panValue"></tw-pan-control>
 * <tw-pan-control variant="slider" [value]="pan"></tw-pan-control>
 * <tw-pan-control variant="stereo-width" [(ngModel)]="width"></tw-pan-control>
 * ```
 */
@Component({
  selector: 'tw-pan-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pan-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TwPanControlComponent),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
  },
})
export class TwPanControlComponent implements ControlValueAccessor {
  private readonly twClass = inject(TwClassService);

  // Expose Math for template
  protected readonly Math = Math;

  @ViewChild('track') private trackRef!: ElementRef<HTMLDivElement>;

  public readonly variant = input<PanControlVariant>('slider');
  public readonly size = input<PanControlSize>('md');
  public readonly min = input(-100, { transform: numberAttribute });
  public readonly max = input(100, { transform: numberAttribute });
  public readonly step = input(1, { transform: numberAttribute });
  public readonly showValue = input(true);
  public readonly showLabels = input(true); // L/R labels
  public readonly showTicks = input(true);
  public readonly centerDetent = input(true);
  public readonly detentRange = input(5, { transform: numberAttribute }); // Range for snap-to-center
  public readonly label = input<string | undefined>(undefined);
  public readonly disabled = input(false);
  public readonly classOverride = input('');

  public readonly valueChange = output<number>();

  protected readonly internalValue = signal(0);
  protected readonly isDragging = signal(false);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number): void {
    this.internalValue.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const base = 'flex flex-col items-center gap-1';
    return this.twClass.merge(base, this.classOverride());
  });

  protected readonly sliderContainerClasses = computed(() => {
    const sizeClasses: Record<PanControlSize, string> = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12',
    };
    return this.twClass.merge('relative w-full', sizeClasses[this.size()]);
  });

  protected readonly trackClasses = computed(() => {
    // Track classes now handled directly in template for more control
    return '';
  });

  protected readonly thumbClasses = computed(() => {
    // Thumb classes now handled directly in template for more control
    return '';
  });

  protected readonly knobContainerClasses = computed(() => {
    const sizeClasses: Record<PanControlSize, string> = {
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-18 h-18',
    };
    return this.twClass.merge('relative', sizeClasses[this.size()]);
  });

  // Thumb position (0-100%)
  protected readonly thumbPosition = computed(() => {
    const value = this.internalValue();
    const minVal = this.min();
    const maxVal = this.max();
    return ((value - minVal) / (maxVal - minVal)) * 100;
  });

  // Fill position for slider (from center)
  protected readonly fillStyle = computed(() => {
    const position = this.thumbPosition();
    const center = 50;

    if (position < center) {
      return {
        left: `${position}%`,
        width: `${center - position}%`,
      };
    } else {
      return {
        left: '50%',
        width: `${position - center}%`,
      };
    }
  });

  // Knob rotation (-135 to 135 degrees)
  protected readonly knobRotation = computed(() => {
    const value = this.internalValue();
    const minVal = this.min();
    const maxVal = this.max();
    const normalized = (value - minVal) / (maxVal - minVal);
    return -135 + normalized * 270;
  });

  // Stereo width visualization
  protected readonly stereoWidthLeft = computed(() => {
    const value = this.internalValue();
    // At 0 (mono), both at center; at 100, full stereo
    return 50 - value / 2;
  });

  protected readonly stereoWidthRight = computed(() => {
    const value = this.internalValue();
    return 50 + value / 2;
  });

  // Value display
  protected readonly displayValue = computed(() => {
    const value = this.internalValue();
    const variant = this.variant();

    if (variant === 'stereo-width') {
      return `${value}%`;
    }

    if (value === 0) return 'C';
    if (value < 0) return `L${Math.abs(value)}`;
    return `R${value}`;
  });

  // Tick marks for slider
  protected readonly tickMarks = computed(() => {
    return [
      { position: 0, label: 'L' },
      { position: 25, label: '' },
      { position: 50, label: 'C' },
      { position: 75, label: '' },
      { position: 100, label: 'R' },
    ];
  });

  // Event handlers
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.disabled() || this.variant() === 'knob') return;
    this.isDragging.set(true);
    this.updateValueFromMouseEvent(event);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.onTouched();
  }

  @HostListener('dblclick')
  onDoubleClick(): void {
    if (this.disabled()) return;
    this.setValue(0);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (this.isDragging()) {
      this.updateValueFromMouseEvent(event);
    }
  };

  private onMouseUp = (): void => {
    if (this.isDragging()) {
      this.isDragging.set(false);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  };

  private updateValueFromMouseEvent(event: MouseEvent): void {
    if (!this.trackRef?.nativeElement) return;

    const rect = this.trackRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const normalizedX = Math.max(0, Math.min(1, x / rect.width));
    const value = this.min() + normalizedX * (this.max() - this.min());

    this.setValue(value);
  }

  protected onKnobDrag(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();

    const startY = event.clientY;
    const startValue = this.internalValue();

    const onMove = (e: MouseEvent): void => {
      const deltaY = startY - e.clientY;
      const sensitivity = (this.max() - this.min()) / 100;
      const newValue = startValue + deltaY * sensitivity;
      this.setValue(newValue);
    };

    const onUp = (): void => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    this.onTouched();
  }

  private setValue(value: number): void {
    const stepped = Math.round(value / this.step()) * this.step();
    let clamped = Math.max(this.min(), Math.min(this.max(), stepped));

    // Apply center detent
    if (this.centerDetent() && Math.abs(clamped) < this.detentRange()) {
      clamped = 0;
    }

    this.internalValue.set(clamped);
    this.onChange(clamped);
    this.valueChange.emit(clamped);
  }

  protected onWidthSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.internalValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  // Public methods
  reset(): void {
    this.setValue(0);
  }

  setLeft(): void {
    this.setValue(this.min());
  }

  setRight(): void {
    this.setValue(this.max());
  }

  setCenter(): void {
    this.setValue(0);
  }

  setMono(): void {
    this.setValue(0);
  }

  setStereo(): void {
    this.setValue(100);
  }
}
