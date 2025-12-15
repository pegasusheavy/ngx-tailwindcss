import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

@Component({
  selector: 'tw-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
})
export class TwAvatarComponent {
  @Input() set src(val: string) { this._src.set(val); }
  @Input() set alt(val: string) { this._alt.set(val); }
  @Input() set initials(val: string) { this._initials.set(val); }
  @Input() set size(val: AvatarSize) { this._size.set(val); }
  @Input() set variant(val: AvatarVariant) { this._variant.set(val); }
  @Input() set status(val: AvatarStatus) { this._status.set(val); }
  @Input() set badge(val: string | number) { this._badge.set(val?.toString() ?? ''); }
  @Input() set color(val: string) { this._color.set(val); }

  protected _src = signal('');
  protected _alt = signal('');
  protected _initials = signal('');
  protected _size = signal<AvatarSize>('md');
  protected _variant = signal<AvatarVariant>('circle');
  protected _status = signal<AvatarStatus>('none');
  protected _badge = signal('');
  protected _color = signal('');
  protected _imageError = signal(false);

  protected srcVal = computed(() => this._imageError() ? '' : this._src());
  protected altVal = computed(() => this._alt());
  protected initialsVal = computed(() => this._initials());
  protected statusVal = computed(() => this._status());
  protected badgeVal = computed(() => this._badge());

  protected containerClasses = computed(() => {
    const sz = this._size();

    // Outer container needs extra padding for status/badge overflow
    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      '2xl': 'w-20 h-20',
    };

    return [
      'relative inline-block',
      sizeClasses[sz],
    ].join(' ');
  });

  protected innerClasses = computed(() => {
    const sz = this._size();
    const vari = this._variant();
    const clr = this._color();

    const textSizeClasses: Record<AvatarSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    };

    const variantClasses: Record<AvatarVariant, string> = {
      circle: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    };

    const baseColor = clr || 'bg-slate-200 text-slate-600';

    return [
      'w-full h-full flex items-center justify-center overflow-hidden',
      textSizeClasses[sz],
      variantClasses[vari],
      baseColor,
    ].join(' ');
  });

  protected initialsClasses = computed(() => 'font-medium uppercase');

  protected statusClasses = computed(() => {
    const sz = this._size();
    const stat = this._status();

    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'w-1.5 h-1.5 border',
      sm: 'w-2 h-2 border',
      md: 'w-2.5 h-2.5 border-2',
      lg: 'w-3 h-3 border-2',
      xl: 'w-3.5 h-3.5 border-2',
      '2xl': 'w-4 h-4 border-2',
    };

    const statusColors: Record<AvatarStatus, string> = {
      online: 'bg-emerald-500',
      offline: 'bg-slate-400',
      busy: 'bg-rose-500',
      away: 'bg-amber-500',
      none: '',
    };

    return [
      'absolute bottom-0 right-0 rounded-full border-white',
      sizeClasses[sz],
      statusColors[stat],
    ].join(' ');
  });

  protected badgeClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'text-[8px] min-w-3 h-3 -top-0.5 -right-0.5',
      sm: 'text-[9px] min-w-3.5 h-3.5 -top-0.5 -right-0.5',
      md: 'text-[10px] min-w-4 h-4 -top-1 -right-1',
      lg: 'text-xs min-w-5 h-5 -top-1 -right-1',
      xl: 'text-xs min-w-5 h-5 -top-1 -right-1',
      '2xl': 'text-sm min-w-6 h-6 -top-1 -right-1',
    };

    return [
      'absolute flex items-center justify-center rounded-full bg-rose-500 text-white font-medium px-1',
      sizeClasses[sz],
    ].join(' ');
  });

  protected onImageError(): void {
    this._imageError.set(true);
  }
}

@Component({
  selector: 'tw-avatar-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-group.component.html',
})
export class TwAvatarGroupComponent {
  @Input() set max(val: number) { this._max.set(val); }
  @Input() set total(val: number) { this._total.set(val); }
  @Input() set size(val: AvatarSize) { this._size.set(val); }
  @Input() set spacing(val: 'tight' | 'normal' | 'loose') { this._spacing.set(val); }

  protected _max = signal(0);
  protected _total = signal(0);
  protected _size = signal<AvatarSize>('md');
  protected _spacing = signal<'tight' | 'normal' | 'loose'>('normal');

  protected maxVal = computed(() => this._max());
  protected overflowVal = computed(() => {
    const mx = this._max();
    const tot = this._total();
    return mx > 0 && tot > mx ? tot - mx : 0;
  });

  protected groupClasses = computed(() => {
    const sp = this._spacing();

    const spacingClasses: Record<string, string> = {
      tight: '-space-x-3',
      normal: '-space-x-2',
      loose: '-space-x-1',
    };

    return [
      'flex items-center',
      spacingClasses[sp],
      '[&>*]:ring-2 [&>*]:ring-white',
    ].join(' ');
  });

  protected overflowClasses = computed(() => {
    const sz = this._size();

    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };

    return [
      'flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium ring-2 ring-white',
      sizeClasses[sz],
    ].join(' ');
  });
}
