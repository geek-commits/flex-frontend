import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AgentDashboardPage } from '@/features/agent-dashboard/agent-dashboard-page';

export default function AgentDashboardIndex() {
    const { t } = useTranslation('agent');

    return (
        <>
            <Head title={t('dashboard.headTitle')} />
            <AgentDashboardPage />
        </>
    );
}