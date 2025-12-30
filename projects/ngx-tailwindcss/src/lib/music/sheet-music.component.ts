import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwStaffComponent, ClefType, KeySignature, StaffTimeSignature } from './staff.component';
import { TwNoteComponent, NoteData, NoteName, NoteDuration, NoteAccidental } from './note.component';

export type SheetMusicVariant = 'default' | 'printed' | 'handwritten' | 'minimal';
export type SheetMusicLayout = 'scroll' | 'pages' | 'single';

export interface MeasureData {
  notes: NoteData[];
  timeSignature?: StaffTimeSignature;
  keySignature?: KeySignature;
  tempo?: number;
  repeatStart?: boolean;
  repeatEnd?: boolean;
  endingNumber?: number;
}

export interface SheetMusicData {
  title?: string;
  composer?: string;
  arranger?: string;
  tempo?: number;
  clef: ClefType;
  keySignature: KeySignature;
  timeSignature: StaffTimeSignature;
  measures: MeasureData[];
  grandStaff?: boolean;
}

// Sample music for demo
export const SAMPLE_MUSIC: SheetMusicData = {
  title: 'Sample Melody',
  composer: 'Demo',
  clef: 'treble',
  keySignature: 'C',
  timeSignature: '4/4',
  tempo: 120,
  measures: [
    {
      notes: [
        { name: 'C', octave: 4, duration: 'quarter' },
        { name: 'E', octave: 4, duration: 'quarter' },
        { name: 'G', octave: 4, duration: 'quarter' },
        { name: 'C', octave: 5, duration: 'quarter' },
      ],
    },
    {
      notes: [
        { name: 'B', octave: 4, duration: 'half' },
        { name: 'G', octave: 4, duration: 'half' },
      ],
    },
    {
      notes: [
        { name: 'A', octave: 4, duration: 'quarter' },
        { name: 'F', octave: 4, duration: 'quarter' },
        { name: 'D', octave: 4, duration: 'quarter' },
        { name: 'B', octave: 3, duration: 'quarter' },
      ],
    },
    {
      notes: [
        { name: 'C', octave: 4, duration: 'whole' },
      ],
    },
  ],
};

@Component({
  selector: 'tw-sheet-music',
  standalone: true,
  imports: [CommonModule, TwStaffComponent, TwNoteComponent],
  templateUrl: './sheet-music.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TwSheetMusicComponent {
  readonly music = input<SheetMusicData | null>(null);
  readonly variant = input<SheetMusicVariant>('default');
  readonly layout = input<SheetMusicLayout>('scroll');
  readonly width = input(800, { transform: numberAttribute });
  readonly staffHeight = input(120, { transform: numberAttribute });
  readonly measuresPerLine = input(4, { transform: numberAttribute });
  readonly lineSpacing = input(10, { transform: numberAttribute });
  readonly showTitle = input(true);
  readonly showComposer = input(true);
  readonly showTempo = input(true);
  readonly showMeasureNumbers = input(true);
  readonly interactive = input(false);
  readonly playbackPosition = input<number | null>(null); // Current playback measure/beat
  readonly highlightedNotes = input<{ measure: number; noteIndex: number }[]>([]);
  readonly classOverride = input('');

  readonly noteClick = output<{ measure: number; noteIndex: number; note: NoteData }>();
  readonly measureClick = output<number>();

  protected readonly currentPage = signal(0);

  protected readonly musicData = computed(() => {
    return this.music() || SAMPLE_MUSIC;
  });

  protected readonly totalLines = computed(() => {
    const measures = this.musicData().measures.length;
    const perLine = this.measuresPerLine();
    return Math.ceil(measures / perLine);
  });

  protected readonly lines = computed(() => {
    const music = this.musicData();
    const perLine = this.measuresPerLine();
    const lines: MeasureData[][] = [];

    for (let i = 0; i < music.measures.length; i += perLine) {
      lines.push(music.measures.slice(i, i + perLine));
    }

    return lines;
  });

  protected readonly totalHeight = computed(() => {
    const lines = this.totalLines();
    const staffH = this.staffHeight();
    const titleHeight = this.showTitle() && this.musicData().title ? 50 : 0;
    const composerHeight = this.showComposer() && this.musicData().composer ? 24 : 0;
    const lineGap = 40;

    return titleHeight + composerHeight + (lines * (staffH + lineGap));
  });

  protected readonly containerClasses = computed(() => {
    const layout = this.layout();
    const base = 'rounded-lg overflow-hidden';

    const layoutClasses: Record<SheetMusicLayout, string> = {
      scroll: 'overflow-x-auto',
      pages: 'overflow-hidden',
      single: 'overflow-visible',
    };

    const variantClasses: Record<SheetMusicVariant, string> = {
      default: 'bg-white dark:bg-slate-100 shadow-sm border border-slate-200',
      printed: 'bg-[#FFFFF8] shadow-md',
      handwritten: 'bg-[#FDF6E3] shadow-inner',
      minimal: 'bg-transparent',
    };

    return [base, layoutClasses[layout], variantClasses[this.variant()], this.classOverride()]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly titleClasses = computed(() => {
    const variant = this.variant();
    const base = 'text-center font-serif font-bold';
    const size = 'text-2xl';
    const color = variant === 'minimal' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900';
    return [base, size, color].join(' ');
  });

  protected readonly subtitleClasses = computed(() => {
    const variant = this.variant();
    const base = 'text-center font-serif italic';
    const size = 'text-sm';
    const color = variant === 'minimal' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600';
    return [base, size, color].join(' ');
  });

  protected readonly staffVariant = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'printed':
        return 'printed';
      case 'handwritten':
        return 'handwritten';
      case 'minimal':
        return 'minimal';
      default:
        return 'default';
    }
  });

  protected getMeasureStartX(measureIndex: number, lineIndex: number): number {
    const perLine = this.measuresPerLine();
    const measureInLine = measureIndex % perLine;
    const width = this.width();
    const margin = 80; // Space for clef/key/time
    const availableWidth = width - margin - 20;
    const measureWidth = availableWidth / perLine;

    return margin + measureInLine * measureWidth;
  }

  protected getNoteX(measureIndex: number, noteIndex: number, totalNotes: number, lineIndex: number): number {
    const measureX = this.getMeasureStartX(measureIndex, lineIndex);
    const perLine = this.measuresPerLine();
    const width = this.width();
    const margin = 80;
    const availableWidth = width - margin - 20;
    const measureWidth = availableWidth / perLine;

    const noteSpacing = measureWidth / (totalNotes + 1);
    return measureX + noteSpacing * (noteIndex + 1);
  }

  protected isNoteHighlighted(measureIndex: number, noteIndex: number): boolean {
    return this.highlightedNotes().some(
      (h) => h.measure === measureIndex && h.noteIndex === noteIndex
    );
  }

  protected isPlaybackPosition(measureIndex: number): boolean {
    const pos = this.playbackPosition();
    return pos !== null && Math.floor(pos) === measureIndex;
  }

  protected onNoteClick(measureIndex: number, noteIndex: number, note: NoteData): void {
    if (!this.interactive()) return;
    this.noteClick.emit({ measure: measureIndex, noteIndex, note });
  }

  protected onMeasureClick(measureIndex: number): void {
    if (!this.interactive()) return;
    this.measureClick.emit(measureIndex);
  }

  protected getLineY(lineIndex: number): number {
    const titleHeight = this.showTitle() && this.musicData().title ? 50 : 0;
    const composerHeight = this.showComposer() && this.musicData().composer ? 24 : 0;
    const staffH = this.staffHeight();
    const lineGap = 40;

    return titleHeight + composerHeight + lineIndex * (staffH + lineGap);
  }

  protected getMeasureGlobalIndex(lineIndex: number, measureInLineIndex: number): number {
    return lineIndex * this.measuresPerLine() + measureInLineIndex;
  }

  // Pagination for 'pages' layout
  protected nextPage(): void {
    const maxPage = this.totalLines() - 1;
    if (this.currentPage() < maxPage) {
      this.currentPage.update((p) => p + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
    }
  }
}

