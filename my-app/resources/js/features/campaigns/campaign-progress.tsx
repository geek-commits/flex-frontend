import React from 'react';

export interface CampaignProgressProps {
    completed: number;
    total: number;
}

/**
 * Campaign progress composition — count/total + percentage + bar.
 * Total 0 renders an intentional 0% bar (no NaN), 100% needs no special state.
 */
export function CampaignProgress({ completed, total }: CampaignProgressProps) {
    const safeTotal = total > 0 ? total : 0;
    const pct = safeTotal > 0 ? Math.round((completed / safeTotal) * 100) : 0;

    return (
        <div className="flex flex-col gap-1 min-w-[120px]">
            <div className="flex items-center justify-between text-[10px]">
                <span className="text-flex-text-muted">
                    {completed}/{total}
                </span>
                <span className="font-semibold text-flex-text-primary flex-numeric">{pct}%</span>
            </div>
            <div
                className="h-1.5 rounded-full bg-muted/60 overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% complete`}
            >
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
