import { Link } from '@inertiajs/react';
import React from 'react';
import type { RoutingDestination } from '@/domain/routing-types';

/**
 * Render a routing destination as a cross-module link when the type maps to a
 * routable surface (Queue, IVR, Time Condition). Non-navigable types render as
 * plain text. Never invents links the runtime does not support.
 */
export function DestinationCrossLink({ destination }: { destination: RoutingDestination }) {
    const value = destination.value;

    let href: string | undefined;

    if (destination.type === 'Queue') {
        href = `/admin/queues`;
    } else if (destination.type === 'IVR') {
        href = `/admin/ivr`;
    } else if (destination.type === 'Recording') {
        href = `/admin/recordings`;
    }

    if (!href || !value) {
        return <span className="text-xs text-flex-text-primary">{value || '—'}</span>;
    }

    return (
        <Link
            href={href}
            className="text-xs text-primary hover:underline"
            title={`View ${destination.type.toLowerCase()} directory`}
        >
            {value}
        </Link>
    );
}
