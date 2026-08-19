import { Component, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
  TwTransportComponent,
  TwScrubberComponent,
  TwTimeDisplayComponent,
  TwSpectrumComponent,
  TwPianoComponent,
  TwFaderComponent,
  TwPanControlComponent,
  TwOscilloscopeComponent,
  TwGraphicEQComponent,
  TwMetronomeComponent,
  TwChannelStripComponent,
  TwVisualizerComponent,
  TwTunerComponent,
  TwNoteDisplayComponent,
  TwBpmDisplayComponent,
  TwCompressorMeterComponent,
  TwChordDiagramComponent,
  TwPianoChordComponent,
  TwStaffComponent,
  TwLooperComponent,
  TwButtonComponent,
  NoteEvent,
} from 'ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-music-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwVolumeDialComponent,
    TwVuMeterComponent,
    TwWaveformComponent,
    TwTransportComponent,
    TwScrubberComponent,
    TwTimeDisplayComponent,
    TwSpectrumComponent,
    TwPianoComponent,
    TwFaderComponent,
    TwPanControlComponent,
    TwOscilloscopeComponent,
    TwGraphicEQComponent,
    TwMetronomeComponent,
    TwChannelStripComponent,
    TwVisualizerComponent,
    TwTunerComponent,
    TwNoteDisplayComponent,
    TwBpmDisplayComponent,
    TwCompressorMeterComponent,
    TwChordDiagramComponent,
    TwPianoChordComponent,
    TwStaffComponent,
    TwLooperComponent,
    TwButtonComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './music-demo.component.html',
})
export class MusicDemoComponent implements OnInit, OnDestroy {
  // Volume Dial state
  volume = 50;
  gain = 75;
  pan = 50;

  // Fader state
  faderValue = 0;
  panValue = 0;

  // VU Meter state
  @ViewChild('vuMeter') vuMeter?: TwVuMeterComponent;
  leftChannel = signal(0);
  rightChannel = signal(0);
  private simulationInterval?: ReturnType<typeof setInterval>;

  // Waveform state
  waveformProgress = 0;
  samplePeaks: number[] = [];

  // Transport state
  isPlaying = signal(false);
  isLooping = signal(false);

  // Scrubber state
  currentTime = signal(45);
  duration = 180;
  buffered = 120;

  // Spectrum state
  spectrumData: number[] = [];

  // Piano state
  lastNote = signal<string>('');

  // Metronome state
  bpm = 120;

  // Compressor state
  gainReduction = signal(-6);
  inputLevel = signal(-12);
  outputLevel = signal(-18);

  // Note display state
  currentNote = 'A';
  currentOctave = 4;

  // BPM state
  currentBpm = signal(128);

  // Oscilloscope signal source
  oscilloscopeAnalyser = signal<AnalyserNode | undefined>(undefined);
  private oscilloscopeContext?: AudioContext;
  private oscillator?: OscillatorNode;

  constructor() {
    this.generateSamplePeaks();
    this.generateSpectrumData();
  }

  ngOnInit(): void {
    this.startSimulation();
  }

  ngOnDestroy(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    this.stopOscilloscopeSignal();
  }

  private generateSamplePeaks(): void {
    this.samplePeaks = [];
    for (let i = 0; i < 200; i++) {
      const base = 0.3 + Math.random() * 0.4;
      const variation = Math.sin(i / 10) * 0.2;
      const peak = Math.max(0.1, Math.min(1, base + variation + (Math.random() - 0.5) * 0.3));
      this.samplePeaks.push(peak);
    }
  }

  private generateSpectrumData(): void {
    this.spectrumData = [];
    for (let i = 0; i < 32; i++) {
      this.spectrumData.push(Math.floor(Math.random() * 255));
    }
  }

  private startSimulation(): void {
    this.simulationInterval = setInterval(() => {
      // VU meter levels
      const baseLevel = 50 + Math.sin(Date.now() / 500) * 20;
      const leftNoise = Math.random() * 30;
      const rightNoise = Math.random() * 30;

      this.leftChannel.set(Math.min(100, baseLevel + leftNoise));
      this.rightChannel.set(Math.min(100, baseLevel + rightNoise - 5));

      if (this.vuMeter) {
        this.vuMeter.setValues(this.leftChannel(), this.rightChannel());
      }

      // Spectrum bars
      this.spectrumData = this.spectrumData.map((val) => {
        const change = (Math.random() - 0.5) * 40;
        const decay = val > 100 ? -10 : 5;
        return Math.max(20, Math.min(255, val + change + decay));
      });

      // Compressor levels
      this.gainReduction.set(-Math.random() * 12);
      this.inputLevel.set(-6 - Math.random() * 12);
      this.outputLevel.set(-12 - Math.random() * 12);
    }, 100);
  }

  toggleOscilloscopeSignal(): void {
    if (this.oscilloscopeAnalyser()) {
      this.stopOscilloscopeSignal();
      return;
    }

    // Silent signal graph: oscillator -> analyser (never routed to speakers)
    this.oscilloscopeContext = new AudioContext();
    const analyser = this.oscilloscopeContext.createAnalyser();
    this.oscillator = this.oscilloscopeContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 220;
    this.oscillator.connect(analyser);
    this.oscillator.start();
    this.oscilloscopeAnalyser.set(analyser);
  }

  private stopOscilloscopeSignal(): void {
    this.oscillator?.stop();
    this.oscillator?.disconnect();
    this.oscillator = undefined;
    void this.oscilloscopeContext?.close();
    this.oscilloscopeContext = undefined;
    this.oscilloscopeAnalyser.set(undefined);
  }

  onSeek(position: number): void {
    this.waveformProgress = position;
  }

  onScrubberSeek(time: number): void {
    this.currentTime.set(time);
  }

  onPlay(): void {
    this.isPlaying.set(true);
  }

  onPause(): void {
    this.isPlaying.set(false);
  }

  onStop(): void {
    this.isPlaying.set(false);
    this.currentTime.set(0);
  }

  onLoopToggle(value: boolean): void {
    this.isLooping.set(value);
  }

  onNoteOn(event: NoteEvent): void {
    this.lastNote.set(`${event.note}${event.octave}`);
  }

  onNoteOff(_event: NoteEvent): void {
    // Handle note off
  }

  onBpmChange(bpm: number): void {
    this.currentBpm.set(bpm);
  }

  // Code examples
  dialBasicCode = `<tw-volume-dial [(ngModel)]="volume" [min]="0" [max]="100"></tw-volume-dial>`;

  dialVariantsCode = `<tw-volume-dial variant="modern" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="vintage" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="minimal" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="led" [(ngModel)]="value"></tw-volume-dial>`;

  transportCode = `<tw-transport
  [playing]="isPlaying()"
  (play)="onPlay()"
  (pause)="onPause()"
  (stop)="onStop()"
  [showLoop]="true"
  (loopToggle)="onLoopToggle($event)"
></tw-transport>`;

  scrubberCode = `<tw-scrubber
  [currentTime]="currentTime()"
  [duration]="180"
  [buffered]="120"
  (seek)="onSeek($event)"
></tw-scrubber>`;

  timeDisplayCode = `<tw-time-display [value]="currentTime" [total]="duration"></tw-time-display>
<tw-time-display [value]="currentTime" variant="led"></tw-time-display>`;

  spectrumCode = `<tw-spectrum [frequencyData]="fftData" variant="bars"></tw-spectrum>
<tw-spectrum [analyserNode]="analyser" variant="gradient"></tw-spectrum>`;

  pianoCode = `<tw-piano
  [startOctave]="4"
  [octaves]="2"
  (noteOn)="playNote($event)"
  (noteOff)="stopNote($event)"
></tw-piano>`;

  waveformCode = `<tw-waveform [peaks]="peakData" [progress]="0.5"></tw-waveform>`;

  vuMeterCode = `<tw-vu-meter [stereo]="true" variant="led"></tw-vu-meter>`;

  faderCode = `<tw-fader [(ngModel)]="value" [min]="-60" [max]="12" orientation="vertical"></tw-fader>`;

  panControlCode = `<tw-pan-control [(ngModel)]="pan" variant="knob"></tw-pan-control>
<tw-pan-control [(ngModel)]="pan" variant="slider"></tw-pan-control>`;

  oscilloscopeCode = `<!-- analyser: AnalyserNode fed by your audio graph -->
<tw-oscilloscope [analyserNode]="analyser" variant="retro" [width]="280" [height]="120"></tw-oscilloscope>
<tw-oscilloscope [analyserNode]="analyser" variant="neon" [width]="280" [height]="120"></tw-oscilloscope>`;

  metronomeCode = `<tw-metronome [bpm]="bpm" variant="digital"></tw-metronome>
<tw-metronome [bpm]="bpm" variant="pendulum"></tw-metronome>`;

  channelStripCode = `<tw-channel-strip label="CH 1" [channelNumber]="1"></tw-channel-strip>`;

  mixerCode = `<tw-mixer [channels]="channels" (channelChange)="onChannelChange($event)"></tw-mixer>`;

  visualizerCode = `<tw-visualizer [analyserNode]="analyser" variant="circular"></tw-visualizer>`;

  tunerCode = `<tw-tuner [referenceFrequency]="440" [showFrequency]="true" [showCents]="true" [showMeter]="true"></tw-tuner>`;

  noteDisplayCode = `<tw-note-display [noteName]="currentNote" [octave]="currentOctave" [showCents]="true"></tw-note-display>
<tw-note-display [noteName]="currentNote" [octave]="currentOctave" variant="led" [showOctave]="true"></tw-note-display>`;

  bpmDisplayCode = `<tw-bpm-display [(bpm)]="bpm" [showTapTempo]="true"></tw-bpm-display>`;

  compressorCode = `<tw-compressor-meter [gainReduction]="-6" [threshold]="-18"></tw-compressor-meter>`;

  chordDiagramCode = `<tw-chord-diagram chord="C"></tw-chord-diagram>
<tw-chord-diagram chord="Am" variant="detailed"></tw-chord-diagram>`;

  pianoChordCode = `<tw-piano-chord chord="C"></tw-piano-chord>`;

  graphicEqCode = `<tw-graphic-eq [bandCount]="10" [sliderHeight]="200"></tw-graphic-eq>`;

  parametricEqCode = `<tw-parametric-eq [bands]="bands" (bandChange)="onBandChange($event)"></tw-parametric-eq>`;

  staffCode = `<tw-staff [clef]="'treble'" [keySignature]="'C'" [timeSignature]="'4/4'"></tw-staff>`;

  looperCode = `<tw-looper [maxLayers]="4"></tw-looper>`;
}
