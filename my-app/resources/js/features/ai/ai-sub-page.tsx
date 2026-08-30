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
    const resolvedTitle = titleKey ? t(titleKey) : title;
    const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;
    return (
        <AdminShell title={resolvedTitle} subtitle={resolvedSubtitle} actions={actions}>
            <Head title={`${resolvedTitle} — Flex Contact Center`} />
            {children}
        </AdminShell>
    );
}