/**
 * Synthetic dashboard trend data for the POC.
 *
 * POC MOCK — deterministic. The real backend must provide the reporting
 * contract later.
 */

export interface DailyCallVolume {
    day: string;
    answered: number;
    missed: number;
}

export interface QueueSla {
    queue: string;
    withinSla: number;
}

export const CALL_VOLUME_14D: DailyCallVolume[] = [
    { day: 'Jul 25', answered: 128, missed: 22 },
    { day: 'Jul 26', answered: 142, missed: 18 },
    { day: 'Jul 27', answered: 136, missed: 25 },
    { day: 'Jul 28', answered: 158, missed: 20 },
    { day: 'Jul 29', answered: 151, missed: 29 },
    { day: 'Jul 30', answered: 167, missed: 24 },
    { day: 'Jul 31', answered: 173, missed: 31 },
    { day: 'Aug 1', answered: 164, missed: 27 },
    { day: 'Aug 2', answered: 181, missed: 23 },
    { day: 'Aug 3', answered: 176, missed: 30 },
    { day: 'Aug 4', answered: 192, missed: 26 },
    { day: 'Aug 5', answered: 205, missed: 33 },
    { day: 'Aug 6', answered: 198, missed: 28 },
    { day: 'Aug 7', answered: 214, missed: 31 },
];

export const QUEUE_SLA: QueueSla[] = [
    { queue: 'Customer Support', withinSla: 94.5 },
    { queue: 'Sales & Inquiries', withinSla: 98.0 },
    { queue: 'Technical Escalations', withinSla: 86.2 },
];
