import React, { Suspense, lazy } from 'react';
import { AppTopbar } from '@/components/flex/app-topbar';
import { FlexNavigationTree } from '@/components/flex/flex-navigation-tree';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const NavigationSidebar = lazy(async () => ({ default: FlexNavigationTree }));

export interface FlexAppShellProps {
    mode: 'agent' | 'admin';
    children: React.ReactNode;
    topbar?: React.ReactNode;
    rightPanel?: React.ReactNode;
    assistPanel?: React.ReactNode;
    mainClassName?: string;
    fullBleed?: boolean;
}

export function FlexAppShell({
    mode,
    children,
    topbar,
    rightPanel,
    assistPanel,
    mainClassName,
    fullBleed,
}: FlexAppShellProps) {
    const hasSidePanels = !!assistPanel || !!rightPanel;

    return (
        <SidebarProvider defaultOpen style={{ '--sidebar-width': '15.625rem' } as React.CSSProperties}>
            <div
                data-flex-shell
                data-flex-shell-domain="unified"
                data-flex-shell-route={mode}
                className="flex min-h-screen w-full bg-background font-sans text-foreground antialiased"
            >
                <Sidebar
                    data-flex-primary-rail
                    data-flex-context-sidebar
                    collapsible="offcanvas"
                    variant="sidebar"
                >
                    <Suspense fallback={<div className="h-full w-full bg-sidebar" aria-hidden="true" />}>
                        <NavigationSidebar />
                    </Suspense>
                </Sidebar>

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div data-flex-topbar>{topbar ?? <AppTopbar mode={mode} />}</div>

                    {hasSidePanels ? (
                        <div className="flex min-h-0 flex-1 overflow-hidden">
                            <main
                                data-flex-workspace
                                className={cn(
                                    'min-w-0 flex-1',
                                    fullBleed
                                        ? 'flex flex-col overflow-hidden'
                                        : 'overflow-y-auto p-4 pb-24 md:p-5 md:pb-5',
                                    mainClassName,
                                )}
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
                        <main
                            data-flex-workspace
                            className={cn(
                                'min-w-0 flex-1',
                                fullBleed ? 'flex flex-col overflow-hidden' : 'overflow-y-auto',
                                mainClassName,
                            )}
                        >
                            {children}
                        </main>
                    )}
                </div>
            </div>
        </SidebarProvider>
    );
}
