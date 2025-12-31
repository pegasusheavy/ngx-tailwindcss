import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  TimelineAlign,
  TimelineEvent,
  TimelineLayout,
  TwTimelineComponent,
} from './timeline.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-timeline
      [events]="events()"
      [layout]="layout()"
      [align]="align()"
      [markerSize]="markerSize()"
      data-testid="test-timeline"
    ></tw-timeline>
  `,
  standalone: true,
  imports: [TwTimelineComponent],
})
class TestHostComponent {
  @ViewChild(TwTimelineComponent) timeline!: TwTimelineComponent;
  events = signal<TimelineEvent[]>([
    {
      id: '1',
      title: 'Event 1',
      description: 'Description 1',
      date: '2024-01-01',
      color: 'primary',
    },
    {
      id: '2',
      title: 'Event 2',
      description: 'Description 2',
      date: '2024-02-01',
      color: 'success',
    },
    {
      id: '3',
      title: 'Event 3',
      description: 'Description 3',
      date: '2024-03-01',
      color: 'warning',
    },
  ]);
  layout = signal<TimelineLayout>('vertical');
  align = signal<TimelineAlign>('left');
  markerSize = signal<'sm' | 'md' | 'lg'>('md');
}

describe('TwTimelineComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let timelineEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    timelineEl = fixture.debugElement.query(By.directive(TwTimelineComponent));
  });

  it('should create the timeline component', () => {
    expect(timelineEl).toBeTruthy();
    expect(component.timeline).toBeTruthy();
  });

  it('should render correct number of events', () => {
    const eventItems = timelineEl.queryAll(By.css('.relative.flex'));
    expect(eventItems.length).toBe(3);
  });

  describe('event content', () => {
    it('should display event titles', () => {
      expect(timelineEl.nativeElement.textContent).toContain('Event 1');
      expect(timelineEl.nativeElement.textContent).toContain('Event 2');
      expect(timelineEl.nativeElement.textContent).toContain('Event 3');
    });

    it('should display event descriptions', () => {
      expect(timelineEl.nativeElement.textContent).toContain('Description 1');
      expect(timelineEl.nativeElement.textContent).toContain('Description 2');
      expect(timelineEl.nativeElement.textContent).toContain('Description 3');
    });

    it('should display event dates', () => {
      expect(timelineEl.nativeElement.textContent).toContain('2024-01-01');
      expect(timelineEl.nativeElement.textContent).toContain('2024-02-01');
      expect(timelineEl.nativeElement.textContent).toContain('2024-03-01');
    });
  });

  describe('layout', () => {
    it('should apply vertical layout by default', () => {
      const container = timelineEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('flex-col');
    });

    it('should apply horizontal layout', () => {
      component.layout.set('horizontal');
      fixture.detectChanges();
      const container = timelineEl.query(By.css('div'));
      expect(container.nativeElement.className).toContain('flex');
      expect(container.nativeElement.className).not.toContain('flex-col');
    });
  });

  describe('alignment', () => {
    it('should align left by default', () => {
      const eventItems = timelineEl.queryAll(By.css('.relative.flex'));
      expect(eventItems[0].nativeElement.className).not.toContain('flex-row-reverse');
    });

    it('should align right', () => {
      component.align.set('right');
      fixture.detectChanges();
      const eventItems = timelineEl.queryAll(By.css('.relative.flex'));
      expect(eventItems[0].nativeElement.className).toContain('flex-row-reverse');
    });
  });

  describe('marker sizes', () => {
    it('should apply md size by default', () => {
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('w-4');
      expect(markers[0].nativeElement.className).toContain('h-4');
    });

    it('should apply sm size', () => {
      component.markerSize.set('sm');
      fixture.detectChanges();
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('w-3');
      expect(markers[0].nativeElement.className).toContain('h-3');
    });

    it('should apply lg size', () => {
      component.markerSize.set('lg');
      fixture.detectChanges();
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('w-5');
      expect(markers[0].nativeElement.className).toContain('h-5');
    });
  });

  describe('colors', () => {
    it('should apply primary color', () => {
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('bg-blue-600');
    });

    it('should apply success color', () => {
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[1].nativeElement.className).toContain('bg-emerald-600');
    });

    it('should apply warning color', () => {
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[2].nativeElement.className).toContain('bg-amber-500');
    });

    it('should apply danger color', () => {
      component.events.set([{ id: '1', title: 'Event', color: 'danger' }]);
      fixture.detectChanges();
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('bg-rose-600');
    });

    it('should apply info color', () => {
      component.events.set([{ id: '1', title: 'Event', color: 'info' }]);
      fixture.detectChanges();
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('bg-cyan-600');
    });

    it('should apply secondary color', () => {
      component.events.set([{ id: '1', title: 'Event', color: 'secondary' }]);
      fixture.detectChanges();
      const markers = timelineEl.queryAll(By.css('.rounded-full'));
      expect(markers[0].nativeElement.className).toContain('bg-slate-600');
    });
  });

  describe('connectors', () => {
    it('should render connectors between events', () => {
      const connectors = timelineEl.queryAll(By.css('.bg-slate-300'));
      // There should be connectors for non-last items
      expect(connectors.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    it('should handle empty events array', () => {
      component.events.set([]);
      fixture.detectChanges();
      const eventItems = timelineEl.queryAll(By.css('.relative.flex'));
      expect(eventItems.length).toBe(0);
    });
  });
});
