import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export interface AppShellProps {
    children: React.ReactNode;
    /** Workspace route marker (mirrors FlexAppShell mode). */
    mode?: 'admin' | 'agent';
    /** Agent-specific live controls rendered inside the shared global header. */
    operationalControls?: React.ReactNode;
    /** Agent-specific panel docked beside the workspace (e.g. Call Manager). */
    rightPanel?: React.ReactNode;
    /** Optional companion panel, rendered left of the right panel. */
    assistPanel?: React.ReactNode;
    /** Full-bleed pages (data workspaces) opt out of the inset padding/scroll. */
    fullBleed?: boolean;
    className?: string;
}

/**
 * App shell root (adapted from @efferd/app-shell-3): inset
 * icon-collapsible sidebar + sticky header + scrollable content column.
 * Frame only — page chrome (FlexPageContent/FlexPageHeader/Workbench)
 * renders inside. Outer background is the FLEX workspace canvas so the
 * inset reads as the work surface; no new tokens introduced.
 */
export function AppShell({
    children,
    mode = 'admin',
    operationalControls,
    rightPanel,
    assistPanel,
    fullBleed = false,
    className,
}: AppShellProps) {
    const hasSidePanels = Boolean(assistPanel || rightPanel);

    return (
        <div
            data-flex-shell
            data-flex-shell-domain="unified"
            data-flex-shell-route={mode}
            className="overflow-hidden bg-flex-workspace-canvas font-sans text-foreground antialiased"
        >
            <a
                href="#flex-main-content"
                className="sr-only z-50 rounded-md bg-flex-workspace-surface px-3 py-2 text-sm font-semibold text-flex-text-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                Skip to content
            </a>
            <SidebarProvider className="relative h-svh bg-flex-workspace-canvas has-data-[variant=inset]:bg-flex-workspace-canvas">
                <AppSidebar />
                <SidebarInset className="bg-flex-workspace-canvas md:peer-data-[variant=inset]:ml-0">
                    <AppHeader operationalControls={operationalControls} />
                    {hasSidePanels ? (
                        <div className="flex min-h-0 flex-1 overflow-hidden">
                            <div
                                id="flex-main-content"
                                data-flex-workspace
                                tabIndex={-1}
                                className={cn(
                                    'flex min-w-0 flex-1 flex-col',
                                    fullBleed
                                        ? 'overflow-hidden'
                                        : 'overflow-y-auto',
                                    className,
                                )}
                            >
                                {children}
                            </div>
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
                        <div
                            id="flex-main-content"
                            data-flex-workspace
                            tabIndex={-1}
                            className={cn(
                                'flex min-w-0 flex-1 flex-col',
                                fullBleed
                                    ? 'overflow-hidden'
                                    : 'overflow-y-auto',
                                className,
                            )}
                        >
                            {children}
                        </div>
                    )}
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
