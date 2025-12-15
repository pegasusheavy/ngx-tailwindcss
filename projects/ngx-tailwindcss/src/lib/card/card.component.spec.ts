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

    it('should have variant input', () => {
      expect(component.variant()).toBe('elevated');
    });
  });

  describe('hoverable', () => {
    it('should have hoverable input', () => {
      expect(component.hoverable()).toBe(false);
    });
  });

  describe('clickable', () => {
    it('should have clickable input', () => {
      expect(component.clickable()).toBe(false);
    });

    it('should not set tabindex by default', () => {
      expect(cardEl.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('padded', () => {
    it('should have padded input', () => {
      expect(component.padded()).toBe(false);
    });
  });

  describe('class customization', () => {
    it('should have classOverride input', () => {
      expect(component.classOverride()).toBe('');
    });

    it('should have classReplace input', () => {
      expect(component.classReplace()).toBe('');
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

  it('should have position input', () => {
    expect(component.position()).toBe('top');
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

  it('should have variant input', () => {
    expect(component.variant()).toBe('elevated');
  });
});
