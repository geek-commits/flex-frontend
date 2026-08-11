import { RiTimeLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

export interface SessionTimerProps {
    /** ISO timestamp of the session start. Absent renders a dash (no fabricated duration). */
    startedAt?: string;
    label?: string;
}

/**
 * Isolated session elapsed timer. Ticks once per second from a real start
 * timestamp; renders `—` when no session start is known (mirrors
 * useStateTimer semantics without driving any state).
 */
export function SessionTimer({ startedAt, label = 'Session' }: SessionTimerProps) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!startedAt) {
            return;
        }

        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    if (!startedAt) {
        return (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold text-muted-foreground bg-card rounded-md border border-border">
                <RiTimeLine className="size-3.5 text-muted-foreground" />
                <span>—</span>
            </span>
        );
    }

    const elapsed = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    return (
        <span
            title={`${label} elapsed`}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold text-foreground bg-card rounded-md border border-border"
        >
            <RiTimeLine className="size-3.5 text-muted-foreground" />
            <span>{formatted}</span>
        </span>
    );
}
