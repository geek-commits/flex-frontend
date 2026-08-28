import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FlexGroupHeaderProps {
    label: string;
    count?: number;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    className?: string;
}

/**
 * Plane-pivot group header bar.
 * h-[43px] py-1 px-3.5 bg-flex-workspace-surface-muted border-b border-flex-workspace-divider
 * Label 14/500 muted (section token), count pill, expand affordance.
 * Maps to RESEARCH §4.2 — Backlog/Todo/In Progress bars.
 */
export function FlexGroupHeader({ label, count, icon, actions, collapsible, collapsed, onToggle, className }: FlexGroupHeaderProps) {
    const content = (
        <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="size-3.5 shrink-0 text-flex-text-muted" aria-hidden="true">{icon}</span>}
            <span className="text-sm font-medium leading-[21.56px] text-flex-text-muted truncate">{label}</span>
            {typeof count === 'number' && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-flex-workspace-divider bg-flex-workspace-surface px-1.5 text-xs font-medium text-flex-text-muted">
                    {count}
                </span>
            )}
        </div>
    );

    return (
        <div
            className={cn(
                'flex h-[43px] items-center justify-between gap-3 border-b border-flex-workspace-divider bg-flex-workspace-surface-muted px-3.5 py-1',
                className
            )}
        >
            {collapsible ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={!collapsed}
                    className="flex flex-1 items-center gap-2 text-left flex-focus-visible rounded-md -mx-1 px-1 py-1"
                >
                    <span className={cn('size-3.5 shrink-0 text-flex-text-muted transition-transform duration-flex-default', collapsed && '-rotate-90')} aria-hidden="true">
                        ▸
                    </span>
                    {content}
                </button>
            ) : (
                content
            )}
            {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
        </div>
    );
}
