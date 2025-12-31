import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwChipComponent, TwChipsComponent, ChipVariant, ChipStyle, ChipSize } from './chip.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-chip
      [label]="label()"
      [variant]="variant()"
      [chipStyle]="chipStyle()"
      [size]="size()"
      [image]="image()"
      [imageAlt]="imageAlt()"
      [removable]="removable()"
      [disabled]="disabled()"
      [classOverride]="classOverride()"
      (onRemove)="onRemove()"
    ></tw-chip>
  `,
  standalone: true,
  imports: [TwChipComponent],
})
class TestHostComponent {
  @ViewChild(TwChipComponent) chip!: TwChipComponent;
  label = signal('Test Chip');
  variant = signal<ChipVariant>('primary');
  chipStyle = signal<ChipStyle>('soft');
  size = signal<ChipSize>('md');
  image = signal('');
  imageAlt = signal('');
  removable = signal(false);
  disabled = signal(false);
  classOverride = signal('');

  removeCount = 0;

  onRemove() {
    this.removeCount++;
  }
}

@Component({
  template: `
    <tw-chips
      [values]="values()"
      [variant]="variant()"
      [chipStyle]="chipStyle()"
      [size]="size()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [allowAdd]="allowAdd()"
      (valuesChange)="onValuesChange($event)"
      (onAdd)="onChipAdd($event)"
      (onRemove)="onChipRemove($event)"
    ></tw-chips>
  `,
  standalone: true,
  imports: [TwChipsComponent],
})
class ChipsTestComponent {
  @ViewChild(TwChipsComponent) chips!: TwChipsComponent;
  values = signal<string[]>(['Angular', 'TypeScript']);
  variant = signal<ChipVariant>('primary');
  chipStyle = signal<ChipStyle>('soft');
  size = signal<ChipSize>('md');
  placeholder = signal('Add tag...');
  disabled = signal(false);
  allowAdd = signal(true);

  valuesChangeEvent: string[] = [];
  addEvent: any = null;
  removeEvent: any = null;

  onValuesChange(values: string[]) {
    this.valuesChangeEvent = values;
  }
  onChipAdd(value: any) {
    this.addEvent = value;
  }
  onChipRemove(event: { value: any; index: number }) {
    this.removeEvent = event;
  }
}

describe('TwChipComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let chipEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chipEl = fixture.debugElement.query(By.directive(TwChipComponent)).nativeElement;
  });

  function getInnerSpan(): HTMLElement {
    return chipEl.querySelector('span') as HTMLElement;
  }

  it('should create the chip', () => {
    expect(chipEl).toBeTruthy();
    expect(component.chip).toBeTruthy();
  });

  it('should render label text', () => {
    expect(chipEl.textContent).toContain('Test Chip');
  });

  describe('variants', () => {
    describe('soft style', () => {
      it('should apply primary variant', () => {
        expect(getInnerSpan().className).toContain('bg-blue-100');
      });

      it('should apply success variant', () => {
        component.variant.set('success');
        fixture.detectChanges();
        expect(getInnerSpan().className).toContain('bg-emerald-100');
      });

      it('should apply warning variant', () => {
        component.variant.set('warning');
        fixture.detectChanges();
        expect(getInnerSpan().className).toContain('bg-amber-100');
      });

      it('should apply danger variant', () => {
        component.variant.set('danger');
        fixture.detectChanges();
        expect(getInnerSpan().className).toContain('bg-rose-100');
      });

      it('should apply info variant', () => {
        component.variant.set('info');
        fixture.detectChanges();
        expect(getInnerSpan().className).toContain('bg-cyan-100');
      });
    });

    describe('solid style', () => {
      beforeEach(() => {
        component.chipStyle.set('solid');
        fixture.detectChanges();
      });

      it('should apply primary solid variant', () => {
        expect(getInnerSpan().className).toContain('bg-blue-600');
        expect(getInnerSpan().className).toContain('text-white');
      });

      it('should apply success solid variant', () => {
        component.variant.set('success');
        fixture.detectChanges();
        expect(getInnerSpan().className).toContain('bg-emerald-600');
      });
    });

    describe('outline style', () => {
      beforeEach(() => {
        component.chipStyle.set('outline');
        fixture.detectChanges();
      });

      it('should apply primary outline variant', () => {
        expect(getInnerSpan().className).toContain('border');
        expect(getInnerSpan().className).toContain('border-blue-600');
      });
    });
  });

  describe('sizes', () => {
    it('should apply sm size', () => {
      component.size.set('sm');
      fixture.detectChanges();
      expect(getInnerSpan().className).toContain('px-2');
      expect(getInnerSpan().className).toContain('text-xs');
    });

    it('should apply md size by default', () => {
      expect(getInnerSpan().className).toContain('px-3');
      expect(getInnerSpan().className).toContain('text-sm');
    });

    it('should apply lg size', () => {
      component.size.set('lg');
      fixture.detectChanges();
      expect(getInnerSpan().className).toContain('px-4');
      expect(getInnerSpan().className).toContain('text-base');
    });
  });

  describe('image', () => {
    it('should render image when provided', () => {
      component.image.set('https://example.com/avatar.jpg');
      component.imageAlt.set('User');
      fixture.detectChanges();
      const img = chipEl.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.src).toContain('example.com/avatar.jpg');
    });

    it('should not render image when not provided', () => {
      const img = chipEl.querySelector('img');
      expect(img).toBeNull();
    });
  });

  describe('removable', () => {
    it('should not show remove button by default', () => {
      const removeBtn = chipEl.querySelector('button');
      expect(removeBtn).toBeNull();
    });

    it('should show remove button when removable', () => {
      component.removable.set(true);
      fixture.detectChanges();
      const removeBtn = chipEl.querySelector('button');
      expect(removeBtn).toBeTruthy();
    });

    it('should emit onRemove when remove button clicked', () => {
      component.removable.set(true);
      fixture.detectChanges();
      const removeBtn = chipEl.querySelector('button') as HTMLButtonElement;
      removeBtn.click();
      expect(component.removeCount).toBe(1);
    });

    it('should not show remove button when disabled', () => {
      component.removable.set(true);
      component.disabled.set(true);
      fixture.detectChanges();
      const removeBtn = chipEl.querySelector('button');
      // When disabled, the remove button should not be rendered
      expect(removeBtn).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('should apply disabled styling', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      expect(getInnerSpan().className).toContain('opacity-50');
      expect(getInnerSpan().className).toContain('cursor-not-allowed');
    });
  });

  describe('class customization', () => {
    it('should apply classOverride', () => {
      component.classOverride.set('custom-chip-class');
      fixture.detectChanges();
      expect(getInnerSpan().className).toContain('custom-chip-class');
    });
  });

  it('should have rounded-full class', () => {
    expect(getInnerSpan().className).toContain('rounded-full');
  });
});

describe('TwChipsComponent', () => {
  let fixture: ComponentFixture<ChipsTestComponent>;
  let component: ChipsTestComponent;
  let chipsEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsTestComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chipsEl = fixture.debugElement.query(By.directive(TwChipsComponent)).nativeElement;
  });

  it('should create the chips component', () => {
    expect(chipsEl).toBeTruthy();
    expect(component.chips).toBeTruthy();
  });

  it('should render existing chips', () => {
    const chips = fixture.debugElement.queryAll(By.directive(TwChipComponent));
    expect(chips.length).toBe(2);
    expect(chipsEl.textContent).toContain('Angular');
    expect(chipsEl.textContent).toContain('TypeScript');
  });

  it('should render input for adding chips', () => {
    const input = chipsEl.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.placeholder).toBe('Add tag...');
  });

  it('should not render input when allowAdd is false', () => {
    component.allowAdd.set(false);
    fixture.detectChanges();
    const input = chipsEl.querySelector('input');
    expect(input).toBeNull();
  });

  it('should not render input when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    const input = chipsEl.querySelector('input');
    expect(input).toBeNull();
  });

  describe('removing chips', () => {
    it('should remove chip when remove button clicked', () => {
      const removeButtons = chipsEl.querySelectorAll('tw-chip button');
      (removeButtons[0] as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(component.removeEvent).toEqual({ value: 'Angular', index: 0 });
      expect(component.valuesChangeEvent).toEqual(['TypeScript']);
    });
  });

  describe('disabled state', () => {
    it('should apply disabled styling', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      expect(chipsEl.querySelector('div')?.className).toContain('opacity-50');
    });
  });
});
