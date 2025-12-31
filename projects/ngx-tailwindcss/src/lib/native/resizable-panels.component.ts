import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  viewChild,
  effect,
  inject,
  NgZone,
  DestroyRef,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

export type SplitDirection = 'horizontal' | 'vertical';

export interface PanelConfig {
  id: string;
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  collapsible?: boolean;
  collapsed?: boolean;
}

@Component({
  selector: 'tw-resizable-panels',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #container
      [class]="containerClasses()"
      [style.--panel-1-size]="panel1Size() + '%'"
      [style.--panel-2-size]="panel2Size() + '%'"
    >
      <!-- Panel 1 -->
      <div
        [class]="panelClasses(0)"
        [style.flex-basis]="panel1Collapsed() ? '0%' : panel1Size() + '%'"
        [class.hidden]="panel1Collapsed()"
      >
        <ng-content select="[panel1]"></ng-content>
      </div>

      <!-- Resize Handle -->
      <div
        [class]="handleClasses()"
        (mousedown)="startResize($event)"
        (dblclick)="resetSize()"
        (touchstart)="startResize($event)"
      >
        <div [class]="handleIndicatorClasses()"></div>

        <!-- Collapse Buttons -->
        @if (showCollapseButtons()) {
          <div [class]="collapseButtonsClasses()">
            @if (panel1Config()?.collapsible) {
              <button
                (click)="togglePanel1Collapse()"
                class="p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded"
                [title]="panel1Collapsed() ? 'Expand' : 'Collapse'"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if (direction() === 'horizontal') {
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="panel1Collapsed() ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'"
                    />
                  } @else {
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="panel1Collapsed() ? 'M19 13l-7 7-7-7' : 'M5 11l7-7 7 7'"
                    />
                  }
                </svg>
              </button>
            }
            @if (panel2Config()?.collapsible) {
              <button
                (click)="togglePanel2Collapse()"
                class="p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded"
                [title]="panel2Collapsed() ? 'Expand' : 'Collapse'"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if (direction() === 'horizontal') {
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="panel2Collapsed() ? 'M11 19l-7-7 7-7' : 'M13 5l7 7-7 7'"
                    />
                  } @else {
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="panel2Collapsed() ? 'M5 11l7-7 7 7' : 'M19 13l-7 7-7-7'"
                    />
                  }
                </svg>
              </button>
            }
          </div>
        }
      </div>

      <!-- Panel 2 -->
      <div
        [class]="panelClasses(1)"
        [style.flex-basis]="panel2Collapsed() ? '0%' : panel2Size() + '%'"
        [class.hidden]="panel2Collapsed()"
      >
        <ng-content select="[panel2]"></ng-content>
      </div>
    </div>
  `,
})
export class TwResizablePanelsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  public readonly direction = input<SplitDirection>('horizontal');
  public readonly defaultSplit = input(50);
  public readonly minSize = input(10);
  public readonly maxSize = input(90);
  public readonly panel1Config = input<PanelConfig | null>(null);
  public readonly panel2Config = input<PanelConfig | null>(null);
  public readonly showCollapseButtons = input(true);
  public readonly handleSize = input(4);

  public readonly sizeChanged = output<{ panel1: number; panel2: number }>();
  public readonly panel1CollapseChanged = output<boolean>();
  public readonly panel2CollapseChanged = output<boolean>();

  public readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  public readonly panel1Size = signal(50);
  public readonly panel2Size = computed(() => 100 - this.panel1Size());
  public readonly panel1Collapsed = signal(false);
  public readonly panel2Collapsed = signal(false);
  public readonly isResizing = signal(false);

  constructor() {
    effect(() => {
      this.panel1Size.set(this.defaultSplit());
    });

    effect(() => {
      const config1 = this.panel1Config();
      if (config1?.collapsed !== undefined) {
        this.panel1Collapsed.set(config1.collapsed);
      }
      if (config1?.defaultSize !== undefined) {
        this.panel1Size.set(config1.defaultSize);
      }
    });

    effect(() => {
      const config2 = this.panel2Config();
      if (config2?.collapsed !== undefined) {
        this.panel2Collapsed.set(config2.collapsed);
      }
    });
  }

  public readonly containerClasses = computed(() => {
    const dir = this.direction();
    return `flex ${dir === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full`;
  });

  public panelClasses(index: number): string {
    return 'overflow-auto transition-[flex-basis] duration-200';
  }

  public readonly handleClasses = computed(() => {
    const dir = this.direction();
    const baseClasses =
      'flex-shrink-0 bg-slate-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors relative group';
    const cursor = this.isResizing()
      ? dir === 'horizontal'
        ? 'cursor-col-resize'
        : 'cursor-row-resize'
      : '';
    const size = dir === 'horizontal' ? `w-${this.handleSize()}` : `h-${this.handleSize()}`;

    return `${baseClasses} ${size} ${cursor} ${dir === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'}`;
  });

  public readonly handleIndicatorClasses = computed(() => {
    const dir = this.direction();
    if (dir === 'horizontal') {
      return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-slate-400 dark:bg-slate-500 rounded-full group-hover:bg-white';
    }
    return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-slate-400 dark:bg-slate-500 rounded-full group-hover:bg-white';
  });

  public readonly collapseButtonsClasses = computed(() => {
    const dir = this.direction();
    return `absolute ${dir === 'horizontal' ? 'top-2 left-1/2 -translate-x-1/2 flex-col' : 'left-2 top-1/2 -translate-y-1/2 flex-row'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`;
  });

  public startResize(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isResizing.set(true);

    const containerEl = this.container()?.nativeElement;
    if (!containerEl) return;

    const isHorizontal = this.direction() === 'horizontal';
    const startPos = this.getEventPosition(event, isHorizontal);
    const containerRect = containerEl.getBoundingClientRect();
    const containerSize = isHorizontal ? containerRect.width : containerRect.height;
    const startSize = this.panel1Size();

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentPos = this.getEventPosition(moveEvent, isHorizontal);
      const delta = currentPos - startPos;
      const deltaPercent = (delta / containerSize) * 100;
      let newSize = startSize + deltaPercent;

      // Apply constraints
      const min = Math.max(this.minSize(), this.panel1Config()?.minSize || 0);
      const max = Math.min(this.maxSize(), this.panel1Config()?.maxSize || 100);
      newSize = Math.max(min, Math.min(max, newSize));

      this.ngZone.run(() => {
        this.panel1Size.set(newSize);
        this.sizeChanged.emit({ panel1: newSize, panel2: 100 - newSize });
      });
    };

    const handleEnd = () => {
      this.ngZone.run(() => {
        this.isResizing.set(false);
      });
      this.document.removeEventListener('mousemove', handleMove);
      this.document.removeEventListener('mouseup', handleEnd);
      this.document.removeEventListener('touchmove', handleMove);
      this.document.removeEventListener('touchend', handleEnd);
    };

    this.document.addEventListener('mousemove', handleMove);
    this.document.addEventListener('mouseup', handleEnd);
    this.document.addEventListener('touchmove', handleMove);
    this.document.addEventListener('touchend', handleEnd);
  }

  public resetSize(): void {
    this.panel1Size.set(this.defaultSplit());
    this.sizeChanged.emit({ panel1: this.defaultSplit(), panel2: 100 - this.defaultSplit() });
  }

  public togglePanel1Collapse(): void {
    this.panel1Collapsed.update(v => !v);
    this.panel1CollapseChanged.emit(this.panel1Collapsed());
  }

  public togglePanel2Collapse(): void {
    this.panel2Collapsed.update(v => !v);
    this.panel2CollapseChanged.emit(this.panel2Collapsed());
  }

  private getEventPosition(event: MouseEvent | TouchEvent, isHorizontal: boolean): number {
    if ('touches' in event) {
      return isHorizontal ? event.touches[0].clientX : event.touches[0].clientY;
    }
    return isHorizontal ? event.clientX : event.clientY;
  }
}
