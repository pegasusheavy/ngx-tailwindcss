import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type VisualizerVariant = 'circular' | 'bars' | 'wave' | 'particles' | 'rings';
export type VisualizerColorScheme = 'rainbow' | 'fire' | 'ocean' | 'neon' | 'mono' | 'custom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

@Component({
  selector: 'tw-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwVisualizerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly analyserNode = input<AnalyserNode | undefined>(undefined);
  readonly width = input(400, { transform: numberAttribute });
  readonly height = input(400, { transform: numberAttribute });
  readonly variant = input<VisualizerVariant>('circular');
  readonly colorScheme = input<VisualizerColorScheme>('rainbow');
  readonly customColors = input<string[]>(['#FF0000', '#00FF00', '#0000FF']);
  readonly sensitivity = input(1.5, { transform: numberAttribute });
  readonly smoothing = input(0.8, { transform: numberAttribute });
  readonly backgroundColor = input('#000000');
  readonly showBackground = input(true);
  readonly reactive = input(true); // React to audio amplitude
  readonly classOverride = input('');

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private timeDomainData: Uint8Array<ArrayBuffer> | null = null;
  private particles: Particle[] = [];
  private rotation = 0;

  protected readonly containerClasses = computed(() => {
    const base = 'rounded-lg overflow-hidden';
    return [base, this.classOverride()].filter(Boolean).join(' ');
  });

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    const analyser = this.analyserNode();
    if (analyser) {
      analyser.smoothingTimeConstant = this.smoothing();
      this.frequencyData = new Uint8Array(analyser.frequencyBinCount);
      this.timeDomainData = new Uint8Array(analyser.fftSize);
    } else {
      // Mock data for demo
      this.frequencyData = new Uint8Array(128);
      this.timeDomainData = new Uint8Array(256);
    }

    this.draw();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private draw(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const width = this.width();
    const height = this.height();

    canvas.width = width;
    canvas.height = height;

    const analyser = this.analyserNode();
    if (analyser && this.frequencyData && this.timeDomainData) {
      analyser.getByteFrequencyData(this.frequencyData);
      analyser.getByteTimeDomainData(this.timeDomainData);
    } else if (this.frequencyData) {
      // Generate mock data for demo visualization
      for (let i = 0; i < this.frequencyData.length; i++) {
        this.frequencyData[i] = Math.random() * 100 + Math.sin(Date.now() / 500 + i * 0.1) * 50 + 50;
      }
    }

    // Clear canvas
    if (this.showBackground()) {
      this.ctx.fillStyle = this.backgroundColor();
      this.ctx.fillRect(0, 0, width, height);
    } else {
      this.ctx.clearRect(0, 0, width, height);
    }

    // Draw based on variant
    switch (this.variant()) {
      case 'circular':
        this.drawCircular();
        break;
      case 'bars':
        this.drawBars();
        break;
      case 'wave':
        this.drawWave();
        break;
      case 'particles':
        this.drawParticles();
        break;
      case 'rings':
        this.drawRings();
        break;
    }

    this.rotation += 0.005;

    // Request next frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  private drawCircular(): void {
    if (!this.ctx || !this.frequencyData) return;

    const width = this.width();
    const height = this.height();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    const bars = 64;
    const sensitivity = this.sensitivity();

    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2 + this.rotation;
      const freqIndex = Math.floor((i / bars) * this.frequencyData.length);
      const value = (this.frequencyData[freqIndex] / 255) * sensitivity;
      const barHeight = value * radius * 0.8;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = this.getColor(i / bars, value);
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
    }

    // Center circle
    const avgValue = this.getAverageFrequency() / 255 * sensitivity;
    const centerRadius = radius * 0.5 + avgValue * 20;

    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
    gradient.addColorStop(0, this.getColor(0.5, avgValue));
    gradient.addColorStop(1, 'transparent');

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  private drawBars(): void {
    if (!this.ctx || !this.frequencyData) return;

    const width = this.width();
    const height = this.height();
    const bars = 32;
    const barWidth = width / bars - 2;
    const sensitivity = this.sensitivity();

    for (let i = 0; i < bars; i++) {
      const freqIndex = Math.floor((i / bars) * this.frequencyData.length);
      const value = (this.frequencyData[freqIndex] / 255) * sensitivity;
      const barHeight = value * height * 0.8;

      const x = i * (barWidth + 2) + 2;
      const y = height - barHeight;

      // Gradient bar
      const gradient = this.ctx.createLinearGradient(x, height, x, y);
      gradient.addColorStop(0, this.getColor(i / bars, 0.3));
      gradient.addColorStop(1, this.getColor(i / bars, value));

      this.ctx.fillStyle = gradient;
      this.roundRect(x, y, barWidth, barHeight, 4);

      // Reflection
      const reflectionGradient = this.ctx.createLinearGradient(x, height, x, height + barHeight * 0.3);
      reflectionGradient.addColorStop(0, this.getColor(i / bars, 0.2));
      reflectionGradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = reflectionGradient;
      this.ctx.fillRect(x, height, barWidth, barHeight * 0.3);
    }
  }

  private drawWave(): void {
    if (!this.ctx || !this.timeDomainData) return;

    const width = this.width();
    const height = this.height();
    const sensitivity = this.sensitivity();

    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);

    for (let i = 0; i < this.timeDomainData.length; i++) {
      const x = (i / this.timeDomainData.length) * width;
      const value = (this.timeDomainData[i] / 128 - 1) * sensitivity;
      const y = height / 2 + value * height * 0.4;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 10; i++) {
      gradient.addColorStop(i / 10, this.getColor(i / 10, 0.8));
    }

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Fill below
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();

    const fillGradient = this.ctx.createLinearGradient(0, height / 2, 0, height);
    fillGradient.addColorStop(0, this.getColor(0.5, 0.3));
    fillGradient.addColorStop(1, 'transparent');
    this.ctx.fillStyle = fillGradient;
    this.ctx.fill();
  }

  private drawParticles(): void {
    if (!this.ctx || !this.frequencyData) return;

    const width = this.width();
    const height = this.height();
    const centerX = width / 2;
    const centerY = height / 2;
    const sensitivity = this.sensitivity();

    // Spawn new particles based on audio
    const avgValue = this.getAverageFrequency() / 255;
    const spawnCount = Math.floor(avgValue * sensitivity * 5);

    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = avgValue * 5 + 2;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        life: 1,
        maxLife: 1,
        color: this.getColor(Math.random(), avgValue),
      });
    }

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.size *= 0.98;

      if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
      this.ctx.fill();
    }

    // Limit particles
    if (this.particles.length > 500) {
      this.particles = this.particles.slice(-500);
    }
  }

  private drawRings(): void {
    if (!this.ctx || !this.frequencyData) return;

    const width = this.width();
    const height = this.height();
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    const rings = 8;
    const sensitivity = this.sensitivity();

    for (let r = 0; r < rings; r++) {
      const baseRadius = (r / rings) * maxRadius + 30;
      const freqStart = Math.floor((r / rings) * this.frequencyData.length);
      const freqEnd = Math.floor(((r + 1) / rings) * this.frequencyData.length);

      // Get average for this ring
      let sum = 0;
      for (let i = freqStart; i < freqEnd; i++) {
        sum += this.frequencyData[i];
      }
      const avgValue = (sum / (freqEnd - freqStart) / 255) * sensitivity;

      const radius = baseRadius + avgValue * 30;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.getColor(r / rings, avgValue);
      this.ctx.lineWidth = 4 + avgValue * 8;
      this.ctx.globalAlpha = 0.6 + avgValue * 0.4;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }
  }

  private getColor(position: number, intensity: number): string {
    const scheme = this.colorScheme();
    const custom = this.customColors();

    switch (scheme) {
      case 'rainbow': {
        const hue = position * 360;
        const saturation = 80 + intensity * 20;
        const lightness = 50 + intensity * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }
      case 'fire': {
        const hue = 30 - position * 30 + intensity * 20;
        return `hsl(${hue}, 100%, ${50 + intensity * 30}%)`;
      }
      case 'ocean': {
        const hue = 180 + position * 60;
        return `hsl(${hue}, 80%, ${40 + intensity * 40}%)`;
      }
      case 'neon': {
        const hue = position * 360;
        return `hsl(${hue}, 100%, ${60 + intensity * 20}%)`;
      }
      case 'mono': {
        const lightness = 30 + intensity * 70 + position * 20;
        return `hsl(0, 0%, ${lightness}%)`;
      }
      case 'custom': {
        const index = Math.floor(position * (custom.length - 1));
        return custom[Math.min(index, custom.length - 1)];
      }
      default:
        return '#ffffff';
    }
  }

  private getAverageFrequency(): number {
    if (!this.frequencyData) return 0;
    let sum = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      sum += this.frequencyData[i];
    }
    return sum / this.frequencyData.length;
  }

  private roundRect(x: number, y: number, w: number, h: number, radius: number): void {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, radius);
    this.ctx.arcTo(x + w, y + h, x, y + h, radius);
    this.ctx.arcTo(x, y + h, x, y, radius);
    this.ctx.arcTo(x, y, x + w, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

