import { RiSubtractLine } from '@remixicon/react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { ThinkingState } from '@/components/vendor/aicss/thinking-state';
import { cn } from '@/lib/utils';
import { useAgentAssistSession } from './agent-assist-session-context';
import { AgentAssistStatus } from './agent-assist-status';
import { AgentAssistSuggestions } from './agent-assist-suggestions';
import { AgentAssistTranscript } from './agent-assist-transcript';

export interface AgentAssistDockProps {
    /** Optional callback for hosts that need to observe minimization. */
    onMinimize?: () => void;
}

/**
 * Call-scoped Assist pane. Desktop hosts place it inside the Agent call
 * workspace; mobile defers to the unified Call Manager surface.
 */
export function AgentAssistDock({ onMinimize }: AgentAssistDockProps) {
    const headingId = useId();
    const session = useAgentAssistSession();
    const { language, transportState, segments, suggestions, error } = session;

    const isStalled = transportState === 'stalled';
    const isOffline = transportState === 'offline' || session.sessionState === 'error';

    const header = (
        <div className={cn('flex items-center justify-between gap-2 border-b border-flex-workspace-divider px-3 py-2.5')}>
            <h2 id={headingId} className="text-sm font-semibold text-flex-text-primary">
                Agent Assist
            </h2>
            <div className="flex items-center gap-2">
                <AgentAssistStatus language={language} transportState={transportState} />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                        session.minimizeAssist();
                        onMinimize?.();
                    }}
                    aria-label="Minimize Agent Assist"
                >
                    <RiSubtractLine className="size-4" />
                </Button>
            </div>
        </div>
    );

    const body = (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {isOffline && error ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
                    <p className="text-sm font-medium text-flex-text-primary">Assist unavailable</p>
                    <p className="text-xs text-flex-text-muted">{error.message}</p>
                    <p className="mt-2 text-xs text-flex-text-tertiary">Call remains fully operational.</p>
                </div>
            ) : (
                <>
                    {isStalled && (
                        <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/30 dark:bg-amber-950/30">
                            <p className="text-xs text-amber-800 dark:text-amber-200">Transcript delayed — still listening…</p>
                        </div>
                    )}
                    <AgentAssistTranscript segments={segments} />
                    <AgentAssistSuggestions suggestions={suggestions} onDismiss={session.dismissSuggestion} />
                </>
            )}
        </div>
    );

    return (
        <aside
            role="complementary"
            aria-labelledby={headingId}
            className={cn('flex h-full min-h-0 w-full flex-col overflow-hidden bg-card')}
        >
            {header}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{body}</div>
        </aside>
    );
}

/**
 * Mobile inline Assist view — rendered inside the unified Call Manager sheet
 * when `mode === 'assist'`. Not a separate Sheet; the parent sheet owns backdrop/focus.
 */
export function AgentAssistMobileView() {
    const session = useAgentAssistSession();
    const { language, transportState, segments, suggestions, error } = session;
    const isOffline = transportState === 'offline' || session.sessionState === 'error';
    const isStalled = transportState === 'stalled';

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-flex-workspace-divider px-4 py-2">
                <span className="text-sm font-semibold">Agent Assist</span>
                <AgentAssistStatus language={language} transportState={transportState} />
            </div>
            {isOffline && error ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
                    <p className="text-sm font-medium">Assist unavailable</p>
                    <p className="text-xs text-flex-text-muted">{error.message}</p>
                </div>
            ) : (
                <>
                    {isStalled && (
                        <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/30 dark:bg-amber-950/30">
                            <ThinkingState label="Transcript delayed" />
                        </div>
                    )}
                    <AgentAssistTranscript segments={segments} />
                    <AgentAssistSuggestions suggestions={suggestions} onDismiss={session.dismissSuggestion} />
                </>
            )}
        </div>
    );
}
