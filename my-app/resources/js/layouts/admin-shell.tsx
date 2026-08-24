import React, { Suspense, lazy } from 'react';
import { RiLayoutLeftLine, RiLayoutRightLine } from '@remixicon/react';
import { AppProviders } from '@/components/flex/app-providers';
import { AppTopbar } from '@/components/flex/app-topbar';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { Button } from '@/components/ui/button';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { PrimaryRail } from '@/components/flex/primary-rail';
import { ShellProvider, useShell } from '@/components/flex/shell-context';

const ContextSidebar = lazy(() =>
    import('@/components/flex/context-sidebar').then((m) => ({ default: m.ContextSidebar })),
);

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
function AdminShellInner({
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
    const { contextSidebarOpen, toggleContextSidebar } = useShell();
    const hasContext = !!(contextTitle && contextGroups);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Primary Rail — always visible on desktop */}
            <PrimaryRail activeWorkspace="admin" />

            {/* Optional Contextual Sidebar — collapsible focus mode */}
            {hasContext && (
                <div
                    className={`hidden md:flex shrink-0 overflow-hidden transition-[width] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${contextSidebarOpen ? 'w-56' : 'w-0'}`}
                    aria-hidden={!contextSidebarOpen}
                >
                    <div className="w-56 shrink-0 h-screen sticky top-0">
                        <Suspense
                            fallback={
                                <aside
                                    className="w-56 bg-card border-r border-flex-workspace-divider h-full shrink-0"
                                    aria-hidden="true"
                                />
                            }
                        >
                            <ContextSidebar title={contextTitle!} subtitle={contextSubtitle} groups={contextGroups!} />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Main Area — gains width when context collapses, page padding stable */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-2 px-3 py-1 border-b border-flex-workspace-divider bg-flex-workspace-surface">
                    {hasContext && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={contextSidebarOpen ? 'Collapse contextual navigation' : 'Expand contextual navigation'}
                            onClick={toggleContextSidebar}
                            className="shrink-0"
                            title={contextSidebarOpen ? 'Collapse sidebar (focus mode)' : 'Expand sidebar'}
                        >
                            {contextSidebarOpen ? <RiLayoutLeftLine className="size-4" /> : <RiLayoutRightLine className="size-4" />}
                        </Button>
                    )}
                    <span className="text-xs text-flex-text-tertiary truncate">Focus mode keeps rail visible — workspace gains width, filters and scroll preserved</span>
                </div>
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

export function AdminShell(props: AdminShellProps) {
    return (
        <AppProviders>
            <ShellProvider>
                <AdminShellInner {...props} />
            </ShellProvider>
        </AppProviders>
    );
}
