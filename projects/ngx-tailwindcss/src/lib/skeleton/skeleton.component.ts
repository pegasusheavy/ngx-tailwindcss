import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

@Component({
  selector: 'tw-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwSkeletonComponent {
  @Input() set variant(value: SkeletonVariant) {
    this._variant.set(value);
  }
  @Input() set width(value: string | number) {
    this._width.set(value);
  }
  @Input() set height(value: string | number) {
    this._height.set(value);
  }
  @Input() set animated(value: boolean) {
    this._animated.set(value);
  }

  protected _variant = signal<SkeletonVariant>('text');
  protected _width = signal<string | number>('100%');
  protected _height = signal<string | number>('');
  protected _animated = signal(true);

  protected skeletonClasses = computed(() => {
    const variant = this._variant();
    const animated = this._animated();

    const variantClasses: Record<SkeletonVariant, string> = {
      text: 'rounded',
      circular: 'rounded-full aspect-square',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
    };

    const classes = ['bg-slate-200 dark:bg-slate-700', 'block', variantClasses[variant]];

    if (animated) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  });

  protected customStyle = computed(() => {
    const width = this._width();
    const height = this._height();
    const variant = this._variant();

    const styles: Record<string, string> = {};

    if (width) {
      styles['width'] = typeof width === 'number' ? `${width}px` : width;
    }

    if (height) {
      styles['height'] = typeof height === 'number' ? `${height}px` : height;
    } else if (variant === 'text') {
      styles['height'] = '1.25rem'; // 20px - better default height for text skeleton
    }

    return styles;
  });
}

export type SkeletonGap = 'sm' | 'md' | 'lg';

@Component({
  selector: 'tw-skeleton-text',
  standalone: true,
  imports: [CommonModule, TwSkeletonComponent],
  templateUrl: './skeleton-text.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwSkeletonTextComponent {
  @Input() set lineCount(value: number) {
    this._lineCount.set(value);
  }
  @Input() set animated(value: boolean) {
    this._animated.set(value);
  }
  @Input() set lastLineWidth(value: string) {
    this._lastLineWidth.set(value);
  }
  @Input() set gap(value: SkeletonGap) {
    this._gap.set(value);
  }

  protected _lineCount = signal(3);
  protected _animated = signal(true);
  protected _lastLineWidth = signal('60%');
  protected _gap = signal<SkeletonGap>('md');

  protected animatedValue = computed(() => this._animated());

  protected gapPx = computed(() => {
    const gapMap: Record<SkeletonGap, number> = {
      sm: 12,
      md: 16,
      lg: 20,
    };
    return gapMap[this._gap()];
  });

  protected lines = computed(() => {
    const count = this._lineCount();
    const lastWidth = this._lastLineWidth();

    return Array.from({ length: count }, (_, i) => ({
      width: i === count - 1 ? lastWidth : '100%',
    }));
  });
}

@Component({
  selector: 'tw-skeleton-card',
  standalone: true,
  imports: [CommonModule, TwSkeletonComponent, TwSkeletonTextComponent],
  templateUrl: './skeleton-card.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwSkeletonCardComponent {
  @Input() set showMedia(value: boolean) {
    this._showMedia.set(value);
  }
  @Input() set showAvatar(value: boolean) {
    this._showAvatar.set(value);
  }
  @Input() set mediaHeight(value: number) {
    this._mediaHeight.set(value);
  }
  @Input() set lineCount(value: number) {
    this._lineCount.set(value);
  }

  protected _showMedia = signal(true);
  protected _showAvatar = signal(false);
  protected _mediaHeight = signal(200);
  protected _lineCount = signal(3);

  protected showMediaValue = computed(() => this._showMedia());
  protected showAvatarValue = computed(() => this._showAvatar());
  protected mediaHeightValue = computed(() => this._mediaHeight());
  protected lineCountValue = computed(() => this._lineCount());
}

@Component({
  selector: 'tw-skeleton-table',
  standalone: true,
  imports: [CommonModule, TwSkeletonComponent],
  templateUrl: './skeleton-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TwSkeletonTableComponent {
  @Input() set rowCount(value: number) {
    this._rowCount.set(value);
  }
  @Input() set columnCount(value: number) {
    this._columnCount.set(value);
  }

  protected _rowCount = signal(5);
  protected _columnCount = signal(4);

  protected rows = computed(() => Array.from({ length: this._rowCount() }));
  protected columns = computed(() =>
    Array.from({ length: this._columnCount() }, (_, i) => ({
      flex: i === 0 ? 2 : 1,
      width: i === this._columnCount() - 1 ? '60%' : '100%',
    }))
  );
}
