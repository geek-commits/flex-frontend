import { RiPhoneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { WORKSPACE_TIMINGS } from '../state/mock-workspace-state';
import { useWorkspaceState } from '../state/use-workspace-state';
import type { CallTarget } from '../state/workspace-types';
import { ActiveCallSurface } from './active-call-surface';
import { callStateMap } from './call-state-map';
import { IdleCallSurface } from './idle-call-surface';
import { IncomingCallSurface } from './incoming-call-surface';
import { WrapUpSurface } from './wrap-up-surface';

const IN_CALL_STATES = new Set(['dialing', 'connecting', 'connected', 'hold', 'transferring']);

/**
 * State-driven Call Manager (AGENT_WORKSPACE_PLAN §23, §50).
 *
 * The current call state selects the surface and which controls are valid;
 * idle never shows a sea of disabled active-call buttons. All state and
 * transitions come from the canonical workspace owner — the component never
 * schedules fake transitions.
 */
export function CallManager() {
    const ws = useWorkspaceState();
    const [dialNumber, setDialNumber] = useState('');
    const [activeTab, setActiveTab] = useState<'dialer' | 'history'>('dialer');

    const { callState } = ws;
    const stateCfg = callStateMap[callState];
    const inCall = IN_CALL_STATES.has(callState);

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
    } else if (callState === 'connecting' && ws.activeCall?.direction === 'inbound') {
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

    return (
        <div className="flex flex-col h-full bg-card select-none text-xs">
            <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <RiPhoneLine className="size-4 text-primary" />
                    <span>Call Manager</span>
                </div>
                <Badge variant="outline" className={`capitalize font-semibold text-[10px] ${stateCfg.badgeClass}`}>
                    {stateCfg.label}
                </Badge>
            </div>

            <div className="flex-1 flex flex-col min-h-0">{surface}</div>
        </div>
    );
}
