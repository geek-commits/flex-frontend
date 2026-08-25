import { lazy, Suspense, type ReactNode } from 'react';

// Workspace-only providers (tooltip, global search, toaster, active-call
// island) are code-split and mounted only inside the workspace shells, so a
// public/auth page never downloads them.
const TooltipProvider = lazy(() =>
    import('@/components/ui/tooltip').then((m) => ({ default: m.TooltipProvider }))
);
const GlobalSearchProvider = lazy(() =>
    import('@/components/flex/global-search').then((m) => ({ default: m.GlobalSearchProvider }))
);
const Toaster = lazy(() =>
    import('@/components/ui/sonner').then((m) => ({ default: m.Toaster }))
);
import { AgentAssistSessionProvider } from '@/features/agent-workspace/agent-assist/agent-assist-session-context';

const FlexCallIsland = lazy(() =>
    import('@/components/flex/flex-call-island').then((m) => ({ default: m.FlexCallIsland }))
);

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={null}>
            <TooltipProvider delay={0}>
                <AgentAssistSessionProvider>
                    <GlobalSearchProvider>{children}</GlobalSearchProvider>
                    <Toaster />
                    <FlexCallIsland />
                </AgentAssistSessionProvider>
            </TooltipProvider>
        </Suspense>
    );
}