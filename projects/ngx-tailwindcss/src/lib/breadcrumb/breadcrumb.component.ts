import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow' | 'dot';

@Component({
  selector: 'tw-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
})
export class TwBreadcrumbComponent {
  @Input() set items(value: BreadcrumbItem[]) {
    this._items.set(value);
  }
  @Input() set separator(value: BreadcrumbSeparator) {
    this._separator.set(value);
  }
  @Input() set size(value: 'sm' | 'md' | 'lg') {
    this._size.set(value);
  }

  protected _items = signal<BreadcrumbItem[]>([]);
  protected _separator = signal<BreadcrumbSeparator>('chevron');
  protected _size = signal<'sm' | 'md' | 'lg'>('md');

  protected itemsValue = computed(() => this._items());
  protected separatorValue = computed(() => this._separator());

  protected navClasses = computed(() => {
    const size = this._size();

    const sizeClasses: Record<string, string> = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    return sizeClasses[size];
  });

  protected separatorClasses = computed(() => 'mx-2 text-slate-400 flex items-center');

  protected linkClasses = computed(() => 'text-slate-500 hover:text-slate-700 transition-colors');

  protected currentClasses = computed(() => 'font-medium text-slate-900');
}
