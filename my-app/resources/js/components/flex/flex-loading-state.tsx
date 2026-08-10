import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface FlexLoadingStateProps {
    rows?: number;
    className?: string;
}

/**
 * Shared FLEX loading state — skeleton block matching a dense data layout.
 * Tables should prefer a column-matched skeleton (see ReUI grid loadingMode),
 * this is the reusable fallback for panels/lists.
 */
export function FlexLoadingState({ rows = 4, className }: FlexLoadingStateProps) {
    return (
        <div className={`flex flex-col gap-3 py-4 ${className ?? ''}`} role="status" aria-label="Loading">
            <Skeleton className="h-4 w-1/4" />
            {Array.from({ length: rows }, (_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
            ))}
        </div>
    );
}
