import React from 'react';

/** Section header for routing configuration forms. */
export function RoutingFormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="border-b border-border pb-1 text-[11px] font-bold uppercase tracking-wider text-flex-text-muted">
                {title}
            </p>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}
