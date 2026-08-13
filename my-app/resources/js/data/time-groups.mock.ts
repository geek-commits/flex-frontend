import type { TimeGroupRecord } from '@/domain/routing-types';

/**
 * POC MOCK — deterministic Time Group fixtures. Dev-only. Each group may hold
 * multiple schedule entries (hours, weekdays, month days, months).
 */
export const TIME_GROUP_MOCK_RECORDS: TimeGroupRecord[] = [
    {
        id: 'tg1',
        description: 'Business Hours',
        entries: [
            { startTime: '08:00', endTime: '17:00', weekdays: [1, 2, 3, 4, 5], monthDays: [], months: [] },
        ],
    },
    {
        id: 'tg2',
        description: 'Weekend Hours',
        entries: [
            { startTime: '09:00', endTime: '13:00', weekdays: [6, 0], monthDays: [], months: [] },
        ],
    },
    {
        id: 'tg3',
        description: 'Year-End Holidays',
        entries: [
            { startTime: '00:00', endTime: '23:59', weekdays: [], monthDays: [24, 25, 26, 31], months: [12] },
            { startTime: '00:00', endTime: '23:59', weekdays: [], monthDays: [1], months: [1] },
        ],
    },
];
