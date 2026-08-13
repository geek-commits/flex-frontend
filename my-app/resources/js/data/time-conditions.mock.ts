import type { TimeConditionRecord } from '@/domain/routing-types';

/**
 * POC MOCK — deterministic Time Condition fixtures. Dev-only. Each condition
 * references a Time Group and defines match/no-match routing destinations.
 */
export const TIME_CONDITION_MOCK_RECORDS: TimeConditionRecord[] = [
    {
        id: 'tc1',
        name: 'Business Hours Routing',
        timeGroupId: 'tg1',
        matchDestination: { type: 'Queue', value: 'Customer Support' },
        noMatchDestination: { type: 'IVR', value: 'After Hours' },
        status: 'active',
    },
    {
        id: 'tc2',
        name: 'Weekend Routing',
        timeGroupId: 'tg2',
        matchDestination: { type: 'Queue', value: 'Sales & Inquiries' },
        noMatchDestination: { type: 'IVR', value: 'After Hours' },
        status: 'active',
    },
    {
        id: 'tc3',
        name: 'Holiday Routing',
        timeGroupId: 'tg3',
        matchDestination: { type: 'Recording', value: 'holiday-greeting' },
        noMatchDestination: { type: 'Queue', value: 'Customer Support' },
        status: 'inactive',
    },
];
