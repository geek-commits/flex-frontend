import React from 'react';

export interface FlexMetricStripProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Shared FLEX metric strip — one quiet surface with internal separators.
 * Replaces N equal-weight standalone cards with a single grouped operational
 * summary (used by Campaigns, and later the Dashboard, AI Center, System).
 */
export function FlexMetricStrip({ children, className = '' }: FlexMetricStripProps) {
    return (
        <div
            className={`flex flex-wrap gap-x-8 gap-y-4 rounded-lg border border-border bg-card px-4 py-3 ${className}`}
        >
            {children}
        </div>
    );
}
