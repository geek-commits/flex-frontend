import { RiLayoutRightLine } from '@remixicon/react';
import React, { Suspense, lazy } from 'react';
import { usePage } from '@inertiajs/react';
import { AppProviders } from '@/components/flex/app-providers';
import { AppTopbar } from '@/components/flex/app-topbar';
import { deriveActiveDomain, FLEX_DOMAINS } from '@/auth/nav-domains';
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
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Canonical FLEX admin shell: PrimaryRail + domain-driven ContextSidebar +
 * TopBar (global chrome) + in-content FlexPageHeader + FlexPageContent.
 *
 * The contextual sidebar derives its routes from the active major domain
 * (`auth/nav-domains.ts`) — pages do not redefine domain navigation.
 */
function AdminShellInner({
    title,
    subtitle,
    eyebrow,
    meta,
    actions,
    children,
}: AdminShellProps) {
    const { url } = usePage();
    const { contextSidebarOpen, toggleContextSidebar } = useShell();

    const activeDomain = deriveActiveDomain(url);
    const domainConfig = FLEX_DOMAINS.find((domain) => domain.id === activeDomain);
    const hasContext = !!domainConfig;

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Primary Rail — always visible on desktop */}
            <PrimaryRail activeWorkspace="admin" />

            {/* Contextual Sidebar boundary — collapse affordance lives in the sidebar header */}
            {hasContext && !contextSidebarOpen && (
                <div className="hidden md:flex w-9 shrink-0 h-screen sticky top-0 flex-col items-center pt-3 border-r border-flex-workspace-divider bg-flex-workspace-surface">
                    <button
                        type="button"
                        onClick={toggleContextSidebar}
                        aria-label="Show sidebar"
                        title="Show sidebar"
                        className="flex size-7 items-center justify-center rounded-md bg-transparent text-flex-text-tertiary transition-colors duration-[var(--flex-duration-fast)] hover:bg-flex-layer-hover hover:text-flex-text-primary flex-focus-visible"
                    >
                        <RiLayoutRightLine className="size-4" />
                    </button>
                </div>
            )}

            {/* Domain-driven Contextual Sidebar — collapsible focus mode */}
            {hasContext && domainConfig && (
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
                            <ContextSidebar
                                key={domainConfig.id}
                                title={domainConfig.label}
                                groups={domainConfig.groups}
                            />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Main Area — gains width when context collapses, page padding stable */}
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

export function AdminShell(props: AdminShellProps) {
    return (
        <AppProviders>
            <ShellProvider>
                <AdminShellInner {...props} />
            </ShellProvider>
        </AppProviders>
    );
}
