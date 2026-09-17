import * as React from 'react';
import { useActiveCallPresentation } from '@/features/agent-workspace/state/use-active-call-presentation';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';

/**
 * Dev-only affordance so the implemented Dynamic Island is demonstrably
 * visible without manual telephony. Hidden in production.
 *
 * - Shows a small floating trigger when no live call exists.
 * - Clicking starts a mock outbound connected call (dial → connecting →
 *   connected) via the canonical workspace owner; the island then appears
 *   on every route except exactly `/agent` (by design — the canonical
 *   CallManager surface).
 * - When a live call is ongoing, shows "End demo call".
 *
 * Not rendered outside `import.meta.env.DEV`.
 */
export function IslandDemoSeeder() {
    if (!import.meta.env.DEV) {
        return null;
    }

    return <IslandDemoSeederInner />;
}

function IslandDemoSeederInner() {
    const liveCall = useActiveCallPresentation();
    const { callState, activeCall, dial, endCall } = useWorkspaceState();
    const [pending, setPending] = React.useState(false);

    const hasLiveCall = !!liveCall;
    const idle = callState === 'idle' && !activeCall;
    const canStart = idle && !pending && !hasLiveCall;

    const handleStart = React.useCallback(() => {
        if (!canStart) {
            return;
        }

        setPending(true);
        dial({
            id: 'demo-customer',
            kind: 'phone',
            label: 'Alex Rivera',
            phone: '+255 700 123 456',
        });
        // establish is async via mock-workspace-state timings; clear pending
        // after outboundConnectingMs so button doesn't double-fire
        window.setTimeout(() => setPending(false), 2000);
    }, [canStart, dial]);

    const handleEnd = React.useCallback(() => {
        endCall();
    }, [endCall]);

    return (
        <div className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            <div
                className={
                    hasLiveCall
                        ? 'pointer-events-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur dark:text-emerald-300'
                        : 'pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur'
                }
            >
                <span className={hasLiveCall ? 'size-1.5 rounded-full bg-emerald-500 animate-pulse' : 'size-1.5 rounded-full bg-muted-foreground'} />
                {hasLiveCall ? 'Island live — leave /agent to see it' : 'No live call — island hidden by design'}
            </div>
            {canStart && (
                <button
                    type="button"
                    onClick={handleStart}
                    className="pointer-events-auto inline-flex h-8 items-center justify-center rounded-full bg-flex-call-island px-4 text-xs font-semibold text-flex-call-island-text shadow-sm transition-[transform,background-color] duration-[var(--flex-duration-fast)] ease-[var(--flex-ease)] hover:bg-flex-call-island/90 active:scale-[0.98]"
                >
                    Demo island — start call
                </button>
            )}
            {pending && !hasLiveCall && (
                <span className="pointer-events-auto inline-flex h-8 items-center rounded-full bg-muted px-4 text-xs font-medium text-muted-foreground">
                    Connecting…
                </span>
            )}
            {hasLiveCall && (
                <button
                    type="button"
                    onClick={handleEnd}
                    className="pointer-events-auto inline-flex h-8 items-center justify-center rounded-full border border-border bg-background px-4 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                >
                    End demo call
                </button>
            )}
        </div>
    );
}
