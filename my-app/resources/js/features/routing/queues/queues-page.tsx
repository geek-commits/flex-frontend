import React from 'react';
import { RoutingShell } from '@/features/routing/routing-shell';

export function QueuesPage() {
    return (
        <RoutingShell title="Queues" subtitle="Configure call distribution and queue members.">
            <p className="text-xs text-flex-text-muted">Queue directory — coming next.</p>
        </RoutingShell>
    );
}
