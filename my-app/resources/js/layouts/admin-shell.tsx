import React from 'react';
import { PrimaryRail } from '@/components/flex/primary-rail';
import { ContextSidebar, type ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { AppTopbar } from '@/components/flex/app-topbar';

export interface AdminShellProps {
    title: string;
    subtitle?: string;
    contextTitle?: string;
    contextSubtitle?: string;
    contextGroups?: ContextSidebarGroup[];
    actions?: React.ReactNode;
    children: React.ReactNode;
}

export function AdminShell({
    title,
    subtitle,
    contextTitle,
    contextSubtitle,
    contextGroups,
    actions,
    children,
}: AdminShellProps) {
    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Primary Rail */}
            <PrimaryRail activeWorkspace="admin" />

            {/* Optional Contextual Sidebar */}
            {contextTitle && contextGroups && (
                <ContextSidebar title={contextTitle} subtitle={contextSubtitle} groups={contextGroups} />
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AppTopbar title={title} subtitle={subtitle} mode="admin" actions={actions} />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto min-w-0">{children}</main>
            </div>
        </div>
    );
}
