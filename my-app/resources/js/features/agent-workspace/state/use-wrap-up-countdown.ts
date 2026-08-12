import { useEffect, useState } from 'react';

export interface WrapUpCountdownResult {
    remainingSeconds: number;
    formatted: string;
}

/**
 * Pure countdown math (isolated so store tests can exercise it without React).
 * `now` is injected so the computation is deterministic.
 */
export function wrapUpRemaining(
    startedAt: string | null,
    durationMs: number,
    now: number,
): WrapUpCountdownResult {
    if (!startedAt) {
        return { remainingSeconds: 0, formatted: '00:00' };
    }

    const remainingMs = Math.max(0, durationMs - (now - new Date(startedAt).getTime()));
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const total = Math.floor(remainingSeconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    return { remainingSeconds, formatted };
}

/**
 * Countdown to a Wrap Up deadline (AGENT_WORKSPACE_PLAN §20, §36).
 *
 * Mirrors `useCallTimer`'s isolation pattern: a single 1 Hz interval drives
 * the display only — the hook never mutates workspace state. When the
 * `startedAt` argument is `null` (outside Wrap Up) the interval is unmounted
 * and the result clamps to `00:00`.
 */
export function useWrapUpCountdown(
    startedAt: string | null,
    durationMs: number,
): WrapUpCountdownResult {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!startedAt) {
            return;
        }

        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    return wrapUpRemaining(startedAt, durationMs, now);
}
