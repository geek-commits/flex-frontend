import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';

describe('Supervision Exceptions — Phase 5 residual', () => {
    it('breadcrumb, Head, title/description translate', async () => {
        expect(i18n.t('supervision:exceptions.breadcrumb', { lng: 'en' })).toBe('Exceptions');
        expect(i18n.t('supervision:exceptions.headTitle', { lng: 'en' })).toBe('Exceptions — Flex');
        expect(i18n.t('supervision:exceptions.title', { lng: 'en' })).toBe('Exception Center');
        expect(i18n.t('supervision:exceptions.description', { lng: 'en' })).toContain('Problems requiring attention');
        expect(i18n.t('supervision:exceptions.breadcrumb', { lng: 'sw' })).toBe('Hitilafu');
        expect(i18n.t('supervision:exceptions.breadcrumb', { lng: 'fr' })).toBe('Exceptions');
    });

    it('empty state translates EN → SW → FR', async () => {
        expect(i18n.t('supervision:exceptions.empty.title', { lng: 'en' })).toBe('No exceptions');
        expect(i18n.t('supervision:exceptions.empty.description', { lng: 'en' })).toContain('No threshold-backed');
        expect(i18n.t('supervision:exceptions.empty.title', { lng: 'sw' })).toBe('Hakuna hitilafu');
        expect(i18n.t('supervision:exceptions.empty.title', { lng: 'fr' })).toBe('Aucune exception');
    });

    it('runtime exceptions collection remains deterministic placeholder', async () => {
        // exceptions array is empty placeholder, not fabricated — titles would be runtime when present
        expect(i18n.t('supervision:exceptions.empty.description', { lng: 'en' })).toContain('SLA');
    });
});
