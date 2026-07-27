import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwTunerComponent } from './tuner.component';

describe('TwTunerComponent', () => {
  let fixture: ComponentFixture<TwTunerComponent>;
  let component: TwTunerComponent;

  const frequencyToNote = (frequency: number): { note: string; octave: number; cents: number } =>
    (component as any).frequencyToNote(frequency);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwTunerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TwTunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frequencyToNote', () => {
    it.each([
      { frequency: 440, note: 'A', octave: 4, cents: 0 },
      { frequency: 261.63, note: 'C', octave: 4, cents: 0 },
      { frequency: 329.63, note: 'E', octave: 4, cents: 0 },
      { frequency: 466.16, note: 'A#', octave: 4, cents: 0 },
      { frequency: 82.41, note: 'E', octave: 2, cents: 0 },
      { frequency: 880, note: 'A', octave: 5, cents: 0 },
      { frequency: 220, note: 'A', octave: 3, cents: 0 },
    ])('should map $frequency Hz to $note$octave', ({ frequency, note, octave, cents }) => {
      const result = frequencyToNote(frequency);

      expect(result.note).toBe(note);
      expect(result.octave).toBe(octave);
      expect(Math.abs(result.cents - cents)).toBeLessThanOrEqual(1);
    });

    it('should report positive cents for a sharp pitch', () => {
      const result = frequencyToNote(445); // slightly sharp A4

      expect(result.note).toBe('A');
      expect(result.octave).toBe(4);
      expect(result.cents).toBeGreaterThan(0);
      expect(result.cents).toBeLessThan(50);
    });

    it('should report negative cents for a flat pitch', () => {
      const result = frequencyToNote(435); // slightly flat A4

      expect(result.note).toBe('A');
      expect(result.octave).toBe(4);
      expect(result.cents).toBeLessThan(0);
      expect(result.cents).toBeGreaterThan(-50);
    });

    it('should honor the referenceFrequency input', () => {
      fixture.componentRef.setInput('referenceFrequency', 442);
      fixture.detectChanges();

      const result = frequencyToNote(442);

      expect(result.note).toBe('A');
      expect(result.octave).toBe(4);
      expect(result.cents).toBe(0);
    });
  });
});
