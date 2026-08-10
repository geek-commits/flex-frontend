import React from 'react';
import { AppTopbar } from '@/components/flex/app-topbar';
import { ContextSidebar  } from '@/components/flex/context-sidebar';
import type {ContextSidebarGroup} from '@/components/flex/context-sidebar';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { PrimaryRail } from '@/components/flex/primary-rail';

export interface AdminShellProps {
    title: string;
    subtitle?: string;
    eyebrow?: React.ReactNode;
    meta?: React.ReactNode;
    contextTitle?: string;
    contextSubtitle?: string;
    contextGroups?: ContextSidebarGroup[];
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Canonical FLEX admin shell: PrimaryRail + optional ContextSidebar + TopBar
 * (global chrome) + in-content FlexPageHeader + FlexPageContent.
 */
export function AdminShell({
    title,
    subtitle,
    eyebrow,
    meta,
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
                <AppTopbar mode="admin" />

                <main className="flex-1 overflow-y-auto min-w-0">
                    <FlexPageContent className="flex flex-col gap-[var(--flex-space-section)]">
                        <FlexPageHeader title={title} description={subtitle} eyebrow={eyebrow} meta={meta} actions={actions} />
                        {children}
                    </FlexPageContent>
                </main>
            </div>
        </div>
    );
}
