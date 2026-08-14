import React from 'react';
import type { AttemptRecord } from '@/features/customer-recovery/recovery-types';

/**
 * Attempt history — a dense timeline of call attempts with their outcomes.
 * Only rendered when real history exists; never invented.
 */
export function AttemptHistory({ attempts }: { attempts: AttemptRecord[] }) {
    if (attempts.length === 0) {
        return <p className="text-xs text-flex-text-muted">No attempts yet.</p>;
    }

    return (
        <div className="flex flex-col gap-1.5">
            {attempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                    <span className="text-xs tabular-nums text-flex-text-muted">{attempt.time}</span>
                    <span className="text-xs text-flex-text-primary">{attempt.agent}</span>
                    <span className="text-xs text-flex-text-muted">{attempt.outcome}</span>
                </div>
            ))}
        </div>
    );
}
