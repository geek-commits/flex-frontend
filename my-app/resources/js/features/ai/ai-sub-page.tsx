import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/layouts/admin-shell';

export type AiPageKey =
    | 'ai.overview.title'
    | 'ai.overview.subtitle'
    | 'ai.knowledge.title'
    | 'ai.knowledge.subtitle'
    | 'ai.assist.title'
    | 'ai.assist.subtitle'
    | 'ai.voice.title'
    | 'ai.voice.subtitle'
    | 'ai.usage.title'
    | 'ai.usage.subtitle'
    | 'ai.providers.title'
    | 'ai.providers.subtitle'
    | 'ai.audit.title'
    | 'ai.audit.subtitle'
    | 'ai.settings.title'
    | 'ai.settings.subtitle';

export interface AiSubPageProps {
    title?: string;
    subtitle?: string;
    titleKey?: AiPageKey;
    subtitleKey?: AiPageKey;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Shared shell for every AI Center sub-route. Renders the canonical AdminShell
 * with the AI Operations context sidebar and a consistent H1/head.
 */
export function AiSubPage({ title = '', subtitle, titleKey, subtitleKey, actions, children }: AiSubPageProps) {
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