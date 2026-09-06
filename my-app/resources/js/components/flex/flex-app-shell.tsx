import React from 'react';
import { AppTopbar } from '@/components/flex/app-topbar';
import { ContextSidebar } from '@/components/flex/context-sidebar';
import { PrimaryRail } from '@/components/flex/primary-rail';
import { ShellProvider } from '@/components/flex/shell-context';
import { cn } from '@/lib/utils';

export interface FlexAppShellProps {
    mode: 'agent' | 'admin';
    children: React.ReactNode;
    /** Agent-specific controls inserted into the shared global header. */
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
    const hasSidePanels = Boolean(assistPanel || rightPanel);

    return (
        <ShellProvider>
            <div
                data-flex-shell
                data-flex-shell-domain="unified"
                data-flex-shell-route={mode}
                className="flex min-h-dvh w-full flex-col overflow-hidden bg-flex-workspace-canvas font-sans text-foreground antialiased"
            >
                <a
                    href="#flex-main-content"
                    className="sr-only z-50 rounded-md bg-flex-workspace-surface px-3 py-2 text-sm font-semibold text-flex-text-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
                >
                    Skip to content
                </a>

                <AppTopbar mode={mode} operationalControls={topbar} />

                <div className="flex min-h-0 flex-1 overflow-hidden">
                    <PrimaryRail />
                    <ContextSidebar />

                    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                        {hasSidePanels ? (
                            <div className="flex min-h-0 flex-1 overflow-hidden">
                                <main
                                    id="flex-main-content"
                                    data-flex-workspace
                                    tabIndex={-1}
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
                                        className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85dvh] flex-col rounded-t-xl border-t bg-card shadow-flex-overlay md:static md:z-auto md:h-full md:max-h-none md:w-80 md:rounded-none md:border-t-0 md:border-l md:shadow-none lg:w-96"
                                    >
                                        {rightPanel}
                                    </aside>
                                )}
                            </div>
                        ) : (
                            <main
                                id="flex-main-content"
                                data-flex-workspace
                                tabIndex={-1}
                                className={cn(
                                    'min-w-0 flex-1',
                                    fullBleed
                                        ? 'overflow-hidden'
                                        : 'overflow-y-auto',
                                    mainClassName,
                                )}
                            >
                                {children}
                            </main>
                        )}
                    </div>
                </div>
            </div>
        </ShellProvider>
    );
}
