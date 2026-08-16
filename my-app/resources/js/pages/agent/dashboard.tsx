import { Head } from '@inertiajs/react';
import React from 'react';
import { AgentDashboardPage } from '@/features/agent-dashboard/agent-dashboard-page';

export default function AgentDashboardIndex() {
    return (
        <>
            <Head title="Agent Dashboard — Flex Contact Center" />
            <AgentDashboardPage />
        </>
    );
}