import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import {
  getWorkerScript,
  WorkerMessage,
  WorkerResponse,
  WorkerMessageType,
  FFTProcessOptions,
  FFTProcessResult,
  TimeDomainOptions,
  TimeDomainResult,
  LevelOptions,
  LevelResult,
  BeatDetectionOptions,
  BeatDetectionResult,
  WaveformDownsampleOptions,
  WaveformDownsampleResult,
  SmoothDataOptions,
  SmoothDataResult,
  FindPeaksOptions,
  FindPeaksResult,
  FrequencyConversionOptions,
  FrequencyConversionResult,
} from './audio-worker';

/**
 * Configuration for AudioWorkerService
 */
export interface AudioWorkerConfig {
  /** Enable worker (default: true if supported) */
  enabled?: boolean;
  /** Timeout for worker responses in ms (default: 5000) */
  timeout?: number;
  /** Maximum pending requests before dropping oldest (default: 100) */
  maxPendingRequests?: number;
}

/**
 * Pending request tracking
 */
interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeoutId: ReturnType<typeof setTimeout>;
  timestamp: number;
}

/**
 * Service for offloading audio processing to a Web Worker
 *
 * This service manages a Web Worker that handles computationally intensive
 * audio processing tasks, keeping the main thread free for smooth UI updates.
 *
 * @example
 * ```typescript
 * // In a component
 * private readonly workerService = inject(AudioWorkerService);
 *
 * async processAudio(frequencyData: Uint8Array) {
 *   if (this.workerService.isAvailable()) {
 *     // Use worker for processing
 *     const result = await this.workerService.processFFT({
 *       frequencyData: Array.from(frequencyData),
 *       logarithmic: true,
 *       outputBins: 64
 *     });
 *     return result.processedData;
 *   } else {
 *     // Fallback to main thread processing
 *     return this.processOnMainThread(frequencyData);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AudioWorkerService implements OnDestroy {
  private worker: Worker | null = null;
  private workerUrl: string | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private requestCounter = 0;
  private config: Required<AudioWorkerConfig> = {
    enabled: true,
    timeout: 5000,
    maxPendingRequests: 100,
  };

  // Signals for reactive state
  private readonly _isInitialized = signal(false);
  private readonly _isProcessing = signal(false);
  private readonly _pendingCount = signal(0);
  private readonly _errorCount = signal(0);
  private readonly _lastError = signal<string | null>(null);

  /** Whether the worker is initialized and ready */
  readonly isInitialized = this._isInitialized.asReadonly();

  /** Whether the worker is currently processing requests */
  readonly isProcessing = computed(() => this._pendingCount() > 0);

  /** Number of pending requests */
  readonly pendingCount = this._pendingCount.asReadonly();

  /** Total error count since initialization */
  readonly errorCount = this._errorCount.asReadonly();

  /** Last error message */
  readonly lastError = this._lastError.asReadonly();

  /** Whether Web Workers are supported in this environment */
  readonly isSupported = signal(typeof Worker !== 'undefined');

  constructor() {
    // Auto-initialize if supported
    if (this.isSupported()) {
      this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.terminate();
  }

  // =========================================================================
  // CONFIGURATION
  // =========================================================================

  /**
   * Configure the worker service
   */
  configure(config: AudioWorkerConfig): void {
    this.config = { ...this.config, ...config };

    if (!this.config.enabled && this.worker) {
      this.terminate();
    } else if (this.config.enabled && !this.worker && this.isSupported()) {
      this.initialize();
    }
  }

  /**
   * Check if worker is available and enabled
   */
  isAvailable(): boolean {
    return this.isSupported() && this.config.enabled && this._isInitialized();
  }

  // =========================================================================
  // WORKER LIFECYCLE
  // =========================================================================

  /**
   * Initialize the worker
   */
  initialize(): boolean {
    if (this.worker || !this.isSupported()) {
      return this._isInitialized();
    }

    try {
      // Create worker from blob URL
      const script = getWorkerScript();
      const blob = new Blob([script], { type: 'application/javascript' });
      this.workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(this.workerUrl);

      // Set up message handler
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleResponse(event.data);
      };

      this.worker.onerror = error => {
        this._errorCount.update(n => n + 1);
        this._lastError.set(error.message || 'Worker error');
        console.error('Audio worker error:', error);
      };

      this._isInitialized.set(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio worker:', error);
      this._lastError.set(error instanceof Error ? error.message : 'Failed to initialize');
      return false;
    }
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    if (this.workerUrl) {
      URL.revokeObjectURL(this.workerUrl);
      this.workerUrl = null;
    }

    // Reject all pending requests
    for (const [id, request] of this.pendingRequests) {
      clearTimeout(request.timeoutId);
      request.reject(new Error('Worker terminated'));
    }
    this.pendingRequests.clear();

    this._isInitialized.set(false);
    this._pendingCount.set(0);
  }

  /**
   * Restart the worker
   */
  restart(): boolean {
    this.terminate();
    return this.initialize();
  }

  // =========================================================================
  // PROCESSING METHODS
  // =========================================================================

  /**
   * Process FFT data
   * @param options FFT processing options
   * @returns Processed FFT result with peaks, average level, and dominant frequency
   */
  async processFFT(options: FFTProcessOptions): Promise<FFTProcessResult> {
    return this.sendMessage('processFFT', options);
  }

  /**
   * Process time domain data
   * @param options Time domain processing options
   * @returns Processed waveform with RMS, peak, and zero crossings
   */
  async processTimeDomain(options: TimeDomainOptions): Promise<TimeDomainResult> {
    return this.sendMessage('processTimeDomain', options);
  }

  /**
   * Calculate audio levels
   * @param options Level calculation options
   * @returns RMS and peak levels in linear and dB
   */
  async calculateLevels(options: LevelOptions): Promise<LevelResult> {
    return this.sendMessage('calculateLevels', options);
  }

  /**
   * Detect beats in audio
   * @param options Beat detection options
   * @returns Beat detection result with energy and history
   */
  async detectBeat(options: BeatDetectionOptions): Promise<BeatDetectionResult> {
    return this.sendMessage('detectBeat', options);
  }

  /**
   * Downsample waveform data for display
   * @param options Downsampling options
   * @returns Downsampled waveform data
   */
  async downsampleWaveform(options: WaveformDownsampleOptions): Promise<WaveformDownsampleResult> {
    return this.sendMessage('downsampleWaveform', options);
  }

  /**
   * Smooth data using exponential or moving average
   * @param options Smoothing options
   * @returns Smoothed data
   */
  async smoothData(options: SmoothDataOptions): Promise<SmoothDataResult> {
    return this.sendMessage('smoothData', options);
  }

  /**
   * Find peaks in data
   * @param options Peak finding options
   * @returns Found peaks with positions and values
   */
  async findPeaks(options: FindPeaksOptions): Promise<FindPeaksResult> {
    return this.sendMessage('findPeaks', options);
  }

  /**
   * Convert between frequency bins and Hz
   * @param options Conversion options
   * @returns Converted frequencies
   */
  async convertFrequencies(
    options: FrequencyConversionOptions
  ): Promise<FrequencyConversionResult> {
    return this.sendMessage('convertFrequencies', options);
  }

  // =========================================================================
  // BATCH PROCESSING
  // =========================================================================

  /**
   * Process multiple FFT frames in batch
   * @param frames Array of FFT options
   * @returns Array of results
   */
  async processFFTBatch(frames: FFTProcessOptions[]): Promise<FFTProcessResult[]> {
    return Promise.all(frames.map(frame => this.processFFT(frame)));
  }

  /**
   * Process with fallback to main thread
   * @param type Message type
   * @param options Processing options
   * @param fallbackFn Fallback function for main thread processing
   */
  async processWithFallback<T, R>(
    type: WorkerMessageType,
    options: T,
    fallbackFn: (options: T) => R
  ): Promise<R> {
    if (this.isAvailable()) {
      try {
        return await this.sendMessage(type, options);
      } catch {
        // Fall back to main thread on error
        return fallbackFn(options);
      }
    }
    return fallbackFn(options);
  }

  // =========================================================================
  // INTERNAL METHODS
  // =========================================================================

  private async sendMessage<T>(type: WorkerMessageType, data: unknown): Promise<T> {
    if (!this.worker || !this._isInitialized()) {
      throw new Error('Worker not initialized');
    }

    // Check pending request limit
    if (this.pendingRequests.size >= this.config.maxPendingRequests) {
      // Drop oldest request
      const oldest = Array.from(this.pendingRequests.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0];
      if (oldest) {
        clearTimeout(oldest[1].timeoutId);
        oldest[1].reject(new Error('Request dropped due to queue overflow'));
        this.pendingRequests.delete(oldest[0]);
      }
    }

    const id = `${++this.requestCounter}-${Date.now()}`;

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(id);
        this._pendingCount.update(n => Math.max(0, n - 1));
        reject(new Error(`Worker request timeout: ${type}`));
      }, this.config.timeout);

      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeoutId,
        timestamp: Date.now(),
      });

      this._pendingCount.update(n => n + 1);

      const message: WorkerMessage = { id, type, data };
      this.worker!.postMessage(message);
    });
  }

  private handleResponse(response: WorkerResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(response.id);
    this._pendingCount.update(n => Math.max(0, n - 1));

    if (response.error) {
      this._errorCount.update(n => n + 1);
      this._lastError.set(response.error);
      pending.reject(new Error(response.error));
    } else {
      pending.resolve(response.result);
    }
  }

  // =========================================================================
  // STATISTICS
  // =========================================================================

  /**
   * Get worker statistics
   */
  getStats(): {
    isInitialized: boolean;
    pendingCount: number;
    errorCount: number;
    lastError: string | null;
  } {
    return {
      isInitialized: this._isInitialized(),
      pendingCount: this._pendingCount(),
      errorCount: this._errorCount(),
      lastError: this._lastError(),
    };
  }

  /**
   * Reset error count
   */
  resetErrorCount(): void {
    this._errorCount.set(0);
    this._lastError.set(null);
  }
}

// Re-export types for convenience
export type {
  FFTProcessOptions,
  FFTProcessResult,
  TimeDomainOptions,
  TimeDomainResult,
  LevelOptions,
  LevelResult,
  BeatDetectionOptions,
  BeatDetectionResult,
  WaveformDownsampleOptions,
  WaveformDownsampleResult,
  SmoothDataOptions,
  SmoothDataResult,
  FindPeaksOptions,
  FindPeaksResult,
  FrequencyConversionOptions,
  FrequencyConversionResult,
};
