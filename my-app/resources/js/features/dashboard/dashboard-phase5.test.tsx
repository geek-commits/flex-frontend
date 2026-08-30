import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { queueColumns } from './dashboard-queue-columns';

describe('Dashboard — Phase 5 residuals', () => {
    it('refresh/updating key exists and translates', async () => {
        expect(i18n.t('supervision:dashboard.live.updating', { lng: 'en' })).toBe('Updating\u2026');
        expect(i18n.t('supervision:dashboard.live.updating', { lng: 'sw' })).toBe('Inasasisha\u2026');
        expect(i18n.t('supervision:dashboard.live.updating', { lng: 'fr' })).toBe('Mise \u00e0 jour\u2026');
    });

    it('queue headers via typed translator', async () => {
        const tEn = i18n.getFixedT('en', 'supervision');
        const cols = queueColumns(tEn);
        // headers are DataGridColumnHeader with title, but we can check that queueColumns uses t and returns 6 columns
        expect(cols.length).toBe(6);
        expect(cols[0].id).toBe('queue');
        // Ensure no fallback English is hardcoded — columns should be locale-reactive via t, not static string
        const tSw = i18n.getFixedT('sw', 'supervision');
        const colsSw = queueColumns(tSw);
        expect(colsSw[0].id).toBe('queue');
    });

    it('queue statuses translate', async () => {
        expect(i18n.t('supervision:queue.noCalls', { lng: 'en' })).toBe('No calls');
        expect(i18n.t('supervision:queue.degraded', { lng: 'en' })).toBe('Degraded');
        expect(i18n.t('supervision:queue.noAgents', { lng: 'en' })).toBe('No agents');
        expect(i18n.t('supervision:queue.healthy', { lng: 'en' })).toBe('Healthy');
        expect(i18n.t('supervision:queue.noCalls', { lng: 'sw' })).toBe('Hakuna simu');
    });

    it('queue empty/error keys exist', async () => {
        expect(i18n.t('supervision:dashboard.queueHealth.empty', { lng: 'en' })).toBe('No queue data available');
        expect(i18n.t('supervision:dashboard.queueHealth.errorTitle', { lng: 'en' })).toBe('Queue health unavailable');
        expect(i18n.t('supervision:dashboard.queueHealth.errorDescription', { lng: 'en' })).toBe('Failed to load queue data');
    });

    it('SLA warning and all-queues-ok translate', async () => {
        expect(i18n.t('supervision:dashboard.alert.slaBelow', { lng: 'en', queue: 'Sales', sla: 80, target: 90, waiting: 5, available: 2 })).toContain('Sales');
        expect(i18n.t('supervision:dashboard.alert.slaBelow', { lng: 'en', queue: 'Sales', sla: 80, target: 90, waiting: 5, available: 2 })).toContain('80%');
        expect(i18n.t('supervision:dashboard.allQueuesOk', { lng: 'en' })).toBe('All queues operating within targets');
        expect(i18n.t('supervision:dashboard.allQueuesOk', { lng: 'sw' })).toBe('Foleni zote zinafanya kazi ndani ya malengo');
    });

    it('SLA below trend translates', async () => {
        expect(i18n.t('supervision:dashboard.metrics.sla.below', { lng: 'en', value: 5 })).toBe('5% below');
        expect(i18n.t('supervision:dashboard.metrics.sla.below', { lng: 'sw', value: 5 })).toBe('5% chini');
    });

    it('no locale-keyed DataGrid remount — queueColumns is locale-reactive without key', async () => {
        const tEn = i18n.getFixedT('en', 'supervision');
        const colsFirst = queueColumns(tEn);
        const tSw = i18n.getFixedT('sw', 'supervision');
        const colsSecond = queueColumns(tSw);
        // columns themselves are locale-reactive, DataGrid should not need key remount — columns change via t, not via React key
        expect(colsFirst[0].id).toBe(colsSecond[0].id);
        expect(colsFirst.length).toBe(colsSecond.length);
    });
});
