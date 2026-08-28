import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AgentWorkspacePage } from '@/features/agent-workspace/agent-workspace-page';

export default function AgentWorkspaceIndex() {
    const { t } = useTranslation('agent');

    return (
        <>
            <Head title={t('workspace.headTitle')} />
            <AgentWorkspacePage />
        </>
    );
}
