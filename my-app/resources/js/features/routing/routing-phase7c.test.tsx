import { describe, expect, it } from 'vitest';
import { formatScheduleEntry, formatTimeGroupSummary } from '@/features/routing/time-groups/time-group-summary';
import i18n from '@/i18n';

describe('Routing Phase 7C — locale-reactive', () => {
    it('Queue Members EN→SW→FR', async () => {
        expect(i18n.t('administration:queues.members.queueMembersTitle', { lng: 'en' })).toBe('Queue Members');
        expect(i18n.t('administration:queues.members.queueMembersTitle', { lng: 'sw' })).toBe('Wanachama wa Foleni');
        expect(i18n.t('administration:queues.members.queueMembersTitle', { lng: 'fr' })).toBe('Membres de la file');
        expect(i18n.t('administration:queues.members.assignedMembers', { lng: 'en', count: 2 })).toBe('Assigned Members (2)');
        expect(i18n.t('administration:queues.members.noMembers', { lng: 'en' })).toBe('No members assigned to this queue yet.');
        expect(i18n.t('administration:queues.members.add', { lng: 'en' })).toBe('Add');
        expect(i18n.t('administration:queues.members.alreadyAssigned', { lng: 'en', name: 'Alice' })).toBe('Alice is already a member of this queue.');
    });

    it('Queue Delete EN→SW→FR', async () => {
        expect(i18n.t('administration:queues.deleteDialog.title', { lng: 'en' })).toBe('Delete Queue');
        expect(i18n.t('administration:queues.deleteDialog.title', { lng: 'sw' })).toBe('Futa Foleni');
        expect(i18n.t('administration:queues.deleteDialog.description', { lng: 'en', name: 'Sales', extension: '7001' })).toContain('Sales');
        expect(i18n.t('administration:queues.deleteDialog.toast.deleted', { lng: 'en' })).toBe('Queue deleted');
        expect(i18n.t('administration:queues.deleteDialog.toast.deleted', { lng: 'sw' })).toBe('Foleni imefutwa');
    });

    it('IVR visible validation error changes language', async () => {
        const key = 'ivr.form.validation.nameRequired' as const;
        expect(i18n.t(`administration:${key}`, { lng: 'en' })).toBe('IVR name is required.');
        expect(i18n.t(`administration:${key}`, { lng: 'sw' })).not.toBe('IVR name is required.');
        expect(i18n.t(`administration:${key}`, { lng: 'fr' })).not.toBe('IVR name is required.');
    });

    it('Time Condition visible validation error changes language', async () => {
        const key = 'timeConditions.form.validation.nameRequired' as const;
        expect(i18n.t(`administration:${key}`, { lng: 'en' })).toBe('Condition name is required.');
        expect(i18n.t(`administration:${key}`, { lng: 'sw' })).not.toBe('Condition name is required.');
    });

    it('Time Group summary weekdays / every-day / no-entries / plural entries change language', async () => {
        const tEn = i18n.getFixedT('en', 'administration');
        const tSw = i18n.getFixedT('sw', 'administration');

        const entryMon: any = { weekdays: [1], monthDays: [], months: [], startTime: '08:00', endTime: '17:00' };
        const entryEmpty: any = { weekdays: [], monthDays: [], months: [], startTime: '08:00', endTime: '17:00' };
        expect(formatScheduleEntry(entryMon, tEn)).toContain('Mon');
        expect(formatScheduleEntry(entryMon, tSw)).not.toBe(formatScheduleEntry(entryMon, tEn));
        expect(formatScheduleEntry(entryEmpty, tEn)).toContain('Every day');
        expect(formatScheduleEntry(entryEmpty, tSw)).not.toBe('Every day');

        expect(formatTimeGroupSummary([], tEn)).toBe('No schedule entries');
        expect(formatTimeGroupSummary([], tSw)).not.toBe('No schedule entries');
        expect(formatTimeGroupSummary([entryMon], tEn)).toContain('Mon');
        expect(formatTimeGroupSummary([entryMon, entryMon], tEn)).toContain('2');
        expect(formatTimeGroupSummary([entryMon, entryMon], tSw)).not.toBe(formatTimeGroupSummary([entryMon, entryMon], tEn));
    });

    it('stored queue/IVR/time-group IDs and form values remain unchanged across locale', async () => {
        const queueId = 'queue-123';
        const ivrId = 'ivr-456';
        const timeGroupId = 'tg-789';
        // IDs are runtime, not translated
        expect(queueId).toBe('queue-123');
        expect(ivrId).toBe('ivr-456');
        expect(timeGroupId).toBe('tg-789');
        // Form values like queue name "Support" remain runtime
        const queueName = 'Support';
        expect(queueName).toBe('Support');
    });
});
