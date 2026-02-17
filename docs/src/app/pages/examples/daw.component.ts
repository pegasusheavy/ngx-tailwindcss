import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faPlay,
  faPause,
  faStop,
  faBackward,
  faForward,
  faRecordVinyl,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faMusic,
  faMicrophone,
  faDrum,
  faGuitar,
  faKeyboard,
  faPlus,
  faCopy,
  faCut,
  faPaste,
  faUndo,
  faRedo,
  faSave,
  faFolderOpen,
  faCog,
  faSliders,
  faWaveSquare,
  faMagnet,
  faExpand,
  faCompress,
} from '@fortawesome/free-solid-svg-icons';
import { TwToastService } from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface Track {
  id: number;
  name: string;
  type: 'audio' | 'midi' | 'bus';
  icon: any;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: Clip[];
}

interface Clip {
  id: number;
  name: string;
  start: number;
  length: number;
  color: string;
}

@Component({
  selector: 'app-daw',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    ThemeToggleComponent,
  ],
  templateUrl: './daw.component.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
    .grid-lines {
      background-image:
        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 120px 100%, 30px 100%;
    }
    .fader-track {
      background: linear-gradient(to top,
        #22c55e 0%, #22c55e 60%,
        #eab308 60%, #eab308 80%,
        #ef4444 80%, #ef4444 100%
      );
    }
    @keyframes playhead-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .playhead { animation: playhead-pulse 1s ease-in-out infinite; }
  `],
})
export class DawComponent {
  protected icons = {
    arrowLeft: faArrowLeft,
    play: faPlay,
    pause: faPause,
    stop: faStop,
    backward: faBackward,
    forward: faForward,
    record: faRecordVinyl,
    volumeHigh: faVolumeHigh,
    volumeLow: faVolumeLow,
    volumeMute: faVolumeXmark,
    music: faMusic,
    mic: faMicrophone,
    drum: faDrum,
    guitar: faGuitar,
    keyboard: faKeyboard,
    plus: faPlus,
    copy: faCopy,
    cut: faCut,
    paste: faPaste,
    undo: faUndo,
    redo: faRedo,
    save: faSave,
    open: faFolderOpen,
    settings: faCog,
    mixer: faSliders,
    wave: faWaveSquare,
    snap: faMagnet,
    expand: faExpand,
    compress: faCompress,
  };

  protected isPlaying = signal(false);
  protected isRecording = signal(false);
  protected currentBeat = signal(1);
  protected currentBar = signal(1);
  protected tempo = signal(120);
  protected timeSignature = signal('4/4');
  protected loopEnabled = signal(false);
  protected snapEnabled = signal(true);
  protected masterVolume = signal(80);
  protected zoom = signal(1);
  protected showMixer = signal(true);
  protected selectedTrackId = signal<number | null>(1);

  protected tracks = signal<Track[]>([
    {
      id: 1, name: 'Drums', type: 'audio', icon: faDrum, color: '#ef4444',
      volume: 75, pan: 0, muted: false, solo: false, armed: false,
      clips: [
        { id: 1, name: 'Drum Loop 1', start: 1, length: 4, color: '#ef4444' },
        { id: 2, name: 'Drum Loop 2', start: 5, length: 4, color: '#f87171' },
        { id: 3, name: 'Drum Fill', start: 9, length: 2, color: '#ef4444' },
      ],
    },
    {
      id: 2, name: 'Bass', type: 'midi', icon: faMusic, color: '#8b5cf6',
      volume: 70, pan: 0, muted: false, solo: false, armed: false,
      clips: [
        { id: 4, name: 'Bass Line A', start: 1, length: 8, color: '#8b5cf6' },
      ],
    },
    {
      id: 3, name: 'Synth Lead', type: 'midi', icon: faKeyboard, color: '#06b6d4',
      volume: 65, pan: -20, muted: false, solo: false, armed: false,
      clips: [
        { id: 5, name: 'Lead Melody', start: 5, length: 8, color: '#06b6d4' },
      ],
    },
    {
      id: 4, name: 'Pad', type: 'midi', icon: faWaveSquare, color: '#10b981',
      volume: 55, pan: 15, muted: false, solo: false, armed: false,
      clips: [
        { id: 6, name: 'Ambient Pad', start: 1, length: 16, color: '#10b981' },
      ],
    },
    {
      id: 5, name: 'Guitar', type: 'audio', icon: faGuitar, color: '#f59e0b',
      volume: 60, pan: 30, muted: true, solo: false, armed: false,
      clips: [
        { id: 7, name: 'Guitar Riff', start: 9, length: 4, color: '#f59e0b' },
      ],
    },
    {
      id: 6, name: 'Vocals', type: 'audio', icon: faMicrophone, color: '#ec4899',
      volume: 80, pan: 0, muted: false, solo: false, armed: true,
      clips: [],
    },
  ]);

  protected playheadPosition = computed(() => {
    const totalBeats = (this.currentBar() - 1) * 4 + this.currentBeat();
    return totalBeats * 30 * this.zoom();
  });

  protected timeDisplay = computed(() => `${this.currentBar()}.${this.currentBeat()}.1`);

  constructor(private toastService: TwToastService) {}

  togglePlay(): void {
    this.isPlaying.update(v => !v);
    if (this.isPlaying()) this.startPlayback();
  }

  stop(): void {
    this.isPlaying.set(false);
    this.isRecording.set(false);
    this.currentBar.set(1);
    this.currentBeat.set(1);
  }

  toggleRecord(): void {
    this.isRecording.update(v => !v);
    if (this.isRecording() && !this.isPlaying()) {
      this.isPlaying.set(true);
      this.startPlayback();
    }
  }

  private startPlayback(): void {
    const interval = (60 / this.tempo()) * 1000;
    const timer = setInterval(() => {
      if (!this.isPlaying()) { clearInterval(timer); return; }
      this.currentBeat.update(b => {
        if (b >= 4) { this.currentBar.update(bar => bar + 1); return 1; }
        return b + 1;
      });
    }, interval);
  }

  skipBackward(): void { this.currentBar.update(b => Math.max(1, b - 1)); }
  skipForward(): void { this.currentBar.update(b => b + 1); }

  toggleMute(trackId: number): void {
    this.tracks.update(tracks => tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t));
  }

  toggleSolo(trackId: number): void {
    this.tracks.update(tracks => tracks.map(t => t.id === trackId ? { ...t, solo: !t.solo } : t));
  }

  toggleArm(trackId: number): void {
    this.tracks.update(tracks => tracks.map(t => t.id === trackId ? { ...t, armed: !t.armed } : t));
  }

  updateTrackVolume(trackId: number, volume: number): void {
    this.tracks.update(tracks => tracks.map(t => t.id === trackId ? { ...t, volume } : t));
  }

  selectTrack(trackId: number): void { this.selectedTrackId.set(trackId); }

  addTrack(): void {
    const newId = Math.max(...this.tracks().map(t => t.id)) + 1;
    this.tracks.update(tracks => [...tracks, {
      id: newId, name: `Track ${newId}`, type: 'audio', icon: faMusic, color: '#6b7280',
      volume: 75, pan: 0, muted: false, solo: false, armed: false, clips: [],
    }]);
    this.toastService.success('Track added');
  }

  getClipStyle(clip: Clip, zoom: number): { left: string; width: string } {
    const pxPerBeat = 30 * zoom;
    return { left: `${(clip.start - 1) * pxPerBeat}px`, width: `${clip.length * pxPerBeat}px` };
  }

  getVolumeIcon(volume: number): any {
    if (volume === 0) return this.icons.volumeMute;
    if (volume < 50) return this.icons.volumeLow;
    return this.icons.volumeHigh;
  }

  formatPan(pan: number): string {
    if (pan === 0) return 'C';
    return pan < 0 ? `L${Math.abs(pan)}` : `R${pan}`;
  }

  zoomIn(): void { this.zoom.update(z => Math.min(3, z + 0.25)); }
  zoomOut(): void { this.zoom.update(z => Math.max(0.5, z - 0.25)); }
}
