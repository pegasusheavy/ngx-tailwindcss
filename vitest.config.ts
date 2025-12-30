/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

/**
 * Vitest configuration for @pegasus-heavy/ngx-tailwindcss
 *
 * Note: Using standalone Vitest for library testing as the official
 * @angular/build:unit-test builder is designed for application projects.
 *
 * @see https://angular.dev/guide/testing/migrating-to-vitest
 */
export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.spec.json',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['projects/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['projects/ngx-tailwindcss/src/**/*.ts'],
      exclude: [
        '**/*.spec.ts',
        '**/index.ts',
        '**/public-api.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        // Target: 90% coverage
        // Current: ~58% - incrementally increasing
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
    reporters: ['default'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  define: {
    ngDevMode: true,
  },
});
