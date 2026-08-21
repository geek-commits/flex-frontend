import { describe, expect, it } from 'vitest';
import { cn, toUrl } from './utils';

describe('cn', () => {
    it('merges tailwind classes', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('handles conditional classes', () => {
        expect(cn('a', false && 'b', 'c')).toBe('a c');
    });
});

describe('toUrl', () => {
    it('returns string url as-is', () => {
        expect(toUrl('/dashboard')).toBe('/dashboard');
    });

    it('extracts url from object', () => {
        expect(toUrl({ url: '/agent', method: 'get' } as unknown as string)).toBe('/agent');
    });
});
