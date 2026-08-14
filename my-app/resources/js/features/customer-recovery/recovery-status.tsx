import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { RecoveryStatus } from '@/features/customer-recovery/recovery-types';

const STATUS_META: Record<RecoveryStatus, { label: string; tone: 'danger' | 'warning' | 'success' | 'info' | 'neutral' }> = {
    unhandled: { label: 'Unhandled', tone: 'danger' },
    'callback-scheduled': { label: 'Callback Scheduled', tone: 'warning' },
    resolved: { label: 'Resolved', tone: 'success' },
};

/** Recovery status badge (readable without color). */
export function RecoveryStatus({ status }: { status: RecoveryStatus }) {
    const meta = STATUS_META[status];

    return (
        <FlexStatus tone={meta.tone} className="capitalize">
            {meta.label}
        </FlexStatus>
    );
}
