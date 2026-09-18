import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexMetricStripProps {
    children: React.ReactNode;
    className?: string;
    /** Number of columns or explicit grid columns override */
    columns?: number;
}

/**
 * Shared FLEX metric strip — one quiet surface with internal separators.
 * Replaces N equal-weight standalone cards with a single grouped operational
 * summary (used by Campaigns, and later the Dashboard, AI Center, System).
 */
export function FlexMetricStrip({
    children,
    className = '',
    columns,
}: FlexMetricStripProps) {
    const items = React.Children.toArray(children).filter(Boolean);
    const count = columns ?? items.length;

    const defaultGridClass =
        count === 7
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'
            : count === 6
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
              : count === 5
                ? 'grid-cols-2 lg:grid-cols-5'
                : count === 4
                  ? 'grid-cols-2 lg:grid-cols-4'
                  : count === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : count === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-1';

    return (
        <div
            className={cn(
                'grid w-full min-w-0 overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-divider gap-px',
                defaultGridClass,
                className,
            )}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        'min-w-0 bg-flex-workspace-surface px-4 py-3',
                        count === 5 && index === 4 && 'col-span-2 lg:col-span-1',
                    )}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}
