import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexMetricStripProps {
    children: React.ReactNode;
    className?: string;
    layout?: 'flow' | 'grid';
}

/**
 * Shared FLEX metric strip — one quiet surface with internal separators.
 * Replaces N equal-weight standalone cards with a single grouped operational
 * summary (used by Campaigns, and later the Dashboard, AI Center, System).
 */
export function FlexMetricStrip({ children, className = '', layout = 'flow' }: FlexMetricStripProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border bg-card px-4 py-3 min-h-[96px]',
                layout === 'grid' ? 'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5' : 'flex flex-wrap gap-x-8 gap-y-4',
                className,
            )}
        >
            {children}
        </div>
    );
}
