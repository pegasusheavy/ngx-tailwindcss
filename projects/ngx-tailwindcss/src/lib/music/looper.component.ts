import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

export type LooperVariant = 'default' | 'minimal' | 'compact' | 'studio';
export type LooperSize = 'sm' | 'md' | 'lg';
export type LooperState = 'idle' | 'recording' | 'playing' | 'overdubbing' | 'stopped';

export interface LoopLayer {
  id: number;
  audioBuffer: AudioBuffer | null;
  volume: number; // 0-1
  muted: boolean;
  name: string;
}

export interface LooperEvent {
  type:
    | 'record-start'
    | 'record-stop'
    | 'play'
    | 'stop'
    | 'overdub-start'
    | 'overdub-stop'
    | 'clear'
    | 'undo'
    | 'redo';
  timestamp: number;
  layerId?: number;
}

/**
 * Loop Pedal / Looper component for recording and playing audio loops
 *
 * @example
 * ```html
 * <tw-looper></tw-looper>
 * <tw-looper [maxLayers]="4" [showWaveform]="true"></tw-looper>
 * ```
 */
@Component({
  selector: 'tw-looper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './looper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class TwLooperComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  // Canvas reference
  readonly waveformCanvas = viewChild<ElementRef<HTMLCanvasElement>>('waveformCanvas');

  // Configuration
  readonly variant = input<LooperVariant>('default');
  readonly size = input<LooperSize>('md');
  readonly maxLayers = input(4, { transform: numberAttribute });
  readonly maxDuration = input(60, { transform: numberAttribute }); // Max loop duration in seconds
  readonly showWaveform = input(true);
  readonly showLayers = input(true);
  readonly showTimer = input(true);
  readonly showControls = input(true);
  readonly showUndoRedo = input(true);
  readonly showSpeedControl = input(false);
  readonly showVolumeControl = input(true);
  readonly autoPlay = input(true); // Auto-play after first recording
  readonly countIn = input(false); // Count-in before recording
  readonly countInBeats = input(4, { transform: numberAttribute });
  readonly clickTrack = input(false); // Metronome during recording
  readonly clickBpm = input(120, { transform: numberAttribute });
  readonly disabled = input(false);
  readonly classOverride = input('');

  // Audio input (optional external source)
  readonly audioSource = input<MediaStreamAudioSourceNode | null>(null);

  // Outputs
  readonly stateChange = output<LooperState>();
  readonly loopEvent = output<LooperEvent>();
  readonly layerChange = output<LoopLayer[]>();
  readonly durationChange = output<number>();

  // Internal state
  protected readonly state = signal<LooperState>('idle');
  protected readonly layers = signal<LoopLayer[]>([]);
  protected readonly currentLayerIndex = signal(0);
  protected readonly loopDuration = signal(0); // Duration in seconds
  protected readonly currentPosition = signal(0); // Current playback position
  protected readonly masterVolume = signal(1);
  protected readonly playbackSpeed = signal(1);
  protected readonly isCountingIn = signal(false);
  protected readonly countInBeat = signal(0);

  // Undo/redo history
  private undoStack: AudioBuffer[] = [];
  private redoStack: AudioBuffer[] = [];

  // Audio context and nodes
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private sourceNodes: AudioBufferSourceNode[] = [];
  private gainNodes: GainNode[] = [];
  private masterGainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private recordingStartTime = 0;
  private animationFrame: number | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private layerIdCounter = 0;

  ngOnInit(): void {
    // Update position during playback
    interval(50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.state() === 'playing' || this.state() === 'overdubbing') {
          this.updatePosition();
        }
      });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async initAudio(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    // Get microphone access if no external source
    if (!this.audioSource()) {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        console.error('Failed to get microphone access');
      }
    }
  }

  private cleanup(): void {
    this.stopAllPlayback();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // Main control methods
  async record(): Promise<void> {
    if (this.disabled()) return;

    await this.initAudio();
    if (!this.audioContext) return;

    // Count-in if enabled
    if (this.countIn() && this.state() === 'idle') {
      await this.performCountIn();
    }

    this.setState('recording');
    this.recordedChunks = [];
    this.recordingStartTime = this.audioContext.currentTime;

    // Start recording
    if (this.mediaStream) {
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.onstop = () => this.processRecording();
      this.mediaRecorder.start(100); // Collect data every 100ms
    }

    this.emitEvent('record-start');
    this.startWaveformAnimation();
  }

  async stopRecording(): Promise<void> {
    if (this.state() !== 'recording' && this.state() !== 'overdubbing') return;

    const wasOverdubbing = this.state() === 'overdubbing';

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.setState(wasOverdubbing ? 'playing' : 'stopped');
    this.emitEvent(wasOverdubbing ? 'overdub-stop' : 'record-stop');

    if (this.autoPlay() && !wasOverdubbing && this.layers().length > 0) {
      this.play();
    }
  }

  play(): void {
    if (this.disabled() || this.layers().length === 0) return;

    this.setState('playing');
    this.currentPosition.set(0);
    this.playAllLayers();
    this.emitEvent('play');
    this.startWaveformAnimation();
  }

  stop(): void {
    this.stopAllPlayback();
    this.setState('stopped');
    this.currentPosition.set(0);
    this.emitEvent('stop');
  }

  async overdub(): Promise<void> {
    if (this.disabled() || this.loopDuration() === 0) return;

    await this.initAudio();
    if (!this.audioContext) return;

    // Start playing existing layers
    this.playAllLayers();

    // Start recording new layer
    this.setState('overdubbing');
    this.recordedChunks = [];
    this.recordingStartTime = this.audioContext.currentTime;

    if (this.mediaStream) {
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.onstop = () => this.processRecording();
      this.mediaRecorder.start(100);
    }

    this.emitEvent('overdub-start');
  }

  clear(): void {
    this.stopAllPlayback();
    this.layers.set([]);
    this.loopDuration.set(0);
    this.currentPosition.set(0);
    this.undoStack = [];
    this.redoStack = [];
    this.setState('idle');
    this.emitEvent('clear');
    this.layerChange.emit([]);
    this.durationChange.emit(0);
    this.clearWaveform();
  }

  undo(): void {
    const currentLayers = this.layers();
    if (currentLayers.length === 0) return;

    const lastLayer = currentLayers[currentLayers.length - 1];
    if (lastLayer.audioBuffer) {
      this.redoStack.push(lastLayer.audioBuffer);
    }

    this.layers.set(currentLayers.slice(0, -1));
    this.emitEvent('undo');
    this.layerChange.emit(this.layers());
    this.drawWaveform();
  }

  redo(): void {
    if (this.redoStack.length === 0 || this.layers().length >= this.maxLayers()) return;

    const buffer = this.redoStack.pop()!;
    const newLayer: LoopLayer = {
      id: this.layerIdCounter++,
      audioBuffer: buffer,
      volume: 1,
      muted: false,
      name: `Layer ${this.layers().length + 1}`,
    };

    this.layers.update(layers => [...layers, newLayer]);
    this.emitEvent('redo');
    this.layerChange.emit(this.layers());
    this.drawWaveform();
  }

  // Layer controls
  setLayerVolume(layerId: number, volume: number): void {
    this.layers.update(layers =>
      layers.map(l => (l.id === layerId ? { ...l, volume: Math.max(0, Math.min(1, volume)) } : l))
    );

    // Update gain node if playing
    const layerIndex = this.layers().findIndex(l => l.id === layerId);
    if (layerIndex >= 0 && this.gainNodes[layerIndex]) {
      this.gainNodes[layerIndex].gain.value = volume;
    }

    this.layerChange.emit(this.layers());
  }

  toggleLayerMute(layerId: number): void {
    this.layers.update(layers =>
      layers.map(l => (l.id === layerId ? { ...l, muted: !l.muted } : l))
    );

    // Update gain node if playing
    const layer = this.layers().find(l => l.id === layerId);
    const layerIndex = this.layers().findIndex(l => l.id === layerId);
    if (layer && layerIndex >= 0 && this.gainNodes[layerIndex]) {
      this.gainNodes[layerIndex].gain.value = layer.muted ? 0 : layer.volume;
    }

    this.layerChange.emit(this.layers());
  }

  deleteLayer(layerId: number): void {
    const layer = this.layers().find(l => l.id === layerId);
    if (layer?.audioBuffer) {
      this.undoStack.push(layer.audioBuffer);
    }

    this.layers.update(layers => layers.filter(l => l.id !== layerId));
    this.layerChange.emit(this.layers());
    this.drawWaveform();

    if (this.layers().length === 0) {
      this.clear();
    }
  }

  // Volume and speed controls
  setMasterVolume(volume: number): void {
    this.masterVolume.set(Math.max(0, Math.min(1, volume)));
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.masterVolume();
    }
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed.set(Math.max(0.5, Math.min(2, speed)));
    // Note: Changing speed during playback would require recreating source nodes
  }

  // Helper methods
  private setState(newState: LooperState): void {
    this.state.set(newState);
    this.stateChange.emit(newState);
  }

  private emitEvent(type: LooperEvent['type'], layerId?: number): void {
    this.loopEvent.emit({
      type,
      timestamp: Date.now(),
      layerId,
    });
  }

  private async performCountIn(): Promise<void> {
    if (!this.audioContext) return;

    this.isCountingIn.set(true);
    const beatDuration = 60 / this.clickBpm();

    for (let i = 0; i < this.countInBeats(); i++) {
      this.countInBeat.set(i + 1);
      this.playClickSound(i === 0);
      await this.sleep(beatDuration * 1000);
    }

    this.isCountingIn.set(false);
    this.countInBeat.set(0);
  }

  private playClickSound(accent: boolean): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.value = accent ? 1200 : 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processRecording(): Promise<void> {
    if (!this.audioContext || this.recordedChunks.length === 0) return;

    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    const arrayBuffer = await blob.arrayBuffer();

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Set loop duration from first recording
      if (this.loopDuration() === 0) {
        const duration = Math.min(audioBuffer.duration, this.maxDuration());
        this.loopDuration.set(duration);
        this.durationChange.emit(duration);
      }

      // Create new layer
      if (this.layers().length < this.maxLayers()) {
        const newLayer: LoopLayer = {
          id: this.layerIdCounter++,
          audioBuffer,
          volume: 1,
          muted: false,
          name: `Layer ${this.layers().length + 1}`,
        };

        this.layers.update(layers => [...layers, newLayer]);
        this.layerChange.emit(this.layers());
        this.redoStack = []; // Clear redo stack on new recording
        this.drawWaveform();
      }
    } catch (err) {
      console.error('Error decoding audio:', err);
    }
  }

  private playAllLayers(): void {
    if (!this.audioContext || !this.masterGainNode) return;

    this.stopAllPlayback();

    const layers = this.layers();
    const speed = this.playbackSpeed();

    layers.forEach((layer, index) => {
      if (!layer.audioBuffer || layer.muted) return;

      const source = this.audioContext!.createBufferSource();
      const gain = this.audioContext!.createGain();

      source.buffer = layer.audioBuffer;
      source.loop = true;
      source.playbackRate.value = speed;

      gain.gain.value = layer.volume;

      source.connect(gain);
      gain.connect(this.masterGainNode!);

      source.start(0);

      this.sourceNodes[index] = source;
      this.gainNodes[index] = gain;
    });
  }

  private stopAllPlayback(): void {
    this.sourceNodes.forEach(source => {
      try {
        source.stop();
      } catch {
        // Source might not be started
      }
    });
    this.sourceNodes = [];
    this.gainNodes = [];
  }

  private updatePosition(): void {
    if (!this.audioContext || this.loopDuration() === 0) return;

    const elapsed =
      (this.audioContext.currentTime - this.recordingStartTime) * this.playbackSpeed();
    const position = elapsed % this.loopDuration();
    this.currentPosition.set(position);
  }

  // Waveform visualization
  private startWaveformAnimation(): void {
    if (!this.showWaveform()) return;

    const canvas = this.waveformCanvas()?.nativeElement;
    if (!canvas) return;

    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.drawWaveformFrame();
  }

  private drawWaveformFrame(): void {
    if (
      !this.ctx ||
      (this.state() !== 'playing' && this.state() !== 'recording' && this.state() !== 'overdubbing')
    ) {
      return;
    }

    this.drawWaveform();
    this.animationFrame = requestAnimationFrame(() => this.drawWaveformFrame());
  }

  private drawWaveform(): void {
    const canvas = this.waveformCanvas()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgb(30, 41, 59)'; // slate-800
    ctx.fillRect(0, 0, width, height);

    // Draw combined waveform from all layers
    const layers = this.layers();
    if (layers.length === 0) return;

    ctx.strokeStyle = 'rgb(59, 130, 246)'; // blue-500
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Sample the first layer's audio data for visualization
    const firstLayerWithBuffer = layers.find(l => l.audioBuffer && !l.muted);
    if (firstLayerWithBuffer?.audioBuffer) {
      const data = firstLayerWithBuffer.audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / width);

      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;

        for (let j = 0; j < step; j++) {
          const datum = data[i * step + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }

        const yMin = ((1 + min) / 2) * height;
        const yMax = ((1 + max) / 2) * height;

        if (i === 0) {
          ctx.moveTo(i, yMin);
        } else {
          ctx.lineTo(i, yMin);
          ctx.lineTo(i, yMax);
        }
      }
    }

    ctx.stroke();

    // Draw playhead
    if (this.loopDuration() > 0 && (this.state() === 'playing' || this.state() === 'overdubbing')) {
      const playheadX = (this.currentPosition() / this.loopDuration()) * width;
      ctx.strokeStyle = 'rgb(234, 179, 8)'; // amber-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }
  }

  private clearWaveform(): void {
    const canvas = this.waveformCanvas()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgb(30, 41, 59)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Computed classes
  protected readonly containerClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();

    const base = 'flex flex-col rounded-xl overflow-hidden';

    const variantClasses: Record<LooperVariant, string> = {
      default: 'bg-slate-900 border border-slate-700 p-4',
      minimal: 'bg-transparent p-2',
      compact: 'bg-slate-800 border border-slate-700 p-2',
      studio: 'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 p-4 shadow-xl',
    };

    const sizeClasses: Record<LooperSize, string> = {
      sm: 'gap-2 min-w-[240px]',
      md: 'gap-3 min-w-[320px]',
      lg: 'gap-4 min-w-[400px]',
    };

    return [base, variantClasses[variant], sizeClasses[size], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly buttonSizeClasses = computed(() => {
    const size = this.size();
    return {
      sm: 'w-10 h-10 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-14 h-14 text-lg',
    }[size];
  });

  protected readonly canvasSize = computed(() => {
    const size = this.size();
    return {
      sm: { width: 220, height: 60 },
      md: { width: 300, height: 80 },
      lg: { width: 380, height: 100 },
    }[size];
  });

  // Display values
  protected readonly formattedDuration = computed(() => {
    const duration = this.loopDuration();
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    const ms = Math.floor((duration % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  });

  protected readonly formattedPosition = computed(() => {
    const pos = this.currentPosition();
    const mins = Math.floor(pos / 60);
    const secs = Math.floor(pos % 60);
    const ms = Math.floor((pos % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  });

  protected readonly progressPercent = computed(() => {
    const duration = this.loopDuration();
    if (duration === 0) return 0;
    return (this.currentPosition() / duration) * 100;
  });

  protected readonly canUndo = computed(() => this.layers().length > 0);
  protected readonly canRedo = computed(() => this.redoStack.length > 0);
  protected readonly canOverdub = computed(
    () => this.loopDuration() > 0 && this.layers().length < this.maxLayers()
  );
  protected readonly isActive = computed(
    () => this.state() !== 'idle' && this.state() !== 'stopped'
  );
}
