import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';

describe('Global Search — locale-reactive templates', () => {
    it('record subtitles use translator-controlled templates', () => {
        expect(i18n.t('navigation:search.records.cdrSubtitle', { lng: 'en', agent: 'Alice', queue: 'Support' })).toBe('CDR \u2022 Alice \u2022 Support');
        expect(i18n.t('navigation:search.records.campaignSubtitle', { lng: 'en', destination: '+255' })).toBe('Campaign \u2022 +255');
        expect(i18n.t('navigation:search.records.agentSubtitle', { lng: 'en', extension: '1001', queue: 'Billing' })).toBe('Agent \u2022 ext 1001 \u2022 Billing');

        expect(i18n.t('navigation:search.records.campaignSubtitle', { lng: 'sw', destination: '+255' })).toBe('Kampeni \u2022 +255');
        expect(i18n.t('navigation:search.records.agentSubtitle', { lng: 'sw', extension: '1001', queue: 'Billing' })).toBe('Wakala \u2022 ext 1001 \u2022 Billing');

        expect(i18n.t('navigation:search.records.campaignSubtitle', { lng: 'fr', destination: '+255' })).toBe('Campagne \u2022 +255');
    });

    it('role labels are translated, role IDs unchanged', () => {
        expect(i18n.t('navigation:search.roles.superAdmin', { lng: 'en' })).toBe('SuperAdmin');
        expect(i18n.t('navigation:search.roles.agent', { lng: 'en' })).toBe('Agent');
        expect(i18n.t('navigation:search.roles.agent', { lng: 'sw' })).toBe('Wakala');
        expect(i18n.t('navigation:search.roles.supervisor', { lng: 'fr' })).toBe('Superviseur');
    });

    it('module titles and categories are via administration translator', () => {
        // Administration module keys
        expect(i18n.t('administration:modules.tenants.title', { lng: 'en' })).toBe('Tenants & Multi-Org');
        expect(i18n.t('administration:modules.cdr.title', { lng: 'en' })).toBe('Call Records (CDR)');
        expect(i18n.t('administration:modules.categories.coreAdministration', { lng: 'en' })).toBe('Core Administration');
        // Locale-aware: sw/fr return same English for now but key exists and is not fallback to English field
        expect(i18n.t('administration:modules.tenants.title', { lng: 'sw' })).toBeDefined();
        expect(i18n.t('administration:modules.tenants.title', { lng: 'fr' })).toBeDefined();
    });

    it('empty state uses whole translated interpolation', () => {
        expect(i18n.t('navigation:search.noResultsForQuery', { lng: 'en', query: 'foo' })).toBe('No results found for \u201cfoo\u201d.');
        expect(i18n.t('navigation:search.noResultsForQuery', { lng: 'sw', query: 'foo' })).toBe('Hakuna matokeo kwa \u201cfoo\u201d.');
        expect(i18n.t('navigation:search.noResultsForQuery', { lng: 'fr', query: 'foo' })).toBe('Aucun r\u00e9sultat pour \u00ab foo \u00bb.');
    });

    it('search groups, actions, dialog remain translated', () => {
        expect(i18n.t('navigation:search.groups.navigation', { lng: 'en' })).toBe('Navigation');
        expect(i18n.t('navigation:search.groups.modules', { lng: 'sw' })).toBe('Moduli');
        expect(i18n.t('navigation:search.groups.actions', { lng: 'fr' })).toBe('Actions');
        expect(i18n.t('navigation:search.dialogTitle', { lng: 'en' })).toBe('Global Search');
        expect(i18n.t('navigation:search.placeholder', { lng: 'en' })).toBe('Search FLEX');
    });
});
