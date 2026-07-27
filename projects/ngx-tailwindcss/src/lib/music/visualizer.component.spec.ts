import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwVisualizerComponent } from './visualizer.component';

/**
 * Minimal 2D-context stand-in: jsdom has no canvas implementation, so drawing
 * calls resolve to no-ops while property writes are accepted silently.
 */
function createFakeContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: () => {} };
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
          return () => gradient;
        }
        return () => {};
      },
      set: () => true,
    }
  ) as unknown as CanvasRenderingContext2D;
}

function createFakeAnalyser(): AnalyserNode {
  return {
    frequencyBinCount: 128,
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    getByteFrequencyData: () => {},
    getByteTimeDomainData: () => {},
  } as unknown as AnalyserNode;
}

describe('TwVisualizerComponent', () => {
  let fixture: ComponentFixture<TwVisualizerComponent>;
  let component: TwVisualizerComponent;

  let internals: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwVisualizerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TwVisualizerComponent);
    component = fixture.componentInstance;
    internals = component;
    fixture.detectChanges();

    // Substitute a working 2D context (jsdom's getContext returns null)
    internals.ctx = createFakeContext();
  });

  describe('beat detection gating', () => {
    it('should not run beat detection without an analyser or demo mode', () => {
      const detectSpy = vi.spyOn(internals, 'detectBeat');

      internals.draw();

      expect(detectSpy).not.toHaveBeenCalled();
      expect(component.currentBpm()).toBe(0);
    });

    it('should not run beat detection on demo-mode mock data', () => {
      fixture.componentRef.setInput('demoMode', true);
      fixture.detectChanges();
      const detectSpy = vi.spyOn(internals, 'detectBeat');

      internals.draw();

      expect(detectSpy).not.toHaveBeenCalled();
      expect(component.currentBpm()).toBe(0);
    });

    it('should run beat detection when a real analyser is connected', () => {
      fixture.componentRef.setInput('analyserNode', createFakeAnalyser());
      fixture.detectChanges();
      const detectSpy = vi.spyOn(internals, 'detectBeat');

      internals.draw();

      expect(detectSpy).toHaveBeenCalled();
    });
  });

  describe('idle state', () => {
    it('should render a single idle frame without a data source', () => {
      const idleSpy = vi.spyOn(internals, 'drawIdleFrame');

      internals.draw();
      internals.draw();

      // The idle frame is only painted once until a data source appears
      expect(idleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
