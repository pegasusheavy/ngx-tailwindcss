import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { MidiService, MidiCCMapping, CCValueChangeEvent } from './midi.service';

/**
 * Directive for MIDI Learn functionality
 *
 * Allows any control (fader, knob, slider, etc.) to be mapped to a MIDI CC.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <tw-volume-dial
 *   twMidiLearn="volume-dial"
 *   (midiValueChange)="onMidiValue($event)"
 * ></tw-volume-dial>
 *
 * <!-- With configuration -->
 * <tw-fader
 *   twMidiLearn="fader-1"
 *   [midiChannel]="-1"
 *   [midiMinValue]="-60"
 *   [midiMaxValue]="12"
 *   [midiCurve]="'logarithmic'"
 *   (midiValueChange)="setFaderValue($event.scaledValue)"
 *   (midiLearnStart)="showLearning()"
 *   (midiLearnComplete)="hideLearning()"
 * ></tw-fader>
 *
 * <!-- Manual trigger for MIDI Learn -->
 * <button (click)="startLearn()">Learn</button>
 * ```
 */
@Directive({
  selector: '[twMidiLearn]',
  standalone: true,
  host: {
    '[class.tw-midi-learning]': 'isLearning()',
    '[class.tw-midi-mapped]': 'isMapped()',
  },
})
export class TwMidiLearnDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly midiService = inject(MidiService);

  /** Unique identifier for this control's MIDI mapping */
  readonly twMidiLearn = input.required<string>();

  /** MIDI channel to listen to (-1 for all channels) */
  readonly midiChannel = input(-1);

  /** Minimum output value */
  readonly midiMinValue = input(0);

  /** Maximum output value */
  readonly midiMaxValue = input(127);

  /** Whether to invert the value */
  readonly midiInverted = input(false);

  /** Value curve type */
  readonly midiCurve = input<'linear' | 'logarithmic' | 'exponential'>('linear');

  /** Pre-configured CC number (skip learn mode) */
  readonly midiCC = input<number | null>(null);

  /** Enable right-click to start MIDI Learn */
  readonly enableContextMenuLearn = input(true);

  /** Emitted when a MIDI value is received for this control */
  readonly midiValueChange = output<CCValueChangeEvent>();

  /** Emitted when MIDI Learn mode starts for this control */
  readonly midiLearnStart = output<void>();

  /** Emitted when MIDI Learn is complete */
  readonly midiLearnComplete = output<MidiCCMapping>();

  /** Emitted when MIDI Learn is cancelled */
  readonly midiLearnCancel = output<void>();

  private ccUnsubscribe: (() => void) | null = null;
  private learnUnsubscribe: (() => void) | null = null;

  ngOnInit(): void {
    // Subscribe to CC changes
    this.ccUnsubscribe = this.midiService.onCCChange(event => {
      if (event.mappingId === this.twMidiLearn()) {
        this.midiValueChange.emit(event);
      }
    });

    // Subscribe to learn complete
    this.learnUnsubscribe = this.midiService.onLearnComplete(mapping => {
      if (mapping.id === this.twMidiLearn()) {
        this.midiLearnComplete.emit(mapping);
      }
    });

    // If a CC number is pre-configured, add the mapping immediately
    const preConfiguredCC = this.midiCC();
    if (preConfiguredCC !== null) {
      this.midiService.addCCMapping({
        id: this.twMidiLearn(),
        ccNumber: preConfiguredCC,
        channel: this.midiChannel(),
        minValue: this.midiMinValue(),
        maxValue: this.midiMaxValue(),
        inverted: this.midiInverted(),
        curve: this.midiCurve(),
      });
    }
  }

  ngOnDestroy(): void {
    this.ccUnsubscribe?.();
    this.learnUnsubscribe?.();

    // Cancel learn if active for this control
    if (this.isLearning()) {
      this.midiService.cancelMidiLearn();
    }
  }

  /**
   * Start MIDI Learn mode for this control
   */
  startLearn(): void {
    this.midiService.startMidiLearn(this.twMidiLearn());
    this.midiLearnStart.emit();

    // Update mapping configuration when learn completes
    const existingMapping = this.midiService.getCCMapping(this.twMidiLearn());
    if (!existingMapping) {
      // Pre-register with our configuration (CC will be learned)
      this.midiService.addCCMapping({
        id: this.twMidiLearn(),
        ccNumber: 0, // Will be updated when learned
        channel: this.midiChannel(),
        minValue: this.midiMinValue(),
        maxValue: this.midiMaxValue(),
        inverted: this.midiInverted(),
        curve: this.midiCurve(),
      });
    }
  }

  /**
   * Cancel MIDI Learn mode
   */
  cancelLearn(): void {
    if (this.isLearning()) {
      this.midiService.cancelMidiLearn();
      this.midiLearnCancel.emit();
    }
  }

  /**
   * Check if MIDI Learn is active for this control
   */
  isLearning(): boolean {
    const learnState = this.midiService.learnState();
    return learnState.active && learnState.targetId === this.twMidiLearn();
  }

  /**
   * Check if this control has a MIDI mapping
   */
  isMapped(): boolean {
    return this.midiService.getCCMapping(this.twMidiLearn()) !== undefined;
  }

  /**
   * Get the current mapping
   */
  getMapping(): MidiCCMapping | undefined {
    return this.midiService.getCCMapping(this.twMidiLearn());
  }

  /**
   * Clear the MIDI mapping for this control
   */
  clearMapping(): void {
    this.midiService.removeCCMapping(this.twMidiLearn());
  }

  /**
   * Update mapping configuration
   */
  updateMapping(updates: Partial<MidiCCMapping>): void {
    this.midiService.updateCCMapping(this.twMidiLearn(), updates);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if (this.enableContextMenuLearn()) {
      event.preventDefault();
      this.startLearn();
    }
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    // Double-click to start learn (alternative to context menu)
    if (event.shiftKey) {
      event.preventDefault();
      this.startLearn();
    }
  }
}
