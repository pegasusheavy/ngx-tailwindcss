// Phase 1 - Core Components
export * from './volume-dial.component';
export * from './vu-meter.component';
export * from './waveform.component';
export * from './transport.component';
export * from './scrubber.component';

// Phase 2 - Visualization
export * from './time-display.component';
export * from './spectrum.component';
export * from './piano.component';
export * from './parametric-eq.component';

// Phase 3 - Advanced
export * from './channel-strip.component';
export * from './mixer.component';
export * from './metronome.component';
export * from './visualizer.component';

// Phase 4 - Music Notation
export * from './staff.component';
export * from './note.component';
export * from './chord-diagram.component';
export * from './tablature.component';
export * from './sheet-music.component';
export * from './lead-sheet.component';

// Phase 5 - Utilities
export * from './tuner.component';

import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';
import { TwWaveformComponent } from './waveform.component';
import { TwTransportComponent } from './transport.component';
import { TwScrubberComponent } from './scrubber.component';
import { TwTimeDisplayComponent } from './time-display.component';
import { TwSpectrumComponent } from './spectrum.component';
import { TwPianoComponent } from './piano.component';
import { TwParametricEQComponent } from './parametric-eq.component';
import { TwChannelStripComponent } from './channel-strip.component';
import { TwMixerComponent } from './mixer.component';
import { TwMetronomeComponent } from './metronome.component';
import { TwVisualizerComponent } from './visualizer.component';
import { TwStaffComponent } from './staff.component';
import { TwNoteComponent } from './note.component';
import { TwChordDiagramComponent } from './chord-diagram.component';
import { TwTablatureComponent } from './tablature.component';
import { TwSheetMusicComponent } from './sheet-music.component';
import { TwLeadSheetComponent } from './lead-sheet.component';
import { TwTunerComponent } from './tuner.component';

export const TW_MUSIC_COMPONENTS = [
  // Phase 1 - Core
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
  TwTransportComponent,
  TwScrubberComponent,
  // Phase 2 - Visualization
  TwTimeDisplayComponent,
  TwSpectrumComponent,
  TwPianoComponent,
  TwParametricEQComponent,
  // Phase 3 - Advanced
  TwChannelStripComponent,
  TwMixerComponent,
  TwMetronomeComponent,
  TwVisualizerComponent,
  // Phase 4 - Notation
  TwStaffComponent,
  TwNoteComponent,
  TwChordDiagramComponent,
  TwTablatureComponent,
  TwSheetMusicComponent,
  TwLeadSheetComponent,
  // Phase 5 - Utilities
  TwTunerComponent,
] as const;
