/**
 * Vitest setup file for @pegasus-heavy/ngx-tailwindcss
 *
 * Initializes Angular testing environment and provides browser API mocks.
 */

import '@testing-library/jest-dom/vitest';
import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);

// Mock requestAnimationFrame for tests
if (typeof window !== 'undefined') {
  window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    return window.setTimeout(callback, 0);
  };
  window.cancelAnimationFrame = (id: number): void => {
    window.clearTimeout(id);
  };
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  window.ResizeObserver = ResizeObserver;
}
