export * from './volume-dial.component';
export * from './vu-meter.component';
export * from './waveform.component';
export * from './transport.component';
export * from './scrubber.component';
export * from './time-display.component';
export * from './spectrum.component';
export * from './piano.component';

import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';
import { TwWaveformComponent } from './waveform.component';
import { TwTransportComponent } from './transport.component';
import { TwScrubberComponent } from './scrubber.component';
import { TwTimeDisplayComponent } from './time-display.component';
import { TwSpectrumComponent } from './spectrum.component';
import { TwPianoComponent } from './piano.component';

export const TW_MUSIC_COMPONENTS = [
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
  TwTransportComponent,
  TwScrubberComponent,
  TwTimeDisplayComponent,
  TwSpectrumComponent,
  TwPianoComponent,
] as const;
