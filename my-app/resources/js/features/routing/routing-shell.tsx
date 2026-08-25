import { Head } from '@inertiajs/react';
import React from 'react';
import { AdminShell } from '@/layouts/admin-shell';



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
            
            actions={actions}
        >
            <Head title={`${title} — Flex Contact Center`} />
            {children}
        </AdminShell>
    );
}
