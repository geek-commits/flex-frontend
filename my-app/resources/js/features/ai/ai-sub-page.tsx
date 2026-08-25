import { Head } from '@inertiajs/react';
import React from 'react';
import { AdminShell } from '@/layouts/admin-shell';
import { AI_CONTEXT_GROUPS } from './ai-ia';

export interface AiSubPageProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Shared shell for every AI Center sub-route. Renders the canonical AdminShell
 * with the AI Operations context sidebar and a consistent H1/head.
 */
export function AiSubPage({ title, subtitle, actions, children }: AiSubPageProps) {
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