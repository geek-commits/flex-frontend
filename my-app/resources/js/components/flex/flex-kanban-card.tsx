import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FlexKanbanCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    idSlot?: React.ReactNode;
    title: React.ReactNode;
    meta?: React.ReactNode;
    href?: string;
}

/**
 * Plane-pivot Kanban card — rounded-md border p-3 gap-2, ID 12/500 muted, title 13.
 * No shadow in content area; card separation is border only. Hover lifts via layer hover.
 * For board views that actually need Kanban (e.g. cycles/queues), not generic work-item state.
 */
export function FlexKanbanCard({ idSlot, title, meta, href, className, children, ...props }: FlexKanbanCardProps) {
    const content = (
        <>
            {idSlot && <div className="text-xs font-medium leading-none text-flex-text-muted truncate">{idSlot}</div>}
            <div className="text-[13px] font-normal leading-[19.5px] text-flex-text-primary line-clamp-2">{title}</div>
            {meta && <div className="flex flex-wrap items-center gap-1.5 pt-1">{meta}</div>}
            {children}
        </>
    );

    const baseClass = cn(
        'flex flex-col gap-2 rounded-md border border-flex-workspace-divider bg-flex-workspace-surface p-3 transition-colors hover:bg-flex-layer-hover',
        href && 'cursor-pointer flex-focus-visible',
        className
    );

    if (href) {
        return (
            <a href={href} className={baseClass} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </a>
        );
    }

    return (
        <div className={baseClass} {...props}>
            {content}
        </div>
    );
}

export function FlexKanbanColumn({ title, count, children, className, action }: { title: string; count?: number; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
    return (
        <div className={cn('flex w-[280px] shrink-0 flex-col gap-3', className)}>
            <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-flex-text-muted truncate">{title}</span>
                    {typeof count === 'number' && <span className="text-xs text-flex-text-muted">{count}</span>}
                </div>
                {action}
            </div>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}
