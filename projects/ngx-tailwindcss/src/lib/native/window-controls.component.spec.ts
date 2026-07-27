import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwWindowControlsComponent } from './window-controls.component';
import { NativeAppPlatformService } from './platform.service';
import { TitleBarPlatform, WindowState } from './native.types';

@Component({
  template: `
    <tw-window-controls
      [platform]="platform()"
      [showClose]="showClose()"
      [showMinimize]="showMinimize()"
      [showMaximize]="showMaximize()"
      (closeClick)="onClose()"
      (minimizeClick)="onMinimize()"
      (maximizeClick)="onMaximize()"
    ></tw-window-controls>
  `,
  standalone: true,
  imports: [TwWindowControlsComponent],
})
class TestHostComponent {
  @ViewChild(TwWindowControlsComponent) controls!: TwWindowControlsComponent;
  platform = signal<TitleBarPlatform>('linux');
  showClose = signal(true);
  showMinimize = signal(true);
  showMaximize = signal(true);
  onClose = vi.fn();
  onMinimize = vi.fn();
  onMaximize = vi.fn();
}

describe('TwWindowControlsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let controlsNative: HTMLElement;
  let mockPlatformService: {
    platform: WritableSignal<'macos' | 'windows' | 'linux' | 'web'>;
    windowState: WritableSignal<WindowState>;
    close: ReturnType<typeof vi.fn>;
    minimize: ReturnType<typeof vi.fn>;
    maximize: ReturnType<typeof vi.fn>;
    toggleFullscreen: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockPlatformService = {
      platform: signal<'macos' | 'windows' | 'linux' | 'web'>('linux'),
      windowState: signal<WindowState>({
        isMaximized: false,
        isMinimized: false,
        isFullscreen: false,
        isFocused: true,
      }),
      close: vi.fn().mockResolvedValue(undefined),
      minimize: vi.fn().mockResolvedValue(undefined),
      maximize: vi.fn().mockResolvedValue(undefined),
      toggleFullscreen: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: NativeAppPlatformService,
          useValue: mockPlatformService as unknown as NativeAppPlatformService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    controlsNative = fixture.debugElement.query(
      By.directive(TwWindowControlsComponent)
    ).nativeElement;
  });

  it('should create the window controls', () => {
    expect(component.controls).toBeTruthy();
    expect(controlsNative).toBeTruthy();
  });

  it('should render minimize, maximize, and close buttons', () => {
    expect(controlsNative.querySelector('button[aria-label="Minimize"]')).toBeTruthy();
    expect(controlsNative.querySelector('button[aria-label="Maximize"]')).toBeTruthy();
    expect(controlsNative.querySelector('button[aria-label="Close"]')).toBeTruthy();
  });

  it('should emit closeClick and call the platform service on close', () => {
    const closeButton = controlsNative.querySelector<HTMLButtonElement>(
      'button[aria-label="Close"]'
    );
    closeButton?.click();
    fixture.detectChanges();

    expect(component.onClose).toHaveBeenCalledTimes(1);
    expect(mockPlatformService.close).toHaveBeenCalledTimes(1);
  });

  it('should emit minimizeClick and call the platform service on minimize', () => {
    const minimizeButton = controlsNative.querySelector<HTMLButtonElement>(
      'button[aria-label="Minimize"]'
    );
    minimizeButton?.click();
    fixture.detectChanges();

    expect(component.onMinimize).toHaveBeenCalledTimes(1);
    expect(mockPlatformService.minimize).toHaveBeenCalledTimes(1);
  });

  it('should emit maximizeClick and call the platform service on maximize', () => {
    const maximizeButton = controlsNative.querySelector<HTMLButtonElement>(
      'button[aria-label="Maximize"]'
    );
    maximizeButton?.click();
    fixture.detectChanges();

    expect(component.onMaximize).toHaveBeenCalledTimes(1);
    expect(mockPlatformService.maximize).toHaveBeenCalledTimes(1);
  });

  it('should hide buttons when the corresponding inputs are false', () => {
    component.showClose.set(false);
    component.showMinimize.set(false);
    component.showMaximize.set(false);
    fixture.detectChanges();

    expect(controlsNative.querySelector('button')).toBeNull();
  });
});
