export * from './volume-dial.component';
export * from './vu-meter.component';
export * from './waveform.component';

import { TwVolumeDialComponent } from './volume-dial.component';
import { TwVuMeterComponent } from './vu-meter.component';
import { TwWaveformComponent } from './waveform.component';

export const TW_MUSIC_COMPONENTS = [
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
] as const;

