import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CardVariant,
  TwCardBodyDirective,
  TwCardComponent,
  TwCardFooterDirective,
  TwCardHeaderDirective,
  TwCardHorizontalComponent,
  TwCardMediaDirective,
  TwCardSubtitleDirective,
  TwCardTitleDirective,
} from './card.component';
import { TwClassService } from '../core/tw-class.service';

@Component({
  template: `
    <tw-card
      [variant]="variant()"
      [hoverable]="hoverable()"
      [clickable]="clickable()"
      [padded]="padded()"
      [classOverride]="classOverride()"
      [classReplace]="classReplace()"
      (click)="onCardClick()"
      data-testid="test-card"
    >
      <tw-card-body>Card content</tw-card-body>
    </tw-card>
  `,
  standalone: true,
  imports: [TwCardComponent, TwCardBodyDirective],
})
class TestHostComponent {
  @ViewChild(TwCardComponent) card!: TwCardComponent;
  variant = signal<CardVariant>('elevated');
  hoverable = signal(false);
  clickable = signal(false);
  padded = signal(false);
  classOverride = signal('');
  classReplace = signal('');
  clickCount = 0;

  onCardClick(): void {
    this.clickCount++;
  }
}

describe('TwCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let cardEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    cardEl = fixture.debugElement.query(By.directive(TwCardComponent)).nativeElement;
  });

  it('should create the card', () => {
    expect(cardEl).toBeTruthy();
    expect(component.card).toBeTruthy();
  });

  it('should have role="article"', () => {
    expect(cardEl.getAttribute('role')).toBe('article');
  });

  describe('variants', () => {
    it('should apply default elevated variant classes', () => {
      const classes = cardEl.className;
      expect(classes).toContain('shadow-md');
    });

    it('should update classes when variant changes', () => {
      component.variant.set('outlined');
      fixture.detectChanges();
      expect(cardEl.className).toContain('border-slate-200');
      expect(cardEl.className).not.toContain('shadow-md');

      component.variant.set('filled');
      fixture.detectChanges();
      expect(cardEl.className).toContain('bg-slate-50');

      component.variant.set('ghost');
      fixture.detectChanges();
      expect(cardEl.className).toContain('bg-transparent');
    });
  });

  describe('hoverable', () => {
    it('should apply hover classes when hoverable', () => {
      expect(cardEl.className).not.toContain('hover:-translate-y-0.5');

      component.hoverable.set(true);
      fixture.detectChanges();

      expect(cardEl.className).toContain('hover:-translate-y-0.5');
    });
  });

  describe('clickable', () => {
    it('should not set tabindex by default', () => {
      expect(cardEl.getAttribute('tabindex')).toBeNull();
    });

    it('should set tabindex and cursor classes when clickable', () => {
      component.clickable.set(true);
      fixture.detectChanges();

      expect(cardEl.getAttribute('tabindex')).toBe('0');
      expect(cardEl.className).toContain('cursor-pointer');
    });

    it('should use role="button" when clickable', () => {
      component.clickable.set(true);
      fixture.detectChanges();

      expect(cardEl.getAttribute('role')).toBe('button');
    });

    it('should dispatch click on Enter and Space when clickable', () => {
      component.clickable.set(true);
      fixture.detectChanges();

      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();
      expect(component.clickCount).toBe(1);

      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(component.clickCount).toBe(2);
    });

    it('should not dispatch click on Enter when not clickable', () => {
      cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(component.clickCount).toBe(0);
    });
  });

  describe('padded', () => {
    it('should apply padding when padded', () => {
      expect(cardEl.className).not.toContain('p-6');

      component.padded.set(true);
      fixture.detectChanges();

      expect(cardEl.className).toContain('p-6');
    });
  });

  describe('class customization', () => {
    it('should merge classOverride into host classes', () => {
      component.classOverride.set('custom-override');
      fixture.detectChanges();

      expect(cardEl.className).toContain('custom-override');
      expect(cardEl.className).toContain('rounded-xl');
    });

    it('should replace all classes with classReplace', () => {
      component.classReplace.set('only-this-class');
      fixture.detectChanges();

      expect(cardEl.className).toBe('only-this-class');
    });
  });
});

@Component({
  template: `
    <tw-card>
      <tw-card-header [class]="headerClass()">
        <tw-card-title [class]="titleClass()">Title</tw-card-title>
        <tw-card-subtitle [class]="subtitleClass()">Subtitle</tw-card-subtitle>
      </tw-card-header>
      <tw-card-body [class]="bodyClass()">Body content</tw-card-body>
      <tw-card-footer [class]="footerClass()">Footer</tw-card-footer>
    </tw-card>
  `,
  standalone: true,
  imports: [
    TwCardComponent,
    TwCardHeaderDirective,
    TwCardTitleDirective,
    TwCardSubtitleDirective,
    TwCardBodyDirective,
    TwCardFooterDirective,
  ],
})
class CardWithSectionsComponent {
  headerClass = signal('');
  titleClass = signal('');
  subtitleClass = signal('');
  bodyClass = signal('');
  footerClass = signal('');
}

describe('Card section directives', () => {
  let fixture: ComponentFixture<CardWithSectionsComponent>;
  let component: CardWithSectionsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithSectionsComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(CardWithSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('TwCardHeaderDirective', () => {
    it('should apply header classes', () => {
      const header = fixture.debugElement.query(By.directive(TwCardHeaderDirective)).nativeElement;
      expect(header.className).toContain('block');
    });

    it('should merge custom class', () => {
      component.headerClass.set('custom-header');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.directive(TwCardHeaderDirective)).nativeElement;
      expect(header.className).toContain('custom-header');
    });
  });

  describe('TwCardTitleDirective', () => {
    it('should apply title classes', () => {
      const title = fixture.debugElement.query(By.directive(TwCardTitleDirective)).nativeElement;
      expect(title.className).toContain('text-lg');
      expect(title.className).toContain('font-semibold');
    });

    it('should merge custom class', () => {
      component.titleClass.set('custom-title');
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.directive(TwCardTitleDirective)).nativeElement;
      expect(title.className).toContain('custom-title');
    });
  });

  describe('TwCardSubtitleDirective', () => {
    it('should apply subtitle classes', () => {
      const subtitle = fixture.debugElement.query(
        By.directive(TwCardSubtitleDirective)
      ).nativeElement;
      expect(subtitle.className).toContain('text-sm');
    });
  });

  describe('TwCardBodyDirective', () => {
    it('should apply body classes', () => {
      const body = fixture.debugElement.query(By.directive(TwCardBodyDirective)).nativeElement;
      expect(body.className).toContain('block');
    });
  });

  describe('TwCardFooterDirective', () => {
    it('should apply footer classes', () => {
      const footer = fixture.debugElement.query(By.directive(TwCardFooterDirective)).nativeElement;
      expect(footer.className).toContain('block');
      expect(footer.className).toContain('rounded-b-xl');
    });
  });
});

@Component({
  template: `
    <tw-card>
      <tw-card-media [position]="position()" [class]="mediaClass()">
        <img src="test.jpg" alt="Test" />
      </tw-card-media>
      <tw-card-body>Content</tw-card-body>
    </tw-card>
  `,
  standalone: true,
  imports: [TwCardComponent, TwCardMediaDirective, TwCardBodyDirective],
})
class CardWithMediaComponent {
  position = signal<'top' | 'bottom' | 'full'>('top');
  mediaClass = signal('');
}

describe('TwCardMediaDirective', () => {
  let fixture: ComponentFixture<CardWithMediaComponent>;
  let component: CardWithMediaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithMediaComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(CardWithMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply top position classes by default', () => {
    const media = fixture.debugElement.query(By.directive(TwCardMediaDirective)).nativeElement;
    expect(media.className).toContain('rounded-t-xl');
  });

  it('should update classes when position changes', () => {
    component.position.set('bottom');
    fixture.detectChanges();

    const media = fixture.debugElement.query(By.directive(TwCardMediaDirective)).nativeElement;
    expect(media.className).toContain('rounded-b-xl');
  });
});

@Component({
  template: `
    <tw-card-horizontal [variant]="variant()" [classOverride]="classOverride()">
      <tw-card-body>Content</tw-card-body>
    </tw-card-horizontal>
  `,
  standalone: true,
  imports: [TwCardHorizontalComponent, TwCardBodyDirective],
})
class HorizontalCardComponent {
  variant = signal<CardVariant>('elevated');
  classOverride = signal('');
}

describe('TwCardHorizontalComponent', () => {
  let fixture: ComponentFixture<HorizontalCardComponent>;
  let component: HorizontalCardComponent;
  let cardEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalCardComponent],
      providers: [TwClassService],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    cardEl = fixture.debugElement.query(By.directive(TwCardHorizontalComponent)).nativeElement;
  });

  it('should create horizontal card', () => {
    expect(cardEl).toBeTruthy();
  });

  it('should have flex layout', () => {
    expect(cardEl.className).toContain('flex');
  });

  it('should update classes when variant changes', () => {
    expect(cardEl.className).toContain('shadow-md');

    component.variant.set('outlined');
    fixture.detectChanges();

    expect(cardEl.className).toContain('border-slate-200');
    expect(cardEl.className).not.toContain('shadow-md');
  });

  it('should merge classOverride', () => {
    component.classOverride.set('custom-horizontal');
    fixture.detectChanges();

    expect(cardEl.className).toContain('custom-horizontal');
  });
});
