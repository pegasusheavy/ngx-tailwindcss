// Phase 1 - Core Components
export * from './volume-dial.component';
export * from './vu-meter.component';
export * from './waveform.component';
export * from './transport.component';
export * from './scrubber.component';
export * from './fader.component';
export * from './pan-control.component';

// Phase 2 - Visualization
export * from './time-display.component';
export * from './spectrum.component';
export * from './piano.component';
export * from './parametric-eq.component';
export * from './graphic-eq.component';
export * from './oscilloscope.component';

// Phase 3 - Advanced
export * from './channel-strip.component';
export * from './mixer.component';
export * from './metronome.component';
export * from './visualizer.component';
export * from './audio-player.component';
export * from './looper.component';

// Phase 4 - Music Notation
export * from './staff.component';
export * from './note.component';
export * from './note-input.component';
export * from './musical-symbol.component';
export * from './chord-diagram.component';
export * from './piano-chord.component';
export * from './tablature.component';
export * from './sheet-music.component';
export * from './lead-sheet.component';
export * from './score-editor.component';

// Phase 5 - Utilities
export * from './tuner.component';
export * from './note-display.component';
export * from './pitch-display.component';
export * from './audio-stats.component';
export * from './bpm-display.component';
export * from './compressor-meter.component';

// Mobile Support
export * from './mobile-support.service';
export * from './touch-guard.directive';

// Accessibility
export * from './accessibility.service';

// Web Audio API
export * from './audio-context.service';

// MIDI Support
export * from './midi.service';
export * from './midi-learn.directive';

// Native Platform (Tauri/Electron)
export * from './native-platform.service';

// Web Worker (Optional Performance Optimization)
export * from './audio-worker';
export * from './audio-worker.service';

import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';
import { TwWaveformComponent } from './waveform.component';
import { TwTransportComponent } from './transport.component';
import { TwScrubberComponent } from './scrubber.component';
import { TwFaderComponent } from './fader.component';
import { TwPanControlComponent } from './pan-control.component';
import { TwTimeDisplayComponent } from './time-display.component';
import { TwSpectrumComponent } from './spectrum.component';
import { TwPianoComponent } from './piano.component';
import { TwParametricEQComponent } from './parametric-eq.component';
import { TwGraphicEQComponent } from './graphic-eq.component';
import { TwOscilloscopeComponent } from './oscilloscope.component';
import { TwChannelStripComponent } from './channel-strip.component';
import { TwMixerComponent } from './mixer.component';
import { TwMetronomeComponent } from './metronome.component';
import { TwVisualizerComponent } from './visualizer.component';
import { TwAudioPlayerComponent } from './audio-player.component';
import { TwLooperComponent } from './looper.component';
import { TwStaffComponent } from './staff.component';
import { TwNoteComponent } from './note.component';
import { TwNoteInputComponent } from './note-input.component';
import { TwMusicalSymbolComponent } from './musical-symbol.component';
import { TwChordDiagramComponent } from './chord-diagram.component';
import { TwPianoChordComponent } from './piano-chord.component';
import { TwTablatureComponent } from './tablature.component';
import { TwSheetMusicComponent } from './sheet-music.component';
import { TwLeadSheetComponent } from './lead-sheet.component';
import { TwScoreEditorComponent } from './score-editor.component';
import { TwTunerComponent } from './tuner.component';
import { TwNoteDisplayComponent } from './note-display.component';
import { TwPitchDisplayComponent } from './pitch-display.component';
import { TwAudioStatsComponent } from './audio-stats.component';
import { TwBpmDisplayComponent } from './bpm-display.component';
import { TwCompressorMeterComponent } from './compressor-meter.component';
import { TwTouchGuardDirective } from './touch-guard.directive';
import { TwMidiLearnDirective } from './midi-learn.directive';

export const TW_MUSIC_COMPONENTS = [
  // Phase 1 - Core
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
  TwTransportComponent,
  TwScrubberComponent,
  TwFaderComponent,
  TwPanControlComponent,
  // Phase 2 - Visualization
  TwTimeDisplayComponent,
  TwSpectrumComponent,
  TwPianoComponent,
  TwParametricEQComponent,
  TwGraphicEQComponent,
  TwOscilloscopeComponent,
  // Phase 3 - Advanced
  TwChannelStripComponent,
  TwMixerComponent,
  TwMetronomeComponent,
  TwVisualizerComponent,
  TwAudioPlayerComponent,
  TwLooperComponent,
  // Phase 4 - Notation
  TwStaffComponent,
  TwNoteComponent,
  TwNoteInputComponent,
  TwMusicalSymbolComponent,
  TwChordDiagramComponent,
  TwPianoChordComponent,
  TwTablatureComponent,
  TwSheetMusicComponent,
  TwLeadSheetComponent,
  TwScoreEditorComponent,
  // Phase 5 - Utilities
  TwTunerComponent,
  TwNoteDisplayComponent,
  TwPitchDisplayComponent,
  TwAudioStatsComponent,
  TwBpmDisplayComponent,
  TwCompressorMeterComponent,
  // Directives
  TwTouchGuardDirective,
  TwMidiLearnDirective,
] as const;

// Convenience array for directives only
export const TW_MUSIC_DIRECTIVES = [
  TwTouchGuardDirective,
  TwMidiLearnDirective,
] as const;
