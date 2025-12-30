import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TwVolumeDialComponent,
  TwVuMeterComponent,
  TwWaveformComponent,
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
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './music-demo.component.html',
})
export class MusicDemoComponent {
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

  constructor() {
    // Generate sample waveform data
    this.generateSamplePeaks();
  }

  ngOnInit(): void {
    // Start simulated audio levels
    this.startMeterSimulation();
  }

  ngOnDestroy(): void {
    if (this.meterInterval) {
      clearInterval(this.meterInterval);
    }
  }

  private generateSamplePeaks(): void {
    // Generate a realistic-looking waveform
    this.samplePeaks = [];
    for (let i = 0; i < 200; i++) {
      // Create a pattern that looks like audio
      const base = 0.3 + Math.random() * 0.4;
      const variation = Math.sin(i / 10) * 0.2;
      const peak = Math.max(0.1, Math.min(1, base + variation + (Math.random() - 0.5) * 0.3));
      this.samplePeaks.push(peak);
    }
  }

  private startMeterSimulation(): void {
    this.meterInterval = setInterval(() => {
      // Simulate varying audio levels
      const baseLevel = 50 + Math.sin(Date.now() / 500) * 20;
      const leftNoise = Math.random() * 30;
      const rightNoise = Math.random() * 30;

      this.leftChannel.set(Math.min(100, baseLevel + leftNoise));
      this.rightChannel.set(Math.min(100, baseLevel + rightNoise - 5));
      this.meterValue.set(Math.min(100, baseLevel + (leftNoise + rightNoise) / 2));

      // Update the VU meter component
      if (this.vuMeter) {
        this.vuMeter.setValues(this.leftChannel(), this.rightChannel());
      }
    }, 50);
  }

  onSeek(position: number): void {
    this.waveformProgress = position;
  }

  // Code examples
  dialBasicCode = `<tw-volume-dial [(ngModel)]="volume" [min]="0" [max]="100"></tw-volume-dial>`;

  dialVariantsCode = `<tw-volume-dial variant="modern" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="vintage" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="minimal" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial variant="led" [(ngModel)]="value"></tw-volume-dial>`;

  dialSizesCode = `<tw-volume-dial size="sm" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial size="md" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial size="lg" [(ngModel)]="value"></tw-volume-dial>
<tw-volume-dial size="xl" [(ngModel)]="value"></tw-volume-dial>`;

  vuMeterBasicCode = `<tw-vu-meter #meter></tw-vu-meter>

// In component:
meter.setValue(audioLevel);`;

  vuMeterStereoCode = `<tw-vu-meter [stereo]="true" #stereoMeter></tw-vu-meter>

// In component:
stereoMeter.setValues(leftChannel, rightChannel);`;

  vuMeterVariantsCode = `<tw-vu-meter variant="led"></tw-vu-meter>
<tw-vu-meter variant="gradient"></tw-vu-meter>
<tw-vu-meter variant="solid"></tw-vu-meter>
<tw-vu-meter variant="retro"></tw-vu-meter>`;

  waveformBasicCode = `<tw-waveform [peaks]="peakData" [progress]="0.5"></tw-waveform>`;

  waveformVariantsCode = `<tw-waveform [peaks]="peaks" variant="bars"></tw-waveform>
<tw-waveform [peaks]="peaks" variant="line"></tw-waveform>
<tw-waveform [peaks]="peaks" variant="mirror"></tw-waveform>
<tw-waveform [peaks]="peaks" variant="gradient"></tw-waveform>`;

  waveformInteractiveCode = `<tw-waveform
  [peaks]="peaks"
  [progress]="progress"
  [seekable]="true"
  (seek)="onSeek($event)"
></tw-waveform>`;
}

