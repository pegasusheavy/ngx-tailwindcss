/**
 * Performance Benchmarks for Music Component Visualizations
 *
 * This file contains performance benchmarks for real-time audio visualization
 * components. Run these benchmarks to measure rendering performance and
 * identify bottlenecks.
 *
 * Usage:
 *   pnpm vitest bench projects/ngx-tailwindcss/src/lib/music/performance.bench.ts
 *
 * Or run specific benchmark:
 *   pnpm vitest bench -t "Spectrum Analyzer"
 */

import { bench, describe } from 'vitest';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate random frequency data like AnalyserNode.getByteFrequencyData
 */
function generateFrequencyData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    // Simulate typical frequency distribution (more energy in low frequencies)
    const normalizedIndex = i / size;
    const baseValue = Math.max(0, 200 * (1 - normalizedIndex) + Math.random() * 50);
    data[i] = Math.min(255, Math.floor(baseValue));
  }
  return data;
}

/**
 * Generate random time domain data like AnalyserNode.getByteTimeDomainData
 */
function generateTimeDomainData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  const time = Date.now() / 1000;
  for (let i = 0; i < size; i++) {
    // Simulate a waveform with some noise
    const phase = (i / size) * Math.PI * 4 + time;
    const value = 128 + Math.sin(phase) * 64 + (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, Math.floor(value)));
  }
  return data;
}

/**
 * Generate float frequency data like AnalyserNode.getFloatFrequencyData
 */
function generateFloatFrequencyData(size: number): Float32Array {
  const data = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const normalizedIndex = i / size;
    // dB values typically range from -100 to 0
    data[i] = -100 + (1 - normalizedIndex) * 80 + Math.random() * 20;
  }
  return data;
}

/**
 * Generate waveform data for static display
 */
function generateWaveformData(samples: number): Float32Array {
  const data = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    // Mix of sine waves to simulate audio
    data[i] =
      Math.sin(t * Math.PI * 100) * 0.5 +
      Math.sin(t * Math.PI * 200) * 0.3 +
      Math.sin(t * Math.PI * 400) * 0.2 +
      (Math.random() - 0.5) * 0.1;
  }
  return data;
}

// ============================================================================
// CANVAS RENDERING BENCHMARKS
// ============================================================================

describe('Canvas Rendering Performance', () => {
  // Create a canvas for testing
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  describe('Spectrum Analyzer Rendering', () => {
    const frequencyData = generateFrequencyData(1024);
    const barCount = 64;

    bench('render 64 bars', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const barGap = 2;

      for (let i = 0; i < barCount; i++) {
        const binIndex = Math.floor((i / barCount) * frequencyData.length);
        const value = frequencyData[binIndex] / 255;
        const barHeight = value * canvas.height;

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(0.5, '#eab308');
        gradient.addColorStop(1, '#ef4444');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth + barGap / 2,
          canvas.height - barHeight,
          barWidth - barGap,
          barHeight
        );
      }
    });

    bench('render 128 bars', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount128 = 128;
      const barWidth = canvas.width / barCount128;

      for (let i = 0; i < barCount128; i++) {
        const binIndex = Math.floor((i / barCount128) * frequencyData.length);
        const value = frequencyData[binIndex] / 255;
        const barHeight = value * canvas.height;

        ctx.fillStyle = `hsl(${120 - value * 120}, 100%, 50%)`;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
    });

    bench('render with peak hold', () => {
      const peaks = new Float32Array(barCount);
      const peakDecay = 0.98;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        const binIndex = Math.floor((i / barCount) * frequencyData.length);
        const value = frequencyData[binIndex] / 255;
        const barHeight = value * canvas.height;

        // Update peaks
        if (value > peaks[i]) {
          peaks[i] = value;
        } else {
          peaks[i] *= peakDecay;
        }

        // Draw bar
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(i * barWidth + 1, canvas.height - barHeight, barWidth - 2, barHeight);

        // Draw peak
        const peakY = canvas.height - peaks[i] * canvas.height;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(i * barWidth + 1, peakY - 2, barWidth - 2, 3);
      }
    });
  });

  describe('Waveform Rendering', () => {
    const waveformData = generateWaveformData(44100); // 1 second at 44.1kHz

    bench('render line waveform (full)', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const step = waveformData.length / canvas.width;
      const centerY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x++) {
        const sampleIndex = Math.floor(x * step);
        const value = waveformData[sampleIndex];
        const y = centerY + value * (canvas.height / 2);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });

    bench('render line waveform (downsampled)', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const samplesPerPixel = Math.ceil(waveformData.length / canvas.width);
      const centerY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x++) {
        const startSample = x * samplesPerPixel;
        const endSample = Math.min(startSample + samplesPerPixel, waveformData.length);

        // Find min and max for this pixel
        let min = 1;
        let max = -1;
        for (let i = startSample; i < endSample; i++) {
          if (waveformData[i] < min) min = waveformData[i];
          if (waveformData[i] > max) max = waveformData[i];
        }

        const yMin = centerY + min * (canvas.height / 2);
        const yMax = centerY + max * (canvas.height / 2);

        if (x === 0) {
          ctx.moveTo(x, yMin);
        }
        ctx.lineTo(x, yMax);
      }

      ctx.stroke();
    });

    bench('render bars waveform', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';

      const barWidth = 3;
      const barGap = 1;
      const totalBars = Math.floor(canvas.width / (barWidth + barGap));
      const samplesPerBar = Math.ceil(waveformData.length / totalBars);
      const centerY = canvas.height / 2;

      for (let i = 0; i < totalBars; i++) {
        const startSample = i * samplesPerBar;
        const endSample = Math.min(startSample + samplesPerBar, waveformData.length);

        let rms = 0;
        for (let j = startSample; j < endSample; j++) {
          rms += waveformData[j] * waveformData[j];
        }
        rms = Math.sqrt(rms / (endSample - startSample));

        const barHeight = rms * canvas.height;
        ctx.fillRect(i * (barWidth + barGap), centerY - barHeight / 2, barWidth, barHeight);
      }
    });

    bench('render mirrored waveform', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#60a5fa');
      gradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = gradient;

      const samplesPerPixel = Math.ceil(waveformData.length / canvas.width);
      const centerY = canvas.height / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Top half
      for (let x = 0; x < canvas.width; x++) {
        const startSample = x * samplesPerPixel;
        let max = 0;
        for (
          let i = startSample;
          i < startSample + samplesPerPixel && i < waveformData.length;
          i++
        ) {
          if (Math.abs(waveformData[i]) > Math.abs(max)) max = waveformData[i];
        }
        ctx.lineTo(x, centerY - Math.abs(max) * (canvas.height / 2));
      }

      // Bottom half (mirror)
      for (let x = canvas.width - 1; x >= 0; x--) {
        const startSample = x * samplesPerPixel;
        let max = 0;
        for (
          let i = startSample;
          i < startSample + samplesPerPixel && i < waveformData.length;
          i++
        ) {
          if (Math.abs(waveformData[i]) > Math.abs(max)) max = waveformData[i];
        }
        ctx.lineTo(x, centerY + Math.abs(max) * (canvas.height / 2));
      }

      ctx.closePath();
      ctx.fill();
    });
  });

  describe('Oscilloscope Rendering', () => {
    const timeDomainData = generateTimeDomainData(2048);

    bench('render oscilloscope line', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = canvas.width / timeDomainData.length;

      for (let i = 0; i < timeDomainData.length; i++) {
        const value = timeDomainData[i] / 128.0;
        const y = (value * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(0, y);
        } else {
          ctx.lineTo(i * sliceWidth, y);
        }
      }

      ctx.stroke();
    });

    bench('render oscilloscope with glow', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22c55e';

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = canvas.width / timeDomainData.length;

      for (let i = 0; i < timeDomainData.length; i++) {
        const value = timeDomainData[i] / 128.0;
        const y = (value * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(0, y);
        } else {
          ctx.lineTo(i * sliceWidth, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  });

  describe('VU Meter Rendering', () => {
    bench('render segmented VU meter (20 segments)', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segmentCount = 20;
      const segmentHeight = (canvas.height - segmentCount * 2) / segmentCount;
      const level = 0.75; // 75% level
      const litSegments = Math.floor(level * segmentCount);

      for (let i = 0; i < segmentCount; i++) {
        const y = canvas.height - (i + 1) * (segmentHeight + 2);
        const isLit = i < litSegments;

        // Color based on position
        let color: string;
        if (i >= segmentCount * 0.8) {
          color = isLit ? '#ef4444' : '#7f1d1d';
        } else if (i >= segmentCount * 0.6) {
          color = isLit ? '#eab308' : '#713f12';
        } else {
          color = isLit ? '#22c55e' : '#14532d';
        }

        ctx.fillStyle = color;
        ctx.fillRect(10, y, canvas.width - 20, segmentHeight);
      }
    });

    bench('render gradient VU meter', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const level = 0.75;
      const meterHeight = level * canvas.height;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(0.6, '#eab308');
      gradient.addColorStop(1, '#ef4444');

      ctx.fillStyle = gradient;
      ctx.fillRect(10, canvas.height - meterHeight, canvas.width - 20, meterHeight);

      // Peak indicator
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, canvas.height - level * canvas.height - 3, canvas.width - 20, 3);
    });
  });

  describe('Circular Visualizer Rendering', () => {
    const frequencyData = generateFrequencyData(256);

    bench('render circular bars', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 3;
      const barCount = 64;

      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const binIndex = Math.floor((i / barCount) * frequencyData.length);
        const value = frequencyData[binIndex] / 255;
        const barLength = value * radius;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        ctx.strokeStyle = `hsl(${(i / barCount) * 360}, 100%, 50%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });

    bench('render circular wave', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) / 3;

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i <= frequencyData.length; i++) {
        const angle = (i / frequencyData.length) * Math.PI * 2 - Math.PI / 2;
        const value = frequencyData[i % frequencyData.length] / 255;
        const radius = baseRadius + value * 50;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();
    });
  });
});

// ============================================================================
// DATA PROCESSING BENCHMARKS
// ============================================================================

describe('Audio Data Processing Performance', () => {
  describe('FFT Bin to Frequency Conversion', () => {
    const sampleRate = 44100;
    const fftSize = 2048;

    bench('convert 1024 bins to frequencies', () => {
      const frequencies = new Float32Array(fftSize / 2);
      for (let i = 0; i < fftSize / 2; i++) {
        frequencies[i] = (i * sampleRate) / fftSize;
      }
    });

    bench('logarithmic frequency scale (1024 bins)', () => {
      const binCount = fftSize / 2;
      const outputBins = 64;
      const minFreq = 20;
      const maxFreq = 20000;

      const logMin = Math.log(minFreq);
      const logMax = Math.log(maxFreq);
      const logRange = logMax - logMin;

      const frequencies = new Float32Array(outputBins);
      for (let i = 0; i < outputBins; i++) {
        const logFreq = logMin + (i / outputBins) * logRange;
        frequencies[i] = Math.exp(logFreq);
      }
    });
  });

  describe('Level Calculation', () => {
    const samples = new Float32Array(4096);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = (Math.random() - 0.5) * 2;
    }

    bench('calculate RMS level', () => {
      let sum = 0;
      for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
      }
      const rms = Math.sqrt(sum / samples.length);
      return rms;
    });

    bench('calculate peak level', () => {
      let peak = 0;
      for (let i = 0; i < samples.length; i++) {
        const abs = Math.abs(samples[i]);
        if (abs > peak) peak = abs;
      }
      return peak;
    });

    bench('calculate dB from linear', () => {
      const linearValues = new Float32Array(1000);
      for (let i = 0; i < linearValues.length; i++) {
        linearValues[i] = Math.random();
      }

      const dbValues = new Float32Array(linearValues.length);
      for (let i = 0; i < linearValues.length; i++) {
        dbValues[i] = 20 * Math.log10(Math.max(linearValues[i], 0.0001));
      }
    });
  });

  describe('Smoothing Algorithms', () => {
    const data = generateFrequencyData(1024);
    const smoothed = new Uint8Array(1024);

    bench('exponential smoothing', () => {
      const alpha = 0.3;
      smoothed[0] = data[0];
      for (let i = 1; i < data.length; i++) {
        smoothed[i] = Math.floor(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
      }
    });

    bench('moving average (5 samples)', () => {
      const windowSize = 5;
      for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        for (
          let j = Math.max(0, i - windowSize);
          j <= Math.min(data.length - 1, i + windowSize);
          j++
        ) {
          sum += data[j];
          count++;
        }
        smoothed[i] = Math.floor(sum / count);
      }
    });
  });

  describe('Peak Detection', () => {
    const frequencyData = generateFrequencyData(1024);

    bench('find peaks (simple)', () => {
      const peaks: number[] = [];
      const threshold = 200;

      for (let i = 1; i < frequencyData.length - 1; i++) {
        if (
          frequencyData[i] > threshold &&
          frequencyData[i] > frequencyData[i - 1] &&
          frequencyData[i] > frequencyData[i + 1]
        ) {
          peaks.push(i);
        }
      }

      return peaks;
    });

    bench('find dominant frequencies', () => {
      const peaks: Array<{ bin: number; magnitude: number }> = [];

      for (let i = 1; i < frequencyData.length - 1; i++) {
        if (frequencyData[i] > frequencyData[i - 1] && frequencyData[i] > frequencyData[i + 1]) {
          peaks.push({ bin: i, magnitude: frequencyData[i] });
        }
      }

      // Sort by magnitude and take top 10
      peaks.sort((a, b) => b.magnitude - a.magnitude);
      return peaks.slice(0, 10);
    });
  });

  describe('Beat Detection', () => {
    const energyHistory = new Float32Array(43); // ~1 second at 43 fps
    for (let i = 0; i < energyHistory.length; i++) {
      energyHistory[i] = Math.random() * 100;
    }

    bench('simple energy threshold', () => {
      const currentEnergy = Math.random() * 150;

      // Calculate average energy
      let avgEnergy = 0;
      for (let i = 0; i < energyHistory.length; i++) {
        avgEnergy += energyHistory[i];
      }
      avgEnergy /= energyHistory.length;

      // Beat if current energy > 1.5x average
      const isBeat = currentEnergy > avgEnergy * 1.5;
      return isBeat;
    });

    bench('frequency band energy', () => {
      const frequencyData = generateFrequencyData(1024);
      const bands = [
        { start: 0, end: 10 }, // Sub bass
        { start: 10, end: 50 }, // Bass
        { start: 50, end: 200 }, // Low mids
        { start: 200, end: 500 }, // Mids
      ];

      const bandEnergies = bands.map(band => {
        let energy = 0;
        for (let i = band.start; i < band.end; i++) {
          energy += frequencyData[i] * frequencyData[i];
        }
        return Math.sqrt(energy / (band.end - band.start));
      });

      return bandEnergies;
    });
  });
});
