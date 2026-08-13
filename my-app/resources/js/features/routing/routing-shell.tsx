import { Head } from '@inertiajs/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { AdminShell } from '@/layouts/admin-shell';

const routingContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Telephony & Routing',
        items: [
            { title: 'Queues', href: '/admin/queues', capability: 'console.view' },
            { title: 'IVR', href: '/admin/ivr', capability: 'console.view' },
            { title: 'Time Groups', href: '/admin/time-groups', capability: 'console.view' },
            { title: 'Time Conditions', href: '/admin/time-conditions', capability: 'console.view' },
        ],
    },
    {
        groupTitle: 'Administration',
        items: [
            { title: 'Management Console', href: '/admin/console', capability: 'console.view' },
        ],
    },
];

export interface RoutingShellProps {
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/** Shared canonical shell for the four routing configuration surfaces. */
export function RoutingShell({ title, subtitle, actions, children }: RoutingShellProps) {
    return (
        <AdminShell
            title={title}
            subtitle={subtitle}
            contextTitle="Telephony & Routing"
            contextSubtitle="Queues, IVR, schedules & conditions"
            contextGroups={routingContextGroups}
            actions={actions}
        >
            <Head title={`${title} — Flex Contact Center`} />
            {children}
        </AdminShell>
    );
}
