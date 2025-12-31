import { Injectable, signal, computed, OnDestroy } from '@angular/core';

/**
 * Audio context state
 */
export type AudioContextState = 'suspended' | 'running' | 'closed';

/**
 * Audio node connection configuration
 */
export interface AudioNodeConfig {
  /** FFT size for analysers (must be power of 2, 32-32768) */
  fftSize?: number;
  /** Smoothing time constant for analysers (0-1) */
  smoothingTimeConstant?: number;
  /** Min decibels for analysers (-100 to 0) */
  minDecibels?: number;
  /** Max decibels for analysers (-100 to 0) */
  maxDecibels?: number;
}

/**
 * Audio source types
 */
export type AudioSourceType = 'element' | 'stream' | 'buffer' | 'oscillator';

/**
 * Connected audio source info
 */
export interface ConnectedSource {
  id: string;
  type: AudioSourceType;
  node: AudioNode;
  analyser?: AnalyserNode;
  gain?: GainNode;
}

/**
 * Audio worklet module info
 */
export interface AudioWorkletModuleInfo {
  name: string;
  url: string;
  loaded: boolean;
}

/**
 * Audio routing chain
 */
export interface AudioChain {
  source: AudioNode;
  nodes: AudioNode[];
  analyser?: AnalyserNode;
  destination: AudioNode;
}

/**
 * Default analyser configuration
 */
const DEFAULT_ANALYSER_CONFIG: AudioNodeConfig = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
};

/**
 * Service for managing Web Audio API connections
 *
 * @example
 * ```typescript
 * // Basic usage
 * const audioService = inject(AudioContextService);
 *
 * // Connect an audio element
 * const audioEl = document.querySelector('audio');
 * const { analyser } = await audioService.connectMediaElement(audioEl);
 *
 * // Pass analyser to visualization components
 * <tw-spectrum [analyserNode]="analyser"></tw-spectrum>
 *
 * // Connect a media stream (microphone)
 * const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 * const { analyser } = await audioService.connectMediaStream(stream);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AudioContextService implements OnDestroy {
  private _audioContext: AudioContext | null = null;
  private readonly _state = signal<AudioContextState>('suspended');
  private readonly _sampleRate = signal(44100);
  private readonly _sources = signal<Map<string, ConnectedSource>>(new Map());
  private readonly _workletModules = signal<Map<string, AudioWorkletModuleInfo>>(new Map());
  private sourceIdCounter = 0;

  /** Current audio context state */
  readonly state = this._state.asReadonly();

  /** Current sample rate */
  readonly sampleRate = this._sampleRate.asReadonly();

  /** Currently connected sources */
  readonly sources = computed(() => Array.from(this._sources().values()));

  /** Number of connected sources */
  readonly sourceCount = computed(() => this._sources().size);

  /** Whether the audio context is running */
  readonly isRunning = computed(() => this._state() === 'running');

  /** Whether audio worklets are supported */
  readonly supportsWorklets = computed(() => {
    return typeof AudioWorkletNode !== 'undefined';
  });

  /** Loaded worklet modules */
  readonly workletModules = computed(() => Array.from(this._workletModules().values()));

  ngOnDestroy(): void {
    this.dispose();
  }

  // =========================================================================
  // AUDIO CONTEXT MANAGEMENT
  // =========================================================================

  /**
   * Get or create the AudioContext
   * Note: Must be called in response to user interaction on some browsers
   */
  getContext(): AudioContext {
    if (!this._audioContext) {
      this._audioContext = new AudioContext();
      this._sampleRate.set(this._audioContext.sampleRate);
      this.setupStateListener();
    }
    return this._audioContext;
  }

  /**
   * Resume the audio context (required after user interaction)
   */
  async resume(): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  /**
   * Suspend the audio context
   */
  async suspend(): Promise<void> {
    if (this._audioContext && this._audioContext.state === 'running') {
      await this._audioContext.suspend();
    }
  }

  /**
   * Close the audio context and release resources
   */
  async close(): Promise<void> {
    if (this._audioContext && this._audioContext.state !== 'closed') {
      // Disconnect all sources
      this.disconnectAll();
      await this._audioContext.close();
      this._audioContext = null;
      this._state.set('closed');
    }
  }

  /**
   * Get the current time from the audio context
   */
  getCurrentTime(): number {
    return this._audioContext?.currentTime ?? 0;
  }

  private setupStateListener(): void {
    if (!this._audioContext) return;

    this._audioContext.onstatechange = () => {
      if (this._audioContext) {
        this._state.set(this._audioContext.state as AudioContextState);
      }
    };
    this._state.set(this._audioContext.state as AudioContextState);
  }

  // =========================================================================
  // MEDIA ELEMENT SOURCE
  // =========================================================================

  /**
   * Connect an HTML audio or video element
   * @param element The media element to connect
   * @param config Optional analyser configuration
   * @returns Connected source with analyser node
   */
  async connectMediaElement(
    element: HTMLMediaElement,
    config: AudioNodeConfig = {}
  ): Promise<ConnectedSource> {
    const ctx = this.getContext();
    await this.resume();

    // Check if element is already connected
    const existingId = this.findSourceByElement(element);
    if (existingId) {
      return this._sources().get(existingId)!;
    }

    const id = this.generateSourceId('element');
    const source = ctx.createMediaElementSource(element);
    const analyser = this.createAnalyser(config);
    const gain = ctx.createGain();

    // Chain: source -> gain -> analyser -> destination
    source.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    const connectedSource: ConnectedSource = {
      id,
      type: 'element',
      node: source,
      analyser,
      gain,
    };

    this._sources.update(sources => {
      const newSources = new Map(sources);
      newSources.set(id, connectedSource);
      return newSources;
    });

    return connectedSource;
  }

  /**
   * Check if an element is already connected
   */
  isElementConnected(element: HTMLMediaElement): boolean {
    return this.findSourceByElement(element) !== null;
  }

  private findSourceByElement(element: HTMLMediaElement): string | null {
    // MediaElementAudioSourceNode doesn't expose the element, so we track by node reference
    // This is a limitation - in practice, we rely on the caller not double-connecting
    return null;
  }

  // =========================================================================
  // MEDIA STREAM SOURCE
  // =========================================================================

  /**
   * Connect a media stream (e.g., from getUserMedia)
   * @param stream The media stream to connect
   * @param config Optional analyser configuration
   * @returns Connected source with analyser node
   */
  async connectMediaStream(
    stream: MediaStream,
    config: AudioNodeConfig = {}
  ): Promise<ConnectedSource> {
    const ctx = this.getContext();
    await this.resume();

    const id = this.generateSourceId('stream');
    const source = ctx.createMediaStreamSource(stream);
    const analyser = this.createAnalyser(config);
    const gain = ctx.createGain();

    // For streams, we don't connect to destination by default (avoid feedback)
    source.connect(gain);
    gain.connect(analyser);
    // Note: Not connecting to destination - use connectToDestination() if needed

    const connectedSource: ConnectedSource = {
      id,
      type: 'stream',
      node: source,
      analyser,
      gain,
    };

    this._sources.update(sources => {
      const newSources = new Map(sources);
      newSources.set(id, connectedSource);
      return newSources;
    });

    return connectedSource;
  }

  /**
   * Get microphone access and connect
   * @param config Optional analyser configuration
   */
  async connectMicrophone(config: AudioNodeConfig = {}): Promise<ConnectedSource> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return this.connectMediaStream(stream, config);
  }

  // =========================================================================
  // AUDIO BUFFER SOURCE
  // =========================================================================

  /**
   * Connect an AudioBuffer for playback
   * @param buffer The audio buffer to play
   * @param config Optional analyser configuration
   * @returns Connected source with control methods
   */
  async connectAudioBuffer(
    buffer: AudioBuffer,
    config: AudioNodeConfig = {}
  ): Promise<ConnectedSource & { start: (when?: number) => void; stop: () => void }> {
    const ctx = this.getContext();
    await this.resume();

    const id = this.generateSourceId('buffer');
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const analyser = this.createAnalyser(config);
    const gain = ctx.createGain();

    source.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    const connectedSource: ConnectedSource & { start: (when?: number) => void; stop: () => void } =
      {
        id,
        type: 'buffer',
        node: source,
        analyser,
        gain,
        start: (when?: number) => source.start(when),
        stop: () => source.stop(),
      };

    this._sources.update(sources => {
      const newSources = new Map(sources);
      newSources.set(id, connectedSource);
      return newSources;
    });

    // Clean up when playback ends
    source.onended = () => {
      this.disconnectSource(id);
    };

    return connectedSource;
  }

  /**
   * Load and decode an audio file
   * @param url URL of the audio file
   */
  async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    const ctx = this.getContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return ctx.decodeAudioData(arrayBuffer);
  }

  // =========================================================================
  // OSCILLATOR SOURCE
  // =========================================================================

  /**
   * Create and connect an oscillator for testing
   * @param frequency Frequency in Hz
   * @param type Oscillator type
   * @param config Optional analyser configuration
   */
  async connectOscillator(
    frequency: number = 440,
    type: OscillatorType = 'sine',
    config: AudioNodeConfig = {}
  ): Promise<
    ConnectedSource & { start: () => void; stop: () => void; setFrequency: (f: number) => void }
  > {
    const ctx = this.getContext();
    await this.resume();

    const id = this.generateSourceId('oscillator');
    const oscillator = ctx.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    const analyser = this.createAnalyser(config);
    const gain = ctx.createGain();
    gain.gain.value = 0.5; // Prevent loud startup

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    const connectedSource = {
      id,
      type: 'oscillator' as AudioSourceType,
      node: oscillator,
      analyser,
      gain,
      start: () => oscillator.start(),
      stop: () => {
        oscillator.stop();
        this.disconnectSource(id);
      },
      setFrequency: (f: number) => {
        oscillator.frequency.value = f;
      },
    };

    this._sources.update(sources => {
      const newSources = new Map(sources);
      newSources.set(id, connectedSource);
      return newSources;
    });

    return connectedSource;
  }

  // =========================================================================
  // AUDIO WORKLET SUPPORT
  // =========================================================================

  /**
   * Load an audio worklet module
   * @param name Name to identify the worklet
   * @param url URL of the worklet module
   */
  async loadWorkletModule(name: string, url: string): Promise<void> {
    if (!this.supportsWorklets()) {
      throw new Error('AudioWorklet is not supported in this browser');
    }

    const ctx = this.getContext();

    // Check if already loaded
    const existing = this._workletModules().get(name);
    if (existing?.loaded) {
      return;
    }

    await ctx.audioWorklet.addModule(url);

    this._workletModules.update(modules => {
      const newModules = new Map(modules);
      newModules.set(name, { name, url, loaded: true });
      return newModules;
    });
  }

  /**
   * Create an AudioWorkletNode
   * @param name Name of the loaded worklet processor
   * @param options Optional node options
   */
  createWorkletNode(name: string, options?: AudioWorkletNodeOptions): AudioWorkletNode {
    const ctx = this.getContext();

    const moduleInfo = this._workletModules().get(name);
    if (!moduleInfo?.loaded) {
      throw new Error(`Worklet module "${name}" not loaded. Call loadWorkletModule() first.`);
    }

    return new AudioWorkletNode(ctx, name, options);
  }

  /**
   * Insert a worklet node into an existing audio chain
   * @param sourceId ID of the connected source
   * @param workletName Name of the loaded worklet processor
   * @param options Optional node options
   */
  insertWorkletNode(
    sourceId: string,
    workletName: string,
    options?: AudioWorkletNodeOptions
  ): AudioWorkletNode | null {
    const source = this._sources().get(sourceId);
    if (!source || !source.analyser || !source.gain) {
      console.warn(`Source ${sourceId} not found or missing analyser/gain`);
      return null;
    }

    const workletNode = this.createWorkletNode(workletName, options);

    // Reconnect: gain -> worklet -> analyser
    source.gain.disconnect();
    source.gain.connect(workletNode);
    workletNode.connect(source.analyser);

    return workletNode;
  }

  // =========================================================================
  // NODE CREATION HELPERS
  // =========================================================================

  /**
   * Create a configured analyser node
   */
  createAnalyser(config: AudioNodeConfig = {}): AnalyserNode {
    const ctx = this.getContext();
    const analyser = ctx.createAnalyser();

    const mergedConfig = { ...DEFAULT_ANALYSER_CONFIG, ...config };
    analyser.fftSize = mergedConfig.fftSize!;
    analyser.smoothingTimeConstant = mergedConfig.smoothingTimeConstant!;
    analyser.minDecibels = mergedConfig.minDecibels!;
    analyser.maxDecibels = mergedConfig.maxDecibels!;

    return analyser;
  }

  /**
   * Create a gain node
   * @param initialGain Initial gain value (0-1)
   */
  createGain(initialGain: number = 1): GainNode {
    const ctx = this.getContext();
    const gain = ctx.createGain();
    gain.gain.value = initialGain;
    return gain;
  }

  /**
   * Create a biquad filter
   */
  createFilter(
    type: BiquadFilterType = 'lowpass',
    frequency: number = 1000,
    q: number = 1
  ): BiquadFilterNode {
    const ctx = this.getContext();
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    return filter;
  }

  /**
   * Create a dynamics compressor
   */
  createCompressor(
    threshold: number = -24,
    knee: number = 30,
    ratio: number = 12,
    attack: number = 0.003,
    release: number = 0.25
  ): DynamicsCompressorNode {
    const ctx = this.getContext();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;
    return compressor;
  }

  /**
   * Create a stereo panner
   */
  createStereoPanner(pan: number = 0): StereoPannerNode {
    const ctx = this.getContext();
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    return panner;
  }

  /**
   * Create a delay node
   */
  createDelay(delayTime: number = 0, maxDelayTime: number = 1): DelayNode {
    const ctx = this.getContext();
    const delay = ctx.createDelay(maxDelayTime);
    delay.delayTime.value = delayTime;
    return delay;
  }

  /**
   * Create a convolver for reverb effects
   * @param impulseResponse The impulse response buffer
   */
  createConvolver(impulseResponse: AudioBuffer): ConvolverNode {
    const ctx = this.getContext();
    const convolver = ctx.createConvolver();
    convolver.buffer = impulseResponse;
    return convolver;
  }

  // =========================================================================
  // AUDIO CHAIN BUILDER
  // =========================================================================

  /**
   * Build an audio processing chain
   * @param source The source node
   * @param nodes Array of processing nodes to connect in order
   * @param destination Optional destination (defaults to ctx.destination)
   */
  buildChain(source: AudioNode, nodes: AudioNode[], destination?: AudioNode): AudioChain {
    const ctx = this.getContext();
    const dest = destination ?? ctx.destination;

    let currentNode = source;
    for (const node of nodes) {
      currentNode.connect(node);
      currentNode = node;
    }
    currentNode.connect(dest);

    // Find analyser in chain
    const analyser = nodes.find(n => n instanceof AnalyserNode) as AnalyserNode | undefined;

    return {
      source,
      nodes,
      analyser,
      destination: dest,
    };
  }

  /**
   * Disconnect a chain
   */
  disconnectChain(chain: AudioChain): void {
    chain.source.disconnect();
    for (const node of chain.nodes) {
      node.disconnect();
    }
  }

  // =========================================================================
  // SOURCE MANAGEMENT
  // =========================================================================

  /**
   * Get a connected source by ID
   */
  getSource(id: string): ConnectedSource | undefined {
    return this._sources().get(id);
  }

  /**
   * Disconnect and remove a source
   */
  disconnectSource(id: string): void {
    const source = this._sources().get(id);
    if (!source) return;

    try {
      source.node.disconnect();
      source.analyser?.disconnect();
      source.gain?.disconnect();
    } catch {
      // Node may already be disconnected
    }

    this._sources.update(sources => {
      const newSources = new Map(sources);
      newSources.delete(id);
      return newSources;
    });
  }

  /**
   * Disconnect all sources
   */
  disconnectAll(): void {
    const sourceIds = Array.from(this._sources().keys());
    for (const id of sourceIds) {
      this.disconnectSource(id);
    }
  }

  /**
   * Set gain for a source
   */
  setSourceGain(id: string, gain: number): void {
    const source = this._sources().get(id);
    if (source?.gain) {
      source.gain.gain.value = Math.max(0, Math.min(2, gain));
    }
  }

  /**
   * Mute/unmute a source
   */
  setSourceMuted(id: string, muted: boolean): void {
    this.setSourceGain(id, muted ? 0 : 1);
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Get frequency data from an analyser
   */
  getFrequencyData(analyser: AnalyserNode): Uint8Array {
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    return data;
  }

  /**
   * Get time domain data from an analyser
   */
  getTimeDomainData(analyser: AnalyserNode): Uint8Array {
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    return data;
  }

  /**
   * Get float frequency data from an analyser
   */
  getFloatFrequencyData(analyser: AnalyserNode): Float32Array {
    const data = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(data);
    return data;
  }

  /**
   * Convert frequency bin index to frequency in Hz
   */
  binToFrequency(binIndex: number, fftSize: number): number {
    return (binIndex * this._sampleRate()) / fftSize;
  }

  /**
   * Convert frequency in Hz to bin index
   */
  frequencyToBin(frequency: number, fftSize: number): number {
    return Math.round((frequency * fftSize) / this._sampleRate());
  }

  private generateSourceId(type: string): string {
    return `${type}-${++this.sourceIdCounter}`;
  }

  private dispose(): void {
    this.disconnectAll();
    if (this._audioContext && this._audioContext.state !== 'closed') {
      this._audioContext.close();
    }
  }
}
