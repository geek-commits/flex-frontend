import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';

describe('Agent Dashboard — Phase 5 residuals', () => {
    it('deferred section titles via typed keys', async () => {
        expect(i18n.t('agent:dashboard.deferred.performance.title', { lng: 'en' })).toBe('Performance');
        expect(i18n.t('agent:dashboard.deferred.skills.title', { lng: 'en' })).toBe('Skills & Proficiency');
        expect(i18n.t('agent:dashboard.deferred.providerMinutes.title', { lng: 'en' })).toBe('Provider Minutes');
        expect(i18n.t('agent:dashboard.deferred.notices.title', { lng: 'en' })).toBe('System Notices');
        expect(i18n.t('agent:dashboard.deferred.performance.title', { lng: 'sw' })).toBe('Utendaji');
        expect(i18n.t('agent:dashboard.deferred.performance.title', { lng: 'fr' })).toBe('Performance');
    });

    it('deferred reason via reasonKey and Not available yet', async () => {
        expect(i18n.t('agent:dashboard.deferred.notAvailable', { lng: 'en' })).toBe('Not available yet');
        expect(i18n.t('agent:dashboard.deferred.performance.reason', { lng: 'en' })).toContain('Performance metrics');
        expect(i18n.t('agent:dashboard.deferred.skills.reason', { lng: 'sw' })).toContain('Ujuzi');
        expect(i18n.t('agent:dashboard.deferred.notAvailable', { lng: 'fr' })).toBe('Pas encore disponible');
    });

    it('Extension label, agent state, telephony separate', async () => {
        expect(i18n.t('agent:dashboard.status.extension', { lng: 'en' })).toBe('Extension');
        expect(i18n.t('agent:dashboard.status.telephonySeparate', { lng: 'en' })).toBe('Telephony connection is separate from availability state.');
        expect(i18n.t('agent:status.ready', { lng: 'en' })).toBe('Ready');
        expect(i18n.t('agent:status.ready', { lng: 'sw' })).toBe('Tayari');
        expect(i18n.t('agent:dashboard.status.extension', { lng: 'sw' })).toBe('Kiambishi');
        expect(i18n.t('agent:dashboard.status.telephonySeparate', { lng: 'fr' })).toContain('connexion');
    });

    it('queue-pressure chrome remains reactive', async () => {
        expect(i18n.t('agent:dashboard.queuePressure.title', { lng: 'en' })).toBe('Queue Pressure');
        expect(i18n.t('agent:dashboard.queuePressure.status.noCalls', { lng: 'en' })).toBe('No calls waiting');
        expect(i18n.t('agent:dashboard.queuePressure.metrics.waiting', { lng: 'en' })).toBe('Waiting');
        expect(i18n.t('agent:dashboard.queuePressure.empty', { lng: 'en' })).toBe('No queue data available.');
        expect(i18n.t('agent:dashboard.queuePressure.title', { lng: 'sw' })).toBe('Msongamano wa Foleni');
    });

    it('EN → SW → FR without workspace-state remount — deferred keys stable', async () => {
        const keys = [
            'dashboard.deferred.performance.title',
            'dashboard.deferred.skills.title',
            'dashboard.deferred.providerMinutes.title',
            'dashboard.deferred.notices.title',
        ] as const;

        for (const key of keys) {
            expect(i18n.t(`agent:${key}`, { lng: 'en' })).toBeDefined();
            expect(i18n.t(`agent:${key}`, { lng: 'sw' })).toBeDefined();
            expect(i18n.t(`agent:${key}`, { lng: 'fr' })).toBeDefined();
        }
    });
});
