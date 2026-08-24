import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexWorkbenchShellProps {
    /** Surface variant — primary is the page-level continuous workbench (rounded-none border-0), contained is for embedded secondary contexts. */
    variant?: 'primary' | 'contained';
    /** Optional toolbar/header slot rendered above the content with a bottom divider. */
    toolbar?: React.ReactNode;
    /** Main workspace content (panes, lists, tables, detail). */
    children: React.ReactNode;
    className?: string;
}

/**
 * Canonical FLEX workbench shell — a single bounded white work surface that
 * owns the outer border, radius, and clipping. Internal panes stay flat.
 *
 * Neutral canvas → white work surface → 1px structural dividers. The shell must
 * not own domain data or realtime behavior; it is a pure layout frame.
 */
export function FlexWorkbenchShell({ toolbar, children, className = '', variant = 'contained' }: FlexWorkbenchShellProps) {
    const isPrimary = variant === 'primary';

    return (
        <div
            className={cn(
                isPrimary
                    ? 'flex flex-col overflow-hidden rounded-none border-0 bg-flex-workspace-surface shadow-none'
                    : 'flex flex-col overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface',
                className
            )}
        >
            {toolbar && (
                <div className="shrink-0 border-b border-flex-workspace-divider bg-flex-workspace-surface-muted">
                    {toolbar}
                </div>
            )}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </div>
    );
}