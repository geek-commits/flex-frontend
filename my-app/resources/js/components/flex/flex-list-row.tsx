import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FlexListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Optional href — when provided, row renders as an anchor for keyboard/right-click affordance. */
    href?: string;
    /** Fixed-width ID/meta on the left (e.g. GEEKM-3), 12/500 muted. */
    idSlot?: React.ReactNode;
    /** Primary title, 13/400. */
    title: React.ReactNode;
    /** Right-side pills/meta (status, priority, assignee, overflow). */
    meta?: React.ReactNode;
    /** Hover reveal: hide meta until hover/focus-within (Plane hover-reveal). */
    hoverRevealMeta?: boolean;
}

/**
 * Plane-pivot list row — min-h-11 py-3 px-[var(--flex-space-list-x)] border-b hairline.
 * Hover: bg-flex-layer-hover. No shadow, no row tint — single border-b-subtle does separation.
 * Use to normalize CDR/Campaigns/supervision table rows to Plane metrics when appropriate;
 * DataGrid remains authoritative for virtualized/sorted tables — this is for grouped list surfaces.
 */
export function FlexListRow({ href, idSlot, title, meta, hoverRevealMeta, className, children, ...props }: FlexListRowProps) {
    const inner = (
        <>
            <div className="flex min-w-0 items-center gap-3 flex-1">
                {idSlot && <span className="shrink-0 text-xs font-medium leading-none text-flex-text-muted w-14 truncate">{idSlot}</span>}
                <span className="min-w-0 flex-1 truncate text-[13px] font-normal leading-[19.5px] text-flex-text-primary">{title}</span>
            </div>
            {meta && (
                <div
                    className={cn(
                        'flex shrink-0 items-center gap-1.5',
                        hoverRevealMeta && 'opacity-0 group-hover/list-row:opacity-100 group-focus-within/list-row:opacity-100 transition-opacity duration-flex-fast'
                    )}
                >
                    {meta}
                </div>
            )}
            {children}
        </>
    );

    const baseClass = cn(
        'group/list-row flex min-h-11 items-center gap-3 border-b border-flex-workspace-divider bg-transparent px-[var(--flex-space-list-x)] py-3 text-[13px] transition-colors hover:bg-flex-layer-hover',
        className
    );

    if (href) {
        return (
            <a href={href} className={cn(baseClass, 'focus-visible:outline-none flex-focus-visible')} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {inner}
            </a>
        );
    }

    return (
        <div className={baseClass} {...props}>
            {inner}
        </div>
    );
}
