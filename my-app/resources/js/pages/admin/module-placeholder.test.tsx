import { describe, expect, it } from 'vitest';
import { MODULE_INDEX } from '@/domain/modules';
import i18n from '@/i18n';

describe('ModulePlaceholderPage — key-driven', () => {
    it('resolves module title/description from keys', async () => {
        await i18n.changeLanguage('en');
        const mod = MODULE_INDEX['/admin/cdr'];
        expect(mod).toBeDefined();
        expect(i18n.getFixedT('en', 'administration')(mod!.titleKey)).toBe('Call Records (CDR)');
        expect(i18n.getFixedT('en', 'administration')(mod!.descriptionKey)).toContain('Search, filter');
    });

    it('missing module uses translated fallback', async () => {
        await i18n.changeLanguage('en');
        expect(i18n.t('administration:placeholder.fallbackTitle', { lng: 'en' })).toBe('Module');
        expect(i18n.t('administration:placeholder.fallbackDescription', { lng: 'en' })).toBe('This module is not part of the current POC.');
        await i18n.changeLanguage('sw');
        expect(i18n.t('administration:placeholder.fallbackTitle', { lng: 'sw' })).toBe('Moduli');
        expect(i18n.t('administration:placeholder.fallbackDescription', { lng: 'sw' })).toBe('Moduli hii si sehemu ya POC ya sasa.');
        await i18n.changeLanguage('fr');
        expect(i18n.t('administration:placeholder.fallbackDescription', { lng: 'fr' })).toBe('Ce module ne fait pas partie du POC actuel.');
        await i18n.changeLanguage('en');
    });

    it('placeholder sentences react to language', async () => {
        await i18n.changeLanguage('en');
        expect(i18n.t('administration:placeholder.comingSoonDescription', { lng: 'en', title: 'Tenants & Multi-Org' })).toContain('Tenants & Multi-Org');
        await i18n.changeLanguage('sw');
        expect(i18n.t('administration:placeholder.comingSoonDescription', { lng: 'sw', title: 'Test' })).toContain('Test');
        await i18n.changeLanguage('fr');
        expect(i18n.t('administration:placeholder.noPermission', { lng: 'fr', title: 'Test' })).toContain('Test');
        await i18n.changeLanguage('en');
    });

    it('head title uses translated module title', async () => {
        await i18n.changeLanguage('en');
        const mod = MODULE_INDEX['/admin/cdr']!;
        const moduleTitle = i18n.getFixedT('en', 'administration')(mod.titleKey);
        const head = i18n.t('administration:placeholder.headTitle', { lng: 'en', title: moduleTitle });
        expect(head).toBe(`${moduleTitle} — Flex Contact Center`);
    });
});
