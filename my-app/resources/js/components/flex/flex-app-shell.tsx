import { usePage } from '@inertiajs/react';
import { RiLayoutRightLine } from '@remixicon/react';
import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { deriveActiveDomain, FLEX_DOMAINS } from '@/auth/nav-domains';
import { AppProviders } from '@/components/flex/app-providers';
import { AppTopbar } from '@/components/flex/app-topbar';
import { PrimaryRail } from '@/components/flex/primary-rail';
import { ShellProvider, useShell } from '@/components/flex/shell-context';

const ContextSidebar = lazy(() =>
    import('@/components/flex/context-sidebar').then((m) => ({ default: m.ContextSidebar })),
);

export interface FlexAppShellProps {
    mode: 'agent' | 'admin';
    children: React.ReactNode;
    /** Custom top bar; defaults to <AppTopbar mode={mode} />. */
    topbar?: React.ReactNode;
    /** Right-anchored panel (Call Manager for Agent). */
    rightPanel?: React.ReactNode;
    /** Companion panel left of rightPanel (Agent Assist). */
    assistPanel?: React.ReactNode;
    mainClassName?: string;
}

function FlexAppShellInner({
    mode,
    children,
    topbar,
    rightPanel,
    assistPanel,
    mainClassName,
}: FlexAppShellProps) {
    const { url } = usePage();
    const { contextSidebarOpen, toggleContextSidebar } = useShell();
    const { t } = useTranslation('navigation');

    const activeDomain = deriveActiveDomain(url);
    const domainConfig = FLEX_DOMAINS.find((domain) => domain.id === activeDomain);
    const hasContext = !!domainConfig;
    const hasSidePanels = !!assistPanel || !!rightPanel;

    return (
        <div
            data-flex-shell
            data-flex-shell-domain={activeDomain ?? 'none'}
            data-flex-shell-route={url}
            className="flex min-h-screen bg-background font-sans text-foreground antialiased"
        >
            {/* Primary Rail — always visible on desktop */}
            <div data-flex-primary-rail>
                <PrimaryRail />
            </div>

            {/* Collapsed context affordance — visible when sidebar exists but is hidden */}
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
                    data-flex-context-sidebar
                    className={`hidden md:flex shrink-0 overflow-hidden transition-[width] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${contextSidebarOpen ? 'w-[248px]' : 'w-0'}`}
                    aria-hidden={!contextSidebarOpen}
                >
                    <div className="w-[248px] shrink-0 h-screen sticky top-0">
                        <Suspense
                            fallback={
                                <aside
                                    className="w-[248px] bg-card border-r border-flex-workspace-divider h-full shrink-0"
                                    aria-hidden="true"
                                />
                            }
                        >
                            <ContextSidebar
                                key={domainConfig.id}
                                title={t(domainConfig.labelKey)}
                                groups={domainConfig.groups.map((g) => ({
                                    groupTitle: g.groupTitleKey ? t(g.groupTitleKey) : g.groupTitle,
                                    items: g.items.map((it) => ({ ...it, title: t(it.titleKey) })),
                                }))}
                            />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Main area — gains width when context collapses, page padding stable */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div data-flex-topbar>{topbar ?? <AppTopbar mode={mode} />}</div>

                {/* Workspace body — optional side panels (Agent Call Manager / Assist) */}
                {hasSidePanels ? (
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                        <main
                            data-flex-workspace
                            className={`min-w-0 flex-1 overflow-y-auto p-4 pb-24 md:p-5 md:pb-5 ${mainClassName ?? ''}`}
                        >
                            {children}
                        </main>
                        {assistPanel}
                        {rightPanel && (
                            <aside
                                data-call-island-zone="call-manager"
                                className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85dvh] flex-col rounded-t-xl border-t bg-card shadow-flex-overlay md:static md:z-auto md:h-full md:max-h-none md:w-80 md:rounded-none md:border-l md:border-t-0 md:shadow-none lg:w-96"
                            >
                                {rightPanel}
                            </aside>
                        )}
                    </div>
                ) : (
                    <main data-flex-workspace className={`flex-1 overflow-y-auto min-w-0 ${mainClassName ?? ''}`}>{children}</main>
                )}
            </div>
        </div>
    );
}

export function FlexAppShell(props: FlexAppShellProps) {
    return (
        <AppProviders>
            <ShellProvider>
                <FlexAppShellInner {...props} />
            </ShellProvider>
        </AppProviders>
    );
}
