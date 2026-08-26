import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { formatCurrency, formatDate, formatDuration, formatNumber, formatPercent } from './formatters';
import { DEFAULT_LOCALE, LOCALE_CONFIG, SUPPORTED_LOCALES, isSupportedLocale } from './locale';

describe('i18n configuration and locale helpers', () => {
    it('supports en, sw, and fr locales', () => {
        expect(SUPPORTED_LOCALES).toEqual(['en', 'sw', 'fr']);
        expect(DEFAULT_LOCALE).toBe('en');
    });

    it('identifies supported locales correctly', () => {
        expect(isSupportedLocale('en')).toBe(true);
        expect(isSupportedLocale('sw')).toBe(true);
        expect(isSupportedLocale('fr')).toBe(true);
        expect(isSupportedLocale('de')).toBe(false);
        expect(isSupportedLocale(null)).toBe(false);
        expect(isSupportedLocale(undefined)).toBe(false);
    });

    it('provides valid metadata for each supported locale', () => {
        SUPPORTED_LOCALES.forEach((locale) => {
            const meta = LOCALE_CONFIG[locale];
            expect(meta).toBeDefined();
            expect(meta.code).toBe(locale);
            expect(meta.direction).toBe('ltr');
            expect(typeof meta.label).toBe('string');
            expect(typeof meta.formatLocale).toBe('string');
        });
    });

    it('translates common keys across namespaces in English', () => {
        expect(i18n.t('common:actions.save', { lng: 'en' })).toBe('Save');
        expect(i18n.t('common:actions.cancel', { lng: 'en' })).toBe('Cancel');
        expect(i18n.t('agent:status.ready', { lng: 'en' })).toBe('Ready');
        expect(i18n.t('navigation:domains.agent', { lng: 'en' })).toBe('Agent');
    });

    it('translates common keys in French and Swahili', () => {
        expect(i18n.t('common:actions.save', { lng: 'fr' })).toBe('Enregistrer');
        expect(i18n.t('agent:status.ready', { lng: 'fr' })).toBe('Prêt');

        expect(i18n.t('common:actions.save', { lng: 'sw' })).toBe('Hifadhi');
        expect(i18n.t('agent:status.ready', { lng: 'sw' })).toBe('Tayari');
    });
});

describe('i18n formatters', () => {
    it('formats duration into mm:ss and hh:mm:ss', () => {
        expect(formatDuration(0)).toBe('00:00');
        expect(formatDuration(65)).toBe('01:05');
        expect(formatDuration(3665)).toBe('01:01:05');
        expect(formatDuration(-10)).toBe('00:00');
        expect(formatDuration(NaN)).toBe('00:00');
    });

    it('formats numbers according to locale', () => {
        const value = 1234567.89;
        const formattedEn = formatNumber(value, 'en');
        const formattedFr = formatNumber(value, 'fr');

        expect(formattedEn).toContain('1,234,567');
        expect(formattedFr).toBeDefined();
    });

    it('formats percentage correctly', () => {
        expect(formatPercent(0.456, 'en')).toBe('45.6%');
    });

    it('formats currency correctly', () => {
        const formatted = formatCurrency(1500, 'USD', 'en');
        expect(formatted).toContain('1,500');
    });

    it('formats dates consistently', () => {
        const date = new Date('2026-08-25T12:00:00Z');
        const formatted = formatDate(date, 'en');
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
    });
});
