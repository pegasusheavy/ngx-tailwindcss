import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwCommandPaletteComponent } from './command-palette.component';
import { NativeAppPlatformService } from './platform.service';
import { CommandItem } from './native.types';

@Component({
  template: `
    <tw-command-palette
      [commands]="commands()"
      (commandSelect)="onSelect($event)"
    ></tw-command-palette>
  `,
  standalone: true,
  imports: [TwCommandPaletteComponent],
})
class TestHostComponent {
  @ViewChild(TwCommandPaletteComponent) palette!: TwCommandPaletteComponent;
  commands = signal<CommandItem[]>([]);
  selected: CommandItem | null = null;
  onSelect(command: CommandItem): void {
    this.selected = command;
  }
}

describe('TwCommandPaletteComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let copyAction: ReturnType<typeof vi.fn>;
  let pasteAction: ReturnType<typeof vi.fn>;
  let mockPlatformService: {
    platform: WritableSignal<'macos' | 'windows' | 'linux' | 'web'>;
    formatShortcut: (shortcut: string) => string;
  };

  const getOptions = (): HTMLButtonElement[] => [
    ...fixture.nativeElement.querySelectorAll<HTMLButtonElement>('[role="option"]'),
  ];

  const getSearchInput = (): HTMLInputElement => {
    const input = fixture.nativeElement.querySelector<HTMLInputElement>('input[type="text"]');
    expect(input).toBeTruthy();
    return input!;
  };

  const setQuery = (query: string): void => {
    const input = getSearchInput();
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  };

  const pressKey = (key: string): void => {
    getSearchInput().dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
    mockPlatformService = {
      platform: signal<'macos' | 'windows' | 'linux' | 'web'>('linux'),
      formatShortcut: (shortcut: string) => shortcut,
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
    copyAction = vi.fn();
    pasteAction = vi.fn();
    component.commands.set([
      { id: 'copy', label: 'Copy', action: copyAction },
      { id: 'paste', label: 'Paste', action: pasteAction },
      { id: 'settings', label: 'Open Settings', action: vi.fn() },
    ]);
    fixture.detectChanges();
  });

  it('should create the command palette', () => {
    expect(component.palette).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(TwCommandPaletteComponent))).toBeTruthy();
  });

  it('should not render the dialog until opened', () => {
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render the dialog with all commands when opened', () => {
    component.palette.open();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    expect(getOptions()).toHaveLength(3);
  });

  it('should narrow the results when filtering', () => {
    component.palette.open();
    fixture.detectChanges();

    setQuery('copy');

    const options = getOptions();
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Copy');
  });

  it('should show an empty state when nothing matches', () => {
    component.palette.open();
    fixture.detectChanges();

    setQuery('zzzz');

    expect(getOptions()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('No results found');
  });

  it('should select the highlighted command with ArrowDown + Enter', () => {
    component.palette.open();
    fixture.detectChanges();

    pressKey('ArrowDown');
    pressKey('Enter');

    expect(component.selected?.id).toBe('paste');
    expect(pasteAction).toHaveBeenCalledTimes(1);
    expect(copyAction).not.toHaveBeenCalled();
    // Palette closes after selection
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should mark the highlighted row with aria-selected', () => {
    component.palette.open();
    fixture.detectChanges();

    expect(getOptions()[0].getAttribute('aria-selected')).toBe('true');

    pressKey('ArrowDown');

    const options = getOptions();
    expect(options[0].getAttribute('aria-selected')).toBe('false');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
  });
});
