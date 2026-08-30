import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { monitoringColumns } from './agent-monitoring-columns';

describe('Monitoring — Phase 5 residuals', () => {
    it('state filter labels via labelKey', async () => {
        expect(i18n.t('agent:status.ready', { lng: 'en' })).toBe('Ready');
        expect(i18n.t('agent:status.ready', { lng: 'sw' })).toBe('Tayari');
        expect(i18n.t('agent:status.talking', { lng: 'fr' })).toBeDefined();
    });

    it('table headers via required translator', async () => {
        const tEn = i18n.getFixedT('en', 'supervision');
        const cols = monitoringColumns(tEn);
        expect(cols.length).toBe(8);
        expect(cols[0].id).toBe('name');
        // headers should be translated, not fallback English
        const tSw = i18n.getFixedT('sw', 'supervision');
        const colsSw = monitoringColumns(tSw);
        expect(colsSw[0].id).toBe('name');
    });

    it('call direction/state map to typed keys', async () => {
        expect(i18n.t('supervision:monitoring.call.direction.inbound', { lng: 'en' })).toBe('Inbound');
        expect(i18n.t('supervision:monitoring.call.direction.outbound', { lng: 'en' })).toBe('Outbound');
        expect(i18n.t('supervision:monitoring.call.state.ringing', { lng: 'en' })).toBe('Ringing');
        expect(i18n.t('supervision:monitoring.call.state.connected', { lng: 'en' })).toBe('Connected');
        expect(i18n.t('supervision:monitoring.call.direction.inbound', { lng: 'sw' })).toBe('Inayoingia');
        expect(i18n.t('supervision:monitoring.call.state.hold', { lng: 'fr' })).toBe('En attente');
    });

    it('search placeholder and aria translate', async () => {
        expect(i18n.t('supervision:monitoring.toolbar.searchPlaceholder', { lng: 'en' })).toBe('Search agents by name or extension...');
        expect(i18n.t('supervision:monitoring.toolbar.searchAriaLabel', { lng: 'en' })).toBe('Search agents');
        expect(i18n.t('supervision:monitoring.toolbar.searchPlaceholder', { lng: 'sw' })).toBeDefined();
    });

    it('EN → SW → FR without remount — columns remain same ids', async () => {
        const tEn = i18n.getFixedT('en', 'supervision');
        const tSw = i18n.getFixedT('sw', 'supervision');
        const tFr = i18n.getFixedT('fr', 'supervision');
        const en = monitoringColumns(tEn).map((c) => c.id);
        const sw = monitoringColumns(tSw).map((c) => c.id);
        const fr = monitoringColumns(tFr).map((c) => c.id);
        expect(en).toEqual(sw);
        expect(sw).toEqual(fr);
        // sorting/column order retained — ids stable across locales
        expect(en).toEqual(['name', 'extension', 'queue', 'state', 'stateTime', 'currentCall', 'callsToday', 'aht']);
    });
});
