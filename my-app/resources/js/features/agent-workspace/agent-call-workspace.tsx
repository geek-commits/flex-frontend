import { RiArrowUpLine, RiSparklingLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AgentAssistDock } from './agent-assist/agent-assist-dock';
import { useAgentAssistSession } from './agent-assist/agent-assist-session-context';
import { CallManager } from './call-manager/call-manager';
import { useWorkspaceState } from './state/use-workspace-state';

const ASSIST_CALL_STATES = new Set(['connected', 'hold', 'transferring']);

/**
 * Desktop call workspace: Call Manager remains primary while Assist occupies
 * a call-scoped pane beneath it. Mobile keeps the Call Manager's unified
 * Call/Assist surface instead of rendering a second Assist pane.
 */
export function AgentCallWorkspace() {
    const isMobile = useIsMobile();
    const { callState } = useWorkspaceState();
    const assist = useAgentAssistSession();
    const hasAssistCall = ASSIST_CALL_STATES.has(callState);

    if (isMobile || !hasAssistCall) {
        return <CallManager />;
    }

    const isAssistMinimized = assist.isMinimized;

    return (
        <div
            data-agent-call-workspace
            className={
                isAssistMinimized
                    ? 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-card'
                    : 'grid h-full min-h-0 grid-rows-[minmax(0,3fr)_1px_minmax(0,2fr)] overflow-hidden bg-card'
            }
        >
            <section className="min-h-0 overflow-hidden" aria-label="Call Manager">
                <CallManager />
            </section>

            {isAssistMinimized ? (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={assist.restoreAssist}
                    aria-expanded={false}
                    className="h-11 w-full justify-start gap-2 rounded-none border-t border-flex-workspace-divider px-3 text-left text-xs font-semibold"
                >
                    <RiSparklingLine className="size-4 shrink-0 text-primary" aria-hidden />
                    <span>Agent Assist</span>
                    <span className="ml-auto text-muted-foreground">Show</span>
                    <RiArrowUpLine className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Button>
            ) : (
                <>
                    <div className="h-px w-full bg-flex-workspace-divider" aria-hidden />
                    <section className="min-h-0 overflow-hidden" aria-label="Agent Assist">
                        <AgentAssistDock />
                    </section>
                </>
            )}
        </div>
    );
}
