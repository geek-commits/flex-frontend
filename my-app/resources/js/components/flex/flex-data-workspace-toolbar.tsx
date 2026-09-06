import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexDataWorkspaceToolbarProps {
    /** Scope controls such as quick filters, date ranges, and filters. */
    scope: React.ReactNode;
    /** Search, column visibility, refresh, and contextual actions. */
    actions: React.ReactNode;
    className?: string;
}

/**
 * Canonical DataGrid toolbar layout. Keeps scope controls before table actions,
 * but stacks them in reading order when the available width is constrained.
 */
export function FlexDataWorkspaceToolbar({
    scope,
    actions,
    className,
}: FlexDataWorkspaceToolbarProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 px-3 py-2.5 2xl:flex-row 2xl:items-center 2xl:justify-between',
                className,
            )}
        >
            <div className="flex flex-wrap items-center gap-2">{scope}</div>
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
    );
}
