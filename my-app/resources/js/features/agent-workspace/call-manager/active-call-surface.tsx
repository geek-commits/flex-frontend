import {
    RiPhoneLine,
    RiArrowRightLine,
    RiMicLine,
    RiMicOffLine,
    RiPauseLine,
    RiPlayLine,
} from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCallTimer } from '@/features/dashboard/use-call-timer';
import type { CallState } from '@/types/flex';
import type { ActiveCall, TransferState } from '../state/workspace-types';

export interface ActiveCallSurfaceProps {
    call: ActiveCall | null;
    callState: CallState;
    isMuted: boolean;
    isOnHold: boolean;
    transfer: TransferState | null;
    onToggleMute: () => void;
    onToggleHold: () => void;
    onTransfer: () => void;
    onCancelTransfer: () => void;
    onEnd: () => void;
}

const DURATION_STATES: CallState[] = ['connected', 'hold', 'transferring'];

/**
 * Active call surface (AGENT_WORKSPACE_PLAN §35–§39).
 *
 * Shows who the call is with, the current state, a connected-time timer
 * (isolated to this component — §36), and only the controls valid for the
 * current state. Labels are explicit so agents never memorize a row of
 * ambiguous icons.
 */
export function ActiveCallSurface({
    call,
    callState,
    isMuted,
    isOnHold,
    transfer,
    onToggleMute,
    onToggleHold,
    onTransfer,
    onCancelTransfer,
    onEnd,
}: ActiveCallSurfaceProps) {
    const showTimer = DURATION_STATES.includes(callState) && Boolean(call?.connectedAt);
    const canToggleMedia = callState === 'connected' || callState === 'hold';

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-primary/5 border-b border-border flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">
                            {call?.target.label ?? 'Unknown'}
                        </span>
                        {call?.target.phone && (
                            <span className="font-mono text-xs text-muted-foreground truncate">
                                {call.target.phone}
                            </span>
                        )}
                        {call?.queueLabel && (
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                                Inbound Queue: {call.queueLabel}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                        {callState === 'dialing' && (
                            <span className="font-mono text-xs font-bold text-status-stale">Calling…</span>
                        )}
                        {callState === 'connecting' && (
                            <span className="font-mono text-xs font-bold text-status-stale">Connecting…</span>
                        )}
                        {(callState === 'connected' || callState === 'hold' || callState === 'transferring') &&
                            showTimer && <CallDuration connectedAt={call?.connectedAt} />}
                        {isOnHold && (
                            <span className="text-[10px] font-bold uppercase text-status-notready">
                                On Hold
                            </span>
                        )}
                        {isMuted && (
                            <span className="text-[10px] font-bold uppercase text-status-notready">Muted</span>
                        )}
                    </div>
                </div>
            </div>

            {transfer?.status === 'selecting' && (
                <div className="px-3 py-2 bg-status-stale-bg/40 border-b border-border text-[11px] text-status-stale flex items-center justify-between gap-2">
                    <span className="font-semibold">Transfer in progress</span>
                    <Button variant="ghost" size="xs" onClick={onCancelTransfer}>
                        Cancel Transfer
                    </Button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant={isMuted ? 'secondary' : 'outline'}
                        onClick={onToggleMute}
                        disabled={!canToggleMedia}
                        className="gap-1.5 font-semibold"
                    >
                        {isMuted ? <RiMicOffLine className="size-3.5" /> : <RiMicLine className="size-3.5" />}
                        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </Button>

                    <Button
                        variant={isOnHold ? 'secondary' : 'outline'}
                        onClick={onToggleHold}
                        disabled={!canToggleMedia}
                        className="gap-1.5 font-semibold"
                    >
                        {isOnHold ? <RiPlayLine className="size-3.5" /> : <RiPauseLine className="size-3.5" />}
                        <span>{isOnHold ? 'Resume' : 'Hold'}</span>
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={onTransfer}
                    disabled
                    title="Transfer requires backend support"
                    className="gap-1.5 font-semibold"
                >
                    <RiArrowRightLine className="size-3.5" />
                    <span>Transfer</span>
                </Button>
            </div>

            <div className="p-3 border-t border-border">
                <Button
                    variant="destructive"
                    onClick={onEnd}
                    className="w-full gap-1.5 font-semibold"
                    aria-label="End call"
                >
                    <RiPhoneLine className="size-3.5" />
                    <span>End Call</span>
                </Button>
            </div>
        </div>
    );
}

function CallDuration({ connectedAt }: { connectedAt?: string }) {
    const duration = useCallTimer(connectedAt ?? new Date().toISOString());

    return <span className="font-mono text-xs font-bold text-primary">{duration}</span>;
}
