import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TwClassService } from './tw-class.service';
import { TW_CONFIG } from './tw-config';
import { provideTwConfig } from './provide-tw-config';

describe('TwClassService', () => {
  describe('without custom config', () => {
    let service: TwClassService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [TwClassService],
      });
      service = TestBed.inject(TwClassService);
    });

    describe('merge()', () => {
      it('should merge multiple class strings', () => {
        const result = service.merge('p-4', 'm-2', 'text-white');
        expect(result).toContain('p-4');
        expect(result).toContain('m-2');
        expect(result).toContain('text-white');
      });

      it('should handle undefined and null values', () => {
        const result = service.merge('p-4', undefined, null, 'm-2');
        expect(result).toBe('p-4 m-2');
      });

      it('should handle false values', () => {
        const result = service.merge('p-4', false, 'm-2');
        expect(result).toBe('p-4 m-2');
      });

      it('should handle empty strings', () => {
        const result = service.merge('p-4', '', 'm-2');
        expect(result).toContain('p-4');
        expect(result).toContain('m-2');
      });

      it('should resolve padding conflicts (later wins)', () => {
        const result = service.merge('p-4', 'p-8');
        expect(result).toBe('p-8');
      });

      it('should resolve margin conflicts', () => {
        const result = service.merge('m-2', 'm-4');
        expect(result).toBe('m-4');
      });

      it('should resolve background color conflicts', () => {
        const result = service.merge('bg-blue-500', 'bg-red-500');
        expect(result).toBe('bg-red-500');
      });

      it('should resolve text color conflicts', () => {
        const result = service.merge('text-white', 'text-black');
        expect(result).toBe('text-black');
      });

      it('should resolve font size conflicts', () => {
        const result = service.merge('text-sm', 'text-lg');
        expect(result).toBe('text-lg');
      });

      it('should resolve display conflicts', () => {
        const result = service.merge('block', 'flex');
        expect(result).toBe('flex');
      });

      it('should resolve position conflicts', () => {
        const result = service.merge('relative', 'absolute');
        expect(result).toBe('absolute');
      });

      it('should resolve width conflicts', () => {
        const result = service.merge('w-full', 'w-1/2');
        expect(result).toBe('w-1/2');
      });

      it('should resolve height conflicts', () => {
        const result = service.merge('h-10', 'h-20');
        expect(result).toBe('h-20');
      });

      it('should resolve border radius conflicts', () => {
        const result = service.merge('rounded', 'rounded-lg');
        expect(result).toBe('rounded-lg');
      });

      it('should resolve shadow conflicts', () => {
        const result = service.merge('shadow', 'shadow-lg');
        expect(result).toBe('shadow-lg');
      });

      it('should handle responsive prefixes separately', () => {
        const result = service.merge('p-4', 'md:p-4', 'md:p-8');
        expect(result).toContain('p-4');
        expect(result).toContain('md:p-8');
        expect(result).not.toContain('md:p-4');
      });

      it('should handle hover prefixes separately', () => {
        const result = service.merge('bg-blue-500', 'hover:bg-blue-500', 'hover:bg-red-500');
        expect(result).toContain('bg-blue-500');
        expect(result).toContain('hover:bg-red-500');
      });

      it('should handle complex prefix combinations', () => {
        const result = service.merge('md:hover:bg-blue-500', 'md:hover:bg-red-500');
        expect(result).toBe('md:hover:bg-red-500');
      });

      it('should preserve non-conflicting classes', () => {
        const result = service.merge('p-4 m-2 text-white bg-blue-500');
        expect(result).toContain('p-4');
        expect(result).toContain('m-2');
        expect(result).toContain('text-white');
        expect(result).toContain('bg-blue-500');
      });

      it('should handle flex properties', () => {
        const result = service.merge('flex-row', 'flex-col');
        expect(result).toBe('flex-col');
      });

      it('should handle justify content', () => {
        const result = service.merge('justify-start', 'justify-center');
        expect(result).toBe('justify-center');
      });

      it('should handle items alignment', () => {
        const result = service.merge('items-start', 'items-center');
        expect(result).toBe('items-center');
      });

      it('should handle z-index', () => {
        const result = service.merge('z-10', 'z-50');
        expect(result).toBe('z-50');
      });

      it('should handle overflow', () => {
        const result = service.merge('overflow-hidden', 'overflow-auto');
        expect(result).toBe('overflow-auto');
      });

      it('should handle visibility', () => {
        const result = service.merge('visible', 'invisible');
        expect(result).toBe('invisible');
      });

      it('should handle opacity', () => {
        const result = service.merge('opacity-50', 'opacity-100');
        expect(result).toBe('opacity-100');
      });

      it('should handle transition', () => {
        const result = service.merge('transition', 'transition-all');
        expect(result).toBe('transition-all');
      });

      it('should handle duration', () => {
        const result = service.merge('duration-150', 'duration-300');
        expect(result).toBe('duration-300');
      });

      it('should handle cursor', () => {
        const result = service.merge('cursor-pointer', 'cursor-wait');
        expect(result).toBe('cursor-wait');
      });

      it('should handle font weight', () => {
        const result = service.merge('font-normal', 'font-bold');
        expect(result).toBe('font-bold');
      });

      it('should handle text alignment', () => {
        const result = service.merge('text-left', 'text-center');
        expect(result).toBe('text-center');
      });

      it('should handle text transform', () => {
        const result = service.merge('uppercase', 'lowercase');
        expect(result).toBe('lowercase');
      });

      it('should handle text decoration', () => {
        const result = service.merge('underline', 'no-underline');
        expect(result).toBe('no-underline');
      });

      it('should handle whitespace', () => {
        const result = service.merge('whitespace-normal', 'whitespace-nowrap');
        expect(result).toBe('whitespace-nowrap');
      });

      it('should handle gap', () => {
        const result = service.merge('gap-2', 'gap-4');
        expect(result).toBe('gap-4');
      });

      it('should handle grid columns', () => {
        const result = service.merge('grid-cols-2', 'grid-cols-4');
        expect(result).toBe('grid-cols-4');
      });

      it('should handle ring', () => {
        const result = service.merge('ring-1', 'ring-2');
        expect(result).toBe('ring-2');
      });

      it('should handle gradient from', () => {
        const result = service.merge('from-blue-500', 'from-red-500');
        expect(result).toBe('from-red-500');
      });

      it('should handle scale transform', () => {
        const result = service.merge('scale-100', 'scale-105');
        expect(result).toBe('scale-105');
      });

      it('should handle rotate transform', () => {
        const result = service.merge('rotate-0', 'rotate-45');
        expect(result).toBe('rotate-45');
      });

      it('should handle min/max width', () => {
        const resultMin = service.merge('min-w-0', 'min-w-full');
        expect(resultMin).toBe('min-w-full');

        const resultMax = service.merge('max-w-sm', 'max-w-lg');
        expect(resultMax).toBe('max-w-lg');
      });

      it('should handle min/max height', () => {
        const resultMin = service.merge('min-h-0', 'min-h-screen');
        expect(resultMin).toBe('min-h-screen');

        const resultMax = service.merge('max-h-32', 'max-h-64');
        expect(resultMax).toBe('max-h-64');
      });

      it('should handle leading (line-height)', () => {
        const result = service.merge('leading-none', 'leading-relaxed');
        expect(result).toBe('leading-relaxed');
      });

      it('should handle tracking (letter-spacing)', () => {
        const result = service.merge('tracking-tight', 'tracking-wide');
        expect(result).toBe('tracking-wide');
      });

      it('should keep unrecognized classes as unique', () => {
        const result = service.merge('custom-class', 'another-custom');
        expect(result).toContain('custom-class');
        expect(result).toContain('another-custom');
      });
    });

    describe('conditional()', () => {
      it('should apply classes based on true conditions', () => {
        const result = service.conditional('base-class', {
          'active-class': true,
          'inactive-class': false,
        });
        expect(result).toContain('base-class');
        expect(result).toContain('active-class');
        expect(result).not.toContain('inactive-class');
      });

      it('should handle all false conditions', () => {
        const result = service.conditional('base-class', {
          'class-a': false,
          'class-b': false,
        });
        expect(result).toBe('base-class');
      });

      it('should handle all true conditions', () => {
        const result = service.conditional('base-class', {
          'class-a': true,
          'class-b': true,
        });
        expect(result).toContain('base-class');
        expect(result).toContain('class-a');
        expect(result).toContain('class-b');
      });

      it('should handle undefined conditions as false', () => {
        const result = service.conditional('base-class', {
          'class-a': undefined,
          'class-b': true,
        });
        expect(result).toContain('base-class');
        expect(result).toContain('class-b');
        expect(result).not.toContain('class-a');
      });

      it('should merge conditional classes with conflict resolution', () => {
        const result = service.conditional('p-4', {
          'p-8': true,
        });
        expect(result).toBe('p-8');
      });
    });

    describe('join()', () => {
      it('should join multiple class strings', () => {
        const result = service.join('p-4', 'm-2', 'text-white');
        expect(result).toBe('p-4 m-2 text-white');
      });

      it('should filter out falsy values', () => {
        const result = service.join('p-4', undefined, null, false, 'm-2');
        expect(result).toBe('p-4 m-2');
      });

      it('should return empty string for all falsy values', () => {
        const result = service.join(undefined, null, false);
        expect(result).toBe('');
      });
    });

    describe('getVariantClasses()', () => {
      it('should return empty string for unknown variant', () => {
        const result = service.getVariantClasses('unknown');
        expect(result).toBe('');
      });

      it('should return default variant classes for primary', () => {
        // Default config has theme defined
        const result = service.getVariantClasses('primary');
        expect(result).toContain('bg-blue-600');
      });
    });
  });

  describe('with custom config', () => {
    let service: TwClassService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideTwConfig({
            theme: {
              primary: 'bg-purple-600 text-white',
              secondary: 'bg-gray-200 text-gray-800',
            },
          }),
          TwClassService,
        ],
      });
      service = TestBed.inject(TwClassService);
    });

    it('should return configured variant classes', () => {
      const result = service.getVariantClasses('primary');
      expect(result).toBe('bg-purple-600 text-white');
    });

    it('should return secondary variant classes', () => {
      const result = service.getVariantClasses('secondary');
      expect(result).toBe('bg-gray-200 text-gray-800');
    });

    it('should return empty string for unconfigured variant', () => {
      const result = service.getVariantClasses('tertiary');
      expect(result).toBe('');
    });
  });
});
