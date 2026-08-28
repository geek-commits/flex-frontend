import { lazy, Suspense, type ReactNode } from 'react';

// Workspace-only providers (tooltip, global search, toaster, active-call
// island) are code-split and mounted only inside the workspace shells, so a
// public/auth page never downloads them.
//
// Ownership: AppProviders is mounted via WorkspaceProvidersLayout (app.tsx route families for admin/agent/settings)
// and via AppSidebarLayout/AppHeaderLayout (app-layout.tsx default). Settings routes compose
// [WorkspaceProvidersLayout, AppLayout, SettingsLayout] so two AppProviders instances can nest — not deduplicated
// at baseline but harmless (no singleton state duplicated). No refactor without evidence; single-owner rule is logical, not instance-counted.
//
// Suspense fallback is null: during cold load the lazy Tooltip/GlobalSearch/Toaster chunks suspend and children
// (including FlexCallIsland) are hidden until resolved. This may blank the workspace briefly on slow networks;
// visible in dev as a flash of missing tooltip/toaster. Intentionally not refactored without cold-load evidence —
// alternative would be a non-null fallback or eager import, deferred to perf follow-up.
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
import { FlexCallIsland } from '@/components/flex/flex-call-island';

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