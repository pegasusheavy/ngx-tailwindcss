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
  NoteEvent,
} from '@pegasus-heavy/ngx-tailwindcss';
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

  // VU Meter state
  @ViewChild('vuMeter') vuMeter?: TwVuMeterComponent;
  meterValue = signal(0);
  leftChannel = signal(0);
  rightChannel = signal(0);
  private meterInterval?: ReturnType<typeof setInterval>;

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
  private spectrumInterval?: ReturnType<typeof setInterval>;

  // Piano state
  lastNote = signal<string>('');

  constructor() {
    this.generateSamplePeaks();
    this.generateSpectrumData();
  }

  ngOnInit(): void {
    this.startMeterSimulation();
    this.startSpectrumSimulation();
  }

  ngOnDestroy(): void {
    if (this.meterInterval) {
      clearInterval(this.meterInterval);
    }
    if (this.spectrumInterval) {
      clearInterval(this.spectrumInterval);
    }
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

  private startMeterSimulation(): void {
    this.meterInterval = setInterval(() => {
      const baseLevel = 50 + Math.sin(Date.now() / 500) * 20;
      const leftNoise = Math.random() * 30;
      const rightNoise = Math.random() * 30;

      this.leftChannel.set(Math.min(100, baseLevel + leftNoise));
      this.rightChannel.set(Math.min(100, baseLevel + rightNoise - 5));
      this.meterValue.set(Math.min(100, baseLevel + (leftNoise + rightNoise) / 2));

      if (this.vuMeter) {
        this.vuMeter.setValues(this.leftChannel(), this.rightChannel());
      }
    }, 50);
  }

  private startSpectrumSimulation(): void {
    this.spectrumInterval = setInterval(() => {
      this.spectrumData = this.spectrumData.map((val, i) => {
        const change = (Math.random() - 0.5) * 40;
        const decay = val > 100 ? -10 : 5;
        return Math.max(20, Math.min(255, val + change + decay));
      });
    }, 50);
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

  onNoteOff(event: NoteEvent): void {
    // Handle note off
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
}
