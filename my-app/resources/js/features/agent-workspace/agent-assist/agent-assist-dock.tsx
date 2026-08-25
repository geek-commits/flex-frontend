import { RiCloseLine, RiSubtractLine } from '@remixicon/react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { ThinkingState } from '@/components/vendor/aicss/thinking-state';
import { cn } from '@/lib/utils';
import { AgentAssistStatus } from './agent-assist-status';
import { AgentAssistSuggestions } from './agent-assist-suggestions';
import { AgentAssistTranscript } from './agent-assist-transcript';
import { useAgentAssistSession } from './agent-assist-session-context';

export interface AgentAssistDockProps {
    /** Close/minimize callback — caller may also use session minimize */
    onMinimize?: () => void;
    onClose?: () => void;
}

/**
 * Compact Assist Dock — floating companion, not full-height column.
 * Desktop: fixed 360 preferred (320–400) × 50vh max. Mobile: defers to
 * call manager unified surface (returns null — mobile surface renders there).
 */
export function AgentAssistDock({ onMinimize, onClose }: AgentAssistDockProps) {
    const headingId = useId();
    const session = useAgentAssistSession();
    const { language, transportState, segments, suggestions, isOpen, error } = session;

    if (!isOpen) {
        return null;
    }

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
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                        session.closeAssist();
                        onClose?.();
                    }}
                    aria-label="Close Agent Assist"
                >
                    <RiCloseLine className="size-4" />
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

    // Compact dock — 360 preferred (320–400) · 50vh max · not full-height column
    return (
        <aside
            role="complementary"
            aria-labelledby={headingId}
            className={cn(
                'flex w-[360px] max-h-[50vh] shrink-0 flex-col overflow-hidden border-l border-flex-workspace-divider bg-card',
            )}
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
