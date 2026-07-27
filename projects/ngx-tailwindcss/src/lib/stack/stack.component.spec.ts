import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  StackAlign,
  StackDirection,
  StackJustify,
  StackSpacing,
  TwHStackComponent,
  TwStackComponent,
  TwVStackComponent,
} from './stack.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-stack
      [direction]="direction()"
      [spacing]="spacing()"
      [align]="align()"
      [justify]="justify()"
      [wrap]="wrap()"
      [fullWidth]="fullWidth()"
      [class]="classInput()"
    >
      <div>Item 1</div>
      <div>Item 2</div>
    </tw-stack>
  `,
  standalone: true,
  imports: [TwStackComponent],
})
class TestHostComponent {
  direction = signal<StackDirection>('vertical');
  spacing = signal<StackSpacing>('md');
  align = signal<StackAlign>('stretch');
  justify = signal<StackJustify>('start');
  wrap = signal(false);
  fullWidth = signal(false);
  classInput = signal('');
}

describe('TwStackComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  const stackDiv = (): HTMLElement =>
    fixture.debugElement.query(By.css('tw-stack div')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(stackDiv().textContent).toContain('Item 1');
    expect(stackDiv().textContent).toContain('Item 2');
  });

  it('should output vertical flex classes by default', () => {
    const { className } = stackDiv();
    expect(className).toContain('flex');
    expect(className).toContain('flex-col');
    expect(className).toContain('gap-4');
    expect(className).toContain('items-stretch');
    expect(className).toContain('justify-start');
  });

  it('should react to direction changes', () => {
    component.direction.set('horizontal-reverse');
    fixture.detectChanges();
    expect(stackDiv().className).toContain('flex-row-reverse');
  });

  it('should map spacing, align and justify to classes', () => {
    component.spacing.set('xl');
    component.align.set('center');
    component.justify.set('between');
    fixture.detectChanges();

    const { className } = stackDiv();
    expect(className).toContain('gap-8');
    expect(className).toContain('items-center');
    expect(className).toContain('justify-between');
  });

  it('should apply wrap and fullWidth classes', () => {
    component.wrap.set(true);
    component.fullWidth.set(true);
    fixture.detectChanges();

    const { className } = stackDiv();
    expect(className).toContain('flex-wrap');
    expect(className).toContain('w-full');
  });

  it('should append custom classes', () => {
    component.classInput.set('custom-class');
    fixture.detectChanges();
    expect(stackDiv().className).toContain('custom-class');
  });
});

describe('TwVStackComponent', () => {
  it('should output vertical flex classes', async () => {
    @Component({
      template: `<tw-vstack spacing="sm"><div>Item</div></tw-vstack>`,
      standalone: true,
      imports: [TwVStackComponent],
    })
    class VStackHostComponent {}

    await TestBed.configureTestingModule({
      imports: [VStackHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    const fixture = TestBed.createComponent(VStackHostComponent);
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('tw-vstack div')).nativeElement as HTMLElement;
    expect(div.className).toContain('flex-col');
    expect(div.className).toContain('gap-2');
    expect(div.className).toContain('items-stretch');
  });
});

describe('TwHStackComponent', () => {
  it('should output horizontal flex classes with centered alignment', async () => {
    @Component({
      template: `<tw-hstack spacing="lg" [wrap]="true"><div>Item</div></tw-hstack>`,
      standalone: true,
      imports: [TwHStackComponent],
    })
    class HStackHostComponent {}

    await TestBed.configureTestingModule({
      imports: [HStackHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    const fixture = TestBed.createComponent(HStackHostComponent);
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('tw-hstack div')).nativeElement as HTMLElement;
    expect(div.className).toContain('flex-row');
    expect(div.className).toContain('gap-6');
    expect(div.className).toContain('items-center');
    expect(div.className).toContain('flex-wrap');
  });
});
