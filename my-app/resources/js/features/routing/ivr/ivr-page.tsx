import React from 'react';
import { RoutingShell } from '@/features/routing/routing-shell';

export function IVRPage() {
    return (
        <RoutingShell title="IVR" subtitle="Configure interactive voice response menus.">
            <p className="text-xs text-flex-text-muted">IVR directory — coming next.</p>
        </RoutingShell>
    );
}
