import { RiPhoneFill, RiArrowDownLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { ActiveCall } from '../state/workspace-types';

export interface IncomingCallSurfaceProps {
    call: ActiveCall | null;
    connecting: boolean;
    onAnswer: () => void;
    onDecline: () => void;
}

/**
 * Incoming call — the highest-priority event (AGENT_WORKSPACE_PLAN §30–§34).
 * Answer is visually primary, large, and duplicate-click safe (the mock
 * ignores repeated answers). Between Answer and Connected the surface shows
 * the Connecting state; talk time is never started before real connection.
 */
export function IncomingCallSurface({ call, connecting, onAnswer, onDecline }: IncomingCallSurfaceProps) {
    if (connecting) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center" role="status">
                <RiArrowDownLine className="size-5 text-status-stale" />
                <p className="text-sm font-semibold text-foreground">Connecting…</p>
                <p className="text-xs text-muted-foreground">{call?.target.label}</p>
            </div>
        );
    }

    return (
        <div
            className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center"
            role="alert"
            aria-label="Incoming call"
        >
            <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{call?.target.label ?? 'Unknown caller'}</p>
                {call?.target.phone && (
                    <p className="font-mono text-xs text-muted-foreground">{call.target.phone}</p>
                )}
                {call?.queueLabel && (
                    <span className="px-1.5 py-px text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mx-auto">
                        {call.queueLabel}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    className="h-11 px-4 gap-2 font-semibold"
                    onClick={onDecline}
                    aria-label="Decline call"
                >
                    <RiArrowDownLine className="size-4" />
                    Decline
                </Button>
                <Button
                    className="h-11 px-5 gap-2 font-semibold"
                    onClick={onAnswer}
                    aria-label="Answer call"
                >
                    <RiPhoneFill className="size-4" />
                    Answer
                </Button>
            </div>
        </div>
    );
}
