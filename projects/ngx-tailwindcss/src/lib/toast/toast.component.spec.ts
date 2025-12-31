import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TwToastComponent,
  TwToastContainerComponent,
  TwToastService,
  ToastVariant
} from './toast.component';

@Component({
  template: `
    <tw-toast
      [variant]="variant()"
      [title]="title()"
      [message]="message()"
      [dismissible]="dismissible()"
      [action]="action()"
      [dismiss]="onDismiss"
    ></tw-toast>
  `,
  standalone: true,
  imports: [TwToastComponent],
})
class TestHostComponent {
  @ViewChild(TwToastComponent) toast!: TwToastComponent;
  variant = signal<ToastVariant>('info');
  title = signal('');
  message = signal('Test message');
  dismissible = signal(true);
  action = signal<{ label: string; onClick: () => void } | undefined>(undefined);

  dismissCount = 0;
  onDismiss = () => {
    this.dismissCount++;
  };
}

describe('TwToastService', () => {
  let service: TwToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwToastService],
    });
    service = TestBed.inject(TwToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should add a toast', () => {
      service.show({ message: 'Test toast' });
      expect(service.toasts().length).toBe(1);
    });

    it('should return toast id', () => {
      const id = service.show({ message: 'Test toast' });
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should set default variant to info', () => {
      service.show({ message: 'Test toast' });
      expect(service.toasts()[0].variant).toBe('info');
    });

    it('should set custom variant', () => {
      service.show({ message: 'Test toast', variant: 'success' });
      expect(service.toasts()[0].variant).toBe('success');
    });

    it('should set default duration to 5000ms', () => {
      service.show({ message: 'Test toast' });
      expect(service.toasts()[0].duration).toBe(5000);
    });

    it('should auto-dismiss after duration', async () => {
      vi.useFakeTimers();
      service.show({ message: 'Test toast', duration: 1000 });
      expect(service.toasts().length).toBe(1);
      vi.advanceTimersByTime(1100);
      expect(service.toasts().length).toBe(0);
      vi.useRealTimers();
    });

    it('should not auto-dismiss when duration is 0', async () => {
      vi.useFakeTimers();
      service.show({ message: 'Test toast', duration: 0 });
      vi.advanceTimersByTime(10000);
      expect(service.toasts().length).toBe(1);
      vi.useRealTimers();
    });
  });

  describe('convenience methods', () => {
    it('should show success toast', () => {
      service.success('Success message');
      expect(service.toasts()[0].variant).toBe('success');
      expect(service.toasts()[0].message).toBe('Success message');
    });

    it('should show success toast with title', () => {
      service.success('Success message', 'Success');
      expect(service.toasts()[0].title).toBe('Success');
    });

    it('should show error toast', () => {
      service.error('Error message');
      expect(service.toasts()[0].variant).toBe('danger');
    });

    it('should show warning toast', () => {
      service.warning('Warning message');
      expect(service.toasts()[0].variant).toBe('warning');
    });

    it('should show info toast', () => {
      service.info('Info message');
      expect(service.toasts()[0].variant).toBe('info');
    });
  });

  describe('dismiss', () => {
    it('should dismiss toast by id', () => {
      const id = service.show({ message: 'Test toast' });
      service.dismiss(id);
      expect(service.toasts().length).toBe(0);
    });

    it('should only dismiss specified toast', () => {
      const id1 = service.show({ message: 'Toast 1' });
      service.show({ message: 'Toast 2' });
      service.dismiss(id1);
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Toast 2');
    });
  });

  describe('dismissAll', () => {
    it('should dismiss all toasts', () => {
      service.show({ message: 'Toast 1' });
      service.show({ message: 'Toast 2' });
      service.show({ message: 'Toast 3' });
      service.dismissAll();
      expect(service.toasts().length).toBe(0);
    });
  });

  describe('position', () => {
    it('should have default position of top-right', () => {
      expect(service.position()).toBe('top-right');
    });

    it('should change position', () => {
      service.setPosition('bottom-center');
      expect(service.position()).toBe('bottom-center');
    });
  });
});

describe('TwToastComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let toastEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toastEl = fixture.debugElement.query(By.directive(TwToastComponent)).nativeElement;
  });

  it('should create the toast', () => {
    expect(toastEl).toBeTruthy();
    expect(component.toast).toBeTruthy();
  });

  it('should display message', () => {
    expect(toastEl.textContent).toContain('Test message');
  });

  describe('variants', () => {
    it('should apply info variant icon color', () => {
      const icon = toastEl.querySelector('[class*="text-blue-500"]');
      expect(icon).toBeTruthy();
    });

    it('should apply success variant icon color', () => {
      component.variant.set('success');
      fixture.detectChanges();
      const icon = toastEl.querySelector('[class*="text-emerald-500"]');
      expect(icon).toBeTruthy();
    });

    it('should apply warning variant icon color', () => {
      component.variant.set('warning');
      fixture.detectChanges();
      const icon = toastEl.querySelector('[class*="text-amber-500"]');
      expect(icon).toBeTruthy();
    });

    it('should apply danger variant icon color', () => {
      component.variant.set('danger');
      fixture.detectChanges();
      const icon = toastEl.querySelector('[class*="text-rose-500"]');
      expect(icon).toBeTruthy();
    });
  });

  describe('title', () => {
    it('should display title when provided', () => {
      component.title.set('Important');
      fixture.detectChanges();
      expect(toastEl.textContent).toContain('Important');
    });
  });

  describe('dismissible', () => {
    it('should show dismiss button when dismissible', () => {
      const dismissBtn = toastEl.querySelector('button');
      expect(dismissBtn).toBeTruthy();
    });

    it('should call dismiss on button click', () => {
      const dismissBtn = toastEl.querySelector('button') as HTMLButtonElement;
      dismissBtn.click();
      expect(component.dismissCount).toBe(1);
    });

    it('should hide dismiss button when not dismissible', () => {
      component.dismissible.set(false);
      fixture.detectChanges();
      const buttons = toastEl.querySelectorAll('button');
      // Check if there's no standalone dismiss button (action button might exist)
      const dismissBtns = Array.from(buttons).filter(b =>
        !b.className.includes('action') && b.textContent?.trim() === ''
      );
      expect(dismissBtns.length).toBe(0);
    });
  });

  describe('action', () => {
    it('should show action button when provided', () => {
      const actionFn = vi.fn();
      component.action.set({ label: 'Undo', onClick: actionFn });
      fixture.detectChanges();
      expect(toastEl.textContent).toContain('Undo');
    });

    it('should call action onClick', () => {
      const actionFn = vi.fn();
      component.action.set({ label: 'Undo', onClick: actionFn });
      fixture.detectChanges();
      const actionBtn = Array.from(toastEl.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Undo')
      );
      actionBtn?.click();
      expect(actionFn).toHaveBeenCalled();
    });
  });

  it('should have proper styling', () => {
    expect(toastEl.querySelector('[class*="rounded-xl"]')).toBeTruthy();
    expect(toastEl.querySelector('[class*="shadow-lg"]')).toBeTruthy();
  });
});

describe('TwToastContainerComponent', () => {
  let fixture: ComponentFixture<TwToastContainerComponent>;
  let component: TwToastContainerComponent;
  let service: TwToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwToastContainerComponent],
      providers: [TwToastService],
    }).compileComponents();

    service = TestBed.inject(TwToastService);
    fixture = TestBed.createComponent(TwToastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the container', () => {
    expect(component).toBeTruthy();
  });

  it('should render toasts from service', () => {
    service.show({ message: 'Toast 1' });
    service.show({ message: 'Toast 2' });
    fixture.detectChanges();

    const toasts = fixture.debugElement.queryAll(By.directive(TwToastComponent));
    expect(toasts.length).toBe(2);
  });

  describe('position classes', () => {
    it('should apply top-right position by default', () => {
      const container = fixture.debugElement.query(By.css('[class*="fixed"]'));
      expect(container.nativeElement.className).toContain('top-4');
      expect(container.nativeElement.className).toContain('right-4');
    });

    it('should apply bottom-center position', () => {
      service.setPosition('bottom-center');
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('[class*="fixed"]'));
      expect(container.nativeElement.className).toContain('bottom-4');
    });

    it('should apply top-left position', () => {
      service.setPosition('top-left');
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('[class*="fixed"]'));
      expect(container.nativeElement.className).toContain('top-4');
      expect(container.nativeElement.className).toContain('left-4');
    });
  });
});
