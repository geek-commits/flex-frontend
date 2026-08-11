import { Head } from '@inertiajs/react';
import React from 'react';
import { AgentWorkspacePage } from '@/features/agent-workspace/agent-workspace-page';

export default function AgentWorkspaceIndex() {
    return (
        <>
            <Head title="Agent Workspace — Flex Contact Center" />
            <AgentWorkspacePage />
        </>
    );
}
