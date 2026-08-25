import {
    RiArrowUpLine,
    RiCloseLine,
    RiPhoneLine,
    RiSparklingLine,
} from '@remixicon/react';
import React, { useState, useEffect } from 'react';
import { AgentAssistMobileView } from '../agent-assist/agent-assist-dock';
import { useAgentAssistSessionOptional } from '../agent-assist/agent-assist-session-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CallState } from '@/types/flex';
import { WORKSPACE_TIMINGS } from '../state/mock-workspace-state';
import { useWorkspaceState } from '../state/use-workspace-state';
import type { CallTarget } from '../state/workspace-types';
import { ActiveCallSurface } from './active-call-surface';
import { callStateMap } from './call-state-map';
import { IdleCallSurface } from './idle-call-surface';
import { IncomingCallSurface } from './incoming-call-surface';
import { WrapUpSurface } from './wrap-up-surface';

const IN_CALL_STATES = new Set([
    'dialing',
    'connecting',
    'connected',
    'hold',
    'transferring',
]);

/**
 * State-driven Call Manager (AGENT_WORKSPACE_PLAN §23, §50).
 *
 * The current call state selects the surface and which controls are valid;
 * idle never shows a sea of disabled active-call buttons. All state and
 * transitions come from the canonical workspace owner — the component never
 * schedules fake transitions.
 */
export function CallManager({ onOpenAssist }: { onOpenAssist?: () => void }) {
    const ws = useWorkspaceState();
    const assist = useAgentAssistSessionOptional();
    const [dialNumber, setDialNumber] = useState('');
    const [activeTab, setActiveTab] = useState<'dialer' | 'history'>('dialer');
    const isMobile = useIsMobile();
    const [collapsedCallState, setCollapsedCallState] = useState<CallState | null>('idle');
    const [mobileAssistMode, setMobileAssistMode] = useState(false);

    const { callState } = ws;
    const stateCfg = callStateMap[callState];
    const inCall = IN_CALL_STATES.has(callState);
    const canCollapse = callState === 'idle' || callState === 'wrap-up' || callState === 'ended';

    // A collapse decision belongs only to the state visible when the agent
    // acted. Any later call-state change reopens the sheet automatically.
    const mobileOpen = !isMobile || collapsedCallState !== callState;

    // Reset mobile Assist mode when call ends
    useEffect(() => {
        if (callState === 'idle' || callState === 'ringing') {
            setMobileAssistMode(false);
        }
    }, [callState]);

    const assistLive = !!assist && assist.sessionState !== 'idle' && assist.sessionState !== 'ended';

    const handleDial = (target: CallTarget) => {
        setDialNumber('');
        setActiveTab('dialer');
        ws.dial(target);
    };

    const handleCallFromHistory = (target: CallTarget) => {
        handleDial(target);
    };

    let surface: React.ReactNode;

    if (callState === 'wrap-up') {
        surface = (
            <WrapUpSurface
                startedAt={ws.wrapUpStartedAt}
                durationMs={WORKSPACE_TIMINGS.wrapUpReturnMs}
            />
        );
    } else if (callState === 'ringing') {
        surface = (
            <IncomingCallSurface
                call={ws.activeCall}
                connecting={false}
                onAnswer={ws.answer}
                onDecline={ws.decline}
            />
        );
    } else if (
        callState === 'connecting' &&
        ws.activeCall?.direction === 'inbound'
    ) {
        surface = (
            <IncomingCallSurface
                call={ws.activeCall}
                connecting
                onAnswer={ws.answer}
                onDecline={ws.decline}
            />
        );
    } else if (inCall) {
        surface = (
            <ActiveCallSurface
                call={ws.activeCall}
                callState={callState}
                isMuted={ws.isMuted}
                isOnHold={ws.isOnHold}
                transfer={ws.transfer}
                onToggleMute={ws.toggleMute}
                onToggleHold={ws.toggleHold}
                onTransfer={ws.startTransfer}
                onSelectTransferTarget={ws.selectTransferTarget}
                onConfirmTransfer={ws.completeTransfer}
                onCancelTransfer={ws.cancelTransfer}
                onDismissTransferFailure={ws.dismissTransferFailure}
                onOpenAssist={() => onOpenAssist?.()}
                onEnd={ws.endCall}
            />
        );
    } else {
        surface = (
            <IdleCallSurface
                dialNumber={dialNumber}
                onDialNumberChange={setDialNumber}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                history={ws.history}
                onDial={handleDial}
                onCallFromHistory={handleCallFromHistory}
            />
        );
    }

    if (isMobile) {
        // Unified mobile surface — single Sheet with Call/Assist modes (locked decision §5)
        const showAssistToggle =
            callState === 'connected' || callState === 'hold' || callState === 'transferring';
        const mobileContent = showAssistToggle && mobileAssistMode ? (
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-flex-workspace-surface-muted px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs text-flex-text-muted">
                        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                        Connected
                        {ws.activeCall?.connectedAt && (
                            <span className="ml-1 font-mono text-[11px]">{ws.activeCall.target.label}</span>
                        )}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileAssistMode(false)}
                        className="h-7 text-xs"
                    >
                        Call controls
                    </Button>
                </div>
                <AgentAssistMobileView />
            </div>
        ) : (
            surface
        );

        const handleAssistFromCall = () => {
            if (isMobile && showAssistToggle) {
                setMobileAssistMode(true);
            } else {
                onOpenAssist?.();
            }
        };

        // Patch ActiveCallSurface's onOpenAssist for mobile unified mode
        const patchedSurface =
            inCall && showAssistToggle && !mobileAssistMode
                ? React.cloneElement(surface as React.ReactElement, { onOpenAssist: handleAssistFromCall } as never)
                : mobileContent;

        return (
            <div className="flex min-h-0 flex-1 flex-col">
                {!mobileOpen && (
                    <button
                        type="button"
                        onClick={() => setCollapsedCallState(null)}
                        aria-label={`Call Manager: ${stateCfg.label}. Open call controls`}
                        className="flex h-14 shrink-0 items-center gap-2 border-t border-border bg-card px-3 text-left text-xs select-none"
                    >
                        <RiPhoneLine className="size-4 shrink-0 text-primary" />
                        <span className="shrink-0 font-bold text-foreground">
                            Call Manager
                        </span>
                        <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize ${stateCfg.badgeClass}`}
                        >
                            {stateCfg.label}
                        </span>
                        {ws.activeCall && (
                            <span className="min-w-0 flex-1 truncate font-medium text-muted-foreground">
                                {ws.activeCall.target.label}
                            </span>
                        )}
                        <RiArrowUpLine className="ml-auto size-4 shrink-0 text-muted-foreground" />
                    </button>
                )}

                {mobileOpen && (
                    <>
                        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border p-3 select-none">
                            <div className="flex min-w-0 items-center gap-2 font-bold text-foreground">
                                {showAssistToggle && mobileAssistMode ? (
                                    <>
                                        <RiSparklingLine className="size-4 shrink-0 text-primary" />
                                        <span className="truncate">Agent Assist</span>
                                    </>
                                ) : (
                                    <>
                                        <RiPhoneLine className="size-4 shrink-0 text-primary" />
                                        <span className="truncate">Call Manager</span>
                                    </>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {showAssistToggle && !mobileAssistMode && assistLive && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setMobileAssistMode(true)}
                                        className="h-7 gap-1 text-xs"
                                        aria-label="Open Assist transcript"
                                    >
                                        <RiSparklingLine className="size-3.5" />
                                        Assist
                                    </Button>
                                )}
                                {showAssistToggle && mobileAssistMode && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setMobileAssistMode(false)}
                                        className="h-7 text-xs"
                                    >
                                        Call
                                    </Button>
                                )}
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] font-semibold capitalize ${stateCfg.badgeClass}`}
                                >
                                    {stateCfg.label}
                                </Badge>

                                {canCollapse && (
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label="Collapse Call Manager"
                                        onClick={() => setCollapsedCallState(callState)}
                                    >
                                        <RiCloseLine className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col">{patchedSurface}</div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-card text-xs select-none">
            <div className="flex shrink-0 items-center justify-between border-b border-border p-3">
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <RiPhoneLine className="size-4 text-primary" />
                    <span>Call Manager</span>
                </div>
                <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold capitalize ${stateCfg.badgeClass}`}
                >
                    {stateCfg.label}
                </Badge>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">{surface}</div>
        </div>
    );
}
