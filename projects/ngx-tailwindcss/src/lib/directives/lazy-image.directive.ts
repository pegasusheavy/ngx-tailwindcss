import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

export interface LazyImageEvent {
  loaded: boolean;
  src: string;
  error?: Error;
}

/**
 * Directive to lazy load images when they enter the viewport
 *
 * @example
 * ```html
 * <img twLazyImage="/image.jpg" [lazyPlaceholder]="'/placeholder.jpg'" (lazyLoaded)="onLoaded($event)" />
 * <img twLazyImage="/large-image.jpg" lazyLoadingClass="opacity-0" lazyLoadedClass="opacity-100 transition-opacity" />
 * ```
 */
@Directive({
  selector: 'img[twLazyImage]',
  standalone: true,
})
export class TwLazyImageDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLImageElement>;
  private readonly renderer: Renderer2;

  constructor() {
    this.el = inject(ElementRef);
    this.renderer = inject(Renderer2);
  }

  private observer: IntersectionObserver | null = null;
  private removeNativeListeners: () => void = () => {};

  /** The image source to lazy load */
  @Input({ required: true })
  twLazyImage = '';

  /** Placeholder image to show before loading */
  @Input()
  lazyPlaceholder = '';

  /** CSS class to add while loading */
  @Input()
  lazyLoadingClass = '';

  /** CSS class to add after loaded */
  @Input()
  lazyLoadedClass = '';

  /** Root margin for intersection observer */
  @Input()
  lazyRootMargin = '100px';

  /** Disable lazy loading (load immediately) */
  @Input({ transform: booleanAttribute })
  lazyDisabled = false;

  /** Use native loading="lazy" attribute */
  @Input({ transform: booleanAttribute })
  lazyNative = false;

  /** Emits when image loads or errors */
  @Output()
  lazyLoaded = new EventEmitter<LazyImageEvent>();

  ngOnInit(): void {
    const img = this.el.nativeElement;

    // Set placeholder if provided
    if (this.lazyPlaceholder) {
      this.renderer.setAttribute(img, 'src', this.lazyPlaceholder);
    }

    // Add loading class
    if (this.lazyLoadingClass) {
      for (const cls of this.lazyLoadingClass.split(' ')) {
        if (cls?.trim()) {
          this.renderer.addClass(img, cls);
        }
      }
    }

    // Use native lazy loading if requested; the browser defers the fetch itself
    if (this.lazyNative) {
      this.renderer.setAttribute(img, 'loading', 'lazy');
      this.loadImageNatively();
      return;
    }

    // Load immediately when lazy loading is disabled
    if (this.lazyDisabled) {
      this.loadImage();
      return;
    }

    // Use IntersectionObserver for lazy loading
    if (typeof IntersectionObserver === 'undefined') {
      this.loadImage();
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.observer?.disconnect();
            this.observer = null;
          }
        });
      },
      {
        rootMargin: this.lazyRootMargin,
      }
    );

    this.observer.observe(img);
  }

  private loadImage(): void {
    const img = this.el.nativeElement;

    // Create a new image to preload
    const tempImg = new Image();

    tempImg.addEventListener('load', () => {
      this.renderer.setAttribute(img, 'src', this.twLazyImage);
      this.applyLoadedClasses();
      this.lazyLoaded.emit({ loaded: true, src: this.twLazyImage });
    });

    tempImg.addEventListener('error', () => {
      this.lazyLoaded.emit({
        loaded: false,
        src: this.twLazyImage,
        error: new Error(`Failed to load image: ${this.twLazyImage}`),
      });
    });

    tempImg.src = this.twLazyImage;
  }

  private loadImageNatively(): void {
    const img = this.el.nativeElement;

    const onLoad = (): void => {
      this.removeNativeListeners();
      this.applyLoadedClasses();
      this.lazyLoaded.emit({ loaded: true, src: this.twLazyImage });
    };

    const onError = (): void => {
      this.removeNativeListeners();
      this.lazyLoaded.emit({
        loaded: false,
        src: this.twLazyImage,
        error: new Error(`Failed to load image: ${this.twLazyImage}`),
      });
    };

    this.removeNativeListeners = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      this.removeNativeListeners = () => {};
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    // Assign the source directly to the host image so the browser's
    // native lazy loading controls when the fetch happens
    this.renderer.setAttribute(img, 'src', this.twLazyImage);
  }

  private applyLoadedClasses(): void {
    const img = this.el.nativeElement;

    // Remove loading class, add loaded class
    if (this.lazyLoadingClass) {
      this.lazyLoadingClass.split(' ').forEach(cls => {
        if (cls) this.renderer.removeClass(img, cls);
      });
    }
    if (this.lazyLoadedClass) {
      this.lazyLoadedClass.split(' ').forEach(cls => {
        if (cls) this.renderer.addClass(img, cls);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.removeNativeListeners();
  }
}
