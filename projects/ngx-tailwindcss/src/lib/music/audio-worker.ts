/**
 * Audio Processing Web Worker
 *
 * This worker handles computationally intensive audio processing tasks
 * off the main thread to prevent UI jank during real-time visualizations.
 *
 * Supported operations:
 * - FFT data processing and smoothing
 * - RMS and peak level calculation
 * - Beat detection
 * - Waveform downsampling
 * - Frequency bin to Hz conversion
 *
 * @example
 * ```typescript
 * // Create worker from blob URL (done automatically by AudioWorkerService)
 * const worker = new Worker(workerUrl);
 * worker.postMessage({ type: 'processFFT', data: frequencyData });
 * worker.onmessage = (e) => console.log(e.data);
 * ```
 */

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface WorkerMessage {
  id: string;
  type: WorkerMessageType;
  data: unknown;
}

export type WorkerMessageType =
  | 'processFFT'
  | 'processTimeDomain'
  | 'calculateLevels'
  | 'detectBeat'
  | 'downsampleWaveform'
  | 'smoothData'
  | 'findPeaks'
  | 'convertFrequencies';

export interface WorkerResponse {
  id: string;
  type: WorkerMessageType;
  result: unknown;
  error?: string;
}

// ============================================================================
// FFT PROCESSING
// ============================================================================

export interface FFTProcessOptions {
  frequencyData: Uint8Array | number[];
  smoothingFactor?: number;
  previousData?: Uint8Array | number[];
  logarithmic?: boolean;
  outputBins?: number;
  minFrequency?: number;
  maxFrequency?: number;
  sampleRate?: number;
  fftSize?: number;
}

export interface FFTProcessResult {
  processedData: number[];
  peaks: number[];
  averageLevel: number;
  dominantFrequency: number;
}

function processFFT(options: FFTProcessOptions): FFTProcessResult {
  const {
    frequencyData,
    smoothingFactor = 0.8,
    previousData,
    logarithmic = false,
    outputBins = 64,
    minFrequency = 20,
    maxFrequency = 20_000,
    sampleRate = 44_100,
    fftSize = 2048,
  } = options;

  const inputLength = frequencyData.length;
  let processedData: number[];

  if (logarithmic) {
    // Logarithmic frequency scaling
    processedData = Array.from<number>({ length: outputBins });
    const logMin = Math.log(minFrequency);
    const logMax = Math.log(maxFrequency);
    const logRange = logMax - logMin;

    for (let i = 0; i < outputBins; i++) {
      const logFreq = logMin + (i / outputBins) * logRange;
      const freq = Math.exp(logFreq);
      const bin = Math.round((freq * fftSize) / sampleRate);
      const clampedBin = Math.min(bin, inputLength - 1);
      processedData[i] = frequencyData[clampedBin];
    }
  } else {
    // Linear scaling with optional downsampling
    const step = Math.max(1, Math.floor(inputLength / outputBins));
    processedData = Array.from<number>({ length: outputBins });

    for (let i = 0; i < outputBins; i++) {
      const startBin = i * step;
      const endBin = Math.min(startBin + step, inputLength);

      // Average the bins
      let sum = 0;
      for (let j = startBin; j < endBin; j++) {
        sum += frequencyData[j];
      }
      processedData[i] = sum / (endBin - startBin);
    }
  }

  // Apply smoothing with previous frame
  if (previousData?.length === processedData.length) {
    for (let i = 0; i < processedData.length; i++) {
      processedData[i] =
        smoothingFactor * previousData[i] + (1 - smoothingFactor) * processedData[i];
    }
  }

  // Find peaks
  const peaks: number[] = [];
  for (let i = 1; i < processedData.length - 1; i++) {
    if (
      processedData[i] > processedData[i - 1] &&
      processedData[i] > processedData[i + 1] &&
      processedData[i] > 50 // Threshold
    ) {
      peaks.push(i);
    }
  }

  // Calculate average level
  let totalLevel = 0;
  for (const processedDatum of processedData) {
    totalLevel += processedDatum;
  }
  const averageLevel = totalLevel / processedData.length;

  // Find dominant frequency bin
  let maxValue = 0;
  let dominantBin = 0;
  for (const [i, processedDatum] of processedData.entries()) {
    if (processedDatum > maxValue) {
      maxValue = processedDatum;
      dominantBin = i;
    }
  }

  // Convert bin to frequency
  const dominantFrequency = logarithmic
    ? Math.exp(
        Math.log(minFrequency) +
          (dominantBin / outputBins) * (Math.log(maxFrequency) - Math.log(minFrequency))
      )
    : (dominantBin * sampleRate) / fftSize;

  return {
    processedData,
    peaks,
    averageLevel,
    dominantFrequency,
  };
}

// ============================================================================
// TIME DOMAIN PROCESSING
// ============================================================================

export interface TimeDomainOptions {
  timeDomainData: Uint8Array | number[];
  outputSamples?: number;
}

export interface TimeDomainResult {
  processedData: number[];
  rms: number;
  peak: number;
  zeroCrossings: number;
}

function processTimeDomain(options: TimeDomainOptions): TimeDomainResult {
  const { timeDomainData, outputSamples } = options;
  const inputLength = timeDomainData.length;

  let processedData: number[];

  if (outputSamples && outputSamples < inputLength) {
    // Downsample
    const step = inputLength / outputSamples;
    processedData = Array.from<number>({ length: outputSamples });

    for (let i = 0; i < outputSamples; i++) {
      const startIdx = Math.floor(i * step);
      const endIdx = Math.min(Math.floor((i + 1) * step), inputLength);

      let min = 255;
      let max = 0;
      for (let j = startIdx; j < endIdx; j++) {
        const val = timeDomainData[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      // Store the midpoint of min/max for this segment
      processedData[i] = (min + max) / 2;
    }
  } else {
    processedData = [...timeDomainData];
  }

  // Calculate RMS
  let sumSquares = 0;
  let peak = 0;
  let zeroCrossings = 0;
  let lastSign = 0;

  for (const timeDomainDatum of timeDomainData) {
    const sample = (timeDomainDatum - 128) / 128; // Normalize to -1 to 1
    sumSquares += sample * sample;

    const absSample = Math.abs(sample);
    if (absSample > peak) {
      peak = absSample;
    }

    // Count zero crossings
    const sign = sample >= 0 ? 1 : -1;
    if (lastSign !== 0 && sign !== lastSign) {
      zeroCrossings++;
    }
    lastSign = sign;
  }

  const rms = Math.sqrt(sumSquares / timeDomainData.length);

  return {
    processedData,
    rms,
    peak,
    zeroCrossings,
  };
}

// ============================================================================
// LEVEL CALCULATION
// ============================================================================

export interface LevelOptions {
  data: Uint8Array | Float32Array | number[];
  isFloatData?: boolean;
}

export interface LevelResult {
  rms: number;
  peak: number;
  rmsDb: number;
  peakDb: number;
}

function calculateLevels(options: LevelOptions): LevelResult {
  const { data, isFloatData = false } = options;

  let rms: number;
  let peak = 0;

  if (isFloatData) {
    // Float data is already in dB (for frequency data) or normalized (-1 to 1)
    let sumSquares = 0;
    for (const datum of data) {
      const sample = Math.abs(datum);
      sumSquares += sample * sample;
      if (sample > peak) peak = sample;
    }
    rms = Math.sqrt(sumSquares / data.length);
  } else {
    // Uint8Array data (0-255, centered at 128)
    let sumSquares = 0;
    for (const datum of data) {
      const sample = Math.abs(datum - 128) / 128;
      sumSquares += sample * sample;
      if (sample > peak) peak = sample;
    }
    rms = Math.sqrt(sumSquares / data.length);
  }

  // Convert to dB
  const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -Infinity;

  return { rms, peak, rmsDb, peakDb };
}

// ============================================================================
// BEAT DETECTION
// ============================================================================

export interface BeatDetectionOptions {
  frequencyData: Uint8Array | number[];
  energyHistory: number[];
  sensitivity?: number;
  lowFreqBand?: [number, number]; // Start and end bin for bass detection
}

export interface BeatDetectionResult {
  isBeat: boolean;
  energy: number;
  averageEnergy: number;
  updatedHistory: number[];
  beatStrength: number;
}

function detectBeat(options: BeatDetectionOptions): BeatDetectionResult {
  const {
    frequencyData,
    energyHistory,
    sensitivity = 1.5,
    lowFreqBand = [0, 10], // First 10 bins (typically bass frequencies)
  } = options;

  // Calculate energy in bass frequencies
  let energy = 0;
  const [startBin, endBin] = lowFreqBand;
  const binCount = Math.min(endBin, frequencyData.length) - startBin;

  for (let i = startBin; i < Math.min(endBin, frequencyData.length); i++) {
    const val = frequencyData[i];
    energy += val * val;
  }
  energy = Math.sqrt(energy / binCount);

  // Calculate average from history
  let averageEnergy = 0;
  for (const element of energyHistory) {
    averageEnergy += element;
  }
  averageEnergy = energyHistory.length > 0 ? averageEnergy / energyHistory.length : energy;

  // Detect beat
  const isBeat = energy > averageEnergy * sensitivity;
  const beatStrength = averageEnergy > 0 ? energy / averageEnergy : 0;

  // Update history (keep last 43 frames ≈ 1 second at 43fps)
  const maxHistory = 43;
  const updatedHistory = [...energyHistory, energy].slice(-maxHistory);

  return {
    isBeat,
    energy,
    averageEnergy,
    updatedHistory,
    beatStrength,
  };
}

// ============================================================================
// WAVEFORM DOWNSAMPLING
// ============================================================================

export interface WaveformDownsampleOptions {
  samples: Float32Array | number[];
  outputLength: number;
  method?: 'minmax' | 'average' | 'rms';
}

export interface WaveformDownsampleResult {
  data: number[];
  minValues?: number[];
  maxValues?: number[];
}

function downsampleWaveform(options: WaveformDownsampleOptions): WaveformDownsampleResult {
  const { samples, outputLength, method = 'minmax' } = options;
  const inputLength = samples.length;
  const samplesPerPixel = inputLength / outputLength;

  const data: number[] = Array.from<number>({ length: outputLength });
  let minValues: number[] | undefined;
  let maxValues: number[] | undefined;

  if (method === 'minmax') {
    minValues = Array.from<number>({ length: outputLength });
    maxValues = Array.from<number>({ length: outputLength });

    for (let i = 0; i < outputLength; i++) {
      const startSample = Math.floor(i * samplesPerPixel);
      const endSample = Math.min(Math.floor((i + 1) * samplesPerPixel), inputLength);

      let min = Infinity;
      let max = -Infinity;

      for (let j = startSample; j < endSample; j++) {
        const val = samples[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }

      minValues[i] = min;
      maxValues[i] = max;
      data[i] = (min + max) / 2;
    }
  } else if (method === 'average') {
    for (let i = 0; i < outputLength; i++) {
      const startSample = Math.floor(i * samplesPerPixel);
      const endSample = Math.min(Math.floor((i + 1) * samplesPerPixel), inputLength);

      let sum = 0;
      for (let j = startSample; j < endSample; j++) {
        sum += samples[j];
      }
      data[i] = sum / (endSample - startSample);
    }
  } else {
    // RMS
    for (let i = 0; i < outputLength; i++) {
      const startSample = Math.floor(i * samplesPerPixel);
      const endSample = Math.min(Math.floor((i + 1) * samplesPerPixel), inputLength);

      let sumSquares = 0;
      for (let j = startSample; j < endSample; j++) {
        const val = samples[j];
        sumSquares += val * val;
      }
      data[i] = Math.sqrt(sumSquares / (endSample - startSample));
    }
  }

  return { data, minValues, maxValues };
}

// ============================================================================
// DATA SMOOTHING
// ============================================================================

export interface SmoothDataOptions {
  data: number[];
  method?: 'exponential' | 'movingAverage';
  alpha?: number; // For exponential
  windowSize?: number; // For moving average
  previousData?: number[];
}

export interface SmoothDataResult {
  data: number[];
}

function smoothData(options: SmoothDataOptions): SmoothDataResult {
  const { data, method = 'exponential', alpha = 0.3, windowSize = 5, previousData } = options;

  const result = Array.from<number>({ length: data.length });

  if (method === 'exponential') {
    if (previousData?.length === data.length) {
      for (const [i, datum] of data.entries()) {
        result[i] = alpha * datum + (1 - alpha) * previousData[i];
      }
    } else {
      result[0] = data[0];
      for (let i = 1; i < data.length; i++) {
        result[i] = alpha * data[i] + (1 - alpha) * result[i - 1];
      }
    }
  } else {
    // Moving average
    const halfWindow = Math.floor(windowSize / 2);
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (
        let j = Math.max(0, i - halfWindow);
        j <= Math.min(data.length - 1, i + halfWindow);
        j++
      ) {
        sum += data[j];
        count++;
      }
      result[i] = sum / count;
    }
  }

  return { data: result };
}

// ============================================================================
// PEAK FINDING
// ============================================================================

export interface FindPeaksOptions {
  data: number[];
  threshold?: number;
  minDistance?: number;
}

export interface FindPeaksResult {
  peaks: Array<{ index: number; value: number }>;
  dominantPeaks: Array<{ index: number; value: number }>;
}

function findPeaks(options: FindPeaksOptions): FindPeaksResult {
  const { data, threshold = 0, minDistance = 1 } = options;

  const allPeaks: Array<{ index: number; value: number }> = [];

  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
      // Check minimum distance from previous peak
      if (allPeaks.length === 0 || i - allPeaks.at(-1)!.index >= minDistance) {
        allPeaks.push({ index: i, value: data[i] });
      } else if (data[i] > allPeaks.at(-1)!.value) {
        // Replace previous peak if this one is higher
        allPeaks[allPeaks.length - 1] = { index: i, value: data[i] };
      }
    }
  }

  // Get top 10 peaks by value
  const dominantPeaks = [...allPeaks].sort((a, b) => b.value - a.value).slice(0, 10);

  return { peaks: allPeaks, dominantPeaks };
}

// ============================================================================
// FREQUENCY CONVERSION
// ============================================================================

export interface FrequencyConversionOptions {
  bins: number[];
  sampleRate: number;
  fftSize: number;
  toHz?: boolean; // If true, convert bin to Hz; if false, Hz to bin
}

export interface FrequencyConversionResult {
  frequencies: number[];
}

function convertFrequencies(options: FrequencyConversionOptions): FrequencyConversionResult {
  const { bins, sampleRate, fftSize, toHz = true } = options;

  const frequencies = bins.map(val => {
    if (toHz) {
      return (val * sampleRate) / fftSize;
    }
    return Math.round((val * fftSize) / sampleRate);
  });

  return { frequencies };
}

// ============================================================================
// WORKER MESSAGE HANDLER
// ============================================================================

/**
 * Canonical dispatch table mapping message types to processing functions.
 *
 * WARNING: every function referenced here is serialized with
 * `Function.prototype.toString()` by {@link getWorkerScript} and re-evaluated
 * inside the worker. The functions MUST remain closure-free — no captured
 * imports, module-level constants, or `this` — or the generated worker script
 * will throw at runtime. Both {@link handleMessage} and the worker's
 * `onmessage` dispatcher are generated from this single table so they cannot
 * drift apart.
 */
const WORKER_HANDLERS = {
  processFFT,
  processTimeDomain,
  calculateLevels,
  detectBeat,
  downsampleWaveform,
  smoothData,
  findPeaks,
  convertFrequencies,
} as const satisfies Record<WorkerMessageType, (options: never) => unknown>;

/**
 * Worker message handler - processes incoming messages
 *
 * Exported for unit testing. At runtime the worker uses the `onmessage`
 * dispatcher generated by {@link getWorkerScript} from the same
 * {@link WORKER_HANDLERS} table, which is the canonical dispatcher.
 */
function handleMessage(event: MessageEvent<WorkerMessage>): WorkerResponse {
  const { id, type, data } = event.data;

  const handler = WORKER_HANDLERS[type] as ((options: unknown) => unknown) | undefined;
  if (!handler) {
    return { id, type, result: null, error: `Unknown message type: ${type}` };
  }

  try {
    return { id, type, result: handler(data) };
  } catch (error) {
    return {
      id,
      type,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// WORKER SCRIPT STRING (for blob URL creation)
// ============================================================================

/**
 * Get the worker script as a string for creating a blob URL
 * This allows the worker to be bundled with the library
 *
 * WARNING: both the function definitions and the `onmessage` dispatcher below
 * are generated from {@link WORKER_HANDLERS} by serializing the processing
 * functions with `toString()`, so those functions must remain closure-free
 * (see the note on the table above).
 */
export function getWorkerScript(): string {
  const definitions = Object.entries(WORKER_HANDLERS)
    .map(([name, fn]) => `const ${name}=${fn.toString()};`)
    .join('\n');
  const cases = Object.keys(WORKER_HANDLERS)
    .map(name => `case'${name}':result=${name}(data);break;`)
    .join('\n      ');

  return `
// Audio Worker - generated from WORKER_HANDLERS in audio-worker.ts
${definitions}

self.onmessage=function(e){
  const{id,type,data}=e.data;
  try{
    let result;
    switch(type){
      ${cases}
      default:self.postMessage({id,type,result:null,error:'Unknown type'});return;
    }
    self.postMessage({id,type,result});
  }catch(err){
    self.postMessage({id,type,result:null,error:err.message||'Error'});
  }
};
`;
}

// Export types and the message handler for testing
export { handleMessage };
