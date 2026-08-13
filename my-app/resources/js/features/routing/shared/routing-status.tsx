import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';

/** Status badge for routing config records (queue/IVR/condition). */
export function RoutingStatusBadge({ status }: { status: 'active' | 'inactive' }) {
    return (
        <FlexStatus tone={status === 'active' ? 'success' : 'neutral'} className="capitalize">
            {status}
        </FlexStatus>
    );
}
