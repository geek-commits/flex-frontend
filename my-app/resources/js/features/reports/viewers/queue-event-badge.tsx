import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { QueueEvent } from '@/features/reports/report-types';

const EVENT_TONE: Record<QueueEvent, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    ENTERQUEUE: 'info',
    CONNECT: 'success',
    ABANDON: 'danger',
    COMPLETECALLER: 'success',
    TRANSFER: 'warning',
};

/** Raw telephony event with a semantic tone — the event name is not beautified. */
export function QueueEventBadge({ event }: { event: QueueEvent }) {
    return (
        <FlexStatus tone={EVENT_TONE[event]} className="font-mono">
            {event}
        </FlexStatus>
    );
}
