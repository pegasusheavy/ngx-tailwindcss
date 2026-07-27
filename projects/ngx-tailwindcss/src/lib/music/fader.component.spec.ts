import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwFaderComponent } from './fader.component';

describe('TwFaderComponent', () => {
  let fixture: ComponentFixture<TwFaderComponent>;
  let component: TwFaderComponent;
  let hostEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwFaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TwFaderComponent);
    component = fixture.componentInstance;
    hostEl = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('ControlValueAccessor', () => {
    it('writeValue should update the rendered value', () => {
      component.writeValue(6);
      fixture.detectChanges();

      expect(hostEl.getAttribute('aria-valuenow')).toBe('6');
    });

    it('writeValue should fall back to the default value for null', () => {
      component.writeValue(null as unknown as number);
      fixture.detectChanges();

      expect(hostEl.getAttribute('aria-valuenow')).toBe('0');
    });

    it('registerOnChange callback should fire on keyboard changes', () => {
      const received: number[] = [];
      component.registerOnChange(value => received.push(value));

      hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      fixture.detectChanges();

      expect(received).toContain(12); // default max
    });
  });

  describe('setDisabledState', () => {
    it('should reflect the disabled state on the host', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(hostEl.getAttribute('aria-disabled')).toBe('true');
      expect(hostEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should block keyboard interaction while disabled', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(hostEl.getAttribute('aria-valuenow')).toBe('0');
    });

    it('should re-enable interaction when cleared', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      component.setDisabledState(false);
      fixture.detectChanges();

      expect(hostEl.getAttribute('tabindex')).toBe('0');

      hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      fixture.detectChanges();

      expect(hostEl.getAttribute('aria-valuenow')).toBe('12');
    });
  });

  describe('slider accessibility', () => {
    it('should expose the slider role and range', () => {
      expect(hostEl.getAttribute('role')).toBe('slider');
      expect(hostEl.getAttribute('aria-valuemin')).toBe('-60');
      expect(hostEl.getAttribute('aria-valuemax')).toBe('12');
      expect(hostEl.getAttribute('aria-valuetext')).toContain('dB');
    });
  });
});
