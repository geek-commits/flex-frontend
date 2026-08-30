import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/layouts/admin-shell';

export interface AiSubPageProps {
    title: string;
    subtitle?: string;
    titleKey?: string;
    subtitleKey?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Shared shell for every AI Center sub-route. Renders the canonical AdminShell
 * with the AI Operations context sidebar and a consistent H1/head.
 */
export function AiSubPage({ title, subtitle, titleKey, subtitleKey, actions, children }: AiSubPageProps) {
    const { t } = useTranslation('administration');
    // @ts-expect-error — pending Batch 10-11 typed union
    const resolvedTitle = titleKey ? t(titleKey) : title;
    // @ts-expect-error — pending Batch 10-11 typed union
    const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;
    return (
        // @ts-expect-error — pending Batch 10-11 typed union
        <AdminShell title={resolvedTitle} subtitle={resolvedSubtitle} actions={actions}>
            <Head title={`${resolvedTitle} — Flex Contact Center`} />
            {children}
        </AdminShell>
    );
}