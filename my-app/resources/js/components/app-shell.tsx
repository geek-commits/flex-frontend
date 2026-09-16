import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export interface AppShellProps {
    children: React.ReactNode;
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
export function AppShell({ children, fullBleed = false, className }: AppShellProps) {
    return (
        <div
            data-flex-shell
            data-flex-shell-domain="unified"
            data-flex-shell-route="admin"
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
                    <AppHeader />
                    <div
                        id="flex-main-content"
                        data-flex-workspace
                        tabIndex={-1}
                        className={cn(
                            'flex min-w-0 flex-1 flex-col',
                            fullBleed ? 'overflow-hidden' : 'overflow-y-auto',
                            className,
                        )}
                    >
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
