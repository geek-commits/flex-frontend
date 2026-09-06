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
export function FlexMetricStrip({
    children,
    className = '',
}: FlexMetricStripProps) {
    const items = React.Children.toArray(children);

    return (
        <div
            className={`flex flex-wrap overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface ${className}`}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`min-w-36 flex-1 px-4 py-3 ${index > 0 ? 'border-l border-flex-workspace-divider' : ''}`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}
