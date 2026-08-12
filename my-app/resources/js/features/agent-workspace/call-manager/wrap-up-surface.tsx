import { RiEditLine } from '@remixicon/react';
import React from 'react';
import { useWrapUpCountdown } from '../state/use-wrap-up-countdown';

export interface WrapUpSurfaceProps {
    /** ISO timestamp Wrap Up began; `null` renders without a timer. */
    startedAt: string | null;
    /** Supervisor-set wrap-up duration (mock owner's authoritative value). */
    durationMs: number;
}

/**
 * Wrap Up — a deliberate first-class post-call mode (AGENT_WORKSPACE_PLAN §20).
 *
 * CRM work stays primary while the supervisor-set wrap-up timer runs; the mock
 * owner returns the agent to Ready automatically when it expires. The countdown
 * is display-only, derived from the authoritative start timestamp and duration
 * (no fabricated values, no duplicate timers).
 */
export function WrapUpSurface({ startedAt, durationMs }: WrapUpSurfaceProps) {
    const { formatted } = useWrapUpCountdown(startedAt, durationMs);

    return (
        <div
            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center"
            role="status"
            aria-label="Wrap up"
        >
            <RiEditLine className="size-5 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Wrap Up</p>
            <p className="text-xs text-muted-foreground max-w-[220px]">
                Complete customer notes before returning to Ready. The CRM stays available for your
                follow-up work.
            </p>
            <span className="text-[10px] text-muted-foreground/70">
                {startedAt ? (
                    <>
                        <span className="font-mono">{formatted}</span> remaining · returning to Ready
                        automatically
                    </>
                ) : (
                    'Returning to Ready automatically'
                )}
            </span>
        </div>
    );
}